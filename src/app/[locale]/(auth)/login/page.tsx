import { getAdminSupabase } from "@/modules/supabase";
import LoginForm from "./login-form";

export default async function Login() {
  await createTestUser();

  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-cyan-100">
      <LoginForm />
    </div>
  );
}

async function createTestUser() {
  const supabase = await getAdminSupabase();
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("ListUsers Error: " + error);
  }

  if (users.users.length > 0) {
    return;
  }

  const { data } = await supabase.auth.admin.createUser({
    email: "test@test.com",
    password: "test",
    email_confirm: true,
    user_metadata: {
      is_test_user: true,
    },
  });

  return data;
}
