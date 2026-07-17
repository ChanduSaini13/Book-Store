import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '../services/api.js';
import { storage } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { useAuth } from '../hooks/useAuth.js';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      storage.setToken(response.data.token);
      setUser(response.data.user);
      showToast('Login successful', 'success');

      if (response.data.user.role === 'ADMIN') {
        navigate('/admin/reports');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">BookStore</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
