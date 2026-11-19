import { NextRequest, NextResponse } from "next/server";

const LOCAL_WEB_ORIGIN =
  /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i;

function isAllowedAppOrigin(origin: string): boolean {
  const configuredOrigins = (process.env.APP_WEB_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  return (
    process.env.NODE_ENV !== "production" && LOCAL_WEB_ORIGIN.test(origin)
  );
}

export function withAppCors(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const origin = request.headers.get("origin");
  response.headers.append("Vary", "Origin");

  if (origin && isAllowedAppOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type",
    );
  }

  return response;
}

export function handleAppCorsOptions(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  if (origin && !isAllowedAppOrigin(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return withAppCors(new NextResponse(null, { status: 204 }), request);
}
