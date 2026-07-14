"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/fetch";
import { updateOrderStatus } from "@/lib/actions";
import { toast, Slide } from "react-toastify";
import Spinner from "@/components/Spinner";

interface Order {
  _id: string;
  productTitle: string;
  price: number;
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  status: string;
  paid: boolean;
  createdAt: string;
}

const toastOptions = {
  position: "bottom-right" as const,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light" as const,
  transition: Slide,
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleToggleStatus = async (order: Order) => {
    const newStatus = order.status === "delivered" ? "pending" : "delivered";
    setActionId(order._id);
    try {
      await updateOrderStatus(order._id, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: newStatus } : o,
        ),
      );
      toast.success(`Order marked as ${newStatus}`, toastOptions);
    } catch (error) {
      toast.error("Failed to update order. Please try again.", toastOptions);
    } finally {
      setActionId(null);
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
            Manage Orders
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            All orders placed across PetPulse
          </p>
        </div>

        {orders?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Product</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Payment</th>
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
                    <td className="p-4 font-bold text-gray-900 text-nowrap">
                      {order.productTitle}
                    </td>
                    <td className="p-4 text-gray-500 text-nowrap">
                      {order.buyerName || order.buyerEmail}
                    </td>
                    <td className="p-4 text-gray-500">{order.sellerEmail}</td>
                    <td className="p-4 font-semibold text-amber-600">
                      ${order.price}
                    </td>
                    <td className="p-4 text-gray-500 text-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.paid
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.paid ? "Paid" : "Unpaid"}
                      </span>
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
                        onClick={() => handleToggleStatus(order)}
                        disabled={actionId === order._id}
                        className={`px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer text-nowrap ${
                          order.status === "delivered"
                            ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-600 hover:text-white"
                            : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white"
                        }`}
                      >
                        {actionId === order._id
                          ? "..."
                          : order.status === "delivered"
                            ? "Set Pending"
                            : "Set Delivered"}
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
              No orders found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
