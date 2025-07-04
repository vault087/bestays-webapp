import { getSupabase } from "@/modules/supabase/clients/client.server";
import { User } from "./user.types";

// Core auth functions - predictable return types
export const getUser = async (): Promise<User | null> => {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null; // Always return null for unauthenticated
  }

  return data.user;
};

export const getUserOrThrow = async (): Promise<User> => {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error("GetUser Error: " + error.message);
  }
  if (!data.user) {
    throw new Error("User not found");
  }

  return data.user;
};

// Business logic functions
export async function isLoggedIn(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
