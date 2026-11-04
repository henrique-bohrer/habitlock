import { MealSuggestion, NutritionCheckItem } from '../types/habitlock';

export const DAILY_MEALS: MealSuggestion[] = [
  {
    timeLabel: 'Café da Manhã (Anti-inflamatório)',
    name: 'Ovos Caipiras com Chia & Fruta Fibrosa',
    description: '2 ovos mexidos no fio de azeite de oliva extra virgem com orégano e cúrcuma, acompanhados de 1 fatia de mamão com 1 colher de sobremesa de sementes de chia e café sem açúcar.',
    protein: '~15g',
    caloriesApprox: '~290 kcal',
    satietyIndex: 'Alta'
  },
  {
    timeLabel: 'Almoço (Saciedade & Proteína Magra)',
    name: 'Filé de Peito de Frango ou Peixe com Fibras',
    description: '150g de peito de frango grelhado ou tilápia, 3 colheres de sopa de arroz integral, 1 concha rasa de feijão carioca e salada verde farta (rúcula, alface, pepino) com azeite.',
    protein: '~42g',
    caloriesApprox: '~460 kcal',
    satietyIndex: 'Muito Alta'
  },
  {
    timeLabel: 'Lanche da Tarde (Proteção Muscular)',
    name: 'Iogurte Natural com Aveia e Oleaginosas',
    description: '170g de iogurte natural desnatado / grego zero com 1 colher de farelo de aveia e 3 castanhas-do-pará (ricas em selênio e gorduras anti-inflamatórias).',
    protein: '~14g',
    caloriesApprox: '~210 kcal',
    satietyIndex: 'Alta'
  },
  {
    timeLabel: 'Jantar (Leve e Sacietógeno)',
    name: 'Omelete de Claras com Vegetais Refogados',
    description: '1 ovo inteiro + 2 claras batidas com espinafre, tomate picado e abobrinha em cubos refogada no alho, finalizado com ervas finas.',
    protein: '~22g',
    caloriesApprox: '~240 kcal',
    satietyIndex: 'Alta'
  }
];

export const INITIAL_NUTRITION_CHECKLIST: NutritionCheckItem[] = [
  {
    id: 'chk-protein',
    label: 'Meta de Proteína Magra Atingida (~1.6 a 1.8g/kg)',
    checked: false,
    tip: 'Frango, peixe, ovos ou iogurte em todas as refeições preservam a massa magra durante o déficit calórico.'
  },
  {
    id: 'chk-deficit',
    label: 'Déficit Calórico Respeitado (Sem beliscos)',
    checked: false,
    tip: 'Cerca de 300 a 400 kcal abaixo do gasto energético para queima de gordura sem fadiga.'
  },
  {
    id: 'chk-antiinflammatory',
    label: 'Alimentos Anti-inflamatórios Incluídos',
    checked: false,
    tip: 'Azeite de oliva, cúrcuma, chia e folhas verdes ajudam no combate à inflamação no disco intervertebral L5.'
  },
  {
    id: 'chk-no-ultraprocessed',
    label: 'Zero Ultraprocessados e Açúcar Líquido',
    checked: false,
    tip: 'Evitou refrigerantes, biscoitos, frituras e doces inflamatórios.'
  }
];
