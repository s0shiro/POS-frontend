import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (offset: number) => void;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange,
  onDateSelect,
}: DateSelectorProps) {
  const selectedDateObj = parse(selectedDate, "yyyy-MM-dd", new Date());
  const todayObj = new Date();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDateChange(-1)}
        title="Previous day"
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
            {format(selectedDateObj, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDateObj}
            onSelect={onDateSelect}
            initialFocus
            disabled={(date) => date > todayObj}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDateChange(1)}
        disabled={
          format(selectedDateObj, "yyyy-MM-dd") ===
          format(todayObj, "yyyy-MM-dd")
        }
        title="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
