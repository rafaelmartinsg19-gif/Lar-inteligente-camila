
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Trash2, 
  Calendar, 
  BellRing,
  Activity,
  DollarSign,
  CalendarDays,
  Timer,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { Appliance, WaterConfig, GasConfig } from '../types';
import Button3D from '../components/Button3D';

const Utilities: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'luz' | 'agua' | 'gas'>('luz');
  
  // Usamos 30 dias como padrão comercial para simulações mais previsíveis
  const standardDaysInMonth = 30;

  // --- ESTADOS DA LUZ ---
  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem('lar_appliances_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [energyRate, setEnergyRate] = useState<number>(() => {
    return Number(localStorage.getItem('lar_energy_rate_v3')) || 0.92;
  });
  
  const [simName, setSimName] = useState('Cafeteira');
  const [simWatts, setSimWatts] = useState<number>(600);
  const [simHours, setSimHours] = useState<number>(1);

  // Cálculos do Simulador Individual
  const simResult = useMemo(() => {
    const kwhDay = (simWatts * simHours) / 1000;
    const costDay = kwhDay * energyRate;
    const kwhMonth = kwhDay * standardDaysInMonth;
    const costMonth = kwhMonth * energyRate;
    return { costDay, costMonth, kwhDay, kwhMonth };
  }, [simWatts, simHours, energyRate]);

  // Cálculos do Total Acumulado
  const totalEnergy = useMemo(() => {
    return appliances.reduce((acc, app) => {
      const kwhDay = (app.watts * app.hoursPerDay) / 1000;
      const monthlyKwh = kwhDay * standardDaysInMonth;
      const monthlyCost = monthlyKwh * energyRate;
      return { 
        kwh: acc.kwh + monthlyKwh, 
        cost: acc.cost + monthlyCost 
      };
    }, { kwh: 0, cost: 0 });
  }, [appliances, energyRate]);

  // --- ESTADOS DA ÁGUA ---
  const [water, setWater] = useState<WaterConfig>(() => {
    const saved = localStorage.getItem('lar_water_v3');
    return saved ? JSON.parse(saved) : { consumptionM3: 0, pricePerM3: 6.50 };
  });
  const waterBill = useMemo(() => (water.consumptionM3 || 0) * (water.pricePerM3 || 0), [water]);

  // --- ESTADOS DO GÁS ---
  const [gas, setGas] = useState<GasConfig>(() => {
    const saved = localStorage.getItem('lar_gas_v3');
    const now = new Date();
    return saved ? JSON.parse(saved) : { 
      purchaseDate: now.toISOString().split('T')[0], 
      capacityKg: 13, 
      dailyConsumptionKg: 0.25, 
      level: 100, 
      alertEnabled: true 
    };
  });

  const gasStats = useMemo(() => {
    if (!gas.purchaseDate) return null;
    const parts = gas.purchaseDate.split('-');
    const purchaseDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    purchaseDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - purchaseDate.getTime();
    const daysUsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalAutonomyDays = Math.floor(gas.capacityKg / gas.dailyConsumptionKg);
    const daysLeft = Math.max(0, totalAutonomyDays - daysUsed);
    const currentLevel = Math.max(0, Math.min(100, Math.round((daysLeft / totalAutonomyDays) * 100)));
    const endOfGasDate = new Date(purchaseDate);
    endOfGasDate.setDate(purchaseDate.getDate() + totalAutonomyDays);
    return {
      nextDate: endOfGasDate.toLocaleDateString('pt-BR'),
      daysLeft: daysLeft,
      level: currentLevel,
      isAlert: daysLeft <= 3 && daysLeft > 0,
      isExpired: daysLeft <= 0
    };
  }, [gas]);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    localStorage.setItem('lar_appliances_v3', JSON.stringify(appliances));
    localStorage.setItem('lar_energy_rate_v3', energyRate.toString());
    localStorage.setItem('lar_water_v3', JSON.stringify(water));
    localStorage.setItem('lar_gas_v3', JSON.stringify(gas));
  }, [appliances, energyRate, water, gas]);

  const addSimToHistory = () => {
    const newApp: Appliance = {
      id: Date.now().toString(),
      name: simName || 'Aparelho',
      watts: simWatts,
      hoursPerDay: simHours,
      daysPerWeek: [0, 1, 2, 3, 4, 5, 6]
    };
    setAppliances([newApp, ...appliances]);
  };

  return (
    <Layout userName={userName} title="Monitoramento de Contas" onBack={() => navigate('/home')}>
      <div className="max-w-5xl mx-auto space-y-10 pb-32">
        
        {/* TABS PRINCIPAIS */}
        <div className="flex bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-2xl border-2 border-white sticky top-24 z-40">
          {[
            { id: 'luz', icon: Zap, label: 'Energia Elétrica', color: 'text-amber-500', bg: 'bg-white shadow-lg' },
            { id: 'agua', icon: Droplets, label: 'Recursos Hídricos', color: 'text-blue-500', bg: 'bg-white shadow-lg' },
            { id: 'gas', icon: Flame, label: 'Gás de Cozinha', color: 'text-rose-500', bg: 'bg-white shadow-lg' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-5 rounded-full transition-all gap-1.5 ${activeTab === tab.id ? `${tab.bg} ${tab.color}` : 'text-slate-400'}`}
            >
              <tab.icon size={28} strokeWidth={3} />
              <span className="text-[9px] tracking-[0.4em] font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUNA ESQUERDA: CONFIGS E SIMULADORES */}
          <div className="lg:col-span-7 space-y-10">
            {activeTab === 'luz' && (
              <div className="bg-white p-10 rounded-[3rem] border-4 border-white shadow-2xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Calculator size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">Simular Aparelho</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Qual o Aparelho?</label>
                    <input type="text" value={simName} onChange={e => setSimName(e.target.value)} className="w-full bg-[#f8f7f5] p-6 rounded-3xl border-4 border-white shadow-inner font-black text-2xl text-black outline-none focus:border-amber-500 transition-all uppercase" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Potência (Watts)</label>
                      <input type="number" value={simWatts || ''} onChange={e => setSimWatts(Number(e.target.value))} className="w-full bg-[#f8f7f5] p-6 rounded-3xl border-4 border-white shadow-inner font-black text-3xl text-center text-black outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Uso Diário (Horas)</label>
                      <input type="number" step="0.5" value={simHours || ''} onChange={e => setSimHours(Number(e.target.value))} className="w-full bg-[#f8f7f5] p-6 rounded-3xl border-4 border-white shadow-inner font-black text-3xl text-center text-black outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-[#f8f7f5] p-6 rounded-3xl border-4 border-white text-center shadow-lg">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gasto no Dia</p>
                      <p className="text-3xl font-black text-black tracking-tighter">
                        R$ {simResult.costDay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                      </p>
                   </div>
                   <div className="bg-[#fffdf0] p-6 rounded-3xl border-4 border-[#fdf0a4]/50 text-center shadow-lg">
                      <p className="text-[10px] font-black text-[#a34e36] uppercase tracking-widest mb-2">Gasto no Mês</p>
                      <p className="text-3xl font-black text-[#a34e36] tracking-tighter">
                        R$ {simResult.costMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                   </div>
                </div>

                <Button3D fullWidth onClick={addSimToHistory} color="dark" size="xl">
                  Salvar no Resumo Mensal
                </Button3D>
              </div>
            )}

            {activeTab === 'agua' && (
              <div className="bg-white p-10 rounded-[3rem] border-4 border-white shadow-2xl flex flex-col items-center gap-10 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white rotate-6"><Droplets size={48} strokeWidth={3} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="space-y-3 text-center">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block">Consumo (m³)</label>
                    <input type="number" value={water.consumptionM3 || ''} onChange={e => setWater({...water, consumptionM3: Number(e.target.value)})} className="w-full bg-[#f8f7f5] py-8 rounded-[2rem] border-4 border-white text-5xl text-center font-black text-black shadow-inner outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3 text-center">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 block">Tarifa p/ m³</label>
                    <input type="number" step="0.01" value={water.pricePerM3 || ''} onChange={e => setWater({...water, pricePerM3: Number(e.target.value)})} className="w-full bg-[#f8f7f5] py-8 rounded-[2rem] border-4 border-white text-5xl text-center font-black text-black shadow-inner outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gas' && (
              <div className="bg-white p-10 rounded-[3.5rem] border-4 border-white shadow-2xl space-y-10 animate-in fade-in duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-white rotate-3 shrink-0"><Flame size={44} strokeWidth={3} /></div>
                  <div>
                    <h3 className="text-4xl font-black text-black tracking-tighter leading-none uppercase">Monitor de Gás</h3>
                    <p className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] mt-3">Refil de 13KG • Méd. 250g/dia</p>
                  </div>
                </div>

                <div className="bg-[#f8f7f5] p-8 rounded-[2.5rem] border-4 border-white shadow-inner space-y-4 text-center">
                   <div className="flex items-center justify-center gap-4 text-black"><CalendarDays size={28} className="text-rose-500" /><label className="text-[12px] font-black uppercase tracking-[0.4em]">Data da Última Recarga:</label></div>
                   <input type="date" value={gas.purchaseDate} onChange={e => setGas({...gas, purchaseDate: e.target.value})} className="w-full bg-white px-8 py-6 rounded-3xl border-4 border-slate-50 font-black text-4xl text-black outline-none shadow-sm text-center uppercase tracking-tighter" />
                </div>

                <div className="bg-[#f8f7f5] p-10 rounded-[3rem] border-4 border-white shadow-inner flex flex-col items-center relative overflow-hidden">
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em]">CUIDADO: VAZIO</span>
                    <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">STATUS: CHEIO</span>
                  </div>
                  
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 flex flex-col items-center min-w-[200px] relative z-10">
                    <div className="flex items-baseline"><span className="text-8xl font-black tracking-tighter leading-none text-black">{gasStats?.level ?? 0}</span><small className="text-3xl font-black text-black ml-2">%</small></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mt-6">Nível Atual do Botijão</span>
                  </div>

                  <div className="relative h-12 w-full bg-white/50 rounded-full mt-12 p-1.5 border-4 border-white shadow-inner overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${gasStats?.level && gasStats.level < 20 ? 'bg-rose-500' : gasStats?.level && gasStats.level < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${gasStats?.level ?? 0}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: RESUMOS E ALERTAS */}
          <div className="lg:col-span-5 space-y-10">
            {/* CARD DE ESTIMATIVA MENSAL GIGANTE - AGORA BRANCO CONFORME SOLICITADO */}
            <div className={`p-12 rounded-[4rem] flex flex-col items-center gap-8 shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative overflow-hidden border-b-[12px] bg-white border-slate-100`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent pointer-events-none opacity-50"></div>
              <label className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400 z-10">Fatura Estimada do Mês</label>
              
              <div className="flex items-center justify-center gap-4 z-10">
                <span className={`text-3xl font-black ${activeTab === 'luz' ? 'text-amber-500' : activeTab === 'agua' ? 'text-blue-500' : 'text-rose-500'}`}>R$</span>
                <h3 className="text-7xl md:text-8xl font-black tracking-tighter leading-none text-black break-all">
                  {(activeTab === 'luz' ? totalEnergy.cost : activeTab === 'agua' ? waterBill : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>

              {activeTab === 'luz' && (
                <div className="bg-slate-50 px-10 py-4 rounded-full border-2 border-white flex items-center gap-4 shadow-inner z-10">
                  <Activity size={32} className="text-amber-500" strokeWidth={4} />
                  <span className="font-black text-3xl tracking-tighter text-black">
                    {totalEnergy.kwh.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} 
                    <small className="text-[12px] opacity-60 uppercase ml-2 text-slate-400">kWh Totais</small>
                  </span>
                </div>
              )}

              {activeTab === 'gas' && gasStats && (
                <div className="bg-slate-50 p-10 rounded-[3rem] w-full flex flex-col items-center gap-4 z-10 border-2 border-white shadow-inner">
                   <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Previsão de Término</p>
                   <h4 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-black whitespace-nowrap">
                    {gasStats.isExpired ? 'ESGOTADO' : gasStats.nextDate}
                   </h4>
                   <div className="bg-rose-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl mt-4">
                      {gasStats.isExpired ? 'COMPRAR IMEDIATO' : `Faltam ${gasStats.daysLeft} Dias`}
                   </div>
                </div>
              )}
            </div>

            {/* LISTA DE APARELHOS OU OUTROS INFOS */}
            {activeTab === 'luz' && (
              <div className="bg-white p-8 rounded-[3rem] border-4 border-white shadow-xl space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Rateio por kWh</h4>
                  <div className="flex items-center gap-3 bg-[#f8f7f5] px-4 py-2 rounded-xl border-2 border-white">
                    <DollarSign size={18} className="text-amber-500" />
                    <input type="number" step="0.01" value={energyRate} onChange={e => setEnergyRate(Number(e.target.value))} className="bg-transparent w-16 font-black text-lg text-center outline-none" />
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {appliances.map(app => (
                    <div key={app.id} className="bg-[#f8f7f5] p-6 rounded-3xl border-2 border-white flex items-center justify-between group hover:border-amber-500 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-white text-slate-300 rounded-2xl flex items-center justify-center group-hover:text-amber-500 transition-colors shadow-sm"><Timer size={24} /></div>
                         <div>
                            <p className="text-xl font-black text-black uppercase tracking-tighter leading-none">{app.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{app.watts}W • {app.hoursPerDay}h/dia</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-2xl font-black text-black tracking-tighter">
                          R$ {(((app.watts * app.hoursPerDay * standardDaysInMonth) / 1000) * energyRate).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </p>
                         <button onClick={() => setAppliances(prev => prev.filter(a => a.id !== app.id))} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={24} /></button>
                      </div>
                    </div>
                  ))}
                  {appliances.length === 0 && (
                    <div className="py-12 text-center border-4 border-dashed border-slate-100 rounded-[2.5rem]">
                       <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nenhum aparelho monitorado</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Utilities;
