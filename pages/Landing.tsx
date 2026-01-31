
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e85d97] rounded-xl flex items-center justify-center text-white font-black">L</div>
          <span className="text-xl font-black tracking-tighter">Lar Inteligente</span>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-bold text-slate-400">Entrar</button>
          <button onClick={() => navigate('/login')} className="bg-[#e85d97]/10 text-[#e85d97] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest">Começar Agora</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center px-8 pt-12 pb-20 text-center space-y-8">
        <div className="bg-rose-50 text-[#e85d97] px-6 py-2 rounded-full border border-rose-100 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest">Cuidado • Economia • Amor</span>
        </div>
        
        <h1 className="text-6xl font-black leading-[1] tracking-tighter text-slate-900">
          Sua Casa <br />
          <span className="text-[#e85d97]">Organizada.</span>
        </h1>

        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
          O assistente que entende a rotina da sua família. Receitas baratas, controle de gastos e o carinho da Dona Camila.
        </p>

        <div className="w-full max-w-sm pt-4 space-y-6">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-slate-900 text-white py-8 rounded-[2rem] text-2xl font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Começar Agora
          </button>
          
          <div className="bg-slate-100 p-6 rounded-[2rem] flex items-center justify-center gap-4">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>)}
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               +10.000 Famílias Felizes
             </p>
          </div>
        </div>

        {/* Feature Preview Area */}
        <div className="w-full pt-10 relative">
          <div className="bg-slate-50 aspect-video rounded-[3rem] overflow-hidden border border-slate-100 relative shadow-inner">
             <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" alt="Home" />
             
             {/* Dona Camila Bubble */}
             <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl shrink-0">👵</div>
                <div className="text-left">
                   <p className="text-sm font-black text-slate-900 leading-none">"Calma, querido... Eu te ajudo!"</p>
                   <p className="text-[9px] font-black text-[#e85d97] uppercase mt-1 tracking-widest">Dona Camila</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Landing */}
        <div className="w-full bg-slate-950 p-10 rounded-[3rem] mt-10">
           <h3 className="text-white text-3xl font-black mb-4">Lar Inteligente</h3>
           <p className="text-slate-500 text-sm mb-8">Feito com carinho para facilitar a vida de quem cuida de tudo.</p>
           <button onClick={() => navigate('/login')} className="w-full bg-[#e85d97] text-white py-5 rounded-2xl font-black">Começar Agora</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
