import React from 'react';
import { Quote } from 'lucide-react';
import Card from '../../../components/ui/Card';

const Testimonials = () => {
  const reviews = [
    {
      quote: 'Research Connect transformed how my lab updates our portfolios. The automatic citation sync saved us hours of administrative work weekly.',
      author: 'Dr. Sarah Jenkins',
      title: 'Director of AI Research, MIT',
      avatar: 'SJ'
    },
    {
      quote: 'The semantic publication discovery engine suggested three crucial papers in my domain that I missed on regular search portals.',
      author: 'Prof. David Chen',
      title: 'Department of Bioinformatics, Cambridge',
      avatar: 'DC'
    },
    {
      quote: 'An elegant collaboration portal. Sharing preprints and private drafts securely with co-authors has never been simpler.',
      author: 'Dr. Elena Rostova',
      title: 'Senior Fellow, Max Planck Institute',
      avatar: 'ER'
    }
  ];

  return (
    <section className="py-20 px-4 bg-bg-page border-b border-border">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            What Researchers Say
          </h2>
          <p className="text-base text-text-secondary">
            Hear from academic professionals and research directors cooperating globally on Research Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {reviews.map((rev, idx) => (
            <Card key={idx} className="flex flex-col bg-bg-card relative">
              <Quote className="w-8 h-8 text-slate-100 absolute top-4 right-6 pointer-events-none" />
              <p className="text-sm text-text-secondary italic leading-relaxed mb-6 flex-grow">
                "{rev.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{rev.author}</h4>
                  <p className="text-[10px] text-text-secondary">{rev.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
