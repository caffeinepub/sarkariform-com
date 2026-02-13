import type { RecruitmentPost } from '@/backend';

export function sortPosts(posts: RecruitmentPost[], sortBy: string): RecruitmentPost[] {
  const sorted = [...posts];
  if (sortBy === 'updated') {
    sorted.sort((a, b) => Number(b.updatedAt - a.updatedAt));
  } else {
    // newest (by createdAt)
    sorted.sort((a, b) => Number(b.createdAt - a.createdAt));
  }
  return sorted;
}

export function filterPosts(
  posts: RecruitmentPost[],
  filters: { organization?: string; tag?: string; year?: string }
): RecruitmentPost[] {
  let filtered = posts;

  if (filters.organization) {
    const orgLower = filters.organization.toLowerCase();
    filtered = filtered.filter((p) => p.organization.toLowerCase().includes(orgLower));
  }

  if (filters.tag) {
    filtered = filtered.filter((p) => p.tags.includes(filters.tag!));
  }

  if (filters.year) {
    filtered = filtered.filter((p) => {
      const postYear = new Date(Number(p.createdAt) / 1000000).getFullYear().toString();
      return postYear === filters.year;
    });
  }

  return filtered;
}

export function getAvailableYears(posts: RecruitmentPost[]): string[] {
  const years = new Set<string>();
  posts.forEach((p) => {
    const year = new Date(Number(p.createdAt) / 1000000).getFullYear().toString();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b.localeCompare(a));
}

export function getAvailableTags(posts: RecruitmentPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach((p) => {
    p.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function searchPosts(posts: RecruitmentPost[], query: string): RecruitmentPost[] {
  if (!query.trim()) return posts;

  const queryLower = query.toLowerCase();
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(queryLower) ||
      p.organization.toLowerCase().includes(queryLower) ||
      p.examPostName.toLowerCase().includes(queryLower) ||
      p.tags.some((tag) => tag.toLowerCase().includes(queryLower))
  );
}
