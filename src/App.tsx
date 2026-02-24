import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { AuthProvider } from "./lib/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

function InnerApp({ children }: { children: ReactNode }) {
  return (
    <AuthProvider queryClient={queryClient} router={router}>
      {children}
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} Wrap={InnerApp} />
    </QueryClientProvider>
  );
}

export default App;
