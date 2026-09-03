import { type DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface IRangePicker {
    dateRange: DateRange | undefined;
    onSelect: (dateRange: DateRange | undefined) => void;
}

export const RangePicker = ({ dateRange, onSelect }: IRangePicker) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {dateRange ? 'Date filters selected' : 'Select date'}
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
