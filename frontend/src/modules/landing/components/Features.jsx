import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { Compass, Users, FileText, Sparkles, BarChart3, GraduationCap } from 'lucide-react';
import Card from '../../../components/ui/Card';

const iconMap = {
  discovery: Compass,
  collaboration: Users,
  publications: FileText,
  'ai-recs': Sparkles,
  analytics: BarChart3,
  'scholar-integration': GraduationCap
};

const Features = () => {
  const { data: featuresData, isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const response = await axiosInstance.get('/features');
      return response.data;
    },
    // Fallback if backend is not started
    initialData: [
      { featureId: 'discovery', title: 'Research Discovery', description: 'Discover relevant research articles and preprints semantically parsed with AI.', isComingSoon: false },
      { featureId: 'collaboration', title: 'Research Collaboration', description: 'Connect with co-authors, share private workspace drafts, and cooperate on publications.', isComingSoon: false },
      { featureId: 'publications', title: 'Publication Management', description: 'Upload, manage, and index your academic publications easily on a single profile.', isComingSoon: false },
      { featureId: 'ai-recs', title: 'AI Recommendation', description: 'Get automated, personalized recommendations of research items matching your expertise.', isComingSoon: false },
      { featureId: 'analytics', title: 'Research Analytics', description: 'Track citation counts, reads, profile views, and index metrics over time.', isComingSoon: false },
      { featureId: 'scholar-integration', title: 'Google Scholar Integration', description: 'Sync your publications and citation statistics from Google Scholar automatically.', isComingSoon: true }
    ]
  });

  return (
    <section id="features" className="py-20 px-4 bg-bg-page border-b border-border">
      <div className="max-w-7xl mx-auto text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Platform Capabilities
          </h2>
          <p className="text-base text-text-secondary">
            Research Connect provides a comprehensive suite of tools designed specifically to accelerate academic publishing and improve networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {featuresData.map((feat) => {
            const Icon = iconMap[feat.featureId] || Compass;
            return (
              <Card key={feat.featureId} className="flex flex-col h-full bg-bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-light-blue text-primary rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                      {feat.title}
                      {feat.isComingSoon && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-light-orange text-accent-orange border border-amber-200">
                          Soon
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed flex-grow">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
