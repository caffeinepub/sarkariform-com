import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { RecruitmentPost, RecruitmentPostType, KeyValue, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Role Queries
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Post Queries (Public)
export function useGetPublishedPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecruitmentPost[]>({
    queryKey: ['publishedPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPostById(id: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecruitmentPost | null>({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPostById(BigInt(id));
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetPostsByType(postType: RecruitmentPostType) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecruitmentPost[]>({
    queryKey: ['postsByType', postType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPostsByType(postType);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchPostsByTag(tag: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecruitmentPost[]>({
    queryKey: ['postsByTag', tag],
    queryFn: async () => {
      if (!actor || !tag) return [];
      return actor.searchPostsByTag(tag);
    },
    enabled: !!actor && !actorFetching && !!tag,
  });
}

// Admin Post Queries
export function useGetAllPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecruitmentPost[]>({
    queryKey: ['allPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Post Mutations (Admin)
export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postType: RecruitmentPostType;
      title: string;
      organization: string;
      examPostName: string;
      importantDates: KeyValue[];
      eligibility: string;
      applicationFee: string;
      ageLimit: string;
      vacancyDetails: string;
      officialLinks: KeyValue[];
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(
        data.postType,
        data.title,
        data.organization,
        data.examPostName,
        data.importantDates,
        data.eligibility,
        data.applicationFee,
        data.ageLimit,
        data.vacancyDetails,
        data.officialLinks,
        data.tags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      postType: RecruitmentPostType;
      title: string;
      organization: string;
      examPostName: string;
      importantDates: KeyValue[];
      eligibility: string;
      applicationFee: string;
      ageLimit: string;
      vacancyDetails: string;
      officialLinks: KeyValue[];
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePost(
        data.id,
        data.postType,
        data.title,
        data.organization,
        data.examPostName,
        data.importantDates,
        data.eligibility,
        data.applicationFee,
        data.ageLimit,
        data.vacancyDetails,
        data.officialLinks,
        data.tags
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id.toString()] });
    },
  });
}

export function usePublishPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
    },
  });
}

export function useUnpublishPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['publishedPosts'] });
    },
  });
}
