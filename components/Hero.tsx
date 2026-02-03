import React, { useState, useRef } from 'react';
import { ShieldCheck, Clock, Zap, FileText } from 'lucide-react';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { SmartToolSection } from './SmartToolSection';
import { LenderMarquee } from './LenderMarquee';

interface HeroProps {
  onStart: (mobile: string, pan: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [mobile, setMobile] = useState('');
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate processing delay
    setTimeout(() => {
      onStart(mobile, pan);
    }, 1500);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Fold */}
      <div className="min-h-[85vh] md:min-h-[90vh] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-20">
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center relative z-10">
          
          {/* Text Content */}
          <div className="text-white space-y-6 md:space-y-8 text-center md:text-left mt-4 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Lenders: 45+
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Instant Loans. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Zero Bank Visits.</span>
            </h1>
            
            <p className="text-base md:text-xl text-blue-100 max-w-lg mx-auto md:mx-0 leading-relaxed opacity-90 hidden md:block">
              Check your CIBIL score for free and unlock pre-approved offers from India's top lenders in just 5 minutes.
            </p>
            {/* Mobile simplified text */}
            <p className="text-sm text-blue-100 max-w-xs mx-auto leading-relaxed opacity-90 md:hidden">
              Check CIBIL score & unlock offers in 5 mins.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm font-semibold text-blue-200">
              <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-400/20">
                <Zap size={16} className="text-yellow-400" /> 5-Min Approval
              </div>
              <div className="flex items-center gap-2 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-400/20">
                <FileText size={16} className="text-green-400" /> No paperwork, fully digital
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div ref={formRef} className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 transform transition hover:scale-[1.01] duration-500 border border-blue-100 mx-auto w-full max-w-md md:max-w-full">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block p-2 md:p-3 rounded-full bg-blue-50 mb-3 md:mb-4">
                 <ShieldCheck className="text-blue-600 w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Check Eligibility</h2>
              <p className="text-sm md:text-base text-slate-500 mt-1 md:mt-2">Unlock offers up to <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">₹25 Lakhs</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">Mobile Number</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-blue-600 transition-colors pointer-events-none">+91</span>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 text-base md:text-lg"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">PAN Number</label>
                <input 
                  type="text" 
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 uppercase text-base md:text-lg"
                  required
                  maxLength={10}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base md:text-lg"
              >
                {loading ? (
                  <>
                    <Clock className="animate-spin" size={24} /> Checking...
                  </>
                ) : (
                  "Check My Offers"
                )}
              </button>
              
              <p className="text-[10px] md:text-xs text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck size={12} className="text-green-500"/> Data is encrypted & secure. Soft inquiry only.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Lender Marquee */}
      <LenderMarquee />

      {/* New Sections */}
      <FeaturesSection />
      <TestimonialsSection />
      <SmartToolSection onGetStarted={scrollToForm} />

    </div>
  );
};