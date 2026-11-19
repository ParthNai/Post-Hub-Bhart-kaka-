import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePostHubSpec,
  extractMetadataFromBuffer,
  CHATGPT_POSTER_PROMPT_TEMPLATE,
} from "../lib/ai-slot-detector.ts";

test("AI Slot Detector: parsePostHubSpec tag format", () => {
  const input = "Here is your poster! [POSTHUB: PHOTO(6, 6, 48, 62, cutout) NAME(12, 88, 76, 8) HEADER(54, 16, 38, 7)]";
  const zones = parsePostHubSpec(input);
  assert.equal(zones.length, 3);

  const photo = zones.find((z) => z.type === "photo");
  assert.ok(photo);
  assert.equal(photo.x, 6);
  assert.equal(photo.y, 6);
  assert.equal(photo.width, 48);
  assert.equal(photo.height, 62);
  assert.equal(photo.photoShape, "cutout");
  assert.equal(photo.borderWidth, 0);
  assert.equal(photo.featherBottom, true);
  assert.equal(photo.objectFit, "contain");

  const name = zones.find((z) => z.label === "Name Banner");
  assert.ok(name);
  assert.equal(name.x, 12);
  assert.equal(name.y, 88);
  assert.equal(name.width, 76);
  assert.equal(name.height, 8);
  assert.equal(name.autoFitText, true);
  assert.equal(name.wrapText, true);

  const header = zones.find((z) => z.label === "Header Badge");
  assert.ok(header);
  assert.equal(header.x, 54);
  assert.equal(header.y, 16);
  assert.equal(header.width, 38);
  assert.equal(header.height, 7);
});

test("AI Slot Detector: parsePostHubSpec key-value format", () => {
  const input = "PHOTO: x=8, y=10, w=45, h=60, shape=cutout | NAME: x=14, y=86, w=72, h=9";
  const zones = parsePostHubSpec(input);
  assert.equal(zones.length, 2);

  const photo = zones.find((z) => z.type === "photo");
  assert.ok(photo);
  assert.equal(photo.x, 8);
  assert.equal(photo.y, 10);
  assert.equal(photo.width, 45);
  assert.equal(photo.height, 60);

  const name = zones.find((z) => z.type === "text");
  assert.ok(name);
  assert.equal(name.x, 14);
  assert.equal(name.y, 86);
  assert.equal(name.width, 72);
  assert.equal(name.height, 9);
});

test("AI Slot Detector: parsePostHubSpec JSON format", () => {
  const input = `\`\`\`json
{
  "photo": { "x": 6, "y": 6, "width": 48, "height": 62, "shape": "cutout" },
  "name": { "x": 10, "y": 86, "width": 80, "height": 10 }
}
\`\`\``;
  const zones = parsePostHubSpec(input);
  assert.equal(zones.length, 2);

  const photo = zones[0];
  assert.equal(photo.x, 6);
  assert.equal(photo.y, 6);
  assert.equal(photo.width, 48);
  assert.equal(photo.height, 62);
  assert.equal(photo.photoShape, "cutout");

  const name = zones[1];
  assert.equal(name.x, 10);
  assert.equal(name.y, 86);
  assert.equal(name.width, 80);
  assert.equal(name.height, 10);
});

test("AI Slot Detector: parsePostHubSpec array JSON format", () => {
  const input = `{"photo": [7, 8, 46, 58], "name": [11, 87, 78, 9]}`;
  const zones = parsePostHubSpec(input);
  assert.equal(zones.length, 2);

  assert.equal(zones[0].x, 7);
  assert.equal(zones[0].y, 8);
  assert.equal(zones[0].width, 46);
  assert.equal(zones[0].height, 58);

  assert.equal(zones[1].x, 11);
  assert.equal(zones[1].y, 87);
  assert.equal(zones[1].width, 78);
  assert.equal(zones[1].height, 9);
});

test("AI Slot Detector: extractMetadataFromBuffer", () => {
  const encoder = new TextEncoder();
  const mockPayload = encoder.encode(
    "HEADER_JUNK_DATA\x00POSTHUB_SPEC: PHOTO(6,6,48,62,cutout) NAME(12,88,76,8)\x00TRAILER_JUNK"
  );
  const extracted = extractMetadataFromBuffer(mockPayload.buffer);
  assert.ok(extracted);
  assert.ok(extracted.includes("PHOTO(6,6,48,62,cutout)"));

  const zones = parsePostHubSpec(extracted);
  assert.equal(zones.length, 2);
  assert.equal(zones[0].photoShape, "cutout");
});

test("AI Slot Detector: CHATGPT_POSTER_PROMPT_TEMPLATE is defined", () => {
  assert.ok(CHATGPT_POSTER_PROMPT_TEMPLATE.includes("POSTHUB: PHOTO"));
  assert.ok(CHATGPT_POSTER_PROMPT_TEMPLATE.includes("NAME"));
});
