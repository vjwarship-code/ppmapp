# PPM App - Project Portfolio Management

A comprehensive Project Portfolio Management (PPM) MVP application built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## Features

### Core Functionality

#### 1. **Portfolio Dashboard**
- Real-time aggregated metrics (Total Projects, Active, Budget %, Schedule Variance %, Risk Count, Resource Utilization %)
- Visual widgets: KPI cards, budget pie chart, status bar chart, risk heatmap, upcoming milestones
- Drill-down from metrics to filtered project lists

#### 2. **Project Management**
- Create, update, archive, and view projects
- Inline editing for name, status, priority
- Full edit page for budget, dates, description
- Validation: end_date ≥ start_date, budget ≥ 0
- Search & filter by status, owner, priority, date range

#### 3. **Budget Tracking**
- Add/edit/delete budget entries (planned/actual/forecast)
- Category tracking (capex, opex, resource, vendor, misc)
- Automatic variance calculation (planned - actual)
- Monthly aggregation view

#### 4. **Resource Allocation**
- Assign multiple resources to projects
- Capacity tracking with over-allocation warnings
- Cost auto-calculation from rate × allocation %
- Resource capacity view per person

#### 5. **Risk/Issue Log**
- Create/edit/close risk and issue entries
- Probability (1-5), Impact (1-5), auto-calculated Severity (probability × impact)
- Auto color-coding: 1-5 green, 6-12 amber, 13-25 red
- Filter by severity/status
- Risk heatmap matrix visualization

#### 6. **Milestone Tracking**
- Add/edit/delete milestones
- Auto "Delayed" status if due_date < today AND not completed
- Portfolio-wide upcoming milestones list
- Timeline visualization

#### 7. **Role-Based Access Control (RBAC)**
- **Admin**: Full CRUD, user/portfolio management
- **Portfolio Manager**: CRUD projects in assigned portfolio
- **Project Manager**: CRUD assigned projects only
- **Viewer**: Read-only access
- Login with email/password (JWT + Supabase Auth)
- RLS policies enforcing role-based access

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: TanStack Query (React Query)
- **Charts**: Recharts
- **Hosting**: Vercel-ready

## Project Structure

```
ppmapp/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (redirects to dashboard)
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── projects/page.tsx
│   │       ├── budget/page.tsx
│   │       ├── resources/page.tsx
│   │       ├── risks/page.tsx
│   │       └── milestones/page.tsx
│   ├── components/
│   │   ├── ui/ (reusable UI components)
│   │   ├── dashboard/ (dashboard widgets)
│   │   ├── projects/ (project components)
│   │   ├── navigation.tsx
│   │   └── providers/
│   ├── lib/
│   │   ├── supabase.ts (Supabase client)
│   │   ├── auth.ts (authentication utilities)
│   │   ├── types.ts (TypeScript types)
│   │   ├── utils.ts (utility functions)
│   │   └── hooks.ts (TanStack Query hooks)
│   └── middleware.ts (authentication middleware)
├── db/
│   └── schema.sql (database schema with RLS)
├── .env.example
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ppmapp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `db/schema.sql`
3. Run the SQL to create all tables, indexes, RLS policies, and triggers

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Create Your First User

1. Navigate to `/auth/signup`
2. Create an account with an email and password
3. After signup, you'll be redirected to login
4. Sign in and you'll be taken to the dashboard

## Database Schema

### Core Tables

- **users** - User profiles with roles
- **portfolios** - Portfolio containers
- **user_portfolio_access** - Portfolio access permissions
- **projects** - Project records with status, priority, dates, budget
- **budget_entries** - Budget tracking (planned/actual/forecast)
- **resources** - Team resources with rates and availability
- **allocations** - Resource assignments to projects
- **risks_issues** - Risk and issue tracking with severity
- **milestones** - Project milestones with status

### Row Level Security (RLS)

All tables have RLS policies that enforce role-based access:
- Admins can access everything
- Portfolio managers can access portfolios they manage
- Project managers can access their assigned projects
- Viewers have read-only access

## Key Features

### Authentication

- Email/password authentication via Supabase
- JWT-based sessions
- Middleware protection for dashboard routes
- Automatic redirect to login for unauthenticated users

### State Management

- TanStack Query for server state
- Automatic caching and revalidation
- Optimistic updates for mutations

### Data Visualization

- Recharts for charts (bar, pie)
- Custom risk heatmap matrix
- KPI metric cards
- Real-time dashboard updates

### Form Validation

- Client-side validation with custom validation logic
- Date range validation (end >= start)
- Budget validation (>= 0)
- Required field validation

### Responsive Design

- Mobile-friendly layouts
- Tailwind CSS utility classes
- Responsive tables and charts

## API Hooks

### Projects
- `useProjects(filters)` - Fetch projects with optional filters
- `useProject(id)` - Fetch single project
- `useCreateProject()` - Create new project
- `useUpdateProject()` - Update existing project
- `useDeleteProject()` - Delete project

### Budget
- `useBudgetEntries(projectId)` - Fetch budget entries
- `useCreateBudgetEntry()` - Create budget entry
- `useUpdateBudgetEntry()` - Update budget entry
- `useDeleteBudgetEntry()` - Delete budget entry

### Resources
- `useResources()` - Fetch all resources
- `useAllocations(resourceId, projectId)` - Fetch allocations
- `useCreateResource()` - Create resource
- `useCreateAllocation()` - Create allocation

### Risks & Issues
- `useRisksIssues(projectId, type)` - Fetch risks/issues
- `useCreateRiskIssue()` - Create risk/issue
- `useUpdateRiskIssue()` - Update risk/issue

### Milestones
- `useMilestones(projectId)` - Fetch milestones
- `useCreateMilestone()` - Create milestone
- `useUpdateMilestone()` - Update milestone

### Dashboard
- `useDashboardMetrics(portfolioId)` - Fetch aggregated metrics

## Utility Functions

- `formatCurrency(amount)` - Format number as USD
- `formatDate(date)` - Format date in readable format
- `formatPercent(value)` - Format as percentage
- `getSeverityColor(severity)` - Get color for risk severity
- `getStatusColor(status)` - Get color for status badge
- `getPriorityColor(priority)` - Get color for priority badge
- `exportToCSV(data, filename)` - Export data to CSV file
- `daysUntil(date)` - Calculate days until date

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Development

### Build for Production

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Architecture Decisions

### Why Supabase?

- Built-in authentication
- PostgreSQL database with real-time capabilities
- Row Level Security for fine-grained access control
- Easy to set up and deploy

### Why TanStack Query?

- Automatic caching and background refetching
- Optimistic updates for better UX
- Built-in loading and error states
- DevTools for debugging

### Why Tailwind CSS?

- Utility-first approach for rapid development
- Consistent design system
- Small bundle size with purging
- Easy to customize

## Future Enhancements

- [ ] Real-time updates via Supabase subscriptions
- [ ] Advanced filtering and sorting
- [ ] Bulk operations
- [ ] File attachments
- [ ] Comments and activity logs
- [ ] Email notifications
- [ ] Export to PDF/Excel
- [ ] Gantt chart view
- [ ] Advanced reporting
- [ ] Mobile app

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
