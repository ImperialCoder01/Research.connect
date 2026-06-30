import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { Sparkles, GraduationCap } from 'lucide-react';

export const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();

  const handleLogin = async (data) => {
    try {
      await login(data);
    } catch (err) {
      // Error handled by hook toasts
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F8FAFC]">
      {/* Left side: branding and features (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden bg-primary-gradient border-r border-border">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mbl-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>

        <Link to="/" className="flex items-center space-x-3 text-white z-10">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Research<span className="text-white/80">Connect</span>
          </span>
        </Link>

        <div className="z-10 my-auto space-y-6 max-w-md">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-xs font-semibold text-white">AI-Powered Platform</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Discover. Collaborate. Advance.
          </h1>
          <p className="text-lg text-white/80 font-medium">
            Join a global network of researchers, share your findings, and uncover hidden connections in scientific literature.
          </p>
        </div>

        <div className="z-10 text-sm text-white/65 font-medium">
          © {new Date().getFullYear()} Research Connect Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex lg:hidden justify-center items-center space-x-3 mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                Research<span className="text-primary">Connect</span>
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New to Research Connect?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-600 transition">
                Create an account
              </Link>
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-border shadow-md">
            <LoginForm onSubmit={handleLogin} isLoading={isLoggingIn} />
          </div>
        </div>
      </div>
    </div>
  );
};
