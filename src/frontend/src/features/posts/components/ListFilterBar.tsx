import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ListFilterBarProps {
  sort: string;
  onSortChange: (sort: string) => void;
  organization: string;
  onOrganizationChange: (org: string) => void;
  tag: string;
  onTagChange: (tag: string) => void;
  year: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
  availableTags: string[];
}

export default function ListFilterBar({
  sort,
  onSortChange,
  organization,
  onOrganizationChange,
  tag,
  onTagChange,
  year,
  onYearChange,
  availableYears,
  availableTags,
}: ListFilterBarProps) {
  const hasActiveFilters = organization || tag || year;

  const clearFilters = () => {
    onOrganizationChange('');
    onTagChange('');
    onYearChange('');
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            placeholder="Filter by organization"
            value={organization}
            onChange={(e) => onOrganizationChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Select value={tag} onValueChange={onTagChange}>
            <SelectTrigger id="tag">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All tags</SelectItem>
              {availableTags.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select value={year} onValueChange={onYearChange}>
            <SelectTrigger id="year">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All years</SelectItem>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
