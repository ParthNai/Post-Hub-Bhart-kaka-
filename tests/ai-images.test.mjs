import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllGeneratedImages,
  getImageById,
  getImageMetrics,
  getModerationSettings,
  saveModerationSettings,
  queryGeneratedImages,
  approveImage,
  rejectImage,
  flagImage,
  bulkModerateImages,
  getModerationHistory,
  resetImageLibrary,
} from "../lib/ai-images-storage.ts";
import { generateImagesCsv } from "../lib/ai-images.ts";

test("Screen 22 — AI Generated Images Library & Moderation Management Test Suite", async (t) => {
  // Reset storage to canonical state before testing
  resetImageLibrary();

  await t.test("1. Initializes canonical images matching Screen 22 reference specifications", () => {
    const all = getAllGeneratedImages();
    assert.equal(all.length, 1248, "Must contain exactly 1,248 total generated images");

    const metrics = getImageMetrics();
    assert.equal(metrics.totalImages, 1248, "Total images KPI must be 1,248");
    assert.equal(metrics.approvedCount, 1102, "Approved images KPI must be 1,102");
    assert.equal(metrics.pendingCount, 67, "Pending review KPI must be 67");
    assert.equal(metrics.rejectedCount, 79, "Rejected images KPI must be 79");
    assert.equal(metrics.approvalRate, "88.3% approval rate", "Approval rate must be 88.3% approval rate");
    assert.equal(metrics.pendingRate, "5.4% pending review", "Pending rate must be 5.4% pending review");
    assert.equal(metrics.rejectionRate, "6.3% rejection rate", "Rejection rate must be 6.3% rejection rate");

    // Verify Page 1 Card 1 (IMG-20261028-001: Diwali)
    const card1 = getImageById("IMG-20261028-001");
    assert.ok(card1, "Card 1 must exist");
    assert.equal(card1.requestId, "REQ-001247");
    assert.equal(card1.userName, "Parth Patel");
    assert.equal(card1.category, "Festivals & Events");
    assert.equal(card1.presetName, "Diwali Festival");
    assert.equal(card1.thumbnailType, "diwali");
    assert.equal(card1.moderationStatus, "approved");
    assert.equal(card1.dimensions, "1080 × 1350 px");
    assert.equal(card1.format, "PNG");
    assert.equal(card1.fileSize, "842 KB");
    assert.equal(card1.createdAt, "Oct 28, 2026, 04:32 PM");

    // Verify Page 1 Card 2 (IMG-20261028-002: Admission Open)
    const card2 = getImageById("IMG-20261028-002");
    assert.ok(card2, "Card 2 must exist");
    assert.equal(card2.requestId, "REQ-001246");
    assert.equal(card2.userName, "Priya Shah");
    assert.equal(card2.category, "Education");
    assert.equal(card2.moderationStatus, "pending");

    // Verify Page 1 Card 3 (IMG-20261028-003: Business Growth)
    const card3 = getImageById("IMG-20261028-003");
    assert.ok(card3, "Card 3 must exist");
    assert.equal(card3.requestId, "REQ-001245");
    assert.equal(card3.userName, "Amit Desai");
    assert.equal(card3.category, "Business");
    assert.equal(card3.moderationStatus, "approved");

    // Verify Page 1 Card 4 (IMG-20261028-004: Happy Navratri)
    const card4 = getImageById("IMG-20261028-004");
    assert.ok(card4, "Card 4 must exist");
    assert.equal(card4.requestId, "REQ-001244");
    assert.equal(card4.userName, "Neha Patel");
    assert.equal(card4.category, "Festivals & Events");
    assert.equal(card4.moderationStatus, "rejected");

    // Verify Page 1 Card 5 (IMG-20261027-001: Flat 50% Off)
    const card5 = getImageById("IMG-20261027-001");
    assert.ok(card5, "Card 5 must exist");
    assert.equal(card5.requestId, "REQ-001243");
    assert.equal(card5.userName, "Rohan Mehta");
    assert.equal(card5.moderationStatus, "approved");

    // Verify Page 1 Card 6 (IMG-20261027-002: Dream Big Achieve More)
    const card6 = getImageById("IMG-20261027-002");
    assert.ok(card6, "Card 6 must exist");
    assert.equal(card6.requestId, "REQ-001242");
    assert.equal(card6.userName, "Jigna Shah");
    assert.equal(card6.moderationStatus, "approved");

    // Verify Page 1 Card 7 (IMG-20261027-003: Happy Dussehra)
    const card7 = getImageById("IMG-20261027-003");
    assert.ok(card7, "Card 7 must exist");
    assert.equal(card7.requestId, "REQ-001241");
    assert.equal(card7.userName, "Karan Patel");
    assert.equal(card7.moderationStatus, "pending");

    // Verify Page 1 Card 8 (IMG-20261027-004: Stay Healthy Stay Fit)
    const card8 = getImageById("IMG-20261027-004");
    assert.ok(card8, "Card 8 must exist");
    assert.equal(card8.requestId, "REQ-001240");
    assert.equal(card8.userName, "Meera Shah");
    assert.equal(card8.moderationStatus, "approved");
  });

  await t.test("2. Query, pagination and multi-dimensional filters", () => {
    // Default pagination page 1 (pageSize 8)
    const p1 = queryGeneratedImages({ page: 1, pageSize: 8 });
    assert.equal(p1.images.length, 8, "Page 1 must return 8 records");
    assert.equal(p1.total, 1248, "Total must be 1248");
    assert.equal(p1.totalPages, 156, "Total pages for 1248 / 8 is 156");

    // Filter by query (e.g., "diwali")
    const searchRes = queryGeneratedImages({ query: "diwali" });
    assert.ok(searchRes.images.length >= 1, "Should find diwali items");
    assert.ok(searchRes.images.some((i) => i.id === "IMG-20261028-001"));

    // Filter by category
    const catRes = queryGeneratedImages({ category: "Festivals & Events" });
    assert.ok(catRes.images.length > 0);
    assert.ok(catRes.images.every((i) => i.category === "Festivals & Events"));

    // Filter by status
    const pendingRes = queryGeneratedImages({ status: "pending" });
    assert.equal(pendingRes.total, 67, "Should filter all 67 pending items");

    const rejectedRes = queryGeneratedImages({ status: "rejected" });
    assert.equal(rejectedRes.total, 79, "Should filter all 79 rejected items");

    // Filter by provider
    const providerRes = queryGeneratedImages({ provider: "openai" });
    assert.ok(providerRes.images.length > 0);
    assert.ok(providerRes.images.every((i) => i.providerId.includes("openai")));
  });

  await t.test("3. Single moderation operations (approve, reject, flag)", () => {
    // Approve pending card 2 (IMG-20261028-002)
    const approved = approveImage("IMG-20261028-002", "Parth Patel", "Looks good, approved.");
    assert.ok(approved, "Should return updated image");
    assert.equal(approved.moderationStatus, "approved");
    assert.equal(approved.reviewedBy, "Parth Patel");
    assert.equal(approved.moderationNotes, "Looks good, approved.");

    // Check updated metrics
    const m1 = getImageMetrics();
    assert.equal(m1.approvedCount, 1103, "Approved count should increment by 1");
    assert.equal(m1.pendingCount, 66, "Pending count should decrement by 1");

    // Reject pending card 7 (IMG-20261027-003)
    const rejected = rejectImage(
      "IMG-20261027-003",
      "Parth Patel",
      "Low visual quality or distortion",
      "Distorted text elements in lower banner"
    );
    assert.ok(rejected, "Should return rejected image");
    assert.equal(rejected.moderationStatus, "rejected");
    assert.equal(rejected.rejectionReason, "Low visual quality or distortion");
    assert.equal(rejected.reviewedBy, "Parth Patel");

    const m2 = getImageMetrics();
    assert.equal(m2.rejectedCount, 80, "Rejected count should increment to 80");
    assert.equal(m2.pendingCount, 65, "Pending count should decrement to 65");

    // Flag an image
    const flagged = flagImage(
      "IMG-20261028-003",
      "Parth Patel",
      "Contains trademark or logo"
    );
    assert.ok(flagged, "Should flag image");
    assert.equal(flagged.moderationStatus, "flagged");
    assert.equal(flagged.flagReason, "Contains trademark or logo");

    // Verify history log was created
    const history = getModerationHistory("IMG-20261028-002");
    assert.ok(history.length >= 1, "Should have audit trail entry for Card 2");
    assert.equal(history[0].action, "approved");
    assert.equal(history[0].reviewer, "Parth Patel");
  });

  await t.test("4. Bulk moderation operations (bulk approve, reject, archive)", () => {
    const ids = ["IMG-20261027-001", "IMG-20261027-002"];

    // Bulk reject
    const bulkRejectRes = bulkModerateImages(ids, "reject", "Parth Patel", "Bulk moderation batch test");
    assert.equal(bulkRejectRes.count, 2);
    assert.equal(getImageById("IMG-20261027-001")?.moderationStatus, "rejected");
    assert.equal(getImageById("IMG-20261027-002")?.moderationStatus, "rejected");

    // Bulk approve
    const bulkApproveRes = bulkModerateImages(ids, "approve", "Parth Patel", "Bulk re-approval");
    assert.equal(bulkApproveRes.count, 2);
    assert.equal(getImageById("IMG-20261027-001")?.moderationStatus, "approved");
    assert.equal(getImageById("IMG-20261027-002")?.moderationStatus, "approved");

    // Bulk archive
    const bulkArchiveRes = bulkModerateImages(ids, "archive", "Parth Patel");
    assert.equal(bulkArchiveRes.count, 2);
    assert.equal(getImageById("IMG-20261027-001")?.isArchived, true);
    assert.equal(getImageById("IMG-20261027-002")?.isArchived, true);
  });

  await t.test("5. Moderation settings persistence and retrieval", () => {
    const defaultSettings = getModerationSettings();
    assert.equal(defaultSettings.autoApproveSafe, false);
    assert.equal(defaultSettings.strictnessLevel, "standard");
    assert.equal(defaultSettings.flagNudity, true);

    const updated = saveModerationSettings({
      autoApproveSafe: true,
      strictnessLevel: "high",
      retentionDays: 120,
    });
    assert.equal(updated.autoApproveSafe, true);
    assert.equal(updated.strictnessLevel, "high");
    assert.equal(updated.retentionDays, 120);

    const reloaded = getModerationSettings();
    assert.equal(reloaded.autoApproveSafe, true);
    assert.equal(reloaded.strictnessLevel, "high");
    assert.equal(reloaded.retentionDays, 120);
  });

  await t.test("6. CSV export data generation", () => {
    const images = getAllGeneratedImages().slice(0, 5);
    const csv = generateImagesCsv(images);

    assert.ok(csv.startsWith("Image ID,Request ID,User"), "CSV should have proper column headers");
    assert.ok(csv.includes("IMG-20261028-001"), "CSV should contain Card 1 ID");
    assert.ok(csv.includes("REQ-001247"), "CSV should contain Card 1 Request ID");
    assert.ok(csv.includes("Parth Patel"), "CSV should contain Card 1 user name");
  });

  // Reset back to canonical state after tests
  resetImageLibrary();
});
