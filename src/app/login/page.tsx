"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Slide, toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Invalid email or password.");
      return;
    }

    toast.success("Login successful!", {
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

  const handleDemoLogin = (role: "user" | "admin") => {
    if (role === "user") {
      setEmail("demo@mail.com");
      setPassword("123456789");
    } else {
      setEmail("admin@example.com");
      setPassword("12345678");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 flex justify-center">
            Welcome Back <span className="hidden sm:block">🐾</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Log in to manage your pets and orders
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-gray-800"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* QUICK DEMO CREDENTIAL BUTTONS (Mandatory UX Feature) */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 text-center uppercase mb-3">
            Testing Credentials (Auto-fill)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin("user")}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
            >
              Demo User
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-amber-600 font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
