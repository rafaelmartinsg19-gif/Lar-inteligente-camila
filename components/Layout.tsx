
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Home, BookOpen, X, Sparkles, LogOut, ChevronRight, 
  Utensils, ShoppingBasket, Wallet, Zap, Wrench, ArrowUpDown, Type
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
  
  // Estado para altura expandida
  const [isExpanded, setIsExpanded] = useState(() => {
    return localStorage.getItem('lar_inteligente_expanded') === 'true';
  });

  // Estado para tamanho da fonte (1 = 100%, 1.15 = 115%, 1.3 = 130%)
  const [fontScale, setFontScale] = useState(() => {
    return Number(localStorage.getItem('lar_inteligente_font_scale')) || 1;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Receitas', path: '/recipes', icon: Utensils },
    { label: 'Mercado', path: '/market', icon: ShoppingBasket },
    { label: 'Finanças', path: '/finances', icon: Wallet },
    { label: 'Utilidades', path: '/utilities', icon: Zap },
    { label: 'Reparos', path: '/maintenance', icon: Wrench },
  ];

  // Efeito para persistir altura
  useEffect(() => {
    localStorage.setItem('lar_inteligente_expanded', isExpanded.toString());
  }, [isExpanded]);

  // Efeito para aplicar e persistir escala de fonte
  useEffect(() => {
    document.documentElement.style.setProperty('--global-scale', fontScale.toString());
    localStorage.setItem('lar_inteligente_font_scale', fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const toggleFontScale = () => {
    if (fontScale === 1) setFontScale(1.15);
    else if (fontScale === 1.15) setFontScale(1.3);
    else setFontScale(1);
  };

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
    <div className={`flex flex-col min-h-screen w-full transition-all duration-500 ${isExpanded ? 'pb-96' : ''}`}>
      {/* HEADER PADRÃO IDEAL */}
      <header className="h-20 md:h-24 bg-white/90 backdrop-blur-xl border-b border-white flex items-center justify-center px-6 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-50 rounded-xl text-slate-900 shadow-sm hover:bg-slate-50 transition-all">
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-black text-black tracking-tighter uppercase leading-none">Lar Inteligente</h1>
              <p className="text-[#e85d97] font-black tracking-widest text-[9px] uppercase">{title || 'PAINEL'}</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-[#e85d97] ${location.pathname === item.path ? 'text-[#e85d97]' : 'text-slate-400'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* BOTÃO PARA AUMENTAR FONTE */}
            <button 
              onClick={toggleFontScale}
              title="Aumentar Letras"
              className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-sm ${fontScale > 1 ? 'bg-[#e85d97] border-[#e85d97] text-white' : 'bg-white border-slate-50 text-slate-400'}`}
            >
              <Type size={18} />
              <span className="text-[7px] font-black uppercase leading-none mt-0.5">
                {fontScale === 1 ? 'A' : fontScale === 1.15 ? 'A+' : 'A++'}
              </span>
            </button>

            {/* BOTÃO PARA AUMENTAR ALTURA DO SITE */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              title="Ajustar Altura do Site"
              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all shadow-sm ${isExpanded ? 'bg-indigo-600 border-indigo-500 text-white rotate-180' : 'bg-white border-slate-50 text-slate-400'}`}
            >
              <ArrowUpDown size={20} />
            </button>

            <button 
              onClick={() => { if(confirm('Sair do app?')) navigate('/login') }} 
              className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border-2 border-white shadow-sm hover:bg-rose-100 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PADRONIZADO COM ALTURA DINÂMICA */}
      <main className={`flex-1 flex justify-center w-full px-4 relative transition-all duration-700 ${isExpanded ? 'py-24' : 'py-8'}`}>
        <div className={`w-full max-w-5xl relative z-10 transition-all duration-700 ${isExpanded ? 'space-y-32' : 'space-y-0'}`}>
          {children}
        </div>
      </main>

      {/* NAV MOBILE AMPLIADA */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 flex justify-center px-8 z-50 pointer-events-none">
        <nav className="w-full max-w-md h-20 bg-white/95 backdrop-blur-md rounded-[2.5rem] flex justify-around items-center px-8 shadow-2xl border-[6px] border-white pointer-events-auto">
          <button onClick={() => navigate('/home')} className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isHome ? 'text-[#e85d97]' : 'text-slate-400'}`}>
            <Home size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
          </button>

          <button 
            onClick={() => setIsChatOpen(true)}
            className="relative -top-10 w-20 h-20 bg-[#e85d97] text-white rounded-full flex items-center justify-center shadow-2xl border-[6px] border-white active:scale-95 transition-all animate-bounce-slow"
          >
            <Sparkles size={36} />
          </button>

          <button onClick={() => navigate('/manual')} className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isManual ? 'text-[#e85d97]' : 'text-slate-400'}`}>
            <BookOpen size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Manual</span>
          </button>
        </nav>
      </div>

      {/* CHAT */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white h-[80vh] rounded-[2.5rem] shadow-2xl border-4 border-white flex flex-col overflow-hidden">
            <div className="h-20 px-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#e85d97] text-white rounded-xl flex items-center justify-center text-xl font-black">C</div>
                <h3 className="font-black text-black text-lg leading-none uppercase tracking-tighter">Dona Camila</h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-black"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.length === 0 && (
                <div className="bg-slate-50 p-6 rounded-[1.5rem] rounded-tl-none border-2 border-white text-lg font-bold text-slate-900 uppercase italic">
                  "Olá {userName}! Em que posso te ajudar com economia hoje?"
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[1.5rem] ${msg.role === 'user' ? 'bg-[#5d4037] text-white rounded-tr-none' : 'bg-slate-50 text-slate-900 rounded-tl-none border-2 border-white'} text-lg font-bold uppercase tracking-tight`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[#e85d97] animate-pulse ml-4 font-black text-[10px] uppercase">Escrevendo...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4">
              <input 
                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Mensagem..." 
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-full px-6 py-4 outline-none focus:border-[#e85d97] font-bold text-black uppercase placeholder:opacity-40" 
              />
              <button onClick={handleSendMessage} className="bg-[#e85d97] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all">
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;
