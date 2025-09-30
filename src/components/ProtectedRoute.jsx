'use client';

import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
      } else {
        setIsAuthed(true);
      }
      setIsChecking(false);
    };
    
    checkAuth();
  }, [router]);

  if (isChecking) {
    return null; // or a loading spinner
  }

  return isAuthed ? children : null;
};

export default ProtectedRoute;