import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authService from '../services/auth.service.js';
import {
  setCredentials,
  logOut,
  selectCurrentUser,
  selectIsAuthenticated,
  selectCurrentToken,
} from '../../../store/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      dispatch(setCredentials({ user, token: accessToken }));
      toast.success('Welcome back to Research Connect!');
      navigate('/dashboard');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logOut());
      toast.success('Logged out successfully');
      navigate('/');
    },
    onError: () => {
      // Even if API fails, clear local state
      dispatch(logOut());
      navigate('/');
    },
  });

  // Verify Email Mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (response) => {
      toast.success('Email verified successfully!');
      if (response.data?.user) {
        dispatch(setCredentials({ user: response.data.user, token }));
      }
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message || 'Password reset link sent to your email.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Request failed';
      toast.error(message);
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
    },
  });

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingResetLink: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};
