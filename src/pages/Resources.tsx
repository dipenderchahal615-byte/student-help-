import { Library, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Study & Learning',
    links: [
      { name: 'Khan Academy', url: 'https://www.khanacademy.org', desc: 'Free online courses, lessons and practice.' },
      { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Build skills with courses, certificates, and degrees online.' },
      { name: 'edX', url: 'https://www.edx.org', desc: 'Access 2000 free online courses from 140 leading institutions.' }
    ]
  },
  {
    title: 'Coding & Tech Skills',
    links: [
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', desc: 'Learn to code for free. Build projects. Earn certifications.' },
      { name: 'Codecademy', url: 'https://www.codecademy.com', desc: 'Learn the technical skills you need for the job you want.' },
      { name: 'LeetCode', url: 'https://leetcode.com', desc: 'The best platform to help you enhance your skills.' }
    ]
  },
  {
    title: 'Career & Resume',
    links: [
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', desc: 'Keep learning in the moments that matter.' },
      { name: 'Indeed Career Guide', url: 'https://www.indeed.com/career-advice', desc: 'Career tips, resume templates and interview advice.' }
    ]
  }
];

export default function Resources() {
  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
          <Library size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Resources</h1>
          <p className="text-slate-500 mt-1">Verified links for free learning, courses, and career advice.</p>
        </div>
      </div>

      <div className="grid gap-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">{cat.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md hover:border-indigo-200 transition-all group block"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{link.name}</h3>
                    <ExternalLink size={16} className="text-slate-400 group-hover:text-indigo-500" />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
