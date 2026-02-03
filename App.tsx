import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Loan, LoanApplication, LoanType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { SwitchOfferPage } from './components/SwitchOfferPage';
import { NewLoanApplication } from './components/NewLoanApplication';
import { SideMenu } from './components/SideMenu';
import { Chatbot } from './components/Chatbot';
import { GoogleGenAI } from "@google/genai";

// Mock Data moved to App level for context sharing
const MOCK_LOANS: Loan[] = [
  {
    id: '1',
    bankName: 'HDFC Bank',
    type: LoanType.PERSONAL,
    outstandingAmount: 320000,
    roi: 15.5,
    emi: 12400,
    tenureMonthsRemaining: 36,
    nextEmiDate: '5th Oct',
    reminderSet: false,
    canSwitch: true,
    switchOffer: { newRoi: 10.4, newBankName: 'IDFC First', monthlySavings: 5600, processingFee: 0, tenureYears: 3 }
  },
  {
    id: '2',
    bankName: 'SBI Home Loans',
    type: LoanType.HOME,
    outstandingAmount: 2450000,
    roi: 8.9,
    emi: 22100,
    tenureMonthsRemaining: 180,
    nextEmiDate: '1st Oct',
    reminderSet: true,
    canSwitch: true,
    switchOffer: { newRoi: 8.4, newBankName: 'Kotak Mahindra', monthlySavings: 3200, processingFee: 5000, tenureYears: 15 }
  },
  {
    id: '3',
    bankName: 'ICICI Bank',
    type: LoanType.CAR,
    outstandingAmount: 420000,
    roi: 9.5,
    emi: 9800,
    tenureMonthsRemaining: 42,
    nextEmiDate: '10th Oct',
    reminderSet: false,
    canSwitch: false
  },
  {
    id: '4',
    bankName: 'Manappuram Gold',
    type: LoanType.GOLD,
    outstandingAmount: 150000,
    roi: 12.0,
    emi: 0,
    tenureMonthsRemaining: 6,
    nextEmiDate: '15th Oct',
    reminderSet: false,
    canSwitch: false
  },
  {
    id: '5',
    bankName: 'SBI Card',
    type: LoanType.CREDIT_CARD,
    outstandingAmount: 45000,
    roi: 42.0,
    emi: 4500,
    tenureMonthsRemaining: 0,
    nextEmiDate: '12th Oct',
    reminderSet: true,
    canSwitch: false
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [user, setUser] = useState<UserProfile>({
    mobile: '',
    pan: '',
    name: '',
    cibilScore: 0
  });
  
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [sageAvatar, setSageAvatar] = useState<string>('');

  // Generate Sage Avatar on Mount
  useEffect(() => {
    const cacheKey = 'finscore_gyani_avatar_v5';
    const cachedAvatar = localStorage.getItem(cacheKey);
    if (cachedAvatar) {
      setSageAvatar(cachedAvatar);
      return;
    }

    const generateAvatar = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { text: 'A funny and joyful Indian sage mascot named Gyani. He has long white hair tied in a high top-knot bun with dark rudraksha beads around the base of the bun. He has a long white beard and white tilak lines on his forehead. He is wearing traditional saffron (orange) robes, including a dhoti and a shawl draped over his shoulder. He wears cool round spectacles (glasses). In one hand, he holds a small golden kamandalu (water pot). 3D Pixar-style character design, bright vibrant colors, happy and inspiring expression. Clean white background, soft studio lighting, high resolution.' }
            ]
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            setSageAvatar(base64Image);
            localStorage.setItem(cacheKey, base64Image);
            break;
          }
        }
      } catch (e) {
        setSageAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=GyaniTraditional&clothing=modernTraditional&facialHair=longBeard&top=topBun&mouth=smile&accessories=round'); 
      }
    };
    generateAvatar();
  }, []);

  const handleStart = (mobile: string, pan: string) => {
    setUser(prev => ({ ...prev, mobile, pan }));
    setView(ViewState.OTP);
  };

  const handleVerifyOtp = () => {
    const lastChar = user.pan.slice(-1);
    const mockScore = (lastChar === 'F' || lastChar === 'A') ? 780 : 680;
    setUser(prev => ({ ...prev, name: 'Rahul Sharma', cibilScore: mockScore }));
    setView(ViewState.DASHBOARD);
  };

  const handleSwitchClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setView(ViewState.SWITCH_OFFER);
  };

  const handleBackFromSwitch = (success?: boolean) => {
    if (success) setSkipIntro(true);
    setView(ViewState.DASHBOARD);
  };

  const handleNewLoanComplete = (app: LoanApplication) => {
    setApplications(prev => [app, ...prev]);
    setSkipIntro(true); 
    setView(ViewState.DASHBOARD);
  };

  const handleBackFromNewLoan = () => {
    setSkipIntro(true); 
    setView(ViewState.DASHBOARD);
  };

  const handleMenuNavigation = (sectionId: string) => {
    setIsMenuOpen(false);
    if (sectionId === 'new-loan') {
      setView(ViewState.NEW_LOAN);
      return;
    }
    if (view !== ViewState.DASHBOARD) {
      setView(ViewState.DASHBOARD);
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogoClick = () => {
    if (user.cibilScore > 0 && view !== ViewState.HOME && view !== ViewState.OTP) {
       setView(ViewState.DASHBOARD);
       setSkipIntro(true);
    } else {
       setView(ViewState.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar showMenuTrigger={view !== ViewState.HOME && view !== ViewState.OTP} onMenuClick={() => setIsMenuOpen(true)} onLogoClick={handleLogoClick} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} onNavigate={handleMenuNavigation} />

      <main>
        {view === ViewState.HOME && <Hero onStart={handleStart} />}
        {view === ViewState.OTP && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Verify Mobile Number</h2>
              <p className="text-slate-500 mb-8">Enter code sent to +91 {user.mobile}</p>
              <div className="flex justify-center gap-4 mb-8">
                {otp.map((digit, idx) => (
                  <input 
                    key={idx} id={`otp-${idx}`} type="text" maxLength={1} value={digit} 
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value.slice(-1);
                      setOtp(newOtp);
                      if (e.target.value && idx < 3) document.getElementById(`otp-${idx+1}`)?.focus();
                    }} 
                    className="w-14 h-14 border-2 border-slate-200 rounded-xl text-center text-2xl font-bold outline-none focus:border-blue-600 transition-all" 
                  />
                ))}
              </div>
              <button onClick={handleVerifyOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all">Verify & See Score</button>
            </div>
          </div>
        )}
        {view === ViewState.DASHBOARD && <Dashboard user={user} loans={loans} setLoans={setLoans} onSwitchLoan={handleSwitchClick} skipIntro={skipIntro} applications={applications} />}
        {view === ViewState.SWITCH_OFFER && selectedLoan && <SwitchOfferPage loan={selectedLoan} onBack={handleBackFromSwitch} />}
        {view === ViewState.NEW_LOAN && <NewLoanApplication user={user} onBack={handleBackFromNewLoan} onComplete={handleNewLoanComplete} />}
      </main>

      <Chatbot user={user} loans={loans} avatar={sageAvatar} />

      {view !== ViewState.SWITCH_OFFER && view !== ViewState.NEW_LOAN && (
        <footer className="bg-white border-t border-slate-100 py-8 mt-12 mb-20 md:mb-0">
          <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>© 2024 FinScoreAI Technologies Pvt Ltd. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;