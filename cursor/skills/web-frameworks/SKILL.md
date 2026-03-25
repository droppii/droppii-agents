---
name: ck:web-frameworks
description: Build with Next.js (App Router, RSC, SSR, ISR), Turborepo monorepos. Use for React apps, server rendering, build optimization, caching strategies, shared dependencies.
license: MIT
version: 1.0.0
argument-hint: "[framework] [feature]"
---

# Web Frameworks Skill Group

Comprehensive guide for building modern full-stack web applications using Next.js, Turborepo, and RemixIcon.

## Overview

This skill group combines three powerful tools for web development:

**Next.js** - React framework with SSR, SSG, RSC, and optimization features
**Turborepo** - High-performance monorepo build system for JavaScript/TypeScript
**RemixIcon** - Icon library with 3,100+ outlined and filled style icons

## When to Use This Skill Group

- Building new full-stack web applications with modern React
- Setting up monorepos with multiple apps and shared packages
- Implementing server-side rendering and static generation
- Optimizing build performance with intelligent caching
- Creating consistent UI with professional iconography
- Managing workspace dependencies across multiple projects
- Deploying production-ready applications with proper optimization

## Stack Selection Guide

### Single Application: Next.js + RemixIcon

Use when building a standalone application:
- E-commerce sites
- Marketing websites
- SaaS applications
- Documentation sites
- Blogs and content platforms

**Setup:**
```bash
npx create-next-app@latest my-app
cd my-app
npm install remixicon
```

### Monorepo: Next.js + Turborepo + RemixIcon

Use when building multiple applications with shared code:
- Microfrontends
- Multi-tenant platforms
- Internal tools with shared component library
- Multiple apps (web, admin, mobile-web) sharing logic
- Design system with documentation site

**Setup:**
```bash
npx create-turbo@latest my-monorepo
# Then configure Next.js apps in apps/ directory
# Install remixicon in shared UI packages
```

### Framework Features Comparison

| Feature | Next.js | Turborepo | RemixIcon |
|---------|---------|-----------|-----------|
| Primary Use | Web framework | Build system | UI icons |
| Best For | SSR/SSG apps | Monorepos | Consistent iconography |
| Performance | Built-in optimization | Caching & parallel tasks | Lightweight fonts/SVG |
| TypeScript | Full support | Full support | Type definitions available |

## Quick Start

### Next.js Application

```bash
# Create new project
npx create-next-app@latest my-app
cd my-app

# Install RemixIcon
npm install remixicon

# Import in layout
# app/layout.tsx
import 'remixicon/fonts/remixicon.css'

# Start development
npm run dev
```

### Turborepo Monorepo

```bash
# Create monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Structure:
# apps/web/          - Next.js application
# apps/docs/         - Documentation site
# packages/ui/       - Shared components with RemixIcon
# packages/config/   - Shared configs
# turbo.json         - Pipeline configuration

# Run all apps
npm run dev

# Build all packages
npm run build
```

### RemixIcon Integration

```tsx
// Webfont (HTML/CSS)
<i className="ri-home-line"></i>
<i className="ri-search-fill ri-2x"></i>

// React component
import { RiHomeLine, RiSearchFill } from "@remixicon/react"
<RiHomeLine size={24} />
<RiSearchFill size={32} color="blue" />
```

## Reference Navigation

**Next.js References:**
- [App Router Architecture](./references/nextjs-app-router.md) - Routing, layouts, pages, parallel routes
- [Server Components](./references/nextjs-server-components.md) - RSC patterns, client vs server, streaming
- [Data Fetching](./references/nextjs-data-fetching.md) - fetch API, caching, revalidation, loading states
- [Optimization](./references/nextjs-optimization.md) - Images, fonts, scripts, bundle analysis, PPR

**Turborepo References:**
- [Setup & Configuration](./references/turborepo-setup.md) - Installation, workspace config, package structure
- [Task Pipelines](./references/turborepo-pipelines.md) - Dependencies, parallel execution, task ordering
- [Caching Strategies](./references/turborepo-caching.md) - Local cache, remote cache, cache invalidation

**RemixIcon References:**
- [Integration Guide](./references/remix-icon-integration.md) - Installation, usage, customization, accessibility

## Common Patterns & Workflows

### Pattern 1: Full-Stack Monorepo

```
my-monorepo/
├── apps/
│   ├── web/              # Customer-facing Next.js app
│   ├── admin/            # Admin dashboard Next.js app
│   └── docs/             # Documentation site
├── packages/
│   ├── ui/               # Shared UI with RemixIcon
│   ├── api-client/       # API client library
│   ├── config/           # ESLint, TypeScript configs
│   └── types/            # Shared TypeScript types
└── turbo.json            # Build pipeline
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### Pattern 2: Shared Component Library

```tsx
// packages/ui/src/button.tsx
import { RiLoader4Line } from "@remixicon/react"

export function Button({ children, loading, icon }) {
  return (
    <button>
      {loading ? <RiLoader4Line className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

// apps/web/app/page.tsx
import { Button } from "@repo/ui/button"
import { RiHomeLine } from "@remixicon/react"

export default function Page() {
  return <Button icon={<RiHomeLine />}>Home</Button>
}
```

### Pattern 3: Optimized Data Fetching

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'

// Static generation at build time
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// Revalidate every hour
async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 }
  })
  if (!res.ok) return null
  return res.json()
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return <article>{post.content}</article>
}
```

### Pattern 4: Monorepo CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: ck:CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npx turbo run build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

## Utility Scripts

Python utilities in `scripts/` directory:

**nextjs-init.py** - Initialize Next.js project with best practices
**turborepo-migrate.py** - Convert existing monorepo to Turborepo

Usage examples:
```bash
# Initialize new Next.js app with TypeScript and recommended setup
python scripts/nextjs-init.py --name my-app --typescript --app-router

# Migrate existing monorepo to Turborepo with dry-run
python scripts/turborepo-migrate.py --path ./my-monorepo --dry-run

# Run tests
cd scripts/tests
pytest
```

## Best Practices

**Next.js:**
- Default to Server Components, use Client Components only when needed
- Implement proper loading and error states
- Use Image component for automatic optimization
- Set proper metadata for SEO
- Leverage caching strategies (force-cache, revalidate, no-store)

**Turborepo:**
- Structure monorepo with clear separation (apps/, packages/)
- Define task dependencies correctly (^build for topological)
- Configure outputs for proper caching
- Enable remote caching for team collaboration
- Use filters to run tasks on changed packages only

**RemixIcon:**
- Use line style for minimal interfaces, fill for emphasis
- Maintain 24x24 grid alignment for crisp rendering
- Provide aria-labels for accessibility
- Use currentColor for flexible theming
- Prefer webfonts for multiple icons, SVG for single icons

## Resources

- Next.js: https://nextjs.org/docs/llms.txt
- Turborepo: https://turbo.build/repo/docs
- RemixIcon: https://remixicon.com

## Implementation Checklist

Building with this stack:

- [ ] Create project structure (single app or monorepo)
- [ ] Configure TypeScript and ESLint
- [ ] Set up Next.js with App Router
- [ ] Configure Turborepo pipeline (if monorepo)
- [ ] Install and configure RemixIcon
- [ ] Implement routing and layouts
- [ ] Add loading and error states
- [ ] Configure image and font optimization
- [ ] Set up data fetching patterns
- [ ] Configure caching strategies
- [ ] Add API routes as needed
- [ ] Implement shared component library (if monorepo)
- [ ] Configure remote caching (if monorepo)
- [ ] Set up CI/CD pipeline
- [ ] Configure deployment platform


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### nextjs app router

# Next.js App Router Architecture

Modern file-system based routing with React Server Components support.

## File Conventions

Special files define route behavior:

- `page.tsx` - Page UI, makes route publicly accessible
- `layout.tsx` - Shared UI wrapper for segment and children
- `loading.tsx` - Loading UI, automatically wraps page in Suspense
- `error.tsx` - Error UI, wraps page in Error Boundary
- `not-found.tsx` - 404 UI for route segment
- `route.ts` - API endpoint (Route Handler)
- `template.tsx` - Re-rendered layout (doesn't preserve state)
- `default.tsx` - Fallback for parallel routes

## Basic Routing

### Static Routes

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx         → /about
├── blog/
│   └── page.tsx         → /blog
└── contact/
    └── page.tsx         → /contact
```

### Dynamic Routes

Single parameter:
```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}
// Matches: /blog/hello-world, /blog/my-post
```

Catch-all segments:
```tsx
// app/shop/[...slug]/page.tsx
export default function Shop({ params }: { params: { slug: string[] } }) {
  return <h1>Category: {params.slug.join('/')}</h1>
}
// Matches: /shop/clothes, /shop/clothes/shirts, /shop/clothes/shirts/red
```

Optional catch-all:
```tsx
// app/docs/[[...slug]]/page.tsx
// Matches: /docs, /docs/getting-started, /docs/api/reference
```

## Layouts

### Root Layout (Required)

Must include `<html>` and `<body>` tags:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>Global Header</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  )
}
```

### Nested Layouts

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>Dashboard Navigation</nav>
      <main>{children}</main>
    </div>
  )
}
```

Layout characteristics:
- Preserve state during navigation
- Do not re-render on navigation between child routes
- Can fetch data
- Cannot access pathname or searchParams (use Client Component)

## Route Groups

Organize routes without affecting URL structure:

```
app/
├── (marketing)/          # Group without URL segment
│   ├── about/page.tsx   → /about
│   ├── blog/page.tsx    → /blog
│   └── layout.tsx       # Marketing layout
├── (shop)/
│   ├── products/page.tsx → /products
│   ├── cart/page.tsx     → /cart
│   └── layout.tsx       # Shop layout
└── layout.tsx           # Root layout
```

Use cases:
- Multiple root layouts
- Organize code by feature/team
- Different layouts for different sections

## Parallel Routes

Render multiple pages simultaneously in same layout:

```
app/
├── @team/               # Named slot
│   └── page.tsx
├── @analytics/          # Named slot
│   └── page.tsx
├── page.tsx             # Default children
└── layout.tsx           # Consumes slots
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <>
      {children}
      <div className="grid grid-cols-2">
        {team}
        {analytics}
      </div>
    </>
  )
}
```

Use cases:
- Split views (dashboards)
- Modals
- Conditional rendering based on auth state

## Intercepting Routes

Intercept navigation to show content in different context:

```
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx      # Full photo page
└── (..)photo/            # Intercepts /photo/[id]
    └── [id]/
        └── page.tsx      # Modal photo view
