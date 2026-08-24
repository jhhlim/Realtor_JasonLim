import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name:
        (user.user_metadata?.full_name as string | undefined) ||
        user.email?.split("@")[0] ||
        "Agent",
    });
    if (profileError && !profileError.message.toLowerCase().includes("duplicate")) {
      throw new Error(
        `Your CRM profile is missing. Run supabase/FIX_PROFILE.sql in the Supabase SQL Editor, then try again. (${profileError.message})`,
      );
    }
  }

  return { supabase, user };
}
