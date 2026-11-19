import type { TemplateSlotZone, TextSlotBinding } from "./templates.ts";

/**
 * Converts a raw element dictionary (with either pixel or percentage coordinates)
 * into a PostHub TemplateSlotZone.
 */
function convertRawElement(el: any, canvasW = 1024, canvasH = 1536): TemplateSlotZone {
  const isPixels = el.x > 100 || el.y > 100 || el.width > 100 || el.height > 100;
  const x = isPixels ? Math.round((el.x / canvasW) * 1000) / 10 : Math.round(el.x * 10) / 10;
  const y = isPixels ? Math.round((el.y / canvasH) * 1000) / 10 : Math.round(el.y * 10) / 10;
  const width = isPixels ? Math.round((el.width / canvasW) * 1000) / 10 : Math.round(el.width * 10) / 10;
  const height = isPixels ? Math.round((el.height / canvasH) * 1000) / 10 : Math.round(el.height * 10) / 10;

  const id = String(el.id || `zone-${Date.now().toString(36)}`).toLowerCase();
  const isPhoto =
    el.type === "image" ||
    el.type === "photo" ||
    el.shape !== undefined ||
    id.includes("photo") ||
    id.includes("avatar") ||
    id.includes("portrait");

  if (isPhoto) {
    const shape = (el.shape || el.photoShape || "cutout") as "cutout" | "circle" | "squircle" | "rectangle";
    return {
      id: el.id || `zone-photo-${Date.now().toString(36)}`,
      type: "photo",
      label: "User Photo / Portrait",
      x: Math.max(0, Math.min(95, x)),
      y: Math.max(0, Math.min(95, y)),
      width: Math.max(5, Math.min(100, width)),
      height: Math.max(5, Math.min(100, height)),
      photoShape: shape,
      borderWidth: shape === "cutout" ? 0 : (el.borderWidth ?? 3),
      shadow: shape !== "cutout",
      featherBottom: shape === "cutout",
      objectFit: el.fit === "cover" ? "cover" : "contain",
      zIndex: el.zIndex || 4,
    };
  }

  let textBinding: TextSlotBinding = "name";
  let customText: string | undefined;

  if (id.includes("name")) textBinding = "name";
  else if (id.includes("designation") || id.includes("role") || id.includes("title")) textBinding = "designation";
  else if (id.includes("phone") || id.includes("mobile")) textBinding = "phone";
  else if (id.includes("website") || id.includes("brand") || id.includes("business")) textBinding = "business";
  else if (id.includes("email")) {
    textBinding = "custom";
    customText = "info@brand.com";
  } else if (id.includes("address") || id.includes("location")) {
    textBinding = "custom";
    customText = "Gujarat, India";
  } else {
    textBinding = "custom";
    customText = el.text || el.label || "Custom Text";
  }

  // Scaled font size: If in pixels (e.g. 64px on 1536px canvas), scale down proportionally
  let fontSize = el.fontSize || 15;
  if (isPixels && fontSize > 20) {
    fontSize = Math.max(9, Math.round(fontSize * 0.28));
  }

  return {
    id: el.id || `zone-text-${Date.now().toString(36)}`,
    type: "text",
    label: el.label || id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    textBinding,
    customText,
    x: Math.max(0, Math.min(95, x)),
    y: Math.max(0, Math.min(95, y)),
    width: Math.max(5, Math.min(100, width)),
    height: Math.max(2, Math.min(50, height)),
    fontSize,
    fontWeight: el.fontWeight >= 800 ? "800" : (el.fontWeight >= 700 ? "700" : "600"),
    fontFamily: el.fontFamily?.includes("Devanagari") ? "Poppins" : (el.fontFamily || "Poppins"),
    color: el.color || "#102B65",
    alignment: (el.align === "left" || el.align === "right") ? el.align : "center",
    autoFitText: true,
    wrapText: true,
    zIndex: el.zIndex || 5,
  };
}

