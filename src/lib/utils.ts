import { type ClassValue, clsx } from 'clsx';

// Utility function for merging Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// Format percentage
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Calculate variance percentage
export function calculateVariancePercent(planned: number, actual: number): number {
  if (planned === 0) return 0;
  return ((actual - planned) / planned) * 100;
}

// Get severity color based on risk severity score (1-25)
export function getSeverityColor(severity: number): string {
  if (severity <= 5) return 'green';
  if (severity <= 12) return 'amber';
  return 'red';
}

// Get severity label
export function getSeverityLabel(severity: number): string {
  if (severity <= 5) return 'Low';
  if (severity <= 12) return 'Medium';
  return 'High';
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planned: 'blue',
    active: 'green',
    'on-hold': 'yellow',
    completed: 'gray',
    cancelled: 'red',
    open: 'red',
    'in-progress': 'yellow',
    closed: 'green',
    pending: 'blue',
    delayed: 'red',
  };
  return colors[status] || 'gray';
}

// Get priority color
export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'blue',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };
  return colors[priority] || 'gray';
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Check if date is in the past
export function isPastDate(date: string): boolean {
  return new Date(date) < new Date();
}

// Calculate days until date
export function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Validate date range
export function isValidDateRange(startDate: string, endDate: string): boolean {
  return new Date(endDate) >= new Date(startDate);
}

// Calculate total allocation for a resource across all projects
export function calculateTotalAllocation(allocations: any[]): number {
  return allocations.reduce((sum, allocation) => sum + allocation.allocation_percentage, 0);
}

// Check if allocation exceeds capacity
export function isOverAllocated(totalAllocation: number, availabilityPercent: number = 100): boolean {
  return totalAllocation > availabilityPercent;
}
