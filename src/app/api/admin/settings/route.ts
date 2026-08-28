import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/data/settings";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await updateSettings(body);
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
