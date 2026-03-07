const API_URL = import.meta.env.VITE_API_URL || "";

/** Resolve a menu item image path to a full URL */
export function getImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith("/uploads/")) return `${API_URL}${image}`;
  return image;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}

export async function fetchWithFormData(
  url: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: "include",
    // Do NOT set Content-Type — browser sets it with boundary for FormData
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(
      errorData.error ||
        errorData.message ||
        `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}
