export const getProducts = async (id: string | null = null) => {
  const url = id
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`;

  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return await res.json();
};

export const getMyProducts = async (email: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/mine?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch your products");
  }

  return await res.json();
};

export const getProductDetails = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`;
  const res = await fetch(url, { method: "GET" });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    console.error("Response status:", res.status, res.statusText);
    throw new Error("Failed to fetch product details");
  }

  return await res.json();
};

export const getOrders = async (buyerEmail: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?buyerEmail=${encodeURIComponent(buyerEmail)}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return await res.json();
};

export const getReceivedOrders = async (sellerEmail: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/received?sellerEmail=${encodeURIComponent(sellerEmail)}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch received orders");
  }

  return await res.json();
};

export const getOrdersAsBuyer = async (buyerEmail: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?buyerEmail=${encodeURIComponent(buyerEmail)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
};

export const getOrdersAsSeller = async (sellerEmail: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?sellerEmail=${encodeURIComponent(sellerEmail)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return await res.json();
};
