import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = false; // Replace with actual authentication logic
        if (isAuthenticated) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [router]);

    return <div>Loading...</div>;
};

export default Page;