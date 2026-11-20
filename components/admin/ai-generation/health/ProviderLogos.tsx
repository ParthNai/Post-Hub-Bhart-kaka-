import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const OpenAiLogo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21.5 10.2a5.7 5.7 0 0 0-.48-4.5 5.8 5.8 0 0 0-5.78-2.82 5.7 5.7 0 0 0-4.18-1.88 5.8 5.8 0 0 0-5.5 4 5.7 5.7 0 0 0-3.7 2.68 5.8 5.8 0 0 0 .7 6.38 5.7 5.7 0 0 0 .48 4.5 5.8 5.8 0 0 0 5.78 2.82 5.7 5.7 0 0 0 4.18 1.88 5.8 5.8 0 0 0 5.5-4 5.7 5.7 0 0 0 3.7-2.68 5.8 5.8 0 0 0-.7-6.38zm-8.8 11.2a4.3 4.3 0 0 1-2.9-1.12l.14-.08 4.8-2.78a.74.74 0 0 0 .38-.64v-6.8l2.04 1.18a.07.07 0 0 1 .04.05v5.52a4.33 4.33 0 0 1-4.5 4.67zm-7.7-3.72a4.3 4.3 0 0 1-.5-3.07l.14.08 4.8 2.77a.75.75 0 0 0 .75 0l5.88-3.4v2.36a.07.07 0 0 1-.03.06l-4.78 2.76a4.32 4.32 0 0 1-6.26-1.56zm-1.92-8.5a4.3 4.3 0 0 1 2.38-1.95v5.72a.74.74 0 0 0 .37.65l5.88 3.4-2.04 1.18a.07.07 0 0 1-.07 0l-4.78-2.76a4.33 4.33 0 0 1-1.74-6.24zm14.34 2.4-5.88-3.4 2.04-1.18a.07.07 0 0 1 .07 0l4.78 2.76a4.33 4.33 0 0 1 1.74 6.24 4.3 4.3 0 0 1-2.38 1.95v-5.72a.74.74 0 0 0-.37-.65zm3-2.9l-.14-.08-4.8-2.77a.75.75 0 0 0-.75 0l-5.88 3.4v-2.36a.07.07 0 0 1 .03-.06l4.78-2.76a4.32 4.32 0 0 1 6.76 4.63zm-9.74 4.87-2.35-1.36 2.35-1.36 2.35 1.36-2.35 1.36z"
      fill="#10A37F"
    />
  </svg>
);

export const StabilityAiLogo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: 800,
      fontSize: size * 0.55,
      boxShadow: "0 2px 4px rgba(124, 58, 237, 0.25)",
    }}
    className={className}
  >
    S
  </div>
);

export const AdobeFireflyLogo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "6px",
      backgroundColor: "#FF0000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: 900,
      fontSize: size * 0.6,
      boxShadow: "0 2px 4px rgba(255, 0, 0, 0.25)",
      fontFamily: "sans-serif",
    }}
    className={className}
  >
    A
  </div>
);

export const GeminiLogo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
      fill="url(#gemini_grad)"
    />
    <defs>
      <linearGradient id="gemini_grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.33" stopColor="#9B51E0" />
        <stop offset="0.66" stopColor="#EA4335" />
        <stop offset="1" stopColor="#FBBC05" />
      </linearGradient>
    </defs>
  </svg>
);

export const AnthropicLogo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "6px",
      backgroundColor: "#D97706",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: 800,
      fontSize: size * 0.55,
    }}
    className={className}
  >
    C
  </div>
);

export const ProviderIcon: React.FC<{ providerId: string; size?: number }> = ({
  providerId,
  size = 24,
}) => {
  const p = providerId.toLowerCase();
  if (p.includes("openai")) return <OpenAiLogo size={size} />;
  if (p.includes("stability")) return <StabilityAiLogo size={size} />;
  if (p.includes("adobe") || p.includes("firefly")) return <AdobeFireflyLogo size={size} />;
  if (p.includes("gemini") || p.includes("google")) return <GeminiLogo size={size} />;
  return <AnthropicLogo size={size} />;
};
