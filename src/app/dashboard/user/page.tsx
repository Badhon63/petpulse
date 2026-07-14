"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getMyProducts, getOrders, getReceivedOrders } from "@/lib/fetch";
import Spinner from "@/components/Spinner";

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadStats = async () => {
      try {
        const [products, orders, received] = await Promise.all([
          getMyProducts(session.user.email),
          getOrders(session.user.email),
          getReceivedOrders(session.user.email),
        ]);

        setProductCount(products.length);
        setOrderCount(orders.length);
        setReceivedCount(received.length);
        setTotalPaid(
          orders
            .filter((o: { paid: boolean }) => o.paid)
            .reduce((sum: number, o: { price: number }) => sum + o.price, 0),
        );
        setTotalEarned(
          received
            .filter((o: { paid: boolean }) => o.paid)
            .reduce((sum: number, o: { price: number }) => sum + o.price, 0),
        );
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [session?.user?.email]);

  if (isLoading) {
    return <Spinner />;
  }

  const stats = [
    {
      label: "My Products",
      value: productCount,
      href: "/dashboard/user/items/manage",
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Bought Products",
      value: orderCount,
      href: "/dashboard/user/orders/mine",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Received Orders",
      value: receivedCount,
      href: "/dashboard/user/orders/received",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Total Paid",
      value: `$${totalPaid.toFixed(2)}`,
      href: "/dashboard/user/payments",
      color: "bg-rose-50 text-rose-700",
    },
    {
      label: "Total Earned",
      value: `$${totalEarned.toFixed(2)}`,
      href: "/dashboard/user/orders/received",
      color: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="text-gray-800 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Here&apos;s a quick overview of your PetPulse activity
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div
              className={`w-fit px-2.5 py-1 rounded-full text-[10px] font-bold mb-3 ${stat.color}`}
            >
              {stat.label}
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
