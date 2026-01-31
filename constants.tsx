
import { Recipe, RecipeCategory, MaintenanceTask, Appliance } from './types';

// GERADOR DE MANUTENÇÃO MASSIVO
const MAINT_CATS = ['Elétrica', 'Hidráulica', 'Alvenaria', 'Pintura', 'Marcenaria', 'Jardinagem', 'Limpeza Técnica'];
const MAINT_SUBS = ['Reparo Rápido', 'Preventiva', 'Corretiva', 'Emergencial', 'Instalação'];
const MAINT_EQUIP = ['Chuveiro', 'Torneira', 'Disjuntor', 'Parede', 'Piso', 'Ar Condicionado', 'Geladeira', 'Portão', 'Telhado', 'Ralo'];

const generateMaintDB = (): MaintenanceTask[] => {
  const db: MaintenanceTask[] = [];
  
  // Tarefas Fixas Reais
  db.push({
    id: 'maint-fixed-1',
    category: 'Hidráulica',
    subcategory: 'Torneiras',
    title: 'Troca de Vedante de Torneira',
    description: 'Resolva o pinga-pinga trocando o vedante interno da torneira da cozinha.',
    complexity: 'Baixo',
    environment: 'Residencial',
    materials: ['Chave Inglesa', 'Vedante Novo'],
    estimatedTime: '20 min',
    professional: 'Morador',
    steps: ['Feche o registro', 'Abra a torneira', 'Troque o vedante']
  });

  // Geração de 2000 itens para busca infinita
  for (let i = 1; i <= 2000; i++) {
    const cat = MAINT_CATS[Math.floor(Math.random() * MAINT_CATS.length)];
    const sub = MAINT_SUBS[Math.floor(Math.random() * MAINT_SUBS.length)];
    const equip = MAINT_EQUIP[Math.floor(Math.random() * MAINT_EQUIP.length)];
    const comp = ['Baixo', 'Médio', 'Alto'][Math.floor(Math.random() * 3)] as any;
    
    db.push({
      id: `maint-gen-${i}`,
      category: cat,
      subcategory: sub,
      title: `${sub} de ${equip} #${i + 100}`,
      description: `Procedimento técnico de ${sub.toLowerCase()} para garantir o funcionamento do(a) ${equip.toLowerCase()} no ambiente.`,
      complexity: comp,
      environment: i % 3 === 0 ? 'Comercial' : 'Residencial',
      materials: ['Ferramentas Básicas', 'EPI'],
      estimatedTime: `${15 + (Math.random() * 120).toFixed(0)} min`,
      professional: comp === 'Alto' ? 'Técnico Especializado' : 'Morador treinado',
      steps: ['Avaliar dano', 'Desligar energia/água', 'Executar reparo', 'Testar sistema']
    });
  }
  return db;
};

// ... (Resto das constantes de receitas mantidas)
const BREAD_SPECTRUM = [
  { sub: 'Pão de Água', price: 'baixo', cost: 2.50, desc: 'O rei da economia. Apenas farinha, água e sal.' },
  { sub: 'Pão de Liquidificador', price: 'baixo', cost: 4.00, desc: 'Rápido, prático e não suja as mãos.' },
  { sub: 'Pão Caseiro da Vovó', price: 'baixo', cost: 5.50, desc: 'Aquele clássico com cheirinho de infância.' },
  { sub: 'Pão de Milho da Roça', price: 'médio', cost: 8.00, desc: 'Amarelinho e perfeito com manteiga derretendo.' },
  { sub: 'Pão de Batata Doces', price: 'médio', cost: 9.50, desc: 'Massa úmida e naturalmente adocicada.' },
  { sub: 'Pão de Leite Ninho', price: 'médio', cost: 12.00, desc: 'Extremamente macio e premium para as crianças.' },
  { sub: 'Focaccia de Ervas Finas', price: 'alto', cost: 25.00, desc: 'Azeite extra virgem e alecrim fresco.' },
  { sub: 'Pão de Levain (Sourdough)', price: 'alto', cost: 35.00, desc: 'Fermentação natural de 48h. Casca crocante.' },
  { sub: 'Brioche de Manteiga Francesa', price: 'alto', cost: 45.00, desc: 'Mais manteiga que farinha. Derrete na boca.' },
  { sub: 'Pão de Nozes e Gorgonzola', price: 'alto', cost: 65.00, desc: 'Sabor intenso para ocasiões especiais.' },
  { sub: 'Pão de Ouro e Trufas Negras', price: 'alto', cost: 250.00, desc: 'O pão mais caro do mundo. Luxo absoluto.' }
];

