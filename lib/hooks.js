"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Custom hook to handle page refresh and navigation
export function usePageRefresh() {
  const router = useRouter();

  const refreshPage = () => {
    router.refresh();
  };

  const navigateWithRefresh = (path) => {
    router.push(path);
    setTimeout(() => router.refresh(), 100);
  };

  return { refreshPage, navigateWithRefresh };
}

// Custom hook to handle authentication-aware navigation
export function useAuthNavigation() {
  const router = useRouter();

  const navigateToLogin = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    router.push('/auth/login');
  };

  const navigateAfterAuth = () => {
    const redirectTo = sessionStorage.getItem('redirectAfterLogin');
    if (redirectTo) {
      sessionStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
    } else {
      router.push('/');
    }
  };

  return { navigateToLogin, navigateAfterAuth };
}
