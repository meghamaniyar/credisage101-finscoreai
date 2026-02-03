import React, { useState } from 'react';
import { X, CheckCircle, TrendingUp, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Loan, LenderOffer } from '../types';

interface SwitchModalProps {
  loan: Loan;
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_LENDERS: LenderOffer[] = [
  {
    id: 'l1',
    bankName: 'HDFC Bank',
    interestRate: 10.40,
    maxAmount: 1000000,
    tenureMonths: 60,
    features: ['Zero Foreclosure', 'Instant Transfer'],
    logoColor: 'bg-blue-800',
    rating: 4.8,
    processingFee: 0
  },
  {
    id: 'l2',
    bankName: 'IDFC First',
    interestRate: 10.99,
    maxAmount: 1500000,
    tenureMonths: 48,
    features: ['Minimal Docs', 'Flexible Tenure'],
    logoColor: 'bg-red-800',
    rating: 4.5,
    processingFee: 1499
  }
];

export const SwitchModal: React.FC<SwitchModalProps> = ({ loan, isOpen, onClose }) => {
  const [step, setStep] = useState<'compare' | 'success'>('compare');

  if (!isOpen) return null;

  const handleSwitch = () => {
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const savings = loan.switchOffer?.monthlySavings || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {step === 'compare' ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Switch to Better Offer</h2>
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Comparison Hero */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800 uppercase">Total Monthly Savings</p>
                    <p className="text-3xl font-bold text-green-700">₹{savings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Current vs New */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 opacity-70">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Current Loan</p>
                  <p className="font-bold text-slate-800 text-lg">{loan.bankName}</p>
                  <p className="text-slate-600">{loan.roi}% p.a.</p>
                </div>
                <div className="p-4 border-2 border-indigo-100 rounded-lg bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-bl">RECOMMENDED</div>
                  <p className="text-xs font-semibold text-indigo-500 uppercase mb-1">New Offer</p>
                  <p className="font-bold text-indigo-900 text-lg">{loan.switchOffer?.newBankName}</p>
                  <p className="text-green-600 font-bold text-xl">{loan.switchOffer?.newRoi}% p.a.</p>
                </div>
              </div>

              {/* Benefits */}
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Why Switch?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
                  <Clock className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs font-medium text-slate-700">Switch in<br/>5 Minutes</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
                  <ShieldCheck className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs font-medium text-slate-700">Improve<br/>CIBIL Score</p>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
                  <TrendingUp className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs font-medium text-slate-700">Guaranteed<br/>Savings</p>
                </div>
              </div>

              {/* Lenders List */}
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Available Lenders</h3>
              <div className="space-y-3">
                {MOCK_LENDERS.map((lender) => (
                  <div key={lender.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${lender.logoColor} flex items-center justify-center text-white font-bold text-xs`}>
                        {lender.bankName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{lender.bankName}</p>
                        <p className="text-xs text-slate-500">{lender.features.join(' • ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{lender.interestRate}%</p>
                      <button 
                        onClick={handleSwitch}
                        className="mt-1 bg-indigo-600 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                      >
                        Switch <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h2>
            <p className="text-slate-600 mb-8 max-w-sm">
              Your request to switch your loan to {MOCK_LENDERS[0].bankName} has been approved. You will receive the new loan agreement via email shortly.
            </p>
            <button 
              onClick={onClose}
              className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};