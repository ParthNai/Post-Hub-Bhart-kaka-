"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { FestivalEvent } from "@/lib/festivals";

interface FestivalCalendarViewProps {
  events: FestivalEvent[];
  selectedDate: string;
  selectedEventId: string;
  onSelectDate: (date: string) => void;
  onSelectEvent: (eventId: string) => void;
}

export const FestivalCalendarView: React.FC<FestivalCalendarViewProps> = ({
  events,
  selectedDate,
  selectedEventId,
  onSelectDate,
  onSelectEvent,
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November (0-indexed)
  const [viewMode, setViewMode] = useState<"Month" | "Week" | "Day">("Month");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10); // November 2026
    onSelectDate("2026-11-08");
  };

  // Generate November 2026 calendar matrix (30 days, Nov 1 2026 is Sunday)
  // In November 2026: Nov 1 is Sunday (day 0)!
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay();

  // Create calendar cells
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    daysArray.push(day);
  }

  // Helper to get events for a day
  const getEventsForDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
    return events.filter((e) => e.startDate === dateKey);
  };

  const getDotColor = (category: string) => {
    switch (category) {
      case "Religious":
        return "#7956C9"; // Purple
      case "National":
        return "#2563EB"; // Blue
      case "Special":
        return "#F59E0B"; // Orange
      case "International":
        return "#10B981"; // Green
      case "Cultural":
        return "#10B981"; // Green
      default:
        return "#7956C9";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #EAE4EE",
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(36, 33, 58, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Calendar Header with Navigation Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: "#F4EFFC",
              color: "#7956C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarIcon size={16} />
          </div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#24213A",
              margin: 0,
            }}
          >
            Festival &amp; Event Calendar
          </h2>
        </div>

        {/* Month Navigator & Views */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Month Arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid #EAE4EE",
              borderRadius: "8px",
              padding: "2px",
            }}
          >
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px",
                color: "#24213A",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#24213A",
                padding: "0 8px",
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 6px",
                color: "#24213A",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={handleToday}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#FFFFFF",
              color: "#7956C9",
              border: "1px solid #EAE4EE",
              cursor: "pointer",
            }}
          >
            Today
          </button>

          {/* View Toggles: Month / Week / Day */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#FAF7F2",
              borderRadius: "8px",
              border: "1px solid #EAE4EE",
              padding: "2px",
            }}
          >
            {(["Month", "Week", "Day"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: viewMode === mode ? "#7956C9" : "transparent",
                  color: viewMode === mode ? "#FFFFFF" : "#777184",
                  transition: "all 0.15s ease",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekday Header Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          borderBottom: "1px solid #EAE4EE",
          paddingBottom: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#777184",
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "1px",
          backgroundColor: "#EAE4EE",
          border: "1px solid #EAE4EE",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {daysArray.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                style={{
                  backgroundColor: "#FAF7F2",
                  minHeight: "76px",
                  padding: "6px",
                }}
              />
            );
          }

          const dayEvents = getEventsForDay(day);
          const monthStr = String(currentMonth + 1).padStart(2, "0");
          const dayStr = String(day).padStart(2, "0");
          const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
          const isSelected = selectedDate === dateStr;
          const isHighlightCell = day === 18 && currentMonth === 10; // National Education Day purple highlight

          return (
            <div
              key={`day-${day}`}
              onClick={() => {
                onSelectDate(dateStr);
                if (dayEvents.length > 0) {
                  onSelectEvent(dayEvents[0].id);
                }
              }}
              style={{
                backgroundColor: isHighlightCell
                  ? "#F4EFFC"
                  : isSelected
                  ? "#F8F5FD"
                  : "#FFFFFF",
                minHeight: "76px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.15s ease",
              }}
            >
              {/* Day Number */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isSelected || isHighlightCell ? 700 : 500,
                  color: isHighlightCell ? "#7956C9" : "#24213A",
                }}
              >
                {day}
              </span>

              {/* Plotted Events */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                {dayEvents.map((evt) => {
                  const isCurrentSelected = evt.id === selectedEventId;
                  if (evt.name === "National Education Day") {
                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt.id);
                          onSelectDate(dateStr);
                        }}
                        style={{
                          backgroundColor: "#7956C9",
                          color: "#FFFFFF",
                          fontSize: "10px",
                          fontWeight: 600,
                          borderRadius: "4px",
                          padding: "2px 4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                        }}
                      >
                        National Education Day
                      </div>
                    );
                  }

                  return (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt.id);
                        onSelectDate(dateStr);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontWeight: isCurrentSelected ? 700 : 500,
                        color: "#24213A",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        borderRadius: "3px",
                        padding: "1px 2px",
                        backgroundColor: isCurrentSelected ? "rgba(121, 86, 201, 0.1)" : "transparent",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: getDotColor(evt.category),
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{evt.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
