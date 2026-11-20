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
  EyeOff,
  Lock,
  Unlock,
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
  Redo2,
  Plus,
  Maximize2,
  Code2,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Phone,
  Mail,
  Globe,
  MapPin,
  QrCode,
  Grid,
  Shield,
  ZoomIn,
  ZoomOut,
  Hand,
  MousePointer,
  RotateCcw,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  FolderOpen,
  Image as ImageIcon,
  Sparkle,
  User,
  UserPlus,
  RefreshCw,
  Crop,
  PanelBottom,
} from "lucide-react";

import {
  BOTTOMS_AND_FRAMES_CATALOG,
  BottomKind,
  BottomPresetItem,
  stripExistingBottomZones,
  isZoneFromBottomOrFrame,
} from "./BottomsAndFramesCatalog";

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
  ShapeSlotType,
  TemplateFormat,
  TemplateCategory,
} from "@/lib/templates";

import {
  INDIAN_FONTS_CATALOG,
  READY_SLOGAN_SNIPPETS,
} from "./IndianFontsCatalog";
import { CurvedTextRenderer } from "./CurvedTextRenderer";
import { DirectImageCropperModal, CropTargetInfo } from "./DirectImageCropperModal";
import {
  PARTY_AND_CULTURAL_ASSETS,
  createSmartContactBarZones,
} from "./StudioElementsLibrary";
import { StudioLayersPanel } from "./StudioLayersPanel";
import { LiveMobileAppSimulator, SIMULATED_PERSONAS } from "./LiveMobileAppSimulator";

// Preset Backgrounds Gallery
const PRESET_BACKGROUND_ARTWORKS = [
  {
    id: "preset-diwali-1",
    name: "Diwali Golden Spark",
    category: "Festival" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "preset-business-1",
    name: "Executive Blue Summit",
    category: "Business" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "preset-fest-holi",
    name: "Holi Colors Festival",
    category: "Festival" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1080&q=80",
  },
  {
    id: "preset-promo-cyber",
    name: "Neon Glow Promotion",
    category: "Promotion" as TemplateCategory,
    format: "3:4" as TemplateFormat,
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1080&q=80",
  },
];

export interface LeaderPhotoPreset {
  id: string;
  name: string;
  role: string;
  url: string;
  type: PhotoSlotShape;
  featherBottom?: boolean;
}

