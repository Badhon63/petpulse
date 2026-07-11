"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface PetItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
}

export default function ManageItems({ items }: { items: PetItem[] }) {
  const { data: session, isPending } = authClient.useSession();

  const handleDelete = (id: string, title: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (confirmDelete) {
      console.log("Delete item:", id);
      alert("Item deleted successfully!");
    }
  };

  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 grow text-gray-800 text-center text-xs">
        Checking your session...
      </div>
    );
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
            You need to be logged in to manage your listings.
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
              Manage Your Listings
            </h1>
            <p className="text-gray-400 text-xs mt-1">
              Update or delete items you have listed on PetPulse
            </p>
          </div>

          <Link
            href="/items/add"
            className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition"
          >
            Add Product +
          </Link>
        </div>

        {items?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 font-medium">
                {items.map((pet) => (
                  <tr key={pet._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">{pet.title}</td>

                    <td className="p-4 text-gray-500">{pet.category}</td>

                    <td className="p-4 font-semibold text-amber-600">
                      ${pet.price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          pet.status?.toLowerCase() === "approved"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(pet._id, pet.title)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition"
                      >
                        Delete
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
              You haven&apos;t listed any items yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
