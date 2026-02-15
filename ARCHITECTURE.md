# PPM Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js 14 Frontend                     │  │
│  │                                                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │    │  │
│  │  │            │  │            │  │            │    │  │
│  │  │ • Dashboard│  │ • UI Kit   │  │ • Projects │    │  │
│  │  │ • Projects │  │ • Charts   │  │ • Budget   │    │  │
│  │  │ • Budget   │  │ • Tables   │  │ • Resources│    │  │
│  │  │ • Resources│  │ • Forms    │  │ • Risks    │    │  │
│  │  │ • Risks    │  │            │  │ • Milestones│   │  │
│  │  │ • Milestones│ │            │  │            │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │      TanStack Query (State Management)      │    │  │
│  │  │  • Caching • Optimistic Updates • SSR       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS / WebSocket
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Supabase Backend                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth API   │  │  Database    │  │  Realtime    │     │
│  │              │  │              │  │              │     │
│  │ • JWT Tokens │  │ • PostgreSQL │  │ • WebSocket  │     │
│  │ • Sessions   │  │ • RLS        │  │ • Live Data  │     │
│  │ • Users      │  │ • Triggers   │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User Input → Login Page → Supabase Auth API → JWT Token → 
Browser Storage → Middleware Check → Protected Routes Access
```

### 2. Data Fetching Flow
```
Component Mount → TanStack Query Hook → Supabase Client → 
PostgreSQL Query → RLS Policy Check → Data Response → 
Cache Update → Component Render
```

### 3. Data Mutation Flow
```
User Action → Form Validation → Mutation Hook → Supabase Client →
PostgreSQL Transaction → RLS Policy Check → Success/Error → 
Cache Invalidation → Refetch → UI Update
```

## Component Hierarchy

```
App (layout.tsx)
├── Providers (TanStack Query)
│
├── Auth Pages
│   ├── Login
│   └── Signup
│
└── Dashboard (protected)
    ├── Navigation
    │   ├── Logo
    │   ├── Menu Links
    │   └── Sign Out Button
    │
    ├── Dashboard Home
    │   ├── Metrics Cards (6 KPIs)
    │   ├── Status Chart (Recharts)
    │   ├── Budget Chart (Recharts)
    │   ├── Risk Heatmap
    │   └── Upcoming Milestones
    │
    ├── Projects Page
    │   ├── Filter Bar
    │   ├── Project Table
    │   └── Project Form (Create/Edit)
    │
    ├── Budget Page
    │   ├── Summary Cards
    │   └── Budget Entry Table
    │
    ├── Resources Page
    │   └── Resource Table with Allocations
    │
    ├── Risks Page
    │   ├── Stats Cards
    │   └── Risk/Issue Table
    │
    └── Milestones Page
        ├── Stats Cards
        └── Milestone Table
```

## Database Schema Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   users     │────▶│  portfolios  │◀────│  projects   │
│ (RLS: own)  │     │ (RLS: access)│     │(RLS: access)│
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    ├──▶ budget_entries
       │                    │                    ├──▶ risks_issues
       │                    │                    └──▶ milestones
       │                    │
       │                    └──▶ user_portfolio_access
       │
       └──────────────────────▶ resources
                                    │
                                    └──▶ allocations
```

## Security Architecture

### Row Level Security (RLS)

```
Every Database Query
    │
    ├─▶ Extract JWT Token
    │       │
    │       └─▶ Get User ID & Role
    │
    ├─▶ Apply RLS Policy
    │       │
    │       ├─▶ Admin: Full Access
    │       ├─▶ Portfolio Manager: Portfolio Scope
    │       ├─▶ Project Manager: Project Scope
    │       └─▶ Viewer: Read-Only
    │
    └─▶ Return Filtered Results
```

### Middleware Protection

```
Request to /dashboard/*
    │
    ├─▶ Check Session Cookie
    │       │
    │       ├─▶ Valid → Allow Access
    │       └─▶ Invalid → Redirect to /auth/login
    │
    └─▶ For /auth/* routes
            │
            ├─▶ Has Session → Redirect to /dashboard
            └─▶ No Session → Allow Access
```

