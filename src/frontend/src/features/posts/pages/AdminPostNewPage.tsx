import { useNavigate } from '@tanstack/react-router';
import { useCreatePost } from '@/hooks/useQueries';
import PostEditorForm, { type PostFormData } from '../components/PostEditorForm';
import Seo from '@/components/seo/Seo';
import { toast } from 'sonner';

export default function AdminPostNewPage() {
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    try {
      const id = await createPost.mutateAsync(data);
      toast.success('Post created successfully');
      navigate({ to: '/admin/post/$id', params: { id: id.toString() } });
    } catch (error) {
      console.error('Create post error:', error);
      toast.error('Failed to create post');
      throw error;
    }
  };

  return (
    <>
      <Seo title="Create New Post | Admin | SarkariForm" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">Add a new recruitment notification</p>
        </div>

        <PostEditorForm
          onSubmit={handleSubmit}
          submitLabel="Create Post"
          isSubmitting={createPost.isPending}
        />
      </div>
    </>
  );
}
