import type { DailySalesSummary } from "@/features/sales";
import { formatCurrency } from "@/lib/currency";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CashierBreakdownTableProps {
  summary: DailySalesSummary | undefined;
}

export function CashierBreakdownTable({ summary }: CashierBreakdownTableProps) {
  if (!summary?.cashiers || summary.cashiers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashier Breakdown</CardTitle>
        <CardDescription>Sales performance by staff member</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cashier</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.cashiers.map((cashier) => (
              <TableRow key={cashier.cashierId}>
                <TableCell className="font-medium">
                  {cashier.cashierName}
                </TableCell>
                <TableCell className="text-right">
                  {cashier.totalOrders}
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {formatCurrency(cashier.totalSales)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
