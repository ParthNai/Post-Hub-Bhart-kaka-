"use client";

import React, { useState } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";
import type {
  AiPromptPreset,
  AiPresetCategory,
  AiPresetStatus,
} from "@/lib/ai-presets";
import { PresetThumbnail } from "./PresetThumbnail";

interface CreateEditPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (presetData: Partial<AiPromptPreset>) => Promise<boolean>;
  initialPreset?: AiPromptPreset | null;
}

export function CreateEditPresetModal({
  isOpen,
  onClose,
  onSave,
  initialPreset,
}: CreateEditPresetModalProps) {
  if (!isOpen) return null;

  return (
    <PresetFormContent
      key={initialPreset?.id || "create-new"}
      onClose={onClose}
      onSave={onSave}
      initialPreset={initialPreset}
    />
  );
}

interface PresetFormContentProps {
  onClose: () => void;
  onSave: (presetData: Partial<AiPromptPreset>) => Promise<boolean>;
  initialPreset?: AiPromptPreset | null;
}

function PresetFormContent({
  onClose,
  onSave,
  initialPreset,
}: PresetFormContentProps) {
  const isEditing = Boolean(initialPreset);

  const [name, setName] = useState(initialPreset?.name || "");
  const [category, setCategory] = useState<AiPresetCategory>(initialPreset?.category || "Festivals");
  const [description, setDescription] = useState(initialPreset?.description || "");
  const [basePrompt, setBasePrompt] = useState(initialPreset?.basePrompt || "");
  const [designStyle, setDesignStyle] = useState(initialPreset?.designStyle || "");
  const [typographyGuidance, setTypographyGuidance] = useState(initialPreset?.typographyGuidance || "");
  const [colorGuidance, setColorGuidance] = useState(initialPreset?.colorGuidance || "");
  const [defaultAspectRatio, setDefaultAspectRatio] = useState(initialPreset?.defaultAspectRatio || "1:1");
  const [defaultFormat, setDefaultFormat] = useState(initialPreset?.defaultFormat || "PNG, JPG");
  const [status, setStatus] = useState<AiPresetStatus>(initialPreset?.status || "active");
  const [thumbnailType, setThumbnailType] = useState<AiPromptPreset["thumbnailType"]>(
    initialPreset?.thumbnailType || "diwali"
  );
  const [rules, setRules] = useState<string[]>(
    initialPreset?.associatedRules || ["Base Prompt", "Design Style", "Color Scheme"]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleRule = (rule: string) => {
    if (rules.includes(rule)) {
      setRules(rules.filter((r) => r !== rule));
    } else {
      setRules([...rules, rule]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a preset name");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a short description");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const ok = await onSave({
        name: name.trim(),
        category,
        description: description.trim(),
        basePrompt: basePrompt.trim(),
        designStyle: designStyle.trim(),
        typographyGuidance: typographyGuidance.trim(),
        colorGuidance: colorGuidance.trim(),
        defaultAspectRatio,
        defaultFormat,
        status,
        thumbnailType,
        associatedRules: rules,
      });
      if (ok) {
        onClose();
      } else {
        setError("Failed to save preset. Please verify required fields.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving preset";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: AiPresetCategory[] = [
    "Festivals",
    "Business",
    "Education",
    "Offers",
    "Events",
    "Product",
    "Social Media",
    "Healthcare",
    "Real Estate",
  ];

  const thumbnailOptions: Array<{ id: AiPromptPreset["thumbnailType"]; label: string }> = [
    { id: "diwali", label: "Diwali" },
    { id: "business", label: "Business" },
    { id: "education", label: "Education" },
    { id: "sale", label: "Summer Sale" },
    { id: "newyear", label: "New Year" },
    { id: "product", label: "Product" },
    { id: "social", label: "Social Media" },
    { id: "corporate", label: "Corporate" },
    { id: "food", label: "Dining" },
    { id: "health", label: "Healthcare" },
    { id: "realestate", label: "Real Estate" },
    { id: "tech", label: "Technology" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#EAE4EE] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE4EE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8DFF5] flex items-center justify-center text-[#7956C9]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#24213A]">
                {isEditing ? `Edit Preset: ${initialPreset?.name}` : "Create AI Preset"}
              </h3>
              <p className="text-xs text-[#777184]">
                Define prompt composition rules and style templates.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777184] hover:text-[#24213A] rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Preset Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diwali Festival"
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] focus:ring-1 focus:ring-[#7956C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AiPresetCategory)}
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Traditional Diwali poster with warm colors."
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Base Prompt Instructions */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Preset Base Prompt Template
            </label>
            <textarea
              rows={2}
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              placeholder="Detailed instructions for the AI image generation model..."
              className="w-full p-2.5 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9] leading-relaxed resize-none"
            />
          </div>

          {/* Row 2: Design Style & Typography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Design Style Guidance
              </label>
              <input
                type="text"
                value={designStyle}
                onChange={(e) => setDesignStyle(e.target.value)}
                placeholder="e.g. Festive, warm, golden glow"
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Typography Guidance
              </label>
              <input
                type="text"
                value={typographyGuidance}
                onChange={(e) => setTypographyGuidance(e.target.value)}
                placeholder="e.g. Elegant festive serif headings"
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>
          </div>

          {/* Color Guidance */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1">
              Color Palette Guidance
            </label>
            <input
              type="text"
              value={colorGuidance}
              onChange={(e) => setColorGuidance(e.target.value)}
              placeholder="e.g. Deep maroon, festive gold #D4AF37, glowing amber"
              className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
            />
          </div>

          {/* Row 3: Aspect Ratio, Format, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Aspect Ratio
              </label>
              <select
                value={defaultAspectRatio}
                onChange={(e) => setDefaultAspectRatio(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="4:5">4:5 (Social Portrait)</option>
                <option value="9:16">9:16 (Story)</option>
                <option value="3:4">3:4 (Standard Poster)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Format
              </label>
              <input
                type="text"
                value={defaultFormat}
                onChange={(e) => setDefaultFormat(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24213A] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AiPresetStatus)}
                className="w-full px-3 py-2 bg-white border border-[#EAE4EE] rounded-lg text-xs text-[#24213A] focus:outline-none focus:border-[#7956C9]"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Thumbnail Type Selector with mini preview */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
              Poster Graphic Visual
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {thumbnailOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setThumbnailType(opt.id)}
                  className={`p-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    thumbnailType === opt.id
                      ? "border-[#7956C9] ring-2 ring-[#7956C9]/20 bg-[#FAF7F2]"
                      : "border-[#EAE4EE] hover:border-[#7956C9]/40 bg-white"
                  }`}
                >
                  <PresetThumbnail type={opt.id} size="sm" className="w-10 h-10" />
                  <span className="text-[10px] text-[#24213A] font-medium truncate w-full">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Associated Rules Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-[#24213A] mb-1.5">
              Associated Rule Pipeline
            </label>
            <div className="flex flex-wrap gap-2">
              {["Base Prompt", "Design Style", "Typography", "Color Scheme"].map((rule) => {
                const checked = rules.includes(rule);
                return (
                  <button
                    key={rule}
                    type="button"
                    onClick={() => toggleRule(rule)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      checked
                        ? "bg-[#E8DFF5] border-[#7956C9] text-[#7956C9]"
                        : "bg-white border-[#EAE4EE] text-[#777184] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {checked ? "✓ " : "+ "}
                    {rule}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#EAE4EE] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#777184] hover:text-[#24213A] hover:bg-[#FAF7F2] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#7956C9] hover:bg-[#6845B8] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Preset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