```

Matching conventions:
- `(.)` - Match same level
- `(..)` - Match one level above
- `(..)(..)` - Match two levels above
- `(...)` - Match from app root

Use case: Display modal when navigating from feed, show full page when URL accessed directly

## Loading States

### Loading File

Automatically wraps page in Suspense:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="spinner">Loading dashboard...</div>
}
```

### Manual Suspense

Fine-grained control:

```tsx
// app/page.tsx
import { Suspense } from 'react'

async function Posts() {
  const posts = await fetchPosts()
  return <PostsList posts={posts} />
}

export default function Page() {
  return (
    <div>
      <h1>My Blog</h1>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

## Error Handling

### Error File

Wraps segment in Error Boundary:

```tsx
// app/error.tsx
'use client' // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Global Error

Catches errors in root layout:

```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Application Error!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

### Not Found

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound() // Triggers not-found.tsx
  }

  return <article>{post.content}</article>
}

// app/blog/[slug]/not-found.tsx
export default function NotFound() {
  return <h2>Post not found</h2>
}
```

## Navigation

### Link Component

```tsx
import Link from 'next/link'

// Basic link
<Link href="/about">About</Link>

// Dynamic route
<Link href={`/blog/${post.slug}`}>Read Post</Link>

// With object
<Link href={{
  pathname: '/blog/[slug]',
  query: { slug: 'hello-world' },
}}>
  Read Post
</Link>

// Prefetch control
<Link href="/dashboard" prefetch={false}>
  Dashboard
</Link>

// Replace history
<Link href="/search" replace>
  Search
</Link>
```

### useRouter Hook (Client)

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function NavigateButton() {
  const router = useRouter()

  return (
    <>
      <button onClick={() => router.push('/dashboard')}>Dashboard</button>
      <button onClick={() => router.replace('/login')}>Login</button>
      <button onClick={() => router.refresh()}>Refresh</button>
      <button onClick={() => router.back()}>Back</button>
      <button onClick={() => router.forward()}>Forward</button>
    </>
  )
}
```

### Programmatic Navigation (Server)

```tsx
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return <div>Protected content</div>
}
```

## Accessing Route Information

### searchParams (Server)

```tsx
// app/shop/page.tsx
export default function Shop({
  searchParams,
}: {
  searchParams: { sort?: string; filter?: string }
}) {
  const sort = searchParams.sort || 'newest'
  const filter = searchParams.filter

  return <div>Showing: {filter}, sorted by {sort}</div>
}
// Accessed via: /shop?sort=price&filter=shirts
```

### useSearchParams (Client)

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export function SearchFilter() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  return <div>Search query: {query}</div>
}
```

### usePathname (Client)

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      <Link href="/" className={pathname === '/' ? 'active' : ''}>
        Home
      </Link>
      <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
        About
      </Link>
    </nav>
  )
}
```

## Project Structure Best Practices

```
app/
├── (auth)/                 # Route group for auth pages
│   ├── login/
│   ├── signup/
│   └── layout.tsx         # Auth layout
├── (dashboard)/           # Route group for dashboard
│   ├── dashboard/
│   ├── settings/
│   └── layout.tsx         # Dashboard layout
├── api/                   # API routes
│   ├── auth/
│   └── posts/
├── _components/           # Private folder (not routes)
│   ├── header.tsx
│   └── footer.tsx
├── _lib/                  # Private utilities
│   ├── auth.ts
│   └── db.ts
├── layout.tsx             # Root layout
├── page.tsx               # Home page
├── loading.tsx
├── error.tsx
└── not-found.tsx
```

Use underscore prefix for folders that shouldn't be routes.


### nextjs data fetching

# Next.js Data Fetching

Server-side data fetching, caching strategies, revalidation, and loading patterns.

## Fetch API Extensions

Next.js extends native fetch with caching and revalidation:

```tsx
// Force cache (default) - cache forever
fetch('https://api.example.com/data', { cache: 'force-cache' })

// No cache - fetch on every request
fetch('https://api.example.com/data', { cache: 'no-store' })

// Revalidate - cache with time-based revalidation
fetch('https://api.example.com/data', { next: { revalidate: 3600 } })

// Tag-based revalidation
fetch('https://api.example.com/data', { next: { tags: ['posts'] } })
```

## Caching Strategies

### Static Data (Default)

Fetched at build time, cached indefinitely:

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  // Same as: fetch(url, { cache: 'force-cache' })
  return res.json()
}

export default async function Posts() {
  const posts = await getPosts()
  return <PostsList posts={posts} />
}
```

Use for: Content that rarely changes, static pages

### Dynamic Data

Fetched on every request:

```tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function Profile() {
  const user = await getUser()
  return <div>{user.name}</div>
}
```

Use for: User-specific data, real-time content

### Incremental Static Regeneration (ISR)

Revalidate cached data after time period:

```tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  return res.json()
}

export default async function Posts() {
  const posts = await getPosts()
  return <PostsList posts={posts} />
}
```

How it works:
1. First request: Generate page, cache it
2. Subsequent requests: Serve cached page
3. After 60s: Next request triggers regeneration in background
4. New page cached, served to subsequent requests

Use for: News sites, blogs, product listings

## Revalidation Strategies

### Time-Based Revalidation

```tsx
// Revalidate every hour
fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 }
})

// Revalidate every 10 seconds
fetch('https://api.example.com/trending', {
  next: { revalidate: 10 }
})
```

### On-Demand Revalidation

Revalidate specific paths or tags programmatically:

```tsx
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content')
    }
  })

  // Revalidate specific path
  revalidatePath('/posts')
  revalidatePath(`/posts/${post.id}`)

  // Or revalidate by tag
  revalidateTag('posts')
}
```

Tag-based revalidation:
```tsx
// Fetch with tags
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts', 'content'] }
  })
  return res.json()
}

async function getComments(postId: string) {
  const res = await fetch(`https://api.example.com/comments/${postId}`, {
    next: { tags: ['comments', `post-${postId}`] }
  })
  return res.json()
}

// Revalidate all 'posts' tagged requests
revalidateTag('posts')

// Revalidate specific post comments
revalidateTag(`post-${postId}`)
```

### Route Segment Config

Configure entire route segment:

```tsx
// app/posts/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <PostsList posts={posts} />
}
```

Options:
```tsx
export const dynamic = 'auto' // default
export const dynamic = 'force-dynamic' // no caching
export const dynamic = 'error' // error if dynamic
export const dynamic = 'force-static' // force static

export const revalidate = false // never revalidate (default)
export const revalidate = 0 // no cache
export const revalidate = 60 // revalidate every 60s

