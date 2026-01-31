
export type RecipeCategory = 
  | 'Entradas e Petiscos' | 'Pratos Principais' | 'Massas' | 'Carnes' | 'Aves' 
  | 'Peixes e Frutos do Mar' | 'Vegetarianas' | 'Veganas' | 'Saladas' 
  | 'Sopas e Caldos' | 'Lanches e Sanduíches' | 'Café da Manhã' | 'Brunch' 
  | 'Sobremesas' | 'Bolos e Tortas' | 'Pães e Fermentados' | 'Doces e Confeitaria' 
  | 'Bebidas Quentes' | 'Bebidas Frias' | 'Sucos e Smoothies' | 'Drinks e Coquetéis' 
  | 'Receitas Fitness' | 'Receitas Low Carb' | 'Receitas Keto' | 'Receitas Sem Glúten' 
  | 'Receitas Sem Lactose' | 'Receitas Infantis' | 'Receitas Econômicas' 
  | 'Receitas Gourmet' | 'Receitas Regionais Brasileiras' | 'Receitas Internacionais' 
  | 'Receitas para Datas Comemorativas';

export type DifficultyLevel = 'baixo' | 'médio' | 'alto';
export type CostLevel = 'baixo' | 'médio' | 'alto';

export interface Ingredient {
  nome: string;
  quantidade: string;
  substitutoBarato?: string;
}

export interface Recipe {
  id: string | number;
  nome: string;
  categoria: RecipeCategory;
  subcategoria: string;
  tipoPreparo: string;
  descricao: string;
  ingredientes: Ingredient[];
  modo_de_preparo: string[];
  tempoPreparo: string;
  tempoCozimento: string;
  tempoTotal: string;
  rendimento: string;
  nivel: DifficultyLevel;
  ocasiao: string;
  custo: CostLevel;
  nutricional?: string;
  substituicoes?: string[];
  dicasChef?: string[];
  armazenamento?: string;
  tags?: string[];
  custoPorPorcao?: number;
}

export interface Appliance {
  id: string;
  name: string;
  label?: string;
  watts: number;
  hoursPerDay: number;
  daysPerWeek: number[]; // 0 = Domingo, 6 = Sábado
}

export interface WaterConfig {
  consumptionM3: number;
  pricePerM3: number;
}

export interface GasConfig {
  purchaseDate: string;
  capacityKg: number;
  dailyConsumptionKg: number;
  level: number; // 0-100
  alertEnabled: boolean;
}

export type MaintenanceComplexity = 'Baixo' | 'Médio' | 'Alto';
export type MaintenanceEnvironment = 'Residencial' | 'Comercial' | 'Industrial';

export interface MaintenanceTask {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  complexity: MaintenanceComplexity;
  environment: MaintenanceEnvironment;
  materials: string[];
  estimatedTime: string;
  professional: string;
  safety?: string;
  steps?: string[];
  youtubeUrl?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'gain' | 'expense';
  category: 'mercado' | 'renda_extra' | 'contas' | 'outros';
  date: string;
}
