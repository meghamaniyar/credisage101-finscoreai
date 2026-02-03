import React from 'react';
import { Clock, Smartphone, ShieldCheck } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "5-Minute Approval",
      description: "No waiting days for a response. Our AI engine matches you with lenders instantly.",
      delay: "delay-0"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "100% Paperless",
      description: "Upload documents from your phone. No physical visits to branches required.",
      delay: "delay-100"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Secure & Private",
      description: "Your data is encrypted with bank-grade security and shared only with your chosen lender.",
      delay: "delay-200"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why FinScore AI?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We combine advanced AI with India's widest lender network to get you the money you need, faster than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slideUp ${feature.delay}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};