"use client";
import React from "react";
import Link from "next/link";
import { PetItem } from "@/types";
import Image from "next/image";

export default function ProductDetails({ pet }: { pet: PetItem }) {
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
              <span>📍 {pet.location}</span>
              <span>⭐ {pet.rating} Rating</span>
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

          <button className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition mt-6">
            Adopt / Purchase Now
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-12">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">
          Key Specifications
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="text-gray-500 block">Health Status</span>
            <span className="font-semibold text-gray-800">
              Vet Checked & Certified
            </span>
          </div>
          <div>
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
