import { Exercise } from '../types/habitlock';

export const INITIAL_L5_EXERCISES: Exercise[] = [
  {
    id: 'pelvic-tilt',
    name: 'Báscula Pélvica (Tilt Posterior)',
    targetMuscle: 'Transverso do Abdômen e Pelve',
    biomechanicsCue: 'Achatar a curva da lombar contra o colchonete soltando o ar pelo abdômen ("umbigo nas costas").',
    contraindicationNote: 'Não levantar o quadril do solo nem prender a respiração (evitar Valsalva forte).',
    sets: 3,
    repsOrDuration: '10 repetições (5s cada)',
    restSeconds: 30,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Deite-se de barriga para cima com joelhos dobrados e pés firmes no chão.',
      'Coloque a mão na curva da lombar para sentir o espaço.',
      'Expire suavemente e rode a pelve para trás, achatando esse espaço e colando a lombar ao solo.',
      'Mantenha a contração profunda por 5 segundos respirando normalmente.',
      'Retorne à posição neutra e repita por 10 vezes.'
    ]
  },
  {
    id: 'bird-dog',
    name: 'Perdigueiro (Bird-Dog)',
    targetMuscle: 'Multífidos, Glúteos e Core Profundo',
    biomechanicsCue: 'Braço e perna opostos sobem em linha reta paralela ao chão. Imagine um copo d\'água equilibrado na lombar.',
    contraindicationNote: 'NÃO elevar a perna acima do tronco para evitar hiperextensão/cisalhamento na L5.',
    sets: 3,
    repsOrDuration: '8 reps por lado (pausa 3s)',
    restSeconds: 45,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Fique na posição de 4 apoios (mãos sob ombros, joelhos sob os quadris).',
      'Mantenha a coluna em posição neutra e olhar voltado para o chão.',
      'Estenda o braço direito à frente e a perna esquerda para trás sem rodar o quadril.',
      'Segure no topo por 3 segundos sem permitir que a barriga caia.',
      'Volte devagar e alterne o lado de forma controlada.'
    ]
  },
  {
    id: 'glute-bridge',
    name: 'Ponte de Glúteos com Pés Alinhados',
    targetMuscle: 'Glúteo Máximo e Isquiotibiais',
    biomechanicsCue: 'Empurre a força pelos calcanhares. No topo, trave os glúteos mantendo as costelas para dentro.',
    contraindicationNote: 'Não estufar o abdômen nem hiperestender a lombar acima da linha reta tronco-joelho.',
    sets: 3,
    repsOrDuration: '12 repetições',
    restSeconds: 40,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Deite-se de costas, joelhos a 90 graus e calcanhares afastados na largura dos quadris.',
      'Contraia os glúteos e levante o quadril empurrando pelo solo.',
      'Forme uma linha diagonal limpa do joelho até o ombro.',
      'Segure 2 segundos no pico da contração sentindo apenas o glúteo trabalhar.',
      'Desça de maneira lenta e suave sem despencar no chão.'
    ]
  },
  {
    id: 'modified-knee-plank',
    name: 'Prancha Modificada no Joelho',
    targetMuscle: 'Cadeia Anterior e Reto Abdominal Isométrico',
    biomechanicsCue: 'Cotovelos alinhados aos ombros, joelhos apoiados. Empurre os antebraços contra o chão para afastar as escápulas.',
    contraindicationNote: 'Se a lombar começar a ceder ou doer, interrompa a série imediatamente.',
    sets: 3,
    repsOrDuration: '25 a 30 segundos',
    restSeconds: 45,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Apoie os antebraços no chão na largura dos ombros.',
      'Deixe os joelhos apoiados no colchonete com o corpo em linha reta dos joelhos à cabeça.',
      'Ative o abdômen e os glúteos firmemente.',
      'Respire de forma controlada mantendo a tensão estabilizadora no centro.',
      'Descanse 45 segundos entre cada série.'
    ]
  },
  {
    id: 'deadbug',
    name: 'Deadbug (Inseto Morto Controlado)',
    targetMuscle: 'Transverso e Estabilizadores Anti-Extensão',
    biomechanicsCue: 'A lombar NÃO pode descolar do chão. Se descolar, diminua o quanto estica a perna.',
    contraindicationNote: 'Movimento lento e cadenciado. Proibido movimentos bruscos ou com impulso.',
    sets: 3,
    repsOrDuration: '8 reps alternadas',
    restSeconds: 40,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Deite-se de barriga para cima, braços erguidos para o teto e joelhos a 90 graus.',
      'Pressione a coluna lombar contra o solo.',
      'Abaixe lentamente o braço direito para trás e estique a perna esquerda à frente quase até o chão.',
      'Volte à posição inicial com controle e repita com braço esquerdo e perna direita.'
    ]
  },
  {
    id: 'hamstring-decompression',
    name: 'Descompressão Posterior com Faixa/Toalha',
    targetMuscle: 'Cadeia Posterior e Alívio Ciático',
    biomechanicsCue: 'Cabeça e coluna apoiadas. Puxe a perna suavemente até sentir alongar a coxa sem arquear a coluna.',
    contraindicationNote: 'NUNCA force a flexão anterior do tronco sentado (que aumenta a pressão no disco L5).',
    sets: 2,
    repsOrDuration: '30s cada perna',
    restSeconds: 30,
    completed: false,
    difficulty: 'Seguro Lombar',
    instructions: [
      'Deite-se no chão. Passe uma toalha ou faixa na sola de um dos pés.',
      'Estenda suavemente a perna para cima até sentir o alongamento da parte de trás da coxa.',
      'Mantenha a cabeça e a coluna confortavelmente no colchonete.',
      'Respire fundo e relaxe os ombros durante os 30 segundos.'
    ]
  }
];

export const FORBIDDEN_EXERCISES_WARNINGS = [
  'Proibido agachamento livre ou no Smith com barra nos ombros (carga axial compressiva na L5).',
  'Proibido levantamento terra pesado ou leg press com flexão excessiva de quadril.',
  'Proibido desenvolvimento de ombros com halteres acima da cabeça em pé.',
  'Proibido corrida, saltos, corda e exercícios de impacto até autorização médica.'
];