## State Management Architecture

### TanStack Query Cache

```
┌────────────────────────────────────────────┐
│           TanStack Query Cache             │
├────────────────────────────────────────────┤
│                                            │
│  ['projects']          → Project List      │
│  ['project', id]       → Single Project    │
│  ['budget_entries']    → Budget Data       │
│  ['resources']         → Resource List     │
│  ['allocations']       → Allocations       │
│  ['risks_issues']      → Risks/Issues      │
│  ['milestones']        → Milestones        │
│  ['dashboard_metrics'] → Dashboard KPIs    │
│                                            │
├────────────────────────────────────────────┤
│  Auto-Refetch: Window Focus, Network       │
│  Stale Time: 60 seconds                    │
│  Cache Time: 5 minutes                     │
└────────────────────────────────────────────┘
```

## Deployment Architecture (Vercel)

```
┌─────────────────────────────────────────────┐
│              GitHub Repository               │
│         (Source Code + Configuration)        │
└────────────────┬────────────────────────────┘
                 │
                 │ Git Push
                 │
┌────────────────▼────────────────────────────┐
│          Vercel Build Process               │
│  • npm install                              │
│  • next build (Static + SSR)                │
│  • Environment Variables Injection          │
└────────────────┬────────────────────────────┘
                 │
                 │ Deploy
                 │
┌────────────────▼────────────────────────────┐
│        Vercel Edge Network (CDN)            │
│  • Static Assets (HTML, CSS, JS)            │
│  • Serverless Functions (API Routes)        │
│  • Edge Middleware (Auth Check)             │
│  • Auto-Scaling                             │
└────────────────┬────────────────────────────┘
                 │
                 │ API Calls
                 │
┌────────────────▼────────────────────────────┐
│         Supabase Cloud                      │
│  • PostgreSQL Database                      │
│  • Authentication Service                   │
│  • Realtime Service                         │
│  • Storage (Future)                         │
└─────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  • React Components                          │
│  • Tailwind CSS                              │
│  • Recharts (Visualization)                  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Application Layer                    │
│  • Next.js 14 (App Router)                   │
│  • TypeScript (Type Safety)                  │
│  • React Hook Form (Forms)                   │
│  • Zod (Validation)                          │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         State Management Layer               │
│  • TanStack Query                            │
│  • Client-side Caching                       │
│  • Optimistic Updates                        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Data Access Layer                    │
│  • Supabase Client                           │
│  • Custom Hooks (useProjects, etc.)          │
│  • Type-safe API Calls                       │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         Backend Layer                        │
│  • Supabase (BaaS)                           │
│  • PostgreSQL Database                       │
│  • Row Level Security                        │
│  • Authentication Service                    │
└─────────────────────────────────────────────┘
```

## Performance Optimizations

1. **TanStack Query Caching**
   - Reduces API calls
   - Background refetching
   - Stale-while-revalidate pattern

2. **Next.js Static Generation**
   - Pre-rendered pages
   - Fast initial load
   - CDN distribution

3. **Database Indexing**
   - 15+ indexes on frequently queried columns
   - Optimized JOIN operations
   - Fast lookup by ID, status, dates

4. **Code Splitting**
   - Route-based splitting
   - Dynamic imports for charts
   - Smaller bundle sizes

5. **Edge Middleware**
   - Fast auth checks
   - Reduced server round trips
   - Better UX

## Scalability Considerations

1. **Horizontal Scaling**: Vercel serverless functions auto-scale
2. **Database Scaling**: Supabase handles connection pooling
3. **CDN Distribution**: Static assets globally distributed
4. **Caching Strategy**: Multi-layer caching (TanStack + CDN)
5. **RLS Optimization**: Indexed columns in policies

## Future Enhancements

1. **Real-time Updates**: WebSocket subscriptions
2. **File Storage**: Document attachments
3. **Advanced Analytics**: Custom reports
4. **Mobile App**: React Native version
5. **AI Integration**: Predictive analytics
6. **Batch Operations**: Bulk updates
7. **Advanced Permissions**: Fine-grained access control
