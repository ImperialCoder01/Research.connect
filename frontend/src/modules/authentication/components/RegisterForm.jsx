import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { registerSchema } from '../validator/auth.validator.js';

export const RegisterForm = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="firstName">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              id="firstName"
              type="text"
              placeholder="Isaac"
              {...register('firstName')}
              className={`block w-full pl-11 pr-4 py-3 bg-white border ${
                errors.firstName ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-border focus:ring-primary/20 focus:border-primary'
              } rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-4 transition duration-200`}
            />
          </div>
          {errors.firstName && (
            <p className="mt-1.5 text-xs text-red-550 font-medium">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="lastName">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-5 w-5" />
            </div>
            <input
              id="lastName"
              type="text"
              placeholder="Newton"
              {...register('lastName')}
              className={`block w-full pl-11 pr-4 py-3 bg-white border ${
                errors.lastName ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-border focus:ring-primary/20 focus:border-primary'
              } rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-4 transition duration-200`}
            />
          </div>
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-550 font-medium">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
          Academic/Professional Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="isaac.newton@cam.ac.uk"
            {...register('email')}
            className={`block w-full pl-11 pr-4 py-3 bg-white border ${
              errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-border focus:ring-primary/20 focus:border-primary'
            } rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-4 transition duration-200`}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-550 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={`block w-full pl-11 pr-4 py-3 bg-white border ${
              errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-border focus:ring-primary/20 focus:border-primary'
            } rounded-xl text-foreground placeholder-slate-400 focus:outline-none focus:ring-4 transition duration-200`}
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-550 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-start">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4.5 w-4.5 mt-0.5 rounded border-border bg-white text-primary focus:ring-primary/20 focus:ring-offset-white"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
          I agree to the{' '}
          <a href="#" className="text-primary hover:text-primary-600 transition">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:text-primary-600 transition">
            Privacy Policy
          </a>.
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="relative group w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary/20 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition duration-300 ease-out -z-10"></span>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
