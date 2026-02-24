import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { User } from "./lib/auth";

export interface RouterContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  } as RouterContext,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
