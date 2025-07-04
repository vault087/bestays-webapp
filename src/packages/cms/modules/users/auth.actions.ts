"use server";

import { User } from "@supabase/supabase-js";
import { getSupabase } from "@cms-data/libs/supabase/clients/client.server";

export async function login(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const user = await supabase.auth.getUser();
  console.log("login user", user);
  console.log("login data", data);
  console.log("login error", error);

  return { user: data.user, error };
}

export async function logout(): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Logout Error: " + error);
  }
}
