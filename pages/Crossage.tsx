import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Crossage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers la nouvelle page détaillée
    navigate('/crossage/detail', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600">Redirection vers la page du Crossage...</p>
      </div>
    </div>
  );
};

export default Crossage;