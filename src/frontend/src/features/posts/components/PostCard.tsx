import { Link } from '@tanstack/react-router';
import { Calendar, Building2, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecruitmentPost } from '@/backend';
import { formatPostType, formatDate } from '../utils/formatters';

interface PostCardProps {
  post: RecruitmentPost;
  showStatus?: boolean;
}

export default function PostCard({ post, showStatus = false }: PostCardProps) {
  return (
    <Link to="/post/$id" params={{ id: post.id.toString() }}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary">{formatPostType(post.postType)}</Badge>
            {showStatus && (
              <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                {post.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{post.organization}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Updated {formatDate(post.updatedAt)}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Tag className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
