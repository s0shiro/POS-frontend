import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useCustomerDisplaySocket } from "../hooks/useCustomerDisplaySocket";
import { CustomerDisplayHeader } from "./CustomerDisplayHeader";
import { CalledOrderCard } from "./CalledOrderCard";
import { CustomerDisplayFooter } from "./CustomerDisplayFooter";

export function CustomerDisplayFeature() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { calledOrders, isConnected } = useCustomerDisplaySocket();

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <CustomerDisplayHeader
        isConnected={isConnected}
        currentTime={currentTime}
      />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto mb-16">
        {calledOrders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-muted/50 border border-border/50 shadow-inner">
              <Bell className="h-20 w-20 text-muted-foreground/50" />
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-foreground/80">
              Waiting for orders...
            </h2>
            <p className="mt-3 text-xl font-medium text-muted-foreground">
              Your order number will appear here when ready
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {calledOrders.map((order, index) => (
              <CalledOrderCard
                key={order.id}
                order={order}
                isNewest={index === 0}
              />
            ))}
          </div>
        )}
      </main>

      <CustomerDisplayFooter />
    </div>
  );
}
