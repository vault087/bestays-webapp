"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase } from "@/modules/supabase";

export type LoginState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !email.includes("@")) {
    return {
      errors: {
        email: ["Please enter a valid email address"],
      },
    };
  }

  if (!password || password.length < 6) {
    return {
      errors: {
        password: ["Password must be at least 6 characters"],
      },
    };
  }

  try {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        message: error.message,
      };
    }

    if (data.user) {
      revalidatePath("/", "layout");
      redirect("/dashboard");
    }

    return {
      message: "Login failed. Please try again.",
    };
  } catch {
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
