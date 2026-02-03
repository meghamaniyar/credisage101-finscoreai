import React, { useState, useEffect } from 'react';
import { UserProfile, LenderOffer, LoanApplication } from '../types';
import { ArrowLeft, CheckCircle, Upload, Zap, ChevronRight, Briefcase, Building, User, FileText, Banknote, Clock, ShieldCheck } from 'lucide-react';

interface NewLoanApplicationProps {
  user: UserProfile;
  onBack: () => void;
  onComplete: (app: LoanApplication) => void;
}

const STEPS = [
  { number: 1, label: 'Loan Goal' },
  { number: 2, label: 'KYC & Docs' },
  { number: 3, label: 'Offers' },
  { number: 4, label: 'Confirm' }
];

const MOCK_OFFERS: LenderOffer[] = [
  { id: 'o1', bankName: 'HDFC Bank', interestRate: 10.75, maxAmount: 1500000, tenureMonths: 60, features: ['Pre-approved', '24hr Disbursal'], logoColor: 'bg-blue-800', rating: 4.9, processingFee: 999 },
  { id: 'o2', bankName: 'ICICI Bank', interestRate: 11.25, maxAmount: 1200000, tenureMonths: 60, features: ['Minimal Documentation'], logoColor: 'bg-orange-600', rating: 4.7, processingFee: 499 },
  { id: 'o3', bankName: 'KreditBee', interestRate: 12.50, maxAmount: 500000, tenureMonths: 36, features: ['Instant Transfer'], logoColor: 'bg-yellow-600', rating: 4.5, processingFee: 0 },
];

