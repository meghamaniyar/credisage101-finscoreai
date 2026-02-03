import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, X, Send, User, Volume2, StopCircle, Sparkles } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { UserProfile, Loan } from '../types';

interface ChatbotProps {
  user: UserProfile;
  loans: Loan[];
  avatar: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const Chatbot: React.FC<ChatbotProps> = ({ user, loans, avatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `Namaste, my friend ${user.name ? user.name.split(' ')[0] : ''}! I am Gyani, your joyful sage of savings! 👓 With my hair tied high and my kamandalu full of wisdom, I'm here to help you prosper. What financial guidance do you seek today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio Contexts
  const inputAudioContext = useRef<AudioContext | null>(null);
  const outputAudioContext = useRef<AudioContext | null>(null);
  const nextStartTime = useRef<number>(0);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  // Initialize Audio
  const initAudio = () => {
    if (!inputAudioContext.current) {
      inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
    if (!outputAudioContext.current) {
      outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  };

  // Helper: Decode Audio
  async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }

  // Helper: Create Blob for Upload
  function createPcmBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startLiveSession = async () => {
    setIsListening(true);
    initAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputAudioContext.current!.createMediaStreamSource(stream);
      const scriptProcessor = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
      
      scriptProcessor.onaudioprocess = (e) => {
        if (!sessionRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = createPcmBlob(inputData);
        sessionRef.current.sendRealtimeInput({ media: pcmData });
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioContext.current!.destination);

      const loanContext = loans.map(l => `${l.bankName} (${l.type}): ₹${l.outstandingAmount} outstanding @ ${l.roi}%`).join('. ');
      const contextPrompt = `
        You are Gyani, a funny, witty, and wise Indian sage mascot. 
        Your personality: Cheerful, slightly eccentric, and very clever. You look like a traditional Rishi with a high top-knot bun, saffron robes, rudraksha beads, and a golden pot, but you also wear modern spectacles.
        You use fun metaphors and lighthearted financial puns.
        User: ${user.name}, CIBIL Score: ${user.cibilScore}.
        Active Loans: ${loanContext}.
        Address the user as "my friend" or "fellow seeker of prosperity".
        Speak with a high-energy yet wise mascot tone. Give practical financial advice with a witty twist.
        Keep responses concise and witty.
      `;

      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          systemInstruction: contextPrompt,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
             voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } 
          }
        },
        callbacks: {
          onopen: () => console.log('Gyani is adjusting his saffron shawl and ready!'),
          onmessage: async (msg: LiveServerMessage) => {
             const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               const binaryString = atob(audioData);
               const len = binaryString.length;
               const bytes = new Uint8Array(len);
               for (let i = 0; i < len; i++) {
                 bytes[i] = binaryString.charCodeAt(i);
               }
               
               if (outputAudioContext.current) {
                 nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
                 const buffer = await decodeAudioData(bytes, outputAudioContext.current);
                 const source = outputAudioContext.current.createBufferSource();
                 source.buffer = buffer;
                 source.connect(outputAudioContext.current.destination);
                 source.start(nextStartTime.current);
                 nextStartTime.current += buffer.duration;
                 sources.current.add(source);
                 source.onended = () => sources.current.delete(source);
               }
             }
          },
          onclose: () => {
             setIsListening(false);
             stream.getTracks().forEach(t => t.stop());
          },
          onerror: (e) => console.error("Gyani logic error", e)
        }
      });
      
      sessionRef.current = session;

    } catch (err) {
      console.error("Failed to commune with Gyani", err);
      setIsListening(false);
    }
  };

  const stopLiveSession = () => {
    if (sessionRef.current) {
       sessionRef.current.close();
       sessionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSendText = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
       const loanContext = loans.map(l => `${l.bankName} ${l.type} (₹${l.outstandingAmount})`).join(', ');
       const prompt = `
         System: You are Gyani, a funny and wise financial sage mascot with round spectacles, a high top-knot, and saffron robes. 
         Personality: Witty, energetic, and extremely encouraging.
         User CIBIL: ${user.cibilScore}. Loans: ${loanContext}.
         User asked: "${userMsg.text}".
         Answer as a witty sage mascot: provide 2 sentences of wise and funny financial guidance.
       `;
       
       const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: prompt
       });
       
       const botMsg: ChatMessage = { id: (Date.now()+1).toString(), text: response.text || "Your financial future looks brighter than my polished spectacles!", sender: 'bot' };
       setMessages(prev => [...prev, botMsg]);
    } catch (e) {
       console.error(e);
    } finally {
       setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-indigo-100 animate-slideUp flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6200EE] to-[#FF5722] p-5 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/50 overflow-hidden flex items-center justify-center ring-2 ring-white/30">
                  {avatar ? <img src={avatar} alt="Gyani" className="w-full h-full object-cover scale-110" /> : <User size={24} />}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Gyani</h3>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Witty Sage 👓</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20}/></button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#6200EE] text-white rounded-br-none shadow-md' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex gap-1">
                   <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Gyani is polishing his glasses...</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
             {isListening ? (
               <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border border-orange-100 animate-pulse">
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <Volume2 className="text-white w-4 h-4 animate-ping" />
                       </div>
                    </div>
                    <span className="text-orange-900 font-bold text-sm">Gyani is hearing your prosperity...</span>
                 </div>
                 <button 
                  onClick={stopLiveSession} 
                  className="bg-white border border-orange-200 text-orange-600 px-5 py-1.5 rounded-full text-xs font-extrabold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                 >
                   Stop Voice Session
                 </button>
               </div>
             ) : (
               <div className="flex gap-3">
                 <div className="flex-1 relative">
                   <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                     placeholder="Seek financial fun..."
                     className="w-full bg-slate-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#6200EE] outline-none transition-all pr-10"
                   />
                   <button 
                     onClick={handleSendText}
                     disabled={!input.trim()}
                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#6200EE] disabled:opacity-30 transition-opacity"
                   >
                     <Send size={18} />
                   </button>
                 </div>
                 <button 
                   onClick={startLiveSession}
                   className="p-3 bg-gradient-to-tr from-[#6200EE] to-[#FF5722] text-white rounded-2xl hover:scale-105 transition-all flex items-center justify-center shadow-lg"
                 >
                   <Mic size={22} />
                 </button>
               </div>
             )}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6200EE] to-[#FF5722] shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-4 border-white relative group active:scale-95"
      >
        <div className="absolute inset-0 rounded-full bg-orange-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
        {avatar ? (
          <img src={avatar} alt="Gyani" className="w-full h-full rounded-full object-cover border-2 border-white/50 shadow-inner scale-110" />
        ) : (
          <Sparkles className="text-white w-10 h-10" />
        )}
        
        {!isOpen && (
           <div className="absolute -top-1 -right-1 bg-amber-400 text-[#6200EE] p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
              <Sparkles size={12} fill="currentColor" />
           </div>
        )}

        <div className="absolute right-full mr-5 bg-white px-4 py-2 rounded-2xl shadow-xl text-xs font-black text-slate-800 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-orange-50">
           Chat with Gyani! 👓
        </div>
      </button>
    </div>
  );
};