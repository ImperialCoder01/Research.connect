import React from 'react';
import { useAuth } from '../../authentication/index.js';
import { GraduationCap, LogOut, Mail, Shield, Award } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              Research<span className="text-primary">Connect</span>
            </span>
          </div>

          <button
            onClick={logout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2 bg-white border border-border hover:bg-slate-50 hover:text-foreground px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground transition"
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <div className="bg-white border border-border rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-2xl bg-primary-gradient flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-primary/20">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {user?.fullName}
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">Researcher Dashboard</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 text-slate-700 bg-[#F8FAFC] border border-border px-4 py-3 rounded-xl">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm truncate">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 bg-[#F8FAFC] border border-border px-4 py-3 rounded-xl">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm capitalize">Role: {user?.role}</span>
                </div>
              </div>

              {/* Verified status banner */}
              {user?.isVerified ? (
                <div className="inline-flex items-center space-x-2 bg-[#DCFCE7] border border-green-500/20 px-4 py-2 rounded-xl text-[#22C55E] text-sm font-semibold">
                  <Award className="h-4 w-4" />
                  <span>Account Verified</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-[#FEF3C7] border border-yellow-500/20 px-4 py-2 rounded-xl text-[#F59E0B] text-sm font-semibold">
                  <Award className="h-4 w-4" />
                  <span>Pending Email Verification</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default DashboardPage;
