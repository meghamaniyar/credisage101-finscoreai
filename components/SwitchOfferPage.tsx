import React, { useState } from 'react';
import { ArrowLeft, Zap, TrendingUp, TrendingDown, Star, CheckCircle, X, BadgeCheck, ShieldCheck, Clock } from 'lucide-react';
import { Loan, LenderOffer } from '../types';

interface SwitchOfferPageProps {
  loan: Loan;
  onBack: (success?: boolean) => void;
}

const MOCK_LENDERS: LenderOffer[] = [
  {
    id: 'l1',
    bankName: 'HDFC Bank',
    interestRate: 10.40,
    maxAmount: 1000000,
    tenureMonths: 60,
    features: ['Zero Foreclosure', 'Instant Transfer'],
    logoColor: 'bg-[#004c8f]',
    rating: 4.8,
    processingFee: 0
  },
  {
    id: 'l2',
    bankName: 'Kotak Mahindra Bank',
    interestRate: 10.52,
    maxAmount: 1500000,
    tenureMonths: 60,
    features: ['Minimal Docs', 'Flexible Tenure'],
    logoColor: 'bg-[#ed1b24]',
    rating: 4.7,
    processingFee: 499
  },
  {
    id: 'l3',
    bankName: 'ICICI Bank',
    interestRate: 10.60,
    maxAmount: 1200000,
    tenureMonths: 60,
    features: ['Paperless', 'Pre-approved'],
    logoColor: 'bg-[#f37e20]',
    rating: 4.6,
    processingFee: 999
  }
];

