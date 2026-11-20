"use client";

import React from "react";
import Image from "next/image";
import { Star, Calendar, Tag, MapPin, Edit3 } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface UpcomingEventPreviewCardProps {
  event: FestivalEvent | null;
  onEditEvent: (event: FestivalEvent) => void;
}

export const UpcomingEventPreviewCard: React.FC<UpcomingEventPreviewCardProps> = ({
  event,
  onEditEvent,
}) => {
  if (!event) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #EAE4EE",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
          color: "#777184",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        Select an event or date to view preview.
      </div>
    );
  }

  // Fallback thumbnails for preview
  const thumbnails =
    event.templateThumbnails && event.templateThumbnails.length > 0
      ? event.templateThumbnails
      : [
          "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=300&q=80",
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=300&q=80",
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=300&q=80",
        ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "20px 22px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Star size={16} color="#7956C9" />
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#24213A",
            margin: 0,
          }}
        >
          Upcoming Event Preview
        </h2>
      </div>

      {/* Hero Banner Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "150px",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#24213A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {event.name === "Diwali" ? (
          // Stylized Happy Diwali decorative banner matching reference photo
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1E1233 0%, #34124E 50%, #581C87 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              color: "#FFFFFF",
            }}
          >
            {/* Diya Graphic */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "24px",
                  borderRadius: "50% 50% 35% 35%",
                  background: "radial-gradient(circle, #FDE047 30%, #F59E0B 80%, #DC2626 100%)",
                  boxShadow: "0 0 16px #FBBF24, 0 0 32px #F59E0B",
                  marginBottom: "-4px",
                }}
              />
              <div
                style={{
                  width: "56px",
                  height: "22px",
                  borderRadius: "4px 4px 28px 28px",
                  background: "linear-gradient(to bottom, #CA8A04, #854D0E)",
                  border: "1px solid #FEF08A",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}
              />
            </div>

            {/* Typography */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#FDE047",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Happy
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.02em",
                  textShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  lineHeight: 1.1,
                }}
              >
                Diwali
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={event.coverImageUrl}
            alt={event.name}
            fill
            unoptimized
            sizes="400px"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Title */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#24213A",
            margin: "0 0 6px 0",
          }}
        >
          {event.name}
        </h3>

        {/* Metadata items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "#777184" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={14} color="#777184" />
            <span>{event.formattedDate}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Tag size={14} color="#777184" />
            <span>{event.category} Festival</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={14} color="#777184" />
            <span>{event.region}</span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "12px",
            color: "#777184",
            margin: "10px 0 0 0",
            lineHeight: 1.4,
          }}
        >
          {event.shortDescription}
        </p>
      </div>

      {/* Associated Template Thumbnails (3 in a row) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
        }}
      >
        {thumbnails.map((thumb, idx) => (
          <div
            key={`thumb-${idx}`}
            style={{
              position: "relative",
              height: "64px",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #EAE4EE",
              backgroundColor: "#FAF7F2",
            }}
          >
            <Image
              src={thumb}
              alt={`Template ${idx + 1}`}
              fill
              unoptimized
              sizes="120px"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* Edit Event Button */}
      <button
        type="button"
        onClick={() => onEditEvent(event)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
          width: "100%",
          padding: "8px 0",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          backgroundColor: "#FFFFFF",
          color: "#7956C9",
          border: "1px solid #7956C9",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <Edit3 size={14} />
        <span>Edit Event</span>
      </button>
    </div>
  );
};
