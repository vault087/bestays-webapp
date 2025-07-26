"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { loginAction, type LoginState } from "./action";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const router = useRouter();

  // Handle successful login redirect
  useEffect(() => {
    if (state?.message === "Login successful! Redirecting...") {
      router.push("/dashboard");
    }
  }, [state?.message, router]);

  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-zinc-700">
      <div className="mx-6 my-2 flex rounded-xl bg-zinc-800 p-2">
        <div className="flex flex-col items-center p-2 md:flex-row">
          <div className="flex h-80 w-80 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 transition duration-200 hover:scale-105 hover:rounded-xl md:h-64 md:rounded-l-xl md:rounded-r-none">
            <div className="text-center text-white">
              <h2 className="mb-2 text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm opacity-90">Sign in to your account</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 md:p-12">
            <h1 className="text-center font-serif text-xl font-medium text-white md:text-left">Sign In</h1>
            <p className="max-w-sm text-center text-xs leading-5 tracking-wide text-white md:text-left">
              Enter your credentials to access your dashboard.
            </p>

            <form className="mt-5 flex flex-col space-y-4 text-white md:space-y-3" action={formAction}>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="rounded-md border border-zinc-600 bg-zinc-800 p-2 px-4 text-center text-white placeholder:text-center placeholder:text-xs focus:border-blue-500 focus:outline-none md:text-left placeholder:md:text-left"
                  required
                />
                {state?.errors?.email && (
                  <p className="text-center text-xs text-red-400 md:text-left">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="rounded-md border border-zinc-600 bg-zinc-800 p-2 px-4 text-center text-white placeholder:text-center placeholder:text-xs focus:border-blue-500 focus:outline-none md:text-left placeholder:md:text-left"
                  required
                />
                {state?.errors?.password && (
                  <p className="text-center text-xs text-red-400 md:text-left">{state.errors.password[0]}</p>
                )}
              </div>

              {state?.message && (
                <p
                  className={`text-center text-xs md:text-left ${
                    state.message === "Login successful! Redirecting..." ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {state.message}
                </p>
              )}

              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  disabled={pending}
                  className="transform rounded-md bg-lime-500 px-5 py-3 text-xs text-zinc-800 duration-500 select-none hover:bg-lime-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
