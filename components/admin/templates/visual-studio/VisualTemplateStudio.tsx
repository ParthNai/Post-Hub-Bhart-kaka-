"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Camera,
  Type,
  Square,
  Move,
  Trash2,
  Copy,
  Eye,
  Save,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Sliders,
  Check,
  AlertCircle,
  HelpCircle,
  Undo2,
  Plus,
  Maximize2,
  Code2,
} from "lucide-react";
import {
  parsePostHubSpec,
  parseSvgTemplate,
  detectSlotsFromImageElement,
  extractMetadataFromBuffer,
  CHATGPT_POSTER_PROMPT_TEMPLATE,
} from "@/lib/ai-slot-detector";
import {
  PosterTemplate,
  TemplateSlotZone,
  SlotZoneType,
  PhotoSlotShape,
  TextSlotBinding,
  TemplateFormat,
  TemplateCategory,
} from "@/lib/templates";

// Preset AI Backgrounds (ChatGPT / Midjourney style festival & business posters)
const AI_PRESET_BACKGROUNDS = [
  {
    id: "preset-chatgpt-diwali-silhouette",
    name: "AI Diwali Leader Silhouette (ChatGPT)",
    category: "Festival" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1080&q=80",
    gradient: "linear-gradient(135deg, #FF6F00 0%, #D84315 50%, #4E0D3A 100%)",
  },
  {
    id: "preset-festival-diwali",
    name: "Diwali Golden Spark",
    category: "Festival" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1080&q=80",
    gradient: "radial-gradient(circle at 50% 60%, #78350F 0%, #451A03 55%, #1C0902 100%)",
  },
  {
    id: "preset-cyber-cafe",
    name: "Cyberpunk Neon Cafe",
    category: "Promotion" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80",
    gradient: "linear-gradient(135deg, #1A102F 0%, #2D1445 50%, #00C4CC 100%)",
  },
  {
    id: "preset-business-summit",
    name: "Executive Leadership Summit",
    category: "Business" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80",
    gradient: "linear-gradient(145deg, #0F172A 0%, #1E3A8A 60%, #0284C7 100%)",
  },
  {
    id: "preset-festival-holi",
    name: "Festival of Colors & Joy",
    category: "Festival" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1080&q=80",
    gradient: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)",
  },
];

// Sample user profiles for live testing
const SAMPLE_TEST_USERS = [
  {
    id: "u1",
    name: "Parth Patel",
    designation: "Founder & Creative Director",
    phone: "+91 98765 43210",
    businessName: "Post Hub Studio",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "u2",
    name: "Maya Sharma",
    designation: "Marketing Specialist",
    phone: "+91 91234 56789",
    businessName: "Digital Brand Spark",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "u3",
    name: "Dr. Rajesh Rao",
    designation: "Senior Healthcare Director",
    phone: "+91 99887 76655",
    businessName: "City Wellness Centre",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
  },
];

interface VisualTemplateStudioProps {
  initialTemplate?: PosterTemplate;
  onSaved?: (template: PosterTemplate) => void;
}

