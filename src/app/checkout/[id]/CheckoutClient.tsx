"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { toast, Slide } from "react-toastify";
import { PetItem } from "@/types";
import Spinner from "@/components/Spinner";

export default function CheckoutClient({ product }: { product: PetItem }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isPlacing, setIsPlacing] = useState(false);

  const handleConfirmPurchase = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setIsPlacing(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          price: product.price,
          buyerEmail: session.user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Error starting checkout:", error);
      toast.error("Failed to start checkout. Please try again.", {
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
      setIsPlacing(false);
    }
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 grow">
      <h1 className="text-2xl font-bold text-gray-950 tracking-tight mb-6">
        Checkout
      </h1>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
            <Image
              src={product.image}
              alt={product.title}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{product.title}</h2>
            <p className="text-amber-600 font-black text-lg">
              ${product.price}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">
          Buyer Information
        </h3>
        <p className="text-gray-500 text-xs">
          Name:{" "}
          <span className="font-semibold text-gray-800">
            {session?.user?.name}
          </span>
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Email:{" "}
          <span className="font-semibold text-gray-800">
            {session?.user?.email}
          </span>
        </p>
      </div>

      <button
        onClick={handleConfirmPurchase}
        disabled={isPlacing}
        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
      >
        {isPlacing ? "Redirecting to Stripe..." : `Checkout`}
      </button>
    </div>
  );
}
