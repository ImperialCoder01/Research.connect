import React from 'react';
import { UserCheck, FilePlus2, UserPlus, Cpu } from 'lucide-react';
import Card from '../../../components/ui/Card';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Create Scholar Profile',
      description: 'Fill in your research biography, department affiliations, and academic social links (ORCID, LinkedIn).',
      icon: UserCheck
    },
    {
      step: '02',
      title: 'Index Publications',
      description: 'Upload PDF files or specify digital object identifiers (DOIs) to populate your research portfolio.',
      icon: FilePlus2
    },
    {
      step: '03',
      title: 'Connect & Cooperate',
      description: 'Find matching co-authors and experts globally through verified profiles and institutional listings.',
      icon: UserPlus
    },
    {
      step: '04',
      title: 'Leverage AI Insights',
      description: 'Generate semantic research recommendation vectors and audit citation analytics in real-time.',
      icon: Cpu
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-bg-page border-b border-border">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            How It Works
          </h2>
          <p className="text-base text-text-secondary">
            A simple, step-by-step workflow designed to index and connect research portfolios effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative flex flex-col items-center group text-center">
                <Card hoverEffect={true} className="w-full bg-bg-card flex flex-col items-center p-6 h-full border border-border">
                  <div className="absolute top-4 left-6 text-4xl font-extrabold text-slate-100 group-hover:text-slate-200 transition-colors pointer-events-none select-none">
                    {item.step}
                  </div>
                  <div className="p-3 bg-light-blue text-primary rounded-xl mb-4 mt-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