export const fetchCache = 'auto' // default
export const fetchCache = 'default-cache'
export const fetchCache = 'only-cache'
export const fetchCache = 'force-cache'
export const fetchCache = 'default-no-store'
export const fetchCache = 'only-no-store'
export const fetchCache = 'force-no-store'
```

## Data Fetching Patterns

### Parallel Fetching

Fetch multiple resources simultaneously:

```tsx
async function getData() {
  // Start both requests in parallel
  const [posts, users] = await Promise.all([
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/users').then(r => r.json())
  ])

  return { posts, users }
}

export default async function Page() {
  const { posts, users } = await getData()
  return (
    <div>
      <PostsList posts={posts} />
      <UsersList users={users} />
    </div>
  )
}
```

### Sequential Fetching

Fetch dependent data:

```tsx
async function getData(postId: string) {
  // Fetch post first
  const post = await fetch(`https://api.example.com/posts/${postId}`).then(r => r.json())

  // Then fetch author based on post data
  const author = await fetch(`https://api.example.com/users/${post.authorId}`).then(r => r.json())

  return { post, author }
}

export default async function Post({ params }: { params: { id: string } }) {
  const { post, author } = await getData(params.id)
  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {author.name}</p>
      <div>{post.content}</div>
    </article>
  )
}
```

### Preloading Data

Optimize sequential waterfalls:

```tsx
// lib/data.ts
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
})

// app/user/[id]/page.tsx
import { getUser } from '@/lib/data'

// Preload before component renders
async function preload(id: string) {
  void getUser(id) // Start fetching immediately
}

export default async function User({ params }: { params: { id: string } }) {
  preload(params.id) // Start fetch
  // Render other UI
  const user = await getUser(params.id) // Will use cached result

  return <div>{user.name}</div>
}
```

## Loading States

### Loading File

Automatic loading UI:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div className="spinner">Loading dashboard...</div>
}

// app/dashboard/page.tsx
export default async function Dashboard() {
  const data = await fetchDashboard()
  return <DashboardView data={data} />
}
```

### Suspense Boundaries

Granular loading states:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

async function Revenue() {
  const data = await fetchRevenue() // 2s
  return <RevenueChart data={data} />
}

async function Sales() {
  const data = await fetchSales() // 0.5s
  return <SalesTable data={data} />
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<RevenueChartSkeleton />}>
        <Revenue />
      </Suspense>

      <Suspense fallback={<SalesTableSkeleton />}>
        <Sales />
      </Suspense>
    </div>
  )
}
```

Sales loads after 0.5s, Revenue after 2s - no blocking.

## Static Generation

### generateStaticParams

Pre-render dynamic routes at build time:

```tsx
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())

  return posts.map(post => ({
    slug: post.slug
  }))
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(r => r.json())
  return <article>{post.content}</article>
}
```

Generates static pages at build:
- `/posts/hello-world`
- `/posts/nextjs-guide`
- `/posts/react-tips`

### Dynamic Params Handling

```tsx
// app/posts/[slug]/page.tsx
export const dynamicParams = true // default - generate on-demand if not pre-rendered

export const dynamicParams = false // 404 for paths not in generateStaticParams
```

## Error Handling

### Try-Catch in Server Components

```tsx
async function getData() {
  try {
    const res = await fetch('https://api.example.com/data')

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    return res.json()
  } catch (error) {
    console.error('Data fetch error:', error)
    return null
  }
}

export default async function Page() {
  const data = await getData()

  if (!data) {
    return <div>Failed to load data</div>
  }

  return <DataView data={data} />
}
```

### Error Boundaries

```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Database Queries

Direct database access in Server Components:

```tsx
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPosts() {
  return prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })
}

// app/posts/page.tsx
import { getPosts } from '@/lib/db'

export default async function Posts() {
  const posts = await getPosts()
  return <PostsList posts={posts} />
}
```

## Best Practices

1. **Default to static** - Use `cache: 'force-cache'` or default behavior
2. **Use ISR for semi-dynamic content** - Balance freshness and performance
3. **Fetch in parallel** - Use `Promise.all()` for independent requests
4. **Add loading states** - Use Suspense for better UX
5. **Handle errors gracefully** - Provide fallbacks and error boundaries
6. **Use on-demand revalidation** - Trigger updates after mutations
7. **Tag your fetches** - Enable granular cache invalidation
8. **Dedupe automatically** - Next.js dedupes identical fetch requests
9. **Avoid client-side fetching** - Use Server Components when possible
10. **Cache database queries** - Use React cache() for expensive queries


### nextjs optimization

# Next.js Optimization

Performance optimization techniques for images, fonts, scripts, and bundles.

## Image Optimization

### Next.js Image Component

Automatic optimization with modern formats (WebP, AVIF):

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <>
      {/* Local image */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={1200}
        height={600}
        priority // Load immediately, no lazy loading
      />

      {/* Remote image */}
      <Image
        src="https://example.com/photo.jpg"
        alt="Photo"
        width={800}
        height={600}
        quality={90} // 1-100, default 75
      />

      {/* Responsive fill */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
      </div>

      {/* With blur placeholder */}
      <Image
        src="/profile.jpg"
        alt="Profile"
        width={200}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // Or use static import
      />
    </>
  )
}
```

### Image Props Reference

**Required:**
- `src` - Image path (string or static import)
- `alt` - Alt text for accessibility
- `width`, `height` - Dimensions (required unless using `fill`)

**Optional:**
- `fill` - Fill parent container (makes width/height optional)
- `sizes` - Responsive sizes hint for srcset
- `quality` - 1-100 (default 75)
- `priority` - Disable lazy loading, preload image
- `placeholder` - 'blur' | 'empty' (default 'empty')
- `blurDataURL` - Data URL for blur placeholder
- `loading` - 'lazy' | 'eager' (default 'lazy')
- `style` - CSS styles
- `className` - CSS class
- `onLoad` - Callback when loaded

### Responsive Images with Sizes

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

This tells browser:
- Mobile (<768px): Use 100% viewport width
- Tablet (768-1200px): Use 50% viewport width
- Desktop (>1200px): Use 33% viewport width

### Static Import for Local Images

```tsx
import heroImage from '@/public/hero.jpg'

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur" // Automatically generated
  // No width/height needed - inferred from import
/>
```

### Remote Image Configuration

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      }
    ],
    // Device sizes for srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Supported formats
    formats: ['image/webp'],
    // Cache optimization images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
  }
}
```

## Font Optimization

### Google Fonts

Automatic optimization with zero layout shift:

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

Use CSS variables:
```css
.code {
  font-family: var(--font-roboto-mono);
}
```

### Local Fonts

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: './fonts/my-font-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/my-font-bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-my-font',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Font Display Strategies

```tsx
const font = Inter({
  display: 'swap', // Show fallback immediately, swap when loaded (recommended)
  // display: 'optional', // Only use font if available immediately
  // display: 'block', // Hide text until font loads (max 3s)
  // display: 'fallback', // Show fallback briefly, swap if loaded quickly
  // display: 'auto', // Browser default
})
```

## Script Optimization

### Script Component

Control loading behavior:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Load after page is interactive (recommended for analytics) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js"
        strategy="afterInteractive"
      />

      {/* Load while page is idle (lowest priority) */}
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
      />

      {/* Load before page is interactive (use sparingly) */}
      <Script
        src="https://maps.googleapis.com/maps/api/js"
        strategy="beforeInteractive"
      />

      {/* Inline script with strategy */}
      <Script id="analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        `}
      </Script>

      {/* With onLoad callback */}
      <Script
        src="https://example.com/sdk.js"
        onLoad={() => console.log('Script loaded')}
        onError={(e) => console.error('Script failed', e)}
      />
    </>
  )
}
```

**Strategy options:**
- `beforeInteractive` - Load before page interactive (blocking)
- `afterInteractive` - Load after page interactive (default)
- `lazyOnload` - Load during idle time
- `worker` - Load in web worker (experimental)

## Bundle Optimization

### Analyzing Bundle Size

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Create next.config.js wrapper
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your Next.js config
})
```

```bash
# Run analysis
ANALYZE=true npm run build
```

### Dynamic Import (Code Splitting)

Split code and load on-demand:

```tsx
import dynamic from 'next/dynamic'

// Dynamic import with loading state
const DynamicChart = dynamic(() => import('@/components/chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for this component
})

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DynamicChart />
    </div>
  )
}
```

Named exports:
```tsx
const DynamicComponent = dynamic(
  () => import('@/components/hello').then(mod => mod.Hello)
)
```

