import { useUsers } from 'path/to/useUsers';

const DashboardProjectsPage = () => {
    const users = useUsers();
    console.log('Debugging users data:', users);

    // Rest of your component logic...

    return (
        <div>
            {/* Your component JSX... */}
        </div>
    );
};

export default DashboardProjectsPage;