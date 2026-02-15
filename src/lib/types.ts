// TypeScript Type Definitions for PPM Application

export type UserRole = 'admin' | 'portfolio_manager' | 'project_manager' | 'viewer';
export type ProjectStatus = 'planned' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type BudgetType = 'planned' | 'actual' | 'forecast';
export type BudgetCategory = 'capex' | 'opex' | 'resource' | 'vendor' | 'misc';
export type RiskIssueType = 'risk' | 'issue';
export type RiskIssueStatus = 'open' | 'in-progress' | 'closed';
export type MilestoneStatus = 'pending' | 'completed' | 'delayed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserPortfolioAccess {
  id: string;
  user_id: string;
  portfolio_id: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  portfolio_id: string;
  owner_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  end_date: string;
  budget_total: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface BudgetEntry {
  id: string;
  project_id: string;
  type: BudgetType;
  amount: number;
  category: BudgetCategory;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  cost_rate: number;
  availability_percent: number;
  created_at: string;
}

export interface Allocation {
  id: string;
  resource_id: string;
  project_id: string;
  start_date: string;
  end_date: string;
  allocation_percentage: number;
  created_at: string;
}

export interface RiskIssue {
  id: string;
  project_id: string;
  type: RiskIssueType;
  title: string;
  description: string | null;
  probability: number | null;
  impact: number | null;
  severity: number | null;
  owner_id: string | null;
  status: RiskIssueStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string;
  status: MilestoneStatus;
  owner_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Dashboard Metrics Types
export interface DashboardMetrics {
  total_projects: number;
  active_projects: number;
  budget_utilization_percent: number;
  schedule_variance_percent: number;
  risk_count: number;
  resource_utilization_percent: number;
}

export interface BudgetSummary {
  total_planned: number;
  total_actual: number;
  total_forecast: number;
  variance: number;
  variance_percent: number;
}

export interface ProjectWithDetails extends Project {
  portfolio?: Portfolio;
  owner?: User;
  budget_summary?: BudgetSummary;
  risk_count?: number;
  milestone_count?: number;
}

// Form Types
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  end_date: string;
  budget_total: number;
  portfolio_id: string;
  owner_id: string;
}

export interface BudgetEntryFormData {
  type: BudgetType;
  amount: number;
  category: BudgetCategory;
  date: string;
  notes: string;
  project_id: string;
}

export interface ResourceFormData {
  name: string;
  role: string;
  cost_rate: number;
  availability_percent: number;
}

export interface AllocationFormData {
  resource_id: string;
  project_id: string;
  start_date: string;
  end_date: string;
  allocation_percentage: number;
}

export interface RiskIssueFormData {
  type: RiskIssueType;
  title: string;
  description: string;
  probability: number;
  impact: number;
  status: RiskIssueStatus;
  due_date: string;
  project_id: string;
  owner_id: string;
}

export interface MilestoneFormData {
  title: string;
  due_date: string;
  status: MilestoneStatus;
  notes: string;
  project_id: string;
  owner_id: string;
}

// Filter Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  owner_id?: string;
  portfolio_id?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface RiskFilters {
  status?: RiskIssueStatus[];
  type?: RiskIssueType[];
  severity_min?: number;
  severity_max?: number;
}
