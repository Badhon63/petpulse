"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getOrdersAsBuyer, getOrdersAsSeller } from "@/lib/fetch";
import Spinner from "@/components/Spinner";

interface Order {
  _id: string;
  productTitle: string;
  price: number;
  paid: boolean;
  createdAt: string;
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  status: string;
}

type ViewMode = "buyer" | "seller";

export default function PaymentsPage() {
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("buyer");

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data =
          view === "buyer"
            ? await getOrdersAsBuyer(session.user.email)
            : await getOrdersAsSeller(session.user.email);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load payments:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.email, view]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const total = orders
    .filter((o) => o.paid)
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="text-gray-800 sm:p-4">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
              Payments
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              {view === "buyer"
                ? "Your purchase history on PetPulse"
                : "Payments received for your listings"}
            </p>
          </div>
          <div className="flex items-end flex-wrap sm:flex-col-reverse gap-3">
            <div className="bg-gray-100 rounded-xl p-1 flex text-xs font-bold">
              <button
                onClick={() => setView("buyer")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  view === "buyer"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setView("seller")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  view === "seller"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Sales
              </button>
            </div>
            <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold">
              {view === "buyer" ? "Total Paid" : "Total Earned"}: $
              {total.toFixed(2)}
            </div>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : orders?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Product</th>
                  {view === "seller" && <th className="p-4">Buyer</th>}
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-nowrap">Payment Status</th>
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
                    {view === "seller" && (
                      <td className="p-4 text-gray-500 text-nowrap">
                        {order.buyerName || order.buyerEmail}
                      </td>
                    )}
                    <td className="p-4 font-semibold text-amber-600">
                      ${order.price}
                    </td>
                    <td className="p-4 text-gray-500 text-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4 text-center md:text-left">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold${
                          order.paid
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-xs">
              {view === "buyer" ? "No purchases yet." : "No sales yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
