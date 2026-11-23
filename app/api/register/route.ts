import { NextRequest, NextResponse } from "next/server";
import { registerMobileUser } from "@/lib/mobile-users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";
    const occupation = typeof body.occupation === "string" ? body.occupation.trim() : "";

    if (!name || !mobile || !/^\d{10}$/.test(mobile) || !/^\d{4}$/.test(pin) || !occupation) {
      return NextResponse.json(
        { error: "Please provide name, mobile number, 4-digit PIN, and occupation." },
        { status: 400 }
      );
    }

    const result = registerMobileUser({
      name,
      mobile,
      pin,
      occupation,
      village: typeof body.village === "string" ? body.village : undefined,
      taluka: typeof body.taluka === "string" ? body.taluka : undefined,
      district: typeof body.district === "string" ? body.district : undefined,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error, code: result.code }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: result.user.id,
        name: result.user.name,
        mobile: result.user.mobile,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
