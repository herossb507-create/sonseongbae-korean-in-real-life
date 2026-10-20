"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateDisplayName(formData: FormData) {
  const supabase = createClient();
  const displayName = formData.get("display_name") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    redirect("/settings?error=" + encodeURIComponent(error.message));
  }
  redirect("/settings?success=profile");
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient();
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (newPassword !== confirmPassword) {
    redirect("/settings?error=" + encodeURIComponent("Passwords do not match"));
  }

  if (newPassword.length < 8) {
    redirect("/settings?error=" + encodeURIComponent("Password must be at least 8 characters"));
  }

  // Supabase Auth가 내부적으로 bcrypt 처리
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    redirect("/settings?error=" + encodeURIComponent(error.message));
  }
  redirect("/settings?success=password");
}
