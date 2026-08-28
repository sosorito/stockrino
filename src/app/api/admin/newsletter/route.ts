import { NextResponse } from "next/server";
import { getAllSubscribers } from "@/lib/data/newsletter";

export const dynamic = "force-dynamic";

export async function GET() {
  const subscribers = await getAllSubscribers();
  return NextResponse.json({ subscribers });
}
