import { cookies } from "next/headers";
import { auth_token, errorMessage } from "@/constants";
import { adminAuth } from "@/utils/firebaseAdmin";

export async function DELETE() {
  try {
    const cookieStore = await cookies(); // No need for `await` here

    // Remove the session cookie
    cookieStore.set(auth_token, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return Response.json({ success: true, message: "Session cookie deleted successfully." });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return Response.json(errorMessage(err.message));
    }
    return Response.json(errorMessage("An unknown error occurred"));
  }
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json(); // ✅ Parse JSON correctly

    if (!idToken) {
      return new Response(JSON.stringify({ success: false, message: "Missing ID token." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const expiresIn = 14 * 24 * 60 * 60 * 1000; // 14 days

    // ✅ Create session cookie using Firebase Admin SDK
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // ✅ Set the session cookie in the user's browser
    const cookieStore = await cookies(); // No need for `await`
    cookieStore.set(auth_token, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000, // Convert to seconds
      path: "/",
    });

    return new Response(JSON.stringify({ success: true, message: "Session cookie set successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return new Response(JSON.stringify(errorMessage(err.message)), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(errorMessage("An unknown error occurred")), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
