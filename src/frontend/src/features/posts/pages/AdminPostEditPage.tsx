import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllPosts, useUpdatePost, usePublishPost, useUnpublishPost, useDeletePost } from '@/hooks/useQueries';
import PostEditorForm, { type PostFormData } from '../components/PostEditorForm';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Seo from '@/components/seo/Seo';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPostEditPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGetAllPosts();
  const updatePost = useUpdatePost();
  const publishPost = usePublishPost();
  const unpublishPost = useUnpublishPost();
  const deletePost = useDeletePost();

  const post = posts?.find((p) => p.id.toString() === id);

  const handleSubmit = async (data: PostFormData) => {
    try {
      await updatePost.mutateAsync({ id: BigInt(id), ...data });
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Update post error:', error);
      toast.error('Failed to update post');
      throw error;
    }
  };

  const handlePublish = async () => {
    try {
      if (post?.status === 'published') {
        await unpublishPost.mutateAsync(BigInt(id));
        toast.success('Post unpublished');
      } else {
        await publishPost.mutateAsync(BigInt(id));
        toast.success('Post published');
      }
    } catch (error) {
      toast.error('Failed to update post status');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(BigInt(id));
      toast.success('Post deleted');
      navigate({ to: '/admin' });
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-12 w-1/2 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Button onClick={() => navigate({ to: '/admin' })}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <>
      <Seo title={`Edit: ${post.title} | Admin | SarkariForm`} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
            <p className="text-muted-foreground">Update post details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePublish} className="gap-2">
              {post.status === 'published' ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <PostEditorForm
          initialData={post}
          onSubmit={handleSubmit}
          submitLabel="Update Post"
          isSubmitting={updatePost.isPending}
        />
      </div>
    </>
  );
}
