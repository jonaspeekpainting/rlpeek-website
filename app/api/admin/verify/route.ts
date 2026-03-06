import { NextResponse } from "next/server";

const ADMIN_PAGES_SECRET = process.env.ADMIN_PAGES_SECRET ?? "";

export async function POST(request: Request) {
  if (!ADMIN_PAGES_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const secret = typeof body.secret === "string" ? body.secret.trim() : "";
  if (secret !== ADMIN_PAGES_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
