import test from "node:test";
import assert from "node:assert/strict";
import {
  getFestivalsDataset,
  createFestivalEvent,
  updateFestivalEvent,
  deleteFestivalEvent,
  duplicateFestivalEvent,
  importFestivalEvents,
  resetFestivalsData,
} from "../lib/festivals-storage.ts";
import { recalculateFestivalMetrics } from "../lib/festivals.ts";

test("Screen 36 — Festivals & Events Management Dashboard Test Suite", async (t) => {
  // Always reset dataset to canonical seed before test run
  await resetFestivalsData();

  await t.test("1. Initializes canonical summary metrics matching Screen 36", async () => {
    const data = await getFestivalsDataset();

    assert.equal(data.summary.totalEvents, 48);
    assert.equal(data.summary.totalEventsTrend, "+5%");
    assert.equal(data.summary.upcomingEvents, 12);
    assert.equal(data.summary.upcomingEventsTrend, "+2%");
    assert.equal(data.summary.activeEvents, 36);
    assert.equal(data.summary.activeEventsTrend, "+3%");
    assert.equal(data.summary.draftEvents, 8);
    assert.equal(data.summary.draftEventsTrend, "0%");
  });

  await t.test("2. Verifies canonical calendar events plotted in November 2026", async () => {
    const data = await getFestivalsDataset();

    const diwali = data.events.find((e) => e.startDate === "2026-11-08");
    assert.ok(diwali);
    assert.equal(diwali.name, "Diwali");
    assert.equal(diwali.category, "Religious");

    const govardhan = data.events.find((e) => e.startDate === "2026-11-10");
    assert.ok(govardhan);
    assert.equal(govardhan.name, "Govardhan Puja");

    const children = data.events.find((e) => e.startDate === "2026-11-14");
    assert.ok(children);
    assert.equal(children.name, "Children's Day");

    const gurupurab = data.events.find((e) => e.startDate === "2026-11-16");
    assert.ok(gurupurab);
    assert.equal(gurupurab.name, "Guru Nanak Jayanti");

    const education = data.events.find((e) => e.startDate === "2026-11-18");
    assert.ok(education);
    assert.equal(education.name, "National Education Day");
    assert.equal(education.calendarHighlight, true);

    const thanksgiving = data.events.find((e) => e.startDate === "2026-11-24");
    assert.ok(thanksgiving);
    assert.equal(thanksgiving.name, "Thanksgiving");
  });

  await t.test("3. Verifies canonical upcoming events table matching reference rows", async () => {
    const data = await getFestivalsDataset();

    // 1. Diwali
    const r1 = data.events.find((e) => e.name === "Diwali");
    assert.ok(r1);
    assert.equal(r1.formattedDate, "Nov 08, 2026");
    assert.equal(r1.category, "Religious");
    assert.equal(r1.region, "India");
    assert.equal(r1.language, "Gujarati");
    assert.equal(r1.contentStatus, "Published");
    assert.equal(r1.templateStatus, "Available");

    // 2. Christmas
    const r2 = data.events.find((e) => e.name === "Christmas");
    assert.ok(r2);
    assert.equal(r2.formattedDate, "Dec 25, 2026");
    assert.equal(r2.category, "International");
    assert.equal(r2.region, "Global");
    assert.equal(r2.language, "English");
    assert.equal(r2.contentStatus, "Scheduled");
    assert.equal(r2.templateStatus, "Missing");

    // 3. New Year
    const r3 = data.events.find((e) => e.name === "New Year");
    assert.ok(r3);
    assert.equal(r3.formattedDate, "Jan 01, 2027");
    assert.equal(r3.contentStatus, "Draft");
    assert.equal(r3.templateStatus, "In Progress");

    // 4. Makar Sankranti
    const r4 = data.events.find((e) => e.name === "Makar Sankranti");
    assert.ok(r4);
    assert.equal(r4.formattedDate, "Jan 14, 2027");
    assert.equal(r4.contentStatus, "Pending Review");
    assert.equal(r4.templateStatus, "Available");

    // 5. Republic Day
    const r5 = data.events.find((e) => e.name === "Republic Day");
    assert.ok(r5);
    assert.equal(r5.formattedDate, "Jan 26, 2027");
    assert.equal(r5.contentStatus, "Published");
    assert.equal(r5.templateStatus, "Available");

    // 6. Holi
    const r6 = data.events.find((e) => e.name === "Holi");
    assert.ok(r6);
    assert.equal(r6.formattedDate, "Mar 17, 2027");
    assert.equal(r6.contentStatus, "Scheduled");
    assert.equal(r6.templateStatus, "In Progress");
  });

  await t.test("4. Verifies content preparation status percentages", async () => {
    const data = await getFestivalsDataset();

    assert.equal(data.contentPreparation.readyTemplatesPercent, 75);
    assert.equal(data.contentPreparation.requiringTemplatesPercent, 15);
    assert.equal(data.contentPreparation.awaitingReviewPercent, 10);
  });

  await t.test("5. Verifies 7 event categories distribution", async () => {
    const data = await getFestivalsDataset();

    assert.equal(data.categories.length, 7);
    const catMap = Object.fromEntries(data.categories.map((c) => [c.name, c.count]));

    assert.equal(catMap["Religious"], 12);
    assert.equal(catMap["National"], 8);
    assert.equal(catMap["Regional"], 8);
    assert.equal(catMap["Cultural"], 7);
    assert.equal(catMap["Business"], 6);
    assert.equal(catMap["International"], 5);
    assert.equal(catMap["Special"], 2);

    const totalSum = Object.values(catMap).reduce((a, b) => a + b, 0);
    assert.equal(totalSum, 48);
  });

  await t.test("6. Tests creating a new festival event with validation", async () => {
    const newEvent = await createFestivalEvent({
      name: "Ganesh Chaturthi",
      category: "Religious",
      type: "Festival",
      startDate: "2027-09-04",
      region: "India",
      states: ["Maharashtra", "Gujarat"],
      language: "Marathi",
      contentStatus: "Published",
      templateStatus: "Available",
      associatedTemplateIds: ["TPL-030"],
    });

    assert.ok(newEvent.id.startsWith("EVT-FEST-"));
    assert.equal(newEvent.name, "Ganesh Chaturthi");
    assert.equal(newEvent.slug, "ganesh-chaturthi");
    assert.equal(newEvent.contentStatus, "Published");

    const data = await getFestivalsDataset();
    assert.ok(data.events.some((e) => e.id === newEvent.id));
  });

  await t.test("7. Tests updating an existing festival event", async () => {
    const data = await getFestivalsDataset();
    const target = data.events[0];

    const updated = await updateFestivalEvent(target.id, {
      shortDescription: "Updated festive poster collection description.",
      templateStatus: "Available",
    });

    assert.equal(updated.shortDescription, "Updated festive poster collection description.");
    assert.equal(updated.templateStatus, "Available");
  });

  await t.test("8. Tests duplicating a festival event", async () => {
    const data = await getFestivalsDataset();
    const target = data.events[0];

    const copy = await duplicateFestivalEvent(target.id);
    assert.ok(copy.name.includes("(Copy)"));
    assert.equal(copy.contentStatus, "Draft");

    const after = await getFestivalsDataset();
    assert.ok(after.events.some((e) => e.id === copy.id));
  });

  await t.test("9. Tests batch importing festival events", async () => {
    const testItems = [
      {
        name: "Navratri",
        category: "Cultural",
        type: "Festival",
        startDate: "2027-10-01",
        region: "India",
        language: "Gujarati",
      },
      {
        name: "Diwali", // Already exists -> should skip duplicate
        category: "Religious",
        type: "Festival",
        startDate: "2026-11-08",
      },
    ];

    const result = await importFestivalEvents(testItems);
    assert.equal(result.importedCount, 1);
    assert.equal(result.duplicatesSkipped, 1);

    const data = await getFestivalsDataset();
    assert.ok(data.events.some((e) => e.name === "Navratri"));
  });

  await t.test("10. Tests deleting a festival event safely", async () => {
    const data = await getFestivalsDataset();
    const target = data.events[data.events.length - 1];

    const deleted = await deleteFestivalEvent(target.id);
    assert.equal(deleted, true);

    const after = await getFestivalsDataset();
    assert.ok(!after.events.some((e) => e.id === target.id));
  });

  await t.test("11. Tests resetting dataset back to canonical pristine state", async () => {
    await resetFestivalsData();
    const data = await getFestivalsDataset();

    assert.equal(data.summary.totalEvents, 48);
    assert.equal(data.summary.upcomingEvents, 12);
    assert.equal(data.summary.activeEvents, 36);
    assert.equal(data.summary.draftEvents, 8);
  });
});
