import { useMemo } from 'react';
import { useGetPublishedPosts } from '@/hooks/useQueries';
import PostCard from '../components/PostCard';
import Seo from '@/components/seo/Seo';
import { sortPosts } from '../utils/listingTransforms';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: posts, isLoading } = useGetPublishedPosts();

  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return sortPosts(posts, 'newest').slice(0, 12);
  }, [posts]);

  return (
    <>
      <Seo
        title="SarkariForm - Latest Government Recruitment Updates"
        description="Get the latest government job notifications, admit cards, results, and answer keys. Your trusted source for sarkari naukri updates."
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Latest Updates</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest government recruitment notifications, admit cards, results, and answer keys.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <PostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
