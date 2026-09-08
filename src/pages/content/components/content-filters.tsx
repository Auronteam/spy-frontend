import type { DateRange } from 'react-day-picker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MultiSelect } from './multiselect';
import { RangePicker } from './range-picker';
import type { Filters } from '../hooks/useFilters';

interface ContentFiltersProps {
    filters: Filters;
    categoriesOptions: string[];
    countriesOptions: string[];
    onCategoriesChange: (value: string[]) => void;
    onCountriesChange: (value: string[]) => void;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onReset: () => void;
}

export const ContentFilters = ({
    filters,
    categoriesOptions,
    countriesOptions,
    onCategoriesChange,
    onCountriesChange,
    onDateRangeChange,
    onReset,
}: ContentFiltersProps) => (
    <Card className="flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <MultiSelect
                options={categoriesOptions}
                value={filters.categories}
                onChange={onCategoriesChange}
                placeholder="All categories"
                className="w-56"
            />
        </div>
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Country</label>
            <MultiSelect
                options={countriesOptions}
                value={filters.countries}
                onChange={onCountriesChange}
                placeholder="All countries"
                className="w-56"
            />
        </div>
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Date range</label>
            <RangePicker dateRange={filters.createdAt} onSelect={onDateRangeChange} />
        </div>
        <Button variant="outline" className="ml-auto" onClick={onReset}>
            Reset
        </Button>
    </Card>
);