Multiple components:
```tsx
const DynamicHeader = dynamic(() => import('@/components/header'))
const DynamicFooter = dynamic(() => import('@/components/footer'))
```

### Tree Shaking

Import only what you need:

```tsx
// ❌ Bad - imports entire library
import _ from 'lodash'
const result = _.debounce(fn, 300)

// ✅ Good - imports only debounce
import debounce from 'lodash/debounce'
const result = debounce(fn, 300)

// ❌ Bad
import * as Icons from 'react-icons/fa'
<Icons.FaHome />

// ✅ Good
import { FaHome } from 'react-icons/fa'
<FaHome />
```

## Partial Prerendering (PPR)

Experimental: Combine static and dynamic rendering in same route.

```js
// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  }
}
```

```tsx
// app/page.tsx
import { Suspense } from 'react'

// Static shell
export default function Page() {
  return (
    <div>
      <header>Static Header</header>

      {/* Dynamic content with Suspense boundary */}
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent />
      </Suspense>

      <footer>Static Footer</footer>
    </div>
  )
}

// Dynamic component
async function DynamicContent() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  }).then(r => r.json())

  return <div>{data.content}</div>
}
```

Static shell loads instantly, dynamic content streams in.

## Metadata Optimization

### Static Metadata

```tsx
// app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
  keywords: ['next.js', 'react', 'javascript'],
  openGraph: {
    title: 'My Page',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Page',
    description: 'Page description',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://example.com/page',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  }
}
```

### Metadata Files

Create these files in `app/` directory:

- `favicon.ico` - Favicon
- `icon.png` / `icon.jpg` - App icon
- `apple-icon.png` - Apple touch icon
- `opengraph-image.png` - Open Graph image
- `twitter-image.png` - Twitter card image
- `robots.txt` - Robots file
- `sitemap.xml` - Sitemap

Or generate dynamically:
```tsx
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getPosts()

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
    },
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    }))
  ]
}
```

## Performance Best Practices

1. **Use Image component** - Automatic optimization, lazy loading, modern formats
2. **Optimize fonts** - Use next/font to eliminate layout shift
3. **Dynamic imports** - Code split large components and third-party libraries
4. **Analyze bundle** - Identify and eliminate large dependencies
5. **Proper caching** - Use ISR for semi-static content
6. **Streaming with Suspense** - Load fast content first, stream slow content
7. **Minimize JavaScript** - Default to Server Components
8. **Prefetch links** - Next.js prefetches Link components in viewport
9. **Use Script component** - Control third-party script loading
10. **Compress assets** - Enable compression in hosting platform
11. **Use CDN** - Deploy to edge network (Vercel, Cloudflare)
12. **Monitor metrics** - Track Core Web Vitals (LCP, FID, CLS)


### nextjs server components

# Next.js Server Components

React Server Components (RSC) architecture, patterns, and best practices.

## Core Concepts

### Server Components (Default)

All components in `app/` directory are Server Components by default:

```tsx
// app/posts/page.tsx - Server Component
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
    </div>
  )
}
```

**Benefits:**
- Fetch data on server (direct database access)
- Keep sensitive data/keys on server
- Reduce client-side JavaScript bundle
- Improve initial page load and SEO
- Cache results on server
- Stream content to client

**Limitations:**
- Cannot use React hooks (useState, useEffect, useContext)
- Cannot use browser APIs (window, localStorage)
- Cannot add event listeners (onClick, onChange)
- Cannot use React class components

### Client Components

Mark with `'use client'` directive at top of file:

```tsx
// components/counter.tsx - Client Component
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

**Use Client Components for:**
- Interactive UI (event handlers)
- State management (useState, useReducer)
- Effects (useEffect, useLayoutEffect)
- Browser-only APIs (localStorage, geolocation)
- Custom React hooks
- Context consumers

## Composition Patterns

### Server Component as Wrapper

Best practice: Keep Server Components as parent, pass Client Components as children:

```tsx
// app/page.tsx - Server Component
import { ClientSidebar } from './sidebar'
import { ClientButton } from './button'

export default async function Page() {
  const data = await fetchData() // Server-side data fetch

  return (
    <div>
      <h1>Server-rendered heading</h1>
      <ClientSidebar />
      <ClientButton />
      <p>More server-rendered content: {data.title}</p>
    </div>
  )
}
```

### Passing Server Components to Client Components

Use children pattern to avoid making entire tree client-side:

```tsx
// app/page.tsx - Server Component
import { ClientProvider } from './client-provider'
import { ServerContent } from './server-content'

export default function Page() {
  return (
    <ClientProvider>
      <ServerContent /> {/* Stays as Server Component */}
    </ClientProvider>
  )
}

// client-provider.tsx - Client Component
'use client'

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState()

  return <div>{children}</div>
}

// server-content.tsx - Server Component
export async function ServerContent() {
  const data = await fetchData()
  return <p>{data.content}</p>
}
```

### Sharing Data Between Server Components

No need for props or context - just fetch data where needed:

```tsx
// lib/data.ts
export async function getUser() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'force-cache' // Will dedupe automatically
  })
  return res.json()
}

// app/header.tsx
import { getUser } from '@/lib/data'

export async function Header() {
  const user = await getUser() // Fetch 1
  return <div>Welcome, {user.name}</div>
}

// app/profile.tsx
import { getUser } from '@/lib/data'

export async function Profile() {
  const user = await getUser() // Fetch 2 (deduped automatically)
  return <div>Email: {user.email}</div>
}
```

Next.js automatically dedupes identical fetch requests during render.

## Async Components

Server Components can be async functions:

```tsx
// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`)
  return res.json()
}

async function getComments(postId: string) {
  const res = await fetch(`https://api.example.com/posts/${postId}/comments`)
  return res.json()
}

export default async function Post({ params }: { params: { id: string } }) {
  // Parallel data fetching
  const [post, comments] = await Promise.all([
    getPost(params.id),
    getComments(params.id)
  ])

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <CommentsList comments={comments} />
    </article>
  )
}
```

## Streaming with Suspense

Stream components as they resolve:

```tsx
// app/page.tsx
import { Suspense } from 'react'

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return <div>Loaded after 3 seconds</div>
}

async function FastComponent() {
  await new Promise(resolve => setTimeout(resolve, 500))
  return <div>Loaded after 0.5 seconds</div>
}

export default function Page() {
  return (
    <div>
      <h1>Instant heading</h1>

      <Suspense fallback={<div>Loading fast...</div>}>
        <FastComponent />
      </Suspense>

      <Suspense fallback={<div>Loading slow...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  )
}
```

Benefits:
- Fast components render immediately
- Slow components don't block page
- Progressive enhancement
- Better perceived performance

## Context in Server/Client Components

### Problem: Context Requires Client Components

```tsx
// ❌ Won't work - Server Components can't use context
import { createContext } from 'react'

const ThemeContext = createContext()

export default function Layout({ children }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  )
}
```

### Solution: Create Client Component Wrapper

```tsx
// app/providers.tsx - Client Component
'use client'

import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

// app/layout.tsx - Server Component
import { ThemeProvider } from './providers'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Third-Party Component Integration

Many third-party components need client-side features:

```tsx
// components/carousel.tsx
'use client'

import 'slick-carousel/slick/slick.css'
import Slider from 'react-slick'

export function Carousel({ children }) {
  return <Slider>{children}</Slider>
}

// app/page.tsx - Server Component
import { Carousel } from '@/components/carousel'

export default function Page() {
  return (
    <Carousel>
      <div>Slide 1</div>
      <div>Slide 2</div>
    </Carousel>
  )
}
```

## Server Actions

Call server-side functions from Client Components:

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await db.post.create({
    data: { title, content }
  })

  revalidatePath('/posts')
}

// app/new-post/page.tsx
import { createPost } from '@/app/actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

With Client Component:
```tsx
// components/post-form.tsx
'use client'

import { createPost } from '@/app/actions'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <SubmitButton />
    </form>
  )
}
```

## When to Use Each Component Type

### Use Server Components When:
- Fetching data from database or API
- Accessing backend resources directly
- Keeping sensitive information on server (tokens, keys)
- Reducing client-side JavaScript
- Rendering static content
- No interactivity needed

### Use Client Components When:
- Adding interactivity (onClick, onChange)
- Managing state (useState, useReducer)
- Using lifecycle effects (useEffect)
- Using browser-only APIs (localStorage, navigator)
- Using custom React hooks
- Using React Context
- Using third-party libraries requiring client features

## Best Practices

