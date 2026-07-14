export const getAuthToken = async (): Promise<string | null> => {
  try {
    const res = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.token ?? null;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};
