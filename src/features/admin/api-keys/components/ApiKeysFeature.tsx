import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, KeyRound } from "lucide-react";
import { ApiKeysTable } from "./ApiKeysTable";
import { CreateApiKeyDialog } from "./CreateApiKeyDialog";
import { ShowKeyDialog } from "./ShowKeyDialog";
import type { ApiKey } from "../types";

export function ApiKeysFeature() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const result = await authClient.apiKey.list();
      console.log("apiKey.list result:", result);
      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch API keys");
      }
      // Depending on better-auth version, it might return { data: { keys: [] } } or just { data: [] }
      const keys = Array.isArray(result.data)
        ? result.data
        : (result.data as any)?.keys || (result.data as any)?.apiKeys || [];
      return keys as ApiKey[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const result = await authClient.apiKey.create({
        name,
        prefix: "pos_",
      });
      if (result.error) {
        throw new Error(result.error.message || "Failed to create API key");
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key created successfully");
      setIsCreateOpen(false);
      setNewKey(data?.key ?? null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const result = await authClient.apiKey.delete({ keyId });
      if (result.error) {
        throw new Error(result.error.message || "Failed to delete API key");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>
              Manage API keys for external services like the print service. API
              keys authenticate via the <code>x-api-key</code> header or
              Socket.IO <code>auth.apiKey</code>.
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </CardHeader>
        <CardContent>
          <ApiKeysTable
            apiKeys={apiKeys}
            isLoading={isLoading}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        </CardContent>
      </Card>

      <CreateApiKeyDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={(name) => createMutation.mutate(name)}
        isPending={createMutation.isPending}
      />

      <ShowKeyDialog apiKey={newKey} onClose={() => setNewKey(null)} />
    </div>
  );
}
