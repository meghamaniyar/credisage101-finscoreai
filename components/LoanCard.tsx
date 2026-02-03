import React from 'react';
import { Bell, BellRing, ChevronRight, TrendingDown, FileText, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { Loan } from '../types';

interface LoanCardProps {
  loan: Loan;
  onSwitch: (loan: Loan) => void;
  onUpload: (loanId: string) => void;
  onToggleReminder: (loanId: string) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onSwitch, onToggleReminder, onUpload }) => {
  const isSwitchable = loan.canSwitch && loan.switchOffer;

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
      isSwitchable 
        ? 'border-emerald-200 shadow-[0_10px_30px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-400 ring-1 ring-emerald-50' 
        : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
    }`}>
      
      {/* Top Banner / Badge */}
      {isSwitchable && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 flex items-center justify-between text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          <div className="relative flex items-center gap-1.5">
            <Sparkles size={12} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Better Rate Available</span>
          </div>
          <div className="relative flex items-center gap-1">
             <span className="text-[10px] font-bold">New ROI:</span>
             <span className="text-xs font-black">{loan.switchOffer?.newRoi}%</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-3 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 leading-tight">{loan.bankName}</h3>
            {!isSwitchable && (
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {loan.roi}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            {loan.type} • <span className="text-slate-800 font-bold">₹{loan.outstandingAmount.toLocaleString()}</span>
          </p>
        </div>
        
        <button 
          onClick={() => onToggleReminder(loan.id)}
          className={`p-2 rounded-xl transition-all border ${
            loan.reminderSet 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
          }`}
          title={loan.reminderSet ? "Reminder set" : "Set EMI reminder"}
        >
          {loan.reminderSet ? <BellRing size={16} /> : <Bell size={16} />}
        </button>
      </div>

      {/* Main Stats Area */}
      <div className="px-5 py-4 flex-1">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Current Monthly EMI</p>
            <p className="text-2xl font-black text-slate-900 leading-none">
              ₹{loan.emi.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Next Due</p>
             <p className="text-sm font-bold text-slate-700">{loan.nextEmiDate}</p>
          </div>
        </div>

        {/* Highlighted Savings Section */}
        {isSwitchable ? (
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 animate-fadeIn group/save relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/save:scale-125 transition-transform">
               <TrendingDown size={40} className="text-emerald-900" />
            </div>
            <div className="relative z-10">
               <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                 <Zap size={12} className="fill-emerald-600 text-emerald-600" />
                 Potential Savings
               </p>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-emerald-700">₹{loan.switchOffer?.monthlySavings.toLocaleString()}</span>
                 <span className="text-xs font-bold text-emerald-600">/ month</span>
               </div>
               <p className="text-[10px] text-emerald-600 mt-1 font-medium">Switch to {loan.switchOffer?.newBankName} to start saving</p>
            </div>
          </div>
        ) : (
          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden mt-2">
             <div className="h-full bg-blue-600/10 w-1/3"></div>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="p-5 pt-0 mt-auto">
        {isSwitchable ? (
          <button 
            onClick={() => onSwitch(loan)}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            <Zap size={18} className="fill-current animate-pulse" />
            <span>Switch & Save Now</span>
            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button className="flex-1 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/50">
              Full Details
            </button>
            <button 
              onClick={() => onUpload(loan.id)}
              className="flex-1 py-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100 flex items-center justify-center gap-2"
            >
              <FileText size={14} /> Upload Docs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};