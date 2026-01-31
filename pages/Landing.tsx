
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Star } from 'lucide-react';
import Button3D from '../components/Button3D';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-y-auto overflow-x-hidden">
      {/* HEADER PADRÃO IDEAL */}
      <header className="px-6 md:px-12 py-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#e85d97] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3">L</div>
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Lar Inteligente</span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => navigate('/login')} className="hidden sm:block text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#e85d97] transition-colors">Entrar</button>
          <button onClick={() => navigate('/login')} className="bg-[#e85d97] text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Começar</button>
        </div>
      </header>

      {/* HERO SECTION - PADRÃO IDEAL */}
      <main className="flex-1 flex flex-col items-center px-6 md:px-12 pt-12 md:pt-24 pb-20 text-center space-y-10 max-w-5xl mx-auto">
        <div className="bg-rose-50 text-[#e85d97] px-6 py-2 rounded-full border border-rose-100 flex items-center gap-3">
          <Star size={16} fill="currentColor" />
          <span className="text-[10px] font-black uppercase tracking-widest">Cuidado • Economia • Amor</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter text-black uppercase">
          Sua Casa <br />
          <span className="text-[#e85d97]">Organizada.</span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-400 font-bold leading-tight max-w-2xl mx-auto uppercase tracking-tight">
          O assistente que entende a rotina da sua família. Receitas baratas, controle de gastos e o carinho da Dona Camila.
        </p>

        <div className="w-full max-w-md pt-6 space-y-8">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-slate-950 text-white py-8 rounded-[2rem] text-2xl md:text-3xl font-black shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all group border-b-8 border-black/40"
          >
            Começar Agora
            <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-center gap-4 border-2 border-white shadow-inner">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=u${i}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm" alt="User" />
                ))}
             </div>
             <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#5d4037] opacity-60">
               +10.000 Famílias Felizes
             </p>
          </div>
        </div>

        <div className="w-full pt-16 relative group">
          <div className="bg-white aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white relative shadow-2xl">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-90" alt="Home" />
             <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 bg-white p-6 md:p-10 rounded-[2rem] shadow-xl border-4 border-white flex items-center gap-6 animate-in slide-in-from-bottom-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#e85d97] rounded-full flex items-center justify-center text-4xl shrink-0 border-4 border-white">👵</div>
                <div className="text-left flex-1">
                   <p className="text-xl md:text-2xl font-black text-black leading-tight uppercase italic">"Calma, querido... Eu te ajudo a organizar tudo com economia!"</p>
                   <p className="text-[10px] md:text-xs font-black text-[#e85d97] uppercase tracking-widest mt-2">Dona Camila • Sua nova melhor amiga</p>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-slate-950 p-12 md:p-24 mt-20 text-center md:text-left relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 flex-1">
               <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Lar <span className="text-[#e85d97]">Inteligente</span></h3>
               <p className="text-lg md:text-xl text-slate-400 font-bold uppercase tracking-tight leading-snug">Feito com carinho para facilitar a vida de quem cuida de tudo.</p>
            </div>
            <Button3D onClick={() => navigate('/login')} color="primary" size="lg" className="h-16 px-12 text-xl rounded-full bg-[#e85d97]">Começar Agora</Button3D>
         </div>
         <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
            <p className="text-white font-black uppercase text-[10px] tracking-widest">© 2026 Dona Camila Tecnologia e Carinho</p>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
