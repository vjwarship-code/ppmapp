-- PPM Application Database Schema
-- PostgreSQL + Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USERS & AUTHENTICATION =====
-- Note: Supabase auth.users table is managed automatically
-- We create a public users table to store additional profile info

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'portfolio_manager', 'project_manager', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== PORTFOLIOS =====
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== USER PORTFOLIO ACCESS =====
CREATE TABLE IF NOT EXISTS public.user_portfolio_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('portfolio_manager', 'project_manager', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, portfolio_id)
);

-- ===== PROJECTS =====
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planned', 'active', 'on-hold', 'completed', 'cancelled')) DEFAULT 'planned',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_total NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (budget_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id),
  CONSTRAINT end_date_after_start_date CHECK (end_date >= start_date)
);

-- ===== BUDGET ENTRIES =====
CREATE TABLE IF NOT EXISTS public.budget_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('planned', 'actual', 'forecast')),
  amount NUMERIC(15, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('capex', 'opex', 'resource', 'vendor', 'misc')),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== RESOURCES =====
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  cost_rate NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost_rate >= 0),
  availability_percent INTEGER NOT NULL DEFAULT 100 CHECK (availability_percent >= 0 AND availability_percent <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== ALLOCATIONS =====
CREATE TABLE IF NOT EXISTS public.allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  allocation_percentage INTEGER NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT allocation_end_date_after_start_date CHECK (end_date >= start_date)
);

-- ===== RISKS AND ISSUES =====
CREATE TABLE IF NOT EXISTS public.risks_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('risk', 'issue')),
  title TEXT NOT NULL,
  description TEXT,
  probability INTEGER CHECK (probability >= 1 AND probability <= 5),
  impact INTEGER CHECK (impact >= 1 AND impact <= 5),
  severity INTEGER GENERATED ALWAYS AS (probability * impact) STORED,
  owner_id UUID REFERENCES public.users(id),
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'closed')) DEFAULT 'open',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== MILESTONES =====
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'delayed')) DEFAULT 'pending',
  owner_id UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_portfolios_owner_id ON public.portfolios(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolio_access_user_id ON public.user_portfolio_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolio_access_portfolio_id ON public.user_portfolio_access(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_id ON public.projects(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_budget_entries_project_id ON public.budget_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_budget_entries_date ON public.budget_entries(date);
CREATE INDEX IF NOT EXISTS idx_allocations_resource_id ON public.allocations(resource_id);
CREATE INDEX IF NOT EXISTS idx_allocations_project_id ON public.allocations(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_issues_project_id ON public.risks_issues(project_id);
CREATE INDEX IF NOT EXISTS idx_risks_issues_status ON public.risks_issues(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON public.milestones(due_date);

-- ===== ROW LEVEL SECURITY POLICIES =====

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolio_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view portfolios they have access to" ON public.portfolios
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_portfolio_access 
      WHERE portfolio_id = portfolios.id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins and portfolio owners can insert portfolios" ON public.portfolios
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins and portfolio owners can update portfolios" ON public.portfolios
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects policies
CREATE POLICY "Users can view projects in accessible portfolios" ON public.projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_portfolio_access 
      WHERE portfolio_id = projects.portfolio_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.portfolios WHERE id = projects.portfolio_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authorized users can insert projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_portfolio_access 
      WHERE portfolio_id = projects.portfolio_id 
        AND user_id = auth.uid() 
        AND role IN ('portfolio_manager', 'project_manager')
    ) OR
    EXISTS (
      SELECT 1 FROM public.portfolios WHERE id = projects.portfolio_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Authorized users can update projects" ON public.projects
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_portfolio_access 
      WHERE portfolio_id = projects.portfolio_id 
        AND user_id = auth.uid() 
        AND role IN ('portfolio_manager', 'project_manager')
    ) OR
    EXISTS (
      SELECT 1 FROM public.portfolios WHERE id = projects.portfolio_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Budget entries policies
CREATE POLICY "Users can view budget entries for accessible projects" ON public.budget_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = budget_entries.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id AND user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Authorized users can manage budget entries" ON public.budget_entries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = budget_entries.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id 
              AND user_id = auth.uid() 
              AND role IN ('portfolio_manager', 'project_manager')
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

-- Resources policies (viewable by all authenticated users)
CREATE POLICY "Authenticated users can view resources" ON public.resources
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and portfolio managers can manage resources" ON public.resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'portfolio_manager')
    )
  );

-- Allocations policies
CREATE POLICY "Users can view allocations for accessible projects" ON public.allocations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = allocations.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id AND user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Authorized users can manage allocations" ON public.allocations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = allocations.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id 
              AND user_id = auth.uid() 
              AND role IN ('portfolio_manager', 'project_manager')
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

-- Risks/Issues policies
CREATE POLICY "Users can view risks for accessible projects" ON public.risks_issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = risks_issues.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id AND user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Authorized users can manage risks" ON public.risks_issues
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = risks_issues.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id 
              AND user_id = auth.uid() 
              AND role IN ('portfolio_manager', 'project_manager')
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

-- Milestones policies
CREATE POLICY "Users can view milestones for accessible projects" ON public.milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = milestones.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id AND user_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

CREATE POLICY "Authorized users can manage milestones" ON public.milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = milestones.project_id
        AND (
          p.owner_id = auth.uid() OR
          EXISTS (
            SELECT 1 FROM public.user_portfolio_access 
            WHERE portfolio_id = p.portfolio_id 
              AND user_id = auth.uid() 
              AND role IN ('portfolio_manager', 'project_manager')
          ) OR
          EXISTS (
            SELECT 1 FROM public.portfolios WHERE id = p.portfolio_id AND owner_id = auth.uid()
          ) OR
          EXISTS (
            SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
          )
        )
    )
  );

-- ===== FUNCTIONS AND TRIGGERS =====

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_entries_updated_at BEFORE UPDATE ON public.budget_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_issues_updated_at BEFORE UPDATE ON public.risks_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
