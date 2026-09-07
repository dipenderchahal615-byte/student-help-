import React from 'react';
import { motion } from 'motion/react';
import { SEO } from '../components/SEO';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: { title: string; content: string[] }[];
}

export default function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <SEO title={title} description={`Read our ${title} to learn about our policies and terms.`} />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <h1 className="text-4xl font-black text-slate-800 mb-4">{title}</h1>
          <p className="text-slate-500 mb-10">Last Updated: {lastUpdated}</p>
          
          <div className="space-y-10 text-slate-700 leading-relaxed">
            {sections.map((sec, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{sec.title}</h2>
                {sec.content.map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
