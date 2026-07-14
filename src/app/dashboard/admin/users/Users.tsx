"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "@/lib/fetch";
import { banUser, deleteUser } from "@/lib/actions";
import { toast, Slide } from "react-toastify";
import Spinner from "@/components/Spinner";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  banned?: boolean;
  createdAt: string;
}

const toastOptions = {
  position: "bottom-right" as const,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light" as const,
  transition: Slide,
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBan = async (user: User) => {
    setActionId(user._id);
    try {
      await banUser(user._id, !user.banned);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, banned: !user.banned } : u,
        ),
      );
      toast.success(
        user.banned ? "User unbanned" : "User banned",
        toastOptions,
      );
    } catch (error) {
      toast.error("Failed to update user. Please try again.", toastOptions);
    } finally {
      setActionId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(pendingDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== pendingDelete._id));
      toast.success(
        `"${pendingDelete.name}" deleted successfully!`,
        toastOptions,
      );
    } catch (error) {
      toast.error("Failed to delete user. Please try again.", toastOptions);
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="text-gray-800">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight">
            Manage Users
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            All registered users on PetPulse
          </p>
        </div>

        {users?.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">{user.name}</td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4 text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.banned
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleToggleBan(user)}
                        disabled={actionId === user._id}
                        className="bg-yellow-50 text-yellow-700 hover:bg-yellow-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-50 cursor-pointer"
                      >
                        {actionId === user._id
                          ? "..."
                          : user.banned
                            ? "Unban"
                            : "Ban"}
                      </button>
                      <button
                        onClick={() => setPendingDelete(user)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-xs">No users found.</p>
          </div>
        )}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl max-w-sm w-full text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-gray-950">
              Delete &quot;{pendingDelete.name}&quot;?
            </h2>
            <p className="text-gray-400 text-xs mt-2 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
