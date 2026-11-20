"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  RefreshCw,
  Move,
  Sliders,
  Scissors,
} from "lucide-react";

export type AspectRatioType = "free" | "1:1" | "3:4" | "4:5" | "9:16" | "16:9" | "circle";

export interface CropTargetInfo {
  imageUrl: string;
  targetType: "zone" | "background";
  zoneId?: string;
  label?: string;
}

interface DirectImageCropperModalProps {
  cropTarget: CropTargetInfo;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string, targetType: "zone" | "background", zoneId?: string) => void;
}

export const DirectImageCropperModal: React.FC<DirectImageCropperModalProps> = ({
  cropTarget,
  onClose,
  onApplyCrop,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(
    cropTarget.targetType === "background" ? "1:1" : "3:4"
  );
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [tiltAngle, setTiltAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 800, height: 800 });

  const stageRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calculate crop box dimensions based on aspect ratio inside a 420x360 stage
  const getCropBoxDimensions = useCallback(() => {
    const maxW = 380;
    const maxH = 340;

    switch (aspectRatio) {
      case "1:1":
      case "circle":
        return { width: 310, height: 310 };
      case "3:4":
        return { width: 255, height: 340 };
      case "4:5":
        return { width: 272, height: 340 };
      case "9:16":
        return { width: 191, height: 340 };
      case "16:9":
        return { width: 373, height: 210 };
      case "free":
      default:
        return { width: 340, height: 300 };
    }
  }, [aspectRatio]);

  const cropBox = getCropBoxDimensions();

  // Load natural dimensions of the source image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth || 800, height: img.naturalHeight || 800 });
      setImageLoaded(true);
    };
    img.onerror = () => {
      // If direct load fails (CORS), try via our server-side image proxy
      if (!cropTarget.imageUrl.startsWith("data:") && !cropTarget.imageUrl.startsWith("/api/admin/proxy-image")) {
        const proxyImg = new Image();
        proxyImg.onload = () => {
          setNaturalSize({ width: proxyImg.naturalWidth || 800, height: proxyImg.naturalHeight || 800 });
          setImageLoaded(true);
        };
        proxyImg.src = `/api/admin/proxy-image?url=${encodeURIComponent(cropTarget.imageUrl)}`;
      }
    };
    img.src = cropTarget.imageUrl;
  }, [cropTarget.imageUrl]);

  // Handle Drag to Pan Image
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - panX,
      y: e.clientY - panY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPanX(e.clientX - dragStartRef.current.x);
      setPanY(e.clientY - dragStartRef.current.y);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [panX, panY]);

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3, Math.max(0.7, prev + delta)));
  };

  // Reset to original view
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setTiltAngle(0);
    setFlipH(false);
    setFlipV(false);
  };

  // Quick preset: Headshot zoom
  const handleHeadshotPreset = () => {
    setZoom(1.45);
    setPanX(0);
    setPanY(15);
  };

  // Execute Canvas Crop & Export
  const handleExecuteCrop = async () => {
    setIsExporting(true);

    try {
      // 1. Output resolution based on aspect ratio
      let outWidth = 1000;
      let outHeight = 1000;
      if (aspectRatio === "1:1" || aspectRatio === "circle") {
        outWidth = 1000;
        outHeight = 1000;
      } else if (aspectRatio === "3:4") {
        outWidth = 900;
        outHeight = 1200;
      } else if (aspectRatio === "4:5") {
        outWidth = 960;
        outHeight = 1200;
      } else if (aspectRatio === "9:16") {
        outWidth = 1080;
        outHeight = 1920;
      } else if (aspectRatio === "16:9") {
        outWidth = 1920;
        outHeight = 1080;
      } else {
        outWidth = Math.round(cropBox.width * 3);
        outHeight = Math.round(cropBox.height * 3);
      }

      // 2. Load image element
      const loadImg = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = url;
        });
      };

      let sourceImg: HTMLImageElement;
      try {
        sourceImg = await loadImg(cropTarget.imageUrl);
      } catch {
        // Fallback to proxy
        sourceImg = await loadImg(`/api/admin/proxy-image?url=${encodeURIComponent(cropTarget.imageUrl)}`);
      }

      // 3. Setup canvas
      const canvas = document.createElement("canvas");
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // If circular, clip with circle path
      if (aspectRatio === "circle") {
        ctx.beginPath();
        ctx.arc(outWidth / 2, outHeight / 2, Math.min(outWidth, outHeight) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      // Center canvas
      ctx.translate(outWidth / 2, outHeight / 2);

      // Rotation & tilt
      const totalRads = ((rotation + tiltAngle) * Math.PI) / 180;
      ctx.rotate(totalRads);

      // Flip
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Scaling relative to preview crop box
      const scaleMultiplier = outWidth / cropBox.width;
      const totalZoom = zoom * scaleMultiplier;

      const baseFitScale = Math.max(
        cropBox.width / sourceImg.naturalWidth,
        cropBox.height / sourceImg.naturalHeight
      );

      const drawW = sourceImg.naturalWidth * baseFitScale * totalZoom;
      const drawH = sourceImg.naturalHeight * baseFitScale * totalZoom;

      const scaledPanX = panX * scaleMultiplier;
      const scaledPanY = panY * scaleMultiplier;

      ctx.drawImage(
        sourceImg,
        -drawW / 2 + (flipH ? -scaledPanX : scaledPanX),
        -drawH / 2 + (flipV ? -scaledPanY : scaledPanY),
        drawW,
        drawH
      );

      // 4. Export as clean PNG Data URL
      const croppedDataUrl = canvas.toDataURL("image/png", 0.95);
      onApplyCrop(croppedDataUrl, cropTarget.targetType, cropTarget.zoneId);
    } catch (err: any) {
      console.error("Failed to crop image:", err);
      alert("Could not process image crop. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Compute preview image CSS sizing
  const baseScale = Math.max(
    cropBox.width / (naturalSize.width || 800),
    cropBox.height / (naturalSize.height || 800)
  );
  const previewW = (naturalSize.width || 800) * baseScale * zoom;
  const previewH = (naturalSize.height || 800) * baseScale * zoom;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(8, 6, 15, 0.82)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 120,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "740px",
          maxWidth: "96vw",
          maxHeight: "92vh",
          backgroundColor: "#1C182B",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(121, 86, 201, 0.3)",
          color: "#FFFFFF",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            height: "50px",
            padding: "0 18px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#221D35",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                color: "#60A5FA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Scissors size={15} />
            </div>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>
                Crop Image Directly
              </span>
              <span style={{ fontSize: "11px", color: "#93C5FD", marginLeft: "8px", fontWeight: 600 }}>
                {cropTarget.label || (cropTarget.targetType === "background" ? "Background Artwork" : "Photo Slot")}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "10.5px",
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#34D399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: 600,
              }}
            >
              Direct Workbench (No Tab Switch)
            </span>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Close Cropper"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Aspect Ratio Presets Bar */}
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "#161324",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "11px", color: "#A099B5", fontWeight: 600, flexShrink: 0 }}>
            Aspect Ratio:
          </span>

          {[
            { id: "3:4", label: "3:4 Portrait (Leader)", icon: "👤" },
            { id: "1:1", label: "1:1 Square (Avatar)", icon: "⏹️" },
            { id: "circle", label: "Circle Avatar", icon: "⚪" },
            { id: "4:5", label: "4:5 Post", icon: "📱" },
            { id: "9:16", label: "9:16 Story / Reel", icon: "📲" },
            { id: "16:9", label: "16:9 Banner", icon: "🖥️" },
            { id: "free", label: "Freeform", icon: "📐" },
          ].map((preset) => {
            const isSelected = aspectRatio === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAspectRatio(preset.id as AspectRatioType)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: isSelected ? "1px solid #7956C9" : "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: isSelected ? "rgba(121, 86, 201, 0.35)" : "rgba(255, 255, 255, 0.04)",
                  color: isSelected ? "#F5F3FF" : "#CBD5E1",
                  fontSize: "11px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={handleHeadshotPreset}
              style={{
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(250, 204, 21, 0.3)",
                backgroundColor: "rgba(250, 204, 21, 0.1)",
                color: "#FDE047",
                fontSize: "10.5px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              title="Quick Headshot zoom: zooms 145% centered on face"
            >
              ✨ Face Focus
            </button>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10.5px",
                color: "#94A3B8",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                style={{ accentColor: "#7956C9" }}
              />
              <span>Grid</span>
            </label>
          </div>
        </div>

        {/* Center Interactive Cropper Stage */}
        <div
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          style={{
            flex: 1,
            minHeight: "360px",
            backgroundColor: "#0D0A17",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            cursor: "grab",
            userSelect: "none",
          }}
          title="Click and drag to pan image • Scroll mouse wheel to zoom"
        >
          {/* Subtle Grid dots */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }}
          />

          {/* The Transformed Image Viewport */}
          <div
            style={{
              position: "absolute",
              width: `${previewW}px`,
              height: `${previewH}px`,
              left: `calc(50% - ${previewW / 2}px + ${panX}px)`,
              top: `calc(50% - ${previewH / 2}px + ${panY}px)`,
              transform: `rotate(${rotation + tiltAngle}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
              transformOrigin: "center center",
              transition: isDraggingRef.current ? "none" : "transform 0.1s ease-out",
              pointerEvents: "none",
            }}
          >
            <img
              src={cropTarget.imageUrl}
              alt="Crop target"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* The Dark Mask + Crop Window Box */}
          <div
            style={{
              position: "relative",
              width: `${cropBox.width}px`,
              height: `${cropBox.height}px`,
              borderRadius: aspectRatio === "circle" ? "50%" : "4px",
              boxShadow: "0 0 0 9999px rgba(8, 6, 16, 0.72)",
              border: "2px solid #FFFFFF",
              outline: "1px solid rgba(121, 86, 201, 0.8)",
              pointerEvents: "none",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* Rule-of-Thirds Grid */}
            {showGrid && (
              <>
                <div style={{ position: "absolute", left: "33.33%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255, 255, 255, 0.25)" }} />
                <div style={{ position: "absolute", left: "66.66%", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255, 255, 255, 0.25)" }} />
                <div style={{ position: "absolute", top: "33.33%", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.25)" }} />
                <div style={{ position: "absolute", top: "66.66%", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.25)" }} />
              </>
            )}

            {/* Corner accents */}
            {aspectRatio !== "circle" && (
              <>
                <div style={{ position: "absolute", top: -2, left: -2, width: 14, height: 14, borderTop: "3px solid #7956C9", borderLeft: "3px solid #7956C9" }} />
                <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderTop: "3px solid #7956C9", borderRight: "3px solid #7956C9" }} />
                <div style={{ position: "absolute", bottom: -2, left: -2, width: 14, height: 14, borderBottom: "3px solid #7956C9", borderLeft: "3px solid #7956C9" }} />
                <div style={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderBottom: "3px solid #7956C9", borderRight: "3px solid #7956C9" }} />
              </>
            )}

            {/* Dimension Indicator Pill */}
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                color: "#E2E8F0",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {aspectRatio === "circle" ? "Circle Avatar" : `${cropBox.width} × ${cropBox.height}`}
            </div>
          </div>

          {/* Quick Helper Floating Tooltip */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(22, 19, 36, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "10.5px",
              color: "#C4BFD6",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              pointerEvents: "none",
            }}
          >
            <Move size={12} color="#D8B4FE" />
            <span>Drag image to reposition • Scroll to zoom</span>
          </div>
        </div>

        {/* Bottom Editing Toolbars */}
        <div
          style={{
            padding: "12px 18px",
            backgroundColor: "#201B33",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {/* Sliders and Quick Transforms Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
            {/* Zoom Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#A099B5", fontWeight: 600 }}>Zoom:</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF", width: 22, height: 22, borderRadius: 4, cursor: "pointer" }}
                title="Zoom Out"
              >
                -
              </button>
              <input
                type="range"
                min="0.7"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ width: "110px", accentColor: "#7956C9" }}
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#FFF", width: 22, height: 22, borderRadius: 4, cursor: "pointer" }}
                title="Zoom In"
              >
                +
              </button>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#D8B4FE", width: "36px" }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation & Flip Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* Rotate CCW 90 */}
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#E2E8F0",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw size={13} />
                <span>-90°</span>
              </button>

              {/* Rotate CW 90 */}
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#E2E8F0",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="Rotate 90° Clockwise"
              >
                <RotateCw size={13} />
                <span>+90°</span>
              </button>

              {/* Flip Horizontal */}
              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                style={{
                  background: flipH ? "rgba(121, 86, 201, 0.4)" : "rgba(255,255,255,0.08)",
                  border: flipH ? "1px solid #7956C9" : "1px solid rgba(255,255,255,0.12)",
                  color: flipH ? "#D8B4FE" : "#E2E8F0",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="Flip Horizontal (Mirror image horizontally)"
              >
                <FlipHorizontal size={13} />
                <span>Flip H</span>
              </button>

              {/* Flip Vertical */}
              <button
                type="button"
                onClick={() => setFlipV((f) => !f)}
                style={{
                  background: flipV ? "rgba(121, 86, 201, 0.4)" : "rgba(255,255,255,0.08)",
                  border: flipV ? "1px solid #7956C9" : "1px solid rgba(255,255,255,0.12)",
                  color: flipV ? "#D8B4FE" : "#E2E8F0",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                title="Flip Vertical"
              >
                <FlipVertical size={13} />
                <span>Flip V</span>
              </button>

              {/* Center Pan Button */}
              <button
                type="button"
                onClick={() => {
                  setPanX(0);
                  setPanY(0);
                }}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#C4BFD6",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
                title="Reset Pan position to center"
              >
                🎯 Center
              </button>
            </div>
          </div>

          {/* Action Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                color: "#94A3B8",
                fontSize: "11.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              title="Reset all crop adjustments"
            >
              <RefreshCw size={13} />
              <span>Reset Adjustments</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isExporting}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  backgroundColor: "transparent",
                  color: "#CBD5E1",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteCrop}
                disabled={isExporting}
                style={{
                  padding: "7px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#3B82F6",
                  backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: isExporting ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                  transition: "opacity 0.15s ease",
                  opacity: isExporting ? 0.7 : 1,
                }}
              >
                <Check size={14} />
                <span>{isExporting ? "Applying Crop..." : "✓ Apply Crop Directly"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DirectImageCropperModal;