export const VisualTemplateStudio: React.FC<VisualTemplateStudioProps> = ({
  initialTemplate,
  onSaved,
}) => {
  const router = useRouter();

  // Template basic info
  const [templateName, setTemplateName] = useState(
    initialTemplate?.name || "Custom AI Festival Template"
  );
  const [category, setCategory] = useState<TemplateCategory>(
    initialTemplate?.category || "Festival"
  );
  const [format, setFormat] = useState<TemplateFormat>(
    initialTemplate?.format || "3:4"
  );
  const [status, setStatus] = useState<"Draft" | "Published">(
    initialTemplate?.status === "Published" ? "Published" : "Draft"
  );

  // Background artwork
  const [backgroundUrl, setBackgroundUrl] = useState<string>(
    initialTemplate?.backgroundImageUrl || AI_PRESET_BACKGROUNDS[0].url
  );
  // Auto-adapted artwork aspect ratio (width / height) to prevent any image cropping
  const [artworkAspectRatio, setArtworkAspectRatio] = useState<number | null>(null);

  // Automatically measure loaded image's natural dimensions
  useEffect(() => {
    if (!backgroundUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setArtworkAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = backgroundUrl;
  }, [backgroundUrl]);

  // Slot zones list
  const [zones, setZones] = useState<TemplateSlotZone[]>(
    initialTemplate?.slotZones || [
      {
        id: "zone-photo-1",
        type: "photo",
        label: "User Photo",
        x: 10,
        y: 72,
        width: 22,
        height: 22,
        photoShape: "circle",
        borderColor: "#FFFFFF",
        borderWidth: 3,
        shadow: true,
      },
      {
        id: "zone-shape-footer",
        type: "shape",
        label: "Contact Bar",
        x: 6,
        y: 74,
        width: 88,
        height: 18,
        shapeType: "pill",
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        borderRadius: 999,
        opacity: 0.95,
      },
      {
        id: "zone-text-name",
        type: "text",
        label: "User Name",
        x: 35,
        y: 76,
        width: 55,
        height: 6,
        textBinding: "name",
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "700",
        fontFamily: "Poppins",
        alignment: "left",
        textShadow: true,
      },
      {
        id: "zone-text-phone",
        type: "text",
        label: "Phone / Designation",
        x: 35,
        y: 83,
        width: 55,
        height: 5,
        textBinding: "phone",
        fontSize: 11,
        color: "#00C4CC",
        fontWeight: "600",
        fontFamily: "Inter",
        alignment: "left",
        textShadow: true,
      },
    ]
  );

  // Tool / interaction state
  const [activeTool, setActiveTool] = useState<
    "select" | "draw_photo" | "draw_text" | "draw_shape"
  >("select");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
    "zone-photo-1"
  );

  // Active moving & resizing state for a selected zone
  const [dragState, setDragState] = useState<{
    type: "move" | "resize";
    zoneId: string;
    handle?: "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";
    startClientX: number;
    startClientY: number;
    initialZone: TemplateSlotZone;
  } | null>(null);

  // Drag selection state (Snipping Tool style)
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Testing mode
  const [previewWithUserData, setPreviewWithUserData] = useState(true);
  const [activeTestUser, setActiveTestUser] = useState(SAMPLE_TEST_USERS[0]);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Spec Code Import Modal & Prompt Copy state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCodeText, setImportCodeText] = useState("");
  const [aiDetectedNotification, setAiDetectedNotification] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);

  // Canvas container ref
  const canvasRef = useRef<HTMLDivElement>(null);

  // Selected zone object
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;

  // Handle mousedown on a zone (initiates free drag to move)
  const handleZoneMouseDown = (e: React.MouseEvent, zone: TemplateSlotZone) => {
    // If draw tool is active, let canvas mousedown handle drawing
    if (activeTool !== "select") return;

    e.stopPropagation();
    setSelectedZoneId(zone.id);

    setDragState({
      type: "move",
      zoneId: zone.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialZone: { ...zone },
    });
  };

  // Handle mousedown on an 8-point resize handle
  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    zone: TemplateSlotZone,
    handle: "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se"
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedZoneId(zone.id);

    setDragState({
      type: "resize",
      zoneId: zone.id,
      handle,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialZone: { ...zone },
    });
  };

  // Global mousemove & mouseup listeners for fluid moving and resizing
  useEffect(() => {
    if (!dragState) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dxPercent = ((e.clientX - dragState.startClientX) / rect.width) * 100;
      const dyPercent = ((e.clientY - dragState.startClientY) / rect.height) * 100;
      const init = dragState.initialZone;

      if (dragState.type === "move") {
        const maxX = Math.max(0, 100 - init.width);
        const maxY = Math.max(0, 100 - init.height);
        const newX = Math.round(Math.max(0, Math.min(maxX, init.x + dxPercent)) * 10) / 10;
        const newY = Math.round(Math.max(0, Math.min(maxY, init.y + dyPercent)) * 10) / 10;

        setZones((prev) =>
          prev.map((z) => (z.id === dragState.zoneId ? { ...z, x: newX, y: newY } : z))
        );
      } else if (dragState.type === "resize" && dragState.handle) {
        const h = dragState.handle;
        let newX = init.x;
        let newY = init.y;
        let newW = init.width;
        let newH = init.height;

        // Horizontal sizing
        if (h.includes("e")) {
          newW = Math.max(3, Math.min(100 - init.x, init.width + dxPercent));
        } else if (h.includes("w")) {
          const rightEdge = init.x + init.width;
          newX = Math.max(0, Math.min(rightEdge - 3, init.x + dxPercent));
          newW = rightEdge - newX;
        }

        // Vertical sizing
        if (h.includes("s")) {
          newH = Math.max(3, Math.min(100 - init.y, init.height + dyPercent));
        } else if (h.includes("n")) {
          const bottomEdge = init.y + init.height;
          newY = Math.max(0, Math.min(bottomEdge - 3, init.y + dyPercent));
          newH = bottomEdge - newY;
        }

        newX = Math.round(newX * 10) / 10;
        newY = Math.round(newY * 10) / 10;
        newW = Math.round(newW * 10) / 10;
        newH = Math.round(newH * 10) / 10;

        setZones((prev) =>
          prev.map((z) =>
            z.id === dragState.zoneId
              ? { ...z, x: newX, y: newY, width: newW, height: newH }
              : z
          )
        );
      }
    };

    const onMouseUp = () => {
      setDragState(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragState]);

  // Keyboard navigation for nudge (Arrow Keys) & Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!selectedZoneId) return;
      const current = zones.find((z) => z.id === selectedZoneId);
      if (!current) return;

      const step = e.shiftKey ? 2.0 : 0.5;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newX = Math.max(0, Math.round((current.x - step) * 10) / 10);
        updateSelectedZone({ x: newX });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newX = Math.min(100 - current.width, Math.round((current.x + step) * 10) / 10);
        updateSelectedZone({ x: newX });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newY = Math.max(0, Math.round((current.y - step) * 10) / 10);
        updateSelectedZone({ y: newY });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const newY = Math.min(100 - current.height, Math.round((current.y + step) * 10) / 10);
        updateSelectedZone({ y: newY });
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDeleteZone(current.id);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedZoneId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedZoneId, zones]);

  // Handle image upload from computer (ChatGPT generated image, SVG templates, etc.)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isSvg = file.name.toLowerCase().endsWith(".svg") || file.type.includes("svg");

    if (!file.type.startsWith("image/") && !isSvg) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP, SVG).");
      return;
    }

    // 0. Handle ChatGPT SVG Template with embedded artwork & metadata slots
    if (isSvg) {
      file.text().then((svgText) => {
        const parsed = parseSvgTemplate(svgText);
        if (parsed.canvasWidth && parsed.canvasHeight) {
          setArtworkAspectRatio(parsed.canvasWidth / parsed.canvasHeight);
        }
        if (parsed.backgroundUrl) {
          setBackgroundUrl(parsed.backgroundUrl);
        }
        if (parsed.zones.length > 0) {
          setZones(parsed.zones);
          setSelectedZoneId(parsed.zones[0].id);
          setAiDetectedNotification(`✨ Loaded ${parsed.zones.length} slots and background artwork from ChatGPT SVG!`);
        } else {
          setAiDetectedNotification("Loaded SVG artwork.");
        }
        setErrorMessage(null);
      }).catch(() => {
        setErrorMessage("Failed to read SVG template file.");
      });
      return;
    }

    // 1. Try reading metadata buffer for embedded code (PNG chunks or JPEG comments)
    file.arrayBuffer().then((buf) => {
      const extracted = extractMetadataFromBuffer(buf);
      if (extracted) {
        const parsed = parsePostHubSpec(extracted);
        if (parsed.length > 0) {
          setZones(parsed);
          setSelectedZoneId(parsed[0].id);
          setAiDetectedNotification(`✨ Embedded AI code detected in image! Auto-configured ${parsed.length} slots.`);
        }
      }
    }).catch(() => {});

    // 2. Read as data URL for canvas display
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setBackgroundUrl(dataUrl);
        setErrorMessage(null);

        // 3. Auto-detect slots from image pixels via offscreen canvas
        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.onload = () => {
          const detected = detectSlotsFromImageElement(tempImg);
          if (detected.zones.length > 0) {
            setZones(detected.zones);
            setSelectedZoneId(detected.zones[0].id);
            setAiDetectedNotification(
              `🪄 Auto-detected ${detected.zones.length} slots from image (${detected.detectedSilhouette ? "Leader Silhouette" : ""}${detected.detectedBanner ? " + Name Banner" : ""}${detected.detectedHeader ? " + Header Badge" : ""})!`
            );
          }
        };
        tempImg.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-scan current background image canvas pixels for silhouettes and banners
  const handleScanCurrentBackground = () => {
    if (!backgroundUrl) {
      setErrorMessage("Please upload or select an image first.");
      return;
    }

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.onload = () => {
      const detected = detectSlotsFromImageElement(tempImg);
      if (detected.zones.length > 0) {
        setZones(detected.zones);
        setSelectedZoneId(detected.zones[0].id);
        setAiDetectedNotification(
          `🪄 Auto-detected ${detected.zones.length} slots from image (${detected.detectedSilhouette ? "Leader Silhouette" : ""}${detected.detectedBanner ? " + Name Banner" : ""}${detected.detectedHeader ? " + Header Badge" : ""})!`
        );
      } else {
        setAiDetectedNotification("Could not find distinct silhouette or banner. You can use the quick preset buttons or paste code.");
      }
    };
    tempImg.src = backgroundUrl;
  };

  // Import ChatGPT code, JSON coordinates, or raw SVG code from text
  const handleApplyImportedCode = () => {
    const raw = importCodeText.trim();
    if (!raw) return;

    // 0. If user pasted raw SVG markup code (<svg ...>...</svg>)
    if (raw.includes("<svg")) {
      const parsedSvg = parseSvgTemplate(raw);
      if (parsedSvg.backgroundUrl) {
        setBackgroundUrl(parsedSvg.backgroundUrl);
      }
      if (parsedSvg.canvasWidth && parsedSvg.canvasHeight) {
        setArtworkAspectRatio(parsedSvg.canvasWidth / parsedSvg.canvasHeight);
      }
      if (parsedSvg.zones.length > 0) {
        setZones(parsedSvg.zones);
        setSelectedZoneId(parsedSvg.zones[0].id);
        setShowImportModal(false);
        setImportCodeText("");
        setAiDetectedNotification(
          `✨ Loaded background artwork & ${parsedSvg.zones.length} slots from pasted SVG code!`
        );
        return;
      }
    }

    // 1. Otherwise parse coordinate tags, JSON elements, or key-values
    const parsed = parsePostHubSpec(raw);
    if (parsed.length > 0) {
      setZones(parsed);
      setSelectedZoneId(parsed[0].id);
      setShowImportModal(false);
      setImportCodeText("");
      setAiDetectedNotification(`✨ Successfully imported ${parsed.length} slots from ChatGPT code!`);
    } else {
      setErrorMessage("Could not parse coordinates from the pasted text. Please check the format.");
    }
  };

  // Copy standard ChatGPT instruction prompt to clipboard
  const handleCopyChatGPTTemplate = () => {
    navigator.clipboard.writeText(CHATGPT_POSTER_PROMPT_TEMPLATE).then(() => {
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2500);
    });
  };

  // One-click presets for ChatGPT / AI festival posters with silhouette cutouts:
  const handleAddLeftLeaderCutout = () => {
    const newId = `zone-leader-${Date.now().toString(36)}`;
    const newZone: TemplateSlotZone = {
      id: newId,
      type: "photo",
      label: "Left Leader Cutout",
      x: 6,
      y: 6,
      width: 48,
      height: 62,
      photoShape: "cutout",
      borderWidth: 0,
      shadow: false,
      featherBottom: true,
      objectFit: "contain",
      zIndex: 4,
    };
    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newId);
    setActiveTool("select");
  };

  const handleAddBottomDetailsBar = () => {
    const newId = `zone-footer-${Date.now().toString(36)}`;
    const newZone: TemplateSlotZone = {
      id: newId,
      type: "text",
      label: "Bottom Name & Contact",
      x: 10,
      y: 86,
      width: 80,
      height: 10,
      textBinding: "name",
      fontSize: 15,
      color: "#241002",
      fontWeight: "800",
      fontFamily: "Poppins",
      alignment: "center",
      autoFitText: true,
      wrapText: true,
      textShadow: false,
      zIndex: 6,
    };
    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newId);
    setActiveTool("select");
  };

  const handleAddTopHeaderBadge = () => {
    const newId = `zone-header-${Date.now().toString(36)}`;
    const newZone: TemplateSlotZone = {
      id: newId,
      type: "text",
      label: "Top Greeting / Title",
      x: 52,
      y: 15,
      width: 42,
      height: 8,
      textBinding: "custom",
      customText: "शुभ दीपावली",
      fontSize: 16,
      color: "#78350F",
      fontWeight: "800",
      fontFamily: "Poppins",
      alignment: "center",
      autoFitText: true,
      wrapText: true,
      textShadow: false,
      zIndex: 6,
    };
    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newId);
    setActiveTool("select");
  };

  const handleAutoDetectSilhouette = () => {
    const existing = zones.find((z) => z.type === "photo");
    if (existing) {
      updateSelectedZone({
        x: 6,
        y: 6,
        width: 48,
        height: 62,
        photoShape: "cutout",
        borderWidth: 0,
        featherBottom: true,
        objectFit: "contain",
      });
      setSelectedZoneId(existing.id);
    } else {
      handleAddLeftLeaderCutout();
    }
  };

  // Convert mouse event to percentage relative to canvas
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): { x: number; y: number } | null => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    },
    []
  );

  // Start drag selection
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select") {
      // Clicking empty canvas area deselects
      setSelectedZoneId(null);
      return;
    }
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setDrawStart(coords);
    setCurrentBox({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  // Drag selection in progress
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return;
    const coords = getCanvasCoords(e);
    if (!coords) return;

    const x = Math.min(drawStart.x, coords.x);
    const y = Math.min(drawStart.y, coords.y);
    const w = Math.abs(coords.x - drawStart.x);
    const h = Math.abs(coords.y - drawStart.y);

    setCurrentBox({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      w: Math.round(w * 10) / 10,
      h: Math.round(h * 10) / 10,
    });
  };

  // End drag selection and create new zone
  const handleCanvasMouseUp = () => {
    if (!isDrawing || !currentBox) {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentBox(null);
      return;
    }

    // Ignore tiny accidental clicks (must be at least 3% width and height)
    if (currentBox.w < 3 || currentBox.h < 3) {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentBox(null);
      return;
    }

    const newId = `zone-${Date.now().toString(36)}`;

    let newZone: TemplateSlotZone;
    if (activeTool === "draw_photo") {
      newZone = {
        id: newId,
        type: "photo",
        label: "User Photo",
        x: currentBox.x,
        y: currentBox.y,
        width: currentBox.w,
        height: currentBox.h,
        photoShape: currentBox.w === currentBox.h ? "circle" : "squircle",
        borderColor: "#FFFFFF",
        borderWidth: 3,
        shadow: true,
      };
    } else if (activeTool === "draw_text") {
      newZone = {
        id: newId,
        type: "text",
        label: "Text Field",
        x: currentBox.x,
        y: currentBox.y,
        width: currentBox.w,
        height: currentBox.h,
        textBinding: "name",
        fontSize: Math.max(11, Math.min(24, Math.round(currentBox.h * 1.5))),
        color: "#FFFFFF",
        fontWeight: "700",
        fontFamily: "Poppins",
        alignment: "center",
        textShadow: true,
      };
    } else {
      // Shape / Banner
      newZone = {
        id: newId,
        type: "shape",
        label: "Shape Container",
        x: currentBox.x,
        y: currentBox.y,
        width: currentBox.w,
        height: currentBox.h,
        shapeType: currentBox.h > 20 ? "rectangle" : "pill",
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        borderRadius: 8,
        opacity: 0.9,
      };
    }

    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newId);
    setActiveTool("select"); // Return to select mode
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentBox(null);
  };

  // Helper to render floating dimensions and 8-point resize handles around selected zone
  const renderResizeHandles = (zone: TemplateSlotZone) => {
    const handles: Array<{
      id: "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";
      style: React.CSSProperties;
      cursor: string;
    }> = [
      { id: "nw", style: { top: "-5px", left: "-5px" }, cursor: "nwse-resize" },
      { id: "n", style: { top: "-5px", left: "calc(50% - 5px)" }, cursor: "ns-resize" },
      { id: "ne", style: { top: "-5px", right: "-5px" }, cursor: "nesw-resize" },
      { id: "w", style: { top: "calc(50% - 5px)", left: "-5px" }, cursor: "ew-resize" },
      { id: "e", style: { top: "calc(50% - 5px)", right: "-5px" }, cursor: "ew-resize" },
      { id: "sw", style: { bottom: "-5px", left: "-5px" }, cursor: "nesw-resize" },
      { id: "s", style: { bottom: "-5px", left: "calc(50% - 5px)" }, cursor: "ns-resize" },
      { id: "se", style: { bottom: "-5px", right: "-5px" }, cursor: "nwse-resize" },
    ];

    return (
      <>
        {/* Floating Info Tooltip */}
        <div
          style={{
            position: "absolute",
            top: "-28px",
            left: "0",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "#1C1929",
            color: "#FFFFFF",
            fontSize: "10.5px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            whiteSpace: "nowrap",
            zIndex: 60,
            pointerEvents: "none",
            userSelect: "none",
            border: "1px solid rgba(121, 86, 201, 0.4)",
          }}
        >
          <Move size={11} color="#A78BFA" />
          <span>{zone.label || zone.type}</span>
          <span style={{ color: "#6B7280" }}>•</span>
          <span style={{ color: "#34D399" }}>
            X: {zone.x}% Y: {zone.y}% (W: {zone.width}% H: {zone.height}%)
          </span>
        </div>

        {/* 8 Resize Handles */}
        {handles.map((h) => (
          <div
            key={h.id}
            onMouseDown={(e) => handleResizeHandleMouseDown(e, zone, h.id)}
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #7956C9",
              borderRadius: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 55,
              cursor: h.cursor,
              boxSizing: "border-box",
              ...h.style,
            }}
          />
        ))}
      </>
    );
  };

  // Update selected zone property
  const updateSelectedZone = (updates: Partial<TemplateSlotZone>) => {
    if (!selectedZoneId) return;
    setZones((prev) =>
      prev.map((zone) => (zone.id === selectedZoneId ? { ...zone, ...updates } : zone))
    );
  };

  // Delete zone
  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    if (selectedZoneId === id) {
      setSelectedZoneId(null);
    }
  };

  // Duplicate zone
  const handleDuplicateZone = (zone: TemplateSlotZone) => {
    const copyId = `zone-${Date.now().toString(36)}`;
    const duplicated: TemplateSlotZone = {
      ...zone,
      id: copyId,
      label: `${zone.label || "Zone"} (Copy)`,
      x: Math.min(80, zone.x + 4),
      y: Math.min(80, zone.y + 4),
    };
    setZones((prev) => [...prev, duplicated]);
    setSelectedZoneId(copyId);
  };

  // Save template to backend
  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setErrorMessage("Please enter a template name.");
      return;
    }
    if (!backgroundUrl) {
      setErrorMessage("Please select or upload a background image.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload: Partial<PosterTemplate> = {
      name: templateName.trim(),
      category,
      format,
      status,
      description: `Custom visual slot template created in Post Hub Studio with ${zones.length} dynamic zones.`,
      theme: "visual-studio",
      headline: templateName.trim(),
      subheadline: "Personalized Template with Photo & Text Slots",
      ctaText: "Customize Now",
      aspectRatio: format,
      backgroundImageUrl: backgroundUrl,
      slotZones: zones,
    };

    try {
      const isEditing = Boolean(initialTemplate?.id);
      const url = isEditing
        ? `/api/admin/templates/${initialTemplate!.id}`
        : `/api/admin/templates`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to save template.");
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setIsSaving(false);

      if (onSaved && data.template) {
        onSaved(data.template);
      }

      setTimeout(() => {
        router.push("/admin/templates");
      }, 1200);
    } catch {
      setErrorMessage("Network error: Could not reach the template server.");
      setIsSaving(false);
    }
  };

  // Aspect ratio mapping for canvas container:
  // Automatically adapts to artwork's natural aspect ratio so NO part of the poster is ever cropped!
  const aspectRatioStyle = (() => {
    if (artworkAspectRatio && artworkAspectRatio > 0) {
      const maxH = 520;
      const calcW = Math.round(maxH * artworkAspectRatio);
      return { width: `${calcW}px`, height: `${maxH}px` };
    }

    return format === "3:4"
      ? { width: "360px", height: "480px" }
      : format === "4:5"
      ? { width: "360px", height: "450px" }
      : format === "1:1"
      ? { width: "400px", height: "400px" }
      : { width: "300px", height: "533px" }; // 9:16
  })();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        fontFamily: "var(--font-family-sans, sans-serif)",
      }}
    >
      {/* Top Studio Navbar */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EAE4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/admin/templates"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#6E687A",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            <span>Templates</span>
          </Link>

          <div style={{ height: "20px", width: "1px", backgroundColor: "#EAE4EE" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #7956C9 0%, #00C4CC 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <Sparkles size={15} />
            </div>
            <div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name..."
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#24213A",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
                onFocus={(e) => (e.target.style.backgroundColor = "#F4F1F8")}
                onBlur={(e) => (e.target.style.backgroundColor = "transparent")}
              />
            </div>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TemplateCategory)}
            style={{
              height: "34px",
              padding: "0 10px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#24213A",
              backgroundColor: "#FFFFFF",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="Festival">Festival Template</option>
            <option value="Business">Business Template</option>
            <option value="Promotion">Promotion Template</option>
            <option value="Education">Education Template</option>
          </select>

          {/* Format Dropdown */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as TemplateFormat)}
            style={{
              height: "34px",
              padding: "0 10px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#24213A",
              backgroundColor: "#FFFFFF",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="3:4">3:4 Poster (1024 × 1365)</option>
            <option value="4:5">4:5 Social Feed (1080 × 1350)</option>
            <option value="1:1">1:1 Square (1080 × 1080)</option>
            <option value="9:16">9:16 Story (1080 × 1920)</option>
          </select>

          {/* Status Toggle */}
          <button
            type="button"
            onClick={() => setStatus(status === "Published" ? "Draft" : "Published")}
            style={{
              height: "34px",
              padding: "0 12px",
              borderRadius: "6px",
              border: status === "Published" ? "1px solid #C8E8D7" : "1px solid #EAE4EE",
              backgroundColor: status === "Published" ? "#EDF7F2" : "#F8F7FA",
              color: status === "Published" ? "#12805C" : "#6E687A",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: status === "Published" ? "#10B981" : "#9CA3AF",
              }}
            />
            <span>{status}</span>
          </button>

          {/* Save & Publish Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveTemplate}
            style={{
              height: "36px",
              padding: "0 18px",
              borderRadius: "8px",
              border: "none",
              background: saveSuccess
                ? "#10B981"
                : "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              cursor: isSaving ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.25)",
              transition: "all 0.18s ease",
            }}
          >
            {saveSuccess ? (
              <>
                <Check size={15} />
                <span>Saved & Published!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>{isSaving ? "Saving..." : "Save Template"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace: 3-Column Studio Layout */}
      <div
        style={{
          flex: 1,
          display: "flex",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        {/* Left Column: Tools & Background Artwork Upload */}
        <div
          style={{
            width: "320px",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #EAE4EE",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "18px",
            boxSizing: "border-box",
            gap: "20px",
          }}
        >
          {/* Step 1: Background Image Source */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#24213A" }}>
                Background Image
              </span>
            </div>
            <p style={{ fontSize: "11.5px", color: "#777184", margin: "0 0 10px 0" }}>
              Upload your ChatGPT, Midjourney, or DALL-E generated artwork.
            </p>

            {/* Upload Button */}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 12px",
                borderRadius: "10px",
                border: "1.5px dashed #C8BBDC",
                backgroundColor: "#FBF9FE",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "center",
                marginBottom: "12px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7956C9")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#C8BBDC")}
            >
              <Upload size={22} color="#7956C9" style={{ marginBottom: "6px" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#24213A" }}>
                Upload ChatGPT / AI Poster
              </span>
              <span style={{ fontSize: "10.5px", color: "#8E8899", marginTop: "2px" }}>
                PNG, JPG, WebP or SVG with slots
              </span>
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>

            {/* AI Auto-Slot Detector & Code Reader Quick Card */}
            <div
              style={{
                marginBottom: "14px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#F9F6FE",
                border: "1px solid #E2D8F2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#543399", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={13} color="#7956C9" />
                  <span>AI Slot Auto-Detector</span>
                </span>
                <span style={{ fontSize: "9.5px", color: "#8E8899", backgroundColor: "#EDE5F7", padding: "1px 5px", borderRadius: "3px", fontWeight: 700 }}>
                  AUTO
                </span>
              </div>
              <p style={{ fontSize: "10.5px", color: "#6E687A", margin: "0 0 8px 0", lineHeight: 1.35 }}>
                Scans white silhouettes and blank text banners on image upload, or import ChatGPT code.
              </p>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={handleScanCurrentBackground}
                  style={{
                    flex: 1,
                    padding: "6px 4px",
                    borderRadius: "6px",
                    border: "1px solid #7956C9",
                    backgroundColor: "#7956C9",
                    color: "#FFFFFF",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Scan current canvas image for white silhouettes & banners"
                >
                  🪄 Auto-Scan
                </button>
                <button
                  type="button"
                  onClick={() => setShowImportModal(true)}
                  style={{
                    flex: 1,
                    padding: "6px 4px",
                    borderRadius: "6px",
                    border: "1px solid #D2C4ED",
                    backgroundColor: "#FFFFFF",
                    color: "#543399",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  title="Paste ChatGPT coordinate code"
                >
                  📋 Paste Code
                </button>
              </div>
            </div>

            {/* Preset AI Backgrounds */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#6E687A", textTransform: "uppercase" }}>
                Or pick a sample AI artwork:
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                  marginTop: "6px",
                }}
              >
                {AI_PRESET_BACKGROUNDS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setBackgroundUrl(preset.url)}
                    style={{
                      height: "56px",
                      borderRadius: "8px",
                      border: backgroundUrl === preset.url ? "2px solid #7956C9" : "1px solid #EAE4EE",
                      background: preset.gradient,
                      padding: "6px 8px",
                      textAlign: "left",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      boxShadow: backgroundUrl === preset.url ? "0 2px 8px rgba(121, 86, 201, 0.3)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "9.5px", fontWeight: 700, lineHeight: 1.1 }}>
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#ECE7F0" }} />

          {/* Step 2: Selection Tools (Windows Snipping Tool Style) */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                2
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#24213A" }}>
                Snip & Draw Slot Zones
              </span>
            </div>
            <p style={{ fontSize: "11.5px", color: "#777184", margin: "0 0 10px 0" }}>
              Click a tool, then <strong>click & drag over the image</strong> to select the exact area.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {/* Select / Move Tool */}
              <button
                type="button"
                onClick={() => setActiveTool("select")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: activeTool === "select" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: activeTool === "select" ? "#F4F0FB" : "#FFFFFF",
                  color: activeTool === "select" ? "#543399" : "#24213A",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Move size={16} color={activeTool === "select" ? "#7956C9" : "#6E687A"} />
                <div>
                  <div>Select & Move Zone</div>
                  <div style={{ fontSize: "10.5px", color: "#8E8899" }}>Click any zone on canvas</div>
                </div>
              </button>

              {/* Photo Slot Snipper */}
              <button
                type="button"
                onClick={() => setActiveTool("draw_photo")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: activeTool === "draw_photo" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: activeTool === "draw_photo" ? "#F4F0FB" : "#FFFFFF",
                  color: activeTool === "draw_photo" ? "#543399" : "#24213A",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Camera size={16} color={activeTool === "draw_photo" ? "#7956C9" : "#6E687A"} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>📸 Select Photo Area</span>
                    <span
                      style={{
                        fontSize: "9px",
                        backgroundColor: "#E0F2FE",
                        color: "#0369A1",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      Drag to Draw
                    </span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#8E8899" }}>Where user&apos;s photo will upload</div>
                </div>
              </button>

              {/* Text Slot Snipper */}
              <button
                type="button"
                onClick={() => setActiveTool("draw_text")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: activeTool === "draw_text" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: activeTool === "draw_text" ? "#F4F0FB" : "#FFFFFF",
                  color: activeTool === "draw_text" ? "#543399" : "#24213A",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Type size={16} color={activeTool === "draw_text" ? "#7956C9" : "#6E687A"} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>✍️ Select Text Area</span>
                    <span
                      style={{
                        fontSize: "9px",
                        backgroundColor: "#EDE9FE",
                        color: "#6D28D9",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      Drag to Draw
                    </span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#8E8899" }}>Name, phone, designation slot</div>
                </div>
              </button>

              {/* Shape / Badge Snipper */}
              <button
                type="button"
                onClick={() => setActiveTool("draw_shape")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: activeTool === "draw_shape" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: activeTool === "draw_shape" ? "#F4F0FB" : "#FFFFFF",
                  color: activeTool === "draw_shape" ? "#543399" : "#24213A",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <Square size={16} color={activeTool === "draw_shape" ? "#7956C9" : "#6E687A"} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🔷 Add Shape / Footer Bar</span>
                    <span
                      style={{
                        fontSize: "9px",
                        backgroundColor: "#FEF3C7",
                        color: "#92400E",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        fontWeight: 700,
                      }}
                    >
                      Overlay
                    </span>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#8E8899" }}>Background strip for text</div>
                </div>
              </button>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#ECE7F0" }} />

          {/* Zones Layer List */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#24213A", display: "flex", alignItems: "center", gap: "4px" }}>
                <Layers size={14} color="#7956C9" />
                <span>Configured Slots ({zones.length})</span>
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {zones.map((zone, idx) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: selectedZoneId === zone.id ? "#F4F0FB" : "#F8F7FA",
                    border: selectedZoneId === zone.id ? "1px solid #7956C9" : "1px solid #EAE4EE",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{zone.type === "photo" ? "📸" : zone.type === "text" ? "✍️" : "🔷"}</span>
                    <span style={{ fontWeight: 600, color: "#24213A" }}>
                      {zone.label || `Zone ${idx + 1}`}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button
                      type="button"
                      title="Duplicate Zone"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateZone(zone);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#8E8899", padding: "2px" }}
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      type="button"
                      title="Delete Zone"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteZone(zone.id);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#D9383A", padding: "2px" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas Studio: Interactive Visual Area */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#EDE9F2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "auto",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          {/* Instruction Pill */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              backgroundColor: "rgba(36, 33, 58, 0.9)",
              color: "#FFFFFF",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 30,
            }}
          >
            {activeTool === "draw_photo" && <span>📸 Crosshair active: Click & Drag to select User Photo area</span>}
            {activeTool === "draw_text" && <span>✍️ Crosshair active: Click & Drag to create a Dynamic Text box</span>}
            {activeTool === "draw_shape" && <span>🔷 Crosshair active: Click & Drag to place a Shape or Footer strip</span>}
            {activeTool === "select" && <span>✋ Select & Move: Click & drag any zone to move it, drag 8 corner handles to resize, or use arrow keys!</span>}
          </div>

          {/* Quick AI Poster Slots Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "12px",
              padding: "8px 12px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE4EE",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              zIndex: 10,
            }}
          >
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#543399", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={14} color="#7956C9" />
              <span>AI Poster Quick Slots:</span>
            </span>

            <button
              type="button"
              onClick={handleAddLeftLeaderCutout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #D2C4ED",
                backgroundColor: "#F4F0FB",
                color: "#543399",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              👤 + Left Silhouette Photo
            </button>

            <button
              type="button"
              onClick={handleAddBottomDetailsBar}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #D2C4ED",
                backgroundColor: "#F4F0FB",
                color: "#543399",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🏷️ + Bottom Banner Text
            </button>

            <button
              type="button"
              onClick={handleAddTopHeaderBadge}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #D2C4ED",
                backgroundColor: "#F4F0FB",
                color: "#543399",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✍️ + Top Header Text
            </button>

            <button
              type="button"
              onClick={handleScanCurrentBackground}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #7956C9",
                background: "linear-gradient(135deg, #7928CA 0%, #FF0080 100%)",
                color: "#FFFFFF",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(121, 40, 202, 0.3)",
              }}
              title="Automatically scan image pixels for silhouette cutouts and banners"
            >
              🪄 Auto-Scan Image
            </button>

            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #7956C9",
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(121, 86, 201, 0.25)",
              }}
              title="Paste code or prompt generated by ChatGPT"
            >
              <Code2 size={13} />
              <span>Paste AI Code</span>
            </button>

            <button
              type="button"
              onClick={handleCopyChatGPTTemplate}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "5px 10px",
                borderRadius: "6px",
                border: "1px solid #D2C4ED",
                backgroundColor: "#FFFFFF",
                color: "#543399",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              title="Copy the prompt template to instruct ChatGPT"
            >
              {promptCopied ? "✓ Copied Prompt!" : "💡 Prompt Template"}
            </button>
          </div>

          {/* AI Auto-Detection Notification Banner */}
          {aiDetectedNotification && (
            <div
              style={{
                marginBottom: "12px",
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "#F3E8FF",
                border: "1px solid #D8B4FE",
                color: "#6B21A8",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(107, 33, 168, 0.08)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={15} color="#7956C9" />
                <span>{aiDetectedNotification}</span>
              </span>
              <button
                type="button"
                onClick={() => setAiDetectedNotification(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B21A8",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Canvas Box */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{
              ...aspectRatioStyle,
              position: "relative",
              borderRadius: "0px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#1E1A33",
              background: `url(${backgroundUrl}) center center / 100% 100% no-repeat`,
              cursor: activeTool !== "select" ? "crosshair" : "default",
              userSelect: "none",
            }}
          >
            {/* Render Configured Slot Zones */}
            {zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const isMovingThis = dragState?.type === "move" && dragState?.zoneId === zone.id;
              const cursorStyle = activeTool === "select" ? (isMovingThis ? "grabbing" : "grab") : "crosshair";

              return (
                <div
                  key={zone.id}
                  onMouseDown={(e) => handleZoneMouseDown(e, zone)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedZoneId(zone.id);
                  }}
                  style={{
                    position: "absolute",
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    zIndex: isSelected ? 45 : zone.zIndex || (zone.type === "shape" ? 2 : zone.type === "photo" ? 4 : 5),
                    cursor: cursorStyle,
                    boxSizing: "border-box",
                    userSelect: "none",
                    outline: isSelected ? "2px solid #7956C9" : "none",
                    outlineOffset: "2px",
                  }}
                >
                  {/* Internal Shape Content */}
                  {zone.type === "shape" && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: zone.backgroundColor || "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(6px)",
                        borderRadius: zone.shapeType === "pill" ? "999px" : zone.borderRadius ? `${zone.borderRadius}px` : "8px",
                        opacity: zone.opacity ?? 1,
                        border: isSelected ? "1.5px solid #7956C9" : "1px dashed rgba(255,255,255,0.4)",
                        boxSizing: "border-box",
                      }}
                    />
                  )}

                  {/* Internal Photo Content */}
                  {zone.type === "photo" && (() => {
                    const isCutout = zone.photoShape === "cutout";
                    const isCircle = zone.photoShape === "circle";
                    const isSquircle = zone.photoShape === "squircle";
                    const borderRadius = isCutout ? "0" : isCircle ? "50%" : isSquircle ? "24%" : "8px";
                    const borderWidth = isCutout ? 0 : (zone.borderWidth ?? 3);
                    const avatarSrc = previewWithUserData
                      ? activeTestUser.avatarUrl
                      : zone.sampleAvatarUrl;
                    const feather = isCutout || zone.featherBottom;
                    const maskStyle = feather
                      ? {
                          WebkitMaskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
                          maskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
                        }
                      : {};

                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius,
                          border: borderWidth > 0 ? `${borderWidth}px solid ${zone.borderColor || "#FFFFFF"}` : (isSelected ? "1.5px dashed #7956C9" : "none"),
                          boxShadow: !isCutout && zone.shadow !== false
                            ? (isSelected
                                ? "0 0 0 2px #7956C9, 0 8px 18px rgba(0,0,0,0.4)"
                                : "0 4px 14px rgba(0,0,0,0.35)")
                            : "none",
                          overflow: "hidden",
                          backgroundColor: isCutout ? "transparent" : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                          ...maskStyle,
                        }}
                      >
                        {avatarSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarSrc}
                            alt="User Photo Slot"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: zone.objectFit || (isCutout ? "contain" : "cover"),
                              objectPosition: "top center",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: isCutout ? "rgba(121, 86, 201, 0.12)" : "#F4F0FB",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#7956C9",
                              border: isCutout ? "1.5px dashed #7956C9" : "none",
                            }}
                          >
                            <Camera size={18} />
                            <span style={{ fontSize: "9px", fontWeight: 700, marginTop: "2px" }}>
                              {isCutout ? "Leader Cutout Area" : "Photo Slot"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Internal Text Content */}
                  {zone.type === "text" && (() => {
                    let displayText = zone.customText || "Text Slot";
                    if (previewWithUserData) {
                      if (zone.textBinding === "name") displayText = activeTestUser.name;
                      else if (zone.textBinding === "designation") displayText = activeTestUser.designation;
                      else if (zone.textBinding === "phone") displayText = activeTestUser.phone;
                      else if (zone.textBinding === "business") displayText = activeTestUser.businessName;
                    } else {
                      displayText = `{${zone.textBinding || "text"}}`;
                    }

                    // Auto-fit dynamic font-scaling
                    const baseFontSize = zone.fontSize || 13;
                    const minSize = zone.minFontSize || 8.5;
                    const textLen = (displayText || "").length;
                    let dynamicFontSize = baseFontSize;

                    if (zone.autoFitText !== false && textLen > 0) {
                      const approxCapacity = (zone.width * zone.height) / 12;
                      if (textLen > approxCapacity && approxCapacity > 0) {
                        const scale = Math.sqrt(approxCapacity / textLen);
                        dynamicFontSize = Math.max(minSize, Math.min(baseFontSize, baseFontSize * scale));
                      }
                    }

                    return (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            zone.alignment === "left"
                              ? "flex-start"
                              : zone.alignment === "right"
                              ? "flex-end"
                              : "center",
                          textAlign: zone.alignment || "center",
                          color: zone.color || "#FFFFFF",
                          fontSize: `${Math.round(dynamicFontSize * 10) / 10}px`,
                          fontWeight: zone.fontWeight || 700,
                          fontFamily: zone.fontFamily || "Poppins",
                          textShadow: zone.textShadow !== false ? "0 2px 4px rgba(0,0,0,0.6)" : "none",
                          border: isSelected ? "1.5px dashed #7956C9" : "1px dashed rgba(255,255,255,0.3)",
                          backgroundColor: isSelected ? "rgba(121, 86, 201, 0.15)" : "transparent",
                          padding: "2px 6px",
                          boxSizing: "border-box",
                          lineHeight: 1.25,
                          overflow: "hidden",
                          whiteSpace: zone.wrapText !== false ? "normal" : "nowrap",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {displayText}
                      </div>
                    );
                  })()}

                  {/* 8-Point Resize Handles & Floating Coordinates Badge */}
                  {isSelected && renderResizeHandles(zone)}
                </div>
              );
            })}

            {/* Live Snipping Box Overlay during mouse drag */}
            {isDrawing && currentBox && (
              <div
                style={{
                  position: "absolute",
                  left: `${currentBox.x}%`,
                  top: `${currentBox.y}%`,
                  width: `${currentBox.w}%`,
                  height: `${currentBox.h}%`,
                  border: "2px dashed #7956C9",
                  backgroundColor: "rgba(121, 86, 201, 0.25)",
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.35)", // Windows Snipping Tool vignette effect
                  pointerEvents: "none",
                  zIndex: 40,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  padding: "4px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#7956C9",
                    color: "#FFFFFF",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: "3px",
                  }}
                >
                  {Math.round(currentBox.w)}% × {Math.round(currentBox.h)}%
                </span>
              </div>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "#FDF2F2",
                border: "1px solid #F8D7DA",
                color: "#D9383A",
                fontSize: "12.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: Properties Inspector for the selected zone */}
        <div
          style={{
            width: "340px",
            backgroundColor: "#FFFFFF",
            borderLeft: "1px solid #EAE4EE",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "18px",
            boxSizing: "border-box",
            gap: "18px",
          }}
        >
          {/* Top header of inspector */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#24213A", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sliders size={16} color="#7956C9" />
              <span>Zone Properties</span>
            </span>

            {selectedZone && (
              <button
                type="button"
                onClick={() => handleDeleteZone(selectedZone.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#D9383A",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Test Profile Selector */}
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#F8F6FC",
              border: "1px solid #E4DCF2",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#543399" }}>
                Test with Real User Data
              </span>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "11.5px" }}>
                <input
                  type="checkbox"
                  checked={previewWithUserData}
                  onChange={(e) => setPreviewWithUserData(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span style={{ color: "#24213A", fontWeight: 600 }}>Live Preview</span>
              </label>
            </div>

            {previewWithUserData && (
              <select
                value={activeTestUser.id}
                onChange={(e) => {
                  const u = SAMPLE_TEST_USERS.find((item) => item.id === e.target.value);
                  if (u) setActiveTestUser(u);
                }}
                style={{
                  width: "100%",
                  height: "32px",
                  borderRadius: "6px",
                  border: "1px solid #D2C4ED",
                  fontSize: "12px",
                  padding: "0 8px",
                  color: "#24213A",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                {SAMPLE_TEST_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.designation})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Inspector Body */}
          {selectedZone ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Common: Label & Coordinates */}
              <div>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "4px" }}>
                  Zone Label
                </label>
                <input
                  type="text"
                  value={selectedZone.label || ""}
                  onChange={(e) => updateSelectedZone({ label: e.target.value })}
                  style={{
                    width: "100%",
                    height: "34px",
                    borderRadius: "6px",
                    border: "1px solid #EAE4EE",
                    padding: "0 10px",
                    fontSize: "12.5px",
                    color: "#24213A",
                  }}
                />
              </div>

              {/* Coordinates Grid (X, Y, W, H in %) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#8E8899" }}>Left Position (X %)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={selectedZone.x}
                    onChange={(e) => updateSelectedZone({ x: Math.max(0, Math.min(100 - selectedZone.width, parseFloat(e.target.value) || 0)) })}
                    style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #EAE4EE", padding: "0 6px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#8E8899" }}>Top Position (Y %)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={selectedZone.y}
                    onChange={(e) => updateSelectedZone({ y: Math.max(0, Math.min(100 - selectedZone.height, parseFloat(e.target.value) || 0)) })}
                    style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #EAE4EE", padding: "0 6px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#8E8899" }}>Width (W %)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={selectedZone.width}
                    onChange={(e) => updateSelectedZone({ width: Math.max(3, Math.min(100 - selectedZone.x, parseFloat(e.target.value) || 10)) })}
                    style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #EAE4EE", padding: "0 6px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#8E8899" }}>Height (H %)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={selectedZone.height}
                    onChange={(e) => updateSelectedZone({ height: Math.max(3, Math.min(100 - selectedZone.y, parseFloat(e.target.value) || 10)) })}
                    style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #EAE4EE", padding: "0 6px", fontSize: "12px" }}
                  />
                </div>
              </div>

              {/* Quick Nudge & Alignment Toolbar */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#F9F8FC",
                  border: "1px solid #EAE4EE",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#543399" }}>
                    Nudge & Alignment
                  </span>
                  <span style={{ fontSize: "10px", color: "#8E8899" }}>Or drag on canvas</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ x: Math.max(0, Math.round((selectedZone.x - 1) * 10) / 10) })}
                    style={{ padding: "5px 0", borderRadius: "4px", border: "1px solid #D2C4ED", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#24213A" }}
                    title="Nudge Left 1%"
                  >
                    ◀ Left
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ x: Math.min(100 - selectedZone.width, Math.round((selectedZone.x + 1) * 10) / 10) })}
                    style={{ padding: "5px 0", borderRadius: "4px", border: "1px solid #D2C4ED", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#24213A" }}
                    title="Nudge Right 1%"
                  >
                    ▶ Right
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ y: Math.max(0, Math.round((selectedZone.y - 1) * 10) / 10) })}
                    style={{ padding: "5px 0", borderRadius: "4px", border: "1px solid #D2C4ED", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#24213A" }}
                    title="Nudge Up 1%"
                  >
                    ▲ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ y: Math.min(100 - selectedZone.height, Math.round((selectedZone.y + 1) * 10) / 10) })}
                    style={{ padding: "5px 0", borderRadius: "4px", border: "1px solid #D2C4ED", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#24213A" }}
                    title="Nudge Down 1%"
                  >
                    ▼ Down
                  </button>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ x: Math.round(((100 - selectedZone.width) / 2) * 10) / 10 })}
                    style={{ flex: 1, padding: "5px 0", borderRadius: "4px", border: "1px solid #E4DCF2", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "10.5px", fontWeight: 600, color: "#543399" }}
                  >
                    Center Horizontally
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSelectedZone({ y: Math.round(((100 - selectedZone.height) / 2) * 10) / 10 })}
                    style={{ flex: 1, padding: "5px 0", borderRadius: "4px", border: "1px solid #E4DCF2", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "10.5px", fontWeight: 600, color: "#543399" }}
                  >
                    Center Vertically
                  </button>
                </div>

                <div style={{ fontSize: "10px", color: "#6E687A", lineHeight: 1.3, marginTop: "2px" }}>
                  💡 <strong>Tip:</strong> Click & drag any element directly on the canvas to move it freely, drag 8 corner handles to resize, or use keyboard arrow keys.
                </div>
              </div>

              {/* Specific Properties for PHOTO Zone */}
              {selectedZone.type === "photo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #ECE7F0", paddingTop: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "6px" }}>
                      Photo Avatar Shape
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {(["cutout", "circle", "squircle", "rectangle"] as PhotoSlotShape[]).map((sh) => (
                        <button
                          key={sh}
                          type="button"
                          onClick={() => updateSelectedZone({ photoShape: sh, borderWidth: sh === "cutout" ? 0 : (selectedZone.borderWidth ?? 3) })}
                          style={{
                            padding: "6px",
                            borderRadius: "6px",
                            border: selectedZone.photoShape === sh ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                            backgroundColor: selectedZone.photoShape === sh ? "#F4F0FB" : "#FFFFFF",
                            color: selectedZone.photoShape === sh ? "#543399" : "#6E687A",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {sh === "cutout" ? "👤 Cutout" : sh === "circle" ? "⚪ Circle" : sh === "squircle" ? "🔲 Squircle" : "▭ Rect"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Scaling Fit (Contain vs Cover) */}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#8E8899", marginBottom: "4px" }}>
                      Image Scaling Mode
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["contain", "cover"] as const).map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => updateSelectedZone({ objectFit: fit })}
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "6px",
                            border: (selectedZone.objectFit || (selectedZone.photoShape === "cutout" ? "contain" : "cover")) === fit ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                            backgroundColor: (selectedZone.objectFit || (selectedZone.photoShape === "cutout" ? "contain" : "cover")) === fit ? "#F4F0FB" : "#FFFFFF",
                            color: (selectedZone.objectFit || (selectedZone.photoShape === "cutout" ? "contain" : "cover")) === fit ? "#543399" : "#6E687A",
                            fontSize: "10.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {fit === "contain" ? "Fit Entire (Contain)" : "Fill Box (Cover)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soft Bottom Fade Mask Toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={selectedZone.featherBottom !== false}
                      onChange={(e) => updateSelectedZone({ featherBottom: e.target.checked })}
                      style={{ accentColor: "#7956C9" }}
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
                      Soft Bottom Fade (Blend into diyas/artwork)
                    </span>
                  </label>

                  {/* Border Color & Width */}
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "6px" }}>
                      Border Color & Width ({selectedZone.borderWidth ?? 3}px)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="color"
                        value={selectedZone.borderColor || "#FFFFFF"}
                        onChange={(e) => updateSelectedZone({ borderColor: e.target.value })}
                        style={{ width: "36px", height: "32px", border: "none", cursor: "pointer", borderRadius: "4px" }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="8"
                        value={selectedZone.borderWidth ?? 3}
                        onChange={(e) => updateSelectedZone({ borderWidth: parseInt(e.target.value, 10) })}
                        style={{ flex: 1, accentColor: "#7956C9" }}
                      />
                    </div>
                  </div>

                  {/* Drop Shadow toggle */}
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={selectedZone.shadow !== false}
                      onChange={(e) => updateSelectedZone({ shadow: e.target.checked })}
                      style={{ accentColor: "#7956C9" }}
                    />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
                      Drop Shadow Elevation
                    </span>
                  </label>
                </div>
              )}

              {/* Specific Properties for TEXT Zone */}
              {selectedZone.type === "text" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #ECE7F0", paddingTop: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "4px" }}>
                      Field Data Binding
                    </label>
                    <select
                      value={selectedZone.textBinding || "name"}
                      onChange={(e) => updateSelectedZone({ textBinding: e.target.value as TextSlotBinding })}
                      style={{
                        width: "100%",
                        height: "34px",
                        borderRadius: "6px",
                        border: "1px solid #EAE4EE",
                        fontSize: "12px",
                        color: "#24213A",
                        padding: "0 8px",
                      }}
                    >
                      <option value="name">👤 User Full Name</option>
                      <option value="designation">💼 Designation / Title</option>
                      <option value="phone">📞 Phone Number</option>
                      <option value="business">🏢 Business / Brand Name</option>
                      <option value="custom">✏️ Custom Static Text</option>
                    </select>
                  </div>

                  {selectedZone.textBinding === "custom" && (
                    <div>
                      <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "4px" }}>
                        Custom Text
                      </label>
                      <input
                        type="text"
                        value={selectedZone.customText || ""}
                        onChange={(e) => updateSelectedZone({ customText: e.target.value })}
                        placeholder="Enter text..."
                        style={{ width: "100%", height: "32px", borderRadius: "6px", border: "1px solid #EAE4EE", padding: "0 8px", fontSize: "12px" }}
                      />
                    </div>
                  )}

                  {/* Font Family & Size */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#8E8899" }}>Font Family</label>
                      <select
                        value={selectedZone.fontFamily || "Poppins"}
                        onChange={(e) => updateSelectedZone({ fontFamily: e.target.value })}
                        style={{ width: "100%", height: "32px", borderRadius: "5px", border: "1px solid #EAE4EE", fontSize: "11.5px" }}
                      >
                        <option value="Poppins">Poppins</option>
                        <option value="Inter">Inter</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Playfair Display">Playfair Serif</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", color: "#8E8899" }}>Size ({selectedZone.fontSize || 13}px)</label>
                      <input
                        type="range"
                        min="9"
                        max="32"
                        value={selectedZone.fontSize || 13}
                        onChange={(e) => updateSelectedZone({ fontSize: parseInt(e.target.value, 10) })}
                        style={{ width: "100%", accentColor: "#7956C9" }}
                      />
                    </div>
                  </div>

                  {/* Text Color & Weight */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "8px" }}>
                    <div>
                      <label style={{ fontSize: "11px", color: "#8E8899" }}>Text Color</label>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="color"
                          value={selectedZone.color || "#FFFFFF"}
                          onChange={(e) => updateSelectedZone({ color: e.target.value })}
                          style={{ width: "32px", height: "30px", border: "none", cursor: "pointer", borderRadius: "4px" }}
                        />
                        <span style={{ fontSize: "11px", color: "#6E687A", fontWeight: 600 }}>
                          {selectedZone.color || "#FFFFFF"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", color: "#8E8899" }}>Weight</label>
                      <select
                        value={selectedZone.fontWeight || "700"}
                        onChange={(e) =>
                          updateSelectedZone({
                            fontWeight: e.target.value as "normal" | "600" | "700" | "800",
                          })
                        }
                        style={{ width: "100%", height: "30px", borderRadius: "5px", border: "1px solid #EAE4EE", fontSize: "11.5px" }}
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="600">SemiBold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Black (800)</option>
                      </select>
                    </div>
                  </div>

                  {/* Alignment buttons */}
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#8E8899", marginBottom: "4px" }}>
                      Alignment
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["left", "center", "right"] as const).map((al) => (
                        <button
                          key={al}
                          type="button"
                          onClick={() => updateSelectedZone({ alignment: al })}
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "6px",
                            border: selectedZone.alignment === al ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                            backgroundColor: selectedZone.alignment === al ? "#F4F0FB" : "#FFFFFF",
                            color: selectedZone.alignment === al ? "#543399" : "#6E687A",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {al === "left" ? "Left" : al === "center" ? "Center" : "Right"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-line & Dynamic Font Shrink / Auto-Fit */}
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      backgroundColor: "#F9F8FC",
                      border: "1px solid #E4DCF2",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#543399" }}>
                      📏 Smart Text Fitting & Multi-line
                    </span>

                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={selectedZone.autoFitText !== false}
                        onChange={(e) => updateSelectedZone({ autoFitText: e.target.checked })}
                        style={{ accentColor: "#7956C9" }}
                      />
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#24213A" }}>
                        Auto-shrink font if text is too long
                      </span>
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={selectedZone.wrapText !== false}
                        onChange={(e) => updateSelectedZone({ wrapText: e.target.checked })}
                        style={{ accentColor: "#7956C9" }}
                      />
                      <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#24213A" }}>
                        Wrap text to next line (Multi-line)
                      </span>
                    </label>

                    {selectedZone.autoFitText !== false && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                          <span style={{ fontSize: "10.5px", color: "#8E8899" }}>Minimum Font Size</span>
                          <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#543399" }}>
                            {selectedZone.minFontSize || 8.5}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="7"
                          max="16"
                          step="0.5"
                          value={selectedZone.minFontSize || 8.5}
                          onChange={(e) => updateSelectedZone({ minFontSize: parseFloat(e.target.value) })}
                          style={{ width: "100%", accentColor: "#7956C9" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Specific Properties for SHAPE Zone */}
              {selectedZone.type === "shape" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #ECE7F0", paddingTop: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "6px" }}>
                      Shape Style
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["pill", "rectangle"] as const).map((sh) => (
                        <button
                          key={sh}
                          type="button"
                          onClick={() => updateSelectedZone({ shapeType: sh })}
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "6px",
                            border: selectedZone.shapeType === sh ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                            backgroundColor: selectedZone.shapeType === sh ? "#F4F0FB" : "#FFFFFF",
                            color: selectedZone.shapeType === sh ? "#543399" : "#6E687A",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                        >
                          {sh === "pill" ? "💊 Pill Bar" : "▭ Rectangle"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Color & Opacity */}
                  <div>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#6E687A", marginBottom: "4px" }}>
                      Background Fill Color
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="color"
                        value={selectedZone.backgroundColor || "#0F172A"}
                        onChange={(e) => updateSelectedZone({ backgroundColor: e.target.value })}
                        style={{ width: "36px", height: "32px", border: "none", cursor: "pointer", borderRadius: "4px" }}
                      />
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={selectedZone.opacity ?? 0.85}
                        onChange={(e) => updateSelectedZone({ opacity: parseFloat(e.target.value) })}
                        style={{ flex: 1, accentColor: "#7956C9" }}
                      />
                      <span style={{ fontSize: "11px", color: "#6E687A" }}>
                        {Math.round((selectedZone.opacity ?? 0.85) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#8E8899",
                padding: "20px",
              }}
            >
              <HelpCircle size={32} style={{ marginBottom: "8px", opacity: 0.5 }} />
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#6E687A" }}>
                No Zone Selected
              </div>
              <p style={{ fontSize: "11.5px", margin: "4px 0 0 0" }}>
                Click on any photo or text zone on the canvas to configure its settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Import ChatGPT Spec Modal */}
      {showImportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={20} color="#7956C9" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#24213A" }}>
                  Import ChatGPT / AI Coordinates Code
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{ background: "none", border: "none", fontSize: "18px", color: "#8E8899", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#6E687A", margin: "0 0 12px 0", lineHeight: 1.4 }}>
              Paste raw SVG code, JSON elements, or coordinate tags. Post Hub will automatically extract the artwork, photo cutout area, and text banners!
            </p>

            <textarea
              value={importCodeText}
              onChange={(e) => setImportCodeText(e.target.value)}
              placeholder={"Paste any of the following:\n1. Raw SVG Code: <svg ...>...</svg>\n2. JSON elements list: [ { id: 'person_phone', x: 265, y: 1425, ... } ]\n3. Coordinate tags: [POSTHUB: PHOTO(6, 6, 48, 62, cutout) NAME(12, 88, 76, 8)]\n4. Key-values: PHOTO: x=6, y=6, w=48, h=62 | NAME: x=12, y=88, w=76, h=8"}
              rows={6}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #D2C4ED",
                padding: "10px",
                fontSize: "12px",
                fontFamily: "monospace",
                boxSizing: "border-box",
                marginBottom: "14px",
                resize: "vertical",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCopyChatGPTTemplate}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E2D8F2",
                  backgroundColor: "#F8F6FC",
                  color: "#543399",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {promptCopied ? "✓ Copied Prompt!" : "💡 Copy ChatGPT Prompt"}
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    backgroundColor: "#FFFFFF",
                    color: "#6E687A",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyImportedCode}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7956C9",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(121, 86, 201, 0.3)",
                  }}
                >
                  ✨ Apply Code to Canvas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
