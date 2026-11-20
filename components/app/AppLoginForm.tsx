"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Compass,
  Check,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AppUser, simulateLogin, saveAppUser } from "@/lib/app-auth";

interface AppLoginFormProps {
  onSuccess?: (user: AppUser) => void;
  onExploreGuest?: () => void;
}

export const AppLoginForm: React.FC<AppLoginFormProps> = ({
  onSuccess,
  onExploreGuest,
}) => {
  const router = useRouter();

  // Mode: signin or signup
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [purpose, setPurpose] = useState<"creator" | "business" | "freelance" | "personal">("creator");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Compact Mobile Carousel Slides (visible only on mobile viewports)
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      badge: "🎉 FESTIVAL SPECIAL",
      title: "Diwali Mega Sale 50% Off",
      subtitle: "Square 1080 × 1080 px · Instant Edit",
      bg: "linear-gradient(135deg, #FF6B4A 0%, #7928CA 100%)",
    },
    {
      badge: "✨ AI MAGIC STUDIO",
      title: "Prompt to Poster in 3s",
      subtitle: "Cyberpunk Neon Cafe 4K Visual",
      bg: "linear-gradient(135deg, #8B5CF6 0%, #00C4CC 100%)",
    },
    {
      badge: "📱 SOCIAL STORIES",
      title: "Autumn Coffee Launch",
      subtitle: "9:16 Vertical Story Template",
      bg: "linear-gradient(135deg, #1E1A33 0%, #4B3869 100%)",
    },
  ];

  // Calculate Password Strength for Sign Up
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(password);

  // Handle Form Submission (Sign In or Sign Up)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email format (e.g. name@example.com).");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters long.");
        return;
      }
      if (!agreeTerms) {
        setError("Please agree to the Terms of Service to continue.");
        return;
      }
    }

    try {
      setLoading(true);
      setLoadingStep(mode === "signin" ? "Verifying your credentials..." : "Creating your studio profile...");

      // Simulate authentication without requiring a backend API
      const user = await simulateLogin({
        email,
        password,
        isSignUp: mode === "signup",
        fullName,
      });

      setLoadingStep("Preparing your creative workspace...");
      setSuccessMessage(
        mode === "signin"
          ? `Welcome back, ${user.name}! Opening canvas...`
          : `Account created successfully! Welcome to Post Hub, ${user.name}!`
      );

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(user);
        } else {
          router.push("/app");
        }
      }, 500);
    } catch {
      setError("An unexpected error occurred while signing in. Please try again.");
      setLoading(false);
    }
  };

  // Social Sign-In Simulation
  const handleSocialClick = async (provider: "Google" | "Apple" | "Facebook") => {
    setError(null);
    setLoading(true);
    setLoadingStep(`Connecting to ${provider} Secure Auth...`);

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Create a social session
    const socialUser: AppUser = {
      id: `usr_${provider.toLowerCase()}_${Date.now().toString(36)}`,
      name: `${provider} Creative Member`,
      email: `creative.${provider.toLowerCase()}@posthub.design`,
      avatarUrl: provider === "Google" 
        ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
        : undefined,
      plan: "Pro",
      role: "creator",
      organization: "Creative Cloud Sync",
      designsCount: 8,
      joinedAt: "Just now",
    };

    saveAppUser(socialUser);
    setSuccessMessage(`Authenticated via ${provider}! Redirecting to canvas...`);

    setTimeout(() => {
      if (onSuccess) {
        onSuccess(socialUser);
      } else {
        router.push("/app");
      }
    }, 450);
  };

  // Forgot Password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setForgotLoading(false);
    setForgotSuccess(true);
  };

  return (
    <div
      className="app-login-card"
      style={{
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* Brand Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <BrandLogo size="sm" />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            backgroundColor: "#F4F0FB",
            color: "#7956C9",
            padding: "3px 8px",
            borderRadius: "5px",
          }}
        >
          Studio Edition
        </span>
      </div>

      {/* Compact Mobile Carousel (Visible ONLY on Mobile/Tablet screens via CSS) */}
      <div
        className="mobile-only-carousel"
        style={{
          borderRadius: "14px",
          background: slides[activeSlide].bg,
          color: "#FFFFFF",
          padding: "14px 16px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          marginBottom: "14px",
          transition: "all 0.3s ease",
        }}
      >
        <span
          style={{
            fontSize: "9.5px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            backgroundColor: "rgba(0,0,0,0.35)",
            padding: "3px 7px",
            borderRadius: "999px",
            display: "inline-block",
            marginBottom: "4px",
          }}
        >
          {slides[activeSlide].badge}
        </span>
        <div style={{ fontSize: "16px", fontWeight: 800, lineHeight: 1.2, marginBottom: "2px" }}>
          {slides[activeSlide].title}
        </div>
        <div style={{ fontSize: "10.5px", opacity: 0.9 }}>{slides[activeSlide].subtitle}</div>

        <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlide(i)}
              style={{
                width: activeSlide === i ? "14px" : "5px",
                height: "5px",
                borderRadius: "3px",
                backgroundColor: activeSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div style={{ marginBottom: "12px" }}>
        <h2
          style={{
            fontSize: "21px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            letterSpacing: "-0.02em",
            marginBottom: "2px",
          }}
        >
          {mode === "signin" ? "Welcome back" : "Create your free account"}
        </h2>
        <p style={{ fontSize: "12.5px", color: "var(--text-muted, #777184)", lineHeight: 1.35 }}>
          {mode === "signin"
            ? "Log in to access your poster templates, designs, and AI studio."
            : "Join 250,000+ creators designing show-stopping graphics."}
        </p>
      </div>

      {/* Pill Mode Switcher (Sign In vs Create Account) */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#F4F1F7",
          borderRadius: "8px",
          padding: "3px",
          marginBottom: "12px",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
          }}
          style={{
            flex: 1,
            padding: "6px 0",
            border: "none",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: mode === "signin" ? 700 : 500,
            color: mode === "signin" ? "#24213A" : "#777184",
            backgroundColor: mode === "signin" ? "#FFFFFF" : "transparent",
            boxShadow: mode === "signin" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          style={{
            flex: 1,
            padding: "6px 0",
            border: "none",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: mode === "signup" ? 700 : 500,
            color: mode === "signup" ? "#24213A" : "#777184",
            backgroundColor: mode === "signup" ? "#FFFFFF" : "transparent",
            boxShadow: mode === "signup" ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Create Account
        </button>
      </div>

      {/* One-Click Social Sign-In Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        {/* Google */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialClick("Google")}
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "8px",
            border: "1px solid #E2DCE8",
            backgroundColor: "#FFFFFF",
            color: "#24213A",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F7FA")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Apple & Facebook in 2 columns */}
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Apple */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialClick("Apple")}
            style={{
              flex: 1,
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #E2DCE8",
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F7FA")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.59-.72.99-1.72.88-2.72-.86.03-1.89.58-2.5 1.3-.54.63-.99 1.65-.87 2.63 1 .08 1.93-.49 2.49-1.21z" />
            </svg>
            <span>Apple</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialClick("Facebook")}
            style={{
              flex: 1,
              height: "36px",
              borderRadius: "8px",
              border: "1px solid #E2DCE8",
              backgroundColor: "#FFFFFF",
              color: "#24213A",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9F7FA")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "10px 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
        <span style={{ fontSize: "11px", color: "#8E8899", fontWeight: 500, textTransform: "lowercase" }}>
          or with email
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#FDF2F2",
            border: "1px solid #F8D7DA",
            color: "#D9383A",
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "#EDF7F2",
            border: "1px solid #C8E8D7",
            color: "#12805C",
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit}>
        {/* Full Name (Sign Up only) */}
        {mode === "signup" && (
          <div style={{ marginBottom: "10px" }}>
            <label
              htmlFor="fullName"
              style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}
            >
              Full Name
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "38px",
                borderRadius: "6px",
                border: "1px solid #EAE4EE",
                padding: "0 10px",
                backgroundColor: "#FFFFFF",
              }}
            >
              <User size={14} color="#8E8899" style={{ marginRight: "8px", flexShrink: 0 }} />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Patel"
                disabled={loading}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: "#24213A",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>
        )}

        {/* Email Address */}
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}
          >
            Email Address
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "38px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              padding: "0 10px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Mail size={14} color="#8E8899" style={{ marginRight: "8px", flexShrink: 0 }} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: mode === "signup" ? "8px" : "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
            <label htmlFor="password" style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>
              Password
            </label>
            {mode === "signin" && (
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#7956C9",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot?
              </button>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "38px",
              borderRadius: "6px",
              border: "1px solid #EAE4EE",
              padding: "0 10px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Lock size={14} color="#8E8899" style={{ marginRight: "8px", flexShrink: 0 }} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "#24213A",
                backgroundColor: "transparent",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#8E8899",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Password Strength Meter (Sign Up Only) */}
        {mode === "signup" && password && (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "3px", height: "3px", marginBottom: "3px" }}>
              {[1, 2, 3, 4].map((step) => {
                let color = "#E2DCE8";
                if (passwordScore >= step) {
                  if (passwordScore === 1) color = "#EF4444";
                  else if (passwordScore === 2) color = "#F59E0B";
                  else if (passwordScore === 3) color = "#3B82F6";
                  else color = "#10B981";
                }
                return (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      backgroundColor: color,
                      borderRadius: "2px",
                      transition: "background-color 0.2s ease",
                    }}
                  />
                );
              })}
            </div>
            <span style={{ fontSize: "10.5px", color: "#8E8899" }}>
              {passwordScore <= 1 && "Weak password"}
              {passwordScore === 2 && "Fair password"}
              {passwordScore === 3 && "Good password"}
              {passwordScore >= 4 && "Strong password ✨"}
            </span>
          </div>
        )}

        {/* Purpose Picker (Sign Up Only) */}
        {mode === "signup" && (
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[
                { id: "creator", label: "📱 Creator & Social" },
                { id: "business", label: "💼 Small Business" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPurpose(opt.id as typeof purpose)}
                  style={{
                    padding: "5px 6px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: purpose === opt.id ? 700 : 500,
                    textAlign: "center",
                    cursor: "pointer",
                    border: purpose === opt.id ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                    backgroundColor: purpose === opt.id ? "#F4F0FB" : "#FFFFFF",
                    color: purpose === opt.id ? "#543399" : "#4B445B",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Checkbox Options */}
        <div style={{ marginBottom: "12px" }}>
          {mode === "signin" ? (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#4B445B",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#7956C9", cursor: "pointer", width: "14px", height: "14px" }}
              />
              <span>Remember me for 30 days</span>
            </label>
          ) : (
            <label
              style={{
                display: "inline-flex",
                alignItems: "flex-start",
                gap: "6px",
                fontSize: "11px",
                color: "#6E687A",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ accentColor: "#7956C9", marginTop: "1px", width: "13px", height: "13px" }}
              />
              <span>I agree to Terms & Privacy Policy.</span>
            </label>
          )}
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(121, 86, 201, 0.25)",
            transition: "all 0.18s ease",
            marginBottom: "10px",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.filter = "brightness(1.06)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.filter = "none";
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{loadingStep || "Signing in..."}</span>
            </>
          ) : (
            <>
              <span>{mode === "signin" ? "Sign In to Studio" : "Create Free Account"}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Guest Exploration Option */}
      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (onExploreGuest) {
              onExploreGuest();
            } else {
              router.push("/app");
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: "#7956C9",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Compass size={13} />
          <span>Explore studio as Guest without login →</span>
        </button>
      </div>

      {/* Admin Management Console Link (Matching Image 1 & 2) */}
      <div
        style={{
          textAlign: "center",
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px dashed #ECE7F0",
          fontSize: "12px",
          color: "#777184",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          flexWrap: "wrap",
        }}
      >
        <span>Admin looking for management console?</span>
        <Link
          href="/admin/dashboard"
          style={{
            color: "#1845A8",
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Forgot Password Inline Modal */}
      {isForgotModalOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            borderRadius: "20px",
            padding: "24px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#24213A" }}>Reset your password</h3>
            <button
              type="button"
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSuccess(false);
              }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <X size={18} color="#6E687A" />
            </button>
          </div>

          {!forgotSuccess ? (
            <form onSubmit={handleForgotSubmit}>
              <p style={{ fontSize: "12px", color: "#777184", marginBottom: "12px" }}>
                Enter your work or personal email address and we&apos;ll send you instructions to reset your studio password.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "38px",
                  borderRadius: "6px",
                  border: "1px solid #EAE4EE",
                  padding: "0 10px",
                  backgroundColor: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                <Mail size={14} color="#8E8899" style={{ marginRight: "8px" }} />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  required
                  style={{ width: "100%", border: "none", outline: "none", fontSize: "13px" }}
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {forgotLoading ? "Sending Instructions..." : "Send Reset Instructions"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  backgroundColor: "#EDF7F2",
                  color: "#12805C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px auto",
                }}
              >
                <Check size={20} />
              </div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Reset link simulated!</h4>
              <p style={{ fontSize: "12px", color: "#777184", marginBottom: "12px" }}>
                Since this is in demo mode without the backend user API, you can sign in directly with any email.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotSuccess(false);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  backgroundColor: "#7956C9",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      )}

      {/* Responsive Styles for Mobile vs Desktop */}
      <style>{`
        .mobile-only-carousel {
          display: none;
        }

        @media (max-width: 1024px) {
          .mobile-only-carousel {
            display: block !important;
          }
          .app-login-card {
            max-width: 420px !important;
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .app-login-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
