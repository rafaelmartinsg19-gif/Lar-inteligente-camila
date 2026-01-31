
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

  const handleEdit = (app: Appliance) => {
    setEditingId(app.id);
    setNewApp({
      name: app.name,
      watts: app.watts.toString(),
      hours: app.hoursPerDay.toString(),
      days: app.daysPerWeek
    });
    setActiveTab('luz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <Layout userName={userName} title="Utilidades" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-32">
        
        {/* TABS RESPONSIVAS */}
        <div className="flex bg-white p-1.5 md:p-2 rounded-[2rem] md:rounded-[3rem] shadow-xl border-2 md:border-4 border-white sticky top-24 md:top-28 z-40 backdrop-blur-xl">
          {[
            { id: 'luz', icon: Zap, label: 'Luz', color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'agua', icon: Droplets, label: 'Água', color: 'text-blue-500', bg: 'bg-blue-50' },
            { id: 'gas', icon: Flame, label: 'Gás', color: 'text-rose-500', bg: 'bg-rose-50' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center py-4 md:py-6 rounded-2xl md:rounded-[2.5rem] transition-all gap-1.5 md:gap-2 ${activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-lg border-2 border-white` : 'text-slate-400 opacity-40'}`}
            >
              <tab.icon size={24} className="md:w-8 md:h-8" strokeWidth={3} />
              <span className="text-[8px] md:text-[10px] tracking-widest font-black uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'luz' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-slate-950 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] text-white space-y-4 md:space-y-6 shadow-2xl border-4 border-slate-900 relative overflow-hidden">
                <label className="label-premium text-slate-500">Gasto Mensal Est.</label>
                <div className="flex items-baseline gap-2 md:gap-4">
                  <span className="text-xl md:text-2xl font-black text-amber-500">R$</span>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                    {totalEnergy.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="flex items-center gap-3 md:gap-4 pt-6 md:pt-8 border-t border-white/10">
                  <Activity size={24} className="text-amber-500 md:w-8 md:h-8" strokeWidth={3} />
                  <span className="font-black text-white text-xl md:text-2xl tracking-tighter">{totalEnergy.kwh.toFixed(1)} <span className="text-sm md:text-lg text-slate-500">kWh</span></span>
                </div>
              </div>

              <div className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border-4 border-[#f0f0f0] shadow-xl space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-amber-100">
                    <DollarSign size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                  </div>
                  <label className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-black">Tarifa kWh</label>
                </div>
                <input 
                  type="number" step="0.01" value={energyRate} 
                  onChange={e => setEnergyRate(Number(e.target.value))}
                  className="w-full bg-[#fdfaf6] px-6 md:px-10 py-6 md:py-8 rounded-2xl md:rounded-[2.5rem] border-4 border-white outline-none text-3xl md:text-5xl font-black text-black shadow-inner"
                />
              </div>
            </div>

            <div className="bg-white p-8 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border-4 border-[#f0f0f0] shadow-2xl space-y-8 md:space-y-12">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-amber-50 text-amber-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
                  {editingId ? <Edit2 size={24} md:size={36} strokeWidth={3} /> : <Plus size={24} md:size={36} strokeWidth={3} />}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase leading-none">{editingId ? 'Editar Aparelho' : 'Novo Aparelho'}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Nome</label>
                  <input type="text" placeholder="Ex: Geladeira" value={newApp.name} onChange={e => setNewApp({...newApp, name: e.target.value})} className="w-full bg-[#fdfaf6] px-6 md:px-10 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] border-4 border-white outline-none font-black text-black text-lg md:text-2xl shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Watts</label>
                  <input type="number" placeholder="Ex: 500" value={newApp.watts} onChange={e => setNewApp({...newApp, watts: e.target.value})} className="w-full bg-[#fdfaf6] px-6 md:px-10 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] border-4 border-white outline-none font-black text-black text-lg md:text-2xl shadow-inner" />
                </div>
                <div className="md:col-span-2 space-y-6 md:space-y-8 bg-[#fdfaf6] p-6 md:p-10 rounded-3xl md:rounded-[3rem] border-4 border-white">
                  <div className="flex justify-between items-end px-2">
                    <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-black">Horas/Dia</label>
                    <span className="font-black text-3xl md:text-5xl text-black tracking-tighter">{newApp.hours}<small className="text-lg">h</small></span>
                  </div>
                  <input type="range" min="1" max="24" value={newApp.hours} onChange={e => setNewApp({...newApp, hours: e.target.value})} className="w-full h-8 md:h-10 bg-slate-200 rounded-full accent-amber-500 cursor-pointer" />
                </div>
              </div>
              <Button3D onClick={saveAppliance} color="warning" fullWidth size="xl" className="h-16 md:h-24 text-lg md:text-xl border-4 border-white">
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button3D>
            </div>
          </div>
        )}

        {activeTab === 'agua' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4.5rem] border-4 border-[#f0f0f0] shadow-2xl flex flex-col items-center gap-10 md:gap-16">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-blue-600 text-white rounded-[1.5rem] md:rounded-[3rem] flex items-center justify-center shadow-xl border-4 border-white rotate-6">
                <Droplets size={40} md:size={64} strokeWidth={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full">
                <div className="space-y-4 text-center">
                  <label className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 block">Consumo (m³)</label>
                  <input type="number" value={water.consumptionM3 || ''} onChange={e => setWater({...water, consumptionM3: Number(e.target.value)})} className="w-full bg-[#fdfaf6] px-6 py-6 md:py-10 rounded-[2rem] md:rounded-[3rem] border-4 border-white text-4xl md:text-6xl text-center font-black text-black shadow-inner" />
                </div>
                <div className="space-y-4 text-center">
                  <label className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 block">Tarifa m³</label>
                  <input type="number" step="0.01" value={water.pricePerM3 || ''} onChange={e => setWater({...water, pricePerM3: Number(e.target.value)})} className="w-full bg-[#fdfaf6] px-6 py-6 md:py-10 rounded-[2rem] md:rounded-[3rem] border-4 border-white text-4xl md:text-6xl text-center font-black text-black shadow-inner" />
                </div>
              </div>
              <div className="w-full bg-blue-50 p-10 md:p-20 rounded-[3rem] md:rounded-[4rem] text-center border-4 border-blue-100 shadow-xl relative overflow-hidden">
                <p className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 relative z-10">Previsão Fatura</p>
                <h3 className="text-5xl md:text-8xl font-black text-blue-900 tracking-tighter leading-none relative z-10">
                  <small className="text-xl md:text-3xl align-middle mr-2 md:mr-4">R$</small>
                  {(water.consumptionM3 * water.pricePerM3).toFixed(2).replace('.', ',')}
                </h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gas' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {gasStats?.isAlert && (
              <div className="bg-rose-600 text-white p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] shadow-2xl animate-pulse border-4 md:border-8 border-white flex items-center gap-6 md:gap-10">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <BellRing size={32} md:size={56} strokeWidth={3} />
                 </div>
                 <div>
                    <h4 className="text-xl md:text-4xl font-black tracking-tighter uppercase leading-none">Abasteça já!</h4>
                    <p className="text-xs md:text-xl font-black opacity-90 mt-2 md:mt-4 leading-tight uppercase">Cuidado: restam apenas **{gasStats.daysLeft} dias**.</p>
                 </div>
              </div>
            )}

            <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[5rem] border-4 border-[#f0f0f0] shadow-2xl space-y-8 md:space-y-16">
              <div className="flex items-center gap-6 md:gap-10">
                <div className="w-16 h-16 md:w-28 md:h-28 bg-rose-500 text-white rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl border-4 border-white rotate-3 shrink-0">
                  <Flame size={28} md:size={56} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none uppercase">Monitor de Gás</h3>
                  <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 mt-2 md:mt-5">Estimado: 250g/dia</p>
                </div>
              </div>

              <div className="bg-[#fdfaf6] p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] border-4 border-white shadow-inner space-y-4 md:space-y-8">
                 <div className="flex items-center gap-3 text-black px-2">
                    <CalendarDays size={20} md:size={36} className="text-rose-500" />
                    <label className="text-[9px] md:text-[12px] font-black uppercase tracking-widest leading-none">Última Recarga:</label>
                 </div>
                 <input 
                  type="date" 
                  value={gas.purchaseDate} 
                  onChange={e => setGas({...gas, purchaseDate: e.target.value})}
                  className="w-full bg-white px-6 md:px-12 py-4 md:py-10 rounded-xl md:rounded-[2.5rem] border-2 md:border-4 border-slate-100 font-black text-xl md:text-2xl text-black outline-none shadow-lg"
                 />
              </div>

              <div className="space-y-6 md:space-y-12 bg-[#fdfaf6] p-6 md:p-16 rounded-[2rem] md:rounded-[4.5rem] border-4 border-white shadow-inner">
                <div className="flex justify-between items-center px-2 md:px-8">
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest text-rose-500">Vazio</span>
                  <div className="flex flex-col items-center text-center">
                    {/* ESCALA DE FONTE RESPONSIVA PARA O NIVEL % - Ajustada para não transbordar */}
                    <span className={`text-5xl md:text-7xl font-black tracking-tighter leading-none ${gasStats?.level && gasStats.level < 20 ? 'text-rose-600 animate-bounce' : 'text-black'}`}>
                      {gasStats?.level ?? 0}%
                    </span>
                    <span className="text-[9px] md:text-[12px] font-black uppercase tracking-widest text-slate-400 mt-2 md:mt-6 leading-none">Capacidade</span>
                  </div>
                  <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest text-emerald-500">Cheio</span>
                </div>
                <div className="relative h-16 md:h-28 w-full bg-slate-200 rounded-[2rem] md:rounded-[3rem] p-2 md:p-4 border-4 md:border-8 border-white shadow-2xl overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${gasStats?.level && gasStats.level < 20 ? 'bg-rose-500 shadow-xl' : gasStats?.level && gasStats.level < 50 ? 'bg-amber-500' : 'bg-emerald-500 shadow-xl'}`} style={{ width: `${gasStats?.level ?? 0}%` }}></div>
                </div>
              </div>

              {gasStats && (
                <div className={`p-8 md:p-20 rounded-[2.5rem] md:rounded-[5rem] border-4 md:border-8 flex flex-col items-center text-center gap-6 md:gap-12 ${gasStats.isAlert || gasStats.isExpired ? 'bg-rose-50 border-rose-200' : 'bg-[#fdfaf6] border-white shadow-2xl'}`}>
                   <Calendar size={40} md:size={72} className={gasStats.isAlert || gasStats.isExpired ? 'text-rose-600' : 'text-slate-200'} strokeWidth={3} />
                   <div className="space-y-3">
                     <label className="text-[10px] md:text-[13px] font-black uppercase tracking-[0.4em] text-slate-400">Previsão de Término</label>
                     {/* DATA RESPONSIVA - Ajustada para não cortar nas laterais */}
                     <p className={`text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none ${gasStats.isAlert || gasStats.isExpired ? 'text-rose-600' : 'text-black'}`}>
                       {gasStats.isExpired ? 'ESGOTADO' : gasStats.nextDate}
                     </p>
                   </div>
                   <div className="bg-white px-8 md:px-16 py-5 md:py-10 rounded-2xl md:rounded-[3.5rem] border-2 md:border-4 border-slate-100 shadow-2xl">
                     <span className="text-xl md:text-3xl font-black text-black uppercase tracking-tighter">
                       {gasStats.isExpired ? 'Acabou!' : `Resta ${gasStats.daysLeft} Dias`}
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
