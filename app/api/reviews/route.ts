/**
 * Proxy to job-engine public reviews so the reviews page can fetch from same origin
 * and always get the full list (avoids server-render fetch/env issues).
 */
import { NextResponse } from "next/server";
import { fetchReviewsFromJobEngine } from "@/lib/googleReviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const reviews = await fetchReviewsFromJobEngine(5, 50);
    return NextResponse.json(reviews);
  } catch (e) {
    console.error("Reviews API error:", e);
    return NextResponse.json([], { status: 500 });
  }
}
