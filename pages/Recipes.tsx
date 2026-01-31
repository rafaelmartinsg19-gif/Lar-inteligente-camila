
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
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Coffee,
  Utensils,
  IceCream,
  GlassWater,
  X,
  ChefHat
} from 'lucide-react';
import Button3D from '../components/Button3D';
import { searchRecipesAI } from '../services/geminiService';

// Normalização que remove acentos e deixa tudo minúsculo
const normalize = (str: string) => 
  str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

const Recipes: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState('TUDO');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
      // 1. Filtro por Aba (Categoria)
      let matchTab = true;
      if (activeTab === 'CAFÉ') matchTab = r.categoria.includes('Café') || r.categoria.includes('Pães');
      if (activeTab === 'ALMOÇO') matchTab = ['Almoço', 'Carnes', 'Massas', 'Peixes', 'Pratos Principais'].some(c => r.categoria.includes(c));
      if (activeTab === 'DOCES') matchTab = ['Sobremesas', 'Bolos', 'Doces', 'Pudim'].some(c => r.categoria.includes(c));
      if (activeTab === 'BEBIDAS') matchTab = ['Bebidas', 'Sucos', 'Drinks', 'Café'].some(c => r.categoria.includes(c));
      
      if (!matchTab) return false;

      // 2. Filtro de Busca Inteligente (Multi-palavras)
      if (searchTerms.length === 0) return true;

      const targetText = normalize(`${r.nome} ${r.categoria} ${r.subcategoria || ''} ${r.descricao} ${r.ingredientes.map(i => i.nome).join(' ')}`);
      
      // Verifica se TODAS as palavras buscadas estão no texto da receita
      return searchTerms.every(word => targetText.includes(word));
    });

    return result.sort((a, b) => {
      const valA = Number(a.custoPorPorcao) || 0;
      const valB = Number(b.custoPorPorcao) || 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [search, activeTab, aiRecipes, sortOrder]);

  const displayedRecipes = filtered.slice(0, visibleCount);

  const getCostBadge = (custo: string) => {
    switch (custo) {
      case 'baixo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'médio': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'alto': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (selected) {
    return (
      <Layout userName={userName} title={selected.nome} onBack={() => setSelected(null)}>
        <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="kitchen-card p-12 md:p-16 relative overflow-hidden border-8 border-white bg-white">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-[#e85d97] via-[#a34e36] to-[#5d4037]"></div>
            
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
              <div className="flex gap-4">
                <span className="bg-[#a34e36]/10 text-[#a34e36] px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] border-2 border-[#a34e36]/10">
                  {selected.categoria}
                </span>
                <span className={`px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] border-2 ${getCostBadge(selected.custo)}`}>
                  Investimento {selected.custo}
                </span>
              </div>
              <button 
                onClick={(e) => toggleFavorite(e, selected.id)}
                className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center transition-all active:scale-90 ${favorites.includes(selected.id.toString()) ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-xl' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
              >
                <Heart size={32} fill={favorites.includes(selected.id.toString()) ? "currentColor" : "none"} strokeWidth={3} />
              </button>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter leading-none uppercase">{selected.nome}</h2>
            <p className="text-2xl text-[#5d4037] font-black italic mb-12 leading-tight uppercase opacity-80">"{selected.descricao}"</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Clock, label: 'Tempo', val: selected.tempoTotal },
                { icon: Users, label: 'Rendimento', val: selected.rendimento || 'Individual' },
                { icon: CookingPot, label: 'Custo Est.', val: `R$ ${(Number(selected.custoPorPorcao) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
                { icon: DollarSign, label: 'Nível', val: selected.nivel || 'Fácil' }
              ].map((item, i) => (
                <div key={i} className="bg-[#fdfaf6] p-8 rounded-[2.5rem] text-center border-4 border-white shadow-inner">
                  <item.icon size={32} className="mx-auto mb-4 text-[#a34e36]" strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">{item.label}</p>
                  <p className="text-lg font-black text-black uppercase tracking-tight leading-none">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <section className="space-y-10">
                 <h3 className="text-3xl font-black text-black tracking-tight uppercase border-b-4 border-[#fdfaf6] pb-4">Ingredientes</h3>
                 <div className="space-y-4">
                    {selected.ingredientes.map((ing, i) => (
                      <div key={i} className="flex justify-between p-6 bg-[#fdfaf6] rounded-[2rem] border-4 border-white shadow-sm">
                        <p className="font-black text-black text-xl tracking-tighter uppercase">{ing.nome}</p>
                        <p className="font-black text-[#e85d97] text-xl uppercase tracking-tighter">{ing.quantidade}</p>
                      </div>
                    ))}
                 </div>
               </section>

               <section className="space-y-10">
                 <h3 className="text-3xl font-black text-black tracking-tight uppercase border-b-4 border-[#fdfaf6] pb-4">Modo de Fazer</h3>
                 <div className="space-y-6">
                   {selected.modo_de_preparo.map((s, i) => (
                     <div key={i} className="flex gap-6 items-start">
                       <div className="w-12 h-12 bg-white text-[#a34e36] rounded-full flex items-center justify-center font-black text-xl shadow-md border-2 border-[#f0f0f0]">{i+1}</div>
                       <p className="text-lg font-black text-[#5d4037] pt-2 leading-tight uppercase tracking-tight">{s}</p>
                     </div>
                   ))}
                 </div>
               </section>
            </div>

            <div className="mt-20 pt-12 border-t-8 border-[#f0f0f0] flex flex-col sm:flex-row gap-8">
              <Button3D fullWidth size="xl" onClick={() => window.open(`https://youtube.com/search?q=como+fazer+${encodeURIComponent(selected.nome)}`, '_blank')} color="danger" className="h-28 text-2xl">
                <Youtube size={40} strokeWidth={3} /> Passo a Passo
              </Button3D>
              <button onClick={() => setSelected(null)} className="w-full sm:w-auto px-16 py-8 text-slate-400 font-black text-[12px] uppercase tracking-[0.4em] hover:text-[#e85d97] transition-all">Fechar Receita</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userName={userName} title="Receiteca Infinita" onBack={() => navigate('/home')}>
      <div className="space-y-12 pb-32">
        
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 text-center md:text-left">
          <label className="label-premium">Receiteca da Dona Camila</label>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase leading-none">Busca Infinita</h2>
          <p className="text-2xl text-[#5d4037] font-black tracking-tight uppercase opacity-70">Encontre qualquer sabor: do bolo de chocolate ao pão artesanal.</p>
        </div>

        {/* BARRA DE BUSCA "INFINITA" COM NORMALIZAÇÃO */}
        <div className="space-y-8 sticky top-28 z-40 bg-transparent">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="PESQUISAR QUALQUER COMIDA..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-white border-8 border-white rounded-[4rem] py-12 px-14 text-3xl md:text-4xl font-black outline-none focus:border-[#e85d97] transition-all shadow-[0_40px_80px_rgba(0,0,0,0.15)] uppercase placeholder:opacity-20 pr-36"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:text-rose-500 transition-colors"
                >
                  <X size={32} strokeWidth={4} />
                </button>
              )}
              <div className="bg-[#fdfaf6] p-6 rounded-3xl text-[#a34e36] shadow-inner pointer-events-none">
                <Search size={48} strokeWidth={4} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { id: 'TUDO', icon: Utensils, label: 'Tudo' },
              { id: 'CAFÉ', icon: Coffee, label: 'Café / Lanches' },
              { id: 'ALMOÇO', icon: Utensils, label: 'Refeições' },
              { id: 'DOCES', icon: IceCream, label: 'Sobremesas' },
              { id: 'BEBIDAS', icon: GlassWater, label: 'Bebidas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-10 py-6 rounded-[2.5rem] border-4 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-xl' : 'bg-white text-black border-white hover:border-[#e85d97]'}`}
              >
                <tab.icon size={28} strokeWidth={3} />
                <span className="text-[12px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              </button>
            ))}
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-4 px-10 py-6 rounded-[2.5rem] bg-white border-4 border-white text-black hover:border-[#e85d97] transition-all shadow-md ml-auto"
            >
              {sortOrder === 'asc' ? <ArrowUpNarrowWide size={28} /> : <ArrowDownNarrowWide size={28} />}
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{sortOrder === 'asc' ? 'Preço ↑' : 'Preço ↓'}</span>
            </button>
          </div>
        </div>

        {/* GRADE DE RESULTADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {displayedRecipes.map((r, i) => (
             <div 
              key={r.id} 
              onClick={() => setSelected(r)}
              className="kitchen-card p-10 flex flex-col h-full relative group cursor-pointer overflow-hidden border-4 border-white bg-white animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${(i % 12) * 50}ms` }}
             >
                {r.isAI && (
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-200 z-10">
                    Sugerido por IA
                  </div>
                )}
                <div className="space-y-6 flex-1">
                   <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{r.categoria}</span>
                      <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border-2 ${getCostBadge(r.custo)}`}>
                        {r.custo}
                      </div>
                   </div>
                   <h3 className="text-3xl font-black text-black leading-none tracking-tighter group-hover:text-[#e85d97] transition-colors uppercase">{r.nome}</h3>
                   
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principais Ingredientes:</p>
                     <p className="text-sm font-black text-[#5d4037] opacity-60 uppercase line-clamp-2 leading-tight">
                       {r.ingredientes.slice(0, 4).map(ing => ing.nome).join(' • ')}
                     </p>
                   </div>

                   <div className="pt-6 mt-6 border-t-4 border-[#fdfaf6] flex justify-between items-center">
                      <div className="flex flex-col">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Prep.</p>
                        <p className="text-xl font-black text-black tracking-tighter uppercase">{r.tempoTotal}</p>
                      </div>
                      <div className="flex flex-col text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Custo Est.</p>
                        <p className="text-xl font-black text-[#a34e36] tracking-tighter">R$ {(Number(r.custoPorPorcao) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                   </div>
                </div>
                <div className="mt-6 w-full h-14 bg-[#fdfaf6] group-hover:bg-[#e85d97] group-hover:text-white rounded-2xl flex items-center justify-center transition-all text-[#a34e36]">
                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">Abrir Receita</span>
                   <ChevronRight size={24} className="ml-2" />
                </div>
             </div>
           ))}
        </div>

        {/* LOADING & LOAD MORE INFINITO */}
        <div className="py-20 flex flex-col items-center justify-center gap-10">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <Loader2 size={80} className="text-[#e85d97] animate-spin" strokeWidth={3} />
              <p className="text-2xl font-black text-black uppercase tracking-tighter text-center">Consultando a nuvem de receitas...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10 w-full max-w-3xl">
              {filtered.length > visibleCount && (
                <Button3D fullWidth size="xl" onClick={() => setVisibleCount(v => v + 12)} color="neutral" className="h-28 text-2xl border-4 bg-white">
                  Ver Mais Locais
                </Button3D>
              )}
              
              {search.length > 2 && (
                <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-[#e85d97]/30 flex flex-col items-center gap-8 w-full shadow-2xl">
                   <div className="w-20 h-20 bg-rose-50 text-[#e85d97] rounded-3xl flex items-center justify-center shadow-inner">
                      <ChefHat size={40} />
                   </div>
                   <div className="text-center space-y-2">
                      <h4 className="text-3xl font-black text-black tracking-tighter uppercase">Não achou o que queria?</h4>
                      <p className="text-lg text-slate-500 font-bold uppercase tracking-tight">A Dona Camila pode criar receitas de "{search}" agora mesmo com IA.</p>
                   </div>
                   <Button3D fullWidth size="xl" onClick={loadMoreAI} color="primary" className="h-28 text-2xl bg-[#e85d97] shadow-[0_20px_50px_rgba(232,93,151,0.3)] border-4 border-white">
                    <Sparkles size={36} className="mr-4" /> Gerar Novas de {search}
                  </Button3D>
                </div>
              )}
            </div>
          )}
          
          {filtered.length === 0 && !isGenerating && search && (
            <div className="text-center space-y-8 p-20 bg-white/50 rounded-[4rem] border-4 border-dashed border-white w-full max-w-2xl mx-auto">
               <CookingPot size={100} className="mx-auto text-slate-200" strokeWidth={1} />
               <p className="text-3xl font-black text-slate-400 uppercase tracking-tighter leading-tight">
                 Nenhuma receita de "{search}" em nossa base local.<br/>Clique no botão rosa para pedir à IA!
               </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Recipes;
