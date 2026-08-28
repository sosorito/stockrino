import { NextRequest, NextResponse } from "next/server";
import { findAdminByLogin, verifyPassword } from "@/lib/data/users";
import { signSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || "").trim();
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    const user = await findAdminByLogin(identifier);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: { name: user.name, email: user.email, username: user.username },
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
