"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/fetch";
import { updateProductStatus, deleteProduct } from "@/lib/actions";
import { toast, Slide } from "react-toastify";
import Spinner from "@/components/Spinner";
import { MdDelete } from "react-icons/md";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  createdBy: string;
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === "active" ? "pending" : "active";
    setActionId(product._id);
    try {
      await updateProductStatus(product._id, newStatus);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, status: newStatus } : p,
        ),
      );
      toast.success(`Product marked as ${newStatus}`, toastOptions);
    } catch (error) {
      toast.error("Failed to update status. Please try again.", toastOptions);
    } finally {
      setActionId(null);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(pendingDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== pendingDelete._id));
      toast.success(
        `"${pendingDelete.title}" deleted successfully!`,
        toastOptions,
      );
    } catch (error) {
      toast.error("Failed to delete product. Please try again.", toastOptions);
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
            Manage Products
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            All listings across PetPulse
          </p>
        </div>

        {products?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/50 transition"
                  >
                    <td className="p-4 font-bold text-gray-900">
                      {product.title}
                    </td>
                    <td className="p-4 text-gray-500">{product.category}</td>
                    <td className="p-4 font-semibold text-amber-600">
                      ${product.price}
                    </td>
                    <td className="p-4 text-gray-500">{product.createdBy}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                          product.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-between space-x-2">
                      <div className="space-x-2">
                        <Link
                          href={`/explore/${product._id}`}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product)}
                          disabled={actionId === product._id}
                          className={`px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer min-w-18 ${
                            product.status === "active"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white"
                              : "bg-green-50 text-green-700 hover:bg-green-700 hover:text-white"
                          }`}
                        >
                          {actionId === product._id
                            ? ""
                            : product.status === "active"
                              ? "Set Pending"
                              : "Approve"}
                        </button>
                      </div>
                      <button
                        onClick={() => setPendingDelete(product)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xl px-2 py-1 rounded-lg font-bold transition cursor-pointer"
                      >
                        <MdDelete />
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
              No products found.
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
                onClick={confirmDeleteProduct}
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
