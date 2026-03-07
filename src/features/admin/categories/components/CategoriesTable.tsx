import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal, GripVertical } from "lucide-react";
import type { Category } from "@/features/menu";

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <GripVertical className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No categories found</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Get started by creating your first menu category.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 p-2"></TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Sort Order</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className={`hover:bg-muted/30 transition-colors ${!category.isActive ? "opacity-60" : ""}`}
            >
              <TableCell className="p-2 text-center">
                <div className="flex items-center justify-center h-10 w-10">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                </div>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {category.name}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                {category.description || "—"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="font-mono">
                  {category.sortOrder}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => onEdit(category)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
