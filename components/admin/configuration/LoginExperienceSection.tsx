"use client";

import React from "react";
import {
  DEFAULT_LOGIN_EXPERIENCE,
  type LoginExperienceConfig,
} from "@/lib/login-experience";

interface LoginExperienceSectionProps {
  value?: LoginExperienceConfig;
  onChange: (value: LoginExperienceConfig) => void;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--surface)",
  color: "var(--text)",
  padding: "0 12px",
  fontSize: "13px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text)",
  fontSize: "12px",
  fontWeight: 650,
  marginBottom: "6px",
};

export function LoginExperienceSection({
  value,
  onChange,
}: LoginExperienceSectionProps) {
  const settings = { ...DEFAULT_LOGIN_EXPERIENCE, ...value };
  const update = (patch: Partial<LoginExperienceConfig>) => {
    onChange({ ...settings, ...patch });
  };

  const toggles: Array<{
    key: keyof Pick<
      LoginExperienceConfig,
      "googleEnabled" | "emailEnabled" | "mobileEnabled" | "signupEnabled"
    >;
    title: string;
    description: string;
  }> = [
    {
      key: "googleEnabled",
      title: "Google sign-in",
      description: "Show the Google sign-in option.",
    },
    {
      key: "emailEnabled",
      title: "Email sign-in",
      description: "Show email and password sign-in.",
    },
    {
      key: "mobileEnabled",
      title: "Mobile sign-in",
      description: "Show the mobile sign-in option.",
    },
    {
      key: "signupEnabled",
      title: "Create account link",
      description: "Show the account creation link.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text)",
            margin: "0 0 5px",
          }}
        >
          Login Page Content
        </h3>
        <p
          style={{
            fontSize: "12.5px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Edit the welcome screen shown in the mobile app. Save a draft to keep
          changes private, then publish to update the live login page.
        </p>
      </div>

      <label>
        <span style={labelStyle}>Brand name</span>
        <input
          aria-label="Login brand name"
          style={fieldStyle}
          value={settings.brandName}
          onChange={(event) => update({ brandName: event.target.value })}
          maxLength={40}
        />
      </label>

      <label>
        <span style={labelStyle}>Brand tagline</span>
        <input
          aria-label="Login brand tagline"
          style={fieldStyle}
          value={settings.brandTagline}
          onChange={(event) => update({ brandTagline: event.target.value })}
          maxLength={80}
        />
      </label>

      <label>
        <span style={labelStyle}>Welcome headline</span>
        <input
          aria-label="Login welcome headline"
          style={fieldStyle}
          value={settings.welcomeTitle}
          onChange={(event) => update({ welcomeTitle: event.target.value })}
          maxLength={60}
        />
      </label>

      <label>
        <span style={labelStyle}>Welcome message</span>
        <textarea
          aria-label="Login welcome message"
          style={{
            ...fieldStyle,
            height: "76px",
            padding: "10px 12px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
          value={settings.welcomeSubtitle}
          onChange={(event) => update({ welcomeSubtitle: event.target.value })}
          maxLength={180}
        />
      </label>

      <label>
        <span style={labelStyle}>Bottom banner text</span>
        <input
          aria-label="Login bottom banner text"
          style={fieldStyle}
          value={settings.footerTagline}
          onChange={(event) => update({ footerTagline: event.target.value })}
          maxLength={100}
        />
      </label>

      <label>
        <span style={labelStyle}>Hero image URL (optional)</span>
        <input
          aria-label="Login hero image URL"
          style={fieldStyle}
          value={settings.heroImageUrl}
          onChange={(event) => update({ heroImageUrl: event.target.value })}
          placeholder="https://example.com/login-art.png"
          maxLength={500}
        />
      </label>

      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <div
            style={{
              color: "var(--text)",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Sign-in options
          </div>
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "11.5px",
              marginTop: "3px",
            }}
          >
            Control which choices appear on the welcome screen.
          </div>
        </div>
        {toggles.map(({ key, title, description }) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <span>
              <span
                style={{
                  display: "block",
                  color: "var(--text)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                }}
              >
                {title}
              </span>
              <span
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  fontSize: "11px",
                  marginTop: "3px",
                }}
              >
                {description}
              </span>
            </span>
            <input
              aria-label={title}
              type="checkbox"
              checked={settings[key]}
              onChange={(event) => update({ [key]: event.target.checked })}
              style={{ width: "17px", height: "17px", accentColor: "var(--primary)" }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
