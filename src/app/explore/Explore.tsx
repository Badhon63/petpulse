"use client";
import React, { useState } from "react";
import { PetItem } from "@/types";
import PetCard from "@/components/PetCard";

export default function Explore({ products }: { products: PetItem[] }) {
  const [search, setSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priceFilter, setPriceFilter] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("default");

  const filteredAndSortedPets = products
    .filter((pet) => {
      const matchesSearch = pet.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || pet.category === categoryFilter;

      let matchesPrice = true;
      if (priceFilter === "under-100") matchesPrice = pet.price < 100;
      else if (priceFilter === "100-500")
        matchesPrice = pet.price >= 100 && pet.price <= 500;
      else if (priceFilter === "over-500") matchesPrice = pet.price > 500;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "price-low-high") return a.price - b.price;
      if (sortOption === "price-high-low") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      return 0; // Default / No sorting
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Explore Pets & Supplies
      </h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Categories</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Food">Pet Food</option>
            <option value="Accessory">Accessories</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Price Range
          </label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="All">Any Price</option>
            <option value="under-100">Under $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="over-500">Over $500</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="default">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filteredAndSortedPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredAndSortedPets.map((pet, i) => (
            <PetCard key={i} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 border border-dashed rounded-2xl">
          <p className="text-gray-500 font-medium">
            No items found matching your filter combinations.
          </p>
        </div>
      )}
    </div>
  );
}
