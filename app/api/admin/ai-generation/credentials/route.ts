import { NextResponse } from "next/server";
import {
  getCredentialsDataset,
  addCredential,
  rotateCredential,
  verifyCredential,
  revokeCredential,
  updateCredentialMetadata,
  deleteCredential,
  resetCredentialsData,
} from "@/lib/ai-credentials-storage";
import type { AddCredentialInput } from "@/lib/ai-credentials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dataset = await getCredentialsDataset();
    return NextResponse.json({ success: true, dataset });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load credentials dataset";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;
    const adminName = (body.adminName as string) || "Parth Admin";

    switch (action) {
      case "add": {
        const input = body.input as AddCredentialInput;
        if (!input) {
          return NextResponse.json(
            { success: false, error: "Missing credential input payload" },
            { status: 400 }
          );
        }
        const result = await addCredential(input, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "rotate": {
        const { credentialId, replacementSecret } = body;
        if (!credentialId || !replacementSecret) {
          return NextResponse.json(
            { success: false, error: "Credential ID and replacement secret are required" },
            { status: 400 }
          );
        }
        const result = await rotateCredential(credentialId, replacementSecret, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "verify": {
        const { credentialId } = body;
        if (!credentialId) {
          return NextResponse.json(
            { success: false, error: "Credential ID is required" },
            { status: 400 }
          );
        }
        const result = await verifyCredential(credentialId, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "revoke": {
        const { credentialId, reason } = body;
        if (!credentialId) {
          return NextResponse.json(
            { success: false, error: "Credential ID is required" },
            { status: 400 }
          );
        }
        const result = await revokeCredential(credentialId, reason, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "update": {
        const { credentialId, updates } = body;
        if (!credentialId || !updates) {
          return NextResponse.json(
            { success: false, error: "Credential ID and updates are required" },
            { status: 400 }
          );
        }
        const result = await updateCredentialMetadata(credentialId, updates, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, ...result, dataset });
      }

      case "delete": {
        const { credentialId } = body;
        if (!credentialId) {
          return NextResponse.json(
            { success: false, error: "Credential ID is required" },
            { status: 400 }
          );
        }
        const deleted = await deleteCredential(credentialId, adminName);
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, deleted, dataset });
      }

      case "reset": {
        await resetCredentialsData();
        const dataset = await getCredentialsDataset();
        return NextResponse.json({ success: true, dataset });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
