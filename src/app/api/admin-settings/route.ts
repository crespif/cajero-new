import { NextRequest, NextResponse } from "next/server";
import { put, head } from "@vercel/blob";
import { computeSessionToken } from "@/app/lib/adminAuth";
import { DEFAULT_SETTINGS, AppSettings } from "@/app/lib/settings";

export const runtime = "nodejs";

const BLOB_PATHNAME = "settings.json";

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get("x-internal-token") === computeSessionToken();
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const blob = await head(BLOB_PATHNAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ ...DEFAULT_SETTINGS, ...data });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const settings: AppSettings = await req.json();
  await put(BLOB_PATHNAME, JSON.stringify(settings, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return NextResponse.json({ ok: true });
}
