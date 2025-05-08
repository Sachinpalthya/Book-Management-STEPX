import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../common/InputField';
import Button from '../common/Button';

const RegisterForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, state, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    
    // Clear field-specific error when user types
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!credentials.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      const { name, email, password } = credentials;
      await register({ name, email, password });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an account</h2>
      
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {state.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={credentials.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={credentials.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={credentials.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
        
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={credentials.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Creating account...' : 'Register'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;