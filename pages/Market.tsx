
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { SEASONAL_DATA } from '../constants';
import { 
  CalendarDays, 
  MapPin, 
  Youtube, 
  ShoppingCart, 
  Apple, 
  Carrot, 
  Search, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Info,
  DollarSign,
  TrendingUp,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import Button3D from '../components/Button3D';
import { getRegionalMarketPrices } from '../services/geminiService';

const Market: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [searching, setSearching] = useState(false);
  const [regionalData, setRegionalData] = useState<{ localidade: string, precos: any[] } | null>(null);
  
  const availableMonths = Object.keys(SEASONAL_DATA);
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const currentMonth = availableMonths[monthIndex];
  const seasonal = SEASONAL_DATA[currentMonth];

  const handleSearch = async () => {
    if(!cep || cep.length < 8) return;
    setSearching(true);
    const data = await getRegionalMarketPrices(cep);
    if(data) {
      setRegionalData(data);
    }
    setSearching(false);
  };

  const nextMonth = () => setMonthIndex((prev) => (prev + 1) % availableMonths.length);
  const prevMonth = () => setMonthIndex((prev) => (prev - 1 + availableMonths.length) % availableMonths.length);

  const defaultPrices = [
    { item: 'ARROZ (5KG)', preco: '34.00', tendencia: 'ESTÁVEL' },
    { item: 'FEIJÃO (1KG)', preco: '9.50', tendencia: 'BAIXA' },
    { item: 'FRANGO (KG)', preco: '22.00', tendencia: 'ALTA' },
    { item: 'LEITE (1L)', preco: '7.80', tendencia: 'BAIXA' }
  ];

  const displayPrices = regionalData ? regionalData.precos : defaultPrices;

  return (
    <Layout userName={userName} title="Inteligência de Compra" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-10 py-4 px-2">
        
        {/* BUSCA DE LOCALIZAÇÃO */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-4 border-[#f0f0f0] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 md:w-80 h-40 md:h-80 bg-emerald-50 rounded-full -mr-20 md:-mr-40 -mt-20 md:-mt-40 blur-3xl opacity-40"></div>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-600 text-white rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 shadow-2xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform">
              <MapPin size={32} md:size={44} strokeWidth={3} />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2 md:space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">Ofertas de Proximidade</h2>
              <p className="text-sm md:text-xl text-[#5d4037] font-black uppercase tracking-tight opacity-70">Digite seu CEP para ver o preço real no seu bairro.</p>
            </div>
            <div className="flex w-full md:w-auto gap-4">
              <input 
                type="text" 
                placeholder="00000-000" 
                maxLength={9}
                value={cep} 
                onChange={e => setCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2'))}
                className="flex-1 md:w-56 bg-[#fdfaf6] px-4 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-3xl border-4 border-slate-100 outline-none font-black text-center text-xl md:text-3xl text-black focus:bg-white focus:border-emerald-500 transition-all shadow-inner uppercase placeholder:opacity-20" 
              />
              <Button3D color="success" size="lg" className="px-6 md:px-10 h-16 md:h-24" onClick={handleSearch} disabled={searching}>
                {searching ? <Loader2 className="animate-spin" size={24} md:size={36} /> : <Search size={24} md:size={36} strokeWidth={3} />}
              </Button3D>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* SEÇÃO DE ALERTA: SAFRA E MÉDIAS REGIONAIS */}
          <div className="lg:col-span-2 bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[4.5rem] border-4 border-[#f0f0f0] shadow-2xl space-y-10 md:space-y-14 relative overflow-hidden">
             
             {/* Feedback de Localidade Ativa */}
             {regionalData && (
                <div className="absolute top-4 md:top-8 right-4 md:right-8 animate-bounce z-20">
                   <div className="bg-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 shadow-xl border-4 border-white">
                      <ShieldCheck size={20} md:size={24} strokeWidth={3} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Região Validada</span>
                   </div>
                </div>
             )}

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 border-b-4 border-slate-50 pb-8 md:pb-12 relative z-10">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-[#e85d97] text-white rounded-[1.25rem] md:rounded-[2rem] flex items-center justify-center shadow-xl border-4 border-white shrink-0">
                    <CalendarDays size={32} md:size={48} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <span className="w-2 md:w-3 h-2 md:h-3 bg-[#e85d97] rounded-full animate-pulse"></span>
                      <label className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-[#e85d97]">Safra Local Ativa</label>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-black tracking-tighter leading-none uppercase">Safra de {currentMonth}</h3>
                  </div>
                </div>
                
                <div className="flex items-center bg-[#fdfaf6] p-2 md:p-4 rounded-2xl md:rounded-3xl border-4 border-white shadow-xl self-center shrink-0">
                  <button onClick={prevMonth} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-[#e85d97] hover:bg-white rounded-xl md:rounded-2xl transition-all"><ChevronLeft size={24} md:size={40} strokeWidth={4} /></button>
                  <span className="px-4 md:px-10 font-black text-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm min-w-[120px] md:min-w-[160px] text-center">{currentMonth}</span>
                  <button onClick={nextMonth} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-[#e85d97] hover:bg-white rounded-xl md:rounded-2xl transition-all"><ChevronRight size={24} md:size={40} strokeWidth={4} /></button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
               <section className="space-y-6 md:space-y-8">
                 <div className="flex items-center gap-4 md:gap-6 mb-2 md:mb-4">
                   <div className="w-10 h-10 md:w-14 md:h-14 bg-[#fdfaf6] text-[#a34e36] rounded-xl md:rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                    <Apple size={24} md:size={32} strokeWidth={3} />
                   </div>
                   <h4 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Frutas da Época</h4>
                 </div>
                 <div className="flex flex-wrap gap-2 md:gap-4">
                   {seasonal.fruits.map(f => (
                     <span key={f} className="bg-[#fdfaf6] text-black px-4 md:px-8 py-3 md:py-6 rounded-xl md:rounded-[2rem] font-black border-4 border-white hover:border-[#e85d97] hover:bg-white transition-all cursor-default shadow-md text-lg md:text-2xl tracking-tighter uppercase">
                        {f}
                     </span>
                   ))}
                 </div>
               </section>
               
               <section className="space-y-6 md:space-y-8">
                 <div className="flex items-center gap-4 md:gap-6 mb-2 md:mb-4">
                   <div className="w-10 h-10 md:w-14 md:h-14 bg-[#fdfaf6] text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                    <Carrot size={24} md:size={32} strokeWidth={3} />
                   </div>
                   <h4 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Hortaliças de Hoje</h4>
                 </div>
                 <div className="flex flex-wrap gap-2 md:gap-4">
                   {seasonal.veggies.map(v => (
                     <span key={v} className="bg-[#fdfaf6] text-black px-4 md:px-8 py-3 md:py-6 rounded-xl md:rounded-[2rem] font-black border-4 border-white hover:border-emerald-500 hover:bg-white transition-all cursor-default shadow-md text-lg md:text-2xl tracking-tighter uppercase">
                        {v}
                     </span>
                   ))}
                 </div>
               </section>
             </div>

             <div className="pt-8 md:pt-14 border-t-8 border-[#fdfaf6] space-y-8 md:space-y-10 relative z-10">
               <div className="flex items-center gap-4 md:gap-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600 text-white rounded-[1.25rem] md:rounded-[1.75rem] flex items-center justify-center shadow-2xl border-4 border-white shrink-0">
                    <TrendingUp size={32} md:size={40} strokeWidth={3} />
                 </div>
                 <div className="overflow-hidden">
                    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-emerald-600">Economia Local</label>
                    <h4 className="text-xl md:text-4xl font-black text-black tracking-tighter leading-none mt-1 md:mt-2 uppercase break-words">
                      {regionalData ? `MÉDIAS REGIONAIS: ${regionalData.localidade}` : 'MÉDIAS DE MERCADO BRASIL (2026)'}
                    </h4>
                 </div>
               </div>
               
               {searching ? (
                 <div className="py-10 md:py-20 flex flex-col items-center justify-center gap-4 md:gap-6 bg-[#fdfaf6] rounded-[2rem] md:rounded-[3rem] border-4 border-white border-dashed text-center">
                    <Loader2 size={48} md:size={64} className="text-emerald-500 animate-spin" strokeWidth={3} />
                    <p className="text-lg md:text-2xl font-black text-[#5d4037] uppercase tracking-tighter">Consultando preços na sua vizinhança...</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {displayPrices.map((p, i) => (
                      <div key={i} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-4 border-[#fdfaf6] flex flex-col items-center justify-center text-center shadow-xl hover:border-emerald-400 transition-all group overflow-hidden">
                        <p className="text-[8px] md:text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4 group-hover:text-emerald-600 break-words">{p.item || (p as any).label}</p>
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                          <span className={`text-[7px] md:text-[10px] font-black px-2 md:py-1.5 rounded-lg md:rounded-xl uppercase border-2 ${p.tendencia === 'ALTA' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {p.tendencia}
                          </span>
                          <p className="text-2xl md:text-5xl font-black text-black tracking-tighter break-all">R$ {p.preco}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-8 md:space-y-10">
            <div className="bg-[#5d4037] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border-b-8 border-black/20">
               <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
               <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 border-4 border-white/10 shadow-inner">
                 <ShoppingCart size={32} md:size={48} className="text-orange-200" strokeWidth={3} />
               </div>
               <p className="text-2xl md:text-4xl font-black leading-tight tracking-tighter italic mb-8 md:mb-12 uppercase">
                 "A xepa da feira é o tesouro da economia. Preços caem 50% após as 11h."
               </p>
               <div className="pt-6 md:pt-10 border-t-4 border-white/10 flex items-center justify-between">
                 <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-orange-200/50">Conselho de Vó</span>
                 <Info size={24} md:size={32} className="text-orange-200/30" />
               </div>
            </div>

            <button 
              onClick={() => window.open('https://www.youtube.com/results?search_query=dicas+para+economizar+no+mercado+e+feira', '_blank')}
              className="w-full p-8 md:p-12 bg-white border-4 border-[#f0f0f0] rounded-[2.5rem] md:rounded-[4rem] shadow-2xl flex items-center justify-between group hover:border-[#e85d97] transition-all duration-500"
            >
              <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-rose-50 text-rose-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all border-4 border-rose-100 shadow-xl shrink-0">
                  <Youtube size={36} md:size={56} strokeWidth={2.5} />
                </div>
                <div className="text-left overflow-hidden">
                  <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">Aula em Vídeo</label>
                  <span className="text-xl md:text-3xl font-black text-black tracking-tighter block leading-none mt-1 md:mt-2 uppercase break-words">Masterclass Xepa</span>
                </div>
              </div>
              <ChevronRight size={32} md:size={48} className="text-slate-200 group-hover:text-[#e85d97] group-hover:translate-x-3 transition-all shrink-0" strokeWidth={5} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Market;
