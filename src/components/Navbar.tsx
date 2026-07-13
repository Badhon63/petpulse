// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-amber-600 flex items-center gap-1"
          >
            PetPulse 🐾
          </Link>

          <div className="flex items-center space-x-6 font-semibold text-sm text-gray-700">
            <Link href="/" className="hover:text-amber-600 transition">
              Home
            </Link>
            <Link href="/explore" className="hover:text-amber-600 transition">
              Explore
            </Link>
            <Link href="/about" className="hover:text-amber-600 transition">
              About
            </Link>{" "}
            {session ? (
              <>
                <Link
                  href="/items/manage"
                  className="hover:text-amber-600 transition"
                >
                  My Products
                </Link>

                <Link
                  href="/orders/mine"
                  className="hover:text-amber-600 transition"
                >
                  My Orders
                </Link>

                <Link
                  href="/orders/received"
                  className="hover:text-amber-600 transition"
                >
                  Manage Orders
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
                    className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