const CATEGORY_VARIANTS = [
  { 
    cat: 'Sobremesas' as RecipeCategory, 
    subs: ['Bolo', 'Pudim', 'Mousse', 'Pavê', 'Torta Doce'],
    flavors: ['de Chocolate', 'de Cenoura', 'de Fubá', 'de Limão', 'de Morango', 'de Leite Condensado', 'de Maracujá', 'Prestígio', 'Formigueiro']
  },
  { 
    cat: 'Carnes' as RecipeCategory, 
    subs: ['Carne', 'Frango', 'Suíno', 'Peixe'],
    flavors: ['Assado', 'Grelhado', 'ao Molho', 'na Pressão', 'Acebolado', 'ao Forno', 'com Batatas', 'Empanado', 'Strogonoff']
  },
  { 
    cat: 'Massas' as RecipeCategory, 
    subs: ['Espaguete', 'Lasanha', 'Nhoque', 'Penne', 'Ravioli'],
    flavors: ['à Bolonhesa', 'ao Sugo', 'na Manteiga', 'Quatro Queijos', 'ao Pesto', 'com Frango', 'ao Forno']
  }
];

const generateRecipeDatabase = (): Recipe[] => {
  const db: Recipe[] = [];
  let idCounter = 1;

  const classics = [
    { nome: 'Bolo de Chocolate', cat: 'Sobremesas', sub: 'Bolo', cost: 12.50 },
    { nome: 'Bolo de Cenoura com Cobertura', cat: 'Sobremesas', sub: 'Bolo', cost: 15.00 },
    { nome: 'Pudim de Leite Condensado', cat: 'Sobremesas', sub: 'Pudim', cost: 18.00 },
    { nome: 'Arroz com Feijão Perfeito', cat: 'Pratos Principais', sub: 'Brasileiro', cost: 5.00 },
    { nome: 'Strogonoff de Frango Econômico', cat: 'Carnes', sub: 'Frango', cost: 22.00 }
  ];

  classics.forEach(c => {
    db.push({
      id: `classic-${idCounter++}`,
      nome: c.nome,
      categoria: c.cat as RecipeCategory,
      subcategoria: c.sub,
      tipoPreparo: 'Tradicional',
      descricao: `O clássico ${c.nome.toLowerCase()} que todo lar brasileiro ama.`,
      custo: 'baixo',
      custoPorPorcao: c.cost,
      ingredientes: [{ nome: "Ingredientes Base", quantidade: "Q.S." }],
      modo_de_preparo: ["Siga as instruções clássicas da Dona Camila."],
      tempoPreparo: "15 min",
      tempoCozimento: "30 min",
      tempoTotal: "45 min",
      rendimento: "8 porções",
      nivel: 'baixo',
      ocasiao: "Qualquer Hora"
    });
  });

  BREAD_SPECTRUM.forEach(bread => {
    const methods = ['Tradicional', 'Na Airfryer', 'Sem Sovar', 'Rápido', 'Artesanal'];
    methods.forEach(method => {
      db.push({
        id: `rec-bread-${idCounter++}`,
        nome: `${bread.sub} ${method}`,
        categoria: 'Pães e Fermentados',
        subcategoria: bread.sub,
        tipoPreparo: method,
        descricao: bread.desc,
        custo: bread.price as any,
        custoPorPorcao: bread.cost,
        ingredientes: [
          { nome: "Farinha de Trigo", quantidade: "500g" },
          { nome: "Fermento", quantidade: "10g" },
          { nome: "Segredo da Dona Camila", quantidade: "1 pitada" }
        ],
        modo_de_preparo: [
          "Misture os ingredientes secos.",
          "Adicione água morna aos poucos.",
          "Deixe descansar até dobrar de volume.",
          "Asse em forno médio até dourar."
        ],
        tempoPreparo: "30 min",
        tempoCozimento: "1h",
        tempoTotal: "1h 30min",
        rendimento: "1 pão grande",
        nivel: bread.price === 'alto' ? 'alto' : 'baixo',
        ocasiao: "Café da Manhã / Lanche"
      });
    });
  });

  while (db.length < 1500) {
    const variant = CATEGORY_VARIANTS[Math.floor(Math.random() * CATEGORY_VARIANTS.length)];
    const sub = variant.subs[Math.floor(Math.random() * variant.subs.length)];
    const flavor = variant.flavors[Math.floor(Math.random() * variant.flavors.length)];
    const method = ['Especial', 'da Vovó', 'Econômico', 'Rápido', 'de Domingo'][Math.floor(Math.random() * 5)];
    db.push({
      id: `rec-var-${idCounter++}`,
      nome: `${sub} ${flavor} ${method}`,
      categoria: variant.cat,
      subcategoria: sub,
      tipoPreparo: method,
      descricao: `Uma deliciosa variação de ${sub.toLowerCase()} ${flavor.toLowerCase()}.`,
      custo: 'médio',
      custoPorPorcao: 12.00 + (Math.random() * 20),
      ingredientes: [{ nome: "Ingredientes Selecionados", quantidade: "Q.S." }],
      modo_de_preparo: ["Prepare com carinho e dedicação."],
      tempoPreparo: "10 min",
      tempoCozimento: "30 min",
      tempoTotal: "40 min",
      rendimento: "4 porções",
      nivel: 'médio',
      ocasiao: "Refeição em Família"
    });
  }
  return db;
};

