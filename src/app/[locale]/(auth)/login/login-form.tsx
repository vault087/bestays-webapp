"use client";

import { FormEvent, useState } from "react";
import { login } from "@/entities/users/libs/auth";
import { useRouter } from "@/modules/i18n/core/client/navigation";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { user, error } = await login(email, password);
    setError(error?.message ?? null);
    if (user) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-w-sm space-y-4 rounded-lg bg-white p-4 shadow-xl">
      <h1 className="text-center text-2xl font-medium">Sign In</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" className="w-full rounded-md border border-gray-300 p-2" name="email" />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-md border border-gray-300 p-2"
          name="password"
        />

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <button type="submit" className="rounded-md bg-blue-500 p-2 text-white">
          Login
        </button>
      </form>
    </div>
  );
}
