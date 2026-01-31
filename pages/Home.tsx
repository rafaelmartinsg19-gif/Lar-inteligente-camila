
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Utensils, 
  ShoppingBasket, 
  Wallet, 
  Calculator, 
  Zap, 
  Wrench,
  Search,
  Sparkles,
  ChevronRight,
  Coffee,
  ChefHat
} from 'lucide-react';

const Home: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<'painel' | 'manual'>('painel');

  const menuItems = [
    { title: 'Receitas', desc: 'Economia e Sabor', icon: ChefHat, color: 'text-[#a34e36]', bg: 'bg-orange-50', path: '/recipes' },
    { title: 'Mercado', desc: 'Preços por CEP', icon: ShoppingBasket, color: 'text-emerald-700', bg: 'bg-emerald-50', path: '/market' },
    { title: 'Finanças', desc: 'Livro de Contas', icon: Wallet, color: 'text-amber-700', bg: 'bg-amber-50', path: '/finances' },
    { title: 'Calculadora', desc: 'Xepa Inteligente', icon: Calculator, color: 'text-rose-700', bg: 'bg-rose-50', path: '/food-calc' },
    { title: 'Utilidades', desc: 'Luz, Água e Gás', icon: Zap, color: 'text-blue-700', bg: 'bg-blue-50', path: '/utilities' },
    { title: 'Manutenção', desc: 'Reparos DIY', icon: Wrench, color: 'text-indigo-700', bg: 'bg-indigo-50', path: '/maintenance' },
  ];

  return (
    <Layout userName={userName}>
      <div className="space-y-8 md:space-y-12 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 md:w-16 md:h-16 bg-white border-4 border-[#e85d97] rounded-full flex items-center justify-center shadow-lg text-2xl">👩‍🍳</div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none uppercase">Oi, {userName}!</h1>
            </div>
            <p className="text-xl md:text-2xl text-[#5d4037] font-black tracking-tight uppercase">Como vamos cuidar do lar hoje?</p>
          </div>
          
          <div className="flex bg-white/80 backdrop-blur p-1.5 md:p-2 rounded-[2rem] md:rounded-[2.5rem] border-2 md:border-4 border-white shadow-xl self-start md:self-auto">
             <button onClick={() => setView('painel')} className={`px-6 md:px-10 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] transition-all ${view === 'painel' ? 'bg-[#5d4037] text-white shadow-lg' : 'text-slate-500 hover:text-black'}`}>Mesa Posta</button>
             <button onClick={() => navigate('/manual')} className={`px-6 md:px-10 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] transition-all text-slate-500 hover:text-black`}>O Guia</button>
          </div>
        </div>

        {/* AI Banner Aconchegante */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-4 border-[#f0f0f0] shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden group">
           <div className="w-20 h-20 md:w-24 md:h-24 bg-[#e85d97] rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl flex items-center justify-center text-4xl md:text-5xl shrink-0 transition-transform duration-500 border-4 border-white rotate-3 group-hover:rotate-0">👵</div>
           <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
              <label className="label-premium">Conselho de Vó</label>
              <h3 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-tight">Dona Camila no Chat</h3>
              <p className="text-lg md:text-xl text-[#5d4037] font-black uppercase">"Tudo se resolve com calma e economia."</p>
           </div>
           <button onClick={() => navigate('/manual')} className="w-full md:w-auto bg-[#5d4037] text-white px-10 md:px-12 py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">Manual Completo</button>
        </div>

        {/* Grade Responsiva Adaptativa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {menuItems.map((item, idx) => (
             <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="kitchen-card p-8 md:p-12 flex flex-col gap-6 md:gap-10 text-left group h-full relative overflow-hidden"
             >
               <div className="flex justify-between items-start">
                  <div className={`w-16 h-16 md:w-20 md:h-20 ${item.bg} ${item.color} rounded-[1.5rem] md:rounded-3xl flex items-center justify-center shadow-inner border-2 border-white/50`}>
                    <item.icon size={36} className="md:w-[44px] md:h-[44px]" strokeWidth={3} />
                  </div>
                  <ChevronRight size={32} className="text-slate-200 group-hover:text-[#e85d97] transition-all md:group-hover:translate-x-2" />
               </div>
               
               <div className="space-y-1.5 md:space-y-2">
                 <h3 className="text-2xl md:text-3xl font-black text-black tracking-tighter leading-none uppercase">{item.title}</h3>
                 <p className="text-[10px] md:text-[12px] text-[#a34e36] font-black uppercase tracking-[0.2em] mt-2 opacity-70">{item.desc}</p>
               </div>
             </button>
           ))}
        </div>

        {/* Estatísticas de Rodapé */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12 border-t-8 border-white">
           <div className="bg-[#5d4037] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex justify-between items-center shadow-xl border-b-4 md:border-b-8 border-black/20">
              <div>
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Economia</p>
                <h4 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">R$ 420</h4>
              </div>
              <Coffee size={40} md:size={48} className="text-white/10" strokeWidth={3} />
           </div>
           <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-[#f0f0f0] flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Mesa Posta</p>
                <h4 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase">12/21</h4>
              </div>
              <Utensils size={40} md:size={48} className="text-slate-100" strokeWidth={3} />
           </div>
           <div className="bg-[#e85d97] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white flex justify-between items-center shadow-xl border-b-4 md:border-b-8 border-rose-900/20">
              <div>
                <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Nível Gás</p>
                <h4 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">72%</h4>
              </div>
              <Zap size={40} md:size={48} className="text-white/10" strokeWidth={3} />
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
