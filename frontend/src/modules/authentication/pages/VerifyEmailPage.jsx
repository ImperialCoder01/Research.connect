import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { CheckCircle2, XCircle, Loader2, GraduationCap } from 'lucide-react';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };
    triggerVerification();
  }, [token]);

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
        <div className="p-8 rounded-2xl bg-white border border-border shadow-md text-center">
          {status === 'verifying' && (
            <div className="py-6 space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Verifying your email</h3>
              <p className="text-sm text-muted-foreground">Please wait while we confirm your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 space-y-4">
              <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Verification Complete</h3>
              <p className="text-sm text-muted-foreground">Thank you! Your email has been verified. You can now log in to your account.</p>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-600 transition duration-200"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6 space-y-4">
              <XCircle className="h-14 w-14 text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Verification Failed</h3>
              <p className="text-sm text-muted-foreground">The verification link is invalid or has expired. Please request a new verification email or try again.</p>
              <div className="pt-4 space-y-3">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 border border-slate-800 hover:bg-slate-850 transition duration-200"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
