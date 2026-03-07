import { useState, useMemo } from "react";
import { useCategories, useMenuItems } from "@/features/menu/api/useMenu";
import type { MenuItem } from "@/features/menu/types";
import { MenuItemCard } from "./MenuItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Maximize, Minimize, Lock, Unlock } from "lucide-react";

interface MenuPanelProps {
  isFullscreen: boolean;
  isLocked: boolean;
  onToggleFullscreen: () => void;
  onToggleLock: () => void;
  onAddItem: (item: MenuItem) => void;
}

export function MenuPanel({
  isFullscreen,
  isLocked,
  onToggleFullscreen,
  onToggleLock,
  onAddItem,
}: MenuPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: menuItemsData, isLoading: menuItemsLoading } = useMenuItems({
    isAvailable: true,
  });

  const categories = categoriesData?.data ?? [];

  const filteredItems = useMemo(() => {
    const items = menuItemsData?.data ?? [];
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItemsData?.data, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r">
      {/* Search & Fullscreen Controls */}
      <div className="border-b bg-card p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFullscreen}
            className="bg-background shadow-sm hover:bg-muted"
            title={
              isFullscreen
                ? "Exit fullscreen (locked: click unlock first)"
                : "Enter fullscreen"
            }
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          {isFullscreen && (
            <Button
              variant={isLocked ? "destructive" : "outline"}
              size="icon"
              onClick={onToggleLock}
              className={
                isLocked
                  ? "shadow-sm"
                  : "bg-background shadow-sm hover:bg-muted"
              }
              title={isLocked ? "Unlock fullscreen" : "Lock fullscreen"}
            >
              {isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="border-b bg-card">
        {categoriesLoading ? (
          <div className="flex gap-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24" />
            ))}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap border-none">
            <div className="flex w-max space-x-2 p-4">
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <TabsList className="h-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories
                    .filter((c) => c.isActive)
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))}
                </TabsList>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Menu Grid */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 [&_[data-radix-scroll-area-viewport]]:scroll-smooth">
          {menuItemsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              No items found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-4">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAdd={() => onAddItem(item)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
