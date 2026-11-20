"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import type { FestivalEvent, EventType, EventCategoryType, ContentStatus, TemplateStatus } from "@/lib/festivals";

interface AddEditEventDrawerProps {
  isOpen: boolean;
  eventToEdit: FestivalEvent | null;
  onClose: () => void;
  onSave: (eventData: Partial<FestivalEvent>) => Promise<void>;
}

export const AddEditEventDrawer: React.FC<AddEditEventDrawerProps> = ({
  isOpen,
  eventToEdit,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(eventToEdit);

  // Form State
  const [name, setName] = useState(eventToEdit?.name || "");
  const [slug, setSlug] = useState(eventToEdit?.slug || "");
  const [shortDescription, setShortDescription] = useState(eventToEdit?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(eventToEdit?.fullDescription || "");
  const [type, setType] = useState<EventType>(eventToEdit?.type || "Festival");
  const [category, setCategory] = useState<EventCategoryType>(eventToEdit?.category || "Religious");
  const [startDate, setStartDate] = useState(eventToEdit?.startDate || "2026-11-08");
  const [endDate, setEndDate] = useState(eventToEdit?.endDate || "2026-11-08");
  const [isAllDay, setIsAllDay] = useState(eventToEdit?.isAllDay ?? true);
  const [isRecurringAnnual, setIsRecurringAnnual] = useState(eventToEdit?.isRecurringAnnual ?? true);
  const [region, setRegion] = useState(eventToEdit?.region || "India");
  const [selectedStates, setSelectedStates] = useState<string[]>(eventToEdit?.states || ["All"]);
  const [language, setLanguage] = useState(eventToEdit?.language || "Gujarati");
  const [contentStatus, setContentStatus] = useState<ContentStatus>(eventToEdit?.contentStatus || "Published");
  const [templateStatus, setTemplateStatus] = useState<TemplateStatus>(eventToEdit?.templateStatus || "Available");
  const [isFeatured, setIsFeatured] = useState(eventToEdit?.isFeatured ?? false);
  const [coverImageUrl, setCoverImageUrl] = useState(
    eventToEdit?.coverImageUrl ||
      "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing || !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Event name is required.");
      return;
    }
    if (!startDate) {
      setErrorMessage("Start date is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || shortDescription.trim(),
        type,
        category,
        startDate,
        endDate,
        isAllDay,
        isRecurringAnnual,
        region,
        states: selectedStates,
        language,
        contentStatus,
        templateStatus,
        isFeatured,
        coverImageUrl,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save event";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    "All", "Gujarat", "Maharashtra", "Rajasthan", "Uttar Pradesh", "Delhi", "Punjab", "Haryana", "Karnataka", "Tamil Nadu", "West Bengal"
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(36, 33, 58, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          height: "100vh",
          backgroundColor: "#FFFFFF",
          boxShadow: "-8px 0 24px rgba(36, 33, 58, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #EAE4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            backgroundColor: "#FFFFFF",
            zIndex: 10,
          }}
        >
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#24213A", margin: 0 }}>
              {isEditing ? "Edit Festival Event" : "Add New Festival Event"}
            </h2>
            <p style={{ fontSize: "12px", color: "#777184", margin: "2px 0 0 0" }}>
              Configure festival dates, regional assignment, translations and poster templates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777184",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* A. Basic Event Information */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7956C9", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              1. Basic Information
            </div>

            {/* Event Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
                Event Name <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Diwali, Holi, Christmas"
                style={{
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
            </div>

            {/* Slug */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#777184" }}>
                Event URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. diwali-2026"
                style={{
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                  backgroundColor: "#FAF7F2",
                }}
              />
            </div>

            {/* Category & Type in 2 columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategoryType)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                  }}
                >
                  <option value="Religious">Religious</option>
                  <option value="National">National</option>
                  <option value="Regional">Regional</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Business">Business</option>
                  <option value="International">International</option>
                  <option value="Special">Special</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as EventType)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    backgroundColor: "#FFFFFF",
                    outline: "none",
                  }}
                >
                  <option value="Festival">Festival</option>
                  <option value="Religious Occasion">Religious Occasion</option>
                  <option value="National Holiday">National Holiday</option>
                  <option value="Cultural Event">Cultural Event</option>
                  <option value="Business Event">Business Event</option>
                  <option value="International Celebration">International Celebration</option>
                  <option value="Special Observance">Special Observance</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary shown on calendar preview cards..."
                rows={2}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Full Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Full Description</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Detailed festival background and history..."
                rows={3}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Cover Image URL */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Cover Image URL</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  height: "38px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  fontSize: "13px",
                  color: "#24213A",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#EAE4EE" }} />

          {/* B. Date & Time Configuration */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7956C9", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              2. Date &amp; Scheduling
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span>All-Day Event</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isRecurringAnnual}
                  onChange={(e) => setIsRecurringAnnual(e.target.checked)}
                  style={{ accentColor: "#7956C9" }}
                />
                <span>Annual Recurring Event</span>
              </label>
            </div>
          </div>

          <div style={{ height: "1px", backgroundColor: "#EAE4EE" }} />

          {/* C. Region & Language */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7956C9", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              3. Region &amp; Localization
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Region / Country</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="India">India</option>
                  <option value="Global">Global</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Primary Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="Gujarati">Gujarati</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            {/* Applicable States (when Region is India) */}
            {region === "India" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Applicable States</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {indianStates.map((st) => {
                    const isChecked = selectedStates.includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          if (st === "All") {
                            setSelectedStates(["All"]);
                          } else {
                            const withoutAll = selectedStates.filter((s) => s !== "All");
                            if (isChecked) {
                              const next = withoutAll.filter((s) => s !== st);
                              setSelectedStates(next.length === 0 ? ["All"] : next);
                            } else {
                              setSelectedStates([...withoutAll, st]);
                            }
                          }
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "14px",
                          fontSize: "11px",
                          fontWeight: isChecked ? 600 : 500,
                          backgroundColor: isChecked ? "#F4EFFC" : "#FFFFFF",
                          color: isChecked ? "#7956C9" : "#777184",
                          border: `1px solid ${isChecked ? "#7956C9" : "#EAE4EE"}`,
                          cursor: "pointer",
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ height: "1px", backgroundColor: "#EAE4EE" }} />

          {/* D. Status & Publishing */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#7956C9", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              4. Visibility &amp; Status
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Content Status</label>
                <select
                  value={contentStatus}
                  onChange={(e) => setContentStatus(e.target.value as ContentStatus)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending Review">Pending Review</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Template Status</label>
                <select
                  value={templateStatus}
                  onChange={(e) => setTemplateStatus(e.target.value as TemplateStatus)}
                  style={{
                    height: "38px",
                    padding: "0 10px",
                    borderRadius: "8px",
                    border: "1px solid #EAE4EE",
                    fontSize: "13px",
                    color: "#24213A",
                    outline: "none",
                  }}
                >
                  <option value="Available">Available</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer", marginTop: "4px" }}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                style={{ accentColor: "#7956C9" }}
              />
              <span>Mark as Featured Festival on App Homepage</span>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                border: "1px solid #FECACA",
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#FFFFFF",
                color: "#777184",
                border: "1px solid #EAE4EE",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "#7956C9",
                color: "#FFFFFF",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(121, 86, 201, 0.25)",
              }}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Festival"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
