export const getProducts = async (id = null) => {
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

export const getProductDetails = async (id) => {
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
