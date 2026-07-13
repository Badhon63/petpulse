"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast, Slide } from "react-toastify";
import Spinner from "@/components/Spinner";

const Profile = () => {
  const { data: session, isPending } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    setName(session?.user?.name || "");

    setImage(session?.user?.image || "");

    setIsEditing(true);
  };

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty", {
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
      return;
    }

    setIsSaving(true);
    try {
      await authClient.updateUser({
        name,
        image,
      });
      toast.success("Profile updated successfully!", {
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
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
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return <Spinner />;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 grow">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-400 text-xs mt-2 mb-6">
            You need to be logged in to view your profile.
          </p>
          <Link
            href="/login"
            className="inline-block bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-md mx-auto px-4 py-12 grow text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold text-gray-950 tracking-tight">
          {user.name}
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mt-1">
          {user.email}
          {user.emailVerified && (
            <span className="text-green-600 font-bold">✓ Verified</span>
          )}
        </div>

        <p className="text-gray-400 text-xs mt-3">
          Joined {formatDate(user.createdAt)}
        </p>

        <button
          onClick={startEditing}
          className="mt-6 bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm cursor-pointer"
        >
          Edit Profile
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-950 mb-4">
              Edit Profile
            </h2>

            <label className="block text-xs font-bold text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-4 outline-none focus:border-amber-500"
              placeholder="Your name"
            />

            <label className="block text-xs font-bold text-gray-500 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-6 outline-none focus:border-amber-500"
              placeholder="https://example.com/photo.jpg"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
