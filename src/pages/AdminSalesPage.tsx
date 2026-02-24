import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  salesApi,
  type CashierSalesSummary,
  type SalesTransaction,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Receipt,
  CalendarIcon,
  Printer,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parse } from "date-fns";

function formatCurrency(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `₱${num.toFixed(2)}`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const methodLabels: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  digital_wallet: "Digital Wallet",
};

export function AdminSalesPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCashier, setSelectedCashier] = useState<string>("all");
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 15;

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["sales-summary", selectedDate],
    queryFn: () => salesApi.getSummary(selectedDate),
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: [
      "sales-transactions",
      selectedDate,
      selectedCashier === "all" ? undefined : selectedCashier,
    ],
    queryFn: () =>
      salesApi.getTransactions(
        selectedDate,
        selectedCashier === "all" ? undefined : selectedCashier,
      ),
  });

  const reprintMutation = useMutation({
    mutationFn: (orderId: string) => salesApi.reprintReceipt(orderId),
    onSuccess: (data) => {
      toast.success(data.message || "Receipt sent to printer");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reprint receipt");
    },
  });

  const summary = summaryData?.data;
  const transactions = txData?.data ?? [];
  const totalTxPages = Math.max(1, Math.ceil(transactions.length / txPerPage));
  const paginatedTx = transactions.slice(
    (txPage - 1) * txPerPage,
    txPage * txPerPage,
  );

  const handleDateChange = (offset: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + offset);
    setSelectedDate(format(d, "yyyy-MM-dd"));
    setTxPage(1);
  };

  const selectedDateObj = parse(selectedDate, "yyyy-MM-dd", new Date());
  const todayObj = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Sales</h1>
          <p className="text-muted-foreground">
            View sales records and cashier performance for auditing
          </p>
        </div>
        {/* Date picker */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDateObj, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDateObj}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(format(date, "yyyy-MM-dd"));
                    setTxPage(1);
                  }
                }}
                disabled={(date) => date > todayObj}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange(1)}
            disabled={selectedDate >= today}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {summaryLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-6 w-24 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(summary?.totalSales ?? 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">
                  {summary?.totalOrders ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cashiers</p>
                <p className="text-2xl font-bold">
                  {summary?.cashiers?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cashier breakdown */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Sales by Cashier</h2>
          {summaryLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : !summary?.cashiers?.length ? (
            <p className="py-8 text-center text-muted-foreground">
              No sales recorded for this date
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cashier</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Total Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.cashiers.map((c: CashierSalesSummary) => (
                  <TableRow key={c.cashierId}>
                    <TableCell className="font-medium">
                      {c.cashierName}
                    </TableCell>
                    <TableCell className="text-right">
                      {c.totalOrders}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(c.totalSales)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Transactions list */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Receipt className="h-5 w-5" />
              Transactions
            </h2>
            <Select
              value={selectedCashier}
              onValueChange={(v) => {
                setSelectedCashier(v);
                setTxPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Cashiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cashiers</SelectItem>
                {summary?.cashiers?.map((c: CashierSalesSummary) => (
                  <SelectItem key={c.cashierId} value={c.cashierId}>
                    {c.cashierName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {txLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : !transactions.length ? (
            <p className="py-8 text-center text-muted-foreground">
              No transactions for this date
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTx.map((tx: SalesTransaction) => (
                      <TableRow key={tx.paymentId}>
                        <TableCell className="font-mono font-medium">
                          {tx.orderNumber}
                        </TableCell>
                        <TableCell>{formatTime(tx.paidAt)}</TableCell>
                        <TableCell>{tx.cashierName}</TableCell>
                        <TableCell>{tx.tableNumber ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {methodLabels[tx.method] ?? tx.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => reprintMutation.mutate(tx.orderId)}
                            disabled={
                              reprintMutation.isPending &&
                              reprintMutation.variables === tx.orderId
                            }
                            title="Reprint receipt"
                          >
                            {reprintMutation.isPending &&
                            reprintMutation.variables === tx.orderId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Printer className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalTxPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(txPage - 1) * txPerPage + 1}–
                    {Math.min(txPage * txPerPage, transactions.length)} of{" "}
                    {transactions.length} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={txPage <= 1}
                      onClick={() => setTxPage((p) => p - 1)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>
                    <span className="text-sm">
                      {txPage} / {totalTxPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={txPage >= totalTxPages}
                      onClick={() => setTxPage((p) => p + 1)}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
