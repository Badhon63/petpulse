
"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const adoptionData = [
  { month: 'Jan', adoptions: 45 },
  { month: 'Feb', adoptions: 60 },
  { month: 'Mar', adoptions: 75 },
  { month: 'Apr', adoptions: 90 },
  { month: 'May', adoptions: 120 },
  { month: 'Jun', adoptions: 110 },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grow text-gray-800">
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-4 tracking-tight">About PetPulse</h1>
        <p className="text-gray-600 leading-relaxed text-sm">
          Founded in 2026, PetPulse is committed to raising the standard of pet rehoming and care. We connect loving families with verified breeders and healthy, rescue-ready pets through transparent and secure technology.
        </p>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-amber-500 text-3xl mb-3">🩺</div>
          <h3 className="font-bold text-base text-gray-950 mb-2">Health First</h3>
          <p className="text-gray-500 text-xs leading-relaxed">We strictly enforce 100% veterinary checkups for all animal profiles before they hit our platform.</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-amber-500 text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-base text-gray-950 mb-2">Zero Fraud</h3>
          <p className="text-gray-500 text-xs leading-relaxed">Our rigorous multi-step breeder background checks eliminate standard online marketplace scams completely.</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <div className="text-amber-500 text-3xl mb-3">🌱</div>
          <h3 className="font-bold text-base text-gray-950 mb-2">Lifetime Support</h3>
          <p className="text-gray-500 text-xs leading-relaxed">We offer structural guidance, premium dietary plans, and active customer care for every new pet parent.</p>
        </div>
      </div>

      
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-950">Platform Growth & Impact</h3>
          <p className="text-xs text-gray-400">Total number of verified pet adoptions processed monthly in 2026.</p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adoptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
             
              <Bar dataKey="adoptions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}