
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Transaction } from '../types';
import { 
  Trash2, 
  DollarSign, 
  Plus, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  BarChart3, 
  Youtube, 
  ShoppingCart, 
  Store, 
  Lightbulb, 
  ChevronRight,
  BookOpen,
  PieChart,
  AlertCircle
} from 'lucide-react';
import Button3D from '../components/Button3D';

const Finances: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [type, setType] = useState<'gain' | 'expense'>('expense');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lar_finances_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Garantir ordenação por data (assumindo que id é timestamp)
      setTransactions(parsed.sort((a: any, b: any) => Number(b.id) - Number(a.id)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lar_finances_v4', JSON.stringify(transactions));
  }, [transactions]);

  const addTx = () => {
    if (!desc.trim()) {
      setError('A descrição é obrigatória');
      return;
    }
    const numericVal = parseFloat(val);
    if (isNaN(numericVal) || numericVal <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      description: desc,
      amount: numericVal,
      type,
      category: 'outros',
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setTransactions([newTx, ...transactions]);
    setDesc('');
    setVal('');
    setError('');
    setIsAdding(false);
  };

  const totalGain = transactions.filter(t => t.type === 'gain').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalGain - totalExpense;

  // Cálculo Seguro da Taxa de Poupança
  const savingsRate = totalGain > 0 ? (balance / totalGain) * 100 : 0;

  const maxVal = Math.max(totalGain, totalExpense, 1);
  const gainPercent = (totalGain / maxVal) * 100;
  const expensePercent = (totalExpense / maxVal) * 100;

  return (
    <Layout userName={userName} title="Fluxo de Caixa Familiar" onBack={() => navigate('/home')}>
      <div className="max-w-4xl mx-auto space-y-12 py-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between h-72 shadow-2xl relative overflow-hidden bg-white">
            <div className={`absolute top-0 left-0 w-3 h-full ${balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                <p className="overline text-slate-400">Patrimônio Líquido</p>
                <h2 className={`text-6xl font-black tracking-tighter ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${balance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <Wallet size={32} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 z-10">
              <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                 <ArrowUpRight size={16} className="text-emerald-500" />
                 <span className="text-sm font-black text-slate-900">R$ {totalGain.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                 <ArrowDownRight size={16} className="text-rose-500" />
                 <span className="text-sm font-black text-slate-900">R$ {totalExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3rem] flex flex-col justify-between border border-slate-800 text-white shadow-2xl">
            <div className="space-y-1">
              <p className="overline text-slate-500 text-[9px]">Eficiência Mensal</p>
              <h3 className="text-3xl font-black tracking-tighter">Poupança</h3>
            </div>
            <div className="space-y-4">
              <p className={`text-5xl font-black tracking-tighter ${savingsRate > 20 ? 'text-emerald-400' : savingsRate > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {savingsRate.toFixed(1)}%
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">da sua renda foi salva.</p>
            </div>
            <button 
              onClick={() => setIsAdding(true)} 
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5"
            >
              <Plus size={16} /> Novo Registro
            </button>
          </div>
        </div>

        {/* ANÁLISE COMPARATIVA */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
               <BarChart3 size={24} />
             </div>
             <h3 className="text-2xl font-black text-slate-950 tracking-tight">Equilíbrio de Contas</h3>
           </div>
           <div className="space-y-10">
              <div className="space-y-3">
                <div className="flex justify-between items-center overline text-slate-400">
                  <span>Total de Entradas</span>
                  <span className="text-emerald-500 font-black">R$ {totalGain.toLocaleString()}</span>
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${gainPercent}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center overline text-slate-400">
                  <span>Total de Saídas</span>
                  <span className="text-rose-500 font-black">R$ {totalExpense.toLocaleString()}</span>
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${expensePercent}%` }}></div>
                </div>
              </div>
           </div>
        </div>

        {/* FORMULÁRIO DE LANÇAMENTO */}
        {isAdding && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl animate-in slide-in-from-top-6 duration-500 space-y-10">
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-slate-950 tracking-tight">Novo Lançamento</h3>
               <button onClick={() => { setIsAdding(false); setError(''); }} className="text-slate-400 overline hover:text-rose-500">Cancelar</button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setType('gain')} className={`py-6 rounded-2xl font-black uppercase text-xs border-2 transition-all ${type === 'gain' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg' : 'bg-slate-50 border-transparent text-slate-400'}`}>Receita (+)</button>
               <button onClick={() => setType('expense')} className={`py-6 rounded-2xl font-black uppercase text-xs border-2 transition-all ${type === 'expense' ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg' : 'bg-slate-50 border-transparent text-slate-400'}`}>Despesa (-)</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="overline text-slate-400 ml-1">O que é?</label>
                  <input type="text" placeholder="Ex: Salário, Mercado..." value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 outline-none text-xl font-bold focus:bg-white focus:border-indigo-400 shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="overline text-slate-400 ml-1">Quanto (R$)</label>
                  <input type="number" step="0.01" placeholder="0,00" value={val} onChange={e => setVal(e.target.value)} className="w-full bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 outline-none text-xl font-black focus:bg-white focus:border-indigo-400 shadow-inner" />
                </div>
             </div>
             {error && (
               <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <AlertCircle size={18} />
                  <p className="text-sm font-black uppercase tracking-widest">{error}</p>
               </div>
             )}
             <Button3D onClick={addTx} color={type === 'gain' ? 'success' : 'danger'} fullWidth size="lg">Confirmar Transação</Button3D>
          </div>
        )}

        {/* LISTAGEM HISTÓRICA */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden pb-10">
          <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/50">
            <h4 className="overline text-slate-500">Extrato Consolidado</h4>
          </div>
          <div className="divide-y divide-slate-50">
            {transactions.length > 0 ? transactions.map(t => (
              <div key={t.id} className="px-10 py-8 flex items-center justify-between hover:bg-slate-50 transition-all group animate-in fade-in">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${t.type === 'gain' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     {t.type === 'gain' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{t.description}</p>
                    <p className="overline text-slate-400 mt-1 text-[9px]">{t.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`text-2xl font-black tracking-tighter ${t.type === 'gain' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'gain' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => setTransactions(prev => prev.filter(tx => tx.id !== t.id))} className="text-slate-200 hover:text-rose-500 p-2 transition-colors"><Trash2 size={24} /></button>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center space-y-4">
                <p className="overline text-slate-300 tracking-[0.4em]">Nenhuma movimentação</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Finances;
