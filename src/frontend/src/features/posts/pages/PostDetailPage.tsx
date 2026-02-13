import { useParams, Link } from '@tanstack/react-router';
import { useGetPostById } from '@/hooks/useQueries';
import { Calendar, Building2, ExternalLink, Tag, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Seo from '@/components/seo/Seo';
import { formatPostType, formatFullDate } from '../utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: post, isLoading } = useGetPostById(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  const description = post.eligibility
    ? post.eligibility.slice(0, 160)
    : `${post.examPostName} - ${post.organization}`;

  return (
    <>
      <Seo title={`${post.title} | SarkariForm`} description={description} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-3">
            {formatPostType(post.postType)}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{post.organization}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Updated: {formatFullDate(post.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam/Post Name</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{post.examPostName}</p>
            </CardContent>
          </Card>

          {post.importantDates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {post.importantDates.map((date, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <span className="font-medium">{date.key}</span>
                      <span className="text-muted-foreground text-right">{date.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {post.eligibility && (
            <Card>
              <CardHeader>
                <CardTitle>Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.eligibility}</p>
              </CardContent>
            </Card>
          )}

          {post.applicationFee && (
            <Card>
              <CardHeader>
                <CardTitle>Application Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.applicationFee}</p>
              </CardContent>
            </Card>
          )}

          {post.ageLimit && (
            <Card>
              <CardHeader>
                <CardTitle>Age Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.ageLimit}</p>
              </CardContent>
            </Card>
          )}

          {post.vacancyDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Vacancy/Selection Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.vacancyDetails}</p>
              </CardContent>
            </Card>
          )}

          {post.officialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Official Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {post.officialLinks.map((link, idx) => (
                    <div key={idx}>
                      <a
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {link.key}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {post.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Posted: {formatFullDate(post.createdAt)}</p>
            <p>Last Updated: {formatFullDate(post.updatedAt)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
