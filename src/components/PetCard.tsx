// src/components/PetCard.tsx
import React from "react";
import Link from "next/link";
import { PetItem } from "@/types";
import Image from "next/image";

interface PetCardProps {
  pet: PetItem;
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
      {/* Card Image */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={pet.image}
          alt={pet.title}
          className="w-full h-full object-cover"
          width={300}
          height={200}
        />
        <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          {pet.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
            {pet.title}
          </h3>
          <p className="text-gray-500 text-xs mb-3 flex items-center">
            📍 {pet.location}
          </p>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {pet.shortDescription}
          </p>
        </div>

        {/* Meta Info & Button */}
        <div>
          <div className="flex justify-between items-center mb-4 border-t border-gray-50 pt-3">
            <span className="text-xl font-extrabold text-amber-600">
              ${pet.price}
            </span>
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              ⭐ {pet.rating}
            </span>
          </div>

          <Link
            href={`/explore/${pet._id}`}
            className="block text-center w-full bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-amber-600 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
