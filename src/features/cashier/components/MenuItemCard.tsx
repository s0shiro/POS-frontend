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
      className="group cursor-pointer overflow-hidden p-0 gap-0 transition-all duration-300 hover:shadow-xl hover:border-primary hover:-translate-y-1 active:scale-[0.98] flex flex-col bg-card/60 backdrop-blur-sm"
      onClick={onAdd}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/50">
        {item.image ? (
          <img
            src={getImageUrl(item.image) || item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted/80">
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:opacity-0" />
      </div>
      <div className="p-4 flex flex-col flex-1 border-t border-border/10">
        <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground mb-3 flex-1">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex w-full items-center justify-between pt-1">
          <span className="font-black text-foreground text-lg tracking-tight">
            {formatCurrency(parseFloat(item.price))}
          </span>
          {item.modifiers && item.modifiers.length > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-primary/20 text-primary bg-primary/5"
            >
              +Mod
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