export const NewLoanApplication: React.FC<NewLoanApplicationProps> = ({ user, onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  // Step 1 State
  const [amount, setAmount] = useState(200000);
  const [tenure, setTenure] = useState(24);
  const [purpose, setPurpose] = useState('Personal Use');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self-employed'>('salaried');
  const [income, setIncome] = useState('');

  // Step 2 State (Docs)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  
  // Step 3 State
  const [selectedOffer, setSelectedOffer] = useState<LenderOffer | null>(null);

  // Step 4 State
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId] = useState(`LN-${Math.floor(Math.random()*10000)}`);

  // Calculate Eligible Amount based on offers (Mock)
  const maxEligibleAmount = Math.max(...MOCK_OFFERS.map(o => o.maxAmount));

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Dynamic EMI Calculation
  const calculateEMI = (p: number, n: number, r: number = 12) => {
    const monthlyRate = r / 12 / 100;
    const emi = p * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    return Math.round(emi);
  };

  const currentEMI = calculateEMI(amount, tenure);
  const totalInterest = (currentEMI * tenure) - amount;

  const handleNext = () => {
    let text = "Processing...";
    if (step === 1) text = "Verifying Eligibility...";
    if (step === 2) text = "Verifying Documents...";
    
    setLoadingText(text);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(prev => prev + 1);
    }, 1500); 
  };

  const handleFileUpload = (docId: string) => {
    setUploadedDocs(prev => ({...prev, [docId]: true}));
  };

  const handleFinalSubmit = () => {
    setLoadingText("Finalizing Application...");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleFinish = () => {
    if (selectedOffer) {
      onComplete({
        id: applicationId,
        bankName: selectedOffer.bankName,
        amount: Math.min(amount, selectedOffer.maxAmount),
        status: 'submitted',
        date: new Date().toLocaleDateString()
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your application (ID: <span className="font-mono font-bold text-slate-800">#{applicationId}</span>) has been securely sent to <span className="font-bold text-blue-600">{selectedOffer?.bankName}</span>.
          </p>
          <div className="bg-blue-50 rounded-xl p-4 mb-8 text-sm text-blue-800 flex items-start gap-3 text-left">
            <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>You will receive a call within 15 minutes to verify your details and process the disbursal.</p>
          </div>
          <button 
            onClick={handleFinish}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header with Progress */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">New Personal Loan</h1>
          </div>

          <div className="relative flex justify-between items-center max-w-lg mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full -translate-y-1/2"></div>
            <div className={`absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full -translate-y-1/2 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {STEPS.map((s) => (
              <div key={s.number} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s.number ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.number ? <CheckCircle size={16} /> : s.number}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.number ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
        
        {/* STEP 1: Loan Requirement */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Define Your Loan Goal 🎯</h2>
              <p className="text-slate-500">Tell us what you need, and we'll check eligibility instantly.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-8">
              {/* Amount Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold text-slate-700">Desired Loan Amount</label>
                  <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    ₹{amount.toLocaleString()}
                  </div>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="5000000" 
                  step="10000" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>₹50k</span>
                  <span>₹50L</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-sm font-bold text-slate-700">Preferred Tenure</label>
                  <div className="text-2xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {tenure} Months
                  </div>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="60" 
                  step="6" 
                  value={tenure} 
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>1 Year</span>
                  <span>5 Years</span>
                </div>
              </div>

              {/* Real-time Calculator */}
              <div className="bg-slate-900 rounded-xl p-5 text-white flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Estimated EMI</p>
                  <p className="text-2xl font-bold">₹{currentEMI.toLocaleString()}<span className="text-sm font-normal text-slate-400">/mo</span></p>
                </div>
                <div className="text-right border-l border-slate-700 pl-6">
                  <p className="text-slate-400 text-xs uppercase font-bold mb-1">Total Interest</p>
                  <p className="text-lg font-bold text-green-400">₹{totalInterest.toLocaleString()}</p>
                </div>
              </div>

              {/* Purpose & Employment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Loan Purpose</label>
                    <select 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Personal Use</option>
                      <option>Debt Consolidation</option>
                      <option>Medical Emergency</option>
                      <option>Wedding</option>
                      <option>Home Renovation</option>
                      <option>Travel</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Net Income</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="e.g. 45000"
                        className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Employment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setEmploymentType('salaried')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${employmentType === 'salaried' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                  >
                    <Briefcase size={24} />
                    <span className="font-bold">Salaried</span>
                  </button>
                  <button 
                    onClick={() => setEmploymentType('self-employed')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${employmentType === 'self-employed' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                  >
                    <Building size={24} />
                    <span className="font-bold">Self-Employed</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext}
              disabled={!income || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                 <Clock className="animate-spin" /> {loadingText}
                </>
              ) : (
                <>
                 Check Eligibility <ChevronRight />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: KYC & Docs */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {employmentType === 'salaried' ? 'Salaried KYC & Income Proof' : 'Business KYC & Financials'} 💼
              </h2>
              <p className="text-slate-500">We need a few documents to verify your profile.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
              {/* Basic Info (Read Only) */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Full Name</p>
                  <p className="font-bold text-slate-700">{user.name || 'Rahul Sharma'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">PAN Number</p>
                  <p className="font-bold text-slate-700">{user.pan || 'ABCDE1234F'}</p>
                </div>
              </div>

              {employmentType === 'salaried' ? (
                 // Salaried Specific Fields
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Current Residential Address</label>
                     <input type="text" placeholder="House No, Street, City, Pincode" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                   </div>
                   
                   <div className="space-y-3">
                     <p className="text-sm font-bold text-slate-700">Required Documents</p>
                     <DocUploadButton 
                        label="Aadhaar Card (Front & Back)" 
                        id="aadhaar" 
                        isUploaded={uploadedDocs['aadhaar']} 
                        onUpload={handleFileUpload} 
                     />
                     <DocUploadButton 
                        label="Latest 3 Months Salary Slips" 
                        id="salary" 
                        isUploaded={uploadedDocs['salary']} 
                        onUpload={handleFileUpload} 
                        icon={<Banknote size={20} />}
                     />
                     <DocUploadButton 
                        label="Company ID Card / Form 16" 
                        id="employment" 
                        isUploaded={uploadedDocs['employment']} 
                        onUpload={handleFileUpload} 
                        icon={<Briefcase size={20} />}
                     />
                   </div>
                 </div>
              ) : (
                // Business Specific Fields
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                       <input type="text" placeholder="e.g. Sharma Traders" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Vintage (Years)</label>
                       <input type="number" placeholder="e.g. 3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                     </div>
                   </div>

                   <div className="space-y-3">
                     <p className="text-sm font-bold text-slate-700">Required Documents</p>
                     <DocUploadButton 
                        label="Aadhaar Card" 
                        id="aadhaar" 
                        isUploaded={uploadedDocs['aadhaar']} 
                        onUpload={handleFileUpload} 
                     />
                     <DocUploadButton 
                        label="Business Proof (GST/Utility Bill)" 
                        id="business" 
                        isUploaded={uploadedDocs['business']} 
                        onUpload={handleFileUpload} 
                        icon={<Building size={20} />}
                     />
                     <DocUploadButton 
                        label="Latest 6 Months Bank Statement & ITR" 
                        id="financials" 
                        isUploaded={uploadedDocs['financials']} 
                        onUpload={handleFileUpload} 
                        icon={<FileText size={20} />}
                     />
                   </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                 <Clock className="animate-spin" /> {loadingText}
                </>
              ) : (
                <>
                 Submit Documents & Find Offers <ChevronRight />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Offers */}
        {step === 3 && (
          <div className="space-y-6">
             {/* Eligible Amount Banner */}
             <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-slideUp">
               <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Congratulations {user.name.split(' ')[0]}!</p>
               <h2 className="text-3xl font-bold text-emerald-900 mb-2">You are eligible for up to <span className="text-emerald-600">₹{maxEligibleAmount.toLocaleString()}</span></h2>
               <p className="text-emerald-700 text-sm">Based on your documents and CIBIL score of {user.cibilScore}</p>
             </div>

             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Your Personalized Offers ⭐</h2>
              <p className="text-slate-500">Select the best plan that suits your needs.</p>
            </div>

            <div className="space-y-4">
               {MOCK_OFFERS.map((offer, index) => {
                 const offerEMI = calculateEMI(Math.min(amount, offer.maxAmount), Math.min(tenure, offer.tenureMonths), offer.interestRate);
                 return (
                   <div 
                    key={offer.id} 
                    onClick={() => setSelectedOffer(offer)}
                    className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedOffer?.id === offer.id ? 'border-blue-600 shadow-xl ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:border-blue-200'}`}
                   >
                     {index === 0 && (
                       <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                         LOWEST EMI
                       </div>
                     )}
                     
                     <div className="flex flex-col md:flex-row justify-between gap-6 relative z-0">
                       <div className="flex gap-4">
                         <div className={`w-12 h-12 rounded-xl ${offer.logoColor} flex items-center justify-center text-white font-bold shadow-md`}>
                           {offer.bankName.substring(0,2).toUpperCase()}
                         </div>
                         <div>
                           <h3 className="text-lg font-bold text-slate-900">{offer.bankName}</h3>
                           <div className="flex gap-2 mt-1">
                             {offer.features.map(f => (
                               <span key={f} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{f}</span>
                             ))}
                           </div>
                         </div>
                       </div>

                       <div className="text-right">
                          <p className="text-xs text-slate-500 font-medium">Interest Rate</p>
                          <p className="text-2xl font-bold text-green-600">{offer.interestRate}%</p>
                          <p className="text-xs text-slate-400 mt-1">Processing: ₹{offer.processingFee}</p>
                       </div>
                     </div>

                     <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Monthly EMI</p>
                          <p className="text-xl font-bold text-slate-900">₹{offerEMI.toLocaleString()}</p>
                        </div>
                        <button className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${selectedOffer?.id === offer.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                          {selectedOffer?.id === offer.id ? 'Selected' : 'Select Offer'}
                        </button>
                     </div>
                   </div>
                 );
               })}
            </div>

            <button 
              onClick={handleNext}
              disabled={!selectedOffer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Proceed with {selectedOffer?.bankName || 'Selected Offer'} <ChevronRight />
            </button>
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && selectedOffer && (
           <div className="space-y-6">
             <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Final Confirmation 🎉</h2>
              <p className="text-slate-500">Almost done! Review your application details.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                  <div className={`w-16 h-16 rounded-2xl ${selectedOffer.logoColor} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                     {selectedOffer.bankName.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedOffer.bankName}</h3>
                    <p className="text-sm text-slate-500">Personal Loan Application</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-y-6">
                 <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Loan Amount</p>
                   <p className="text-lg font-bold text-slate-800">₹{Math.min(amount, selectedOffer.maxAmount).toLocaleString()}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Tenure</p>
                   <p className="text-lg font-bold text-slate-800">{Math.min(tenure, selectedOffer.tenureMonths)} Months</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Interest Rate</p>
                   <p className="text-lg font-bold text-green-600">{selectedOffer.interestRate}%</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Processing Fee</p>
                   <p className="text-lg font-bold text-slate-800">₹{selectedOffer.processingFee}</p>
                 </div>
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="text-blue-600 w-6 h-6 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-900">Secure Data Transfer</p>
                <p className="text-xs text-blue-700 mt-1">Your documents and KYC details will be securely shared with {selectedOffer.bankName} for final processing.</p>
              </div>
            </div>

            <label className="flex gap-3 items-start p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${consentChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                {consentChecked && <CheckCircle size={14} />}
              </div>
              <input type="checkbox" className="hidden" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
              <span className="text-sm text-slate-600">
                I consent to FinScoreAI sharing my KYC, Income Proof, and CIBIL Report with <span className="font-bold text-slate-900">{selectedOffer.bankName}</span> for the purpose of loan processing.
              </span>
            </label>

            <button 
              onClick={handleFinalSubmit}
              disabled={!consentChecked || loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Clock className="animate-spin" /> {loadingText}
                </>
              ) : (
                <>
                 Complete Application & Get Funds <ChevronRight />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DocUploadButton = ({ label, id, isUploaded, onUpload, icon }: { label: string, id: string, isUploaded: boolean, onUpload: (id: string) => void, icon?: React.ReactNode }) => (
  <button 
    onClick={() => onUpload(id)}
    className={`w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-between transition-all ${isUploaded ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
        {icon || <User size={20} />}
      </div>
      <div className="text-left">
        <p className={`text-sm font-bold ${isUploaded ? 'text-green-800' : 'text-slate-700'}`}>{label}</p>
        <p className="text-xs text-slate-400">{isUploaded ? 'Uploaded Successfully' : 'Tap to Upload'}</p>
      </div>
    </div>
    {isUploaded ? <CheckCircle className="text-green-600" /> : <Upload className="text-slate-400" size={20} />}
  </button>
);