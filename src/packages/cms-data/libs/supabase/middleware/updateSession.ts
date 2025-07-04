import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@cms-data/libs/supabase/clients/client";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  try {
    // Create an unmodified response
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Refresh session if it exists
    await supabase.auth.getSession();

    return response;
  } catch (error: unknown) {
    // If there's an error, return the original response
    console.error("Error in middleware:", error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}