1. **Default to Server Components** - Only use 'use client' when needed
2. **Move Client Components to leaves** - Keep them as deep as possible in tree
3. **Pass Server Components as children** - Avoid turning entire trees client-side
4. **Share data via fetch** - Let Next.js dedupe requests automatically
5. **Use Suspense for streaming** - Improve perceived performance
6. **Separate client logic** - Extract client-only code to separate files
7. **Minimize client bundle** - Less JavaScript = faster page loads

## Common Patterns

### Protected Content

```tsx
// app/dashboard/page.tsx - Server Component
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Dashboard() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return <div>Welcome, {user.name}</div>
}
```

### Optimistic Updates

```tsx
// components/like-button.tsx
'use client'

import { useOptimistic } from 'react'
import { likePost } from '@/app/actions'

export function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, amount) => state + amount
  )

  return (
    <button
      onClick={async () => {
        addOptimisticLike(1)
        await likePost(postId)
      }}
    >
      Likes: {optimisticLikes}
    </button>
  )
}
```

### Loading States with Streaming

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

async function RevenueChart() {
  const data = await fetchRevenue() // Slow query
  return <Chart data={data} />
}

async function RecentSales() {
  const sales = await fetchSales() // Fast query
  return <SalesTable sales={sales} />
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <RecentSales />
      </Suspense>
    </div>
  )
}
```


### remix icon integration

# RemixIcon Integration Guide

Installation, usage, customization, and accessibility for RemixIcon library.

## Overview

RemixIcon provides 3,100+ icons in outlined (-line) and filled (-fill) styles, built on 24x24px grid.

**Icon naming:** `ri-{name}-{style}`
- Examples: `ri-home-line`, `ri-heart-fill`, `ri-search-line`

## Installation

### NPM Package

```bash
# npm
npm install remixicon

# yarn
yarn add remixicon

# pnpm
pnpm install remixicon

# bun
bun add remixicon
```

### React Package

```bash
npm install @remixicon/react
```

### Vue 3 Package

```bash
npm install @remixicon/vue
```

### CDN

```html
<link
  href="https://cdn.jsdelivr.net/npm/remixicon@4.7.0/fonts/remixicon.css"
  rel="stylesheet"
/>
```

## Usage Methods

### 1. Webfont (HTML/CSS)

Import CSS and use class names:

```tsx
// Next.js - app/layout.tsx
import 'remixicon/fonts/remixicon.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

// Use in components
<i className="ri-home-line"></i>
<i className="ri-search-fill"></i>
```

**With sizing classes:**
```html
<i className="ri-home-line ri-2x"></i>    <!-- 2em -->
<i className="ri-search-line ri-lg"></i>  <!-- 1.33em -->
<i className="ri-heart-fill ri-xl"></i>   <!-- 1.5em -->
```

**Available sizes:**
- `ri-xxs` (0.5em)
- `ri-xs` (0.75em)
- `ri-sm` (0.875em)
- `ri-1x` (1em)
- `ri-lg` (1.33em)
- `ri-xl` (1.5em)
- `ri-2x` through `ri-10x`
- `ri-fw` (fixed width)

### 2. React Components

```tsx
import { RiHomeLine, RiSearchFill, RiHeartLine } from "@remixicon/react"

export function MyComponent() {
  return (
    <div>
      <RiHomeLine size={24} />
      <RiSearchFill size={32} color="blue" />
      <RiHeartLine size="1.5em" className="icon" />
    </div>
  )
}
```

**Props:**
- `size` - Number (pixels) or string (em, rem)
- `color` - CSS color value
- `className` - CSS class
- Standard SVG props (onClick, style, etc.)

### 3. Vue 3 Components

```vue
<script setup lang="ts">
import { RiHomeLine, RiSearchFill } from "@remixicon/vue"
</script>

<template>
  <div>
    <RiHomeLine :size="24" />
    <RiSearchFill :size="32" color="blue" />
  </div>
</template>
```

### 4. Direct SVG

```tsx
// Download SVG file and import
import HomeIcon from '@/icons/home-line.svg'

export function Component() {
  return <img src={HomeIcon} alt="Home" width={24} height={24} />
}
```

### 5. SVG Sprite

```html
<svg className="icon">
  <use xlinkHref="path/to/remixicon.symbol.svg#ri-home-line"></use>
</svg>
```

```css
.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
```

## Icon Categories

20 semantic categories with 3,100+ icons:

**Navigation & UI:**
- Arrows (arrow-left, arrow-right, arrow-up-down)
- System (settings, delete, add, close, more)
- Editor (bold, italic, link, list, code)

**Communication:**
- Communication (chat, phone, mail, message)
- User (user, account, team, contacts)

**Media & Content:**
- Media (play, pause, volume, camera, video)
- Document (file, folder, article, draft)
- Design (brush, palette, magic, crop)

**Business & Commerce:**
- Business (briefcase, pie-chart, bar-chart)
- Finance (money, wallet, bank-card, coin)
- Map (map, pin, compass, navigation)

**Objects & Places:**
- Buildings (home, bank, hospital, store)
- Device (phone, laptop, tablet, printer)
- Food (restaurant, cake, cup, knife)
- Weather (sun, cloud, rain, moon)

**Development & Logos:**
- Development (code, terminal, bug, git-branch)
- Logos (github, twitter, facebook, google)

**Health & Medical:**
- Health (heart-pulse, capsule, stethoscope)

## Common Patterns

### Navigation Menu

```tsx
// Webfont approach
export function Navigation() {
  return (
    <nav>
      <a href="/home">
        <i className="ri-home-line"></i>
        <span>Home</span>
      </a>
      <a href="/search">
        <i className="ri-search-line"></i>
        <span>Search</span>
      </a>
      <a href="/profile">
        <i className="ri-user-line"></i>
        <span>Profile</span>
      </a>
    </nav>
  )
}

// React component approach
import { RiHomeLine, RiSearchLine, RiUserLine } from "@remixicon/react"

export function Navigation() {
  return (
    <nav>
      <a href="/home">
        <RiHomeLine size={20} />
        <span>Home</span>
      </a>
      <a href="/search">
        <RiSearchLine size={20} />
        <span>Search</span>
      </a>
      <a href="/profile">
        <RiUserLine size={20} />
        <span>Profile</span>
      </a>
    </nav>
  )
}
```

### Button with Icon

```tsx
import { RiDownloadLine } from "@remixicon/react"

export function DownloadButton() {
  return (
    <button className="btn-primary">
      <RiDownloadLine size={18} />
      <span>Download</span>
    </button>
  )
}
```

### Status Indicators

```tsx
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiAlertFill,
  RiInformationFill
} from "@remixicon/react"

type Status = 'success' | 'error' | 'warning' | 'info'

export function StatusIcon({ status }: { status: Status }) {
  const icons = {
    success: <RiCheckboxCircleFill color="green" size={20} />,
    error: <RiErrorWarningFill color="red" size={20} />,
    warning: <RiAlertFill color="orange" size={20} />,
    info: <RiInformationFill color="blue" size={20} />
  }

  return icons[status]
}
```

### Input with Icon

```tsx
import { RiSearchLine } from "@remixicon/react"

export function SearchInput() {
  return (
    <div className="input-group">
      <RiSearchLine size={20} className="input-icon" />
      <input type="text" placeholder="Search..." />
    </div>
  )
}
```

```css
.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

input {
  padding-left: 40px;
}
```

### Dynamic Icon Selection

```tsx
import { RiHomeLine, RiHeartFill, RiStarLine } from "@remixicon/react"

const iconMap = {
  home: RiHomeLine,
  heart: RiHeartFill,
  star: RiStarLine,
}

export function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  const Icon = iconMap[name]
  return Icon ? <Icon size={size} /> : null
}

// Usage
<DynamicIcon name="home" size={24} />
```

## Styling & Customization

### Color

```tsx
// Inherit from parent
<i className="ri-home-line" style={{ color: 'blue' }}></i>

// React component
<RiHomeLine color="blue" />
<RiHomeLine color="#ff0000" />
<RiHomeLine color="rgb(255, 0, 0)" />
```

### Size

```tsx
// CSS class
<i className="ri-home-line ri-2x"></i>

// Inline style
<i className="ri-home-line" style={{ fontSize: '32px' }}></i>

// React component
<RiHomeLine size={32} />
<RiHomeLine size="2em" />
```

### Responsive Sizing

```css
.icon {
  font-size: 24px;
}

@media (max-width: 768px) {
  .icon {
    font-size: 20px;
  }
}
```

### Animations

```css
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

```tsx
<i className="ri-loader-4-line spin"></i>
```

### Hover Effects

