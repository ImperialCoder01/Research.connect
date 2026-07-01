import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-bg-page relative overflow-hidden">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-light-blue rounded-full filter blur-[120px] opacity-70 -z-10"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 bg-white border border-border p-10 md:p-16 rounded-3xl shadow-lg relative">
        <div className="absolute top-6 right-8 text-primary opacity-10 animate-bounce">
          <Sparkles className="w-12 h-12" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
          Ready to Connect Your Research?
        </h2>
        <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
          Create your academic portfolio today, map your publication lists, and start collaborating with researchers worldwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/register')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Create Account
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
