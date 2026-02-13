import { useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import { useGetPublishedPosts } from '@/hooks/useQueries';
import PostCard from '../components/PostCard';
import ListFilterBar from '../components/ListFilterBar';
import Seo from '@/components/seo/Seo';
import { useListingQueryParams } from '../hooks/useListingQueryParams';
import { sortPosts, filterPosts, getAvailableYears, getAvailableTags } from '../utils/listingTransforms';
import { formatPostType } from '../utils/formatters';
import type { RecruitmentPostType } from '@/backend';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryPage() {
  const { type } = useParams({ strict: false }) as { type: string };
  const { data: allPosts, isLoading } = useGetPublishedPosts();
  const { params, updateParams } = useListingQueryParams();

  const categoryPosts = useMemo(() => {
    if (!allPosts) return [];
    return allPosts.filter((p) => p.postType === type);
  }, [allPosts, type]);

  const filteredPosts = useMemo(() => {
    let result = filterPosts(categoryPosts, {
      organization: params.organization,
      tag: params.tag,
      year: params.year,
    });
    return sortPosts(result, params.sort);
  }, [categoryPosts, params]);

  const availableYears = useMemo(() => getAvailableYears(categoryPosts), [categoryPosts]);
  const availableTags = useMemo(() => getAvailableTags(categoryPosts), [categoryPosts]);

  const categoryTitle = formatPostType(type as RecruitmentPostType);

  return (
    <>
      <Seo
        title={`${categoryTitle} | SarkariForm`}
        description={`Browse the latest ${categoryTitle.toLowerCase()} notifications for government jobs across India.`}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryTitle}</h1>
          <p className="text-muted-foreground">
            Browse all {categoryTitle.toLowerCase()} notifications
          </p>
        </div>

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
              {categoryPosts.length === 0
                ? `No ${categoryTitle.toLowerCase()} available yet.`
                : 'No posts match your filters. Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
