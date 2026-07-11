// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">PetPulse 🐾</h3>
          <p className="text-sm text-gray-400">Your One-Stop Premium Pet Care & Supplies Marketplace.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Useful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400">Email: support@petpulse.com</p>
          <p className="text-sm text-gray-400">Helpline: +880 123456789</p>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} PetPulse. All rights reserved.
      </div>
    </footer>
  );
}