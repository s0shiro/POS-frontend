const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
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
export const categoriesApi = {
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    return fetchWithAuth("/api/menu/categories");
  },

  getById: async (
    id: string,
  ): Promise<{ success: boolean; data: Category }> => {
    return fetchWithAuth(`/api/menu/categories/${id}`);
  },
};

// Menu Items API
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
