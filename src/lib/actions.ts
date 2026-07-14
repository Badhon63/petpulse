import { PetItem } from "@/types";
import { getAuthToken } from "./auth-token";

export const createProduct = async (
  itemData: Omit<PetItem, "_id" | "id" | "createdAt">,
) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(itemData),
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const createOrder = async (orderData: {
  productId: string;
  buyerEmail: string;
  buyerName?: string;
}) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update order status");
    }

    return data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const banUser = async (id: string, banned: boolean) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}/ban`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ banned }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }

    return data;
  } catch (error) {
    console.error("Error updating user ban status:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`,
      {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateProductStatus = async (id: string, status: string) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update product status");
    }

    return data;
  } catch (error) {
    console.error("Error updating product status:", error);
    throw error;
  }
};
