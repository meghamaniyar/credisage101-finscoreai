import React from 'react';

const LENDERS = [
  { name: 'KreditBee', color: 'text-orange-600' },
  { name: 'Rupeek', color: 'text-orange-500' },
  { name: 'FinanceBuddha', color: 'text-blue-600' },
  { name: 'Groww', color: 'text-emerald-600' },
  { name: 'MoneyTap', color: 'text-purple-600' },
  { name: 'Bajaj Finserv', color: 'text-blue-800' },
  { name: 'Navi', color: 'text-pink-600' },
  { name: 'Paysense', color: 'text-cyan-600' },
];

export const LenderMarquee: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-slate-100 py-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-4 text-center">
         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Our Trusted Lending Partners</p>
      </div>
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 px-4">
          {[...LENDERS, ...LENDERS, ...LENDERS].map((lender, index) => (
            <div key={index} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
              {/* Fallback to stylized text since we don't have images */}
              <div className={`text-xl font-black ${lender.color} flex items-center gap-2`}>
                <div className={`w-8 h-8 rounded-lg bg-current opacity-10 flex items-center justify-center`}>
                    <span className="text-xs font-bold">{lender.name[0]}</span>
                </div>
                {lender.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};