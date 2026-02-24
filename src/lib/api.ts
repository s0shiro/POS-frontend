const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/** Resolve a menu item image path to a full URL */
export function getImageUrl(image: string | null | undefined): string | null {
  if (!image) return null;
  if (image.startsWith("/uploads/")) return `${API_URL}${image}`;
  return image;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
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

async function fetchWithFormData(url: string, options: RequestInit = {}) {
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

// Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Modifier {
  id: string;
  menuItemId: string;
  name: string;
  priceAdjustment: string;
  isRequired: boolean;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: string;
  image?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  modifiers?: Modifier[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  priceAtTime: string;
  notes?: string;
  selectedModifiers?: { id: string; name: string; price: number }[];
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  tableNumber?: string;
  userId?: string;
  status: "pending" | "preparing" | "ready" | "completed" | "canceled";
  type: "dine_in" | "takeaway" | "delivery";
  isPaid: boolean;
  totalAmount: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  tableId?: string;
  tableNumber?: string;
  type: "dine_in" | "takeaway" | "delivery";
  items: {
    menuItemId: string;
    quantity: number;
    notes?: string;
    selectedModifiers?: { id: string; name?: string; price?: number }[];
  }[];
  notes?: string;
}

export interface CreatePaymentPayload {
  method: "cash" | "card" | "digital_wallet";
  discount?: number;
  discountType?: "fixed" | "percentage";
  tax?: number;
  serviceCharge?: number;
  receivedAmount?: number;
}

// Categories API
export interface CreateCategoryPayload {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const categoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    return fetchWithAuth("/api/menu/categories");
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; data: Category }> => {
    return fetchWithAuth(`/api/menu/categories/${id}`);
  },

  create: async (
    data: CreateCategoryPayload,
  ): Promise<{ success: boolean; data: Category }> => {
    return fetchWithAuth("/api/menu/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: UpdateCategoryPayload,
  ): Promise<{ success: boolean; data: Category }> => {
    return fetchWithAuth(`/api/menu/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/api/menu/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Menu Items API
export interface CreateMenuItemPayload {
  categoryId: string;
  name: string;
  description?: string;
  price: string;
  imageFile?: File;
  isAvailable?: boolean;
}

export interface UpdateMenuItemPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: string;
  imageFile?: File;
  isAvailable?: boolean;
}

export interface CreateModifierPayload {
  name: string;
  priceAdjustment?: string;
  isRequired?: boolean;
}

export const menuItemsApi = {
  getAll: async (params?: {
    categoryId?: string;
    isAvailable?: boolean;
  }): Promise<{ success: boolean; data: MenuItem[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
    if (params?.isAvailable !== undefined)
      searchParams.set("isAvailable", String(params.isAvailable));

    const query = searchParams.toString();
    return fetchWithAuth(`/api/menu/items${query ? `?${query}` : ""}`);
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; data: MenuItem }> => {
    return fetchWithAuth(`/api/menu/items/${id}`);
  },

  create: async (
    data: CreateMenuItemPayload,
  ): Promise<{ success: boolean; data: MenuItem }> => {
    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("price", data.price);
    if (data.imageFile) formData.append("image", data.imageFile);
    if (data.isAvailable !== undefined)
      formData.append("isAvailable", String(data.isAvailable));
    return fetchWithFormData("/api/menu/items", {
      method: "POST",
      body: formData,
    });
  },

  update: async (
    id: string,
    data: UpdateMenuItemPayload,
  ): Promise<{ success: boolean; data: MenuItem }> => {
    const formData = new FormData();
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.name) formData.append("name", data.name);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.price) formData.append("price", data.price);
    if (data.imageFile) formData.append("image", data.imageFile);
    if (data.isAvailable !== undefined)
      formData.append("isAvailable", String(data.isAvailable));
    return fetchWithFormData(`/api/menu/items/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  delete: async (
    id: string,
  ): Promise<{ success: boolean; message?: string; archived?: boolean }> => {
    return fetchWithAuth(`/api/menu/items/${id}`, {
      method: "DELETE",
    });
  },

  // Modifier operations
  createModifier: async (
    menuItemId: string,
    data: CreateModifierPayload,
  ): Promise<{ success: boolean; data: Modifier }> => {
    return fetchWithAuth(`/api/menu/items/${menuItemId}/modifiers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteModifier: async (
    menuItemId: string,
    modifierId: string,
  ): Promise<{ success: boolean }> => {
    return fetchWithAuth(
      `/api/menu/items/${menuItemId}/modifiers/${modifierId}`,
      {
        method: "DELETE",
      },
    );
  },
};

// Orders API
export const ordersApi = {
  getAll: async (params?: {
    status?: string;
    type?: string;
    tableId?: string;
    tableNumber?: string;
    isPaid?: boolean;
  }): Promise<{ success: boolean; data: Order[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.type) searchParams.set("type", params.type);
    if (params?.tableId) searchParams.set("tableId", params.tableId);
    if (params?.tableNumber)
      searchParams.set("tableNumber", params.tableNumber);
    if (params?.isPaid !== undefined)
      searchParams.set("isPaid", String(params.isPaid));

    const query = searchParams.toString();
    return fetchWithAuth(`/api/orders${query ? `?${query}` : ""}`);
  },

  getById: async (id: string): Promise<{ success: boolean; data: Order }> => {
    return fetchWithAuth(`/api/orders/${id}`);
  },

  create: async (
    data: CreateOrderPayload,
  ): Promise<{ success: boolean; data: Order }> => {
    return fetchWithAuth("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<Pick<Order, "type" | "tableId" | "tableNumber" | "notes">>,
  ): Promise<{ success: boolean; data: Order }> => {
    return fetchWithAuth(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (
    id: string,
    status: Order["status"],
  ): Promise<{ success: boolean; data: Order }> => {
    return fetchWithAuth(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  addItem: async (
    orderId: string,
    item: CreateOrderPayload["items"][0],
  ): Promise<{ success: boolean; data: OrderItem }> => {
    return fetchWithAuth(`/api/orders/${orderId}/items`, {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  removeItem: async (
    orderId: string,
    itemId: string,
  ): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/api/orders/${orderId}/items/${itemId}`, {
      method: "DELETE",
    });
  },

  createPayment: async (
    orderId: string,
    data: CreatePaymentPayload,
  ): Promise<{ success: boolean; data: unknown }> => {
    return fetchWithAuth(`/api/orders/${orderId}/payment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getReceipt: async (
    orderId: string,
  ): Promise<{ success: boolean; data: unknown }> => {
    return fetchWithAuth(`/api/orders/${orderId}/receipt`);
  },
};

// KDS Types
export interface KDSOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  type: "dine_in" | "takeaway" | "delivery";
  status: "pending" | "preparing";
  notes?: string;
  createdAt: string;
  elapsedMinutes: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    notes?: string;
    modifiers: { name: string; price: number }[];
  }[];
}

export interface KDSStats {
  pending: number;
  preparing: number;
  ready: number;
  completedToday: number;
}

// KDS API
export const kdsApi = {
  getOrders: async (): Promise<{ success: boolean; data: KDSOrder[] }> => {
    return fetchWithAuth("/api/kds/orders");
  },

  getStats: async (): Promise<{ success: boolean; data: KDSStats }> => {
    return fetchWithAuth("/api/kds/stats");
  },

  startPreparing: async (
    orderId: string,
  ): Promise<{
    success: boolean;
    data: { id: string; orderNumber: string; status: string; message: string };
  }> => {
    return fetchWithAuth(`/api/kds/orders/${orderId}/preparing`, {
      method: "PATCH",
    });
  },

  markReady: async (
    orderId: string,
  ): Promise<{
    success: boolean;
    data: {
      id: string;
      orderNumber: string;
      tableNumber?: string;
      status: string;
      message: string;
    };
  }> => {
    return fetchWithAuth(`/api/kds/orders/${orderId}/ready`, {
      method: "PATCH",
    });
  },
};

// Sales API
export interface CashierSalesSummary {
  cashierId: string;
  cashierName: string;
  totalSales: number;
  totalOrders: number;
}

export interface DailySalesSummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  cashiers: CashierSalesSummary[];
}

export interface SalesTransaction {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  tableNumber: string | null;
  amount: string;
  method: string;
  discount: string | null;
  discountType: string | null;
  tax: string | null;
  serviceCharge: string | null;
  paidAt: string;
  cashierId: string;
  cashierName: string;
}

export const salesApi = {
  getSummary: async (
    date: string,
  ): Promise<{ success: boolean; data: DailySalesSummary }> => {
    return fetchWithAuth(`/api/sales/summary?date=${date}`);
  },

  getTransactions: async (
    date: string,
    cashierId?: string,
  ): Promise<{ success: boolean; data: SalesTransaction[] }> => {
    const params = new URLSearchParams({ date });
    if (cashierId) params.set("cashierId", cashierId);
    return fetchWithAuth(`/api/sales/transactions?${params.toString()}`);
  },

  reprintReceipt: async (
    orderId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return fetchWithAuth(`/api/sales/reprint/${orderId}`, {
      method: "POST",
    });
  },
};
