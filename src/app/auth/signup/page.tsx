import React, { useEffect } from 'react';
import { CheckCircle } from 'react-icons/check-circle';

const SignupSuccess = ({ userName, userEmail, userRole }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/login';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircle size={40} color="green" />
            <h2>Signup Successful!</h2>
            <p>Name: {userName}</p>
            <p>Email: {userEmail}</p>
            <p>Role: {userRole}</p>
            <p>You will be redirected to the login page shortly...</p>
        </div>
    );
};

export default SignupSuccess;