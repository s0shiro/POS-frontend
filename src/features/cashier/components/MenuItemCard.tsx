import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/features/menu/types";
import { getImageUrl } from "@/lib/api-client";
import { formatCurrency } from "@/lib/currency";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: () => void;
}

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <Card
      className="cursor-pointer overflow-hidden p-0 gap-0 transition-all hover:shadow-md hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98] flex flex-col"
      onClick={onAdd}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
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
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold line-clamp-1 text-sm leading-tight mb-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground mb-2 flex-1">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-primary text-sm">
            {formatCurrency(parseFloat(item.price))}
          </span>
          {item.modifiers && item.modifiers.length > 0 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              +Options
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