/**
 * Universal PostHub AI Slot Specification Parser
 * Supports:
 * 1. Tag format: POSTHUB_SPEC: PHOTO(6, 6, 48, 62, cutout) NAME(12, 88, 76, 8) HEADER(54, 16, 38, 7)
 * 2. Key-value format: PHOTO: x=6, y=6, w=48, h=62, shape=cutout | NAME: x=12, y=88, w=76, h=8
 * 3. Short numbers: PHOTO: 6, 6, 48, 62 | NAME: 12, 88, 76, 8
 * 4. JSON elements array or object: [{"id": "person_phone", "x": 265, "y": 1425, "width": 180, "height": 52}, ...]
 * 5. Conversational text from ChatGPT
 */
export function parsePostHubSpec(rawText: string): TemplateSlotZone[] {
  const zones: TemplateSlotZone[] = [];
  if (!rawText || typeof rawText !== "string") return zones;

  // Clean out markdown code block fences (```json, ```xml, ```svg, ```)
  const clean = rawText
    .replace(/```[a-zA-Z0-9_-]*\n?/g, "")
    .replace(/```/g, "")
    .trim();

  // 0. If input is raw SVG code, extract zones from it directly
  if (clean.includes("<svg")) {
    const svgRes = parseSvgTemplate(clean);
    if (svgRes.zones.length > 0) return svgRes.zones;
  }

  // 1. Robust JSON Object Block Scanner:
  // Extracts any individual { ... } blocks that define x and y coordinates
  // Handles full JSON arrays, single objects, and sliced/broken JSON fragments
  if (clean.includes('"x"') && clean.includes('"y"')) {
    const objRegex = /\{([^{}]+)\}/g;
    let m: RegExpExecArray | null;
    const parsedObjects: any[] = [];

    while ((m = objRegex.exec(clean)) !== null) {
      try {
        const candidate = JSON.parse(`{${m[1]}}`);
        if (candidate.x !== undefined && candidate.y !== undefined) {
          parsedObjects.push(candidate);
        }
      } catch {
        // Continue scanning next object
      }
    }

    if (parsedObjects.length > 0) {
      let canvasW = 1024;
      let canvasH = 1536;

      const canvasWRef = clean.match(/"width"\s*:\s*(\d{3,4})[\s,]+"height"\s*:\s*(\d{3,4})/);
      if (canvasWRef) {
        canvasW = parseFloat(canvasWRef[1]) || 1024;
        canvasH = parseFloat(canvasWRef[2]) || 1536;
      }

      for (const item of parsedObjects) {
        zones.push(convertRawElement(item, canvasW, canvasH));
      }
      if (zones.length > 0) return zones;
    }
  }

  // 2. Try parsing standard JSON elements list or object
  try {
    // Check if clean string contains an elements array or list of objects
    const hasElementsArray = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (hasElementsArray) {
      let parsed: any;
      try {
        parsed = JSON.parse(hasElementsArray[0]);
      } catch {
        // If snippet was copied without outer bracket, wrap in array
        if (clean.includes('"id"') && clean.includes('"x"')) {
          const wrapped = `[${clean.replace(/^\s*,?/, "").replace(/,?\s*$/, "")}]`;
          parsed = JSON.parse(wrapped);
        }
      }

      if (parsed) {
        let elementsList: any[] = [];
        let canvasW = 1024;
        let canvasH = 1536;

        if (parsed.canvas) {
          canvasW = parsed.canvas.width || 1024;
          canvasH = parsed.canvas.height || 1536;
        }

        if (Array.isArray(parsed)) {
          elementsList = parsed;
        } else if (Array.isArray(parsed.elements)) {
          elementsList = parsed.elements;
        }

        if (elementsList.length > 0) {
          for (const item of elementsList) {
            if (item && typeof item === "object" && item.x !== undefined && item.y !== undefined) {
              zones.push(convertRawElement(item, canvasW, canvasH));
            }
          }
          if (zones.length > 0) return zones;
        }

        // Handle simple photo/name object format
        if (parsed.photo || parsed.avatar || parsed.leader) {
          const p = parsed.photo || parsed.avatar || parsed.leader;
          const x = Array.isArray(p) ? p[0] : (p.x ?? 6);
          const y = Array.isArray(p) ? p[1] : (p.y ?? 6);
          const w = Array.isArray(p) ? p[2] : (p.width ?? p.w ?? 48);
          const h = Array.isArray(p) ? p[3] : (p.height ?? p.h ?? 62);
          const shape = (p.shape || "cutout") as "cutout" | "circle" | "squircle" | "rectangle";
          zones.push({
            id: `zone-ai-photo-${Date.now().toString(36)}`,
            type: "photo",
            label: "Leader / User Photo",
            x: Math.max(0, Math.min(95, parseFloat(x) || 6)),
            y: Math.max(0, Math.min(95, parseFloat(y) || 6)),
            width: Math.max(5, Math.min(100, parseFloat(w) || 48)),
            height: Math.max(5, Math.min(100, parseFloat(h) || 62)),
            photoShape: shape,
            borderWidth: shape === "cutout" ? 0 : 3,
            featherBottom: shape === "cutout",
            objectFit: shape === "cutout" ? "contain" : "cover",
            shadow: shape !== "cutout",
            zIndex: 4,
          });
        }

        if (parsed.name || parsed.text || parsed.banner) {
          const t = parsed.name || parsed.banner || (Array.isArray(parsed.text) ? parsed.text[0] : parsed.text);
          const x = Array.isArray(t) ? t[0] : (t.x ?? 12);
          const y = Array.isArray(t) ? t[1] : (t.y ?? 88);
          const w = Array.isArray(t) ? t[2] : (t.width ?? t.w ?? 76);
          const h = Array.isArray(t) ? t[3] : (t.height ?? t.h ?? 8);
          zones.push({
            id: `zone-ai-name-${Date.now().toString(36)}`,
            type: "text",
            label: "Name Banner",
            textBinding: "name",
            x: Math.max(0, Math.min(95, parseFloat(x) || 12)),
            y: Math.max(0, Math.min(95, parseFloat(y) || 88)),
            width: Math.max(10, Math.min(100, parseFloat(w) || 76)),
            height: Math.max(3, Math.min(50, parseFloat(h) || 8)),
            fontSize: 15,
            fontWeight: "800",
            fontFamily: "Poppins",
            color: "#241002",
            alignment: "center",
            autoFitText: true,
            wrapText: true,
            zIndex: 5,
          });
        }

        if (zones.length > 0) return zones;
      }
    }
  } catch {
    // Continue to regex patterns
  }

  // 2. Tag / Function format: PHOTO(6, 6, 48, 62, cutout) or NAME(12, 88, 76, 8)
  const funcRegex = /(PHOTO|AVATAR|IMAGE|NAME|TEXT|BANNER|HEADER|TITLE|DESIGNATION|PHONE)\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*([a-zA-Z0-9_-]+))?\s*\)/gi;
  let match: RegExpExecArray | null;
  while ((match = funcRegex.exec(clean)) !== null) {
    const kind = match[1].toUpperCase();
    const x = parseFloat(match[2]);
    const y = parseFloat(match[3]);
    const w = parseFloat(match[4]);
    const h = parseFloat(match[5]);
    const extra = (match[6] || "").toLowerCase();

    if (kind === "PHOTO" || kind === "AVATAR" || kind === "IMAGE") {
      const shape = extra === "circle" ? "circle" : (extra === "rectangle" ? "rectangle" : (extra === "squircle" ? "squircle" : "cutout"));
      zones.push({
        id: `zone-ai-photo-${zones.length + 1}-${Date.now().toString(36)}`,
        type: "photo",
        label: "Leader / User Photo",
        x: Math.max(0, Math.min(95, x)),
        y: Math.max(0, Math.min(95, y)),
        width: Math.max(5, Math.min(100, w)),
        height: Math.max(5, Math.min(100, h)),
        photoShape: shape,
        borderWidth: shape === "cutout" ? 0 : 3,
        featherBottom: shape === "cutout",
        objectFit: shape === "cutout" ? "contain" : "cover",
        shadow: shape !== "cutout",
        zIndex: 4,
      });
    } else {
      const isHeader = kind === "HEADER" || kind === "TITLE";
      const binding = isHeader ? "custom" : (kind === "DESIGNATION" ? "designation" : (kind === "PHONE" ? "phone" : "name"));
      zones.push({
        id: `zone-ai-text-${zones.length + 1}-${Date.now().toString(36)}`,
        type: "text",
        label: isHeader ? "Header Badge" : "Name Banner",
        textBinding: binding,
        customText: isHeader ? "Festival Greeting" : undefined,
        x: Math.max(0, Math.min(95, x)),
        y: Math.max(0, Math.min(95, y)),
        width: Math.max(10, Math.min(100, w)),
        height: Math.max(3, Math.min(50, h)),
        fontSize: isHeader ? 13 : 15,
        fontWeight: "800",
        fontFamily: "Poppins",
        color: isHeader ? "#78350F" : "#241002",
        alignment: "center",
        autoFitText: true,
        wrapText: true,
        zIndex: 5,
      });
    }
  }

  if (zones.length > 0) return zones;

  // 3. Key-Value format: PHOTO: x=6, y=6, w=48, h=62 or PHOTO: 6, 6, 48, 62
  const kvRegex = /(PHOTO|AVATAR|IMAGE|NAME|TEXT|BANNER|HEADER)[\s:=]+(?:x\s*=\s*)?(\d+(?:\.\d+)?)%?[\s,]+(?:y\s*=\s*)?(\d+(?:\.\d+)?)%?[\s,]+(?:w(?:idth)?\s*=\s*)?(\d+(?:\.\d+)?)%?[\s,]+(?:h(?:eight)?\s*=\s*)?(\d+(?:\.\d+)?)%?/gi;
  while ((match = kvRegex.exec(clean)) !== null) {
    const kind = match[1].toUpperCase();
    const x = parseFloat(match[2]);
    const y = parseFloat(match[3]);
    const w = parseFloat(match[4]);
    const h = parseFloat(match[5]);

    if (kind === "PHOTO" || kind === "AVATAR" || kind === "IMAGE") {
      zones.push({
        id: `zone-ai-photo-${zones.length + 1}-${Date.now().toString(36)}`,
        type: "photo",
        label: "Leader / User Photo",
        x: Math.max(0, Math.min(95, x)),
        y: Math.max(0, Math.min(95, y)),
        width: Math.max(5, Math.min(100, w)),
        height: Math.max(5, Math.min(100, h)),
        photoShape: "cutout",
        borderWidth: 0,
        featherBottom: true,
        objectFit: "contain",
        shadow: false,
        zIndex: 4,
      });
    } else {
      zones.push({
        id: `zone-ai-text-${zones.length + 1}-${Date.now().toString(36)}`,
        type: "text",
        label: "Name Banner",
        textBinding: "name",
        x: Math.max(0, Math.min(95, x)),
        y: Math.max(0, Math.min(95, y)),
        width: Math.max(10, Math.min(100, w)),
        height: Math.max(3, Math.min(50, h)),
        fontSize: 15,
        fontWeight: "800",
        fontFamily: "Poppins",
        color: "#241002",
        alignment: "center",
        autoFitText: true,
        wrapText: true,
        zIndex: 5,
      });
    }
  }

  return zones;
}

