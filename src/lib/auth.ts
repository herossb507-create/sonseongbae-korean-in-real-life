import { createClient } from "@/lib/supabase/server";

export type AccessLevel = "free" | "pro" | "admin";

/**
 * 현재 로그인 유저의 접근 레벨 반환
 * - admin: is_admin = true
 * - pro: active subscription
 * - free: 그 외
 */
export async function getUserAccess(): Promise<{
  userId: string | null;
  accessLevel: AccessLevel;
  isPro: boolean;
  isAdmin: boolean;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, accessLevel: "free", isPro: false, isAdmin: false };
  }

  // 관리자 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profile?.is_admin) {
    return { userId: user.id, accessLevel: "admin", isPro: true, isAdmin: true };
  }

  // 구독 확인
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (subscription) {
    return { userId: user.id, accessLevel: "pro", isPro: true, isAdmin: false };
  }

  return { userId: user.id, accessLevel: "free", isPro: false, isAdmin: false };
}
