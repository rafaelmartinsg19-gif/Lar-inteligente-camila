
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Users, Minus, Plus, ChevronRight, Info, DollarSign, Scale, TrendingDown } from 'lucide-react';
import Button3D from '../components/Button3D';

type ProteinType = 'beef' | 'chicken' | 'fish' | 'pork' | 'eggs';
type SideType = 'traditional' | 'pasta' | 'fit';

const FoodCalc: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [people, setPeople] = useState(4);
  const [mealType, setMealType] = useState<'A' | 'J' | 'AJ'>('AJ');
  const [protein, setProtein] = useState<ProteinType>('beef');
  const [side, setSide] = useState<SideType>('traditional');

  const BASES = {
    proteins: {
      beef: { label: 'Carne Bovina', qty: 180, unit: 'g', price: 42.90, lossFactor: 1.15 },
      chicken: { label: 'Frango (Filé)', qty: 200, unit: 'g', price: 19.90, lossFactor: 1.10 },
      fish: { label: 'Peixe', qty: 220, unit: 'g', price: 38.00, lossFactor: 1.12 },
      pork: { label: 'Porco', qty: 200, unit: 'g', price: 24.50, lossFactor: 1.15 },
      eggs: { label: 'Ovos', qty: 2, unit: 'un', price: 0.85, lossFactor: 1 }
    },
    sides: {
      traditional: [
        { label: 'Arroz (Grão)', qty: 75, unit: 'g', price: 6.50 },
        { label: 'Feijão (Grão)', qty: 55, unit: 'g', price: 9.00 }
      ],
      pasta: [ { label: 'Macarrão', qty: 100, unit: 'g', price: 7.90 } ],
      fit: [ { label: 'Mix de Legumes', qty: 250, unit: 'g', price: 14.00 } ]
    },
    misc: 4.20
  };

  const calculation = useMemo(() => {
    const factor = mealType === 'AJ' ? 2 : 1;
    const totalMeals = people * factor;
    const safetyMargin = 1.05;
    
    const pData = BASES.proteins[protein];
    const pQtyRaw = pData.qty * totalMeals * (pData.lossFactor || 1) * safetyMargin;
    const pCost = pData.unit === 'g' ? (pQtyRaw / 1000) * pData.price : pQtyRaw * pData.price;

    const sideItems = BASES.sides[side].map(s => {
      const sQty = s.qty * totalMeals * safetyMargin;
      const sCost = (sQty / 1000) * s.price;
      return { ...s, qtyTotal: sQty, costTotal: sCost };
    });

    const totalSideCost = sideItems.reduce((acc, curr) => acc + curr.costTotal, 0);
    const totalMiscCost = BASES.misc * totalMeals;
    const totalDayCost = pCost + totalSideCost + totalMiscCost;

    return {
      totalMeals,
      protein: { ...pData, qtyTotal: pQtyRaw, costTotal: pCost },
      sides: sideItems,
      totalCost: totalDayCost,
      costPerMeal: totalDayCost / totalMeals
    };
  }, [people, mealType, protein, side]);

  const formatUnit = (qty: number, unit: string) => {
    if (unit === 'un') return { val: Math.ceil(qty).toString(), unit: 'un' };
    if (qty >= 1000) return { val: (qty / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }), unit: 'KG' };
    return { val: Math.round(qty).toString(), unit: 'G' };
  };

  return (
    <Layout userName={userName} title="Cálculo de Suprimentos" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 pb-48 px-4">
        <div className="flex items-center gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
           <div className="w-24 h-24 bg-black text-white rounded-[2rem] flex items-center justify-center shadow-2xl shrink-0">
              <Scale size={48} strokeWidth={3} />
           </div>
           <div>
              <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">Precisão na Mesa</h2>
              <p className="text-xl md:text-3xl text-[#5d4037] font-black uppercase opacity-60">Matemática contra o desperdício.</p>
           </div>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] border-8 border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] space-y-12 md:space-y-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              <div className="space-y-6">
                 <label className="label-premium">Total de Pessoas</label>
                 <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[3rem] border-4 border-white shadow-inner">
                    <button onClick={() => setPeople(p => Math.max(1, p-1))} className="w-16 h-16 md:w-24 md:h-24 bg-white text-black rounded-3xl flex items-center justify-center font-black active:scale-90 border-4 border-slate-100 shadow-lg">
                      <Minus size={36} strokeWidth={5} />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">{people}</span>
                    </div>
                    <button onClick={() => setPeople(p => p+1)} className="w-16 h-16 md:w-24 md:h-24 bg-black text-white rounded-3xl flex items-center justify-center font-black active:scale-90 shadow-2xl">
                      <Plus size={36} strokeWidth={5} />
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="label-premium">Frequência</label>
                 <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-[3rem] border-4 border-white shadow-inner h-32 md:h-40">
                    {[
                      { id: 'A', label: 'Almoço' },
                      { id: 'J', label: 'Jantar' },
                      { id: 'AJ', label: 'Ambos' }
                    ].map((t) => (
                      <button 
                        key={t.id}
                        onClick={() => setMealType(t.id as any)} 
                        className={`rounded-[2.5rem] text-xs md:text-sm font-black uppercase tracking-widest transition-all ${mealType === t.id ? 'bg-white shadow-2xl text-black border-4 border-slate-50' : 'text-slate-400'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-10">
              <label className="label-premium">Escolha a Proteína</label>
              <div className="grid grid-cols-5 gap-4 md:gap-8">
                 {[
                   { id: 'beef', icon: '🥩' },
                   { id: 'chicken', icon: '🍗' },
                   { id: 'pork', icon: '🐖' },
                   { id: 'fish', icon: '🐟' },
                   { id: 'eggs', icon: '🥚' }
                 ].map((item) => (
                   <button 
                    key={item.id}
                    onClick={() => setProtein(item.id as ProteinType)}
                    className={`aspect-square rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center text-4xl md:text-6xl transition-all border-8 ${protein === item.id ? 'bg-black border-black text-white shadow-3xl scale-110' : 'bg-slate-50 border-white text-slate-300'}`}
                   >
                     {item.icon}
                   </button>
                 ))}
              </div>
           </div>

           <div className="pt-12 border-t-8 border-slate-50 grid grid-cols-3 gap-4 md:gap-8">
             {[
               { id: 'traditional', label: 'Brasileiro', desc: 'Arroz & Feijão' },
               { id: 'pasta', label: 'Cantina', desc: 'Massas' },
               { id: 'fit', label: 'Saudável', desc: 'Legumes' }
             ].map((item) => (
               <button 
                key={item.id}
                onClick={() => setSide(item.id as SideType)}
                className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border-4 transition-all text-center ${side === item.id ? 'bg-[#5d4037] border-[#5d4037] text-white shadow-3xl' : 'bg-slate-50 border-white text-black'}`}
               >
                 <p className="text-xs md:text-lg font-black uppercase tracking-[0.2em] leading-none">{item.label}</p>
                 <p className="text-[10px] md:text-xs font-black opacity-50 mt-2 uppercase">{item.desc}</p>
               </button>
             ))}
           </div>
        </div>

        {/* RESULTADOS AMPLIADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
           {/* PROTEINA CARD */}
           <div className="bg-white p-12 md:p-20 rounded-[4rem] md:rounded-[6rem] border-8 border-white shadow-3xl space-y-8 flex flex-col justify-center min-h-[400px]">
              <div>
                <label className="label-premium text-[#a34e36]">Proteína Necessária</label>
                <h4 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase leading-none break-words">{calculation.protein.label}</h4>
              </div>
              <div className="flex items-baseline gap-4 md:gap-6 mt-10">
                 <span className="text-8xl md:text-9xl lg:text-[10rem] font-black text-black tracking-tighter leading-none">
                   {formatUnit(calculation.protein.qtyTotal, calculation.protein.unit).val}
                 </span>
                 <span className="text-4xl md:text-5xl font-black text-[#a34e36] uppercase">
                    {formatUnit(calculation.protein.qtyTotal, calculation.protein.unit).unit}
                 </span>
              </div>
              <p className="text-sm md:text-xl font-black text-slate-400 uppercase tracking-widest mt-6">Calculado com margem técnica</p>
           </div>

           {/* ACOMPANHAMENTOS */}
           <div className="space-y-8 md:space-y-12">
              {calculation.sides.map((s, idx) => {
                const f = formatUnit(s.qtyTotal, s.unit);
                return (
                  <div key={idx} className="bg-white p-10 md:p-14 rounded-[3.5rem] md:rounded-[5rem] border-8 border-white shadow-2xl flex items-center justify-between group transition-all min-h-[180px]">
                     <div className="space-y-2">
                        <label className="label-premium opacity-50">{s.label}</label>
                        <div className="flex items-baseline gap-4">
                          <h4 className="text-6xl md:text-8xl font-black text-black tracking-tighter leading-none">{f.val}</h4>
                          <span className="text-2xl md:text-3xl font-black text-slate-300">{f.unit}</span>
                        </div>
                     </div>
                     <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 group-hover:bg-black group-hover:text-white transition-all shrink-0">
                        <Scale size={48} strokeWidth={3} />
                     </div>
                  </div>
                );
              })}
              <div className="bg-[#5d4037] p-10 md:p-12 rounded-[3.5rem] md:rounded-[5rem] text-white flex items-center justify-between shadow-3xl border-b-[12px] border-black/30">
                 <p className="text-sm md:text-lg font-black uppercase tracking-[0.4em] opacity-60">Temperos & Gás</p>
                 <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Rateio Incluso</span>
              </div>
           </div>
        </div>

        {/* RESUMO FINANCEIRO - GIGANTE */}
        <div className="bg-black p-12 md:p-24 rounded-[4rem] md:rounded-[8rem] text-white shadow-[0_60px_150px_rgba(0,0,0,0.5)] relative overflow-hidden text-center md:text-left">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]"></div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
              <div className="space-y-8 flex-1">
                 <label className="text-xs md:text-xl font-black uppercase tracking-[0.6em] text-slate-500">Investimento Total Estimado</label>
                 <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-6">
                    <span className="text-4xl md:text-6xl font-black text-emerald-500">R$</span>
                    <h3 className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter leading-[0.8] break-all">
                      {calculation.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 w-full md:w-[400px] shrink-0">
                 <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-4 border-white/10 text-center">
                    <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Custo p/ Prato</p>
                    <p className="text-4xl md:text-6xl font-black text-emerald-400 tracking-tighter">R$ {calculation.costPerMeal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 </div>
                 <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-4 border-white/10 text-center">
                    <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Total de Refeições</p>
                    <p className="text-4xl md:text-6xl font-black text-white tracking-tighter">{calculation.totalMeals} Pratos</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-16 pt-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-6 max-w-2xl">
                 <Info size={48} className="text-slate-500 shrink-0" />
                 <p className="text-sm md:text-2xl font-black italic text-slate-500 leading-tight">Preços baseados na média nacional de 2026. Verifique promoções locais no menu "Mercado".</p>
              </div>
              <Button3D onClick={() => navigate('/recipes')} size="xl" color="success" className="h-24 md:h-32 px-12 md:px-20 text-2xl md:text-4xl w-full md:w-auto rounded-[3rem] md:rounded-[4rem]">
                Abrir Cardápio <ChevronRight size={48} strokeWidth={5} />
              </Button3D>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoodCalc;
