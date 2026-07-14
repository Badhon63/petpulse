"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getOrders } from "@/lib/fetch";

interface Order {
  _id: string;
  productId: string;
  productTitle: string;
  price: number;
  buyerEmail: string;
  buyerName: string;
  status: string;
  paid: boolean;
  createdAt: string;
}

export default function MyOrders() {
  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrders(session.user.email);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.user?.email]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 grow text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
            My Orders
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Items you have purchased on PetPulse
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            Loading your orders...
          </div>
        ) : orders?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
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
                    <td className="p-4 font-semibold text-amber-600">
                      ${order.price}
                    </td>
                    <td className="p-4 text-gray-500">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-xs">
              You haven&apos;t placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
