import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMap = {
  '/': 'Marathon Hub - Manage Your Marathon Events',
  '/login': 'Login - Marathon Hub',
  '/register': 'Register - Marathon Hub',
  '/marathons': 'Browse Marathons - Marathon Hub',
  '/add-marathon': 'Create Marathon - Marathon Hub',
  '/my-marathons': 'My Marathons - Marathon Hub',
  '/my-applications': 'My Applications - Marathon Hub',
};

export function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = 'Marathon Hub';
    const pathname = location.pathname;
    
    if (pathname.startsWith('/marathon/')) {
      document.title = 'Marathon Details - Marathon Hub';
    } else {
      document.title = titleMap[pathname] || baseTitle;
    }
  }, [location]);
}