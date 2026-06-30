import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { forgotPasswordSchema } from '../validator/auth.validator.js';

export const ForgotPasswordPage = () => {
  const { forgotPassword, isSendingResetLink } = useAuth();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err) {
      // Error handled by hook toasts
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-3 mb-6">
          <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            Research<span className="text-primary">Connect</span>
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-8 rounded-2xl bg-white border border-border shadow-md">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-extrabold text-foreground">Forgot password?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No worries, we'll send you instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
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

                <button
                  type="submit"
                  disabled={isSendingResetLink}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-600 transition duration-200 disabled:opacity-50"
                >
                  {isSendingResetLink ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Sending Link...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We have sent password reset instructions to your email address. Please check your inbox.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-600 transition"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
