import { GoogleGenAI } from "@google/genai";
import { Loan, UserProfile } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDashboardInsights = async (user: UserProfile, loans: Loan[]): Promise<string> => {
  try {
    const loanSummary = loans.map(l => `${l.type} with ${l.bankName} at ${l.roi}% interest (EMI: ₹${l.emi})`).join(', ');
    
    const prompt = `
      The user has a CIBIL score of ${user.cibilScore}.
      They have the following active loans: ${loanSummary}.
      
      Generate 3 short, actionable, bullet-point financial insights for this user. 
      If the score is below 750, focus on credit repair. 
      If the score is above 750, focus on leveraging credit for wealth or lower rates.
      Keep it encouraging and professional.
      Format as HTML list items (<li>).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "<li>Pay your EMIs on time to boost your score by approx 15 points.</li><li>Keep credit utilization below 30% for maximum impact.</li><li>Avoid applying for multiple new loans within a short period.</li>";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback static content
    return `
      <li>Reduce your Credit Card utilization to below 30% to see a quick score jump.</li>
      <li>Your Personal Loan interest is high; consider refinancing to save money.</li>
      <li>Avoid missing any EMI payments as this has the highest impact on CIBIL.</li>
    `;
  }
};

export const getRefinanceAnalysis = async (currentLoan: Loan, newRoi: number): Promise<string> => {
  try {
    const prompt = `
      Analyze switching a ${currentLoan.type} of ₹${currentLoan.outstandingAmount} from ${currentLoan.roi}% to ${newRoi}%.
      Calculate the potential interest savings over ${currentLoan.tenureMonthsRemaining} months.
      Provide a 2-sentence persuasive summary on why they should switch now.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Switching now could save you significant interest over the remaining tenure. With a lower rate, you can reduce your monthly burden immediately.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Switching to this lower interest rate will reduce your monthly EMI and total interest payable significantly.";
  }
};