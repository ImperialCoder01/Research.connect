import React from 'react';
import Accordion from '../../../components/ui/Accordion';

const FAQ = () => {
  const faqItems = [
    {
      title: 'How does Research Connect index my publication list?',
      content: 'We query international registries using Digital Object Identifiers (DOIs) or ORCID. In future phases, we will introduce direct uploads for PDF manuscripts and Google Scholar automatic syncing.'
    },
    {
      title: 'Is my research draft data secure on the platform?',
      content: 'Yes. Our backend utilizes enterprise security standards including Helmet protection, rate limiting, secure cookies, and strict JWT verification scopes to isolate project workspaces.'
    },
    {
      title: 'Can I add registered co-authors to my publications?',
      content: 'Certainly. The profile schema supports linked co-authors so that any publication indexed on the platform links back directly to the registered accounts of everyone involved.'
    },
    {
      title: 'What does the Phase 0 Foundation release include?',
      content: 'Phase 0 establishes the complete database structure, Winston logger, generic CRUD repositories, standard API response layers, and a responsive frontend client landing page UI. Business logic and modules like authentication and scholar sync will roll out in future phases.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-bg-card border-b border-border">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-text-secondary">
            Find answers to common questions about Research Connect and Phase 0 features.
          </p>
        </div>

        <Accordion items={faqItems} />
      </div>
    </section>
  );
};

export default FAQ;
