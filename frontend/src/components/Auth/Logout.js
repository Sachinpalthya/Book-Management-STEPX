import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Implement your logout logic here (API calls, clearing tokens, etc.)
    localStorage.removeItem('authToken'); // Example
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>Logging Out...</h2>
      <p>You will be redirected to the login page.</p>
    </div>
  );
};

export default Logout;