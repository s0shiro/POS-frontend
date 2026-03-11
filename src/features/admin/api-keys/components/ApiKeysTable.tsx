import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, KeyRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiKey } from "../types";

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ApiKeysTable({
  apiKeys,
  isLoading,
  onDelete,
  isDeleting,
}: ApiKeysTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const safeApiKeys = Array.isArray(apiKeys) ? apiKeys : [];

  if (safeApiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <KeyRound className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No API keys yet</p>
        <p className="text-sm">
          Create an API key to connect external services.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead className="w-[80px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {safeApiKeys.map((key) => (
          <TableRow key={key.id}>
            <TableCell className="font-medium">
              {key.name || "Unnamed"}
            </TableCell>
            <TableCell>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {key.prefix ? `${key.prefix}` : ""}
                {key.start || "••••••••"}••••
              </code>
            </TableCell>
            <TableCell>
              <Badge variant={key.enabled ? "default" : "secondary"}>
                {key.enabled ? "Active" : "Disabled"}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(key.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {key.expiresAt
                ? new Date(key.expiresAt).toLocaleDateString()
                : "Never"}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(key.id)}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
