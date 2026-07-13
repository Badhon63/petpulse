// src/types/index.ts

export interface PetItem {
  _id: string;
  id?: string;
  title: string;
  image: string;
  category: "Cats" | "Dogs" | "Food" | "Accessory";
  price: number;
  rating: number;
  location: string;
  fullDescription: string;
  createdAt: string;
  createdBy: string;
  status: string;
}