/**
 * Parses a ChatGPT / PostHub SVG template file.
 * Extracts:
 * 1. Embedded background artwork base64 image (if present)
 * 2. Canvas dimensions (width, height)
 * 3. Structured TemplateSlotZone[] from SVG metadata CDATA or rect elements
 */
export function parseSvgTemplate(svgString: string): {
  backgroundUrl?: string;
  zones: TemplateSlotZone[];
  canvasWidth: number;
  canvasHeight: number;
} {
  const result = {
    backgroundUrl: undefined as string | undefined,
    zones: [] as TemplateSlotZone[],
    canvasWidth: 1024,
    canvasHeight: 1536,
  };

  if (!svgString || typeof svgString !== "string") return result;

  // 1. Extract dimensions
  const viewboxMatch = svgString.match(/viewBox=["']\s*0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*["']/i);
  const wMatch = svgString.match(/width=["'](\d+(?:\.\d+)?)["']/i);
  const hMatch = svgString.match(/height=["'](\d+(?:\.\d+)?)["']/i);
  result.canvasWidth = viewboxMatch ? parseFloat(viewboxMatch[1]) : (wMatch ? parseFloat(wMatch[1]) : 1024);
  result.canvasHeight = viewboxMatch ? parseFloat(viewboxMatch[2]) : (hMatch ? parseFloat(hMatch[2]) : 1536);

  // 2. Extract embedded background image
  const imgMatch = svgString.match(/<image[^>]+(?:xlink:href|href)=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    result.backgroundUrl = imgMatch[1];
  }

  // 3. Extract JSON from <metadata><![CDATA[ ... ]]></metadata>
  const metaMatch = svgString.match(/<metadata>[\s\S]*?<!\[CDATA\[([\s\S]*?)\]\]>[\s\S]*?<\/metadata>/i);
  if (metaMatch) {
    try {
      const json = JSON.parse(metaMatch[1].trim());
      if (Array.isArray(json.elements) && json.elements.length > 0) {
        for (const el of json.elements) {
          result.zones.push(convertRawElement(el, result.canvasWidth, result.canvasHeight));
        }
        if (result.zones.length > 0) return result;
      }
    } catch {
      // Fallback to rect extraction
    }
  }

  // 4. Fallback: Parse <rect id="..." ... /> tags inside SVG
  const rectRegex = /<rect\s+([^>]+)>/gi;
  let rectMatch: RegExpExecArray | null;
  while ((rectMatch = rectRegex.exec(svgString)) !== null) {
    const attrs = rectMatch[1];
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    const xMatch = attrs.match(/x=["'](\d+(?:\.\d+)?)["']/i);
    const yMatch = attrs.match(/y=["'](\d+(?:\.\d+)?)["']/i);
    const widthMatch = attrs.match(/width=["'](\d+(?:\.\d+)?)["']/i);
    const heightMatch = attrs.match(/height=["'](\d+(?:\.\d+)?)["']/i);

    if (idMatch && xMatch && yMatch && widthMatch && heightMatch) {
      const id = idMatch[1];
      // Skip background or frame rects
      if (id.toLowerCase().includes("background") || id.toLowerCase().includes("frame")) continue;

      const raw = {
        id,
        x: parseFloat(xMatch[1]),
        y: parseFloat(yMatch[1]),
        width: parseFloat(widthMatch[1]),
        height: parseFloat(heightMatch[1]),
      };
      result.zones.push(convertRawElement(raw, result.canvasWidth, result.canvasHeight));
    }
  }

  return result;
}

/**
 * Extracts embedded text/code from image binary buffers (PNG chunks, JPEG markers).
 */
export function extractMetadataFromBuffer(buffer: ArrayBuffer): string | null {
  try {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 32) return null;

    // Convert sample ascii strings (look for POSTHUB or PHOTO)
    const textDecoder = new TextDecoder("latin1");
    const raw = textDecoder.decode(bytes);

    // Look for POSTHUB_SPEC or POSTHUB or PHOTO(
    const match = raw.match(/POSTHUB_SPEC:[^\r\n"'>}]+|PHOTO\s*\([^)]+\)[^"'>}\r\n]*/i);
    if (match) {
      return match[0].trim();
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

/**
 * Client-Side Canvas Pixel Auto-Detection:
 * Inspects image pixels to find:
 * 1. Leader Cutout Silhouette (solid bright white region in upper/middle left)
 * 2. Bottom Blank Banner (solid/cream banner in bottom 25%)
 * 3. Top Header Badge (badge in top-right)
 */
export function detectSlotsFromImageElement(img: HTMLImageElement): {
  zones: TemplateSlotZone[];
  detectedSilhouette: boolean;
  detectedBanner: boolean;
  detectedHeader: boolean;
} {
  const result = {
    zones: [] as TemplateSlotZone[],
    detectedSilhouette: false,
    detectedBanner: false,
    detectedHeader: false,
  };

  try {
    const canvas = document.createElement("canvas");
    const scanW = 100;
    const scanH = Math.round(100 * ((img.naturalHeight || img.height || 133) / (img.naturalWidth || img.width || 100)));
    canvas.width = scanW;
    canvas.height = scanH;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return result;

    ctx.drawImage(img, 0, 0, scanW, scanH);
    const imageData = ctx.getImageData(0, 0, scanW, scanH);
    const data = imageData.data;

    // 1. Scan for Silhouette Cutout:
    // Neutral white or gray placeholder (R,G,B >= 140 with low saturation) across x: 2..98%, y: 2..78%
    let silMinX = scanW, silMaxX = 0, silMinY = scanH, silMaxY = 0;
    let silCount = 0;

    const maxYScan = Math.round(scanH * 0.78);
    const maxXScan = Math.round(scanW * 0.98);
    const minYScan = Math.round(scanH * 0.03);
    const minXScan = Math.round(scanW * 0.02);

    for (let y = minYScan; y < maxYScan; y++) {
      for (let x = minXScan; x < maxXScan; x++) {
        const idx = (y * scanW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const isNeutral = Math.abs(r - g) <= 16 && Math.abs(g - b) <= 16 && Math.abs(r - b) <= 16;
        const isSilhouette = isNeutral && r >= 140;
        if (isSilhouette) {
          silCount++;
          if (x < silMinX) silMinX = x;
          if (x > silMaxX) silMaxX = x;
          if (y < silMinY) silMinY = y;
          if (y > silMaxY) silMaxY = y;
        }
      }
    }

    const silW = silMaxX - silMinX + 1;
    const silH = silMaxY - silMinY + 1;
    const silWPct = Math.round((silW / scanW) * 100);
    const silHPct = Math.round((silH / scanH) * 100);

    if (silCount > 70 && silWPct >= 16 && silHPct >= 22) {
      result.detectedSilhouette = true;
      const xPct = Math.max(2, Math.round((silMinX / scanW) * 100));
      const yPct = Math.max(2, Math.round((silMinY / scanH) * 100));
      result.zones.push({
        id: `zone-detected-photo-${Date.now().toString(36)}`,
        type: "photo",
        label: "AI Leader Silhouette",
        x: xPct,
        y: yPct,
        width: Math.min(100 - xPct, silWPct),
        height: Math.min(100 - yPct, silHPct),
        photoShape: "cutout",
        borderWidth: 0,
        featherBottom: true,
        objectFit: "contain",
        shadow: false,
        zIndex: 4,
      });
    }

    // 2. Scan for Bottom Name Banner Box:
    // In bottom area y: 70%..97%, x: 5%..95%, looking for light cream/white box
    let banMinX = scanW, banMaxX = 0, banMinY = scanH, banMaxY = 0;
    let banCount = 0;

    const banMinYScan = Math.round(scanH * 0.70);
    const banMaxYScan = Math.round(scanH * 0.98);
    const banMinXScan = Math.round(scanW * 0.05);
    const banMaxXScan = Math.round(scanW * 0.95);

    for (let y = banMinYScan; y < banMaxYScan; y++) {
      for (let x = banMinXScan; x < banMaxXScan; x++) {
        const idx = (y * scanW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // High brightness / cream / white banner
        const isBanner = (r >= 200 && g >= 190 && b >= 160) || (r >= 230 && g >= 230 && b >= 230);
        if (isBanner) {
          banCount++;
          if (x < banMinX) banMinX = x;
          if (x > banMaxX) banMaxX = x;
          if (y < banMinY) banMinY = y;
          if (y > banMaxY) banMaxY = y;
        }
      }
    }

    const banW = banMaxX - banMinX + 1;
    const banH = banMaxY - banMinY + 1;
    const banWPct = Math.round((banW / scanW) * 100);
    const banHPct = Math.round((banH / scanH) * 100);

    if (banCount > 35 && banWPct >= 32 && banHPct >= 5) {
      result.detectedBanner = true;
      const xPct = Math.max(5, Math.round((banMinX / scanW) * 100));
      const yPct = Math.max(70, Math.round((banMinY / scanH) * 100));
      result.zones.push({
        id: `zone-detected-name-${Date.now().toString(36)}`,
        type: "text",
        label: "Bottom Name Banner",
        textBinding: "name",
        x: xPct,
        y: yPct,
        width: Math.min(100 - xPct, banWPct),
        height: Math.min(100 - yPct, banHPct),
        fontSize: 15,
        fontWeight: "800",
        fontFamily: "Poppins",
        color: "#241002",
        alignment: "center",
        autoFitText: true,
        wrapText: true,
        zIndex: 5,
      });
    }

    // 3. Scan for Top-Right Header Badge (e.g. Greeting Pill):
    // In y: 10%..35%, x: 45%..95%
    let hdrMinX = scanW, hdrMaxX = 0, hdrMinY = scanH, hdrMaxY = 0;
    let hdrCount = 0;

    const hdrMinYScan = Math.round(scanH * 0.10);
    const hdrMaxYScan = Math.round(scanH * 0.35);
    const hdrMinXScan = Math.round(scanW * 0.45);
    const hdrMaxXScan = Math.round(scanW * 0.95);

    for (let y = hdrMinYScan; y < hdrMaxYScan; y++) {
      for (let x = hdrMinXScan; x < hdrMaxXScan; x++) {
        const idx = (y * scanW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const isHeader = r >= 205 && g >= 195 && b >= 165;
        if (isHeader) {
          hdrCount++;
          if (x < hdrMinX) hdrMinX = x;
          if (x > hdrMaxX) hdrMaxX = x;
          if (y < hdrMinY) hdrMinY = y;
          if (y > hdrMaxY) hdrMaxY = y;
        }
      }
    }

    const hdrW = hdrMaxX - hdrMinX + 1;
    const hdrH = hdrMaxY - hdrMinY + 1;
    const hdrWPct = Math.round((hdrW / scanW) * 100);
    const hdrHPct = Math.round((hdrH / scanH) * 100);

    if (hdrCount > 25 && hdrWPct >= 20 && hdrHPct >= 4 && hdrWPct <= 60 && hdrHPct <= 18) {
      result.detectedHeader = true;
      const xPct = Math.max(40, Math.round((hdrMinX / scanW) * 100));
      const yPct = Math.max(5, Math.round((hdrMinY / scanH) * 100));
      result.zones.push({
        id: `zone-detected-header-${Date.now().toString(36)}`,
        type: "text",
        label: "Header Greeting",
        textBinding: "custom",
        customText: "शुभ दीपावली",
        x: xPct,
        y: yPct,
        width: Math.min(100 - xPct, hdrWPct),
        height: Math.min(100 - yPct, hdrHPct),
        fontSize: 14,
        fontWeight: "800",
        fontFamily: "Poppins",
        color: "#78350F",
        alignment: "center",
        autoFitText: true,
        wrapText: true,
        zIndex: 5,
      });
    }
  } catch {
    // Graceful error fallback
  }

  return result;
}

/**
 * Standard Prompt to give to ChatGPT so it generates images and code ready for PostHub:
 */
export const CHATGPT_POSTER_PROMPT_TEMPLATE = `Create a professional Indian festival greeting poster in 3:4 aspect ratio.
Requirements:
1. On the left side, leave a clean blank solid white silhouette of a person/leader for photo placement.
2. At the bottom, leave a clean blank rounded rectangular cream banner for name and designation.
3. At the top right, leave a small clean banner for festival greeting text.
4. In your chat reply, provide this exact PostHub code:
[POSTHUB: PHOTO(6, 6, 48, 62, cutout) NAME(12, 88, 76, 8) HEADER(54, 16, 38, 7)]`;
