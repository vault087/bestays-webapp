// import { getAdminSupabase } from "@/modules/supabase";
import LoginForm from "./login-form";

export default async function Login() {
  // await createTestUser();

  return (
    <div className="bg-background flex min-h-dvh w-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