```css
.icon-button {
  transition: color 0.2s;
}

.icon-button:hover {
  color: #007bff;
}
```

## Accessibility

### Provide Labels

**Icon-only buttons:**
```tsx
<button aria-label="Search">
  <i className="ri-search-line"></i>
</button>

// Or with React
<button aria-label="Search">
  <RiSearchLine size={20} />
</button>
```

### Decorative Icons

Hide from screen readers:

```tsx
<span aria-hidden="true">
  <i className="ri-star-fill"></i>
</span>

// React
<span aria-hidden="true">
  <RiStarFill size={16} />
</span>
```

### Icon with Text

```tsx
<button>
  <RiDownloadLine size={18} aria-hidden="true" />
  <span>Download</span>
</button>
```

Text provides context, icon is decorative.

## Framework Integration

### Next.js

```tsx
// app/layout.tsx
import 'remixicon/fonts/remixicon.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx
import { RiHomeLine } from "@remixicon/react"

export default function Page() {
  return <RiHomeLine size={24} />
}
```

### Tailwind CSS

```tsx
<i className="ri-home-line text-2xl text-blue-500"></i>

<RiHomeLine size={24} className="text-blue-500 hover:text-blue-600" />
```

### CSS Modules

```tsx
import styles from './component.module.css'
import 'remixicon/fonts/remixicon.css'

export function Component() {
  return <i className={`ri-home-line ${styles.icon}`}></i>
}
```

## Performance Considerations

### Webfont (Recommended for Multiple Icons)

**Pros:**
- Single HTTP request
- All icons available
- Easy to use

**Cons:**
- 179KB WOFF2 file
- Loads all icons even if unused

**Best for:** Apps using 10+ different icons

### Individual SVG (Recommended for Few Icons)

**Pros:**
- Only load what you need
- Smallest bundle size
- Tree-shakeable with React package

**Cons:**
- Multiple imports

**Best for:** Apps using 1-5 icons

### React/Vue Package

**Pros:**
- Tree-shakeable (only imports used icons)
- TypeScript support
- Component API

**Cons:**
- Slightly larger than raw SVG
- Requires React/Vue

**Best for:** React/Vue apps with TypeScript

## Troubleshooting

### Icons Not Displaying

**Check CSS import:**
```tsx
import 'remixicon/fonts/remixicon.css'
```

**Verify class name:**
```html
<!-- Correct -->
<i className="ri-home-line"></i>

<!-- Incorrect -->
<i className="ri-home"></i>
<i className="home-line"></i>
```

**Check font loading:**
```css
/* Ensure font-family is applied */
[class^="ri-"], [class*=" ri-"] {
  font-family: "remixicon" !important;
}
```

### Icons Look Blurry

Use multiples of 24px for crisp rendering:

```tsx
// Good
<RiHomeLine size={24} />
<RiHomeLine size={48} />

// Bad (breaks pixel grid)
<RiHomeLine size={20} />
<RiHomeLine size={30} />
```

### Wrong Icon Size

**Set parent font-size:**
```css
.icon-container {
  font-size: 24px;
}
```

**Or use size prop:**
```tsx
<RiHomeLine size={24} />
```

## Best Practices

1. **Choose style consistently** - Use line or fill throughout app
2. **Maintain 24px grid** - Use sizes: 24, 48, 72, 96px
3. **Provide accessibility** - Add aria-labels to icon-only buttons
4. **Use currentColor** - Icons inherit text color by default
5. **Optimize bundle** - Use React package for tree-shaking
6. **Cache webfonts** - CDN or long cache headers
7. **Lazy load icons** - Dynamic import for heavy icon sets
8. **Test on devices** - Ensure icons scale properly
9. **Document usage** - Create icon component library
10. **Version lock** - Pin RemixIcon version for consistency

## Resources

- Website: https://remixicon.com
- GitHub: https://github.com/Remix-Design/RemixIcon
- React Package: @remixicon/react
- Vue Package: @remixicon/vue
- License: Apache 2.0
- Total Icons: 3,100+
- Current Version: 4.7.0


### turborepo caching

# Turborepo Caching Strategies

Local caching, remote caching, cache invalidation, and optimization techniques.

## Local Caching

### How It Works

Turborepo caches task outputs based on inputs:

1. **Hash inputs**: Source files, dependencies, environment variables, config
2. **Run task**: If hash not in cache
3. **Save outputs**: Store in `.turbo/cache`
4. **Restore on match**: Instant completion on cache hit

Default cache location: `./node_modules/.cache/turbo`

### Cache Configuration

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "cache": true  // default
    },
    "dev": {
      "cache": false  // don't cache dev servers
    }
  }
}
```

### Outputs Configuration

Specify what gets cached:

```json
{
  "build": {
    "outputs": [
      "dist/**",              // All files in dist
      "build/**",             // Build directory
      ".next/**",             // Next.js output
      "!.next/cache/**",      // Exclude Next.js cache
      "storybook-static/**",  // Storybook build
      "*.tsbuildinfo"         // TypeScript build info
    ]
  }
}
```

**Best practices:**
- Include all build artifacts
- Exclude nested caches
- Include type definitions
- Include generated files

### Clear Local Cache

```bash
# Remove cache directory
rm -rf ./node_modules/.cache/turbo

# Or use turbo command with --force
turbo run build --force

# Clear and rebuild
turbo run clean && turbo run build
```

## Remote Caching

Share cache across team and CI/CD.

### Vercel Remote Cache (Recommended)

**Setup:**
```bash
# Login to Vercel
turbo login

# Link repository
turbo link
```

**Use in CI:**
```yaml
# .github/workflows/ci.yml
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

steps:
  - run: turbo run build test
```

Get tokens from Vercel dashboard:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Add as GitHub secrets

### Custom Remote Cache

Configure custom remote cache server:

```json
// .turbo/config.json
{
  "teamid": "team_xxx",
  "apiurl": "https://cache.example.com",
  "token": "your-token"
}
```

Or use environment variables:
```bash
export TURBO_API="https://cache.example.com"
export TURBO_TOKEN="your-token"
export TURBO_TEAM="team_xxx"
```

### Remote Cache Verification

```bash
# Check cache status
turbo run build --output-logs=hash-only

# Output shows:
# • web:build: cache hit, replaying logs [hash]
# • api:build: cache miss, executing [hash]
```

## Cache Signatures

Cache invalidated when these change:

### 1. Source Files

All tracked Git files in package:
```
packages/ui/
├── src/
│   ├── button.tsx     # Tracked
│   └── input.tsx      # Tracked
├── dist/              # Ignored (in .gitignore)
└── node_modules/      # Ignored
```

### 2. Package Dependencies

Changes in package.json:
```json
{
  "dependencies": {
    "react": "18.2.0"  // Version change invalidates cache
  }
}
```

### 3. Environment Variables

Configured in pipeline:
```json
{
  "build": {
    "env": ["NODE_ENV", "API_URL"]  // Changes invalidate cache
  }
}
```

### 4. Global Dependencies

Files affecting all packages:
```json
{
  "globalDependencies": [
    "**/.env.*local",
    "tsconfig.json",
    ".eslintrc.js"
  ]
}
```

### 5. Task Configuration

Changes to turbo.json pipeline:
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": ["dist/**"]  // Config changes invalidate cache
  }
}
```

## Input Control

### Override Input Detection

Explicitly define what affects cache:

```json
{
  "build": {
    "inputs": [
      "src/**/*.ts",           // Include TS files
      "src/**/*.tsx",          // Include TSX files
      "!src/**/*.test.ts",     // Exclude tests
      "!src/**/*.stories.tsx", // Exclude stories
      "package.json",          // Include package.json
      "tsconfig.json"          // Include config
    ]
  }
}
```

Use cases:
- Exclude test files from build cache
- Exclude documentation from production builds
- Include only source files, not generated files

### Global vs Package Inputs

**Global inputs** (affect all packages):
```json
{
  "globalDependencies": [".env", "tsconfig.json"]
}
```

**Package inputs** (affect specific tasks):
```json
{
  "pipeline": {
    "build": {
      "inputs": ["src/**"]
    }
  }
}
```

## Environment Variables

### Cached Environment Variables

Include in cache signature:

```json
{
  "pipeline": {
    "build": {
      "env": [
        "NODE_ENV",           // Must match for cache hit
        "NEXT_PUBLIC_API_URL",
        "DATABASE_URL"
      ]
    }
  }
}
```

Cache invalidated when values change.

### Pass-Through Environment Variables

Don't affect cache:

