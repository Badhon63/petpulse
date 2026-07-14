"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { getMyProducts, getOrders, getReceivedOrders } from "@/lib/fetch";
import Spinner from "@/components/Spinner";

interface Order {
  price: number;
  paid: boolean;
  status: string;
}

interface Product {
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Dog: "#f59e0b",
  Cat: "#3b82f6",
  Food: "#10b981",
  Accessory: "#a855f7",
};

export default function UserDashboardPage() {
  const { data: session } = authClient.useSession();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState<
    { status: string; count: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);
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
            .filter((o: Order) => o.paid)
            .reduce((sum: number, o: Order) => sum + o.price, 0),
        );
        setTotalEarned(
          received
            .filter((o: Order) => o.paid)
            .reduce((sum: number, o: Order) => sum + o.price, 0),
        );

        const pendingCount = orders.filter(
          (o: Order) => o.status === "pending",
        ).length;
        const deliveredCount = orders.filter(
          (o: Order) => o.status === "delivered",
        ).length;
        setOrderStatusData([
          { status: "Pending", count: pendingCount },
          { status: "Delivered", count: deliveredCount },
        ]);

        const categoryCounts: Record<string, number> = {};
        products.forEach((p: Product) => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });
        setCategoryData(
          Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value,
          })),
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
      label: "My Orders",
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
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Total Earned",
      value: `$${totalEarned.toFixed(2)}`,
      href: "/dashboard/user/orders/received",
      color: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="text-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Here&apos;s a quick overview of your PetPulse activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            My Orders by Status
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            My Products by Category
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-400 text-xs">
              No products listed yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
