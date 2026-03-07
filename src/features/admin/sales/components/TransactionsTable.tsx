import type { SalesTransaction } from "@/features/sales";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  SearchX,
  Receipt,
} from "lucide-react";
import type { DailySalesSummary } from "@/features/sales";

interface TransactionsTableProps {
  transactions: SalesTransaction[];
  summary: DailySalesSummary | undefined;
  selectedCashier: string;
  onCashierChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginatedTransactions: SalesTransaction[];
  onReprint: (orderId: string) => void;
  isReprinting: boolean;
  isLoading: boolean;
}

const methodLabels: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  digital_wallet: "Digital Wallet",
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function TransactionsTable({
  transactions,
  summary,
  selectedCashier,
  onCashierChange,
  currentPage,
  totalPages,
  onPageChange,
  paginatedTransactions,
  onReprint,
  isReprinting,
  isLoading,
}: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transactions
            </CardTitle>
            <CardDescription>
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""} today
            </CardDescription>
          </div>
          {summary?.cashiers && summary.cashiers.length > 1 && (
            <Select value={selectedCashier} onValueChange={onCashierChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Cashiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cashiers</SelectItem>
                {summary.cashiers.map((cashier) => (
                  <SelectItem key={cashier.cashierId} value={cashier.cashierId}>
                    {cashier.cashierName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <SearchX className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-center">
              No transactions found
              {selectedCashier !== "all" && " for this cashier"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((tx) => (
                <TableRow key={tx.paymentId}>
                  <TableCell className="text-muted-foreground">
                    {formatTime(tx.paidAt)}
                  </TableCell>
                  <TableCell className="font-mono font-medium">
                    {tx.orderNumber}
                  </TableCell>
                  <TableCell>{tx.cashierName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {methodLabels[tx.method] || tx.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(parseFloat(tx.amount))}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReprint(tx.orderId)}
                      disabled={isReprinting}
                      title="Reprint receipt"
                      className="h-8 w-8 p-0"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {transactions.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
