import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Bell,
  Monitor,
  FolderTree,
  UtensilsCrossed,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Cashier",
        href: "/cashier",
        icon: ShoppingCart,
        roles: ["admin", "cashier"],
      },
      {
        title: "Kitchen Display",
        href: "/kds",
        icon: ChefHat,
        roles: ["admin", "kitchen"],
      },
      {
        title: "Ready Orders",
        href: "/ready-orders",
        icon: Bell,
      },
      {
        title: "Customer Display",
        href: "/display",
        icon: Monitor,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
        roles: ["admin"],
      },
      {
        title: "Menu Items",
        href: "/admin/menu-items",
        icon: UtensilsCrossed,
        roles: ["admin"],
      },
      {
        title: "Sales",
        href: "/admin/sales",
        icon: DollarSign,
        roles: ["admin"],
      },
    ],
  },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string;
}

export function MobileSidebar({
  open,
  onOpenChange,
  userRole,
}: MobileSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const filterItemsByRole = (items: NavItem[]) => {
    if (!userRole) return items;
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="flex h-16 flex-row items-center border-b px-4">
          <SheetTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span>POS System</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {navSections.map((section) => {
              const filteredItems = filterItemsByRole(section.items);
              if (filteredItems.length === 0) return null;

              return (
                <div key={section.title}>
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = currentPath === item.href;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => onOpenChange(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                  {section.title !==
                    navSections[navSections.length - 1].title && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
