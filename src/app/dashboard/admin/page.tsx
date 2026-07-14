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
import { getUsers, getProducts, getAllOrders } from "@/lib/fetch";
import Spinner from "@/components/Spinner";

interface Order {
  price: number;
  paid: boolean;
  status: string;
}

interface Product {
  status: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Dog: "#f59e0b",
  Cat: "#3b82f6",
  Food: "#10b981",
  Accessory: "#a855f7",
};

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [pendingProductCount, setPendingProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState<
    { status: string; count: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          getUsers(),
          getProducts(),
          getAllOrders(),
        ]);

        setUserCount(users.length);
        setProductCount(products.length);
        setPendingProductCount(
          products.filter((p: Product) => p.status === "pending").length,
        );
        setOrderCount(orders.length);
        setTotalRevenue(
          orders
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
        console.error("Failed to load admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const stats = [
    {
      label: "Total Users",
      value: userCount,
      href: "/dashboard/admin/users",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Products",
      value: productCount,
      href: "/dashboard/admin/products",
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pending Products",
      value: pendingProductCount,
      href: "/dashboard/admin/products",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Total Orders",
      value: orderCount,
      href: "/dashboard/admin/orders",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      href: "/dashboard/admin/orders",
      color: "bg-green-50 text-green-700",
    },
  ];

  return (
    <div className="text-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
          Admin Overview
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Platform-wide stats for PetPulse
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
            Orders by Status
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
            Products by Category
          </h3>
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
        </div>
      </div>
    </div>
  );
}
