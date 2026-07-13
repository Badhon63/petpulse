"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const userNavItems = [
  { label: "Dashboard", href: "/dashboard/user" },
  { label: "My Products", href: "/dashboard/user/items/manage" },
  { label: "Bought Products", href: "/dashboard/user/orders/mine" },
  { label: "Manage Orders", href: "/dashboard/user/orders/received" },
  { label: "Payments", href: "/dashboard/user/payments" },
];

const adminNavItems = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Manage Users", href: "/dashboard/admin/users" },
  { label: "Manage Products", href: "/dashboard/admin/products" },
  { label: "Manage Orders", href: "/dashboard/admin/orders" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  if (isPending) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 grow flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 grow">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-400 text-xs mt-2 mb-6">
            You need to be logged in to access this page.
          </p>
          <Link
            href="/login"
            className="inline-block bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isUserRoute = pathname.startsWith("/dashboard/user");
  const role = session.user.role;

  const isMismatch =
    (isAdminRoute && role !== "admin") || (isUserRoute && role === "admin");

  if (isMismatch) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 grow">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center">
          <div className="text-4xl mb-3">🚫</div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Access Restricted
          </h1>
          <p className="text-gray-400 text-xs mt-2 mb-6">
            You don&apos;t have permission to view this page.
          </p>
          <Link
            href={role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
            className="inline-block bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm"
          >
            Go to Your Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navItems =
    session?.user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grow flex flex-col md:flex-row gap-6 text-gray-800">
      <aside className="md:w-52 shrink-0 border-r border-black/20 pr-4">
        <div className="md:sticky md:top-24">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                  pathname === item.href
                    ? "bg-amber-500 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
