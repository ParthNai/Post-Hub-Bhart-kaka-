"use client";

import React from "react";
import { Search, FileText, Lock, Archive } from "lucide-react";

interface AuxiliaryStatesShowcaseProps {
  onClearFilters: () => void;
  onCreateCategory: () => void;
  onViewTemplates: () => void;
  onRestoreCategory: () => void;
}

export const AuxiliaryStatesShowcase: React.FC<AuxiliaryStatesShowcaseProps> = ({
  onClearFilters,
  onCreateCategory,
  onViewTemplates,
  onRestoreCategory,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginTop: "16px",
        marginBottom: "24px",
      }}
      className="categories-auxiliary-states-grid"
    >
      {/* Card 1: No categories found */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        }}
      >
        <div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#FAF7F2",
              color: "var(--text-muted, #777184)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <Search size={20} />
          </div>

          <h4
            style={{
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: "0 0 6px 0",
            }}
          >
            No categories found
          </h4>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              margin: "0 0 16px 0",
              lineHeight: 1.4,
            }}
          >
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          style={{
            padding: "7px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: "var(--text, #24213A)",
            fontSize: "12.5px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>

      {/* Card 2: No categories configured */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        }}
      >
        <div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#FAF7F2",
              color: "var(--text-muted, #777184)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <FileText size={20} />
          </div>

          <h4
            style={{
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: "0 0 6px 0",
            }}
          >
            No categories configured
          </h4>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              margin: "0 0 16px 0",
              lineHeight: 1.4,
            }}
          >
            You haven&apos;t created any template categories yet. Start by creating your first category.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCategory}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#ffffff",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(121, 86, 201, 0.2)",
          }}
        >
          <span>+ Create Category</span>
        </button>
      </div>

      {/* Card 3: Category cannot be deleted */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        }}
      >
        <div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#FAF7F2",
              color: "var(--text-muted, #777184)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <Lock size={20} />
          </div>

          <h4
            style={{
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: "0 0 6px 0",
            }}
          >
            Category cannot be deleted
          </h4>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              margin: "0 0 16px 0",
              lineHeight: 1.4,
            }}
          >
            This category is being used by templates and cannot be deleted.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewTemplates}
          style={{
            padding: "7px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: "var(--text, #24213A)",
            fontSize: "12.5px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="hover:bg-slate-50"
        >
          View Templates
        </button>
      </div>

      {/* Card 4: This category is archived */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid var(--border, #EAE4EE)",
          borderRadius: "12px",
          padding: "24px 16px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(36, 33, 58, 0.04)",
        }}
      >
        <div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#FAF7F2",
              color: "var(--text-muted, #777184)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            <Archive size={20} />
          </div>

          <h4
            style={{
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--text, #24213A)",
              margin: "0 0 6px 0",
            }}
          >
            This category is archived
          </h4>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted, #777184)",
              margin: "0 0 16px 0",
              lineHeight: 1.4,
            }}
          >
            Archived categories are hidden from active use but can be restored.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestoreCategory}
          style={{
            padding: "7px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border, #EAE4EE)",
            backgroundColor: "#ffffff",
            color: "var(--text, #24213A)",
            fontSize: "12.5px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="hover:bg-slate-50"
        >
          Restore Category
        </button>
      </div>
    </div>
  );
};

