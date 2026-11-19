import type { TemplateSlotZone } from "./templates.ts";

/**
 * Universal PostHub AI Slot Specification Parser
 * Supports:
 * 1. Tag format: POSTHUB_SPEC: PHOTO(6, 6, 48, 62, cutout) NAME(12, 88, 76, 8) HEADER(54, 16, 38, 7)
 * 2. Key-value format: PHOTO: x=6, y=6, w=48, h=62, shape=cutout | NAME: x=12, y=88, w=76, h=8
 * 3. Short numbers: PHOTO: 6, 6, 48, 62 | NAME: 12, 88, 76, 8
 * 4. JSON: {"photo": [6,6,48,62], "name": [12,88,76,8]} or {"photo": {"x": 6, "y": 6, "width": 48, "height": 62}}
 * 5. Conversational text from ChatGPT: "photo portion is x=6%, y=6%, width=48%, height=62% and text is x=12%, y=88%..."
 */
export function parsePostHubSpec(rawText: string): TemplateSlotZone[] {
  const zones: TemplateSlotZone[] = [];
  if (!rawText || typeof rawText !== "string") return zones;

  const clean = rawText.trim();

  // 1. Try parsing JSON block if present
  try {
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
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

    // 1. Scan for White Silhouette Cutout:
    // Solid white (R,G,B >= 235 with low color difference) in x: 0..70%, y: 2..75%
    let silMinX = scanW, silMaxX = 0, silMinY = scanH, silMaxY = 0;
    let silCount = 0;

    const maxYScan = Math.round(scanH * 0.72);
    const maxXScan = Math.round(scanW * 0.68);
    const minYScan = Math.round(scanH * 0.03);
    const minXScan = Math.round(scanW * 0.02);

    for (let y = minYScan; y < maxYScan; y++) {
      for (let x = minXScan; x < maxXScan; x++) {
        const idx = (y * scanW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const isWhite = r >= 235 && g >= 235 && b >= 235 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12;
        if (isWhite) {
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
    // In bottom area y: 78%..97%, x: 8%..92%, looking for light cream/white box
    let banMinX = scanW, banMaxX = 0, banMinY = scanH, banMaxY = 0;
    let banCount = 0;

    const banMinYScan = Math.round(scanH * 0.78);
    const banMaxYScan = Math.round(scanH * 0.98);
    const banMinXScan = Math.round(scanW * 0.08);
    const banMaxXScan = Math.round(scanW * 0.92);

    for (let y = banMinYScan; y < banMaxYScan; y++) {
      for (let x = banMinXScan; x < banMaxXScan; x++) {
        const idx = (y * scanW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        // High brightness / cream / light banner
        const isBanner = r >= 205 && g >= 195 && b >= 165;
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
