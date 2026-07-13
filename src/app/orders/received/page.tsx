"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getReceivedOrders } from "@/lib/fetch";
import { updateOrderStatus } from "@/lib/actions";
import { toast, Slide } from "react-toastify";
import Spinner from "@/components/Spinner";

interface Order {
  _id: string;
  productId: string;
  productTitle: string;
  price: number;
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  status: string;
  createdAt: string;
}

export default function ReceivedOrders() {
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchOrders = async () => {
      try {
        const data = await getReceivedOrders(session.user.email);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load received orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.email]);

  const handleMarkDelivered = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, "delivered");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "delivered" } : order,
        ),
      );
      toast.success("Order marked as delivered!", {
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
    } catch (error) {
      toast.error("Failed to update order. Please try again.", {
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
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isPending) {
    return <Spinner />;
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 grow">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-400 text-xs mt-2 mb-6">
            You need to be logged in to view received orders.
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 grow text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
            Received Orders
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Orders placed on items you have listed
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            Loading received orders...
          </div>
        ) : orders?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Product</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition"
                  >
                    <td className="p-4 font-bold text-gray-900">
                      {order.productTitle}
                    </td>
                    <td className="p-4 text-gray-500">
                      {order.buyerName || order.buyerEmail}
                    </td>
                    <td className="p-4 font-semibold text-amber-600">
                      ${order.price}
                    </td>
                    <td className="p-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleMarkDelivered(order._id)}
                        disabled={
                          order.status === "delivered" ||
                          updatingId === order._id
                        }
                        className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-50 disabled:hover:text-green-700 cursor-pointer"
                      >
                        {order.status === "delivered"
                          ? "Delivered"
                          : updatingId === order._id
                            ? "Updating..."
                            : "Mark as Delivered"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-xs">
              You haven&apos;t received any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
