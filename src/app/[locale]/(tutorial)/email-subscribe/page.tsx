"use client";
import Image from "next/image";
import { subscribe } from './action';

export default function EmailSubscribe() {
  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-zinc-700">
      <div className="mx-6 my-2 flex rounded-xl bg-zinc-800 p-2">
        <div className="flex flex-col items-center p-2 md:flex-row">
          <Image
            src="/test/beach-villa.png"
            alt="Email Subscribe"
            width={300}
            height={300}
            className="h-80 rounded-xl object-cover transition duration-200 hover:scale-105 hover:rounded-xl md:h-64 md:rounded-l-xl md:rounded-r-none"
          />

          <div className="flex flex-col gap-2 p-6 md:p-12">
            <h1 className="text-center font-serif text-xl font-medium text-white md:text-left">Email Subscribe</h1>
            <p className="max-w-sm text-center text-xs leading-5 tracking-wide text-white md:text-left">
              Subscribe to our newsletter to get the latest news and updates.
            </p>
            <form
              className="mt-5 flex flex-col space-y-4 text-white md:flex-row md:space-y-0 md:space-x-3"
              action={subscribe}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="rounded-md border border-zinc-600 bg-zinc-800 p-2 px-4 text-center text-white placeholder:text-center placeholder:text-xs focus:outline-none md:text-left placeholder:md:text-left"
              />
              <div className="flex justify-center md:justify-end">
                <button
                  type="submit"
                  className="transform rounded-md bg-lime-500 px-5 py-3 text-xs text-zinc-800 duration-500 select-none hover:bg-lime-700 hover:text-white"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
