
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
  const [activeTab, setActiveTab] = useState<'luz' | 'agua' | 'gas'>('gas');
  
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

  return (
    <Layout userName={userName} title="Monitoramento de Contas" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-12 md:space-y-16 pb-48 px-4">
        
        {/* TABS GIGANTES */}
        <div className="flex bg-white p-2 rounded-[3.5rem] md:rounded-[5rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] border-8 border-white sticky top-24 md:top-28 z-40 backdrop-blur-xl">
          {[
            { id: 'luz', icon: Zap, label: 'Luz', color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'agua', icon: Droplets, label: 'Água', color: 'text-blue-500', bg: 'bg-blue-50' },
            { id: 'gas', icon: Flame, label: 'Gás', color: 'text-rose-500', bg: 'bg-rose-50' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-6 md:py-10 rounded-[2.5rem] md:rounded-[4rem] transition-all gap-2 md:gap-4 ${activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-2xl scale-[1.02]` : 'text-slate-300'}`}
            >
              <tab.icon size={40} className="md:w-16 md:h-16" strokeWidth={3} />
              <span className="text-[10px] md:text-sm tracking-[0.4em] font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'luz' && (
          <div className="space-y-10 md:space-y-14 animate-in fade-in slide-in-from-bottom-8 duration-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              <div className="bg-slate-950 p-12 md:p-20 rounded-[4rem] md:rounded-[6rem] text-white flex flex-col justify-center gap-8 shadow-3xl border-b-[20px] border-black/40 relative overflow-hidden">
                <label className="label-premium text-slate-500">Estimativa Mensal</label>
                <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
                  <span className="text-3xl md:text-5xl font-black text-amber-500">R$</span>
                  <h3 className="text-7xl md:text-9xl font-black tracking-tighter leading-none break-all">
                    {totalEnergy.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                  <Activity size={40} className="text-amber-500" strokeWidth={3} />
                  <span className="font-black text-3xl md:text-5xl tracking-tighter">
                    {totalEnergy.kwh.toFixed(1)} <small className="text-xl md:text-2xl text-slate-500">kWh</small>
                  </span>
                </div>
              </div>

              <div className="bg-white p-12 md:p-16 rounded-[4rem] md:rounded-[6rem] border-8 border-white shadow-2xl flex flex-col justify-center gap-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center border-4 border-amber-100">
                    <DollarSign size={32} strokeWidth={4} />
                  </div>
                  <label className="text-sm md:text-xl font-black uppercase tracking-[0.4em] text-black">Tarifa kWh</label>
                </div>
                <input 
                  type="number" step="0.01" value={energyRate} 
                  onChange={e => setEnergyRate(Number(e.target.value))}
                  className="w-full bg-slate-50 px-10 py-10 rounded-[3.5rem] border-8 border-white outline-none text-6xl md:text-8xl font-black text-center text-black shadow-inner"
                />
              </div>
            </div>

            <div className="bg-white p-12 md:p-20 rounded-[5rem] md:rounded-[7rem] border-8 border-white shadow-3xl space-y-16">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2.5rem] flex items-center justify-center border-8 border-white shadow-2xl">
                  {editingId ? <Edit2 size={48} strokeWidth={4} /> : <Plus size={48} strokeWidth={4} />}
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-none">{editingId ? 'Editar Aparelho' : 'Novo Aparelho'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                <div className="space-y-4">
                  <label className="label-premium">Nome do Aparelho</label>
                  <input type="text" placeholder="Ex: Geladeira" value={newApp.name} onChange={e => setNewApp({...newApp, name: e.target.value})} className="w-full bg-slate-50 px-12 py-8 rounded-[3rem] border-4 border-white outline-none font-black text-black text-2xl md:text-4xl shadow-inner uppercase" />
                </div>
                <div className="space-y-4">
                  <label className="label-premium">Potência (Watts)</label>
                  <input type="number" placeholder="Ex: 500" value={newApp.watts} onChange={e => setNewApp({...newApp, watts: e.target.value})} className="w-full bg-slate-50 px-12 py-8 rounded-[3rem] border-4 border-white outline-none font-black text-black text-2xl md:text-4xl shadow-inner" />
                </div>
                <div className="md:col-span-2 space-y-10 bg-slate-50 p-12 rounded-[4rem] border-8 border-white shadow-inner">
                  <div className="flex justify-between items-end px-4">
                    <label className="text-sm md:text-2xl font-black uppercase tracking-[0.4em] text-black">Uso Diário</label>
                    <span className="font-black text-6xl md:text-9xl text-black tracking-tighter leading-none">{newApp.hours}<small className="text-3xl">h</small></span>
                  </div>
                  <input type="range" min="1" max="24" value={newApp.hours} onChange={e => setNewApp({...newApp, hours: e.target.value})} className="w-full h-12 md:h-20 bg-slate-200 rounded-full accent-amber-500 cursor-pointer" />
                </div>
              </div>
              <Button3D onClick={saveAppliance} color="warning" fullWidth size="xl" className="h-28 md:h-40 text-2xl md:text-5xl border-8 border-white rounded-[4rem]">
                {editingId ? 'SALVAR' : 'ADICIONAR'}
              </Button3D>
            </div>
          </div>
        )}

        {activeTab === 'agua' && (
          <div className="space-y-12 animate-in fade-in duration-600">
            <div className="bg-white p-14 md:p-24 rounded-[5rem] md:rounded-[8rem] border-8 border-white shadow-3xl flex flex-col items-center gap-16 md:gap-24">
              <div className="w-32 h-32 md:w-56 md:h-56 bg-blue-600 text-white rounded-[3rem] md:rounded-[5rem] flex items-center justify-center shadow-3xl border-8 border-white rotate-6">
                <Droplets size={64} md:size={120} strokeWidth={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-20 w-full">
                <div className="space-y-6 text-center">
                  <label className="label-premium block">Consumo Mensal (m³)</label>
                  <input type="number" value={water.consumptionM3 || ''} onChange={e => setWater({...water, consumptionM3: Number(e.target.value)})} className="w-full bg-slate-50 py-12 rounded-[4rem] border-8 border-white text-6xl md:text-9xl text-center font-black text-black shadow-inner" />
                </div>
                <div className="space-y-6 text-center">
                  <label className="label-premium block">Tarifa por m³</label>
                  <input type="number" step="0.01" value={water.pricePerM3 || ''} onChange={e => setWater({...water, pricePerM3: Number(e.target.value)})} className="w-full bg-slate-50 py-12 rounded-[4rem] border-8 border-white text-6xl md:text-9xl text-center font-black text-black shadow-inner" />
                </div>
              </div>
              <div className="w-full bg-blue-600 p-16 md:p-28 rounded-[5rem] md:rounded-[7rem] text-center border-[20px] border-blue-100 shadow-3xl relative overflow-hidden">
                <p className="text-xs md:text-2xl font-black uppercase tracking-[0.8em] text-blue-100 mb-8">Previsão de Fatura</p>
                <h3 className="text-7xl md:text-[10rem] lg:text-[12rem] font-black text-white tracking-tighter leading-none break-all">
                  <small className="text-3xl md:text-6xl align-middle mr-4">R$</small>
                  {(water.consumptionM3 * water.pricePerM3).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gas' && (
          <div className="space-y-12 md:space-y-16 animate-in fade-in duration-600">
            {gasStats?.isAlert && (
              <div className="bg-rose-600 text-white p-12 md:p-20 rounded-[4rem] md:rounded-[6rem] shadow-3xl animate-pulse border-[15px] border-white flex items-center gap-10 md:gap-16">
                 <div className="w-24 h-24 md:w-48 md:h-48 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <BellRing size={64} md:size={120} strokeWidth={3} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Abasteça Já!</h4>
                    <p className="text-2xl md:text-5xl font-black opacity-90 leading-tight uppercase">Restam apenas **{gasStats.daysLeft} dias**.</p>
                 </div>
              </div>
            )}

            <div className="bg-white p-12 md:p-24 rounded-[4rem] md:rounded-[8rem] border-8 border-white shadow-3xl space-y-16 md:space-y-24">
              <div className="flex items-center gap-10 md:gap-16">
                <div className="w-24 h-24 md:w-48 md:h-48 bg-rose-500 text-white rounded-[2.5rem] md:rounded-[5rem] flex items-center justify-center shadow-3xl border-8 border-white rotate-3 shrink-0">
                  <Flame size={48} md:size={120} strokeWidth={3} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-8xl font-black text-black tracking-tighter leading-none uppercase">Monitor de Gás</h3>
                  <p className="label-premium text-rose-500">Estimativa: 250g / Dia</p>
                </div>
              </div>

              <div className="bg-slate-50 p-10 md:p-20 rounded-[4rem] md:rounded-[6rem] border-8 border-white shadow-inner space-y-8 md:space-y-12">
                 <div className="flex items-center gap-4 text-black px-4">
                    <CalendarDays size={32} md:size={64} className="text-rose-500" />
                    <label className="text-sm md:text-3xl font-black uppercase tracking-[0.4em] leading-none">Última Recarga:</label>
                 </div>
                 <input 
                  type="date" 
                  value={gas.purchaseDate} 
                  onChange={e => setGas({...gas, purchaseDate: e.target.value})}
                  className="w-full bg-white px-10 py-10 md:py-14 rounded-[3rem] md:rounded-[4.5rem] border-8 border-slate-100 font-black text-4xl md:text-7xl text-black outline-none shadow-3xl text-center uppercase"
                 />
              </div>

              {/* BARRA DE NÍVEL AMPLIADA */}
              <div className="space-y-12 md:space-y-20 bg-slate-50 p-10 md:p-20 rounded-[4rem] md:rounded-[7rem] border-8 border-white shadow-inner">
                <div className="flex justify-between items-center px-6 md:px-14">
                  <span className="text-sm md:text-2xl font-black uppercase tracking-widest text-rose-500">Vazio</span>
                  <div className="flex flex-col items-center">
                    <span className="text-9xl md:text-[15rem] font-black tracking-tighter leading-none text-black">
                      {gasStats?.level ?? 0}<small className="text-4xl md:text-7xl font-black">%</small>
                    </span>
                    <span className="label-premium mt-8">Nível Atual</span>
                  </div>
                  <span className="text-sm md:text-2xl font-black uppercase tracking-widest text-emerald-500">Cheio</span>
                </div>
                <div className="relative h-24 md:h-48 w-full bg-slate-200 rounded-[3rem] md:rounded-[5rem] p-4 md:p-8 border-[12px] border-white shadow-3xl overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${gasStats?.level && gasStats.level < 20 ? 'bg-rose-500' : gasStats?.level && gasStats.level < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${gasStats?.level ?? 0}%` }}></div>
                </div>
              </div>

              {gasStats && (
                <div className={`p-16 md:p-32 rounded-[5rem] md:rounded-[8rem] border-[15px] flex flex-col items-center text-center gap-12 md:gap-20 overflow-hidden ${gasStats.isAlert || gasStats.isExpired ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-white shadow-3xl'}`}>
                   <Calendar size={80} md:size={180} className={gasStats.isAlert || gasStats.isExpired ? 'text-rose-600' : 'text-slate-200'} strokeWidth={3} />
                   <div className="space-y-6 w-full">
                     <label className="text-sm md:text-3xl font-black uppercase tracking-[0.6em] text-slate-400">Previsão de Término</label>
                     <p className="text-6xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-none text-black">
                       {gasStats.isExpired ? 'ESGOTADO' : gasStats.nextDate}
                     </p>
                   </div>
                   <div className="bg-white px-16 md:px-28 py-10 md:py-16 rounded-[4rem] md:rounded-[6rem] border-8 border-slate-50 shadow-4xl">
                     <span className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter">
                       {gasStats.isExpired ? 'CORRA PARA COMPRAR!' : `Restam ${gasStats.daysLeft} Dias`}
                     </span>
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
