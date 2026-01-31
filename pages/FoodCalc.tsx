
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

  // CONSTANTES TÉCNICAS RECALIBRADAS (MÉDIAS DE NUTRIÇÃO BRASILEIRA)
  const BASES = {
    proteins: {
      beef: { label: 'Carne Bovina', qty: 180, unit: 'g', price: 42.90, lossFactor: 1.15 }, // 15% perda (limpeza/gordura)
      chicken: { label: 'Frango (Filé)', qty: 200, unit: 'g', price: 19.90, lossFactor: 1.10 },
      fish: { label: 'Peixe', qty: 220, unit: 'g', price: 38.00, lossFactor: 1.12 },
      pork: { label: 'Porco', qty: 200, unit: 'g', price: 24.50, lossFactor: 1.15 },
      eggs: { label: 'Ovos', qty: 2, unit: 'un', price: 0.85, lossFactor: 1 }
    },
    sides: {
      traditional: [
        { label: 'Arroz (Grão)', qty: 75, unit: 'g', price: 6.50 }, // Rende 3x cozido
        { label: 'Feijão (Grão)', qty: 55, unit: 'g', price: 9.00 } // Rende 2.5x cozido
      ],
      pasta: [ { label: 'Macarrão', qty: 100, unit: 'g', price: 7.90 } ],
      fit: [ { label: 'Mix de Legumes', qty: 250, unit: 'g', price: 14.00 } ]
    },
    misc: 4.20 // Óleo, sal, temperos, gás e água por refeição total
  };

  const calculation = useMemo(() => {
    const factor = mealType === 'AJ' ? 2 : 1;
    const totalMeals = people * factor;
    const safetyMargin = 1.05; // 5% extra para "quem chegar"
    
    const pData = BASES.proteins[protein];
    // Qtd Total = Pessoas * Refeições * Qtd Base * Fator de Perda * Margem Segurança
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
    if (unit === 'un') return `${Math.ceil(qty)} un`;
    if (qty >= 1000) return `${(qty / 1000).toFixed(3).replace('.', ',')} kg`;
    return `${Math.round(qty)} g`;
  };

  return (
    <Layout userName={userName} title="Cálculo de Suprimentos" onBack={() => navigate('/home')}>
      <div className="space-y-10 pb-32">
        <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
           <div className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center shadow-2xl">
              <Scale size={40} strokeWidth={3} />
           </div>
           <div>
              <h2 className="text-5xl font-black text-black tracking-tighter uppercase leading-none">Precisão na Mesa</h2>
              <p className="text-xl text-[#5d4037] font-black uppercase opacity-60">Matemática contra o desperdício.</p>
           </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border-4 border-[#f0f0f0] shadow-2xl space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Total de Comensais</label>
                 <div className="flex items-center justify-between bg-[#fdfaf6] p-4 rounded-[2.5rem] border-4 border-white shadow-inner">
                    <button onClick={() => setPeople(p => Math.max(1, p-1))} className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center font-black active:scale-90 border-4 border-slate-100 hover:border-black transition-all">
                      <Minus size={36} strokeWidth={4} />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-7xl font-black text-black tracking-tighter leading-none">{people}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pessoas</span>
                    </div>
                    <button onClick={() => setPeople(p => p+1)} className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center font-black active:scale-90 shadow-2xl hover:scale-110 transition-all">
                      <Plus size={36} strokeWidth={4} />
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Frequência Diária</label>
                 <div className="grid grid-cols-3 gap-3 bg-[#fdfaf6] p-3 rounded-[2.5rem] border-4 border-white shadow-inner h-28">
                    {[
                      { id: 'A', label: 'Almoço' },
                      { id: 'J', label: 'Jantar' },
                      { id: 'AJ', label: 'Ambos' }
                    ].map((t) => (
                      <button 
                        key={t.id}
                        onClick={() => setMealType(t.id as any)} 
                        className={`rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mealType === t.id ? 'bg-white shadow-xl text-black border-2 border-slate-100' : 'text-slate-400 hover:text-black'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Proteína Selecionada</label>
              <div className="grid grid-cols-5 gap-4">
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
                    className={`aspect-square rounded-[2.5rem] flex items-center justify-center text-4xl transition-all border-4 ${protein === item.id ? 'bg-black border-black text-white shadow-2xl scale-110' : 'bg-[#fdfaf6] border-white text-slate-300 hover:border-slate-200'}`}
                   >
                     {item.icon}
                   </button>
                 ))}
              </div>
           </div>

           <div className="pt-10 border-t-4 border-[#fdfaf6] grid grid-cols-3 gap-4">
             {[
               { id: 'traditional', label: 'Brasileiro', desc: 'Arroz & Feijão' },
               { id: 'pasta', label: 'Cantina', desc: 'Massa Italiana' },
               { id: 'fit', label: 'Saudável', desc: 'Vegetais Vapor' }
             ].map((item) => (
               <button 
                key={item.id}
                onClick={() => setSide(item.id as SideType)}
                className={`p-6 rounded-[2.5rem] border-4 transition-all text-center h-28 flex flex-col justify-center ${side === item.id ? 'bg-[#5d4037] border-[#5d4037] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-900'}`}
               >
                 <p className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</p>
                 <p className="text-[9px] font-black opacity-60 mt-2 uppercase">{item.desc}</p>
               </button>
             ))}
           </div>
        </div>

        {/* LISTA DE COMPRAS CALCULADA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-12 rounded-[4rem] border-4 border-[#f0f0f0] shadow-2xl space-y-6 group hover:border-[#a34e36] transition-all">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a34e36]">Proteína Necessária</p>
                <TrendingDown size={24} className="text-slate-200" />
              </div>
              <h4 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">{calculation.protein.label}</h4>
              <div className="flex items-baseline gap-4 mt-6">
                 <span className="text-7xl font-black text-black tracking-tighter leading-none">
                   {formatUnit(calculation.protein.qtyTotal, calculation.protein.unit).split(' ')[0]}
                 </span>
                 <span className="text-2xl font-black text-[#a34e36] uppercase">
                    {formatUnit(calculation.protein.qtyTotal, calculation.protein.unit).split(' ')[1]}
                 </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Calculado com margem de limpeza</p>
           </div>

           <div className="space-y-6">
              {calculation.sides.map((s, idx) => (
                <div key={idx} className="bg-white p-10 rounded-[3rem] border-4 border-[#f0f0f0] shadow-xl flex items-center justify-between group hover:border-black transition-all">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{s.label}</p>
                      <h4 className="text-5xl font-black text-black tracking-tighter mt-2">{formatUnit(s.qtyTotal, s.unit)}</h4>
                   </div>
                   <div className="w-16 h-16 bg-[#fdfaf6] rounded-2xl flex items-center justify-center text-slate-200 group-hover:bg-black group-hover:text-white transition-all">
                      <Scale size={32} />
                   </div>
                </div>
              ))}
              <div className="bg-[#5d4037] p-8 rounded-[3rem] text-white flex items-center justify-between shadow-2xl border-b-8 border-black/20">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Temperos & Gás</p>
                 <span className="text-2xl font-black tracking-tighter">Rateio Incluso</span>
              </div>
           </div>
        </div>

        {/* FECHAMENTO FINANCEIRO */}
        <div className="bg-black p-16 rounded-[4.5rem] text-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                 <label className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-500">Estimativa Total de Compra</label>
                 <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-emerald-500">R$</span>
                    <h3 className="text-9xl font-black tracking-tighter leading-none">
                      {calculation.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 w-full md:w-80">
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Custo p/ Prato</p>
                    <p className="text-4xl font-black text-emerald-400 tracking-tighter">R$ {calculation.costPerMeal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Refeições</p>
                    <p className="text-4xl font-black text-white tracking-tighter">{calculation.totalMeals} Pratos</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-500">
              <div className="flex items-center gap-4">
                 <Info size={28} />
                 <p className="text-[12px] font-black italic max-w-md leading-snug">Os valores utilizam médias de preços de 2026. Recomendamos conferir ofertas locais no menu "Feira".</p>
              </div>
              <Button3D onClick={() => navigate('/recipes')} size="lg" color="success" className="h-20 px-12 text-lg">
                Gerar Cardápio <ChevronRight size={28} />
              </Button3D>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoodCalc;
