import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { Users2, School, BookOpenCheck, Globe } from 'lucide-react';
import Card from '../../../components/ui/Card';

const statIcons = {
  researchers: Users2,
  universities: School,
  publications: BookOpenCheck,
  countries: Globe
};

const Stats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/stats');
      return response.data;
    },
    initialData: {
      researchersCount: 1422,
      universitiesCount: 116,
      publicationsCount: 18450,
      countriesCount: 54
    }
  });

  const statItems = [
    { label: 'Registered Researchers', key: 'researchersCount', icon: Users2, color: 'text-[#2563EB]', bg: 'bg-[#DBEAFE]' },
    { label: 'Universities & Partners', key: 'universitiesCount', icon: School, color: 'text-[#4F46E5]', bg: 'bg-[#EDE9FE]' },
    { label: 'Indexed Publications', key: 'publicationsCount', icon: BookOpenCheck, color: 'text-[#22C55E]', bg: 'bg-[#DCFCE7]' },
    { label: 'Represented Countries', key: 'countriesCount', icon: Globe, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]' }
  ];

  return (
    <section className="py-16 px-4 bg-bg-card border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item) => {
            const Icon = item.icon;
            const value = stats[item.key];
            return (
              <Card key={item.key} hoverEffect={true} className="flex flex-col items-center text-center p-6 bg-bg-page/50">
                <div className={`p-4 rounded-full ${item.bg} ${item.color} mb-4 flex items-center justify-center`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-extrabold text-text-primary tracking-tight mb-1">
                  {value.toLocaleString()}
                </h3>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {item.label}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
