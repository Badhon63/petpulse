// src/types/index.ts

export interface PetItem {
  _id: string;
  id?: string;
  title: string;
  image: string;
  category: 'Cat' | 'Dog' | 'Bird' | 'Food' | 'Accessory';
  price: number;
  rating: number;
  location: string;
  shortDescription: string;
  fullDescription: string;
  createdAt: string; // ISO date string
}