import { UtensilsCrossed, Package, Truck } from "lucide-react";

export function CustomerDisplayFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-8 px-8 py-4 text-gray-400">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-blue-400" />
          <span>Dine In - Serve to table</span>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-400" />
          <span>Takeaway - Pickup counter</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-green-400" />
          <span>Delivery - Waiting area</span>
        </div>
      </div>
    </footer>
  );
}
