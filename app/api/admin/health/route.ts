import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export interface HealthStatusResponse {
  timestamp: string;
  services: {
    database: {
      name: string;
      status: "healthy" | "degraded" | "unavailable" | "not_checked";
      message: string;
      latencyMs?: number;
    };
    aiProvider: {
      name: string;
      status: "healthy" | "degraded" | "not_configured" | "not_checked";
      message: string;
      provider?: string;
    };
    emailService: {
      name: string;
      status: "healthy" | "degraded" | "not_configured" | "not_checked";
      message: string;
    };
  };
}

export async function GET() {
  let dbStatus: "healthy" | "degraded" | "unavailable" = "healthy";
  let dbMessage = "Database connection operational";
  let dbLatency = 0;

  try {
    const t0 = Date.now();
    const users = getAllUsers();
    dbLatency = Date.now() - t0;
    if (!Array.isArray(users)) {
      dbStatus = "degraded";
      dbMessage = "User collection format invalid";
    }
  } catch (err: unknown) {
    dbStatus = "unavailable";
    dbMessage = err instanceof Error ? err.message : "Database connection failed";
  }

  // Safe AI Provider check: do not expose keys
  let aiStatus: "healthy" | "not_configured" = "not_configured";
  let aiMessage = "AI Provider credentials not configured";
  let aiProviderName: string | undefined = undefined;

  if (process.env.GEMINI_API_KEY) {
    aiStatus = "healthy";
    aiMessage = "Google Gemini API key present";
    aiProviderName = "Google Gemini";
  } else if (process.env.OPENAI_API_KEY) {
    aiStatus = "healthy";
    aiMessage = "OpenAI API key present";
    aiProviderName = "OpenAI";
  }

  // Safe Email Service check
  let emailStatus: "healthy" | "not_configured" = "not_configured";
  let emailMessage = "Email dispatch service not configured";

  if (process.env.RESEND_API_KEY || process.env.SMTP_HOST) {
    emailStatus = "healthy";
    emailMessage = "SMTP / transactional provider active";
  }

  const response: HealthStatusResponse = {
    timestamp: new Date().toISOString(),
    services: {
      database: {
        name: "Database",
        status: dbStatus,
        message: dbMessage,
        latencyMs: dbLatency,
      },
      aiProvider: {
        name: "AI Provider",
        status: aiStatus,
        message: aiMessage,
        provider: aiProviderName,
      },
      emailService: {
        name: "Email Service",
        status: emailStatus,
        message: emailMessage,
      },
    },
  };

  return NextResponse.json(response);
}
