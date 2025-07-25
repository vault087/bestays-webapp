// import { getAdminSupabase } from "@/modules/supabase";
import LoginForm from "./login-form";

export default async function Login() {
  // await createTestUser();

  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-cyan-100">
      <LoginForm />
    </div>
  );
}
