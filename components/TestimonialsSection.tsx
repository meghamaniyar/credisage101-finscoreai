import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      text: "I needed ₹5L for a medical emergency. FinScore approved me in 10 mins and money was in my account the same day.",
      name: "Rahul Sharma",
      role: "Software Engineer, Bangalore",
      initial: "R",
      color: "bg-blue-600"
    },
    {
      text: "My CIBIL was 680. Their AI plan helped me improve it to 750 in 4 months, and I finally got a business loan at 12%.",
      name: "Priya Patel",
      role: "Small Business Owner, Ahmedabad",
      initial: "P",
      color: "bg-indigo-600"
    },
    {
      text: "The loan switching feature is a game changer. I reduced my home loan EMI by ₹4,500/month just by uploading my statement.",
      name: "Vikram Singh",
      role: "Marketing Manager, Delhi",
      initial: "V",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Trusted by 2 Million+ Indians</h2>
            <p className="text-lg text-slate-600">Real stories from people who unlocked their financial potential with us.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-6 h-6" />
              ))}
            </div>
            <span className="text-xl font-bold text-slate-900">4.8/5 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative">
              <Quote className="absolute top-8 right-8 text-blue-100 w-10 h-10 fill-current" />
              <p className="text-slate-700 italic text-lg mb-8 relative z-10 leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${t.color} text-white flex items-center justify-center font-bold text-xl`}>
                  {t.initial}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};