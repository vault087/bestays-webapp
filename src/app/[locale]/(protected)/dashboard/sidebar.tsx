import Image from "next/image";
import Link from "next/link";

export default async function SideBar() {
  return (
    <div className="flex h-full w-full flex-col space-y-8 px-4 pt-4">
      {/* Logo Container */}
      <Link href="/">
        <div className="group flex items-center space-x-2">
          <Image
            src="/bestays-logo-transparent.png"
            alt="logo"
            width={32}
            height={32}
            className="contrast-125 saturate-125 transition-all duration-300 group-hover:opacity-80 dark:rounded-full"
          />
          <h1 className="text-primary font-sans text-xl font-bold tracking-wide transition-all duration-300 group-hover:opacity-80">
            Best Stays
          </h1>
        </div>
      </Link>

      {/* Menu Container */}
      <div className="flex flex-col">
        {/* Menu Header */}
        <div className="text-primary flex flex-row items-center justify-between">
          <p className="font-bold uppercase">Menu</p>
          <svg
            className="hidden h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </div>
        <ul className="flex flex-col space-y-2 py-4">
          <li>
            <Link href="/dashboard" className="group text-primary flex flex-row items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 group-hover:opacity-60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              <span className="text-md font-sans font-medium tracking-wider uppercase group-hover:opacity-60">
                Dashboard
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Domain List */}
      <div>listing..</div>
    </div>
  );
}
