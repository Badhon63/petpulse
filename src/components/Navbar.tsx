// src/components/Navbar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Slide, toast } from "react-toastify";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsMenuOpen(false);
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
    router.push("/");
    router.refresh();
  };

  const dashboardHref =
    session?.user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user";

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-amber-600 flex items-center gap-1"
            onClick={() => setIsMenuOpen(false)}
          >
            PetPulse 🐾
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6 font-semibold text-sm text-gray-700">
            <Link href="/" className="hover:text-amber-600 transition">
              Home
            </Link>
            <Link href="/explore" className="hover:text-amber-600 transition">
              Explore
            </Link>
            <Link href="/about" className="hover:text-amber-600 transition">
              About
            </Link>

            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  className="hover:text-amber-600 transition"
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className="hover:text-amber-600 transition"
                >
                  Profile
                </Link>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg uppercase">
                    {session.user.name?.charAt(0) ?? "U"}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-1">
                <Link
                  href="/login"
                  className="border border-amber-500 text-amber-600 px-4 py-1.75 rounded-xl hover:bg-amber-500 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="border border-amber-500 bg-amber-500 text-white px-4 py-1.75 rounded-xl hover:bg-amber-600 hover:border-amber-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1 font-semibold text-sm text-gray-700">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition"
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition"
            >
              Explore
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition"
            >
              About
            </Link>

            {session ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-gray-50 hover:text-amber-600 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="mx-3 mt-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition cursor-pointer text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mx-3 mt-2 bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
