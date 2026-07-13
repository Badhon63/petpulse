"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createProduct } from "@/lib/actions";
import { Slide, toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import Link from "next/link";

export default function AddItemPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [category, setCategory] = useState<
    "" | "Cats" | "Dogs" | "Food" | "Accessory"
  >("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !image ||
      !title ||
      !fullDescription ||
      !price ||
      !rating ||
      !location ||
      !category
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const newProduct = {
      image,
      title,
      fullDescription,
      price: Number(price),
      rating: Number(rating),
      location,
      category,
      status: "pending",
      createdBy: session?.user.email ?? "",
    };

    const result = await createProduct(newProduct);
    if (result.insertedId) {
      toast.success("Product created!", {
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
      router.push("/items/manage");
    }
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
            You need to be logged in to add items.
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add Product 📦
        </h1>
        <p className="text-gray-500 mb-8">
          Fill in the details below to list your product.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Premium Dog Food"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Short Description
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Write a full description..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as
                      | ""
                      | "Cats"
                      | "Dogs"
                      | "Food"
                      | "Accessory",
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
              >
                <option value="">Select Category</option>
                <option value="Dogs">Dogs</option>
                <option value="Cats">Cats</option>
                <option value="Pet Food">Pet Food</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.99"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Rating
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="4.8"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New York, USA"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
