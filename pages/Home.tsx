
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  ShoppingBasket, 
  Wallet, 
  Calculator, 
  Zap, 
  Wrench,
  ChevronRight,
  ChefHat,
  AlertTriangle
} from 'lucide-react';

const Home: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'painel' | 'guia'>('painel');

  const menuItems = [
    { title: 'Receitas', desc: 'ECONOMIA E SABOR', icon: ChefHat, color: 'text-[#a34e36]', bg: 'bg-orange-50', path: '/recipes' },
    { title: 'Mercado', desc: 'PREÇOS POR CEP', icon: ShoppingBasket, color: 'text-emerald-700', bg: 'bg-emerald-50', path: '/market' },
    { title: 'Finanças', desc: 'LIVRO DE CONTAS', icon: Wallet, color: 'text-amber-700', bg: 'bg-amber-50', path: '/finances' },
    { title: 'Calculadora', desc: 'XEPA INTELIGENTE', icon: Calculator, color: 'text-rose-700', bg: 'bg-rose-50', path: '/food-calc' },
    { title: 'Utilidades', desc: 'LUZ, ÁGUA E GÁS', icon: Zap, color: 'text-blue-700', bg: 'bg-blue-50', path: '/utilities' },
    { title: 'Manutenção', desc: 'REPAROS DIY', icon: Wrench, color: 'text-indigo-700', bg: 'bg-indigo-50', path: '/maintenance' },
  ];

  return (
    <Layout userName={userName} title="PAINEL PRINCIPAL">
      <div className="max-w-xl mx-auto space-y-8 pb-32 px-4">
        
        {/* CABEÇALHO PADRÃO IDEAL */}
        <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-20 h-20 bg-white border-4 border-[#e85d97] rounded-full flex items-center justify-center shadow-lg text-4xl animate-bounce">👩‍🍳</div>
           <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">
                OI, <span className="text-[#e85d97]">{userName}!</span>
              </h1>
              <p className="text-sm md:text-lg text-[#5d4037] font-bold tracking-tight uppercase opacity-60">
                Como vamos cuidar do lar hoje?
              </p>
           </div>
           
           <div className="flex bg-white/80 backdrop-blur p-1.5 rounded-full border-2 border-white shadow-md">
              <button 
                onClick={() => setActiveTab('painel')} 
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'painel' ? 'bg-[#5d4037] text-white shadow-sm' : 'text-slate-400'}`}
              >
                Mesa Posta
              </button>
              <button 
                onClick={() => navigate('/manual')} 
                className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                O Guia
              </button>
           </div>
        </div>

        {/* CARD DONA CAMILA - PADRÃO IDEAL */}
        <div className="bg-[#5d4037] p-6 md:p-8 rounded-[2rem] border-2 border-white shadow-xl flex flex-col items-center gap-4 text-center relative overflow-hidden">
           <div className="w-24 h-24 bg-[#e85d97] rounded-3xl shadow-lg flex items-center justify-center text-5xl shrink-0 border-4 border-white rotate-3">👵</div>
           <div className="space-y-3 relative z-10 text-white">
              <div className="flex items-center justify-center gap-1.5">
                 <AlertTriangle size={14} className="text-amber-400" />
                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400">Dica de Hoje</label>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">Dona Camila no Chat</h3>
              <p className="text-sm md:text-base font-bold uppercase italic opacity-90 leading-tight">"A verdadeira economia começa no planejamento."</p>
              <button 
                onClick={() => navigate('/manual')} 
                className="w-full bg-white text-[#5d4037] py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-slate-50 transition-all border-b-4 border-black/10"
              >
                Ler Guia
              </button>
           </div>
        </div>

        {/* MENU VERTICAL - PADRÃO IDEAL */}
        <div className="space-y-3">
           {menuItems.map((item, idx) => (
             <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="w-full bg-white p-4 md:p-5 rounded-3xl flex items-center gap-4 text-left group transition-all border-2 border-white shadow-md hover:shadow-lg"
             >
               <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner border border-white shrink-0 group-hover:scale-105 transition-transform`}>
                 <item.icon size={28} />
               </div>
               
               <div className="flex-1 min-w-0">
                 <h3 className="text-lg md:text-xl font-black text-black tracking-tighter leading-none uppercase truncate">{item.title}</h3>
                 <p className="text-[9px] text-[#a34e36] font-bold uppercase tracking-widest opacity-50 truncate mt-0.5">{item.desc}</p>
               </div>

               <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-[#e85d97] group-hover:text-white transition-all">
                  <ChevronRight size={18} />
               </div>
             </button>
           ))}
        </div>

        {/* STATUS BAR - PADRÃO IDEAL */}
        <div className="grid grid-cols-3 gap-3 pt-4">
           <div className="bg-emerald-600 p-4 rounded-2xl text-white flex flex-col items-center text-center shadow-md border-b-2 border-black/10">
              <span className="text-[7px] font-black uppercase tracking-widest opacity-50 mb-1">Poupado</span>
              <h4 className="text-base font-black uppercase leading-none">R$ 420</h4>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-md">
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">Atividade</span>
              <h4 className="text-base font-black text-black uppercase leading-none">12/21</h4>
           </div>
           <div className="bg-rose-600 p-4 rounded-2xl text-white flex flex-col items-center text-center shadow-md border-b-2 border-black/10">
              <span className="text-[7px] font-black uppercase tracking-widest opacity-50 mb-1">Gás</span>
              <h4 className="text-base font-black uppercase leading-none">72%</h4>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
