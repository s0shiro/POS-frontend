import type { MenuItem } from "@/features/menu";
import { getImageUrl } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Settings2, UtensilsCrossed } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  categoryName: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onManageModifiers: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  categoryName,
  onEdit,
  onDelete,
  onManageModifiers,
}: MenuItemCardProps) {
  return (
    <Card
      className={`overflow-hidden p-0 gap-0 transition-all hover:shadow-md hover:border-primary/50 flex flex-col group ${
        !item.isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {item.image ? (
          <img
            src={getImageUrl(item.image) || item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute right-2 top-2">
          <Badge
            variant={item.isAvailable ? "default" : "secondary"}
            className="text-[10px] px-2 py-0.5"
          >
            {item.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold line-clamp-1 text-sm leading-tight">
            {item.name}
          </h3>
          <span className="font-bold text-primary text-sm whitespace-nowrap">
            {formatCurrency(parseFloat(item.price))}
          </span>
        </div>

        <Badge variant="outline" className="text-[10px] px-1 py-0 w-fit mb-2">
          {categoryName}
        </Badge>

        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground mb-2 flex-1">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            {item.modifiers && item.modifiers.length > 0 && (
              <Badge variant="outline" className="text-[10px] px-1 py-0">
                {item.modifiers.length} modifier(s)
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onManageModifiers(item);
              }}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
