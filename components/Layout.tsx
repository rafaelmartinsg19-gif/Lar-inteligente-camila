
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Home, BookOpen, X, Sparkles, LogOut, ChevronRight, 
  Utensils, ShoppingBasket, Wallet, Zap, Wrench, Menu 
} from 'lucide-react';
import { askDonaCamila } from '../services/geminiService';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'camila', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Receitas', path: '/recipes', icon: Utensils },
    { label: 'Mercado', path: '/market', icon: ShoppingBasket },
    { label: 'Finanças', path: '/finances', icon: Wallet },
    { label: 'Utilidades', path: '/utilities', icon: Zap },
    { label: 'Manutenção', path: '/maintenance', icon: Wrench },
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);
    const response = await askDonaCamila(userMsg, userName);
    setChatMessages(prev => [...prev, { role: 'camila', text: response }]);
    setIsTyping(false);
  };

  const isHome = location.pathname === '/home';
  const isManual = location.pathname === '/manual';

  return (
    <div className="flex flex-col min-h-screen w-full bg-transparent overflow-x-hidden">
      {/* HEADER ADAPTATIVO */}
      <header className="h-20 md:h-24 bg-white/95 backdrop-blur-xl border-b-4 border-white/50 flex items-center justify-center px-4 md:px-12 sticky top-0 z-50 shadow-xl">
        <div className="w-full max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {onBack && (
              <button onClick={onBack} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all text-slate-900 border-2 md:border-4 border-slate-50 shadow-md">
                <ArrowLeft size={20} className="md:w-6 md:h-6" strokeWidth={4} />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black text-black tracking-tighter uppercase leading-none truncate max-w-[150px] md:max-w-none">Lar Inteligente</h1>
              <p className="text-[#e85d97] mt-0.5 md:mt-1 font-black tracking-[0.2em] text-[9px] md:text-[11px] uppercase truncate">{title || 'Painel'}</p>
            </div>
          </div>
          
          {/* Menu Horizontal Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#e85d97] ${location.pathname === item.path ? 'text-[#e85d97] border-b-2 border-[#e85d97]' : 'text-slate-400'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Cozinheira</span>
              <span className="text-base md:text-lg font-black text-black uppercase tracking-tight">{userName}</span>
            </div>
            <button 
              onClick={() => { if(confirm('Encerrar sessão?')) navigate('/login') }} 
              className="w-10 h-10 md:w-14 md:h-14 bg-white hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl md:rounded-2xl flex items-center justify-center transition-all border-2 md:border-4 border-rose-50 shadow-lg"
            >
              <LogOut size={20} className="md:w-6 md:h-6" strokeWidth={4} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL COM LARGURA MÁXIMA CONTROLADA */}
      <main className="flex-1 flex justify-center w-full px-4 py-6 md:px-12 md:py-12 pb-32 md:pb-48 relative">
        <div className="fixed inset-0 bg-[#fdfaf6]/60 backdrop-blur-[2px] pointer-events-none z-0"></div>
        <div className="w-full max-w-[1440px] animate-in fade-in zoom-in-95 duration-700 relative z-10">
          {children}
        </div>
      </main>

      {/* NAVEGAÇÃO MOBILE (OCULTA EM DESKTOP) */}
      <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
        <nav className="w-full max-w-md h-20 md:h-24 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3.5rem] flex justify-around items-center px-6 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-4 border-white pointer-events-auto">
          <button onClick={() => navigate('/home')} className={`flex flex-col items-center gap-1 transition-all ${isHome ? 'text-[#e85d97] scale-110' : 'text-slate-900 opacity-40'}`}>
            <Home size={28} className="md:w-[34px] md:h-[34px]" strokeWidth={4} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Início</span>
          </button>

          <button 
            onClick={() => setIsChatOpen(true)}
            className="relative -top-8 md:-top-12 w-20 h-20 md:w-28 md:h-28 bg-[#e85d97] text-white rounded-[2rem] md:rounded-[3rem] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all border-[6px] md:border-[8px] border-white"
          >
            <Sparkles size={32} className="md:w-[48px] md:h-[48px]" fill="currentColor" />
          </button>

          <button onClick={() => navigate('/manual')} className={`flex flex-col items-center gap-1 transition-all ${isManual ? 'text-[#e85d97] scale-110' : 'text-slate-900 opacity-40'}`}>
            <BookOpen size={28} className="md:w-[34px] md:h-[34px]" strokeWidth={4} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Manual</span>
          </button>
        </nav>
      </div>

      {/* CHAT DONA CAMILA - RESPONSIVO */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white h-[90vh] md:h-[85vh] rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-[6px] md:border-[10px] border-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="h-24 md:h-32 px-6 md:px-12 flex items-center justify-between border-b-4 border-slate-50 bg-[#fdfaf6]">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-[#e85d97] text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-xl md:text-3xl font-black shadow-lg border-2 md:border-4 border-white rotate-3">C</div>
                <div>
                  <h3 className="font-black text-black text-lg md:text-2xl leading-none uppercase tracking-tighter">Dona Camila</h3>
                  <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-3">
                    <span className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-emerald-700 font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em]">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 md:w-16 md:h-16 bg-white hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all text-slate-900 flex items-center justify-center border-2 md:border-4 border-slate-50 shadow-md"><X size={24} md:size={32} strokeWidth={4} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-8 bg-[#fdfaf6]">
              {chatMessages.length === 0 && (
                <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] rounded-tl-none border-2 md:border-4 border-white shadow-xl text-lg md:text-xl font-black text-slate-900 max-w-[95%] md:max-w-[90%] leading-tight uppercase italic tracking-tighter">
                  "Olá <span className="text-[#e85d97]">{userName}</span>! A cozinha está aberta. O que vamos economizar hoje, meu bem?"
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[95%] md:max-w-[90%] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border-2 md:border-4 ${msg.role === 'user' ? 'bg-[#5d4037] border-white text-white rounded-tr-none' : 'bg-white border-white text-slate-900 rounded-tl-none'} text-lg md:text-xl font-black leading-tight whitespace-pre-wrap uppercase tracking-tight`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[#e85d97] animate-pulse ml-4 md:ml-6 font-black tracking-[0.5em] text-[10px] md:text-xs uppercase">Camila está escrevendo...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 md:p-10 border-t-4 border-slate-50 bg-white flex gap-4 md:gap-6">
              <input 
                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="DIGITE AQUI..." 
                className="flex-1 bg-slate-50 border-2 md:border-4 border-slate-100 rounded-2xl md:rounded-3xl px-6 md:px-10 py-4 md:py-6 text-lg md:text-xl outline-none focus:border-[#e85d97] focus:bg-white transition-all font-black text-black uppercase placeholder:opacity-40" 
              />
              <button onClick={handleSendMessage} className="bg-[#e85d97] text-white w-16 md:w-24 h-16 md:h-22 rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 md:border-4 border-white shrink-0">
                <ChevronRight size={32} md:size={44} strokeWidth={4} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
