import React from 'react';
import { useUsers } from '../hooks/useUsers';

const ProjectsPage = () => {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;