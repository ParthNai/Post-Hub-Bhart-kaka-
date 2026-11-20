import test from "node:test";
import assert from "node:assert/strict";
import {
  getQueuePriorityDataset,
  changeRequestPriority,
  cancelQueuedRequest,
  toggleRequestPause,
  rescheduleQueuedRequest,
  updateSchedulingSettings,
  updatePriorityConfiguration,
  queryQueuePriorityItems,
  recalculateQueueMetrics,
  reindexQueuePositions,
  resetQueuePriorityData,
} from "../lib/ai-queue-priority-storage.ts";
import {
  compareQueueItemsForScheduling,
  PRIORITY_RANK,
} from "../lib/ai-queue-priority.ts";

test("Screen 30 — AI Generation Queue Priority & Scheduling Test Suite", async (t) => {
  // Always reset to canonical seed before test run
  resetQueuePriorityData();

  await t.test("1. Initializes canonical queue summary metrics matching Screen 30 specifications", () => {
    const data = getQueuePriorityDataset();

    assert.equal(data.summary.totalQueuedRequests, 128);
    assert.equal(data.summary.currentlyProcessing, 12);
    assert.equal(data.summary.scheduledRequests, 34);
    assert.equal(data.summary.failedBlockedRequests, 5);

    assert.equal(data.monitor.queueName, "Main Generation Queue");
    assert.equal(data.monitor.currentPosition, "#1 – 50");
    assert.equal(data.monitor.requestCount, 128);
    assert.equal(data.monitor.status, "Active");
    assert.equal(data.monitor.priorityLevel, "Normal");
  });

  await t.test("2. Verifies canonical top request queue items matching reference table", () => {
    const data = getQueuePriorityDataset();
    const top5 = data.items.slice(0, 5);

    // Row 1: REQ-4587
    assert.equal(top5[0].id, "REQ-4587");
    assert.equal(top5[0].userId, "user_2847");
    assert.equal(top5[0].generationType, "Image");
    assert.equal(top5[0].providerModelFormatted, "OpenAI / GPT-4o");
    assert.equal(top5[0].priority, "Critical");
    assert.equal(top5[0].status, "Processing");
    assert.equal(top5[0].relatedJobId, "JOB-7845");

    // Row 2: REQ-4586
    assert.equal(top5[1].id, "REQ-4586");
    assert.equal(top5[1].userId, "user_1293");
    assert.equal(top5[1].generationType, "Image");
    assert.equal(top5[1].providerModelFormatted, "Gemini / 1.5 Pro");
    assert.equal(top5[1].priority, "High");
    assert.equal(top5[1].status, "Waiting");

    // Row 3: REQ-4585
    assert.equal(top5[2].id, "REQ-4585");
    assert.equal(top5[2].userId, "user_7721");
    assert.equal(top5[2].generationType, "Image");
    assert.equal(top5[2].providerModelFormatted, "Stability AI");
    assert.equal(top5[2].priority, "Normal");
    assert.equal(top5[2].status, "Waiting");

    // Row 4: REQ-4584
    assert.equal(top5[3].id, "REQ-4584");
    assert.equal(top5[3].userId, "user_6602");
    assert.equal(top5[3].generationType, "Text");
    assert.equal(top5[3].priority, "Low");
    assert.equal(top5[3].status, "Scheduled");
    assert.equal(top5[3].scheduledAt, "Nov 19, 11:00 AM");

    // Row 5: REQ-4583
    assert.equal(top5[4].id, "REQ-4583");
    assert.equal(top5[4].userId, "user_3412");
    assert.equal(top5[4].status, "Paused");
  });

  await t.test("3. Enforces deterministic priority ranking and fair scheduling starvation prevention", () => {
    assert.equal(PRIORITY_RANK.Critical, 1);
    assert.equal(PRIORITY_RANK.High, 2);
    assert.equal(PRIORITY_RANK.Normal, 3);
    assert.equal(PRIORITY_RANK.Low, 4);

    const normalItem = {
      id: "TEST-NORMAL",
      queuePosition: 10,
      userId: "u1",
      generationType: "Image",
      provider: "OpenAI",
      model: "GPT-4o",
      providerModelFormatted: "OpenAI / GPT-4o",
      priority: "Normal",
      submittedAt: "Nov 19, 10:00 AM",
      submittedTimestamp: 1000,
      scheduledAt: null,
      scheduledTimestamp: null,
      status: "Waiting",
      attemptCount: 1,
      relatedJobId: "JOB-1",
      waitingDurationMinutes: 10,
    };

    const highItem = {
      ...normalItem,
      id: "TEST-HIGH",
      priority: "High",
      submittedTimestamp: 2000,
      waitingDurationMinutes: 5,
    };

    // Standard ordering: High beats Normal
    const standardOrder = compareQueueItemsForScheduling(normalItem, highItem, false, 30);
    assert.ok(standardOrder > 0, "High priority should sort before Normal");

    // Starvation mitigation: Normal item waited 35 min (> 30 min threshold)
    const starvedNormalItem = {
      ...normalItem,
      waitingDurationMinutes: 35,
    };
    const starvedOrder = compareQueueItemsForScheduling(starvedNormalItem, highItem, true, 30);
    // Starved normal rank is boosted from 3 to 2, tying rank with High, but submitted earlier (1000 < 2000), so sorts first
    assert.ok(starvedOrder < 0, "Starved Normal item should be boosted ahead of newer High item");
  });

  await t.test("4. Updates request priority with audit tracking and re-indexes queue positions", () => {
    // Change REQ-4585 from Normal to Critical
    const res = changeRequestPriority(
      "REQ-4585",
      "Critical",
      "VIP client emergency campaign request",
      "parth"
    );

    assert.equal(res.success, true);
    assert.equal(res.item.priority, "Critical");

    const data = getQueuePriorityDataset();
    // Audit event must be added to the front of activityHistory
    const latestEvent = data.activityHistory[0];
    assert.equal(latestEvent.requestId, "REQ-4585");
    assert.equal(latestEvent.eventType, "Priority Change");
    assert.equal(latestEvent.previousPriority, "Normal");
    assert.equal(latestEvent.newPriority, "Critical");
    assert.equal(latestEvent.actionBy, "parth");
  });

  await t.test("5. Validates cancellation safety and credits refund policy", () => {
    // Cancel REQ-4586
    const res = cancelQueuedRequest("REQ-4586", "Duplicate submission by user", "parth");
    assert.equal(res.success, true);
    assert.equal(res.item.status, "Cancelled");
    assert.equal(res.item.refunded, true);

    const data = getQueuePriorityDataset();
    const cancelledEvent = data.activityHistory.find(
      (ev) => ev.requestId === "REQ-4586" && ev.eventType === "Cancelled"
    );
    assert.ok(cancelledEvent, "Cancellation event must be logged to activity history");
  });

  await t.test("6. Toggles pause/resume and handles request rescheduling", () => {
    // Toggle pause on REQ-4583 (currently Paused -> should become Waiting)
    const toggleRes = toggleRequestPause("REQ-4583", "parth");
    assert.equal(toggleRes.success, true);
    assert.equal(toggleRes.item.status, "Waiting");

    // Reschedule REQ-4584
    const reschedRes = rescheduleQueuedRequest("REQ-4584", "Nov 19, 01:00 PM", "parth");
    assert.equal(reschedRes.success, true);
    assert.equal(reschedRes.item.scheduledAt, "Nov 19, 01:00 PM");
    assert.equal(reschedRes.item.status, "Scheduled");
  });

  await t.test("7. Validates scheduling settings limits and concurrency policies", () => {
    // Test negative / invalid max concurrent jobs rejected
    const invalidRes = updateSchedulingSettings({ maxConcurrentJobs: 0 });
    assert.equal(invalidRes.success, false);

    // Valid update
    const validRes = updateSchedulingSettings({
      schedulingMode: "Throughput-Optimized",
      maxConcurrentJobs: 25,
      rateLimitHandling: "Instant Failover",
    });
    assert.equal(validRes.success, true);
    assert.equal(validRes.settings.schedulingMode, "Throughput-Optimized");
    assert.equal(validRes.settings.maxConcurrentJobs, 25);
    assert.equal(validRes.settings.rateLimitHandling, "Instant Failover");
  });

  await t.test("8. Queries queue items with multi-parameter filtering and pagination", () => {
    // Reset dataset to test query
    resetQueuePriorityData();

    // Query by search
    const searchRes = queryQueuePriorityItems({ search: "REQ-4587" });
    assert.equal(searchRes.items.length, 1);
    assert.equal(searchRes.items[0].id, "REQ-4587");

    // Query by type Image
    const imageRes = queryQueuePriorityItems({ type: "Image" });
    assert.ok(imageRes.total > 0);
    assert.ok(imageRes.items.every((it) => it.generationType === "Image"));

    // Pagination: page 1 with pageSize 5
    const p1 = queryQueuePriorityItems({ page: 1, pageSize: 5 });
    assert.equal(p1.items.length, 5);
    assert.equal(p1.page, 1);
    assert.equal(p1.pageSize, 5);
    assert.equal(p1.total, 128);
    assert.equal(p1.totalPages, 26);
  });
});
