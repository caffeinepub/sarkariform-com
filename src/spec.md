# Specification

## Summary
**Goal:** Build sarkariform.com for publishing and browsing government recruitment updates (Recruitment Form, Admit Card, Result, Answer Key) with an admin-only publishing workflow.

**Planned changes:**
- Implement a post content model supporting the 4 post types with required fields (title, organization/department, exam/post name, labeled important dates, eligibility, fee, age, vacancy/selection details, labeled official links, status Draft/Published, tags, created/updated timestamps).
- Add admin publishing workflow secured by Internet Identity; restrict create/edit/publish/unpublish/delete to authenticated admins; allow public read of published posts.
- Create public pages: Home (latest across all types), category pages per post type, post detail pages rendering all fields, and a site-wide search page for published posts.
- Add sorting (newest/recently updated) and filtering (organization/department, tags, year) on public listings with URL query parameters.
- Add SEO basics: page titles, meta descriptions, and consistent canonical-like URL structure for categories and posts.
- Apply a cohesive, information-dense visual theme (avoid blue/purple as primary colors).
- Generate and integrate brand assets (logo + favicon) into header and browser tab with consistent brand text (“SarkariForm” / “sarkariform.com”).

**User-visible outcome:** Visitors can browse, search, sort, and filter published recruitment updates and view detailed post pages; admins can sign in with Internet Identity to create, edit, and publish/unpublish posts with drafts hidden from the public.
