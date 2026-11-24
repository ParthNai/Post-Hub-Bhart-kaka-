"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Compass,
  ExternalLink,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AppUser, simulateLogin, saveAppUser } from "@/lib/app-auth";

interface MobileAppLoginPageProps {
  onSuccess: (user: AppUser) => void;
  onExploreGuest: () => void;
  logoUrl?: string;
}

export const MobileAppLoginPage: React.FC<MobileAppLoginPageProps> = ({
  onSuccess,
  onExploreGuest,
  logoUrl,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [purpose, setPurpose] = useState<"creator" | "business">("creator");

  // Status
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Active showcase slide
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badge: "🎉 FESTIVAL POSTERS",
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

  // Real-time password strength for mobile sign up
  const getPasswordScore = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  };
  const pwdScore = getPasswordScore(password);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);
      setLoadingText(mode === "signin" ? "Verifying..." : "Creating account...");

      const user = await simulateLogin({
        email,
        password,
        isSignUp: mode === "signup",
        fullName,
      });

      setSuccess(`Welcome, ${user.name}!`);
      setTimeout(() => {
        onSuccess(user);
      }, 500);
    } catch {
      setError("Could not sign in. Please try again.");
      setLoading(false);
    }
  };
  const handleSocialSignIn = async (provider: string) => {
    setError(null);
    setLoading(true);
    setLoadingText(`Connecting ${provider}...`);

    await new Promise((resolve) => setTimeout(resolve, 600));
    const socialUser: AppUser = {
      id: `usr_${provider.toLowerCase()}_${Date.now().toString(36)}`,
      name: `${provider} Creator`,
      email: `user.${provider.toLowerCase()}@posthub.design`,
      avatarUrl: provider === "Google" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" : undefined,
      plan: "Pro",
      role: "creator",
      organization: "Mobile Studio",
      designsCount: 6,
      joinedAt: "Today",
    };
    saveAppUser(socialUser);
    setSuccess(`Authenticated via ${provider}!`);
    setTimeout(() => {
      onSuccess(socialUser);
    }, 400);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          width: "100%",
          maxWidth: "460px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px 12px 20px",
          boxSizing: "border-box",
        }}
      >
        <BrandLogo size="md" logoUrl={logoUrl} />
        <Link
          href="/admin/dashboard"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#7956C9",
            backgroundColor: "#F4F0FB",
            border: "1px solid #E3D9F8",
            padding: "5px 10px",
            borderRadius: "6px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            textDecoration: "none",
          }}
        >
          <span>Admin Console</span>
          <ExternalLink size={12} />
        </Link>
      </header>

      {/* Main Login Card / Mobile View Container */}
      <div
        className="mobile-login-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #EAE4EE",
          boxShadow: "0 12px 32px -4px rgba(36, 33, 58, 0.05), 0 4px 12px -2px rgba(36, 33, 58, 0.03)",
          padding: "24px 22px 28px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Canva Mobile Hero Mini-Carousel */}
        <div
          style={{
            borderRadius: "16px",
            background: slides[activeSlide].bg,
            color: "#FFFFFF",
            padding: "18px 20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            transition: "all 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              backgroundColor: "rgba(0,0,0,0.35)",
              padding: "4px 9px",
              borderRadius: "999px",
              display: "inline-block",
              marginBottom: "8px",
            }}
          >
            {slides[activeSlide].badge}
          </span>
          <div style={{ fontSize: "19px", fontWeight: 800, lineHeight: 1.2, marginBottom: "4px" }}>
            {slides[activeSlide].title}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.9 }}>{slides[activeSlide].subtitle}</div>

          {/* Carousel Dot Indicators */}
          <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                style={{
                  width: activeSlide === i ? "18px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: activeSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Sign In vs Create Account Pill Switcher */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#EDE9F2",
            borderRadius: "10px",
            padding: "3px",
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
              padding: "8px 0",
              border: "none",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: mode === "signin" ? 700 : 500,
              color: mode === "signin" ? "#24213A" : "#777184",
              backgroundColor: mode === "signin" ? "#FFFFFF" : "transparent",
              boxShadow: mode === "signin" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
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
              padding: "8px 0",
              border: "none",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: mode === "signup" ? 700 : 500,
              color: mode === "signup" ? "#24213A" : "#777184",
              backgroundColor: mode === "signup" ? "#FFFFFF" : "transparent",
              boxShadow: mode === "signup" ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* One-Tap Mobile Social Auth (Canva Mobile Style) */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Google */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialSignIn("Google")}
            style={{
              flex: 1,
              height: "42px",
              borderRadius: "8px",
              border: "1px solid #E2DCE8",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#24213A",
              cursor: "pointer",
            }}
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
            <span>Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialSignIn("Apple")}
            style={{
              flex: 1,
              height: "42px",
              borderRadius: "8px",
              border: "1px solid #E2DCE8",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#24213A",
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.59-.72.99-1.72.88-2.72-.86.03-1.89.58-2.5 1.3-.54.63-.99 1.65-.87 2.63 1 .08 1.93-.49 2.49-1.21z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
          <span style={{ fontSize: "11px", color: "#8E8899", textTransform: "lowercase" }}>or email</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#EAE4EE" }} />
        </div>

        {/* Error or Success notification */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#FDF2F2",
              border: "1px solid #F8D7DA",
              color: "#D9383A",
              fontSize: "12.5px",
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#EDF7F2",
              border: "1px solid #C8E8D7",
              color: "#12805C",
              fontSize: "12.5px",
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
                Full Name
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #EAE4EE",
                  backgroundColor: "#FFFFFF",
                  padding: "0 10px",
                }}
              >
                <User size={15} color="#8E8899" style={{ marginRight: "8px" }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px", color: "#24213A" }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#24213A", marginBottom: "4px" }}>
              Email Address
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "42px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                padding: "0 10px",
              }}
            >
              <Mail size={15} color="#8E8899" style={{ marginRight: "8px" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px", color: "#24213A" }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#24213A" }}>Password</label>
              {mode === "signin" && (
                <span style={{ fontSize: "11px", color: "#7956C9", fontWeight: 600, cursor: "pointer" }}>
                  Forgot?
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "42px",
                borderRadius: "8px",
                border: "1px solid #EAE4EE",
                backgroundColor: "#FFFFFF",
                padding: "0 10px",
              }}
            >
              <Lock size={15} color="#8E8899" style={{ marginRight: "8px" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", border: "none", outline: "none", fontSize: "13.5px", color: "#24213A" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#8E8899", padding: "2px" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Real-time Strength Meter for Sign Up */}
          {mode === "signup" && password && (
            <div style={{ display: "flex", gap: "3px", height: "4px" }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    borderRadius: "2px",
                    backgroundColor:
                      pwdScore >= step ? (pwdScore === 1 ? "#EF4444" : pwdScore === 2 ? "#F59E0B" : "#10B981") : "#EAE4EE",
                  }}
                />
              ))}
            </div>
          )}

          {/* Purpose picker for Sign Up */}
          {mode === "signup" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setPurpose("creator")}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: purpose === "creator" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: purpose === "creator" ? "#F4F0FB" : "#FFFFFF",
                  color: purpose === "creator" ? "#543399" : "#6E687A",
                }}
              >
                📱 Creator
              </button>
              <button
                type="button"
                onClick={() => setPurpose("business")}
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: purpose === "business" ? "1.5px solid #7956C9" : "1px solid #EAE4EE",
                  backgroundColor: purpose === "business" ? "#F4F0FB" : "#FFFFFF",
                  color: purpose === "business" ? "#543399" : "#6E687A",
                }}
              >
                💼 Business
              </button>
            </div>
          )}

          {/* Remember me */}
          {mode === "signin" && (
            <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#6E687A" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "#7956C9" }}
              />
              <span>Remember me for 30 days</span>
            </label>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: "46px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #7956C9 0%, #633CAE 100%)",
              color: "#FFFFFF",
              fontSize: "14.5px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(121, 86, 201, 0.25)",
              marginTop: "4px",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{loadingText || "Please wait..."}</span>
              </>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In to Studio" : "Create Free Account"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Continue as Guest */}
        <div style={{ textAlign: "center", marginTop: "4px" }}>
          <button
            type="button"
            onClick={onExploreGuest}
            style={{
              background: "none",
              border: "none",
              color: "#7956C9",
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Compass size={14} />
            <span>Explore app as Guest without login →</span>
          </button>
        </div>
      </div>

      {/* Footer info */}
      <footer style={{ marginTop: "20px", marginBottom: "20px", textAlign: "center", fontSize: "12px", color: "#8E8899" }}>
        <span>Post Hub Studio · Canva-Alternative Design Suite</span>
      </footer>

      {/* Responsive media overrides: Full edge-to-edge when in mobile view (F12) */}
      <style>{`
        @media (max-width: 480px) {
          .mobile-login-card {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 16px 18px 24px 18px !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
};
