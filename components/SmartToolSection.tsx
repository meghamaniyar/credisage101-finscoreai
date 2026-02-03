import React from 'react';
import { Users, Home, ArrowRight } from 'lucide-react';

interface SmartToolSectionProps {
  onGetStarted: () => void;
}

export const SmartToolSection: React.FC<SmartToolSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-[#1e3a8a] py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Personal Loans are a smart tool
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-blue-300" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Debt Consolidation</h3>
                  <p className="text-blue-200 leading-relaxed">
                    Combine high-interest credit card bills into one low-interest personal loan.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Home className="text-blue-300" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Home Renovation</h3>
                  <p className="text-blue-200 leading-relaxed">
                    Upgrade your living space without dipping into your emergency savings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#172554] rounded-3xl p-8 md:p-12 border border-blue-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Ready to get started?</h3>
            <p className="text-blue-200 mb-8 relative z-10">
              Join thousands of Indians who have taken control of their financial journey today.
            </p>
            
            <button 
              onClick={onGetStarted}
              className="w-full bg-white text-blue-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 relative z-10"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};