import { type DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface RangePickerProps {
    id?: string;
    dateRange: DateRange | undefined;
    onSelect: (dateRange: DateRange | undefined) => void;
}

const getRangeLabel = (dateRange: DateRange | undefined): string => {
    if (!dateRange?.from) return 'Select date range';
    if (!dateRange.to) return formatDate(dateRange.from);
    return `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}`;
};

export const RangePicker = ({ id, dateRange, onSelect }: RangePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    {getRangeLabel(dateRange)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={onSelect}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
};
