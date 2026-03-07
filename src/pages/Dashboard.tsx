import { useAuth } from "@/lib/AuthContext";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  ChefHat,
  Bell,
  FolderTree,
  UtensilsCrossed,
  Monitor,
  ArrowRight,
  Store,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2 bg-gradient-to-br from-primary/10 via-primary/5 to-background border rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-primary/5">
          <Store className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {greeting},{" "}
            <span className="text-primary">
              {user?.name?.split(" ")[0] || user?.email?.split("@")[0]}
            </span>
            !
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome to your restaurant management system. Choose an application
            below to get started. Your role is{" "}
            <span className="capitalize font-semibold text-foreground px-2 py-0.5 bg-muted rounded-md">
              {user?.role}
            </span>
            .
          </p>
        </div>
      </div>

      {/* Main Apps */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight px-1">
          Restaurant Operations
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/cashier" className="block group h-full">
            <Card className="h-full border-2 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 bg-gradient-to-b from-card to-card hover:bg-gradient-to-b hover:from-blue-500/5 dark:hover:from-blue-500/10">
              <CardHeader className="pb-3">
                <div className="mb-4 h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  Cashier POS
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Point of sale system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Take customer orders, modify items, apply discounts, and
                  process payments securely.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/kds" className="block group h-full">
            <Card className="h-full border-2 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 bg-gradient-to-b from-card to-card hover:bg-gradient-to-b hover:from-orange-500/5 dark:hover:from-orange-500/10">
              <CardHeader className="pb-3">
                <div className="mb-4 h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <ChefHat className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  Kitchen Display
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-500" />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Order preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View incoming orders dynamically, update preparation status,
                  and clear ready items.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ready-orders" className="block group h-full">
            <Card className="h-full border-2 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 bg-gradient-to-b from-card to-card hover:bg-gradient-to-b hover:from-emerald-500/5 dark:hover:from-emerald-500/10">
              <CardHeader className="pb-3">
                <div className="mb-4 h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <Bell className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  Ready Orders
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-500" />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Dispatch counter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Call out orders to the display screen, notify customers, and
                  close out completed tickets.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/display" className="block group h-full">
            <Card className="h-full border-2 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 bg-gradient-to-b from-card to-card hover:bg-gradient-to-b hover:from-purple-500/5 dark:hover:from-purple-500/10">
              <CardHeader className="pb-3">
                <div className="mb-4 h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Monitor className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  Customer TV
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-500" />
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Public facing display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Show customers which orders are preparing and ready for pickup
                  on a public TV screen.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold tracking-tight px-1">
            Administration & Management
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/categories" className="block group h-full">
              <Card className="h-full border border-dashed transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <FolderTree className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create, sort, and organize the category folders for your
                    menu.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/menu-items" className="block group h-full">
              <Card className="h-full border border-dashed transition-all hover:border-red-500/50 hover:bg-red-500/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                        <UtensilsCrossed className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">Menu Items</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add or edit menu items, configure prices, modifiers, and
                    images.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
