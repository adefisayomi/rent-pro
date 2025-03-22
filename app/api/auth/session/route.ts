import { cookies } from "next/headers";
import { auth_token, errorMessage } from "@/constants";
import { adminAuth } from "@/utils/firebaseAdmin";
import { getCustomClaims } from "@/actions/auth";

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    // Remove the session cookie
    cookieStore.set(auth_token, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Session cookie deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify(errorMessage(err instanceof Error ? err.message : "An unknown error occurred")),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing ID token." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const expiresIn = 14 * 24 * 60 * 60 * 1000; // 14 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set(auth_token, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Session cookie set successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify(errorMessage(err instanceof Error ? err.message : "An unknown error occurred")),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function GET() {
  try {
    const { data, message, success } = await getCustomClaims();
    if (!success) throw new Error(message || "Failed to fetch custom claims");

    const expiresIn = 14 * 24 * 60 * 60; // 14 days (seconds)
    const cookieStore = await cookies();

    cookieStore.set("accountType", data?.accountType || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn,
      path: "/",
    });

    return new Response(
      JSON.stringify({ success: true, message: null, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify(errorMessage(err instanceof Error ? err.message : "An unknown error occurred")),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}