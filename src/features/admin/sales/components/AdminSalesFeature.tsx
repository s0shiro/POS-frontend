import { useState } from "react";
import {
  useSalesSummary,
  useSalesTransactions,
  useReprintReceipt,
} from "@/features/sales/api/useSales";
import { toast } from "sonner";
import { format } from "date-fns";
import { BarChart3 } from "lucide-react";
import { SummaryCards } from "./SummaryCards";
import { CashierBreakdownTable } from "./CashierBreakdownTable";
import { DateSelector } from "./DateSelector";
import { TransactionsTable } from "./TransactionsTable";

export function AdminSalesFeature() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedCashier, setSelectedCashier] = useState<string>("all");
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 15;

  const { data: summaryData, isLoading: summaryLoading } =
    useSalesSummary(selectedDate);

  const { data: txData, isLoading: txLoading } = useSalesTransactions(
    selectedDate,
    selectedCashier === "all" ? undefined : selectedCashier,
  );

  const reprintMutation = useReprintReceipt();

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(format(date, "yyyy-MM-dd"));
      setTxPage(1);
    }
  };

  const handleCashierChange = (value: string) => {
    setSelectedCashier(value);
    setTxPage(1);
  };

  const handleReprint = (orderId: string) => {
    reprintMutation.mutate(orderId, {
      onSuccess: (data) => {
        toast.success(data.message || "Receipt sent to printer");
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to reprint receipt");
      },
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sales Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor daily revenue and staff performance statistics
            </p>
          </div>
        </div>
        {/* Date picker */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} isLoading={summaryLoading} />

      {/* Cashier Breakdown */}
      <CashierBreakdownTable summary={summary} />

      {/* Transactions */}
      <TransactionsTable
        transactions={transactions}
        summary={summary}
        selectedCashier={selectedCashier}
        onCashierChange={handleCashierChange}
        currentPage={txPage}
        totalPages={totalTxPages}
        onPageChange={setTxPage}
        paginatedTransactions={paginatedTx}
        onReprint={handleReprint}
        isReprinting={reprintMutation.isPending}
        isLoading={txLoading}
      />
    </div>
  );
}
