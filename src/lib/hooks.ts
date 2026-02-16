import { useEffect, useState } from 'react';
import { db } from '../db'; // Assuming you have a db.js or db.ts file where your database is initialized

// Existing usePortfolios hook
const usePortfolios = () => {
    // Your usePortfolios logic here
};

// New useUsers hook
const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetching users from the users table ordered by name
                const response = await db.collection('users').orderBy('name').get();
                const usersData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};

export { usePortfolios, useUsers };