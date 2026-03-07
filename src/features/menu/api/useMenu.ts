import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys, menuItemsKeys } from "./query-keys";
import * as menuApi from "./menu.api";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  CreateModifierPayload,
} from "../types";

// Categories hooks
export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: () => menuApi.fetchCategories(),
  });
}

export function useCategoryById(id: string) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => menuApi.fetchCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => menuApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      menuApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
    },
  });
}

// Menu Items hooks
export function useMenuItems(params?: {
  categoryId?: string;
  isAvailable?: boolean;
}) {
  return useQuery({
    queryKey: menuItemsKeys.list(JSON.stringify(params)),
    queryFn: () => menuApi.fetchMenuItems(params),
  });
}

export function useMenuItemById(id: string) {
  return useQuery({
    queryKey: menuItemsKeys.detail(id),
    queryFn: () => menuApi.fetchMenuItemById(id),
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMenuItemPayload) => menuApi.createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemsKeys.all });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemPayload }) =>
      menuApi.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemsKeys.all });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuApi.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemsKeys.all });
    },
  });
}

// Modifier hooks
export function useCreateModifier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      menuItemId,
      data,
    }: {
      menuItemId: string;
      data: CreateModifierPayload;
    }) => menuApi.createModifier(menuItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemsKeys.all });
    },
  });
}

export function useDeleteModifier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      menuItemId,
      modifierId,
    }: {
      menuItemId: string;
      modifierId: string;
    }) => menuApi.deleteModifier(menuItemId, modifierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuItemsKeys.all });
    },
  });
}
