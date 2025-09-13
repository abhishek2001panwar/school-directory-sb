"use client";
import { useAuth } from './AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Give a moment for the auth context to initialize
    const timer = setTimeout(() => {
      setChecking(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !checking && !isAuthenticated) {
      // Store the attempted URL to redirect back after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push('/auth/login');
    }
  }, [loading, checking, isAuthenticated, router, pathname]);

  // Reset checking state when pathname changes
  useEffect(() => {
    setChecking(true);
    const timer = setTimeout(() => {
      setChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading || checking) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return children;
}
