
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  Zap, 
  Droplets, 
  Flame, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  Bell, 
  BellRing,
  Activity,
  DollarSign,
  Scale,
  Edit2,
  Check,
  CalendarDays
} from 'lucide-react';
import { Appliance, WaterConfig, GasConfig } from '../types';
import Button3D from '../components/Button3D';

const Utilities: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'luz' | 'agua' | 'gas'>('agua');
  
  const daysInCurrentMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    const saved = localStorage.getItem('lar_appliances_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [energyRate, setEnergyRate] = useState<number>(() => {
    return Number(localStorage.getItem('lar_energy_rate_v3')) || 0.92;
  });
  const [newApp, setNewApp] = useState({ name: '', watts: '', hours: '8', days: [0, 1, 2, 3, 4, 5, 6] });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [water, setWater] = useState<WaterConfig>(() => {
    const saved = localStorage.getItem('lar_water_v3');
    return saved ? JSON.parse(saved) : { consumptionM3: 0, pricePerM3: 6.50 };
  });

  const [gas, setGas] = useState<GasConfig>(() => {
    const saved = localStorage.getItem('lar_gas_v3');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    return saved ? JSON.parse(saved) : { 
      purchaseDate: todayStr, 
      capacityKg: 13, 
      dailyConsumptionKg: 0.25, 
      level: 100, 
      alertEnabled: true 
    };
  });

  useEffect(() => {
    localStorage.setItem('lar_appliances_v3', JSON.stringify(appliances));
    localStorage.setItem('lar_energy_rate_v3', energyRate.toString());
    localStorage.setItem('lar_water_v3', JSON.stringify(water));
    localStorage.setItem('lar_gas_v3', JSON.stringify(gas));
  }, [appliances, energyRate, water, gas]);

  const saveAppliance = () => {
    if (!newApp.name || !newApp.watts) return;
    const appliance: Appliance = {
      id: editingId || Date.now().toString(),
      name: newApp.name,
      watts: Number(newApp.watts),
      hoursPerDay: Number(newApp.hours),
      daysPerWeek: newApp.days
    };
    if (editingId) {
      setAppliances(appliances.map(a => a.id === editingId ? appliance : a));
      setEditingId(null);
    } else {
      setAppliances([...appliances, appliance]);
    }
    setNewApp({ name: '', watts: '', hours: '8', days: [0, 1, 2, 3, 4, 5, 6] });
  };

  const calculateApplianceStats = (app: Appliance) => {
    const monthlyKwh = (app.watts * app.hoursPerDay * daysInCurrentMonth) / 1000;
    const monthlyCost = monthlyKwh * energyRate;
    return { monthlyKwh, monthlyCost };
  };

  const totalEnergy = useMemo(() => {
    return appliances.reduce((acc, app) => {
      const stats = calculateApplianceStats(app);
      return { 
        kwh: acc.kwh + stats.monthlyKwh, 
        cost: acc.cost + stats.monthlyCost 
      };
    }, { kwh: 0, cost: 0 });
  }, [appliances, energyRate, daysInCurrentMonth]);

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
  }, [gas.purchaseDate, gas.capacityKg, gas.dailyConsumptionKg]);

  const waterBill = useMemo(() => {
    return (water.consumptionM3 || 0) * (water.pricePerM3 || 0);
  }, [water.consumptionM3, water.pricePerM3]);

  return (
    <Layout userName={userName} title="Monitoramento de Contas" onBack={() => navigate('/home')}>
      <div className="max-w-xl mx-auto space-y-8 pb-32 px-4">
        
        {/* TABS PADRÃO IDEAL */}
        <div className="flex bg-white p-1.5 rounded-full shadow-lg border-2 border-white sticky top-24 z-40 backdrop-blur-md">
          {[
            { id: 'luz', icon: Zap, label: 'Luz', color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'agua', icon: Droplets, label: 'Água', color: 'text-blue-500', bg: 'bg-blue-50' },
            { id: 'gas', icon: Flame, label: 'Gás', color: 'text-rose-500', bg: 'bg-rose-50' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-4 rounded-full transition-all gap-1 ${activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-sm` : 'text-slate-300'}`}
            >
              <tab.icon size={24} strokeWidth={3} />
              <span className="text-[8px] tracking-[0.3em] font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'luz' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-950 p-8 rounded-[2rem] text-white flex flex-col gap-4 shadow-xl border-b-8 border-black/40">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Estimativa Mensal</label>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-amber-500">R$</span>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-none truncate">
                  {totalEnergy.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Activity size={24} className="text-amber-500" />
                <span className="font-black text-xl tracking-tighter">
                  {totalEnergy.kwh.toFixed(1)} <small className="text-xs text-slate-500 uppercase">kWh</small>
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-100">
                  <DollarSign size={20} strokeWidth={3} />
                </div>
                <label className="text-[10px] font-black uppercase tracking-widest text-black">Tarifa kWh</label>
              </div>
              <input 
                type="number" step="0.01" value={energyRate} 
                onChange={e => setEnergyRate(Number(e.target.value))}
                className="w-24 bg-slate-50 px-4 py-2 rounded-xl outline-none font-black text-xl text-center text-black shadow-inner"
              />
            </div>
          </div>
        )}

        {activeTab === 'agua' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl flex flex-col items-center gap-8">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg border-4 border-white rotate-3">
                <Droplets size={40} strokeWidth={3} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Consumo Mensal (m³)</label>
                  <input type="number" value={water.consumptionM3 || ''} onChange={e => setWater({...water, consumptionM3: Number(e.target.value)})} className="w-full bg-slate-50 py-4 rounded-2xl border-2 border-white text-3xl text-center font-black text-black shadow-inner" />
                </div>
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Tarifa por m³</label>
                  <input type="number" step="0.01" value={water.pricePerM3 || ''} onChange={e => setWater({...water, pricePerM3: Number(e.target.value)})} className="w-full bg-slate-50 py-4 rounded-2xl border-2 border-white text-3xl text-center font-black text-black shadow-inner" />
                </div>
              </div>

              <div className="w-full bg-blue-600 p-8 rounded-[2rem] text-center border-b-8 border-black/20 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-4">Previsão de Fatura</p>
                <div className="flex items-center justify-center flex-wrap">
                  <span className="text-xl font-black text-white mr-2">R$</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight whitespace-nowrap">
                    {waterBill.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gas' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {gasStats?.isAlert && (
              <div className="bg-rose-600 text-white p-6 rounded-3xl shadow-lg animate-pulse border-4 border-white flex items-center gap-4">
                 <BellRing size={32} strokeWidth={3} />
                 <div>
                    <h4 className="text-lg font-black tracking-tighter uppercase leading-none">Abasteça Já!</h4>
                    <p className="text-xs font-bold opacity-90 uppercase">Restam {gasStats.daysLeft} dias.</p>
                 </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md border-2 border-white rotate-3 shrink-0">
                  <Flame size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-black tracking-tighter leading-none uppercase">Monitor de Gás</h3>
                  <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">Estimativa: 250g / dia</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-white shadow-inner space-y-3">
                 <div className="flex items-center gap-2 text-black">
                    <CalendarDays size={18} className="text-rose-500" />
                    <label className="text-[9px] font-black uppercase tracking-widest">Última Recarga:</label>
                 </div>
                 <input 
                  type="date" 
                  value={gas.purchaseDate} 
                  onChange={e => setGas({...gas, purchaseDate: e.target.value})}
                  className="w-full bg-white px-6 py-4 rounded-xl border-2 border-slate-100 font-black text-lg text-black outline-none shadow-sm text-center uppercase"
                 />
              </div>

              {/* LEVEL MONITOR - FIXED VERSION */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-white shadow-inner flex flex-col items-center relative overflow-hidden">
                <div className="flex items-center justify-between w-full mb-2">
                   <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Vazio</span>
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Cheio</span>
                </div>
                
                <div className="flex flex-col items-center py-4">
                  <div className="flex items-baseline">
                    <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-black">
                      {gasStats?.level ?? 0}
                    </span>
                    <small className="text-xl font-black text-black ml-1">%</small>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">Nível Atual</span>
                </div>

                <div className="relative h-6 w-full bg-slate-200 rounded-full p-0.5 border-2 border-white shadow-inner overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${gasStats?.level && gasStats.level < 20 ? 'bg-rose-500' : gasStats?.level && gasStats.level < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${gasStats?.level ?? 0}%` }}></div>
                </div>
              </div>

              {gasStats && (
                <div className={`p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-3 ${gasStats.isAlert || gasStats.isExpired ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-white shadow-md'}`}>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Previsão de Término</p>
                   <div className="flex flex-col items-center">
                     <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none text-black">
                       {gasStats.isExpired ? 'ESGOTADO' : gasStats.nextDate}
                     </h3>
                     <div className="bg-white px-6 py-1.5 rounded-full border border-slate-100 shadow-sm mt-3">
                       <span className="text-[9px] font-black text-black uppercase tracking-widest">
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
