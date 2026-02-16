'use client';

import { useState } from 'react';
import { useProjects, usePortfolios, useCreateProject, useUpdateProject, useDeleteProject, useUsers } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoadingPage } from '@/components/ui/loading';
import { ProjectTable } from '@/components/projects/project-table';
import { ProjectForm } from '@/components/projects/project-form';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: projects = [], isLoading: projectsLoading } = useProjects({
    search: searchTerm || undefined,
    status: statusFilter ? [statusFilter as any] : undefined,
  });
  const { data: portfolios = [] } = usePortfolios();
  const { data: users = [] } = useUsers();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = () => {
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...data });
      } else {
        await createProject.mutateAsync(data);
      }
      setShowForm(false);
      setEditingProject(undefined);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(undefined);
  };

  if (projectsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage your project portfolio
              </p>
            </div>
            {!showForm && (
              <Button onClick={handleCreate}>
                Create Project
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <ProjectForm
            project={editingProject}
            portfolios={portfolios}
            users={users}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="max-w-xs"
              >
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>

            <ProjectTable
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}