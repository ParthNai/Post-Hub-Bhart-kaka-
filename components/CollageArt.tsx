import React from "react";
import Image from "next/image";

export const CollageArt: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "510px",
        height: "440px",
        userSelect: "none",
        marginTop: "16px",
      }}
      aria-hidden="true"
    >
      {/* 1. Soft Lavender Circle / Arc (top-left background) */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "22px",
          width: "210px",
          height: "210px",
          borderRadius: "50%",
          backgroundColor: "#E8DFF5",
          opacity: 0.9,
          zIndex: 1,
        }}
      />

      {/* 2. Top-Right Textured Violet Card */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "172px",
          width: "158px",
          height: "215px",
          backgroundColor: "#7956C9",
          borderRadius: "4px",
          boxShadow: "0 8px 24px -6px rgba(121, 86, 201, 0.25)",
          zIndex: 2,
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      {/* 3. Vertical text: CREATE EDIT PUBLISH GROW */}
      <div
        style={{
          position: "absolute",
          top: "46px",
          left: "348px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: "#9A93A8",
            lineHeight: 1.6,
          }}
        >
          CREATE
          <br />
          EDIT
          <br />
          PUBLISH
          <br />
          GROW
        </span>
      </div>

      {/* Horizontal accent line next to CREATE EDIT PUBLISH GROW */}
      <div
        style={{
          position: "absolute",
          top: "134px",
          left: "382px",
          width: "38px",
          height: "1.5px",
          backgroundColor: "#A189DB",
          zIndex: 3,
        }}
      />

      {/* 4. Left Architectural Photo Card */}
      <div
        style={{
          position: "absolute",
          top: "115px",
          left: "6px",
          width: "165px",
          height: "215px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 10px 24px -4px rgba(36, 33, 58, 0.12)",
          zIndex: 3,
          backgroundColor: "#EFEBE6",
        }}
      >
        <Image
          src="/assets/arch_building.jpg"
          alt="Modern Architecture"
          width={165}
          height={215}
          priority
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            filter: "grayscale(100%) contrast(1.05)",
          }}
        />
      </div>

      {/* Delicate accent line under architecture card */}
      <div
        style={{
          position: "absolute",
          top: "338px",
          left: "72px",
          width: "80px",
          height: "18px",
          borderBottom: "1.5px solid #E8DFF5",
          borderLeft: "1.5px solid #E8DFF5",
          zIndex: 1,
        }}
      />

      {/* 5. Center Editorial Poster Card: "Better Content Bigger Impact" */}
      <div
        style={{
          position: "absolute",
          top: "54px",
          left: "105px",
          width: "196px",
          height: "272px",
          backgroundColor: "#FAF9F5",
          borderRadius: "4px",
          padding: "24px 20px",
          boxShadow:
            "0 20px 42px -6px rgba(36, 33, 58, 0.16), 0 6px 14px -3px rgba(36, 33, 58, 0.08)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid rgba(234, 228, 238, 0.6)",
        }}
      >
        <div>
          {/* Top accent bar */}
          <div
            style={{
              width: "18px",
              height: "1.5px",
              backgroundColor: "var(--text)",
              marginBottom: "12px",
            }}
          />

          {/* Editorial Headline */}
          <h2
            style={{
              fontFamily: "var(--font-family-serif)",
              fontSize: "30.5px",
              fontWeight: 500,
              lineHeight: 1.05,
              color: "var(--text)",
              letterSpacing: "-0.015em",
            }}
          >
            Better
            <br />
            Content
            <br />
            Bigger
            <br />
            Impact
          </h2>
        </div>

        {/* Poster Footer: POST HUB + line */}
        <div>
          <div
            style={{
              fontSize: "8.5px",
              fontWeight: 600,
              letterSpacing: "0.26em",
              color: "var(--text-muted)",
              marginBottom: "6px",
            }}
          >
            POST HUB
          </div>
          <div
            style={{
              width: "20px",
              height: "1.5px",
              backgroundColor: "var(--text-muted)",
            }}
          />
        </div>
      </div>

      {/* 6. Right Lilac Silk Waves Photo Card */}
      <div
        style={{
          position: "absolute",
          top: "148px",
          left: "244px",
          width: "132px",
          height: "132px",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 10px 24px -4px rgba(36, 33, 58, 0.12)",
          zIndex: 5,
          backgroundColor: "#F2EDF8",
        }}
      >
        <Image
          src="/assets/lilac_waves.jpg"
          alt="Lilac Ribbon Waves"
          width={132}
          height={132}
          priority
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* Subtle hairline under the cards */}
      <div
        style={{
          position: "absolute",
          top: "328px",
          left: "228px",
          width: "60px",
          height: "1.5px",
          backgroundColor: "#A189DB",
          zIndex: 2,
        }}
      />
    </div>
  );
};
