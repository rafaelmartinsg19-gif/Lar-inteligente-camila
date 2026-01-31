
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { INITIAL_RECIPES } from '../constants';
import { Recipe } from '../types';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Users, 
  Heart, 
  Youtube, 
  ChevronRight, 
  DollarSign,
  Loader2,
  CookingPot,
  Coffee,
  Utensils,
  IceCream,
  ChefHat,
  FileDown,
  AlertCircle
} from 'lucide-react';
import Button3D from '../components/Button3D';
import { searchRecipesAI } from '../services/geminiService';

const normalize = (str: string) => 
  str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

const Recipes: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState('TUDO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('lar_favorites_v6');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lar_favorites_v6', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const idStr = id.toString();
    setFavorites(prev => prev.includes(idStr) ? prev.filter(f => f !== idStr) : [...prev, idStr]);
  };

  const loadMoreAI = async () => {
    if (!search.trim()) return;
    setIsGenerating(true);
    const results = await searchRecipesAI(search, 8);
    if (results && results.length > 0) {
      const formatted = results.map((r: any, idx: number) => ({
        ...r,
        id: `ai-${Date.now()}-${idx}`,
        isAI: true,
        custoPorPorcao: Number(r.custoPorPorcao) || 10
      }));
      setAiRecipes(prev => [...formatted, ...prev]);
      setVisibleCount(prev => prev + formatted.length);
    }
    setIsGenerating(false);
  };

  const filtered = useMemo(() => {
    const combined = [...INITIAL_RECIPES, ...aiRecipes];
    const searchTerms = normalize(search).split(/\s+/).filter(Boolean);
    
    let result = combined.filter(r => {
      let matchTab = true;
      if (activeTab === 'CAFÉ') matchTab = r.categoria.includes('Café') || r.categoria.includes('Pães');
      if (activeTab === 'ALMOÇO') matchTab = ['Almoço', 'Carnes', 'Massas', 'Peixes', 'Pratos Principais'].some(c => r.categoria.includes(c));
      if (activeTab === 'DOCES') matchTab = ['Sobremesas', 'Bolos', 'Doces', 'Pudim'].some(c => r.categoria.includes(c));
      
      if (!matchTab) return false;
      if (searchTerms.length === 0) return true;

      const targetText = normalize(`${r.nome} ${r.categoria} ${r.subcategoria || ''} ${r.descricao} ${r.ingredientes.map(i => i.nome).join(' ')}`);
      return searchTerms.every(word => targetText.includes(word));
    });

    return result.sort((a, b) => (Number(a.custoPorPorcao) || 0) - (Number(b.custoPorPorcao) || 0));
  }, [search, activeTab, aiRecipes]);

  const displayedRecipes = filtered.slice(0, visibleCount);

  if (selected) {
    return (
      <Layout userName={userName} title={selected.nome} onBack={() => setSelected(null)}>
        <div className="max-w-xl mx-auto space-y-6 py-4 px-4 pb-40">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-white shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <span className="bg-[#a34e36]/10 text-[#a34e36] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{selected.categoria}</span>
              <button onClick={(e) => toggleFavorite(e, selected.id)} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${favorites.includes(selected.id.toString()) ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                <Heart size={24} fill={favorites.includes(selected.id.toString()) ? "currentColor" : "none"} />
              </button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-black mb-2 tracking-tighter leading-none uppercase">{selected.nome}</h2>
            <p className="text-sm md:text-base text-[#5d4037] font-bold italic mb-6 opacity-70 leading-tight">"{selected.descricao}"</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Clock, label: 'Tempo', val: selected.tempoTotal },
                { icon: Users, label: 'Rende', val: selected.rendimento || 'Individual' },
                { icon: CookingPot, label: 'Custo', val: `R$ ${Number(selected.custoPorPorcao || 0).toFixed(2)}` },
                { icon: DollarSign, label: 'Nível', val: selected.nivel || 'Fácil' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-2xl text-center border border-white">
                  <item.icon size={18} className="mx-auto mb-1 text-[#a34e36]" />
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-xs font-black text-black uppercase">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
               <section className="space-y-3">
                 <h3 className="text-xl font-black text-black tracking-tight uppercase border-b border-slate-100 pb-1">Ingredientes</h3>
                 <div className="space-y-1.5">
                    {selected.ingredientes.map((ing, i) => (
                      <div key={i} className="flex justify-between p-3 bg-slate-50 rounded-xl border border-white">
                        <p className="font-bold text-black text-sm uppercase tracking-tight">{ing.nome}</p>
                        <p className="font-black text-[#e85d97] text-sm uppercase tracking-tight">{ing.quantidade}</p>
                      </div>
                    ))}
                 </div>
               </section>

               <section className="space-y-3">
                 <h3 className="text-xl font-black text-black tracking-tight uppercase border-b border-slate-100 pb-1">Preparo</h3>
                 <div className="space-y-4">
                   {selected.modo_de_preparo.map((s, i) => (
                     <div key={i} className="flex gap-3 items-start">
                       <div className="w-8 h-8 bg-white text-[#a34e36] rounded-lg flex items-center justify-center font-black text-sm shadow border border-slate-100 shrink-0">{i+1}</div>
                       <p className="text-sm font-bold text-[#5d4037] pt-1 leading-tight uppercase tracking-tight">{s}</p>
                     </div>
                   ))}
                 </div>
               </section>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 no-print">
              <Button3D fullWidth onClick={() => window.print()} color="primary" className="h-12 text-sm">
                <FileDown size={18} /> PDF
              </Button3D>
              <Button3D fullWidth onClick={() => window.open(`https://youtube.com/search?q=como+fazer+${encodeURIComponent(selected.nome)}`, '_blank')} color="danger" className="h-12 text-sm">
                <Youtube size={18} /> VÍDEO
              </Button3D>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userName={userName} title="RECEITECA" onBack={() => navigate('/home')}>
      <div className="max-w-xl mx-auto space-y-8 pb-32 px-4">
        
        <div className="text-center space-y-2">
          <label className="text-[9px] md:text-[10px] font-black text-[#a34e36] uppercase tracking-[0.4em] opacity-60">Receiteca Dona Camila</label>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase leading-none">Busca Infinita</h2>
          <p className="text-sm md:text-base text-[#5d4037] font-bold uppercase opacity-80 leading-tight">
            Encontre qualquer sabor doméstico.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder="Pesquisar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-white rounded-full py-4 px-8 text-lg font-black outline-none focus:border-[#e85d97] shadow-lg uppercase placeholder:opacity-30 pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-[#a34e36] rounded-full shadow-md flex items-center justify-center text-white">
                <Search size={22} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['TUDO', 'CAFÉ', 'ALMOÇO', 'DOCES'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${activeTab === tab ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-md' : 'bg-white text-black border-white shadow-sm'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {search && (
          <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-white animate-in zoom-in-95">
             <AlertCircle size={24} className="text-amber-600 shrink-0" />
             <p className="text-[10px] font-black text-amber-900 uppercase tracking-tight">Vimos sua busca por "{search}"!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {displayedRecipes.map((r) => (
             <div 
              key={r.id} 
              onClick={() => setSelected(r)}
              className="bg-white p-6 rounded-3xl flex flex-col h-full border-2 border-white shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
             >
                <div className="space-y-3 flex-1">
                   <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{r.categoria}</span>
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border border-emerald-100">{r.nivel || 'Baixo'}</span>
                   </div>
                   <h3 className="text-lg md:text-xl font-black text-black leading-tight tracking-tighter group-hover:text-[#e85d97] transition-colors uppercase">{r.nome}</h3>
                   <div className="pt-4 mt-3 border-t border-slate-50 flex justify-between items-end">
                      <div>
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Preparo</p>
                        <p className="text-base font-black text-black tracking-tighter">{r.tempoTotal}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Custo</p>
                        <p className="text-base font-black text-[#a34e36] tracking-tighter">R$ {Number(r.custoPorPorcao || 0).toFixed(2)}</p>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="flex flex-col items-center gap-6 py-6">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-[#e85d97] animate-spin" />
              <p className="text-xs font-black text-black uppercase tracking-tighter">Cozinhando com IA...</p>
            </div>
          ) : (
            search.length > 2 && (
              <div className="bg-[#e85d97] p-6 rounded-[2rem] flex flex-col items-center gap-4 w-full shadow-lg text-white text-center">
                 <h4 className="text-lg font-black tracking-tighter uppercase">Falta algo?</h4>
                 <p className="text-[10px] font-bold uppercase tracking-tight opacity-90">A Dona Camila cria a receita para você agora!</p>
                 <Button3D fullWidth size="md" onClick={loadMoreAI} color="neutral" className="h-12 text-xs text-[#e85d97]">
                  <Sparkles size={18} className="mr-2" /> CRIAR COM IA
                </Button3D>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Recipes;
