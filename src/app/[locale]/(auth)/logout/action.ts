"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseUncached } from "@/modules/supabase/clients/client.server";

export async function logoutAction(): Promise<never> {
  try {
    const supabase = await getSupabaseUncached();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    // Revalidate all paths to clear any cached user data
    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/login", "layout");

    // Clear any server-side session cookies
    const cookieStore = await import("next/headers").then(({ cookies }) => cookies());
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");

    // Redirect to home page
    redirect("/");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, redirect to home
    redirect("/");
  }
}
