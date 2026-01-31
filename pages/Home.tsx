
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
      <div className="max-w-5xl mx-auto space-y-10 pb-32">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-24 h-24 bg-white border-4 border-[#e85d97] rounded-full flex items-center justify-center shadow-2xl text-5xl animate-bounce">👩‍🍳</div>
           <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black uppercase leading-none">
                OI, <span className="text-[#e85d97]">{userName}!</span>
              </h1>
              <p className="text-base md:text-xl text-[#5d4037] font-bold tracking-tight uppercase opacity-60">
                Como vamos cuidar do lar hoje?
              </p>
           </div>
           
           <div className="flex bg-white/80 backdrop-blur-md p-2 rounded-full border-2 border-white shadow-xl">
              <button 
                onClick={() => setActiveTab('painel')} 
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'painel' ? 'bg-[#5d4037] text-white shadow-lg' : 'text-slate-400'}`}
              >
                Mesa Posta
              </button>
              <button 
                onClick={() => navigate('/manual')} 
                className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
              >
                O Guia
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CARD DONA CAMILA */}
          <div className="lg:col-span-5 bg-[#5d4037] p-10 rounded-[3rem] border-4 border-white shadow-2xl flex flex-col items-center gap-6 text-center relative overflow-hidden h-full min-h-[400px] justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
             <div className="w-28 h-28 bg-[#e85d97] rounded-[2rem] shadow-2xl flex items-center justify-center text-6xl shrink-0 border-4 border-white rotate-6 relative z-10">👵</div>
             <div className="space-y-4 relative z-10 text-white">
                <div className="flex items-center justify-center gap-2">
                   <AlertTriangle size={18} className="text-amber-400" />
                   <label className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Pulo do Gato</label>
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Dona Camila no Chat</h3>
                <p className="text-lg md:text-xl font-bold uppercase italic opacity-95 leading-tight">"O planejamento é o segredo da fartura."</p>
                <button 
                  onClick={() => navigate('/manual')} 
                  className="w-full bg-white text-[#5d4037] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all border-b-4 border-black/10 mt-4"
                >
                  Consultar Guia
                </button>
             </div>
          </div>

          {/* MENU VERTICAL GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-4">
             {menuItems.map((item, idx) => (
               <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="w-full bg-white/90 backdrop-blur-sm p-6 rounded-3xl flex items-center gap-6 text-left group transition-all border-4 border-white shadow-lg hover:shadow-2xl hover:-translate-y-1"
               >
                 <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner border-2 border-white shrink-0 group-hover:scale-110 transition-transform`}>
                   <item.icon size={32} />
                 </div>
                 
                 <div className="flex-1 min-w-0">
                   <h3 className="text-xl md:text-2xl font-black text-black tracking-tighter leading-none uppercase truncate">{item.title}</h3>
                   <p className="text-[10px] text-[#a34e36] font-black uppercase tracking-[0.2em] opacity-50 truncate mt-1.5">{item.desc}</p>
                 </div>

                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-[#e85d97] group-hover:text-white transition-all">
                    <ChevronRight size={22} strokeWidth={4} />
                 </div>
               </button>
             ))}
          </div>
        </div>

        {/* STATUS BAR PADRONIZADA */}
        <div className="grid grid-cols-3 gap-6 pt-6">
           <div className="bg-emerald-600 p-6 rounded-3xl text-white flex flex-col items-center text-center shadow-xl border-b-8 border-black/20">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-50 mb-2">Economia Acumulada</span>
              <h4 className="text-xl md:text-3xl font-black uppercase leading-none">R$ 420</h4>
           </div>
           <div className="bg-white p-6 rounded-3xl border-4 border-white flex flex-col items-center text-center shadow-xl">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Check-ins realizados</span>
              <h4 className="text-xl md:text-3xl font-black text-black uppercase leading-none">12/21</h4>
           </div>
           <div className="bg-rose-600 p-6 rounded-3xl text-white flex flex-col items-center text-center shadow-xl border-b-8 border-black/20">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-50 mb-2">Reserva de Gás</span>
              <h4 className="text-xl md:text-3xl font-black uppercase leading-none">72%</h4>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
