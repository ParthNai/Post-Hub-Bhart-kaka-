import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/db";

export async function GET() {
  const users = getAllUsers();
  return NextResponse.json({
    configured: true,
    database: {
      driver: process.env.DATABASE_URL ? "PostgreSQL" : "Local Encrypted Store",
      status: "connected",
      records: users.length,
    },
    security: {
      passwordHashing: "bcrypt (10 salt rounds)",
      sessions: "HTTP-Only JWT (SameSite=Lax)",
      rateLimiting: "5 attempts / 15-minute lockout",
      roleProtection: "Administrator only",
    },
    demoAccounts: [
      {
        email: "admin@yourdomain.com",
        password: "AdminPassword123!",
        role: "admin",
        note: "Active administrator (matches reference design)",
      },
      {
        email: "admin@posthub.io",
        password: "AdminPassword123!",
        role: "superadmin",
        note: "Super administrator",
      },
      {
        email: "disabled@yourdomain.com",
        password: "AdminPassword123!",
        role: "admin (disabled)",
        note: "Demonstrates account disabled error state",
      },
      {
        email: "member@yourdomain.com",
        password: "MemberPassword123!",
        role: "member",
        note: "Demonstrates non-admin access denial",
      },
    ],
  });
}
