import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  parsePostHubSpec,
  parseSvgTemplate,
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

test("AI Slot Detector: parseSvgTemplate from ChatGPT political_template_001.svg", () => {
  const filePath = "C:/Users/AE/Downloads/political_template_001.svg";
  if (!fs.existsSync(filePath)) return;

  const svgContent = fs.readFileSync(filePath, "utf8");
  const result = parseSvgTemplate(svgContent);

  assert.equal(result.canvasWidth, 1024);
  assert.equal(result.canvasHeight, 1536);
  assert.ok(result.backgroundUrl?.startsWith("data:image/png;base64,"));
  assert.equal(result.zones.length, 7);

  const photo = result.zones.find((z) => z.type === "photo");
  assert.ok(photo);
  assert.equal(photo.photoShape, "cutout");
  assert.equal(photo.featherBottom, true);
  // 292 / 1024 * 100 = 28.5%
  assert.equal(photo.x, 28.5);
  // 267 / 1536 * 100 = 17.4%
  assert.equal(photo.y, 17.4);

  const name = result.zones.find((z) => z.id === "person_name");
  assert.ok(name);
  assert.equal(name.textBinding, "name");
  // 230 / 1024 * 100 = 22.5%
  assert.equal(name.x, 22.5);
  // 1190 / 1536 * 100 = 77.5%
  assert.equal(name.y, 77.5);
  assert.equal(name.color, "#102B65");
});

test("AI Slot Detector: parsePostHubSpec with ChatGPT elements snippet", () => {
  const snippet = `    {
      "id": "person_phone",
      "type": "text",
      "x": 265,
      "y": 1425,
      "width": 180,
      "height": 52,
      "fontSize": 18,
      "fontWeight": 600,
      "color": "#102B65",
      "align": "center",
      "zIndex": 22
    },
    {
      "id": "person_email",
      "type": "text",
      "x": 480,
      "y": 1425,
      "width": 245,
      "height": 52,
      "fontSize": 16,
      "fontWeight": 600,
      "color": "#102B65",
      "align": "center",
      "zIndex": 22
    },
    {
      "id": "person_website",
      "type": "text",
      "x": 750,
      "y": 1425,
      "width": 230,
      "height": 52,
      "fontSize": 17,
      "fontWeight": 600,
      "color": "#102B65",
      "align": "center",
      "zIndex": 22
    }`;

  const zones = parsePostHubSpec(snippet);
  assert.equal(zones.length, 3);

  const phone = zones.find((z) => z.id === "person_phone");
  assert.ok(phone);
  assert.equal(phone.textBinding, "phone");
  assert.equal(phone.x, 25.9); // 265 / 1024 * 100 = 25.9%
  assert.equal(phone.y, 92.8); // 1425 / 1536 * 100 = 92.8%
  assert.equal(phone.width, 17.6);
  assert.equal(phone.color, "#102B65");
});
