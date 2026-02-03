export enum ViewState {
  HOME = 'HOME',
  OTP = 'OTP',
  DASHBOARD = 'DASHBOARD',
  SWITCH_OFFER = 'SWITCH_OFFER',
  NEW_LOAN = 'NEW_LOAN'
}

export enum LoanType {
  PERSONAL = 'Personal Loan',
  HOME = 'Home Loan',
  CREDIT_CARD = 'Credit Card',
  GOLD = 'Gold Loan',
  CAR = 'Car Loan'
}

export interface Loan {
  id: string;
  bankName: string;
  type: LoanType;
  outstandingAmount: number;
  roi: number; // Rate of Interest
  emi: number;
  tenureMonthsRemaining: number;
  nextEmiDate: string;
  reminderSet: boolean;
  canSwitch: boolean;
  switchOffer?: {
    newRoi: number;
    newBankName: string;
    monthlySavings: number;
    processingFee: number;
    tenureYears: number;
  };
}

export interface LoanApplication {
  id: string;
  bankName: string;
  amount: number;
  status: 'submitted' | 'verification' | 'approved' | 'disbursed';
  date: string;
}

export interface UserProfile {
  mobile: string;
  pan: string;
  name: string;
  cibilScore: number;
}

export interface LenderOffer {
  id: string;
  bankName: string;
  interestRate: number;
  maxAmount: number;
  tenureMonths: number;
  features: string[];
  logoColor: string;
  rating: number;
  processingFee: number;
}