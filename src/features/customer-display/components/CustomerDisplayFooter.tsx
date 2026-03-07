import { UtensilsCrossed, Package, Truck } from "lucide-react";

export function CustomerDisplayFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-xl z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-center gap-12 px-8 py-5 text-base font-bold text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <span>Dine In - Serve to table</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Package className="h-6 w-6" />
          </div>
          <span>Takeaway - Pickup counter</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Truck className="h-6 w-6" />
          </div>
          <span>Delivery - Waiting area</span>
        </div>
      </div>
    </footer>
  );
}
