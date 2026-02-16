import React, { useEffect } from 'react';
import { CheckCircle } from 'react-icons/check-circle';

const SignupSuccess = ({ userName, userEmail, userRole }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/auth/login';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <CheckCircle size={48} color="#16a34a" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                    Signup Successful! ✅
                </h2>
                <div style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '16px',
                    textAlign: 'left'
                }}>
                    <p style={{ margin: '8px 0', color: '#374151' }}>
                        <strong>Name:</strong> {userName}
                    </p>
                    <p style={{ margin: '8px 0', color: '#374151' }}>
                        <strong>Email:</strong> {userEmail}
                    </p>
                    <p style={{ margin: '8px 0', color: '#374151' }}>
                        <strong>Role:</strong> {userRole}
                    </p>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    You will be redirected to the login page shortly...
                </p>
            </div>
        </div>
    );
};

export default SignupSuccess;
