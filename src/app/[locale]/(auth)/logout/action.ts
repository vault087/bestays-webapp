"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "@/modules/supabase";

export async function logoutAction(): Promise<never> {
  try {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    // Revalidate all paths to clear any cached user data
    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");

    // Redirect to home page
    redirect("/");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, redirect to home
    redirect("/");
  }
}
