'use client';

import { useState } from 'react';
import { usePortfolios, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/lib/hooks';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { PortfolioTable } from '@/components/portfolios/portfolio-table';
import { PortfolioForm } from '@/components/portfolios/portfolio-form';
import type { Portfolio, PortfolioFormData } from '@/lib/types';

export default function PortfoliosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | undefined>();

  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
  const createPortfolio = useCreatePortfolio();
  const updatePortfolio = useUpdatePortfolio();
  const deletePortfolio = useDeletePortfolio();

  const handleCreate = () => {
    setEditingPortfolio(undefined);
    setShowForm(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio? This will not delete associated projects.')) {
      try {
        await deletePortfolio.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        alert('Failed to delete portfolio. Please try again.');
      }
    }
  };

  const handleSubmit = async (data: PortfolioFormData) => {
    try {
      if (editingPortfolio) {
        await updatePortfolio.mutateAsync({ id: editingPortfolio.id, ...data });
      } else {
        await createPortfolio.mutateAsync(data);
      }
      setShowForm(false);
      setEditingPortfolio(undefined);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Failed to save portfolio. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPortfolio(undefined);
  };

  if (portfoliosLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Portfolios</h1>
              <p className="text-gray-600 mt-1">
                Manage your portfolio collection
              </p>
            </div>
            {!showForm && (
              <Button onClick={handleCreate}>
                Create Portfolio
              </Button>
            )}
          </div>
        </div>

        {showForm ? (
          <PortfolioForm
            portfolio={editingPortfolio}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        ) : (
          <PortfolioTable
            portfolios={portfolios}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
