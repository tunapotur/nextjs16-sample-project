import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { supabaseAdmin } from "./supabase-admin";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";

function getJwtSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET missing");
  return new TextEncoder().encode(secret);
}

export async function authenticateAdmin(email: string, password: string) {
  console.log("🔍 [AUTH] authenticateAdmin çalıştı");
  console.log("🔍 [AUTH] Email:", email);
  console.log("🔍 [AUTH] Şifre (plain):", password);

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  console.log("🔍 [AUTH] Supabase response:", { data, error });

  if (error || !data) {
    console.log("❌ [AUTH] Kullanıcı bulunamadı");
    return null;
  }

  console.log("🔍 [AUTH] DB Password Hash:", data.password_hash);
  const ok = await bcrypt.compare(password, data.password_hash);

  console.log("🔍 [AUTH] bcrypt.compare sonucu:", ok);

  if (!ok) return null;

  return {
    id: data.id,
    email: data.email,
  };
}

export async function createAdminSession(user: { id: number; email: string }) {
  const token = await new SignJWT({
    sub: String(user.id),
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: Number(payload.sub),
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