export const SwitchOfferPage: React.FC<SwitchOfferPageProps> = ({ loan, onBack }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedLender, setSelectedLender] = useState<LenderOffer | null>(null);

  const handleInitiateSwitch = (lender: LenderOffer) => {
    setSelectedLender(lender);
    setShowConfirmModal(true);
  };

  const handleConfirmSwitch = () => {
    // Logic for confirming switch
    // Simulate API call delay
    setTimeout(() => {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
    }, 1000);
  };

  const handleBackToDashboard = () => {
      onBack(true); // Signal success to skip loader
  };

  const savings = loan.switchOffer?.monthlySavings || 5600;
  const totalSavings = savings * 215; // Mock calculation based on image example

  return (
    <div className="min-h-screen bg-slate-50 animate-fadeIn pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-[#6200EE] text-white px-4 py-4 z-50 shadow-md flex items-center gap-4">
        <button onClick={() => onBack(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-medium">Switch to Better Offer</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Current Loan Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <span className="text-2xl">🏦</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Current Loan</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Lender</p>
              <p className="font-semibold text-slate-900">{loan.bankName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Type</p>
              <p className="font-semibold text-slate-900">{loan.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Interest Rate</p>
              <p className="font-semibold text-slate-900">{loan.roi}% p.a.</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Outstanding</p>
              <p className="font-semibold text-slate-900">₹{loan.outstandingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <SparklesIcon className="text-emerald-600" />
            <h2 className="text-lg font-bold text-emerald-900">Benefits of Switching</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <BenefitCard 
              icon={<Zap className="text-blue-500 fill-blue-100" size={32} />}
              title="Switch in 5 Minutes"
              desc="100% digital process with instant approval"
            />
            <BenefitCard 
              icon={<TrendingUp className="text-purple-500" size={32} />}
              title="Improve CIBIL Score"
              desc="Expected +5-10 points increase"
            />
            <BenefitCard 
              icon={<TrendingDown className="text-emerald-500" size={32} />}
              title="Save Every Month"
              desc={`Up to ₹${savings.toLocaleString()}/month`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
             <div className="flex items-center gap-2">
               <ShieldCheckIcon /> No impact on existing credit score during switch
             </div>
             <div className="flex items-center gap-2">
               <CheckCircleIcon /> Digital process - paperless transfer
             </div>
             <div className="flex items-center gap-2">
               <ClockIcon /> Old loan closed automatically
             </div>
             <div className="flex items-center gap-2">
               <ThumbUpIcon /> Better terms and flexibility
             </div>
          </div>
        </div>

        {/* Lenders List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Available Lenders</h2>
            <div className="text-xs font-medium bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm text-slate-600">
              Sorted by Best Rate
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_LENDERS.map((lender, index) => (
              <div key={lender.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all">
                {index === 0 && (
                   <div className="absolute top-0 left-0 bg-[#00C853] text-white text-[10px] font-bold px-3 py-1 rounded-br-lg z-10">
                     BEST RATE
                   </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Left: Bank Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${lender.logoColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                         {lender.bankName.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{lender.bankName}</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <span className="font-bold text-slate-800">{lender.rating}</span>
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          {index === 0 && <span className="bg-[#00C853] text-white text-[10px] px-1.5 rounded ml-2 font-bold flex items-center gap-0.5"><Zap size={8} fill="currentColor"/> Best Rate</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Rate Info */}
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-0.5">Interest Rate</p>
                    <p className="text-3xl font-bold text-[#2962FF]">{lender.interestRate}%</p>
                    <p className="text-xs font-medium text-emerald-600">{(loan.roi - lender.interestRate).toFixed(2)}% lower</p>
                  </div>
                </div>

                {/* Savings Green Box */}
                <div className="mt-6 bg-[#E0F2F1] rounded-xl p-4 flex items-center justify-between border border-[#B2DFDB]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center text-white">
                      <TrendingDown size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-[#00695C] font-semibold uppercase">Your Savings</p>
                      <p className="text-2xl font-bold text-[#004D40]">₹{savings.toLocaleString()} <span className="text-sm font-medium text-[#00695C]">per month</span></p>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                     <p className="text-xs text-slate-500">Total Savings</p>
                     <p className="font-bold text-slate-700">₹{totalSavings.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details Row */}
                <div className="mt-4 flex justify-between text-sm text-slate-600 border-t border-slate-100 pt-4">
                  <div>
                    <span className="block text-xs text-slate-400">Processing Fee</span>
                    <span className="font-medium text-green-600">{lender.processingFee === 0 ? '₹0 (Free)' : `₹${lender.processingFee}`}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Tenure</span>
                    <span className="font-medium">{lender.tenureMonths / 12} years</span>
                  </div>
                   <div>
                    <span className="block text-xs text-slate-400">Time</span>
                    <span className="font-medium text-green-600">5 mins</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                   {lender.features.map(f => (
                     <span key={f} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 font-medium flex items-center gap-1">
                       <BadgeCheck size={12}/> {f}
                     </span>
                   ))}
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleInitiateSwitch(lender)}
                  className="w-full mt-5 bg-[#6200EE] hover:bg-[#5000C0] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={18} fill="currentColor" />
                  Switch in 5 Minutes - Save ₹{savings.toLocaleString()}/month
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedLender && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900">Confirm Loan Switch</h3>
                <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
             </div>
             
             <p className="text-slate-600 mb-6">Are you sure you want to switch your loan to <span className="font-bold text-slate-900">{selectedLender.bankName}</span>?</p>
             
             <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
               <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                 <CheckCircleIcon className="w-5 h-5" /> You'll save ₹{savings.toLocaleString()} per month
               </div>
               <div className="flex items-center gap-2 text-indigo-800 font-medium">
                 <TrendingUp className="w-5 h-5" /> Your CIBIL score will improve by +5-10 points
               </div>
             </div>
             
             <p className="text-xs text-slate-500 mb-6">
               Your current loan will be closed and transferred to the new lender. This process takes approximately 5 minutes.
             </p>
             
             <div className="flex gap-3">
               <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50">Cancel</button>
               <button onClick={handleConfirmSwitch} className="flex-1 py-3 bg-[#6200EE] text-white rounded-xl font-bold hover:bg-[#5000C0] shadow-lg">Confirm Switch</button>
             </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#00C853] mb-6 animate-bounce shadow-lg shadow-green-200">
                    <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-[#00695C] mb-2">Switch Successful!</h2>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                    Your request has been approved. You will receive the new loan agreement via email shortly.
                </p>
                <button 
                    onClick={handleBackToDashboard}
                    className="w-full bg-[#00C853] hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-200 transform hover:scale-[1.02]"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

const BenefitCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
    <div className="mb-3 p-2 bg-slate-50 rounded-full">{icon}</div>
    <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
    <p className="text-xs text-slate-500 leading-tight">{desc}</p>
  </div>
);

// Minimal Icon Wrappers for cleaner JSX
const SparklesIcon = ({className}:{className?:string}) => <Sparkles className={className} size={20} />;
const ShieldCheckIcon = () => <ShieldCheck size={16} />;
const CheckCircleIcon = ({className}:{className?:string}) => <CheckCircle size={16} className={className} />;
const ClockIcon = () => <Clock size={16} />;
const ThumbUpIcon = () => <TrendingUp size={16} />;
const Sparkles = ({className, size}:{className?:string, size?:number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);