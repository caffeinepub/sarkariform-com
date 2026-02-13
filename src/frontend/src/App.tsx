import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './features/posts/pages/HomePage';
import CategoryPage from './features/posts/pages/CategoryPage';
import PostDetailPage from './features/posts/pages/PostDetailPage';
import SearchPage from './features/posts/pages/SearchPage';
import AdminDashboardPage from './features/posts/pages/AdminDashboardPage';
import AdminPostNewPage from './features/posts/pages/AdminPostNewPage';
import AdminPostEditPage from './features/posts/pages/AdminPostEditPage';
import AdminRoute from './components/auth/AdminRoute';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <ProfileSetupModal />
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$type',
  component: CategoryPage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$id',
  component: PostDetailPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  ),
});

const adminNewPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/post/new',
  component: () => (
    <AdminRoute>
      <AdminPostNewPage />
    </AdminRoute>
  ),
});

const adminEditPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/post/$id',
  component: () => (
    <AdminRoute>
      <AdminPostEditPage />
    </AdminRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  postDetailRoute,
  searchRoute,
  adminDashboardRoute,
  adminNewPostRoute,
  adminEditPostRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