```json
{
  "pipeline": {
    "build": {
      "passThroughEnv": [
        "DEBUG",        // Different values use same cache
        "LOG_LEVEL",
        "VERBOSE"
      ]
    }
  }
}
```

Use for: Debug flags, log levels, non-production settings

### Global Environment Variables

Available to all tasks:

```json
{
  "globalEnv": [
    "NODE_ENV",
    "CI",
    "VERCEL"
  ]
}
```

## Cache Optimization Strategies

### 1. Granular Outputs

Define precise outputs to minimize cache size:

```json
// ❌ Bad - caches too much
{
  "build": {
    "outputs": ["**"]
  }
}

// ✅ Good - specific outputs
{
  "build": {
    "outputs": ["dist/**", "!dist/**/*.map"]
  }
}
```

### 2. Exclude Unnecessary Files

```json
{
  "build": {
    "outputs": [
      ".next/**",
      "!.next/cache/**",      // Exclude Next.js cache
      "!.next/server/**/*.js.map",  // Exclude source maps
      "!.next/static/**/*.map"
    ]
  }
}
```

### 3. Separate Cacheable Tasks

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "cache": true  // Separate from build
    },
    "dev": {
      "cache": false  // Never cache
    }
  }
}
```

### 4. Use Input Filters

Only track relevant files:

```json
{
  "build": {
    "inputs": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.{test,spec}.{ts,tsx}",
      "public/**",
      "package.json"
    ]
  }
}
```

## Cache Analysis

### Inspect Cache Hits/Misses

```bash
# Dry run with JSON output
turbo run build --dry-run=json | jq '.tasks[] | {package: .package, task: .task, cache: .cache}'
```

### View Task Graph

```bash
# Generate task graph
turbo run build --graph

# Output: graph.html (open in browser)
```

### Cache Statistics

```bash
# Run with summary
turbo run build --summarize

# Output: .turbo/runs/[hash].json
```

## CI/CD Cache Configuration

### GitHub Actions

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build and test
        run: turbo run build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

      # Optional: Cache node_modules
      - uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### GitLab CI

```yaml
image: node:18

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .turbo/

build:
  stage: build
  script:
    - npm install
    - turbo run build test
  variables:
    TURBO_TOKEN: $TURBO_TOKEN
    TURBO_TEAM: $TURBO_TEAM
```

## Troubleshooting

### Cache Not Working

**Check outputs are defined:**
```bash
turbo run build --dry-run=json | jq '.tasks[] | {task: .task, outputs: .outputs}'
```

**Verify cache location:**
```bash
ls -la ./node_modules/.cache/turbo
```

**Check environment variables:**
```bash
echo $TURBO_TOKEN
echo $TURBO_TEAM
```

### Cache Too Large

**Analyze cache size:**
```bash
du -sh ./node_modules/.cache/turbo
```

**Reduce outputs:**
```json
{
  "build": {
    "outputs": [
      "dist/**",
      "!dist/**/*.map",      // Exclude source maps
      "!dist/**/*.test.js"   // Exclude test files
    ]
  }
}
```

**Clear old cache:**
```bash
# Turborepo doesn't auto-clean, manually remove:
rm -rf ./node_modules/.cache/turbo
```

### Remote Cache Connection Issues

**Test connection:**
```bash
curl -I https://cache.example.com
```

**Verify token:**
```bash
turbo link
# Should show: "Remote caching enabled"
```

**Check logs:**
```bash
turbo run build --output-logs=full
```

## Best Practices

1. **Define precise outputs** - Only cache necessary files
2. **Exclude nested caches** - Don't cache caches (.next/cache)
3. **Use remote caching** - Share cache across team and CI
4. **Track relevant inputs** - Use `inputs` to filter files
5. **Separate env vars** - Use `passThroughEnv` for debug flags
6. **Cache test results** - Include coverage in outputs
7. **Don't cache dev servers** - Set `cache: false` for dev tasks
8. **Use global dependencies** - Share config across packages
9. **Monitor cache performance** - Use `--summarize` to analyze
10. **Clear cache periodically** - Remove stale cache manually

## Cache Performance Tips

**For CI/CD:**
- Enable remote caching
- Run only changed packages: `--filter='...[origin/main]'`
- Use `--continue` to see all errors
- Cache node_modules separately

**For Local Development:**
- Keep local cache enabled
- Don't force rebuild unless needed
- Use filters to build only what changed
- Clear cache if issues arise

**For Large Monorepos:**
- Use granular outputs
- Implement input filters
- Monitor cache size regularly
- Consider cache size limits on remote cache


### turborepo pipelines

# Turborepo Task Pipelines

Task orchestration, dependencies, and parallel execution strategies.

## Pipeline Configuration

Define tasks in `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Task Dependencies

### Topological Dependencies (^)

`^` means "run this task in dependencies first":

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

Example flow:
```
packages/ui (dependency)
  ↓ builds first
apps/web (depends on @repo/ui)
  ↓ builds second
```

### Internal Dependencies

Run tasks in same package first:

```json
{
  "pipeline": {
    "deploy": {
      "dependsOn": ["build", "test"]
    }
  }
}
```

Execution order in same package:
1. Run `build`
2. Run `test`
3. Run `deploy`

### Combined Dependencies

Mix topological and internal:

```json
{
  "pipeline": {
    "test": {
      "dependsOn": ["^build", "lint"]
    }
  }
}
```

Execution order:
1. Build all dependencies (`^build`)
2. Lint current package (`lint`)
3. Run tests (`test`)

## Task Configuration Options

### outputs

Define what gets cached:

```json
{
  "build": {
    "outputs": [
      "dist/**",           // All files in dist
      ".next/**",          // Next.js build
      "!.next/cache/**",   // Exclude Next.js cache
      "build/**",          // Build directory
      "public/dist/**"     // Public assets
    ]
  }
}
```

### cache

Enable/disable caching:

```json
{
  "dev": {
    "cache": false        // Don't cache dev server
  },
  "build": {
    "cache": true         // Cache build (default)
  }
}
```

### persistent

Keep task running (for dev servers):

```json
{
  "dev": {
    "cache": false,
    "persistent": true    // Don't kill after completion
  }
}
```

### env

Environment variables affecting output:

```json
{
  "build": {
    "env": [
      "NODE_ENV",
      "NEXT_PUBLIC_API_URL",
      "DATABASE_URL"
    ]
  }
}
```

### passThroughEnv

Pass env vars without affecting cache:

```json
{
  "build": {
    "passThroughEnv": [
      "DEBUG",            // Pass through but don't invalidate cache
      "LOG_LEVEL"
    ]
  }
}
```

### inputs

Override default input detection:

```json
{
  "build": {
    "inputs": [
      "src/**/*.ts",
      "!src/**/*.test.ts", // Exclude test files
      "package.json"
    ]
  }
}
```

### outputMode

Control output display:

```json
{
  "build": {
    "outputMode": "full"        // Show all output
  },
  "dev": {
    "outputMode": "hash-only"   // Show cache hash only
  },
  "test": {
    "outputMode": "new-only"    // Show new output only
  },
  "lint": {
    "outputMode": "errors-only" // Show errors only
  }
}
```

## Running Tasks

### Basic Execution

```bash
# Run build in all packages
turbo run build

# Run multiple tasks
turbo run build test lint

# Run with specific package manager
pnpm turbo run build
```

### Filtering

Run tasks in specific packages:

```bash
# Single package
turbo run build --filter=web
turbo run build --filter=@repo/ui

# Multiple packages
turbo run build --filter=web --filter=api

# All apps
turbo run build --filter='./apps/*'

# Pattern matching
turbo run test --filter='*-api'
```

### Dependency Filtering

```bash
# Package and its dependencies
turbo run build --filter='...web'

# Package's dependencies only (exclude package itself)
turbo run build --filter='...^web'

# Package and its dependents
turbo run test --filter='ui...'

# Package's dependents only
turbo run test --filter='^ui...'
```

### Git-Based Filtering

Run only on changed packages:

```bash
# Changed since main branch
turbo run build --filter='[main]'

# Changed since HEAD~1
turbo run build --filter='[HEAD~1]'

# Changed in working directory
turbo run test --filter='...[HEAD]'

# Package and dependencies, only if changed
turbo run build --filter='...[origin/main]'
```

## Concurrency Control

### Parallel Execution (Default)

Turborepo runs tasks in parallel when safe:

```bash
# Run with default parallelism
turbo run build
```

### Limit Concurrency

```bash
# Max 3 tasks at once
turbo run build --concurrency=3

# 50% of CPU cores
turbo run build --concurrency=50%

# No parallelism (sequential)
turbo run build --concurrency=1
```

