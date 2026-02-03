import React from 'react';
import { ViewState } from '../types';

interface StepIndicatorProps {
  currentStep: ViewState;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: ViewState.HOME, label: 'Details', number: 1 },
    { id: ViewState.OTP, label: 'Verify', number: 2 },
    { id: ViewState.DASHBOARD, label: 'Score & Offers', number: 3 },
  ];

  const getStepStatus = (stepId: ViewState) => {
    const stepOrder = [ViewState.HOME, ViewState.OTP, ViewState.DASHBOARD];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
        
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${status === 'completed' ? 'bg-green-500 text-white' : ''}
                  ${status === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${status === 'pending' ? 'bg-slate-200 text-slate-500' : ''}
                `}
              >
                {status === 'completed' ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-2 font-medium ${status === 'active' ? 'text-blue-600' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};