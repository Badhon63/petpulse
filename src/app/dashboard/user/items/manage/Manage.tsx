"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions";
import { Slide, toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface PetItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
}

export default function ManageItems({ items }: { items: PetItem[] }) {
  const [pendingDelete, setPendingDelete] = useState<PetItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(pendingDelete._id);
      toast.success(`"${pendingDelete.title}" deleted successfully!`, {
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
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.", {
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
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 grow text-gray-800">
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
            href="/dashboard/user/items/add"
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

                    <td className="p-4 text-center space-x-2">
                      <Link
                        href={`/explore/${pet._id}`}
                        className="bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setPendingDelete(pet)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
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

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-gray-950">
              Delete &quot;{pendingDelete.title}&quot;?
            </h2>
            <p className="text-gray-400 text-xs mt-2 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
