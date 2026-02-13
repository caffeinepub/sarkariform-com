import { useNavigate, useSearch } from '@tanstack/react-router';

export interface ListingParams {
  sort: string;
  organization: string;
  tag: string;
  year: string;
}

export function useListingQueryParams() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Partial<ListingParams>;

  const params: ListingParams = {
    sort: search.sort || 'newest',
    organization: search.organization || '',
    tag: search.tag || '',
    year: search.year || '',
  };

  const updateParams = (updates: Partial<ListingParams>) => {
    const newParams = { ...params, ...updates };
    // Remove empty values
    const cleanParams = Object.fromEntries(
      Object.entries(newParams).filter(([_, value]) => value !== '')
    );
    navigate({ search: cleanParams as any });
  };

  return { params, updateParams };
}
