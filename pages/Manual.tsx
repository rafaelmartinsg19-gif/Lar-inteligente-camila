
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BookOpen, Utensils, ShoppingBasket, Wallet, Zap, ChevronRight, Info } from 'lucide-react';

const Manual: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Utensils,
      title: "Receitas Inteligentes",
      desc: "Eficiência calórica e financeira",
      tips: [
        "**Filtre por categorias** para encontrar refeições compatíveis com seu tempo disponível.",
        "O preparo de **marmitas semanais** pode economizar até 4 horas de trabalho diário.",
        "Utilize as **substituições inteligentes** sugeridas para driblar a inflação sazonal."
      ],
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: ShoppingBasket,
      title: "Estratégia de Compras",
      desc: "Logística e estocagem inteligente",
      tips: [
        "Consulte sempre o **mapa de safra mensal** antes de planejar sua lista de mercado.",
        "Compras na **xepa da feira** (pós 11h) reduzem custos em hortifrúti em até **60%**.",
        "Priorize o estoque de itens não perecíveis durante períodos de promoções agressivas."
      ],
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Wallet,
      title: "Engenharia Financeira",
      desc: "Controle absoluto do fluxo de caixa",
      tips: [
        "**Categorize cada gasto** individualmente para identificar fugas de capital.",
        "Mantenha uma reserva dedicada para **manutenções emergenciais** inesperadas.",
        "Revise suas assinaturas recorrentes trimestralmente para eliminar gastos ociosos."
      ],
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Zap,
      title: "Gestão de Consumo",
      desc: "Monitoramento de utilidades fixas",
      tips: [
        "Aparelhos em modo **stand-by** podem representar até 12% da sua conta de energia.",
        "Monitore o **nível de gás** semanalmente para evitar interrupções no preparo de alimentos.",
        "Reduzir o tempo de banho para 8 minutos gera uma economia hídrica imediata."
      ],
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];

  return (
    <Layout userName={userName} title="Base de Conhecimento" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-16 py-10">
        
        {/* HEADER MANUAL */}
        <div className="bg-white p-14 rounded-[4rem] border border-slate-100 shadow-xl flex flex-col items-center text-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full -mr-40 -mt-40 blur-[100px] opacity-60"></div>
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 z-10">
            <BookOpen size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-6 z-10">
            <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none">Guia de Excelência Doméstica</h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto tracking-tight">
              Sua jornada para um lar mais **organizado, eficiente e econômico** começa aqui.
            </p>
          </div>
        </div>

        {/* SEÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10 group hover:border-indigo-300 transition-all duration-500">
               <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 ${section.bg} ${section.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                   <section.icon size={32} />
                 </div>
                 <div>
                   <h3 className="text-3xl font-heading font-extrabold text-slate-950 tracking-tighter leading-none">{section.title}</h3>
                   <p className="overline text-slate-400 mt-1">{section.desc}</p>
                 </div>
               </div>

               <div className="space-y-5">
                 {section.tips.map((tip, i) => (
                   <div key={i} className="flex gap-5 items-start">
                     <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                       {i+1}
                     </div>
                     <p className="text-lg text-slate-600 font-medium leading-snug tracking-tight">
                       {tip.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 font-black">{part}</strong> : part)}
                     </p>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>

        {/* BANNER FINAL */}
        <div className="bg-slate-950 p-14 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full -ml-40 -mb-40 blur-[100px]"></div>
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-indigo-400 shrink-0 border border-white/5">
            <Info size={40} />
          </div>
          <div className="space-y-4 z-10 text-center md:text-left">
            <h4 className="overline text-indigo-400 tracking-[0.3em]">Sabedoria da Dona Camila</h4>
            <p className="text-2xl md:text-3xl font-black leading-tight tracking-tight italic text-slate-100">
              "A verdadeira riqueza de um lar não está no que entra, mas na sabedoria de evitar o desperdício."
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Manual;
