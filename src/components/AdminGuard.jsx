import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminGuard({ children }) {
  const navigate = useNavigate();
  const isAuthed = sessionStorage.getItem('adminAuthed') === 'true';

  useEffect(() => {
    if (!isAuthed) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthed, navigate]);

  if (!isAuthed) return null;

  return children;
}