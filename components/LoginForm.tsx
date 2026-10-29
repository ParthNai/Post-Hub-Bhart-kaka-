"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";
import { Alert } from "./Alert";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Field validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form-level error (e.g. invalid credentials, disabled, rate-limited)
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Client-side quick validation
  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError("Please enter a valid email address.");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field === "email") {
          setEmailError(data.error);
        } else if (data.field === "password") {
          setPasswordError(data.error);
        } else {
          setFormError(data.error || "Authentication failed. Please check your credentials.");
        }
        setIsLoading(false);
        return;
      }

      // Success state
      setIsSuccess(true);
      router.push(data.redirectUrl || "/admin/dashboard");
    } catch {
      setFormError("Unable to reach the server. Please check your internet connection.");
      setIsLoading(false);
    }
  };

  // Helper for testing
  const quickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "var(--surface)",
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        padding: "48px 44px 40px 44px",
      }}
    >
      {/* Card Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          Admin Sign In
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Access your Post Hub control centre.
        </p>
      </div>

      {/* Form Error Alert */}
      {formError && <Alert type="error" message={formError} />}

      {/* Success Notification */}
      {isSuccess && (
        <Alert
          type="success"
          message="Authentication verified. Redirecting to Admin Dashboard..."
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Email Field */}
        <Input
          id="admin-email"
          label="Email address"
          type="email"
          placeholder="admin@yourdomain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          icon={<Mail size={18} />}
          error={emailError || undefined}
          disabled={isLoading || isSuccess}
          autoComplete="email"
          required
        />

        {/* Password Field */}
        <Input
          id="admin-password"
          label="Password"
          isPassword
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError(null);
          }}
          icon={<Lock size={18} />}
          error={passwordError || undefined}
          disabled={isLoading || isSuccess}
          autoComplete="current-password"
          required
        />

        {/* Options Row: Remember Me & Forgot Password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "2px",
            marginBottom: "24px",
          }}
        >
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={setRememberMe}
            disabled={isLoading || isSuccess}
          />

          <Link
            href="/forgot-password"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--primary)",
              textDecoration: "none",
              transition: "opacity 0.16s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Primary Action Button */}
        <Button type="submit" loading={isLoading} disabled={isSuccess}>
          Sign In
        </Button>
      </form>

      {/* Security Footnote */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "26px",
          color: "var(--text-muted)",
          fontSize: "12px",
          userSelect: "none",
        }}
      >
        <Lock size={13} style={{ flexShrink: 0 }} />
        <span>Secure access for authorised administrators only.</span>
      </div>

      {/* Developer & QA Quick Credentials Helper */}
      <div
        style={{
          marginTop: "28px",
          paddingTop: "18px",
          borderTop: "1px dashed #EAE4EE",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#9A93A8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShieldCheck size={12} color="var(--primary)" /> Test Credential Quick-Fill
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          <button
            type="button"
            onClick={() => quickFill("admin@yourdomain.com", "AdminPassword123!")}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #EAE4EE",
              background: "#FAF7F2",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            Active Admin
          </button>
          <button
            type="button"
            onClick={() => quickFill("disabled@yourdomain.com", "AdminPassword123!")}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #EAE4EE",
              background: "#FAF7F2",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            Disabled Account
          </button>
          <button
            type="button"
            onClick={() => quickFill("member@yourdomain.com", "MemberPassword123!")}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #EAE4EE",
              background: "#FAF7F2",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            Non-Admin Member
          </button>
          <button
            type="button"
            onClick={() => quickFill("admin@yourdomain.com", "WrongPassword!")}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #EAE4EE",
              background: "#FAF7F2",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            Wrong Password
          </button>
        </div>
      </div>
    </div>
  );
};
