
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
  
  const daysInCurrentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

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

  const simResult = useMemo(() => {
    const kwhDay = (simWatts * simHours) / 1000;
    const costDay = kwhDay * energyRate;
    const kwhMonth = kwhDay * daysInCurrentMonth;
    const costMonth = kwhMonth * energyRate;
    return { costDay, costMonth, kwhDay, kwhMonth };
  }, [simWatts, simHours, energyRate, daysInCurrentMonth]);

  const totalEnergy = useMemo(() => {
    return appliances.reduce((acc, app) => {
      const kwhDay = (app.watts * app.hoursPerDay) / 1000;
      const monthlyKwh = kwhDay * daysInCurrentMonth;
      const monthlyCost = monthlyKwh * energyRate;
      return { 
        kwh: acc.kwh + monthlyKwh, 
        cost: acc.cost + monthlyCost 
      };
    }, { kwh: 0, cost: 0 });
  }, [appliances, energyRate, daysInCurrentMonth]);

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
      <div className="max-w-xl mx-auto space-y-8 pb-32 px-4">
        
        {/* TABS PRINCIPAIS */}
        <div className="flex bg-[#e8e6e1]/30 backdrop-blur-sm p-1.5 rounded-full shadow-inner border border-white sticky top-24 z-40">
          {[
            { id: 'luz', icon: Zap, label: 'Luz', color: 'text-amber-500', bg: 'bg-white shadow-lg' },
            { id: 'agua', icon: Droplets, label: 'Água', color: 'text-blue-500', bg: 'bg-white shadow-lg' },
            { id: 'gas', icon: Flame, label: 'Gás', color: 'text-rose-500', bg: 'bg-white shadow-lg' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-4 rounded-full transition-all gap-1 ${activeTab === tab.id ? `${tab.bg} ${tab.color}` : 'text-slate-400'}`}
            >
              <tab.icon size={24} strokeWidth={3} />
              <span className="text-[8px] tracking-[0.3em] font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ABA LUZ */}
        {activeTab === 'luz' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-slate-50 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black text-black tracking-tighter uppercase">Simular Aparelho</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome do Aparelho</label>
                  <input type="text" value={simName} onChange={e => setSimName(e.target.value)} placeholder="Ex: Cafeteira" className="w-full bg-[#f8f7f5] p-4 rounded-2xl border-2 border-white shadow-inner font-black text-black outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Potência (Watts)</label>
                    <input type="number" value={simWatts || ''} onChange={e => setSimWatts(Number(e.target.value))} className="w-full bg-[#f8f7f5] p-4 rounded-2xl border-2 border-white shadow-inner font-black text-xl text-center text-black outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Horas de Uso/Dia</label>
                    <input type="number" step="0.5" value={simHours || ''} onChange={e => setSimHours(Number(e.target.value))} className="w-full bg-[#f8f7f5] p-4 rounded-2xl border-2 border-white shadow-inner font-black text-xl text-center text-black outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="bg-[#f8f7f5] p-4 rounded-2xl border border-white text-center shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Gasto no Dia</p>
                    <p className="text-xl font-black text-black tracking-tighter">R$ {simResult.costDay.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}</p>
                 </div>
                 <div className="bg-[#fffdf0] p-4 rounded-2xl border border-[#fdf0a4]/30 text-center shadow-sm">
                    <p className="text-[8px] font-black text-[#a34e36] uppercase tracking-widest mb-1">Gasto no Mês</p>
                    <p className="text-xl font-black text-[#a34e36] tracking-tighter">R$ {simResult.costMonth.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}</p>
                 </div>
              </div>

              <Button3D fullWidth onClick={addSimToHistory} color="dark" size="md">
                Salvar no Resumo Mensal
              </Button3D>
            </div>

            {/* ESTIMATIVA MENSAL TOTAL - REFINADO PELO PRINT */}
            <div className="bg-[#050510] p-10 rounded-[2.5rem] text-white flex flex-col items-center gap-6 shadow-2xl border-b-8 border-black/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 z-10">Estimativa Mensal Total</label>
              
              <div className="flex items-center justify-center gap-3 z-10">
                <span className="text-2xl font-black text-amber-500">R$</span>
                <h3 className="text-7xl font-black tracking-tighter leading-none text-white">
                  {totalEnergy.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>

              <div className="bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 flex items-center gap-3 shadow-inner z-10">
                <Activity size={20} className="text-amber-500" strokeWidth={3} />
                <span className="font-black text-xl tracking-tighter text-white">
                  {totalEnergy.kwh.toFixed(1)} <small className="text-[10px] text-slate-500 uppercase ml-1">kWh</small>
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-slate-50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-amber-500" />
                <label className="text-[9px] font-black uppercase tracking-widest text-black">Tarifa (R$/kWh)</label>
              </div>
              <input type="number" step="0.01" value={energyRate} onChange={e => setEnergyRate(Number(e.target.value))} className="w-20 bg-[#f8f7f5] px-3 py-2 rounded-xl outline-none font-black text-lg text-center text-black shadow-inner" />
            </div>

            {appliances.length > 0 && (
              <div className="space-y-3">
                {appliances.map(app => {
                  const cost = ((app.watts * app.hoursPerDay * daysInCurrentMonth) / 1000) * energyRate;
                  return (
                    <div key={app.id} className="bg-white p-4 rounded-2xl border-2 border-white shadow-sm flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-[#f8f7f5] text-slate-400 rounded-xl flex items-center justify-center group-hover:text-amber-500 transition-colors"><Timer size={18} /></div>
                         <div>
                            <p className="text-base font-black text-black uppercase tracking-tight leading-none">{app.name}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{app.watts}W • {app.hoursPerDay}h/dia</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <p className="text-lg font-black text-black tracking-tighter">R$ {cost.toFixed(2)}</p>
                         <button onClick={() => setAppliances(prev => prev.filter(a => a.id !== app.id))} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA ÁGUA */}
        {activeTab === 'agua' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl flex flex-col items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg border-4 border-white rotate-3"><Droplets size={32} strokeWidth={3} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-1.5 text-center">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Consumo Mensal (m³)</label>
                  <input type="number" value={water.consumptionM3 || ''} onChange={e => setWater({...water, consumptionM3: Number(e.target.value)})} className="w-full bg-[#f8f7f5] py-4 rounded-2xl border-2 border-white text-3xl text-center font-black text-black shadow-inner" />
                </div>
                <div className="space-y-1.5 text-center">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tarifa por m³</label>
                  <input type="number" step="0.01" value={water.pricePerM3 || ''} onChange={e => setWater({...water, pricePerM3: Number(e.target.value)})} className="w-full bg-[#f8f7f5] py-4 rounded-2xl border-2 border-white text-3xl text-center font-black text-black shadow-inner" />
                </div>
              </div>
              <div className="w-full bg-blue-600 p-8 rounded-[2.5rem] text-center border-b-8 border-black/20 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-2">Previsão de Fatura</p>
                <div className="flex items-center justify-center">
                  <span className="text-xl font-black text-white mr-2">R$</span>
                  <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none whitespace-nowrap">
                    {waterBill.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA GÁS - REFINADO PELO PRINT */}
        {activeTab === 'gas' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             {/* HEADER MONITOR DE GÁS */}
            <div className="flex items-center gap-6 px-4">
              <div className="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-white rotate-3">
                <Flame size={32} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-3xl font-black text-black tracking-tighter leading-none uppercase">Monitor de Gás</h3>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mt-2">Estimativa: 250g / dia</p>
              </div>
            </div>

            {gasStats?.isAlert && (
              <div className="bg-rose-600 text-white p-5 rounded-3xl shadow-lg animate-pulse border-4 border-white flex items-center gap-4 mx-4">
                 <BellRing size={28} strokeWidth={3} />
                 <div>
                    <h4 className="text-lg font-black tracking-tighter uppercase leading-none">Abasteça Já!</h4>
                    <p className="text-[10px] font-bold opacity-90 uppercase">Restam {gasStats.daysLeft} dias.</p>
                 </div>
              </div>
            )}

            <div className="bg-[#f0f0f0] p-10 rounded-[3rem] shadow-sm space-y-8">
              {/* ÚLTIMA RECARGA */}
              <div className="space-y-4">
                 <label className="text-[11px] font-black uppercase tracking-[0.4em] text-black text-center block">Última Recarga:</label>
                 <div className="bg-white p-6 rounded-[2.5rem] shadow-sm flex items-center justify-center">
                    <input 
                      type="date" 
                      value={gas.purchaseDate} 
                      onChange={e => setGas({...gas, purchaseDate: e.target.value})} 
                      className="bg-transparent font-black text-3xl text-black outline-none text-center uppercase tracking-tighter" 
                    />
                 </div>
              </div>

              {/* NÍVEL PERCENTUAL - REFORMULADO */}
              <div className="bg-[#e4e4e4] p-10 rounded-[3.5rem] border-4 border-white/50 flex flex-col items-center relative overflow-hidden">
                <div className="flex items-center justify-between w-full px-6 absolute top-1/2 -translate-y-1/2">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Vazio</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cheio</span>
                </div>
                
                <div className="flex flex-col items-center py-6 bg-white px-10 rounded-[2.5rem] shadow-xl relative z-10 border-4 border-[#e4e4e4]">
                  <div className="flex items-baseline">
                    <span className="text-7xl font-black tracking-tighter leading-none text-black">{gasStats?.level ?? 0}</span>
                    <small className="text-3xl font-black text-black ml-1">%</small>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Nível Atual</span>
                </div>

                <div className="relative h-10 w-full bg-white/40 rounded-full mt-10 p-1.5 border-4 border-white shadow-inner overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${gasStats?.level && gasStats.level < 20 ? 'bg-rose-500' : gasStats?.level && gasStats.level < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${gasStats?.level ?? 0}%` }}
                  ></div>
                </div>
              </div>

              {/* PREVISÃO DE TÉRMINO */}
              {gasStats && (
                <div className="bg-[#f7f7f7] p-10 rounded-[3rem] flex flex-col items-center text-center gap-4 shadow-sm">
                   <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Previsão de Término</p>
                   <div className="flex flex-col items-center">
                     <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-black/20">
                       {gasStats.isExpired ? 'ESGOTADO' : gasStats.nextDate}
                     </h3>
                     <div className="bg-white px-8 py-2.5 rounded-full border border-slate-100 shadow-sm mt-6">
                       <span className="text-[11px] font-black text-black uppercase tracking-[0.2em]">
                         {gasStats.isExpired ? 'COMPRAR IMEDIATO' : `Faltam ${gasStats.daysLeft} Dias`}
                       </span>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Utilities;
