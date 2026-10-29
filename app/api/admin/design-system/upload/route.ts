import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateBrandAsset } from "@/lib/design-system";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assetId = formData.get("assetId") as string | null;

    if (!file || !assetId) {
      return NextResponse.json(
        { error: "Both 'file' and 'assetId' are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed formats: PNG, JPEG, SVG, WebP.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 5MB." },
        { status: 400 }
      );
    }

    // Safe upload directory
    const uploadDir = path.join(process.cwd(), "public", "assets", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate safe filename
    const ext = path.extname(file.name) || ".png";
    const safeName = `${assetId}_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/assets/uploads/${safeName}`;

    // Update asset record
    const result = updateBrandAsset(assetId, {
      status: "available",
      filename: file.name,
      url: publicUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${file.name}`,
      url: publicUrl,
      config: result.config,
    });
  } catch (err) {
    console.error("Asset upload failed:", err);
    return NextResponse.json(
      { error: "Failed to process asset upload." },
      { status: 500 }
    );
  }
}

