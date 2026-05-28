const navLinks = [
  { label: "Explore", href: "#venues" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For hosts", href: "#" },
];
import Image from "next/image"
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-[4.5rem] lg:px-8">
      <a
  href="#"
  className="flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-900"
>
  <Image
    src="/WhatsApp Image 2026-05-28 at 10.12.08 PM.jpeg"
    alt="Venora Logo"
    width={38}
    height={38}
  />

  <span>Venora</span>
</a>

        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Sign in
          </a>
          <a
            href="#venues"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-700 hover:shadow-lg"
          >
            List your venue
          </a>
        </div>

        <details className="relative md:hidden">
          <summary className="list-none cursor-pointer rounded-lg p-2 transition-colors hover:bg-neutral-100 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-neutral-100" />
            <a
              href="#"
              className="block rounded-xl px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Sign in
            </a>
            <a
              href="#venues"
              className="mt-1 block rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white"
            >
              List your venue
            </a>
          </div>
        </details>
      </nav>
    </header>
  );
}
