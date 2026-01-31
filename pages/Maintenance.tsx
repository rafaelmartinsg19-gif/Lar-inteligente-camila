
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MAINTENANCE_GUIDES } from '../constants';
import { MaintenanceTask, MaintenanceComplexity, MaintenanceEnvironment } from '../types';
import { 
  Search, 
  Settings, 
  ChevronRight, 
  Clock, 
  Factory, 
  Building, 
  Home as HomeIcon, 
  Tag,
  Hammer,
  ClipboardList,
  Sparkles,
  Zap,
  HardHat,
  Trash2,
  Youtube,
  UserCheck,
  AlertTriangle,
  X,
  History,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  Filter,
  CheckCircle2,
  Clock3
} from 'lucide-react';
import Button3D from '../components/Button3D';
import { generateMaintenanceActivity } from '../services/geminiService';

// Função de normalização profunda
const normalize = (str: string) => 
  str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

const Maintenance: React.FC<{ userName: string }> = ({ userName }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tudo');
  const [activeComplexity, setActiveComplexity] = useState<MaintenanceComplexity | 'Tudo'>('Tudo');
  const [activeEnv, setActiveEnv] = useState<MaintenanceEnvironment | 'Tudo'>('Tudo');
  const [visibleCount, setVisibleCount] = useState(20);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('lar_maint_recent');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [customTasks, setCustomTasks] = useState<MaintenanceTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  const categories = [
    'Tudo', 'Elétrica', 'Hidráulica', 'Alvenaria', 'Marcenaria', 'Pintura', 
    'Limpeza Técnica', 'Jardinagem', 'Reparos Estruturais'
  ];

  const allTasks = useMemo(() => [...customTasks, ...MAINTENANCE_GUIDES], [customTasks]);

  // Motor de Busca Inteligente com Multi-Palavras
  const filteredTasks = useMemo(() => {
    const searchTerms = normalize(search).split(/\s+/).filter(Boolean);
    
    return allTasks.filter(t => {
      // 1. Filtros de Categoria/Complexidade/Ambiente
      const matchCat = activeCategory === 'Tudo' || t.category === activeCategory;
      const matchComp = activeComplexity === 'Tudo' || t.complexity === activeComplexity;
      const matchEnv = activeEnv === 'Tudo' || t.environment === activeEnv;
      
      if (!matchCat || !matchComp || !matchEnv) return false;

      // 2. Filtro de Texto (Tokens)
      if (searchTerms.length === 0) return true;
      const targetText = normalize(`${t.title} ${t.category} ${t.subcategory} ${t.description} ${t.materials.join(' ')}`);
      return searchTerms.every(word => targetText.includes(word));
    });
  }, [search, activeCategory, activeComplexity, activeEnv, allTasks]);

  const displayedTasks = filteredTasks.slice(0, visibleCount);

  // Manipulação de Scroll Infinito
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (visibleCount < filteredTasks.length) {
          setVisibleCount(prev => prev + 20);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredTasks.length]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (search.trim() && !recentSearches.includes(search)) {
      const updated = [search, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('lar_maint_recent', JSON.stringify(updated));
    }
  };

  const handleAISuggestion = async () => {
    if (!search.trim()) return;
    handleSearchSubmit();
    setIsGenerating(true);
    const activity = await generateMaintenanceActivity(search);
    if (activity) {
      const newTask = { ...activity, id: `ai-${Date.now()}` };
      setCustomTasks([newTask, ...customTasks]);
      setSelectedTask(newTask);
    }
    setIsGenerating(false);
  };

  const getEnvIcon = (env: MaintenanceEnvironment) => {
    switch (env) {
      case 'Industrial': return <Factory size={16} />;
      case 'Comercial': return <Building size={16} />;
      default: return <HomeIcon size={16} />;
    }
  };

  if (selectedTask) {
    return (
      <Layout userName={userName} title="Ordem de Serviço" onBack={() => setSelectedTask(null)}>
        <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
          <div className="kitchen-card p-12 md:p-16 relative overflow-hidden bg-white border-8 border-white">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-[#4F46E5] to-[#10B981]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
              <div className="space-y-4">
                <span className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-2xl font-black uppercase text-[11px] tracking-widest border-2 border-indigo-100">{selectedTask.category}</span>
                <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none mt-6 uppercase">{selectedTask.title}</h2>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border-4 border-white shadow-inner text-right min-w-[200px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocolo</p>
                <p className="text-xl font-black text-black tracking-tighter">#{selectedTask.id.slice(-6)}</p>
              </div>
            </div>

            <p className="text-2xl text-[#5d4037] font-black italic mb-16 leading-tight uppercase opacity-80">"{selectedTask.description}"</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
               <div className="bg-[#fdfaf6] p-8 rounded-[2.5rem] text-center border-4 border-white shadow-md">
                  <Clock size={32} className="mx-auto mb-4 text-[#4F46E5]" strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tempo</p>
                  <p className="text-xl font-black text-black uppercase">{selectedTask.estimatedTime}</p>
               </div>
               <div className="bg-[#fdfaf6] p-8 rounded-[2.5rem] text-center border-4 border-white shadow-md">
                  <div className="mx-auto mb-4 text-[#4F46E5] flex justify-center">{getEnvIcon(selectedTask.environment)}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Local</p>
                  <p className="text-xl font-black text-black uppercase">{selectedTask.environment}</p>
               </div>
               <div className="bg-[#fdfaf6] p-8 rounded-[2.5rem] text-center border-4 border-white shadow-md">
                  <UserCheck size={32} className="mx-auto mb-4 text-[#4F46E5]" strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Execução</p>
                  <p className="text-xl font-black text-black uppercase">{selectedTask.professional}</p>
               </div>
               <div className="bg-[#fdfaf6] p-8 rounded-[2.5rem] text-center border-4 border-white shadow-md">
                  <Zap size={32} className="mx-auto mb-4 text-amber-500" strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nível</p>
                  <p className="text-xl font-black text-black uppercase">{selectedTask.complexity}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <section className="space-y-10">
                <h3 className="text-3xl font-black text-black tracking-tight uppercase border-b-4 border-[#fdfaf6] pb-4">Materiais Necessários</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedTask.materials.map((m, i) => (
                    <div key={i} className="bg-[#fdfaf6] text-black px-8 py-4 rounded-[2rem] font-black border-4 border-white shadow-sm uppercase text-lg tracking-tight">
                      {m}
                    </div>
                  ))}
                </div>
              </section>

              {selectedTask.steps && (
                <section className="space-y-10">
                  <h3 className="text-3xl font-black text-black tracking-tight uppercase border-b-4 border-[#fdfaf6] pb-4">Manual de Passo a Passo</h3>
                  <div className="space-y-6">
                    {selectedTask.steps.map((step, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center font-black shrink-0 text-xl shadow-md border-2 border-[#f0f0f0]">{i+1}</div>
                        <p className="text-lg font-black text-[#5d4037] pt-2 leading-tight uppercase tracking-tight">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-20 pt-12 border-t-8 border-[#f0f0f0] flex flex-col sm:flex-row gap-8">
              <Button3D fullWidth size="xl" onClick={() => window.open(`https://youtube.com/search?q=como+fazer+${encodeURIComponent(selectedTask.title)}`, '_blank')} color="danger" className="h-28 text-2xl">
                <Youtube size={40} strokeWidth={3} /> Ver no YouTube
              </Button3D>
              <button onClick={() => setSelectedTask(null)} className="w-full sm:w-auto px-16 py-8 text-slate-400 font-black text-[12px] uppercase tracking-[0.4em] hover:text-indigo-600 transition-all">Voltar</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userName={userName} title="Gestão de Manutenção" onBack={() => navigate('/home')}>
      <div className="space-y-12 pb-32">
        
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 text-center md:text-left">
          <label className="label-premium">Bancada de Reparos</label>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase leading-none">Busca Infinita</h2>
          <p className="text-2xl text-[#5d4037] font-black tracking-tight uppercase opacity-70">Encontre procedimentos técnicos entre milhares de registros.</p>
        </div>

        {/* BARRA DE BUSCA SMART - STICKY */}
        <div className="space-y-8 sticky top-28 z-40 bg-transparent">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input 
              type="text" 
              placeholder="PESQUISAR EQUIPAMENTO OU CÓDIGO..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setVisibleCount(20);
              }}
              className="w-full bg-white border-8 border-white rounded-[4rem] py-12 px-14 text-3xl md:text-4xl font-black outline-none focus:border-indigo-500 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.15)] uppercase placeholder:opacity-20 pr-36"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
              {search && (
                <button 
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:text-rose-500 transition-colors"
                >
                  <X size={32} strokeWidth={4} />
                </button>
              )}
              <div className="bg-indigo-50 p-6 rounded-3xl text-indigo-600 shadow-inner">
                <Search size={48} strokeWidth={4} />
              </div>
            </div>
          </form>

          {/* HISTÓRICO E FILTROS RÁPIDOS */}
          <div className="flex flex-wrap gap-4 items-center overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-3 mr-4">
               <History size={24} className="text-slate-300" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recentes:</span>
            </div>
            {recentSearches.map(term => (
              <button 
                key={term} 
                onClick={() => setSearch(term)}
                className="bg-white px-6 py-3 rounded-2xl border-2 border-white text-[11px] font-black uppercase text-slate-500 hover:border-indigo-500 transition-all shadow-md"
              >
                {term}
              </button>
            ))}
          </div>

          {/* CHIPS DE FILTRO PROFISSIONAL */}
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-[2rem] border-4 border-white shadow-md">
               <Filter size={24} className="text-indigo-600" />
               <select 
                value={activeCategory} 
                onChange={e => setActiveCategory(e.target.value)}
                className="bg-transparent font-black uppercase text-[11px] tracking-widest outline-none cursor-pointer"
               >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
            
            <div className="flex items-center gap-4">
               {[
                 { id: 'Baixo', label: 'Iniciante', icon: Clock3 },
                 { id: 'Médio', label: 'Pleno', icon: Settings },
                 { id: 'Alto', label: 'Especialista', icon: HardHat }
               ].map(level => (
                 <button
                  key={level.id}
                  onClick={() => setActiveComplexity(activeComplexity === level.id ? 'Tudo' : level.id as any)}
                  className={`flex items-center gap-3 px-8 py-5 rounded-[2rem] border-4 transition-all whitespace-nowrap ${activeComplexity === level.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-white hover:border-indigo-500'}`}
                 >
                   <level.icon size={20} strokeWidth={3} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{level.label}</span>
                 </button>
               ))}
            </div>

            <div className="ml-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest">{filteredTasks.length} Registros</span>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE PROCEDIMENTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {displayedTasks.map((task, i) => (
             <button 
              key={task.id} 
              onClick={() => setSelectedTask(task)}
              className="kitchen-card p-10 flex flex-col h-full relative group cursor-pointer overflow-hidden border-4 border-white bg-white animate-in fade-in zoom-in-95 duration-500 text-left"
              style={{ animationDelay: `${(i % 20) * 30}ms` }}
             >
                <div className="space-y-6 flex-1">
                   <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{task.category}</span>
                      <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border-2 ${task.complexity === 'Alto' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {task.complexity}
                      </div>
                   </div>
                   
                   <h3 className="text-3xl font-black text-black leading-none tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">{task.title}</h3>
                   
                   <p className="text-sm font-black text-[#5d4037] opacity-60 uppercase line-clamp-3 leading-tight">
                     {task.description}
                   </p>

                   <div className="pt-6 mt-6 border-t-4 border-[#fdfaf6] flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          {getEnvIcon(task.environment)}
                        </div>
                        <p className="text-[10px] font-black text-black uppercase tracking-tighter">{task.environment}</p>
                      </div>
                      <div className="flex flex-col text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Tempo Est.</p>
                        <p className="text-xl font-black text-black tracking-tighter uppercase">{task.estimatedTime}</p>
                      </div>
                   </div>
                </div>
                <div className="mt-8 w-full h-14 bg-[#fdfaf6] group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all text-indigo-600">
                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">Abrir Procedimento</span>
                   <ChevronRight size={24} className="ml-2" />
                </div>
             </button>
           ))}
        </div>

        {/* FEEDBACK DE BUSCA E IA */}
        <div className="py-20 flex flex-col items-center justify-center gap-10">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <Loader2 size={80} className="text-indigo-600 animate-spin" strokeWidth={3} />
              <p className="text-2xl font-black text-black uppercase tracking-tighter text-center">IA Gerando Manual Técnico...</p>
            </div>
          ) : filteredTasks.length === 0 && search && (
            <div className="bg-white p-20 rounded-[4rem] border-8 border-dashed border-indigo-100 flex flex-col items-center gap-12 w-full max-w-3xl text-center shadow-2xl">
               <AlertTriangle size={120} className="text-amber-500/20" strokeWidth={1} />
               <div className="space-y-4">
                  <h4 className="text-4xl font-black text-black tracking-tighter uppercase">Nenhum Registro Encontrado</h4>
                  <p className="text-xl text-slate-500 font-bold uppercase tracking-tight">Não temos "{search}" em nosso manual local. Deseja que a IA crie um agora?</p>
               </div>
               <Button3D fullWidth size="xl" onClick={handleAISuggestion} color="primary" className="h-28 text-2xl bg-indigo-600">
                  <Sparkles size={36} className="mr-4" /> Gerar Procedimento para {search}
               </Button3D>
            </div>
          )}

          {filteredTasks.length > displayedTasks.length && (
            <div className="flex flex-col items-center gap-4 text-slate-400 animate-bounce">
               <ArrowDownNarrowWide size={48} />
               <p className="text-[10px] font-black uppercase tracking-[0.5em]">Role para carregar mais registros</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Loader simples para reutilização
const Loader2 = ({ size, className, strokeWidth }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Maintenance;