export const LEADER_PHOTO_PRESETS: LeaderPhotoPreset[] = [
  {
    id: "modi-cutout",
    name: "PM Narendra Modi",
    role: "National Leader Cutout",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Narendra_Modi_2021.jpg/440px-Narendra_Modi_2021.jpg",
    type: "cutout",
    featherBottom: true,
  },
  {
    id: "modi-speech",
    name: "Narendra Modi (Speech)",
    role: "Viksit Bharat Cutout",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Prime_Minister_Narendra_Modi_in_February_2024.jpg/440px-Prime_Minister_Narendra_Modi_in_February_2024.jpg",
    type: "cutout",
    featherBottom: true,
  },
  {
    id: "leader-male",
    name: "Vikramsinh Parmar",
    role: "Candidate / Leader",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    type: "circle",
    featherBottom: false,
  },
  {
    id: "leader-female",
    name: "Ananya Sharma",
    role: "Mahila Morcha / Youth",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    type: "circle",
    featherBottom: false,
  },
  {
    id: "leader-doc",
    name: "Dr. Rajesh Rao",
    role: "Professional / Leader",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    type: "circle",
    featherBottom: false,
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

  // Template basic metadata
  const [templateName, setTemplateName] = useState(
    initialTemplate?.name || "Festive Campaign Poster"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [category, setCategory] = useState<TemplateCategory>(
    initialTemplate?.category || "Festival"
  );
  const [format, setFormat] = useState<TemplateFormat>(
    initialTemplate?.format || "3:4"
  );
  const [status, setStatus] = useState<"Draft" | "Published">(
    initialTemplate?.status === "Published" ? "Published" : "Draft"
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    initialTemplate?.primaryColor || "#7956C9"
  );
  const [accentColor, setAccentColor] = useState<string>(
    initialTemplate?.accentColor || "#FFB800"
  );

  // Background artwork & auto aspect ratio
  const [backgroundUrl, setBackgroundUrl] = useState<string>(
    initialTemplate?.backgroundImageUrl || PRESET_BACKGROUND_ARTWORKS[0].url
  );
  const [artworkAspectRatio, setArtworkAspectRatio] = useState<number | null>(null);

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
        id: "zone-photo-leader",
        type: "photo",
        label: "Leader Silhouette",
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
      },
      {
        id: "zone-footer-pill",
        type: "shape",
        label: "Footer Bar",
        x: 4,
        y: 88,
        width: 92,
        height: 9,
        shapeType: "pill",
        backgroundColor: "rgba(16, 43, 101, 0.95)",
        borderRadius: 999,
        opacity: 0.95,
        zIndex: 2,
      },
      {
        id: "zone-text-name",
        type: "text",
        label: "User Name",
        x: 8,
        y: 89.5,
        width: 40,
        height: 6,
        textBinding: "name",
        fontSize: 15,
        color: "#FFFFFF",
        fontWeight: "800",
        fontFamily: "Poppins",
        alignment: "left",
        textShadow: true,
        zIndex: 5,
      },
      {
        id: "zone-text-contact",
        type: "text",
        label: "Phone / Web",
        x: 52,
        y: 89.5,
        width: 42,
        height: 6,
        textBinding: "phone",
        fontSize: 12,
        color: "#FACC15",
        fontWeight: "700",
        fontFamily: "Poppins",
        alignment: "right",
        textShadow: true,
        zIndex: 5,
      },
    ]
  );

  // Selected tool & zone
  const [activeTool, setActiveTool] = useState<
    "select" | "draw_photo" | "draw_text" | "draw_shape" | "pan"
  >("select");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
    "zone-photo-leader"
  );

  // Undo / Redo history stacks
  const [history, setHistory] = useState<TemplateSlotZone[][]>([]);
  const [future, setFuture] = useState<TemplateSlotZone[][]>([]);

  const pushHistory = (newZones: TemplateSlotZone[]) => {
    setHistory((prev) => [...prev.slice(-30), zones]);
    setFuture([]);
    setZones(newZones);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [zones, ...prev]);
    setZones(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, zones]);
    setZones(next);
  };

  // Keyboard shortcut listener for Undo / Redo / Delete / Arrow Nudge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedZoneId) {
          e.preventDefault();
          handleDeleteZone(selectedZoneId);
        }
      } else if (selectedZoneId && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 2 : 0.5;
        const target = zones.find((z) => z.id === selectedZoneId);
        if (target) {
          let nextX = target.x;
          let nextY = target.y;
          if (e.key === "ArrowUp") nextY = Math.round((target.y - step) * 10) / 10;
          if (e.key === "ArrowDown") nextY = Math.round((target.y + step) * 10) / 10;
          if (e.key === "ArrowLeft") nextX = Math.round((target.x - step) * 10) / 10;
          if (e.key === "ArrowRight") nextX = Math.round((target.x + step) * 10) / 10;
          updateSelectedZone({ x: nextX, y: nextY });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zones, selectedZoneId, history, future]);

  // Left dock navigation
  const [leftTab, setLeftTab] = useState<
    "artworks" | "text" | "photos" | "shapes" | "bottoms" | "elements" | "contact" | "layers"
  >("artworks");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Bottoms & Frames studio state
  const [bottomSubTab, setBottomSubTab] = useState<BottomKind>("only_bottom");
  const [replaceExistingBottom, setReplaceExistingBottom] = useState<boolean>(true);
  const [bottomStartY, setBottomStartY] = useState<number>(88);
  const [bottomAvatarSide, setBottomAvatarSide] = useState<"left" | "right" | "none">("left");
  const [bottomTagFilter, setBottomTagFilter] = useState<string>("All");

  // Right sidebar pane mode
  const [rightTab, setRightTab] = useState<"inspector" | "simulator">("inspector");

  // Magnetic Snap Guides state
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [activeSnapGuides, setActiveSnapGuides] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  // Viewport Zoom & Safe Guides
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [clipContent, setClipContent] = useState<boolean>(false);

  // Drag-to-move & resize state
  const [dragState, setDragState] = useState<{
    type: "move" | "resize";
    zoneId: string;
    handle?: "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";
    startClientX: number;
    startClientY: number;
    initialZone: TemplateSlotZone;
  } | null>(null);

  // Snipping-tool click-drag drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCodeText, setImportCodeText] = useState("");
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Direct In-Place Image Cropper state (operates without switching tabs)
  const [cropTarget, setCropTarget] = useState<CropTargetInfo | null>(null);

  const handleOpenCropper = (
    imageUrl: string,
    targetType: "zone" | "background",
    zoneId?: string,
    label?: string
  ) => {
    if (!imageUrl) {
      setToastNotification("⚠️ No image available to crop.");
      return;
    }
    setCropTarget({
      imageUrl,
      targetType,
      zoneId: zoneId || (targetType === "zone" ? selectedZoneId || undefined : undefined),
      label: label || (targetType === "background" ? "Background Artwork" : "Selected Photo Slot"),
    });
  };

  const handleApplyCrop = (
    croppedDataUrl: string,
    targetType: "zone" | "background",
    zoneId?: string
  ) => {
    if (targetType === "zone") {
      const targetId = zoneId || selectedZoneId;
      if (targetId) {
        const nextZones = zones.map((z) =>
          z.id === targetId ? { ...z, sampleAvatarUrl: croppedDataUrl } : z
        );
        pushHistory(nextZones);
        setToastNotification("✂️ Photo cropped and updated in slot!");
      }
    } else if (targetType === "background") {
      setBackgroundUrl(croppedDataUrl);
      setToastNotification("✂️ Background artwork cropped and updated!");
    }
    setCropTarget(null);
  };

  // Canvas container ref
  const canvasRef = useRef<HTMLDivElement>(null);

  // Currently selected zone
  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;

  // Active test persona for studio preview
  const [previewPersona] = useState(SIMULATED_PERSONAS[0]);

  // Convert mouse event to percentage relative to canvas (unconstrained for bleed / off-canvas support)
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent): { x: number; y: number } | null => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    },
    []
  );

  // Zone selection & drag start
  const handleZoneMouseDown = (e: React.MouseEvent, zone: TemplateSlotZone) => {
    if (activeTool !== "select") return;
    e.stopPropagation();
    setSelectedZoneId(zone.id);

    if (zone.locked) return;

    setDragState({
      type: "move",
      zoneId: zone.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialZone: { ...zone },
    });
  };

  // Resize handle mousedown
  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    zone: TemplateSlotZone,
    handle: "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se"
  ) => {
    e.stopPropagation();
    setSelectedZoneId(zone.id);

    if (zone.locked) return;

    setDragState({
      type: "resize",
      zoneId: zone.id,
      handle,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialZone: { ...zone },
    });
  };

  // Canvas mousedown (for drawing or clicking empty area)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select") {
      setSelectedZoneId(null);
      return;
    }
    const coords = getCanvasCoords(e);
    if (!coords) return;

    setIsDrawing(true);
    setDrawStart(coords);
    setCurrentBox({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  // Global window listeners for drag & resize: ensures dragging smoothly outside the template canvas
  useEffect(() => {
    if (!dragState && !isDrawing) return;

    const onPointerMove = (e: MouseEvent) => {
      if (dragState && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const deltaXPercent = ((e.clientX - dragState.startClientX) / rect.width) * 100;
        const deltaYPercent = ((e.clientY - dragState.startClientY) / rect.height) * 100;

        if (dragState.type === "move") {
          let newX = Math.round((dragState.initialZone.x + deltaXPercent) * 10) / 10;
          let newY = Math.round((dragState.initialZone.y + deltaYPercent) * 10) / 10;

          // Allow elements to freely bleed and move outside the template boundaries (-80% to 160%)
          newX = Math.max(-80, Math.min(160, newX));
          newY = Math.max(-80, Math.min(160, newY));

          // Magnetic Snap Guides
          let guideX: number | null = null;
          let guideY: number | null = null;

          if (snapEnabled) {
            const centerX = newX + dragState.initialZone.width / 2;
            const centerY = newY + dragState.initialZone.height / 2;

            // Snap to Canvas Center X (50%)
            if (Math.abs(centerX - 50) < 1.4) {
              newX = 50 - dragState.initialZone.width / 2;
              guideX = 50;
            }
            // Snap to Canvas Center Y (50%)
            if (Math.abs(centerY - 50) < 1.4) {
              newY = 50 - dragState.initialZone.height / 2;
              guideY = 50;
            }
          }

          setActiveSnapGuides({ x: guideX, y: guideY });

          setZones((prev) =>
            prev.map((z) =>
              z.id === dragState.zoneId ? { ...z, x: newX, y: newY } : z
            )
          );
        } else if (dragState.type === "resize" && dragState.handle) {
          const init = dragState.initialZone;
          let newX = init.x;
          let newY = init.y;
          let newW = init.width;
          let newH = init.height;

          if (dragState.handle.includes("e")) {
            newW = Math.max(2, Math.min(250, init.width + deltaXPercent));
          }
          if (dragState.handle.includes("w")) {
            newX = init.x + deltaXPercent;
            newW = Math.max(2, init.width - deltaXPercent);
          }
          if (dragState.handle.includes("s")) {
            newH = Math.max(2, Math.min(250, init.height + deltaYPercent));
          }
          if (dragState.handle.includes("n")) {
            newY = init.y + deltaYPercent;
            newH = Math.max(2, init.height - deltaYPercent);
          }

          setZones((prev) =>
            prev.map((z) =>
              z.id === dragState.zoneId
                ? {
                  ...z,
                  x: Math.round(newX * 10) / 10,
                  y: Math.round(newY * 10) / 10,
                  width: Math.round(newW * 10) / 10,
                  height: Math.round(newH * 10) / 10,
                }
                : z
            )
          );
        }
      } else if (isDrawing && drawStart && canvasRef.current) {
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
      }
    };

    const onPointerUp = () => {
      setActiveSnapGuides({ x: null, y: null });

      if (dragState) {
        setDragState(null);
        setHistory((prev) => [...prev.slice(-30), zones]);
        setFuture([]);
      }

      if (isDrawing && currentBox) {
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
            borderWidth: 2,
            shadow: true,
            zIndex: 4,
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
            fontSize: Math.max(12, Math.min(22, Math.round(currentBox.h * 1.4))),
            color: "#FFFFFF",
            fontWeight: "700",
            fontFamily: "Poppins",
            alignment: "center",
            textShadow: true,
            zIndex: 5,
          };
        } else {
          newZone = {
            id: newId,
            type: "shape",
            label: "Shape Container",
            x: currentBox.x,
            y: currentBox.y,
            width: currentBox.w,
            height: currentBox.h,
            shapeType: currentBox.h > 18 ? "rectangle" : "pill",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            borderRadius: 8,
            opacity: 0.9,
            zIndex: 2,
          };
        }

        pushHistory([...zones, newZone]);
        setSelectedZoneId(newId);
        setActiveTool("select");
        setIsDrawing(false);
        setDrawStart(null);
        setCurrentBox(null);
      }
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
    };
  }, [dragState, isDrawing, drawStart, currentBox, snapEnabled, zones, activeTool, getCanvasCoords]);

  // Zone CRUD operations
  const updateZoneById = (id: string, updates: Partial<TemplateSlotZone>) => {
    pushHistory(
      zones.map((zone) =>
        zone.id === id ? { ...zone, ...updates } : zone
      )
    );
  };

  const updateSelectedZone = (updates: Partial<TemplateSlotZone>) => {
    if (!selectedZoneId) return;
    updateZoneById(selectedZoneId, updates);
  };

  const handleDeleteZone = (id: string) => {
    pushHistory(zones.filter((z) => z.id !== id));
    if (selectedZoneId === id) setSelectedZoneId(null);
  };

  const handleDuplicateZone = (id: string) => {
    const target = zones.find((z) => z.id === id);
    if (!target) return;
    const copyId = `zone-${Date.now().toString(36)}`;
    const duplicated: TemplateSlotZone = {
      ...target,
      id: copyId,
      label: `${target.label || "Zone"} (Copy)`,
      x: Math.min(80, target.x + 3),
      y: Math.min(80, target.y + 3),
      zIndex: (target.zIndex || 2) + 1,
    };
    pushHistory([...zones, duplicated]);
    setSelectedZoneId(copyId);
  };

  const handleMoveLayerUp = (id: string) => {
    const target = zones.find((z) => z.id === id);
    if (!target) return;
    updateSelectedZone({ zIndex: (target.zIndex || 1) + 1 });
  };

  const handleMoveLayerDown = (id: string) => {
    const target = zones.find((z) => z.id === id);
    if (!target) return;
    updateSelectedZone({ zIndex: Math.max(1, (target.zIndex || 1) - 1) });
  };

  // Upload custom person/leader photo or cutout
  const handleUploadPersonPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (!dataUrl) return;

      const currentSelected = zones.find((z) => z.id === selectedZoneId);
      if (currentSelected && currentSelected.type === "photo") {
        updateSelectedZone({ sampleAvatarUrl: dataUrl });
        setToastNotification("📸 Person photo updated for selected slot!");
      } else {
        const newId = `zone-person-${Date.now().toString(36)}`;
        pushHistory([
          ...zones,
          {
            id: newId,
            type: "photo",
            label: "Person Cutout",
            photoShape: "cutout",
            sampleAvatarUrl: dataUrl,
            x: 25,
            y: 15,
            width: 55,
            height: 65,
            featherBottom: true,
            objectFit: "contain",
            zIndex: 4,
          },
        ]);
        setSelectedZoneId(newId);
        setToastNotification("📸 New person photo slot placed on poster!");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Apply preset leader (Modi Ji, Candidate, etc.)
  const handleApplyLeaderPreset = (leader: LeaderPhotoPreset) => {
    const currentSelected = zones.find((z) => z.id === selectedZoneId);
    if (currentSelected && currentSelected.type === "photo") {
      updateSelectedZone({
        sampleAvatarUrl: leader.url,
        photoShape: leader.type,
        label: leader.name,
        featherBottom: leader.featherBottom ?? (leader.type === "cutout"),
        objectFit: leader.type === "cutout" ? "contain" : "cover",
      });
      setToastNotification(`👤 Applied ${leader.name} photo to selected slot!`);
    } else {
      const newId = `zone-leader-${Date.now().toString(36)}`;
      pushHistory([
        ...zones,
        {
          id: newId,
          type: "photo",
          label: leader.name,
          photoShape: leader.type,
          sampleAvatarUrl: leader.url,
          x: leader.type === "cutout" ? 22 : 8,
          y: leader.type === "cutout" ? 14 : 75,
          width: leader.type === "cutout" ? 56 : 18,
          height: leader.type === "cutout" ? 66 : 18,
          featherBottom: leader.featherBottom ?? (leader.type === "cutout"),
          objectFit: leader.type === "cutout" ? "contain" : "cover",
          borderColor: leader.type === "circle" ? "#FFFFFF" : undefined,
          borderWidth: leader.type === "circle" ? 3 : 0,
          zIndex: 4,
        },
      ]);
      setSelectedZoneId(newId);
      setToastNotification(`👤 Placed ${leader.name} photo on poster!`);
    }
  };

  // Insert 1-Click Smart Contact Bar
  const handleAddSmartContactBar = () => {
    const contactBarZones = createSmartContactBarZones(89);
    pushHistory([...zones, ...contactBarZones]);
    setSelectedZoneId(contactBarZones[0].id);
    setToastNotification("✨ Smart 4-Item Contact Footer added!");
  };

  // 1-Click Apply Bottom or Bottom with Frame preset
  const handleApplyBottomPreset = (preset: BottomPresetItem) => {
    let baseZones = zones;
    if (replaceExistingBottom) {
      baseZones = stripExistingBottomZones(zones);
    }
    const newZones = preset.generateZones({
      startY: bottomStartY,
      avatarSide: bottomAvatarSide,
      primaryColor: primaryColor || "#0F172A",
      accentColor: accentColor || preset.accentColor,
    });
    pushHistory([...baseZones, ...newZones]);
    if (newZones.length > 0) {
      setSelectedZoneId(newZones[0].id);
    }
    setToastNotification(
      preset.kind === "only_bottom"
        ? `Applied "${preset.name}" bottom strip!`
        : `Applied "${preset.name}" frame & bottom!`
    );
  };

  // Remove applied bottoms / frames
  const handleRemoveExistingBottom = () => {
    const stripped = stripExistingBottomZones(zones);
    const count = zones.length - stripped.length;
    if (count === 0) {
      setToastNotification("No bottom or frame zones found to remove.");
      return;
    }
    pushHistory(stripped);
    setSelectedZoneId(null);
    setToastNotification(`🗑️ Removed ${count} bottom / frame elements!`);
  };

  // Insert Ready Slogan
  const handleInsertSlogan = (sloganText: string) => {
    const newId = `zone-slogan-${Date.now().toString(36)}`;
    const newZone: TemplateSlotZone = {
      id: newId,
      type: "text",
      label: "Greeting Slogan",
      customText: sloganText,
      textBinding: "custom",
      x: 10,
      y: 18,
      width: 80,
      height: 9,
      fontSize: 16,
      fontWeight: "800",
      fontFamily: "Noto Sans Devanagari",
      color: "#FFE259",
      textGradient: "gold",
      textShadow: true,
      alignment: "center",
      autoFitText: true,
      wrapText: true,
      zIndex: 6,
    };
    pushHistory([...zones, newZone]);
    setSelectedZoneId(newId);
    setToastNotification("Inserted greeting slogan!");
  };

  // Insert Cultural / Political Asset
  const handleInsertAsset = (item: (typeof PARTY_AND_CULTURAL_ASSETS)[0]) => {
    const newId = `zone-asset-${Date.now().toString(36)}`;
    const newZone: TemplateSlotZone = {
      id: newId,
      type: item.defaultZone.type || "shape",
      label: item.name,
      x: 42,
      y: 75,
      width: item.defaultZone.width || 14,
      height: item.defaultZone.height || 14,
      backgroundColor: item.defaultZone.backgroundColor,
      borderRadius: item.defaultZone.borderRadius,
      iconType: item.defaultZone.iconType,
      zIndex: 5,
    };
    pushHistory([...zones, newZone]);
    setSelectedZoneId(newId);
    setToastNotification(`Added ${item.name}!`);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.includes("svg") || file.name.endsWith(".svg")) {
      file.text().then((svgText) => {
        const parsed = parseSvgTemplate(svgText);
        if (parsed.canvasWidth && parsed.canvasHeight) {
          setArtworkAspectRatio(parsed.canvasWidth / parsed.canvasHeight);
        }
        if (parsed.backgroundUrl) {
          setBackgroundUrl(parsed.backgroundUrl);
        }
        if (parsed.zones.length > 0) {
          pushHistory(parsed.zones);
          setSelectedZoneId(parsed.zones[0].id);
          setToastNotification(`Loaded ${parsed.zones.length} slots from SVG template!`);
        }
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setBackgroundUrl(dataUrl);
        setToastNotification("New artwork loaded.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Import code from modal
  const handleApplyImportedCode = () => {
    const raw = importCodeText.trim();
    if (!raw) return;

    if (raw.includes("<svg")) {
      const parsedSvg = parseSvgTemplate(raw);
      if (parsedSvg.backgroundUrl) setBackgroundUrl(parsedSvg.backgroundUrl);
      if (parsedSvg.canvasWidth && parsedSvg.canvasHeight) {
        setArtworkAspectRatio(parsedSvg.canvasWidth / parsedSvg.canvasHeight);
      }
      if (parsedSvg.zones.length > 0) {
        pushHistory(parsedSvg.zones);
        setSelectedZoneId(parsedSvg.zones[0].id);
        setShowImportModal(false);
        setImportCodeText("");
        setToastNotification(`Loaded ${parsedSvg.zones.length} slots from SVG code!`);
        return;
      }
    }

    const parsed = parsePostHubSpec(raw);
    if (parsed.length > 0) {
      pushHistory(parsed);
      setSelectedZoneId(parsed[0].id);
      setShowImportModal(false);
      setImportCodeText("");
      setToastNotification(`Imported ${parsed.length} slots from code!`);
    } else {
      setErrorMessage("Could not parse coordinates from the pasted text.");
    }
  };

  // Save template to backend
  const handleSaveTemplate = async (publishImmediately?: boolean) => {
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

    const finalStatus = publishImmediately ? "Published" : status;
    if (publishImmediately) setStatus("Published");

    const payload: Partial<PosterTemplate> = {
      name: templateName.trim(),
      category,
      format,
      status: finalStatus,
      backgroundImageUrl: backgroundUrl,
      slotZones: zones,
      aspectRatio: artworkAspectRatio
        ? `${Math.round(artworkAspectRatio * 100) / 100}:1`
        : format,
      theme: "Modern Festive",
      description: "Custom visual studio template with dynamic slots.",
      updatedAt: new Date().toISOString(),
    };

    try {
      const isEditing = Boolean(initialTemplate?.id);
      let res: Response;

      if (isEditing) {
        res = await fetch(`/api/admin/templates/${initialTemplate!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/templates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", template: payload }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to save template.");
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setIsSaving(false);
      setToastNotification("🎉 Template saved successfully!");

      if (onSaved && data.template) {
        onSaved(data.template);
      }

      setTimeout(() => {
        router.push("/admin/templates");
      }, 1200);
    } catch {
      setErrorMessage("Network error: Could not reach the server.");
      setIsSaving(false);
    }
  };

  // Dynamic canvas dimension styling
  const canvasDimensions = (() => {
    const baseH = 540;
    if (artworkAspectRatio && artworkAspectRatio > 0) {
      const calcW = Math.round(baseH * artworkAspectRatio);
      return { width: calcW, height: baseH };
    }
    if (format === "3:4") return { width: 405, height: 540 };
    if (format === "4:5") return { width: 432, height: 540 };
    if (format === "1:1") return { width: 500, height: 500 };
    return { width: 304, height: 540 }; // 9:16
  })();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#161322",
        color: "#FFFFFF",
        fontFamily: "var(--font-family-sans, 'Inter', sans-serif)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* 1. TOP STUDIO NAVBAR (Dark Figma/Canva Professional Header) */}
      <header
        style={{
          height: "54px",
          backgroundColor: "#1D192E",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
          zIndex: 40,
        }}
      >
        {/* Left: Back & Editable Template Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link
            href="/admin/templates"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#A7A1B8",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 10px",
              borderRadius: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <ArrowLeft size={14} />
            <span>Templates</span>
          </Link>

          <div style={{ height: "18px", width: "1px", backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

          {/* Template Title Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid transparent",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: "6px",
                outline: "none",
                width: "240px",
              }}
              onFocus={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.08)")}
              onBlur={(e) => (e.target.style.backgroundColor = "transparent")}
            />

            {/* Format Pill */}
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as TemplateFormat)}
              style={{
                backgroundColor: "rgba(121, 86, 201, 0.2)",
                color: "#D8B4FE",
                border: "1px solid rgba(121, 86, 201, 0.4)",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="3:4" style={{ background: "#1D192E" }}>3:4 (Portrait)</option>
              <option value="4:5" style={{ background: "#1D192E" }}>4:5 (Insta Feed)</option>
              <option value="1:1" style={{ background: "#1D192E" }}>1:1 (Square)</option>
              <option value="9:16" style={{ background: "#1D192E" }}>9:16 (Story)</option>
            </select>

            {/* Status Selector Dropdown */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Draft" | "Published")}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: status === "Published" ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)",
                color: status === "Published" ? "#34D399" : "#FBBF24",
                border: status === "Published" ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(245, 158, 11, 0.5)",
                cursor: "pointer",
                outline: "none",
              }}
              title="Template status: Published templates immediately appear in the mobile/creator app"
            >
              <option value="Draft" style={{ background: "#201B33", color: "#FBBF24" }}>Draft</option>
              <option value="Published" style={{ background: "#201B33", color: "#34D399" }}>Published (Live in App)</option>
            </select>
          </div>
        </div>

        {/* Center: Quick Action Tool Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setActiveTool("select")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: activeTool === "select" ? "1px solid #7956C9" : "1px solid rgba(255,255,255,0.1)",
              backgroundColor: activeTool === "select" ? "rgba(121, 86, 201, 0.3)" : "transparent",
              color: activeTool === "select" ? "#D8B4FE" : "#A7A1B8",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <MousePointer size={13} />
            <span>Select</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("draw_photo")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: activeTool === "draw_photo" ? "1px solid #7956C9" : "1px solid rgba(255,255,255,0.1)",
              backgroundColor: activeTool === "draw_photo" ? "rgba(121, 86, 201, 0.3)" : "transparent",
              color: activeTool === "draw_photo" ? "#D8B4FE" : "#A7A1B8",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Camera size={13} />
            <span>Draw Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("draw_text")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: activeTool === "draw_text" ? "1px solid #7956C9" : "1px solid rgba(255,255,255,0.1)",
              backgroundColor: activeTool === "draw_text" ? "rgba(121, 86, 201, 0.3)" : "transparent",
              color: activeTool === "draw_text" ? "#D8B4FE" : "#A7A1B8",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Type size={13} />
            <span>Draw Text</span>
          </button>
        </div>

        {/* Right: Undo/Redo & Save Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Undo / Redo */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              title="Undo (Ctrl+Z)"
              style={{
                background: "none",
                border: "none",
                padding: "6px",
                borderRadius: "6px",
                color: history.length === 0 ? "rgba(255,255,255,0.2)" : "#FFFFFF",
                cursor: history.length === 0 ? "default" : "pointer",
              }}
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Y)"
              style={{
                background: "none",
                border: "none",
                padding: "6px",
                borderRadius: "6px",
                color: future.length === 0 ? "rgba(255,255,255,0.2)" : "#FFFFFF",
                cursor: future.length === 0 ? "default" : "pointer",
              }}
            >
              <Redo2 size={15} />
            </button>
          </div>

          <div style={{ height: "18px", width: "1px", backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

          {/* Paste AI Code Button */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#E2E8F0",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Code2 size={13} />
            <span>Paste Code</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={() => handleSaveTemplate(false)}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#E2E8F0",
              fontSize: "12px",
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
            title="Save as Draft in Admin"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          {/* Save & Publish to App Button */}
          <button
            type="button"
            onClick={() => handleSaveTemplate(true)}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              borderRadius: "8px",
              border: "none",
              background: saveSuccess
                ? "#10B981"
                : "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)",
              color: "#FFFFFF",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(121, 86, 201, 0.4)",
            }}
            title="Publish template so it immediately shows live in the mobile/creator app"
          >
            {isSaving ? (
              <span>Publishing...</span>
            ) : saveSuccess ? (
              <>
                <Check size={14} />
                <span>Live in App!</span>
              </>
            ) : (
              <>
                <Sparkles size={14} color="#FDE047" />
                <span>Publish to App</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN THREE-PANEL STUDIO BODY */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT DOCK: Vertical 56px Rail + Slideout Tool Drawer */}
        <div style={{ display: "flex", height: "100%", zIndex: 20 }}>
          {/* Vertical Icon Rail */}
          <div
            style={{
              width: "56px",
              backgroundColor: "#1A1728",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px 0",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {[
              { id: "artworks", label: "Art", icon: <ImageIcon size={18} /> },
              { id: "text", label: "Text", icon: <Type size={18} /> },
              { id: "photos", label: "Photos", icon: <Camera size={18} /> },
              { id: "shapes", label: "Shapes", icon: <Square size={18} /> },
              { id: "bottoms", label: "Bottoms", icon: <PanelBottom size={18} /> },
              { id: "elements", label: "Assets", icon: <Sparkle size={18} /> },
              { id: "layers", label: "Layers", icon: <Layers size={18} /> },
            ].map((t) => {
              const isActive = leftTab === t.id && isDrawerOpen;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    if (leftTab === t.id && isDrawerOpen) {
                      setIsDrawerOpen(false);
                    } else {
                      setLeftTab(t.id as any);
                      setIsDrawerOpen(true);
                    }
                  }}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: isActive ? "rgba(121, 86, 201, 0.35)" : "transparent",
                    color: isActive ? "#D8B4FE" : "#8A849C",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    cursor: "pointer",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                  }}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Slideout Tool Drawer (270px) */}
          {isDrawerOpen && (
            <div
              style={{
                width: "270px",
                backgroundColor: "#201B33",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                flexShrink: 0,
              }}
            >
              {/* Tab 1: Artworks & Backgrounds */}
              {leftTab === "artworks" && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Background Artwork</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Upload custom poster JPG/PNG or select preset.
                    </p>
                  </div>

                  {/* Upload button */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <label
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1.5px dashed rgba(121, 86, 201, 0.5)",
                        backgroundColor: "rgba(121, 86, 201, 0.1)",
                        color: "#D8B4FE",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Upload size={14} />
                      <span>Upload Poster</span>
                      <input type="file" accept="image/*,.svg" onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenCropper(backgroundUrl, "background", undefined, "Background Artwork")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "#93C5FD",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      title="Crop current background artwork directly in-place"
                    >
                      <Crop size={14} />
                      <span>Crop</span>
                    </button>
                  </div>

                  {/* Preset Gallery */}
                  <div>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#C4BFD6", marginBottom: "8px", display: "block" }}>
                      Preset Posters
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {PRESET_BACKGROUND_ARTWORKS.map((bg) => (
                        <div
                          key={bg.id}
                          onClick={() => {
                            setBackgroundUrl(bg.url);
                            setToastNotification(`Applied ${bg.name}`);
                          }}
                          style={{
                            height: "90px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            border: backgroundUrl === bg.url ? "2px solid #7956C9" : "1px solid rgba(255,255,255,0.1)",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <img src={bg.url} alt={bg.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                              display: "flex",
                              alignItems: "flex-end",
                              padding: "4px",
                            }}
                          >
                            <span style={{ fontSize: "9px", color: "#FFFFFF", fontWeight: 600 }}>{bg.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Typography & Indian Language Slogans */}
              {leftTab === "text" && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Add Text Slot</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Devanagari, Gujarati & English typography.
                    </p>
                  </div>

                  {/* Add Standard Text Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `zone-h1-${Date.now().toString(36)}`;
                        pushHistory([
                          ...zones,
                          {
                            id: newId,
                            type: "text",
                            label: "Big Heading",
                            textBinding: "custom",
                            customText: "शुभ दीपावली",
                            fontSize: 22,
                            fontWeight: "800",
                            fontFamily: "Rozha One",
                            color: "#FFFFFF",
                            x: 10,
                            y: 20,
                            width: 80,
                            height: 8,
                            alignment: "center",
                            textShadow: true,
                            zIndex: 6,
                          },
                        ]);
                        setSelectedZoneId(newId);
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: 800,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      + Add Heading (H1)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = `zone-sub-${Date.now().toString(36)}`;
                        pushHistory([
                          ...zones,
                          {
                            id: newId,
                            type: "text",
                            label: "Subheading",
                            textBinding: "name",
                            fontSize: 15,
                            fontWeight: "700",
                            fontFamily: "Poppins",
                            color: "#FFFFFF",
                            x: 15,
                            y: 80,
                            width: 70,
                            height: 6,
                            alignment: "center",
                            zIndex: 6,
                          },
                        ]);
                        setSelectedZoneId(newId);
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      + Add Subheading / User Name
                    </button>
                  </div>

                  {/* Ready Slogans & Quotes */}
                  <div>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#D8B4FE", marginBottom: "8px", display: "block" }}>
                      🇮🇳 Ready Slogans & Shayari (1-Click)
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {READY_SLOGAN_SNIPPETS.slice(0, 5).map((s) => (
                        <div
                          key={s.id}
                          onClick={() => handleInsertSlogan(s.text)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(0, 0, 0, 0.25)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            cursor: "pointer",
                          }}
                        >
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#FACC15" }}>{s.title}</div>
                          <div style={{ fontSize: "10px", color: "#C4BFD6", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {s.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Photos & Avatars */}
              {leftTab === "photos" && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Person Photos & Cutouts</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Upload custom person photo or select from leaders gallery.
                    </p>
                  </div>

                  {/* Prominent Upload Person Photo Button */}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "14px 10px",
                      borderRadius: "8px",
                      border: "2px dashed #7956C9",
                      backgroundColor: "rgba(121, 86, 201, 0.12)",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(121, 86, 201, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Upload size={18} color="#D8B4FE" />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>Upload Person Photo / Cutout</span>
                    <span style={{ fontSize: "10px", color: "#C4BFD6" }}>
                      PNG transparent cutout, JPG or WebP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPersonPhoto}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* In-Place Direct Crop Button for selected photo zone (No tab switch) */}
                  {selectedZone?.type === "photo" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenCropper(
                          selectedZone.sampleAvatarUrl || previewPersona.avatarUrl,
                          "zone",
                          selectedZone.id,
                          selectedZone.label || "Photo Slot"
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.4)",
                        color: "#93C5FD",
                        cursor: "pointer",
                        fontSize: "11.5px",
                        fontWeight: 700,
                      }}
                      title="Crop the currently selected photo slot directly without leaving this tab"
                    >
                      <Crop size={14} />
                      <span>✂️ Crop Selected Photo Directly</span>
                    </button>
                  )}

                  {/* Preset Indian Leaders & People Gallery */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#FACC15", textTransform: "uppercase" }}>
                        Popular Leaders Gallery
                      </span>
                      <span style={{ fontSize: "10px", color: "#8A849C" }}>1-Click Insert</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {LEADER_PHOTO_PRESETS.map((leader) => (
                        <div
                          key={leader.id}
                          onClick={() => handleApplyLeaderPreset(leader)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: leader.type === "circle" ? "50%" : "6px",
                              overflow: "hidden",
                              backgroundColor: "#161324",
                              flexShrink: 0,
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            <img
                              src={leader.url}
                              alt={leader.name}
                              style={{ width: "100%", height: "100%", objectFit: leader.type === "cutout" ? "contain" : "cover" }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {leader.name}
                            </div>
                            <div style={{ fontSize: "9.5px", color: "#A099B5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {leader.role}
                            </div>
                          </div>
                          <Plus size={14} color="#7956C9" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Blank Photo Slots */}
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Add Blank Photo Slots
                    </span>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {/* Cutout Leader */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-leader-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "photo",
                              label: "Leader Cutout",
                              photoShape: "cutout",
                              x: 20,
                              y: 10,
                              width: 58,
                              height: 68,
                              featherBottom: true,
                              objectFit: "contain",
                              zIndex: 4,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(121, 86, 201, 0.2)",
                          border: "1px solid rgba(121, 86, 201, 0.4)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>👤</span>
                        <span>Leader Cutout (Bottom Feather)</span>
                      </button>

                      {/* Circle User Photo */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-circle-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "photo",
                              label: "User Avatar Circle",
                              photoShape: "circle",
                              borderColor: "#FFFFFF",
                              borderWidth: 3,
                              shadow: true,
                              x: 8,
                              y: 75,
                              width: 18,
                              height: 18,
                              zIndex: 4,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>⚪</span>
                        <span>Circular Avatar (White Border)</span>
                      </button>

                      {/* Squircle Avatar */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-squircle-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "photo",
                              label: "Squircle Avatar",
                              photoShape: "squircle",
                              borderColor: "#FFFFFF",
                              borderWidth: 2,
                              shadow: true,
                              x: 8,
                              y: 75,
                              width: 18,
                              height: 18,
                              zIndex: 4,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span>🔲</span>
                        <span>Squircle Avatar (Smooth Radius)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Shapes, Cards & Banners */}
              {leftTab === "shapes" && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Shapes, Cards & Banners</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Boxes, Circles, Candidate Strips & Dividers.
                    </p>
                  </div>

                  {/* 1. Political & Poster Name Banners */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#FACC15", textTransform: "uppercase" }}>
                        Political & Slogan Banners
                      </span>
                      <span style={{ fontSize: "10px", color: "#8A849C" }}>1-Click Add</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {/* Candidate Name Strip */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-banner-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Candidate Name Strip",
                              shapeType: "banner",
                              x: 8,
                              y: 82,
                              width: 84,
                              height: 11,
                              backgroundColor: "#FFFFFF",
                              borderColor: "#FF9933",
                              borderWidth: 2,
                              borderRadius: 14,
                              shadow: true,
                              zIndex: 3,
                            },
                          ]);
                          setSelectedZoneId(newId);
                          setToastNotification("🏷️ Added Candidate White Name Strip!");
                        }}
                        style={{
                          padding: "9px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 153, 51, 0.15)",
                          border: "1px solid rgba(255, 153, 51, 0.35)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>🏷️</span>
                          <div>
                            <div>Candidate White Name Strip</div>
                            <div style={{ fontSize: "9.5px", color: "#FDBA74", fontWeight: 400 }}>Orange border + curved corners</div>
                          </div>
                        </div>
                        <Plus size={14} color="#FF9933" />
                      </button>

                      {/* Tricolor Accent Bar */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-tricolor-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Tricolor Accent Bar",
                              shapeType: "bar",
                              x: 0,
                              y: 95,
                              width: 100,
                              height: 3,
                              backgroundColor: "#FF9933",
                              borderColor: "#138808",
                              borderWidth: 1,
                              borderRadius: 0,
                              zIndex: 3,
                            },
                          ]);
                          setSelectedZoneId(newId);
                          setToastNotification("🇮🇳 Added Tricolor Accent Footer Bar!");
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>🇮🇳</span>
                          <span>Tricolor Footer Accent Strip</span>
                        </div>
                        <Plus size={14} color="#7956C9" />
                      </button>

                      {/* Gold Foil Slogan Bar */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-gold-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Gold Slogan Banner",
                              shapeType: "bar",
                              x: 10,
                              y: 12,
                              width: 80,
                              height: 8,
                              backgroundColor: "#D97706",
                              borderColor: "#FDE68A",
                              borderWidth: 1.5,
                              borderRadius: 8,
                              shadow: true,
                              zIndex: 3,
                            },
                          ]);
                          setSelectedZoneId(newId);
                          setToastNotification("👑 Added Gold Foil Slogan Banner!");
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(217, 119, 6, 0.15)",
                          border: "1px solid rgba(217, 119, 6, 0.35)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>👑</span>
                          <span>Gold Foil Slogan Banner</span>
                        </div>
                        <Plus size={14} color="#F59E0B" />
                      </button>

                      {/* Dark Glass Overlay Tint */}
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `zone-tint-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Dark Glass Tint Panel",
                              shapeType: "rectangle",
                              x: 0,
                              y: 65,
                              width: 100,
                              height: 35,
                              backgroundColor: "rgba(15, 23, 42, 0.8)",
                              borderRadius: 0,
                              zIndex: 2,
                            },
                          ]);
                          setSelectedZoneId(newId);
                          setToastNotification("⬛ Added Dark Bottom Gradient Tint!");
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#FFFFFF",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>⬛</span>
                          <span>Dark Glass Tint (Text Backdrop)</span>
                        </div>
                        <Plus size={14} color="#7956C9" />
                      </button>
                    </div>
                  </div>

                  {/* 2. Geometric Shapes */}
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Geometric Shapes
                    </span>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {/* Rectangle Box */}
                      <div
                        onClick={() => {
                          const newId = `zone-rect-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Rectangle Box",
                              shapeType: "rectangle",
                              x: 15,
                              y: 30,
                              width: 70,
                              height: 20,
                              backgroundColor: "rgba(0, 0, 0, 0.65)",
                              borderRadius: 0,
                              borderWidth: 1,
                              borderColor: "rgba(255,255,255,0.2)",
                              zIndex: 2,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div style={{ width: 32, height: 22, backgroundColor: "#334155", border: "1px solid #94A3B8" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#FFF" }}>Rectangle</span>
                      </div>

                      {/* Rounded Card */}
                      <div
                        onClick={() => {
                          const newId = `zone-card-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Rounded Card",
                              shapeType: "card",
                              x: 12,
                              y: 25,
                              width: 76,
                              height: 25,
                              backgroundColor: "#FFFFFF",
                              borderRadius: 14,
                              shadow: true,
                              borderWidth: 1,
                              borderColor: "rgba(0,0,0,0.1)",
                              zIndex: 2,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div style={{ width: 32, height: 22, backgroundColor: "#FFF", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#FFF" }}>Rounded Card</span>
                      </div>

                      {/* Circle */}
                      <div
                        onClick={() => {
                          const newId = `zone-circle-shape-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Circle Badge",
                              shapeType: "circle",
                              x: 38,
                              y: 35,
                              width: 24,
                              height: 24,
                              backgroundColor: "#FF9933",
                              borderRadius: 999,
                              borderColor: "#FFFFFF",
                              borderWidth: 3,
                              shadow: true,
                              zIndex: 3,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div style={{ width: 24, height: 24, backgroundColor: "#FF9933", borderRadius: "50%", border: "2px solid #FFF" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#FFF" }}>Circle Badge</span>
                      </div>

                      {/* Pill Badge */}
                      <div
                        onClick={() => {
                          const newId = `zone-pill-${Date.now().toString(36)}`;
                          pushHistory([
                            ...zones,
                            {
                              id: newId,
                              type: "shape",
                              label: "Pill Badge",
                              shapeType: "pill",
                              x: 25,
                              y: 75,
                              width: 50,
                              height: 8,
                              backgroundColor: "#FFFFFF",
                              borderRadius: 999,
                              borderColor: "#7956C9",
                              borderWidth: 1.5,
                              shadow: true,
                              zIndex: 3,
                            },
                          ]);
                          setSelectedZoneId(newId);
                        }}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div style={{ width: 34, height: 14, backgroundColor: "#FFF", borderRadius: "999px", border: "1.5px solid #7956C9" }} />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#FFF" }}>Pill Badge</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Divider Lines */}
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Divider Line
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `zone-line-${Date.now().toString(36)}`;
                        pushHistory([
                          ...zones,
                          {
                            id: newId,
                            type: "shape",
                            label: "Accent Line",
                            shapeType: "line",
                            x: 10,
                            y: 50,
                            width: 80,
                            height: 0.8,
                            backgroundColor: "#F59E0B",
                            borderRadius: 2,
                            zIndex: 3,
                          },
                        ]);
                        setSelectedZoneId(newId);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "#FFF",
                        fontSize: "11.5px",
                        fontWeight: 600,
                      }}
                    >
                      <div style={{ flex: 1, height: "2px", backgroundColor: "#F59E0B", borderRadius: "2px" }} />
                      <span>Add Horizontal Line</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Party Symbols & Cultural Assets */}
              {leftTab === "elements" && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Party & Cultural Assets</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Click any element to place on poster.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {PARTY_AND_CULTURAL_ASSETS.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleInsertAsset(item)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        {item.svg}
                        <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#E2E8F0" }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Bottoms & Frames (The Only Bottoms + Bottoms with Frames) */}
              {(leftTab === "bottoms" || leftTab === "contact") && (
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Bottoms & Frames</span>
                    <p style={{ fontSize: "11px", color: "#A099B5", margin: "2px 0 0 0" }}>
                      Footer branding strips & full poster frames with integrated contact slots.
                    </p>
                  </div>

                  {/* Segmented Mode Selector: "The Only Bottoms" vs "Bottoms with Frames" */}
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      padding: "3px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setBottomSubTab("only_bottom")}
                      style={{
                        flex: 1,
                        padding: "7px 4px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: bottomSubTab === "only_bottom" ? "#7956C9" : "transparent",
                        color: bottomSubTab === "only_bottom" ? "#FFFFFF" : "#A099B5",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>📌 The Only Bottoms</span>
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "1px 5px",
                          borderRadius: "10px",
                          backgroundColor:
                            bottomSubTab === "only_bottom"
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(255,255,255,0.08)",
                          color: "#FFF",
                        }}
                      >
                        {BOTTOMS_AND_FRAMES_CATALOG.filter((b) => b.kind === "only_bottom").length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBottomSubTab("bottom_with_frame")}
                      style={{
                        flex: 1,
                        padding: "7px 4px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: bottomSubTab === "bottom_with_frame" ? "#7956C9" : "transparent",
                        color: bottomSubTab === "bottom_with_frame" ? "#FFFFFF" : "#A099B5",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>🖼️ Bottoms with Frames</span>
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "1px 5px",
                          borderRadius: "10px",
                          backgroundColor:
                            bottomSubTab === "bottom_with_frame"
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(255,255,255,0.08)",
                          color: "#FFF",
                        }}
                      >
                        {BOTTOMS_AND_FRAMES_CATALOG.filter((b) => b.kind === "bottom_with_frame").length}
                      </span>
                    </button>
                  </div>

                  {/* Actions & Replace Options */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#C4BFD6", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={replaceExistingBottom}
                        onChange={(e) => setReplaceExistingBottom(e.target.checked)}
                        style={{ accentColor: "#7956C9" }}
                      />
                      <span>Replace existing bottom</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveExistingBottom}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "5px",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        backgroundColor: "rgba(239, 68, 68, 0.15)",
                        color: "#FCA5A5",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title="Clear applied bottom/frame zones from canvas"
                    >
                      <Trash2 size={11} />
                      <span>Clear</span>
                    </button>
                  </div>

                  {/* Fine-Tuning Controls (Avatar placement & Y height) */}
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "10.5px", color: "#A099B5" }}>Avatar Placement:</span>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {(["left", "right", "none"] as const).map((side) => (
                          <button
                            key={side}
                            type="button"
                            onClick={() => setBottomAvatarSide(side)}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              border: "none",
                              backgroundColor: bottomAvatarSide === side ? "rgba(121, 86, 201, 0.5)" : "rgba(255,255,255,0.06)",
                              color: bottomAvatarSide === side ? "#D8B4FE" : "#8A849C",
                              fontSize: "10px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              cursor: "pointer",
                            }}
                          >
                            {side}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontSize: "10.5px", color: "#A099B5" }}>Bottom Height (Y%):</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <input
                          type="range"
                          min="78"
                          max="94"
                          value={bottomStartY}
                          onChange={(e) => setBottomStartY(parseInt(e.target.value, 10))}
                          style={{ width: "85px", accentColor: "#7956C9" }}
                        />
                        <span style={{ fontSize: "10px", color: "#E2E8F0", width: "26px", textAlign: "right" }}>
                          {bottomStartY}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Filter Tags */}
                  <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "2px" }}>
                    {["All", "Corporate", "Festive", "Political", "Minimal", "Tech"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setBottomTagFilter(tag)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "12px",
                          border: "none",
                          backgroundColor: bottomTagFilter === tag ? "#7956C9" : "rgba(255, 255, 255, 0.06)",
                          color: bottomTagFilter === tag ? "#FFFFFF" : "#A099B5",
                          fontSize: "10px",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Preset Cards List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {BOTTOMS_AND_FRAMES_CATALOG.filter((item) => {
                      const matchesKind = item.kind === bottomSubTab;
                      const matchesTag = bottomTagFilter === "All" || item.tag === bottomTagFilter;
                      return matchesKind && matchesTag;
                    }).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          overflow: "hidden",
                          transition: "border-color 0.15s ease",
                        }}
                      >
                        {/* Visual SVG Thumbnail */}
                        <div style={{ padding: "6px 8px", backgroundColor: "rgba(0, 0, 0, 0.25)" }}>
                          {item.previewSvg(primaryColor, accentColor)}
                        </div>

                        {/* Details & Apply Button */}
                        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#FFFFFF" }}>{item.name}</span>
                            <span
                              style={{
                                fontSize: "9px",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor: "rgba(121, 86, 201, 0.25)",
                                color: "#D8B4FE",
                                fontWeight: 700,
                              }}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <p style={{ fontSize: "10px", color: "#A099B5", margin: 0, lineHeight: 1.35 }}>
                            {item.description}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleApplyBottomPreset(item)}
                            style={{
                              width: "100%",
                              padding: "6px 10px",
                              marginTop: "2px",
                              borderRadius: "6px",
                              border: "none",
                              background:
                                item.kind === "only_bottom"
                                  ? "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)"
                                  : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            }}
                          >
                            <Plus size={12} />
                            <span>
                              {item.kind === "only_bottom" ? "+ Apply Bottom" : "+ Apply Frame & Bottom"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Simple 4-Item Contact Strip button */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={handleAddSmartContactBar}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        border: "1px dashed rgba(255, 255, 255, 0.2)",
                        color: "#C4BFD6",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Plus size={13} />
                      <span>+ Add Simple 4-Item Contact Strip</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 6: Layers Panel */}
              {leftTab === "layers" && (
                <StudioLayersPanel
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  onSelectZone={(id) => setSelectedZoneId(id)}
                  onUpdateZone={updateZoneById}
                  onDeleteZone={handleDeleteZone}
                  onDuplicateZone={handleDuplicateZone}
                  onMoveLayerUp={handleMoveLayerUp}
                  onMoveLayerDown={handleMoveLayerDown}
                />
              )}
            </div>
          )}
        </div>

        {/* CENTER VIEWPORT: Canvas Studio Workbench */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#161322",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Contextual Ribbon (Canva-style formatting bar for selected zone) */}
          <div
            style={{
              height: "44px",
              backgroundColor: "#201B33",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: "10px",
              flexShrink: 0,
              fontSize: "12px",
            }}
          >
            {selectedZone ? (
              <>
                <span style={{ fontWeight: 700, color: "#D8B4FE", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>{selectedZone.label || selectedZone.type}</span>
                </span>

                <div style={{ height: "16px", width: "1px", backgroundColor: "rgba(255, 255, 255, 0.15)" }} />

                {/* If Text zone is selected */}
                {selectedZone.type === "text" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Font Family selector */}
                    <select
                      value={selectedZone.fontFamily || "Poppins"}
                      onChange={(e) => updateSelectedZone({ fontFamily: e.target.value })}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {INDIAN_FONTS_CATALOG.map((f) => (
                        <option key={f.id} value={f.name} style={{ background: "#201B33" }}>
                          {f.name}
                        </option>
                      ))}
                    </select>

                    {/* Font Size controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      <button
                        type="button"
                        onClick={() => updateSelectedZone({ fontSize: Math.max(9, (selectedZone.fontSize || 14) - 1) })}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "none",
                          color: "#FFF",
                          width: "22px",
                          height: "22px",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: "0 6px", fontWeight: 700 }}>{selectedZone.fontSize || 14}</span>
                      <button
                        type="button"
                        onClick={() => updateSelectedZone({ fontSize: Math.min(48, (selectedZone.fontSize || 14) + 1) })}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "none",
                          color: "#FFF",
                          width: "22px",
                          height: "22px",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Text Color picker */}
                    <input
                      type="color"
                      value={selectedZone.color || "#FFFFFF"}
                      onChange={(e) => updateSelectedZone({ color: e.target.value })}
                      style={{ width: "24px", height: "24px", border: "none", cursor: "pointer", borderRadius: "4px", backgroundColor: "transparent" }}
                      title="Text Color"
                    />

                    {/* Text Gradient */}
                    <select
                      value={selectedZone.textGradient || "none"}
                      onChange={(e) => updateSelectedZone({ textGradient: e.target.value === "none" ? undefined : e.target.value })}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        padding: "3px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      <option value="none" style={{ background: "#201B33" }}>Solid Color</option>
                      <option value="gold" style={{ background: "#201B33" }}>✨ Gold Foil</option>
                      <option value="tricolor" style={{ background: "#201B33" }}>🇮🇳 Tricolor</option>
                    </select>

                    {/* Curved Text Toggle & Slider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "11px" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedZone.curvedText)}
                          onChange={(e) => updateSelectedZone({ curvedText: e.target.checked, curveAngle: e.target.checked ? 30 : 0 })}
                        />
                        <span>Curved</span>
                      </label>
                      {selectedZone.curvedText && (
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={selectedZone.curveAngle || 30}
                          onChange={(e) => updateSelectedZone({ curveAngle: parseInt(e.target.value, 10) })}
                          style={{ width: "65px", accentColor: "#7956C9" }}
                          title={`Curve angle: ${selectedZone.curveAngle || 30}°`}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* If Photo zone is selected */}
                {selectedZone.type === "photo" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Inline Change/Upload Photo */}
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#7956C9",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      title="Upload person photo or transparent cutout"
                    >
                      <Camera size={13} />
                      <span>{selectedZone.sampleAvatarUrl ? "Change Photo" : "Upload Person Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPersonPhoto}
                        style={{ display: "none" }}
                      />
                    </label>

                    {/* Inline Direct Crop Button (No Tab Switch) */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenCropper(
                          selectedZone.sampleAvatarUrl || previewPersona.avatarUrl,
                          "zone",
                          selectedZone.id,
                          selectedZone.label || "Photo Slot"
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "3px 9px",
                        borderRadius: "4px",
                        backgroundColor: "#3B82F6",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "none",
                      }}
                      title="Crop this photo directly in-place without changing tabs"
                    >
                      <Crop size={13} />
                      <span>Crop Image</span>
                    </button>

                    {selectedZone.sampleAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => updateSelectedZone({ sampleAvatarUrl: undefined })}
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#C4BFD6",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          fontSize: "10.5px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        title="Revert to simulated user avatar"
                      >
                        Reset Photo
                      </button>
                    )}

                    {/* Shape selector */}
                    <select
                      value={selectedZone.photoShape || "circle"}
                      onChange={(e) => updateSelectedZone({ photoShape: e.target.value as PhotoSlotShape })}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      <option value="cutout" style={{ background: "#201B33" }}>Cutout Silhouette</option>
                      <option value="circle" style={{ background: "#201B33" }}>Circle Avatar</option>
                      <option value="squircle" style={{ background: "#201B33" }}>Squircle</option>
                      <option value="rectangle" style={{ background: "#201B33" }}>Rectangle</option>
                    </select>

                    {/* Object Fit mode */}
                    <select
                      value={selectedZone.objectFit || (selectedZone.photoShape === "cutout" ? "contain" : "cover")}
                      onChange={(e) => updateSelectedZone({ objectFit: e.target.value as "cover" | "contain" })}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                      title="Object Fit"
                    >
                      <option value="contain" style={{ background: "#201B33" }}>Contain (Full Body)</option>
                      <option value="cover" style={{ background: "#201B33" }}>Cover (Fill Box)</option>
                    </select>

                    {/* Feather bottom for cutouts */}
                    {selectedZone.photoShape === "cutout" && (
                      <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "11px" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedZone.featherBottom)}
                          onChange={(e) => updateSelectedZone({ featherBottom: e.target.checked })}
                        />
                        <span>Soft Feather Bottom</span>
                      </label>
                    )}
                  </div>
                )}

                {/* If Shape zone is selected */}
                {selectedZone.type === "shape" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Fill Color Picker */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10.5px", color: "#A099B5" }}>Fill:</span>
                      <input
                        type="color"
                        value={selectedZone.backgroundColor?.startsWith("#") ? selectedZone.backgroundColor : "#1E1A33"}
                        onChange={(e) => updateSelectedZone({ backgroundColor: e.target.value })}
                        style={{ width: "24px", height: "24px", border: "none", cursor: "pointer", borderRadius: "4px", backgroundColor: "transparent" }}
                        title="Shape Fill Color"
                      />
                    </div>

                    {/* Shape Type Selector */}
                    <select
                      value={selectedZone.shapeType || "rectangle"}
                      onChange={(e) => {
                        const st = e.target.value as ShapeSlotType;
                        updateSelectedZone({
                          shapeType: st,
                          borderRadius: st === "circle" ? 999 : st === "pill" ? 999 : st === "card" ? 14 : 0,
                        });
                      }}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      <option value="rectangle" style={{ background: "#201B33" }}>Rectangle</option>
                      <option value="card" style={{ background: "#201B33" }}>Rounded Card</option>
                      <option value="circle" style={{ background: "#201B33" }}>Circle</option>
                      <option value="pill" style={{ background: "#201B33" }}>Pill Badge</option>
                      <option value="banner" style={{ background: "#201B33" }}>Name Banner Strip</option>
                      <option value="line" style={{ background: "#201B33" }}>Divider Line</option>
                    </select>

                    {/* Border Width & Color */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10.5px", color: "#A099B5" }}>Border:</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={selectedZone.borderWidth ?? 0}
                        onChange={(e) => updateSelectedZone({ borderWidth: parseInt(e.target.value, 10) || 0 })}
                        style={{ width: "38px", padding: "2px 4px", fontSize: "11px", backgroundColor: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFF", borderRadius: "4px" }}
                        title="Border Width"
                      />
                      <input
                        type="color"
                        value={selectedZone.borderColor || "#FFFFFF"}
                        onChange={(e) => updateSelectedZone({ borderColor: e.target.value })}
                        style={{ width: "22px", height: "22px", border: "none", cursor: "pointer", borderRadius: "4px", backgroundColor: "transparent" }}
                        title="Border Color"
                      />
                    </div>

                    {/* Corner Radius Slider (for non-circle/pill) */}
                    {selectedZone.shapeType !== "circle" && selectedZone.shapeType !== "pill" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "10px", color: "#A099B5" }}>Radius:</span>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={selectedZone.borderRadius ?? 6}
                          onChange={(e) => updateSelectedZone({ borderRadius: parseInt(e.target.value, 10) || 0 })}
                          style={{ width: "55px", accentColor: "#7956C9" }}
                          title={`Radius: ${selectedZone.borderRadius ?? 6}px`}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Common Duplicate / Delete */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => handleDuplicateZone(selectedZone.id)}
                    style={{ background: "none", border: "none", color: "#A099B5", cursor: "pointer" }}
                    title="Duplicate Zone"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteZone(selectedZone.id)}
                    style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}
                    title="Delete Zone"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ color: "#8A849C", fontSize: "11.5px" }}>
                  Select any photo, text, or shape zone on the canvas to customize its options.
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenCropper(backgroundUrl, "background", undefined, "Background Artwork")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 9px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(59, 130, 246, 0.18)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    color: "#93C5FD",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  title="Crop template background artwork directly in-place without changing tabs"
                >
                  <Crop size={12} />
                  <span>✂️ Crop Background Artwork</span>
                </button>
              </div>
            )}
          </div>

          {/* Canvas Scrollable Workbench Area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "auto",
              position: "relative",
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              padding: "90px",
            }}
          >
            {/* The Actual Poster Canvas Container */}
            <div
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              style={{
                width: `${canvasDimensions.width}px`,
                height: `${canvasDimensions.height}px`,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
                position: "relative",
                borderRadius: "0px",
                overflow: clipContent ? "hidden" : "visible",
                outline: clipContent ? "none" : "2px dashed rgba(168, 85, 247, 0.45)",
                outlineOffset: "0px",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255,255,255,0.1)",
                backgroundColor: "#0F172A",
                background: `url(${backgroundUrl}) center center / 100% 100% no-repeat`,
                cursor: activeTool !== "select" ? "crosshair" : "default",
                userSelect: "none",
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Template Edge Corner Crop Marks (Shows boundary when bleed/pop-out is active) */}
              {!clipContent && (
                <>
                  <div style={{ position: "absolute", top: -8, left: -8, width: 16, height: 16, borderTop: "2.5px solid #A855F7", borderLeft: "2.5px solid #A855F7", pointerEvents: "none", zIndex: 35 }} />
                  <div style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderTop: "2.5px solid #A855F7", borderRight: "2.5px solid #A855F7", pointerEvents: "none", zIndex: 35 }} />
                  <div style={{ position: "absolute", bottom: -8, left: -8, width: 16, height: 16, borderBottom: "2.5px solid #A855F7", borderLeft: "2.5px solid #A855F7", pointerEvents: "none", zIndex: 35 }} />
                  <div style={{ position: "absolute", bottom: -8, right: -8, width: 16, height: 16, borderBottom: "2.5px solid #A855F7", borderRight: "2.5px solid #A855F7", pointerEvents: "none", zIndex: 35 }} />
                </>
              )}
              {/* Magnetic Snap Guideline: Vertical Center */}
              {activeSnapGuides.x !== null && (
                <div
                  style={{
                    position: "absolute",
                    left: `${activeSnapGuides.x}%`,
                    top: 0,
                    bottom: 0,
                    width: "1.5px",
                    backgroundColor: "#EC4899",
                    boxShadow: "0 0 6px #EC4899",
                    zIndex: 99,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Magnetic Snap Guideline: Horizontal Center */}
              {activeSnapGuides.y !== null && (
                <div
                  style={{
                    position: "absolute",
                    top: `${activeSnapGuides.y}%`,
                    left: 0,
                    right: 0,
                    height: "1.5px",
                    backgroundColor: "#EC4899",
                    boxShadow: "0 0 6px #EC4899",
                    zIndex: 99,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Safe Zone Overlay (WhatsApp / Instagram Stories Safe Guides) */}
              {showSafeZones && (
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 90 }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "15%",
                      left: 0,
                      right: 0,
                      borderTop: "1px dashed rgba(245, 158, 11, 0.7)",
                      padding: "2px 6px",
                      fontSize: "9px",
                      color: "#F59E0B",
                    }}
                  >
                    Top Safe Margin (Status / Stories)
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "15%",
                      left: 0,
                      right: 0,
                      borderBottom: "1px dashed rgba(245, 158, 11, 0.7)",
                      padding: "2px 6px",
                      fontSize: "9px",
                      color: "#F59E0B",
                      textAlign: "right",
                    }}
                  >
                    Bottom Reply Safe Margin
                  </div>
                </div>
              )}

              {/* Render Slot Zones */}
              {zones
                .filter((z) => z.visible !== false)
                .map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const isMovingThis = dragState?.type === "move" && dragState?.zoneId === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onMouseDown={(e) => handleZoneMouseDown(e, zone)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (zone.type === "photo") {
                          handleOpenCropper(
                            zone.sampleAvatarUrl || previewPersona.avatarUrl,
                            "zone",
                            zone.id,
                            zone.label || "Photo Slot"
                          );
                        }
                      }}
                      title={zone.type === "photo" ? "Double-click to crop this image directly" : undefined}
                      style={{
                        position: "absolute",
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        zIndex: isSelected ? 50 : zone.zIndex || 4,
                        cursor: zone.locked ? "default" : isMovingThis ? "grabbing" : "grab",
                        outline: isSelected ? "2px solid #7956C9" : "none",
                        outlineOffset: "2px",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Photo Zone Content */}
                      {zone.type === "photo" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            borderRadius:
                              zone.photoShape === "circle"
                                ? "999px"
                                : zone.photoShape === "squircle"
                                  ? "24%"
                                  : "0",
                            overflow: "hidden",
                            border:
                              zone.photoShape !== "cutout" && zone.borderWidth
                                ? `${zone.borderWidth}px solid ${zone.borderColor || "#FFFFFF"}`
                                : "none",
                            boxShadow: zone.shadow ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
                            maskImage:
                              zone.featherBottom && zone.photoShape === "cutout"
                                ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                                : undefined,
                            WebkitMaskImage:
                              zone.featherBottom && zone.photoShape === "cutout"
                                ? "linear-gradient(to bottom, black 70%, transparent 100%)"
                                : undefined,
                          }}
                        >
                          <img
                            src={zone.sampleAvatarUrl || previewPersona.avatarUrl}
                            alt="User Silhouette"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: zone.objectFit || (zone.photoShape === "cutout" ? "contain" : "cover"),
                            }}
                          />
                        </div>
                      )}

                      {/* Text Zone Content */}
                      {zone.type === "text" && (
                        <CurvedTextRenderer
                          zone={zone}
                          displayText={
                            zone.textBinding === "name"
                              ? previewPersona.name
                              : zone.textBinding === "designation"
                                ? previewPersona.designation
                                : zone.textBinding === "phone"
                                  ? previewPersona.phone
                                  : zone.textBinding === "business"
                                    ? previewPersona.businessName
                                    : zone.customText || "Sample Text"
                          }
                          isSelected={isSelected}
                        />
                      )}

                      {/* Shape Zone Content */}
                      {zone.type === "shape" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor:
                              zone.backgroundColor !== undefined ? zone.backgroundColor : "rgba(15, 23, 42, 0.75)",
                            borderRadius:
                              zone.shapeType === "circle"
                                ? "50%"
                                : zone.shapeType === "pill"
                                  ? "999px"
                                  : `${zone.borderRadius ?? 6}px`,
                            border: zone.borderWidth
                              ? `${zone.borderWidth}px solid ${zone.borderColor || "#FFFFFF"}`
                              : "none",
                            boxShadow: zone.shadow ? "0 4px 14px rgba(0,0,0,0.35)" : "none",
                            opacity: zone.opacity ?? 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                            overflow: "hidden",
                          }}
                        >
                          {zone.iconType === "lotus" && (
                            <span style={{ fontSize: "20px" }}>🪷</span>
                          )}
                          {zone.iconType === "flag" && (
                            <span style={{ fontSize: "16px" }}>🇮🇳</span>
                          )}
                          {zone.iconType === "diya" && (
                            <span style={{ fontSize: "20px" }}>🪔</span>
                          )}
                          {zone.iconType === "qr" && (
                            <QrCode size={24} color="#7956C9" />
                          )}
                        </div>
                      )}

                      {/* 8-Point Resize Handles (Rendered when selected) */}
                      {isSelected && !zone.locked && (
                        <>
                          {(["nw", "n", "ne", "w", "e", "sw", "s", "se"] as const).map((h) => {
                            const handleStyles: Record<string, React.CSSProperties> = {
                              nw: { top: "-4px", left: "-4px", cursor: "nwse-resize" },
                              n: { top: "-4px", left: "calc(50% - 4px)", cursor: "ns-resize" },
                              ne: { top: "-4px", right: "-4px", cursor: "nesw-resize" },
                              w: { top: "calc(50% - 4px)", left: "-4px", cursor: "ew-resize" },
                              e: { top: "calc(50% - 4px)", right: "-4px", cursor: "ew-resize" },
                              sw: { bottom: "-4px", left: "-4px", cursor: "nesw-resize" },
                              s: { bottom: "-4px", left: "calc(50% - 4px)", cursor: "ns-resize" },
                              se: { bottom: "-4px", right: "-4px", cursor: "nwse-resize" },
                            };

                            return (
                              <div
                                key={h}
                                onMouseDown={(e) => handleResizeHandleMouseDown(e, zone, h)}
                                style={{
                                  position: "absolute",
                                  width: "9px",
                                  height: "9px",
                                  backgroundColor: "#FFFFFF",
                                  border: "2px solid #7956C9",
                                  borderRadius: "2px",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                  zIndex: 60,
                                  boxSizing: "border-box",
                                  ...handleStyles[h],
                                }}
                              />
                            );
                          })}
                        </>
                      )}
                    </div>
                  );
                })}

              {/* Active Draw Box Preview */}
              {isDrawing && currentBox && (
                <div
                  style={{
                    position: "absolute",
                    left: `${currentBox.x}%`,
                    top: `${currentBox.y}%`,
                    width: `${currentBox.w}%`,
                    height: `${currentBox.h}%`,
                    border: "2px dashed #7956C9",
                    backgroundColor: "rgba(121, 86, 201, 0.2)",
                    zIndex: 90,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </div>

          {/* Floating Bottom Viewport Toolbar (Zoom, Fit, Safe Zones, Snapping) */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(29, 25, 46, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "999px",
              padding: "4px 14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              zIndex: 30,
              fontSize: "11px",
              color: "#E2E8F0",
            }}
          >
            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", padding: "2px" }}
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontWeight: 700, minWidth: "36px", textAlign: "center" }}>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", padding: "2px" }}
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  color: "#D8B4FE",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>

            <div style={{ height: "14px", width: "1px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            {/* Snap Toggle */}
            <button
              type="button"
              onClick={() => setSnapEnabled(!snapEnabled)}
              style={{
                background: "none",
                border: "none",
                color: snapEnabled ? "#34D399" : "#64748B",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="Toggle Magnetic Snap Guides"
            >
              <Grid size={13} />
              <span>Snap: {snapEnabled ? "ON" : "OFF"}</span>
            </button>

            {/* Safe Zone Toggle */}
            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              style={{
                background: "none",
                border: "none",
                color: showSafeZones ? "#F59E0B" : "#64748B",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="Toggle WhatsApp / Story Safe Margins"
            >
              <Shield size={13} />
              <span>Safe Guides</span>
            </button>

            {/* Bleed / Out of Template Overflow Toggle */}
            <button
              type="button"
              onClick={() => {
                const nextState = !clipContent;
                setClipContent(nextState);
                setToastNotification(
                  nextState
                    ? "✂️ Clip to Frame: ON (Cropped view)"
                    : "✨ Bleed & Out of Template: ON (Elements can freely extend outside the template!)"
                );
              }}
              style={{
                background: "none",
                border: "none",
                color: !clipContent ? "#A855F7" : "#64748B",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="Toggle whether elements can visibly extend outside template borders (Pop-out & Bleed)"
            >
              <Crop size={13} />
              <span>{clipContent ? "Clip: ON" : "Bleed/Out: ON"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT DRAWER: Inspector & Live Flutter Mobile Simulator */}
        <div
          style={{
            width: "310px",
            backgroundColor: "#1D192E",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Segmented Top Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "6px 10px",
              gap: "6px",
            }}
          >
            <button
              type="button"
              onClick={() => setRightTab("inspector")}
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: rightTab === "inspector" ? "rgba(121, 86, 201, 0.3)" : "transparent",
                color: rightTab === "inspector" ? "#D8B4FE" : "#8A849C",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <Sliders size={13} />
              <span>Inspector</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTab("simulator")}
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: rightTab === "simulator" ? "rgba(121, 86, 201, 0.3)" : "transparent",
                color: rightTab === "simulator" ? "#D8B4FE" : "#8A849C",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <Smartphone size={13} />
              <span>📱 Mobile Preview</span>
            </button>
          </div>

          {/* Inspector Tab Content */}
          {rightTab === "inspector" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {selectedZone ? (
                <>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase" }}>
                      Zone Label
                    </label>
                    <input
                      type="text"
                      value={selectedZone.label || ""}
                      onChange={(e) => updateSelectedZone({ label: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    />
                  </div>

                  {/* Coordinates Grid */}
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase" }}>
                      Position & Size (%)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                      <div>
                        <span style={{ fontSize: "10px", color: "#8A849C" }}>X (Left):</span>
                        <input
                          type="number"
                          value={selectedZone.x}
                          onChange={(e) => updateSelectedZone({ x: parseFloat(e.target.value) || 0 })}
                          style={{
                            width: "100%",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#FFFFFF",
                            fontSize: "11px",
                          }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: "10px", color: "#8A849C" }}>Y (Top):</span>
                        <input
                          type="number"
                          value={selectedZone.y}
                          onChange={(e) => updateSelectedZone({ y: parseFloat(e.target.value) || 0 })}
                          style={{
                            width: "100%",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#FFFFFF",
                            fontSize: "11px",
                          }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: "10px", color: "#8A849C" }}>Width:</span>
                        <input
                          type="number"
                          value={selectedZone.width}
                          onChange={(e) => updateSelectedZone({ width: parseFloat(e.target.value) || 0 })}
                          style={{
                            width: "100%",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#FFFFFF",
                            fontSize: "11px",
                          }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: "10px", color: "#8A849C" }}>Height:</span>
                        <input
                          type="number"
                          value={selectedZone.height}
                          onChange={(e) => updateSelectedZone({ height: parseFloat(e.target.value) || 0 })}
                          style={{
                            width: "100%",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#FFFFFF",
                            fontSize: "11px",
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: "1 / -1", fontSize: "10px", color: "#C4B5FD", marginTop: "2px" }}>
                        ✨ Out-of-template &amp; Bleed enabled (negative &amp; &gt;100% values supported)
                      </div>
                    </div>
                  </div>

                  {/* Text Binding (if Text zone) */}
                  {selectedZone.type === "text" && (
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase" }}>
                        Data Dynamic Binding
                      </label>
                      <select
                        value={selectedZone.textBinding || "custom"}
                        onChange={(e) => updateSelectedZone({ textBinding: e.target.value as TextSlotBinding })}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#FFFFFF",
                          fontSize: "11.5px",
                          marginTop: "4px",
                        }}
                      >
                        <option value="name" style={{ background: "#201B33" }}>User Full Name</option>
                        <option value="designation" style={{ background: "#201B33" }}>Designation / Title</option>
                        <option value="phone" style={{ background: "#201B33" }}>Phone Number</option>
                        <option value="business" style={{ background: "#201B33" }}>Business / Organization</option>
                        <option value="custom" style={{ background: "#201B33" }}>Custom Slogan / Static Text</option>
                      </select>

                      {selectedZone.textBinding === "custom" && (
                        <div style={{ marginTop: "8px" }}>
                          <span style={{ fontSize: "10px", color: "#8A849C" }}>Custom Text Content:</span>
                          <textarea
                            rows={2}
                            value={selectedZone.customText || ""}
                            onChange={(e) => updateSelectedZone({ customText: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#FFFFFF",
                              fontSize: "11.5px",
                              marginTop: "2px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Auto-Fit & Multi-Line Switches */}
                  {selectedZone.type === "text" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", cursor: "pointer" }}>
                        <span>Auto-Scale Font to Fit Box</span>
                        <input
                          type="checkbox"
                          checked={selectedZone.autoFitText ?? true}
                          onChange={(e) => updateSelectedZone({ autoFitText: e.target.checked })}
                        />
                      </label>
                      <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", cursor: "pointer" }}>
                        <span>Multi-Line Text Wrapping</span>
                        <input
                          type="checkbox"
                          checked={selectedZone.wrapText ?? true}
                          onChange={(e) => updateSelectedZone({ wrapText: e.target.checked })}
                        />
                      </label>
                    </div>
                  )}

                  {/* Photo Slot & Source Configuration (if Photo zone) */}
                  {selectedZone.type === "photo" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px" }}>
                      {/* Person Photo Source Card */}
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(121, 86, 201, 0.12)",
                          border: "1px solid rgba(121, 86, 201, 0.3)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#FACC15", display: "flex", alignItems: "center", gap: "5px" }}>
                            <Camera size={13} />
                            <span>PERSON PHOTO / CUTOUT</span>
                          </span>
                          <span
                            style={{
                              fontSize: "9.5px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: selectedZone.sampleAvatarUrl ? "rgba(16, 185, 129, 0.2)" : "rgba(121, 86, 201, 0.2)",
                              color: selectedZone.sampleAvatarUrl ? "#34D399" : "#C4B5FD",
                              fontWeight: 700,
                            }}
                          >
                            {selectedZone.sampleAvatarUrl ? "Custom Loaded" : "Default Persona"}
                          </span>
                        </div>

                        {/* Thumbnail + info */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: selectedZone.photoShape === "circle" ? "50%" : "6px",
                              overflow: "hidden",
                              border: "1.5px solid rgba(255, 255, 255, 0.2)",
                              backgroundColor: "#161324",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={selectedZone.sampleAvatarUrl || previewPersona.avatarUrl}
                              alt="Person Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: selectedZone.photoShape === "cutout" ? "contain" : (selectedZone.objectFit || "cover"),
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {selectedZone.label || "Person Photo Slot"}
                            </div>
                            <div style={{ fontSize: "10px", color: "#A099B5", marginTop: "2px" }}>
                              PNG Cutout, JPG or WebP
                            </div>
                          </div>
                        </div>

                        {/* Upload button, Crop button & Reset button */}
                        <div style={{ display: "flex", gap: "6px" }}>
                          <label
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "5px",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              backgroundColor: "#7956C9",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                          >
                            <Upload size={13} />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUploadPersonPhoto}
                              style={{ display: "none" }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenCropper(
                                selectedZone.sampleAvatarUrl || previewPersona.avatarUrl,
                                "zone",
                                selectedZone.id,
                                selectedZone.label || "Photo Slot"
                              )
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              backgroundColor: "#3B82F6",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: "none",
                            }}
                            title="Crop this photo directly in-place without changing tabs"
                          >
                            <Crop size={13} />
                            <span>Crop</span>
                          </button>
                          {selectedZone.sampleAvatarUrl && (
                            <button
                              type="button"
                              onClick={() => updateSelectedZone({ sampleAvatarUrl: undefined })}
                              style={{
                                padding: "6px 8px",
                                borderRadius: "6px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                color: "#C4BFD6",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                              title="Reset to default persona avatar"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Direct URL input */}
                        <div>
                          <span style={{ fontSize: "10px", color: "#8A849C" }}>Or Image / Cutout URL:</span>
                          <input
                            type="text"
                            value={selectedZone.sampleAvatarUrl || ""}
                            placeholder="https://... image link"
                            onChange={(e) => updateSelectedZone({ sampleAvatarUrl: e.target.value.trim() || undefined })}
                            style={{
                              width: "100%",
                              padding: "5px 8px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              border: "1px solid rgba(255,255,255,0.12)",
                              color: "#FFFFFF",
                              fontSize: "10.5px",
                              marginTop: "3px",
                            }}
                          />
                        </div>

                        {/* Quick Leaders Selection */}
                        <div>
                          <span style={{ fontSize: "10px", color: "#8A849C" }}>Choose Popular Leader:</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                            {LEADER_PHOTO_PRESETS.map((lp) => (
                              <button
                                key={lp.id}
                                type="button"
                                onClick={() => handleApplyLeaderPreset(lp)}
                                style={{
                                  padding: "3px 7px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                                  border: "1px solid rgba(255, 255, 255, 0.12)",
                                  color: "#FFFFFF",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                }}
                              >
                                {lp.name.split(" ")[0]} {lp.name.split(" ")[1] || ""}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Photo Shape & Appearance */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase" }}>
                            Photo Frame Shape
                          </label>
                          <select
                            value={selectedZone.photoShape || "circle"}
                            onChange={(e) => updateSelectedZone({ photoShape: e.target.value as PhotoSlotShape })}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#FFFFFF",
                              fontSize: "11.5px",
                              marginTop: "4px",
                            }}
                          >
                            <option value="cutout" style={{ background: "#201B33" }}>Cutout Silhouette (Transparent)</option>
                            <option value="circle" style={{ background: "#201B33" }}>Circle Avatar (Round)</option>
                            <option value="squircle" style={{ background: "#201B33" }}>Squircle (Smooth Rounded)</option>
                            <option value="rectangle" style={{ background: "#201B33" }}>Rectangle (Full Slot)</option>
                          </select>
                        </div>

                        {/* Fit Mode */}
                        <div>
                          <label style={{ fontSize: "11px", fontWeight: 700, color: "#A099B5", textTransform: "uppercase" }}>
                            Image Fit Mode
                          </label>
                          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                            <button
                              type="button"
                              onClick={() => updateSelectedZone({ objectFit: "contain" })}
                              style={{
                                flex: 1,
                                padding: "5px 8px",
                                borderRadius: "4px",
                                border: (selectedZone.objectFit === "contain" || (!selectedZone.objectFit && selectedZone.photoShape === "cutout"))
                                  ? "1.5px solid #7956C9"
                                  : "1px solid rgba(255,255,255,0.12)",
                                backgroundColor: (selectedZone.objectFit === "contain" || (!selectedZone.objectFit && selectedZone.photoShape === "cutout"))
                                  ? "rgba(121, 86, 201, 0.3)"
                                  : "rgba(0,0,0,0.2)",
                                color: "#FFFFFF",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Contain (Full Body)
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSelectedZone({ objectFit: "cover" })}
                              style={{
                                flex: 1,
                                padding: "5px 8px",
                                borderRadius: "4px",
                                border: (selectedZone.objectFit === "cover" || (!selectedZone.objectFit && selectedZone.photoShape !== "cutout"))
                                  ? "1.5px solid #7956C9"
                                  : "1px solid rgba(255,255,255,0.12)",
                                backgroundColor: (selectedZone.objectFit === "cover" || (!selectedZone.objectFit && selectedZone.photoShape !== "cutout"))
                                  ? "rgba(121, 86, 201, 0.3)"
                                  : "rgba(0,0,0,0.2)",
                                color: "#FFFFFF",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Cover (Fill Frame)
                            </button>
                          </div>
                        </div>

                        {/* Soft Feather Bottom */}
                        {selectedZone.photoShape === "cutout" && (
                          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", cursor: "pointer", padding: "6px 0" }}>
                            <span>Soft Feather Bottom (Gradient Blend)</span>
                            <input
                              type="checkbox"
                              checked={Boolean(selectedZone.featherBottom)}
                              onChange={(e) => updateSelectedZone({ featherBottom: e.target.checked })}
                            />
                          </label>
                        )}

                        {/* Border Width & Color (for circle, squircle, rect) */}
                        {selectedZone.photoShape !== "cutout" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: "10px", color: "#8A849C" }}>Border Width:</span>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={selectedZone.borderWidth ?? 3}
                                onChange={(e) => updateSelectedZone({ borderWidth: parseInt(e.target.value, 10) || 0 })}
                                style={{
                                  width: "100%",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  backgroundColor: "rgba(0,0,0,0.3)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  color: "#FFFFFF",
                                  fontSize: "11px",
                                  marginTop: "2px",
                                }}
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: "10px", color: "#8A849C" }}>Color:</span>
                              <input
                                type="color"
                                value={selectedZone.borderColor || "#FFFFFF"}
                                onChange={(e) => updateSelectedZone({ borderColor: e.target.value })}
                                style={{
                                  width: "32px",
                                  height: "26px",
                                  borderRadius: "4px",
                                  border: "none",
                                  cursor: "pointer",
                                  marginTop: "2px",
                                  display: "block",
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Drop Shadow toggle */}
                        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", cursor: "pointer", padding: "4px 0" }}>
                          <span>Drop Shadow</span>
                          <input
                            type="checkbox"
                            checked={selectedZone.shadow ?? true}
                            onChange={(e) => updateSelectedZone({ shadow: e.target.checked })}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Shape Zone Configuration (if Shape zone) */}
                  {selectedZone.type === "shape" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px" }}>
                      {/* Shape Appearance Card */}
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(121, 86, 201, 0.12)",
                          border: "1px solid rgba(121, 86, 201, 0.3)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#FACC15", display: "flex", alignItems: "center", gap: "5px" }}>
                            <Square size={13} />
                            <span>SHAPE &amp; BANNER SETTINGS</span>
                          </span>
                          <span style={{ fontSize: "9.5px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(121, 86, 201, 0.2)", color: "#C4B5FD", fontWeight: 700 }}>
                            {selectedZone.shapeType || "rectangle"}
                          </span>
                        </div>

                        {/* Shape Type Selector */}
                        <div>
                          <label style={{ fontSize: "10px", color: "#A099B5", textTransform: "uppercase", fontWeight: 700 }}>
                            Shape Geometry
                          </label>
                          <select
                            value={selectedZone.shapeType || "rectangle"}
                            onChange={(e) => {
                              const st = e.target.value as ShapeSlotType;
                              updateSelectedZone({
                                shapeType: st,
                                borderRadius: st === "circle" ? 999 : st === "pill" ? 999 : st === "card" ? 14 : selectedZone.borderRadius,
                              });
                            }}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(0,0,0,0.3)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#FFFFFF",
                              fontSize: "11.5px",
                              marginTop: "3px",
                            }}
                          >
                            <option value="rectangle" style={{ background: "#201B33" }}>Rectangle Box</option>
                            <option value="card" style={{ background: "#201B33" }}>Rounded Card Container</option>
                            <option value="circle" style={{ background: "#201B33" }}>Circle Badge</option>
                            <option value="pill" style={{ background: "#201B33" }}>Pill / Capsule Tag</option>
                            <option value="banner" style={{ background: "#201B33" }}>Candidate Name Strip</option>
                            <option value="line" style={{ background: "#201B33" }}>Divider Line</option>
                          </select>
                        </div>

                        {/* Fill Color & Opacity */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "10px", color: "#A099B5" }}>Fill Color:</span>
                            <span style={{ fontSize: "10px", color: "#C4BFD6" }}>
                              {selectedZone.backgroundColor || "rgba(15, 23, 42, 0.75)"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input
                              type="color"
                              value={selectedZone.backgroundColor?.startsWith("#") ? selectedZone.backgroundColor : "#FFFFFF"}
                              onChange={(e) => updateSelectedZone({ backgroundColor: e.target.value })}
                              style={{ width: "32px", height: "28px", borderRadius: "4px", border: "none", cursor: "pointer" }}
                            />
                            <input
                              type="text"
                              value={selectedZone.backgroundColor || ""}
                              placeholder="#FFFFFF or rgba(0,0,0,0.5)"
                              onChange={(e) => updateSelectedZone({ backgroundColor: e.target.value })}
                              style={{
                                flex: 1,
                                padding: "5px 8px",
                                borderRadius: "4px",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "#FFFFFF",
                                fontSize: "11px",
                              }}
                            />
                          </div>

                          {/* Quick Swatches */}
                          <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                            {[
                              { label: "White", val: "#FFFFFF" },
                              { label: "Saffron", val: "#FF9933" },
                              { label: "Navy", val: "#1E3A8A" },
                              { label: "Green", val: "#138808" },
                              { label: "Gold", val: "#F59E0B" },
                              { label: "Black Tint", val: "rgba(15, 23, 42, 0.85)" },
                            ].map((sw) => (
                              <button
                                key={sw.label}
                                type="button"
                                onClick={() => updateSelectedZone({ backgroundColor: sw.val })}
                                style={{
                                  flex: 1,
                                  height: "18px",
                                  borderRadius: "3px",
                                  backgroundColor: sw.val.startsWith("#") ? sw.val : "#334155",
                                  border: "1px solid rgba(255,255,255,0.2)",
                                  cursor: "pointer",
                                }}
                                title={sw.label}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Opacity Slider */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#A099B5" }}>
                            <span>Fill Opacity:</span>
                            <span>{Math.round((selectedZone.opacity ?? 1) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="1"
                            step="0.05"
                            value={selectedZone.opacity ?? 1}
                            onChange={(e) => updateSelectedZone({ opacity: parseFloat(e.target.value) })}
                            style={{ width: "100%", accentColor: "#7956C9", marginTop: "3px" }}
                          />
                        </div>
                      </div>

                      {/* Border & Corner Radius */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: "10px", color: "#8A849C" }}>Border Width:</span>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={selectedZone.borderWidth ?? 0}
                              onChange={(e) => updateSelectedZone({ borderWidth: parseInt(e.target.value, 10) || 0 })}
                              style={{
                                width: "100%",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#FFFFFF",
                                fontSize: "11px",
                                marginTop: "2px",
                              }}
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: "10px", color: "#8A849C" }}>Border Color:</span>
                            <input
                              type="color"
                              value={selectedZone.borderColor || "#FFFFFF"}
                              onChange={(e) => updateSelectedZone({ borderColor: e.target.value })}
                              style={{
                                width: "32px",
                                height: "26px",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                                marginTop: "2px",
                                display: "block",
                              }}
                            />
                          </div>
                        </div>

                        {/* Corner Radius Slider (for non-circle/pill) */}
                        {selectedZone.shapeType !== "circle" && selectedZone.shapeType !== "pill" && (
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#A099B5" }}>
                              <span>Corner Radius:</span>
                              <span>{selectedZone.borderRadius ?? 6}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={selectedZone.borderRadius ?? 6}
                              onChange={(e) => updateSelectedZone({ borderRadius: parseInt(e.target.value, 10) || 0 })}
                              style={{ width: "100%", accentColor: "#7956C9", marginTop: "3px" }}
                            />
                          </div>
                        )}

                        {/* Drop Shadow toggle */}
                        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", cursor: "pointer", padding: "4px 0" }}>
                          <span>Drop Shadow</span>
                          <input
                            type="checkbox"
                            checked={selectedZone.shadow ?? true}
                            onChange={(e) => updateSelectedZone({ shadow: e.target.checked })}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "#8A849C" }}>
                  <HelpCircle size={28} style={{ margin: "0 auto 8px auto", opacity: 0.5 }} />
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>No Zone Selected</div>
                  <p style={{ fontSize: "11px", margin: "4px 0 0 0" }}>
                    Click any zone on the canvas to inspect coordinates and adjust dynamic settings.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Simulator Tab Content */}
          {rightTab === "simulator" && (
            <LiveMobileAppSimulator
              backgroundUrl={backgroundUrl}
              zones={zones}
              format={format}
              artworkAspectRatio={artworkAspectRatio}
            />
          )}
        </div>
      </div>

      {/* 3. Toast Notification Pill */}
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#7956C9",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 999,
          }}
        >
          <Sparkles size={14} />
          <span>{toastNotification}</span>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer", marginLeft: "6px" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. Code / AI Spec Import Modal */}
      {showImportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            style={{
              width: "540px",
              backgroundColor: "#201B33",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              color: "#FFFFFF",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700 }}>📋 Paste Code / SVG / AI Spec</span>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{ background: "none", border: "none", color: "#A099B5", cursor: "pointer", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>
            <textarea
              rows={8}
              value={importCodeText}
              onChange={(e) => setImportCodeText(e.target.value)}
              placeholder="Paste raw SVG code, JSON elements snippet, or POSTHUB coordinates here..."
              style={{
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "monospace",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backgroundColor: "transparent",
                  color: "#E2E8F0",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyImportedCode}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Apply Coordinates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Direct In-Place Image Cropper Modal (No tab navigation required) */}
      {cropTarget && (
        <DirectImageCropperModal
          cropTarget={cropTarget}
          onClose={() => setCropTarget(null)}
          onApplyCrop={handleApplyCrop}
        />
      )}
    </div>
  );
};
