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
