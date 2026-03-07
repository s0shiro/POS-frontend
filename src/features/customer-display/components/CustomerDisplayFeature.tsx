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
    <div className="dark min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <CustomerDisplayHeader
        isConnected={isConnected}
        currentTime={currentTime}
      />

      {/* Main content */}
      <main className="p-8">
        {calledOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-800">
              <Bell className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="mt-8 text-3xl font-semibold text-gray-400">
              Waiting for orders...
            </h2>
            <p className="mt-2 text-lg text-gray-500">
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
