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
  Users,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  userRole?: string;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  userRole,
}: SidebarProps) {
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
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">POS System</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-6">
            {navSections.map((section) => {
              const filteredItems = filterItemsByRole(section.items);
              if (filteredItems.length === 0) return null;

              return (
                <div key={section.title}>
                  {!collapsed && (
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {filteredItems.map((item) => {
                      const isActive = currentPath === item.href;
                      const Icon = item.icon;

                      const linkContent = (
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            collapsed && "justify-center px-2",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      );

                      if (collapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return <div key={item.href}>{linkContent}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Toggle */}
        <Separator />
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn("w-full", collapsed && "px-2")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
