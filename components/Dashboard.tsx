import React, { useEffect, useState } from 'react';
import { UserProfile, Loan, LoanType, LoanApplication } from '../types';
import { LoanCard } from './LoanCard';
import { getDashboardInsights } from '../services/geminiService';
import { Sparkles, Trophy, AlertTriangle, Zap, TrendingUp, ShieldAlert, Bot, LayoutGrid } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  onSwitchLoan: (loan: Loan) => void;
  skipIntro?: boolean;
  applications?: LoanApplication[];
}

const getScoreConfig = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', mainBg: 'bg-green-50', border: 'border-green-100', icon: Trophy };
  if (score >= 650) return { label: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-100', mainBg: 'bg-yellow-50', border: 'border-yellow-100', icon: TrendingUp };
  if (score >= 550) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-100', mainBg: 'bg-orange-50', border: 'border-orange-100', icon: AlertTriangle };
  return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100', mainBg: 'bg-red-50', border: 'border-red-100', icon: ShieldAlert };
};

export const Dashboard: React.FC<DashboardProps> = ({ user, loans, setLoans, onSwitchLoan, skipIntro = false, applications = [] }) => {
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [initialLoading, setInitialLoading] = useState(!skipIntro);
  const [showScore, setShowScore] = useState(skipIntro);
  const [filter, setFilter] = useState<'ALL' | 'LOAN' | 'CARD'>('ALL');

  const scoreConfig = getScoreConfig(user.cibilScore);
  const isVip = user.cibilScore >= 750;

  useEffect(() => {
    if (!skipIntro) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
        setTimeout(() => setShowScore(true), 100); 
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [skipIntro]);

  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => setLoadingInsights(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  const handleToggleReminder = (id: string) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, reminderSet: !l.reminderSet } : l));
  };

  const handleUpload = (id: string) => {
    alert("Parsing document for latest loan status...");
  };

  const filteredLoans = loans.filter(l => {
    if (filter === 'ALL') return true;
    if (filter === 'CARD') return l.type === LoanType.CREDIT_CARD;
    return l.type !== LoanType.CREDIT_CARD;
  });

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlertIcon className="text-blue-600 w-8 h-8 opacity-50" />
          </div>
        </div>
        <h2 className="mt-8 text-xl font-bold text-slate-800">Analyzing Your Profile...</h2>
        <p className="text-slate-500 mt-2">Connecting with Credit Bureau</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Top Header Section with CIBIL Score */}
      <div className={`rounded-3xl p-8 mb-10 ${scoreConfig.mainBg} border ${scoreConfig.border} transition-all duration-700 transform ${showScore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 shadow-none'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-2">
               <scoreConfig.icon className={`w-6 h-6 ${scoreConfig.color}`} />
               <span className={`font-bold uppercase tracking-wide text-sm ${scoreConfig.color}`}>{scoreConfig.label} Credit Score</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              {isVip 
                ? "Excellent Profile! You've unlocked premium loan offers." 
                : "Good Start. Let's optimize your current loan portfolio."
              }
             </h1>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">CIBIL SCORE</span>
            <div className={`text-7xl font-bold tabular-nums tracking-tighter transition-all duration-1000 transform ${showScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} ${scoreConfig.color}`}>
              {user.cibilScore}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
               <Zap size={16} className="fill-indigo-600" />
               Potential for Annual Savings: ₹{(loans.reduce((acc, l) => acc + (l.switchOffer?.monthlySavings || 0), 0) * 12).toLocaleString()}
            </div>
          </div>
          <p className="text-slate-500 text-sm">
             Switching to better rates can save you money and improve your debt-to-income ratio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6" id="active-loans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="text-slate-400" size={20} />
              <h3 className="text-xl font-black text-slate-900">Your Active Portfolio</h3>
            </div>
            <div className="flex gap-2">
               {['ALL', 'LOAN', 'CARD'].map(t => (
                 <button 
                   key={t}
                   onClick={() => setFilter(t as any)}
                   className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${filter === t ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                 >
                   {t === 'ALL' ? 'All Accounts' : t === 'LOAN' ? 'Active Loans' : 'Credit Cards'}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLoans.map(loan => (
              <LoanCard 
                key={loan.id} 
                loan={loan} 
                onSwitch={onSwitchLoan}
                onUpload={handleUpload}
                onToggleReminder={handleToggleReminder}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div id="ai-insights" className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden relative group">
             <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 text-white relative">
                <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                     <Bot className="text-white" size={24} />
                   </div>
                   <h3 className="text-xl font-black">Sage Gyani's Plan</h3>
                </div>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                  I've analyzed your portfolio. Here is your path to financial mastery.
                </p>
             </div>

             <div className="p-6 space-y-5">
               {loadingInsights ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-12 bg-slate-100 rounded-2xl"></div>
                    <div className="h-12 bg-slate-100 rounded-2xl"></div>
                  </div>
               ) : (
                 <div className="space-y-4">
                   <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                     <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">1</div>
                     <p className="text-sm text-slate-700 font-medium">Switch your <span className="font-black text-slate-900">Personal Loan</span> to IDFC for immediate savings.</p>
                   </div>
                   <div className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                     <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-sm">2</div>
                     <p className="text-sm text-slate-700 font-medium">Clear <span className="font-black text-slate-900">Credit Card</span> dues by 12th Oct to avoid high ROI.</p>
                   </div>
                 </div>
               )}
               <button className="w-full mt-2 py-4 bg-indigo-50 text-indigo-700 font-black rounded-2xl text-sm hover:bg-indigo-100 transition-all active:scale-[0.98]">
                 Deep Dive with Gyani
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldAlertIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);