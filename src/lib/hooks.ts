// TanStack Query Hooks for PPM Application
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import type {
  Project,
  Portfolio,
  BudgetEntry,
  Resource,
  Allocation,
  RiskIssue,
  Milestone,
  DashboardMetrics,
  ProjectFilters,
} from './types';

// ===== PROJECTS =====

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*, portfolio:portfolios(*), owner:users(*)');

      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.priority && filters.priority.length > 0) {
        query = query.in('priority', filters.priority);
      }
      if (filters?.owner_id) {
        query = query.eq('owner_id', filters.owner_id);
      }
      if (filters?.portfolio_id) {
        query = query.eq('portfolio_id', filters.portfolio_id);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.start_date) {
        query = query.gte('start_date', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('end_date', filters.end_date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, portfolio:portfolios(*), owner:users(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Project;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...project, created_by: user?.id, updated_by: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...project }: Partial<Project> & { id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('projects')
        .update({ ...project, updated_by: user?.id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// ===== PORTFOLIOS =====

export function usePortfolios() {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*, owner:users(*)')
        .order('name');

      if (error) throw error;
      return data as Portfolio[];
    },
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portfolio: Partial<Portfolio>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('portfolios')
        .insert({ ...portfolio, owner_id: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...portfolio }: Partial<Portfolio> & { id: string }) => {
      const { data, error } = await supabase
        .from('portfolios')
        .update(portfolio)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
}

// ===== BUDGET ENTRIES =====

export function useBudgetEntries(projectId?: string) {
  return useQuery({
    queryKey: ['budget_entries', projectId],
    queryFn: async () => {
      let query = supabase.from('budget_entries').select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      return data as BudgetEntry[];
    },
  });
}

export function useCreateBudgetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Partial<BudgetEntry>) => {
      const { data, error } = await supabase
        .from('budget_entries')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget_entries'] });
    },
  });
}

export function useUpdateBudgetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...entry }: Partial<BudgetEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('budget_entries')
        .update(entry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget_entries'] });
    },
  });
}

export function useDeleteBudgetEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budget_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget_entries'] });
    },
  });
}

// ===== RESOURCES =====

export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Resource[];
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resource: Partial<Resource>) => {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

// ===== ALLOCATIONS =====

export function useAllocations(resourceId?: string, projectId?: string) {
  return useQuery({
    queryKey: ['allocations', resourceId, projectId],
    queryFn: async () => {
      let query = supabase
        .from('allocations')
        .select('*, resource:resources(*), project:projects(*)');

      if (resourceId) {
        query = query.eq('resource_id', resourceId);
      }
      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) throw error;
      return data as Allocation[];
    },
  });
}

export function useCreateAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allocation: Partial<Allocation>) => {
      const { data, error } = await supabase
        .from('allocations')
        .insert(allocation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
    },
  });
}

// ===== RISKS & ISSUES =====

export function useRisksIssues(projectId?: string, type?: 'risk' | 'issue') {
  return useQuery({
    queryKey: ['risks_issues', projectId, type],
    queryFn: async () => {
      let query = supabase
        .from('risks_issues')
        .select('*, project:projects(*), owner:users(*)');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('severity', { ascending: false });

      if (error) throw error;
      return data as RiskIssue[];
    },
  });
}

export function useCreateRiskIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (riskIssue: Partial<RiskIssue>) => {
      const { data, error } = await supabase
        .from('risks_issues')
        .insert(riskIssue)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks_issues'] });
    },
  });
}

export function useUpdateRiskIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...riskIssue }: Partial<RiskIssue> & { id: string }) => {
      const { data, error } = await supabase
        .from('risks_issues')
        .update(riskIssue)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risks_issues'] });
    },
  });
}

// ===== MILESTONES =====

export function useMilestones(projectId?: string) {
  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      let query = supabase
        .from('milestones')
        .select('*, project:projects(*), owner:users(*)');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) throw error;
      return data as Milestone[];
    },
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestone: Partial<Milestone>) => {
      const { data, error } = await supabase
        .from('milestones')
        .insert(milestone)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...milestone }: Partial<Milestone> & { id: string }) => {
      const { data, error } = await supabase
        .from('milestones')
        .update(milestone)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

// ===== DASHBOARD METRICS =====

export function useDashboardMetrics(portfolioId?: string) {
  return useQuery({
    queryKey: ['dashboard_metrics', portfolioId],
    queryFn: async () => {
      // Get all projects
      let projectsQuery = supabase.from('projects').select('*');
      if (portfolioId) {
        projectsQuery = projectsQuery.eq('portfolio_id', portfolioId);
      }
      const { data: projects } = await projectsQuery;

      // Get budget entries
      const { data: budgetEntries } = await supabase
        .from('budget_entries')
        .select('*');

      // Get risks
      const { data: risks } = await supabase
        .from('risks_issues')
        .select('*')
        .eq('status', 'open');

      // Get allocations
      const { data: allocations } = await supabase
        .from('allocations')
        .select('*, resource:resources(*)');

      // Calculate metrics
      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;

      const totalPlanned = budgetEntries?.filter(e => e.type === 'planned')
        .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0) || 0;
      const totalActual = budgetEntries?.filter(e => e.type === 'actual')
        .reduce((sum, e) => sum + parseFloat(String(e.amount)), 0) || 0;

      const budgetUtilization = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

      // Calculate schedule variance (simplified: based on completed vs total)
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      const scheduleVariance = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

      const riskCount = risks?.length || 0;

      // Calculate resource utilization
      const totalAllocations = allocations?.reduce((sum, a) => sum + a.allocation_percentage, 0) || 0;
      const resourceCount = allocations?.length || 1;
      const resourceUtilization = resourceCount > 0 ? totalAllocations / resourceCount : 0;

      const metrics: DashboardMetrics = {
        total_projects: totalProjects,
        active_projects: activeProjects,
        budget_utilization_percent: budgetUtilization,
        schedule_variance_percent: scheduleVariance,
        risk_count: riskCount,
        resource_utilization_percent: resourceUtilization,
      };

      return metrics;
    },
  });
}
