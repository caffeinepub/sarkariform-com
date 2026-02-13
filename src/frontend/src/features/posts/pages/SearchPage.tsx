import { useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useGetPublishedPosts } from '@/hooks/useQueries';
import PostCard from '../components/PostCard';
import ListFilterBar from '../components/ListFilterBar';
import Seo from '@/components/seo/Seo';
import { useListingQueryParams } from '../hooks/useListingQueryParams';
import { sortPosts, filterPosts, getAvailableYears, getAvailableTags, searchPosts } from '../utils/listingTransforms';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const search = useSearch({ strict: false }) as { q?: string };
  const query = search.q || '';
  const { data: allPosts, isLoading } = useGetPublishedPosts();
  const { params, updateParams } = useListingQueryParams();

  const searchResults = useMemo(() => {
    if (!allPosts) return [];
    return searchPosts(allPosts, query);
  }, [allPosts, query]);

  const filteredPosts = useMemo(() => {
    let result = filterPosts(searchResults, {
      organization: params.organization,
      tag: params.tag,
      year: params.year,
    });
    return sortPosts(result, params.sort);
  }, [searchResults, params]);

  const availableYears = useMemo(() => getAvailableYears(searchResults), [searchResults]);
  const availableTags = useMemo(() => getAvailableTags(searchResults), [searchResults]);

  const pageTitle = query ? `Search: ${query} | SarkariForm` : 'Search | SarkariForm';
  const pageDescription = query
    ? `Search results for "${query}" - Government recruitment notifications`
    : 'Search government recruitment notifications, admit cards, results, and answer keys';

  return (
    <>
      <Seo title={pageTitle} description={pageDescription} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search'}
          </h1>
          <p className="text-muted-foreground">
            {query
              ? `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''}`
              : 'Enter a search query to find posts'}
          </p>
        </div>

        {query && (
          <>
            <div className="mb-6">
              <ListFilterBar
                sort={params.sort}
                onSortChange={(sort) => updateParams({ sort })}
                organization={params.organization}
                onOrganizationChange={(organization) => updateParams({ organization })}
                tag={params.tag}
                onTagChange={(tag) => updateParams({ tag })}
                year={params.year}
                onYearChange={(year) => updateParams({ year })}
                availableYears={availableYears}
                availableTags={availableTags}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  No posts found matching your search. Try different keywords or adjust your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id.toString()} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
