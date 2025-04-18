import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/register/clave');
  }, [navigate]);
  return null;
};

export default Register; 