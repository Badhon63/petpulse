"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PetItem } from "@/types";
import { getProducts } from "@/lib/fetch";
import PetCard from "@/components/PetCard";
import Skeleton from "@/components/Skeleton";

export default function FeaturedListings() {
  const [products, setProducts] = useState<PetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const active = data
          .filter((p: PetItem) => p.status === "active")
          .slice(0, 4);
        setProducts(active);
      } catch (error) {
        console.error("Failed to load featured listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Featured Listings
        </h2>
        <p className="text-gray-500 mt-2">
          A glimpse of what&apos;s available right now
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          : products.map((pet, i) => <PetCard key={i} pet={pet} />)}
      </div>

      {!isLoading && products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium text-sm">
            No listings available yet. Check back soon!
          </p>
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/explore"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition font-bold text-sm"
        >
          View All Listings
        </Link>
      </div>
    </section>
  );
}
