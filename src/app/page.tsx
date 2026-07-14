// src/app/page.tsx
"use client";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import FeaturedListings from "@/components/FeaturedListings";

// ── Animation variants ──────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const fadeDown = {
  initial: { opacity: 0, y: -40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const fadeLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const fadeRight = {
  initial: { opacity: 0, x: 60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

const zoomFade = {
  initial: { opacity: 0, scale: 1.1 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;

const staggerContainer: Variants = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const staggerItem: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HomePage() {
  return (
    <div className="w-full bg-white text-gray-800">
      {/* ১. HERO SECTION */}
      <section className="relative h-[75vh] sm:h-[65vh] w-full bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <motion.h1
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: { staggerChildren: 0.035, delayChildren: 0.2 },
              },
            }}
            className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md"
            aria-label="Find Your Perfect Furry Companion Today 🐾"
          >
            {"Find Your Perfect Furry Companion Today 🐾"
              .split(" ")
              .map((word, wordIdx, arr) => (
                <span key={wordIdx} className="inline-block whitespace-nowrap">
                  {Array.from(word).map((char, charIdx) => (
                    <motion.span
                      key={charIdx}
                      aria-hidden="true"
                      variants={{
                        initial: { opacity: 0 },
                        animate: {
                          opacity: 1,
                          transition: { duration: 0.5, ease: "easeOut" },
                        },
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordIdx < arr.length - 1 && "\u00A0"}
                </span>
              ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.9 }}
            className="text-lg md:text-xl mb-8 opacity-90"
          >
            Discover premium pet care, certified healthy pets for adoption, and
            high-quality accessories all in one trusted place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="flex justify-center gap-4"
          >
            <Link
              href="/explore"
              className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Browse Pets
            </Link>
            <Link
              href="/about"
              className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-orange-600 transition duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ২. CATEGORIES SECTION — staggered card reveal */}
      <motion.section
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-16 max-w-7xl mx-auto px-4"
      >
        <motion.div variants={staggerItem} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-500 mt-2">Find exactly what your pet needs</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Dogs", "Cats", "Pet Food", "Accessories"].map((cat, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="bg-amber-50 border border-amber-100 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="text-4xl mb-3">
                {["🐶", "🐱", "🍖", "🧸"][idx]}
              </div>
              <h3 className="text-amber-900">{cat}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FEATURED LISTINGS — slide in from left */}
      <motion.div {...fadeLeft}>
        <FeaturedListings />
      </motion.div>

      {/* ৩. STATISTICS SECTION — scale in */}
      <motion.section {...scaleIn} className="py-12 bg-amber-50 w-full">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-amber-600">1,200+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">
              Pets Adopted
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-amber-600">5,000+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">
              Happy Customers
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-amber-600">45+</div>
            <div className="text-sm font-medium text-gray-600 mt-1">
              Verified Breeders
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-amber-600">99.8%</div>
            <div className="text-sm font-medium text-gray-600 mt-1">
              Health Guarantee
            </div>
          </div>
        </div>
      </motion.section>

      {/* ৪. CORE ADVANTAGES SECTION — slide in from right */}
      <motion.section {...fadeRight} className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose PetPulse?
          </h2>
          <p className="text-gray-500 mt-2">
            We set the gold standard for secure and ethical pet rehoming
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="text-amber-500 text-2xl mb-3">🛡️</div>
            <h3 className="font-bold text-xl mb-2">100% Secure Screening</h3>
            <p className="text-gray-600 text-sm">
              Every buyer and breeder undergoes a strict verification process to
              ensure zero scams.
            </p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="text-amber-500 text-2xl mb-3">🩺</div>
            <h3 className="font-bold text-xl mb-2">Vet Checked Profiles</h3>
            <p className="text-gray-600 text-sm">
              All pets listed on our platform come with certified health papers
              and initial vaccine logs.
            </p>
          </div>
          <div className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
            <div className="text-amber-500 text-2xl mb-3">🚚</div>
            <h3 className="font-bold text-xl mb-2">Safe Pet Delivery</h3>
            <p className="text-gray-600 text-sm">
              Specialized air-conditioned pet transport service to deliver your
              new family member safely.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ৫. TESTIMONIALS SECTION — alternating left/right convergence */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeDown} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Heartwarming Stories
            </h2>
            <p className="text-gray-500 mt-2">
              Read feedback from real pet parents
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              {...fadeLeft}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 italic">
                &quot;Adopting Milo through PetPulse was incredibly smooth. The
                health records were clear, and the verification steps gave me
                complete peace of mind.&quot;
              </p>
              <div className="mt-4 font-bold text-gray-900">
                - Sarah Jenkins, Dhaka
              </div>
            </motion.div>
            <motion.div
              {...fadeRight}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <p className="text-gray-600 italic">
                &quot;Finding premium grain-free food for my sensitive Persian
                cat used to be tough. Now I order everything on PetPulse with
                fast 24-hour home delivery.&quot;
              </p>
              <div className="mt-4 font-bold text-gray-900">
                - Ahsan Habib, Mirpur
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ৬. FAQ SECTION — fade up */}
      <motion.section {...fadeUp} className="py-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 mt-2">
            Got questions? We have got answers.
          </p>
        </div>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-bold text-lg text-gray-900 mb-1">
              Are the pets listed here healthy?
            </h4>
            <p className="text-gray-600 text-sm">
              Yes. We require mandatory veterinary health certificate
              submissions before approving any live pet listing on our platform.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-bold text-lg text-gray-900 mb-1">
              How can I pay for accessories?
            </h4>
            <p className="text-gray-600 text-sm">
              We accept all major local payment options including bKash, Nagad,
              credit cards, and Cash on Delivery.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ৭. NEWSLETTER SECTION — zoom fade for a bold closing CTA */}
      <motion.section
        {...zoomFade}
        className="py-16 bg-linear-to-r from-orange-500 to-amber-600 text-white w-full text-center px-4"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Join the PetPulse Family</h2>
          <p className="opacity-90 mb-6 text-sm">
            Subscribe to get weekly pet care tips, training guides, and
            exclusive discount alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-3 rounded-md text-gray-800 w-full sm:w-72 focus:outline-none bg-orange-50"
            />
            <button className="bg-gray-950 hover:bg-gray-900 px-6 py-3 rounded-md font-semibold text-sm transition cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