### Continue on Error

```bash
# Don't stop on first error
turbo run test --continue
```

## Task Execution Order

Example monorepo:
```
apps/
├── web (depends on @repo/ui, @repo/utils)
└── docs (depends on @repo/ui)
packages/
├── ui (depends on @repo/utils)
└── utils (no dependencies)
```

With config:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

Execution order for `turbo run build`:
1. **Wave 1** (parallel): `@repo/utils` (no dependencies)
2. **Wave 2** (parallel): `@repo/ui` (depends on utils)
3. **Wave 3** (parallel): `web` and `docs` (both depend on ui)

## Complex Pipeline Examples

### Full-Stack Application

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint", "typecheck"]
    }
  }
}
```

### Monorepo with Code Generation

```json
{
  "pipeline": {
    "generate": {
      "cache": false,
      "outputs": ["src/generated/**"]
    },
    "build": {
      "dependsOn": ["^build", "generate"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["generate"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### Database-Dependent Pipeline

```json
{
  "pipeline": {
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**"]
    },
    "test:unit": {
      "dependsOn": ["build"]
    },
    "test:integration": {
      "dependsOn": ["db:migrate"],
      "cache": false
    }
  }
}
```

## Dry Run

Preview execution without running:

```bash
# See what would run
turbo run build --dry-run

# JSON output for scripts
turbo run build --dry-run=json

# Show full task graph
turbo run build --graph
```

## Force Execution

Ignore cache and run tasks:

```bash
# Force rebuild everything
turbo run build --force

# Force specific package
turbo run build --filter=web --force
```

## Output Control

```bash
# Show only errors
turbo run build --output-logs=errors-only

# Show new logs only
turbo run build --output-logs=new-only

# Show cache hash only
turbo run build --output-logs=hash-only

# Show full output
turbo run build --output-logs=full
```

## Best Practices

1. **Use topological dependencies** - `^build` ensures correct build order
2. **Cache build outputs** - Define `outputs` for faster rebuilds
3. **Disable cache for dev** - Set `cache: false` for dev servers
4. **Mark persistent tasks** - Use `persistent: true` for long-running tasks
5. **Filter strategically** - Use filters to run only affected tasks
6. **Control concurrency** - Limit parallelism for resource-intensive tasks
7. **Configure env vars** - Include vars that affect output in `env`
8. **Use dry-run** - Preview execution plan before running
9. **Continue on error in CI** - Use `--continue` to see all errors
10. **Leverage git filtering** - Run only on changed packages in CI

## Common Patterns

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    steps:
      - run: turbo run build test lint --filter='...[origin/main]'
```

Only build/test/lint changed packages and their dependents.

### Development Workflow

```bash
# Start all dev servers
turbo run dev

# Start specific app with dependencies
turbo run dev --filter=web...
```

### Pre-commit Hook

```json
// package.json
{
  "scripts": {
    "pre-commit": "turbo run lint test --filter='...[HEAD]'"
  }
}
```

Only lint/test changed packages.

### Deployment

```bash
# Build and test specific app
turbo run build test --filter=web...

# Deploy if successful
turbo run deploy --filter=web
```

Build app and its dependencies, then deploy.


### turborepo setup

# Turborepo Setup & Configuration

Installation, workspace configuration, and project structure for monorepos.

## Installation

### Create New Monorepo

Using official starter:
```bash
npx create-turbo@latest my-monorepo
cd my-monorepo
```

Interactive prompts:
- Project name
- Package manager (npm, yarn, pnpm, bun)
- Example template

### Manual Installation

Install in existing project:
```bash
# npm
npm install turbo --save-dev

# yarn
yarn add turbo --dev

# pnpm
pnpm add turbo --save-dev

# bun
bun add turbo --dev
```

## Workspace Configuration

### Package Manager Setup

**pnpm (recommended):**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**npm/yarn:**
```json
// package.json (root)
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### Root Package.json

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.0.0"
  },
  "packageManager": "pnpm@8.0.0"
}
```

## Project Structure

### Recommended Directory Structure

```
my-monorepo/
├── apps/                    # Applications
│   ├── web/                # Next.js web app
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.js
│   ├── docs/               # Documentation site
│   │   ├── app/
│   │   └── package.json
│   └── api/                # Backend API
│       ├── src/
│       └── package.json
├── packages/               # Shared packages
│   ├── ui/                 # UI component library
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config/             # Shared configs
│   │   ├── eslint/
│   │   └── typescript/
│   ├── utils/              # Utility functions
│   │   ├── src/
│   │   └── package.json
│   └── types/              # Shared TypeScript types
│       ├── src/
│       └── package.json
├── turbo.json              # Turborepo config
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # Workspace config (pnpm)
└── .gitignore
```

## Application Package Setup

### Next.js App

```json
// apps/web/package.json
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@repo/ui": "*",
    "@repo/utils": "*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "@repo/eslint-config": "*",
    "typescript": "^5.0.0"
  }
}
```

### Backend API App

```json
// apps/api/package.json
{
  "name": "api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts",
    "start": "node dist/index.js",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@repo/utils": "*",
    "@repo/types": "*",
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "@types/express": "^4.17.0",
    "tsx": "^4.0.0",
    "tsup": "^8.0.0"
  }
}
```

## Shared Package Setup

### UI Component Library

```json
// packages/ui/package.json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./button": {
      "types": "./dist/button.d.ts",
      "default": "./dist/button.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "latest"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "typescript": "^5.0.0"
  }
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "declarationDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Utility Library

```json
// packages/utils/package.json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Shared Configuration Packages

### TypeScript Config Package

```
packages/typescript-config/
├── base.json
├── nextjs.json
├── react-library.json
└── package.json
```

```json
// packages/typescript-config/package.json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "main": "base.json",
  "files": [
    "base.json",
    "nextjs.json",
    "react-library.json"
  ]
}
```

```json
// packages/typescript-config/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleResolution": "bundler",
    "target": "ES2020",
    "module": "ESNext"
  },
  "exclude": ["node_modules"]
}
```

```json
// packages/typescript-config/nextjs.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint Config Package

```
packages/eslint-config/
├── library.js
├── next.js
└── package.json
```

```json
// packages/eslint-config/package.json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "main": "library.js",
  "files": ["library.js", "next.js"],
  "dependencies": {
    "eslint-config-next": "latest",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "latest"
  }
}
```

```js
// packages/eslint-config/library.js
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
  },
}
```

```js
// packages/eslint-config/next.js
module.exports = {
  extends: ['next', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
}
```

## Dependency Management

### Internal Dependencies

Use workspace protocol:

**pnpm:**
```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

**npm/yarn:**
```json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

### Version Syncing

Keep dependencies in sync across packages:

```json
// Root package.json
{
  "devDependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.0.0"
  }
}
```

Packages inherit from root or specify versions explicitly.

## Turbo.json Configuration

Basic configuration file:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [
    "**/.env.*local",
    "tsconfig.json"
  ],
  "globalEnv": [
    "NODE_ENV"
  ],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

## Environment Variables

### Global Environment Variables

```json
// turbo.json
{
  "globalEnv": [
    "NODE_ENV",
    "CI"
  ]
}
```

### Package-Specific Environment Variables

```json
{
  "pipeline": {
    "build": {
      "env": ["NEXT_PUBLIC_API_URL", "DATABASE_URL"],
      "passThroughEnv": ["CUSTOM_VAR"]
    }
  }
}
```

### .env Files

```
my-monorepo/
├── .env                    # Global env vars
├── .env.local             # Local overrides (gitignored)
├── apps/
│   └── web/
│       ├── .env           # App-specific
│       └── .env.local     # Local overrides
```

## Gitignore Configuration

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Turbo
.turbo

# Build outputs
dist/
.next/
out/
build/

# Environment
.env.local
.env.*.local

# Testing
coverage/

# Misc
.DS_Store
*.log
```

## NPM Scripts

Common scripts in root package.json:

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "clean": "turbo run clean && rm -rf node_modules",
    "typecheck": "turbo run typecheck"
  }
}
```

## Initialization Checklist

Setting up new Turborepo:

- [ ] Install Turborepo (create-turbo or manual)
- [ ] Configure workspace (pnpm-workspace.yaml or package.json)
- [ ] Create directory structure (apps/, packages/)
- [ ] Set up shared config packages (typescript-config, eslint-config)
- [ ] Create turbo.json with pipeline
- [ ] Configure gitignore
- [ ] Set up environment variables
- [ ] Define package dependencies
- [ ] Add root scripts
- [ ] Test build and dev commands




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
