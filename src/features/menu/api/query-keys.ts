export const categoriesKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesKeys.all, "list"] as const,
  list: (filters?: string) => [...categoriesKeys.lists(), { filters }] as const,
  details: () => [...categoriesKeys.all, "detail"] as const,
  detail: (id: string) => [...categoriesKeys.details(), id] as const,
};

export const menuItemsKeys = {
  all: ["menuItems"] as const,
  lists: () => [...menuItemsKeys.all, "list"] as const,
  list: (filters?: string) => [...menuItemsKeys.lists(), { filters }] as const,
  details: () => [...menuItemsKeys.all, "detail"] as const,
  detail: (id: string) => [...menuItemsKeys.details(), id] as const,
};
