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
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/cashier">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Cashier POS
              </CardTitle>
              <CardDescription>
                Take customer orders and process payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access the point of sale system to create new orders, select
                menu items, and complete transactions.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/kds">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                Kitchen Display
              </CardTitle>
              <CardDescription>View and manage incoming orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Kitchen staff can view orders, update preparation status, and
                mark items as ready.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ready-orders">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Ready Orders
              </CardTitle>
              <CardDescription>Manage orders ready for pickup</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Call out orders, notify customers, and mark orders as completed.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/display">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                Customer Display
              </CardTitle>
              <CardDescription>Public order status display</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Show customers which orders are ready for pickup on a public
                screen.
              </p>
            </CardContent>
          </Card>
        </Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin/categories">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-indigo-600" />
                    Categories
                  </CardTitle>
                  <CardDescription>Manage menu categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create and organize categories for your menu items.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/menu-items">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-red-600" />
                    Menu Items
                  </CardTitle>
                  <CardDescription>
                    Manage menu items and modifiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and organize menu items with prices and
                    modifiers.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
