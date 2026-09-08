import { type DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface RangePickerProps {
    dateRange: DateRange | undefined;
    onSelect: (dateRange: DateRange | undefined) => void;
}

const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const getRangeLabel = (dateRange: DateRange | undefined): string => {
    if (!dateRange?.from) return 'Select date range';
    if (!dateRange.to) return formatDate(dateRange.from);
    return `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}`;
};

export const RangePicker = ({ dateRange, onSelect }: RangePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {getRangeLabel(dateRange)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={onSelect}
                    numberOfMonths={2}
                    className="rounded-lg border shadow-sm"
                />
            </PopoverContent>
        </Popover>
    );
};
