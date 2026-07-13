"use client";
import React, { useState } from "react";
import Link from "next/link";
import { PetItem } from "@/types";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { deleteProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Slide, toast } from "react-toastify";
import { MdLocationPin, MdStar } from "react-icons/md";

export default function ProductDetails({ pet }: { pet: PetItem }) {
  const { data: session, isPending } = authClient.useSession();
  const [pendingDelete, setPendingDelete] = useState<PetItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const isOwner = session?.user?.email === pet.createdBy;

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
      router.push("/items/manage");
    } catch (error) {
      toast.error("Failed to delete item. Please try again.");
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grow">
      <Link
        href="/explore"
        className="text-sm font-semibold text-amber-600 hover:underline mb-6 inline-block"
      >
        ← Back to Explore
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-12">
        <div className="h-100 w-full rounded-2xl overflow-hidden bg-gray-50">
          <Image
            src={pet.image}
            alt={pet.title}
            className="w-full h-full object-cover"
            width={600}
            height={400}
            loading="eager"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {pet.category}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">
              {pet.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
              <span className="flex gap-1 items-center">
                <MdLocationPin />
                {pet.location}
              </span>
              <span className="flex gap-1 items-center">
                <MdStar className="text-yellow-500" />
                {pet.rating} Rating
              </span>
            </div>

            <p className="text-3xl font-black text-amber-600 mb-6">
              ${pet.price}
            </p>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-bold text-gray-900 mb-2">
                Description & Overview
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {pet.fullDescription}
              </p>
            </div>
          </div>

          {isPending ? (
            <button className="w-full font-bold py-3.5 rounded-xl transition mt-6 cursor-pointer">
              Loading...
            </button>
          ) : isOwner ? (
            <button
              onClick={() => setPendingDelete(pet)}
              disabled={isDeleting}
              className="w-full bg-red-100 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-600 hover:text-white transition mt-6 cursor-pointer active:scale-95"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={() => router.push(`/checkout/${pet._id}`)}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition mt-6"
            >
              Purchase Now
            </button>
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

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">
          Key Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div
            className={`${pet.category !== "Dogs" && pet.category !== "Cats" ? "hidden" : ""} `}
          >
            <span className="text-gray-500 block">Health Status</span>
            <span className="font-semibold text-gray-800">
              Vet Checked & Certified
            </span>
          </div>
          <div
            className={`${pet.category !== "Dogs" && pet.category !== "Cats" ? "hidden" : ""} `}
          >
            <span className="text-gray-500 block">Vaccination</span>
            <span className="font-semibold text-gray-800">Up to Date</span>
          </div>
          <div>
            <span className="text-gray-500 block">Listed Date</span>
            <span className="font-semibold text-gray-800">
              {formatDate(pet.createdAt)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Delivery Available</span>
            <span className="font-semibold text-gray-800">
              Yes (All over BD)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