export const INITIAL_RECIPES = generateRecipeDatabase();
export const MAINTENANCE_GUIDES: MaintenanceTask[] = generateMaintDB();

export const APPLIANCES: Appliance[] = [
  { id: 'init-0', name: 'Geladeira', watts: 150, label: 'Geladeira Frost Free', hoursPerDay: 24, daysPerWeek: [0, 1, 2, 3, 4, 5, 6] }
];

export const SEASONAL_DATA: Record<string, { fruits: string[], veggies: string[] }> = {
  'Janeiro': { fruits: ['Abacaxi', 'Melancia'], veggies: ['Abóbora', 'Tomate'] },
  'Fevereiro': { fruits: ['Maçã', 'Abacate'], veggies: ['Milho', 'Pepino'] },
  'Março': { fruits: ['Banana', 'Goiaba'], veggies: ['Beringela', 'Jiló'] },
  'Abril': { fruits: ['Tangerina', 'Maçã Fuji'], veggies: ['Abóbora', 'Chuchu'] },
  'Maio': { fruits: ['Pinhão', 'Jaca'], veggies: ['Mandioquinha', 'Batata Doce'] },
  'Junho': { fruits: ['Caju', 'Kiwi'], veggies: ['Milho', 'Mandioca'] },
  'Julho': { fruits: ['Morango', 'Cereja'], veggies: ['Couve', 'Espinafre'] },
  'Agosto': { fruits: ['Mamão', 'Laranja'], veggies: ['Beterraba', 'Cenoura'] },
  'Setembro': { fruits: ['Jabuticaba', 'Pitanga'], veggies: ['Brócolis', 'Couve-flor'] },
  'Outubro': { fruits: ['Acerola', 'Caju'], veggies: ['Abobrinha', 'Pepino'] },
  'Novembro': { fruits: ['Amora', 'Pêssego'], veggies: ['Vagem', 'Aspargos'] },
  'Dezembro': { fruits: ['Lichia', 'Cereja'], veggies: ['Rabanete', 'Tomate Cereja'] }
};

export const COLORS = {
  background: '#F8FAFC',
  primary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  indigo: { 600: '#4F46E5' }
};
