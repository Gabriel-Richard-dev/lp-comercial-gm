// Todo o texto e os dados da página moram aqui.

export const BRAND = {
  name: "SIMOVE Maracanaú",
  short: "SIMOVE",
  tagline: "modas e artigos",
  place: "Centro Público Comercial Geraldo Machado",
  address: "Rua Manoel Pereira, Centro, próximo à Praça da Estação",
  city: "Maracanaú, Ceará",
};

export const PHOTOS = {
  entrada: {
    src: "/fotos/cpc-entrada.webp",
    alt: "Entrada do Centro Público Comercial Geraldo Machado, com clientes caminhando entre os boxes em dia de sol",
    caption: "A entrada do CPC Geraldo Machado, na Rua Manoel Pereira.",
  },
  fachada: {
    src: "/fotos/cpc-fachada.jpg",
    alt: "Fachada do Centro Público Comercial Geraldo Machado com a placa de identificação",
    caption: "Fachada na Rua Manoel Pereira, no Centro de Maracanaú.",
  },
  mercado: {
    src: "/fotos/cpc-reinauguracao.jpg",
    alt: "Movimento de clientes e permissionários no Centro Público Comercial",
    caption: "O movimento do Centro já existe. O que falta é quem venha de fora do bairro.",
  },
  musica: {
    src: "/fotos/musica.webp",
    alt: "Banda tocando ao vivo em espaço público de Maracanaú",
    caption: "Programação musical fixa nos espaços públicos, promovida pela Sala do Empreendedor e pela Secult.",
  },
  totem: {
    src: "/fotos/totem.webp",
    alt: "Totem em pé no corredor do centro comercial, com a tela inicial do SIMOVE",
    caption: "Simulação do totem na entrada, com a tela inicial do SIMOVE.",
  },
  credit: "Fotos: Prefeitura de Maracanaú.",
};

export const HERO = {
  eyebrow: "Centro Público Comercial Geraldo Machado",
  title: ["Sessenta boxes", "num só", "lugar."],
  sub: "O Centro tem 1.200 m² de comércio no meio de Maracanaú e nenhuma vitrine fora dele. O SIMOVE coloca as 60 lojas no celular de quem mora aqui.",
  ctas: [
    { label: "Ver o que o SIMOVE faz", href: "#plataforma", primary: true },
    { label: "Compra Premiada", href: "#premiada" },
  ],
};

export const STATS = [
  { value: 60, suffix: "", label: "boxes em funcionamento", note: "modas, calçados, artigos e alimentação" },
  { value: 1200, suffix: " m²", label: "de área comercial", note: "reaberto em outubro de 2023" },
  { value: 251, suffix: " mil", label: "moradores em Maracanaú", note: "terceira maior cidade da Região Metropolitana" },
  { value: 4, suffix: "", label: "setores sinalizados por cor", note: "azul, amarelo, vermelho e verde" },
];

export const SEGMENTS = [
  "Modas", "Calçados", "Acessórios", "Bolsas", "Cosméticos", "Perfumaria",
  "Eletrônicos", "Papelaria", "Cama e mesa", "Bijuteria", "Conserto de celular", "Alimentação",
];

export const PROBLEMS = [
  {
    n: "01",
    title: "Quem não passa na porta não sabe que existe",
    body: "O Centro não aparece em busca nenhuma. Quem mora a dez minutos daqui não tem como saber que existe um box vendendo o que ela procura.",
  },
  {
    n: "02",
    title: "A visita acaba e o contato acaba junto",
    body: "O cliente compra, sai e nunca mais recebe notícia. Não há cadastro, não há aviso de promoção, não há motivo para voltar na semana seguinte.",
  },
  {
    n: "03",
    title: "A gestão é feita no papel",
    body: "Horário de abertura e reclamação de cliente ficam em caderno e planilha. A Secretaria não tem número para mostrar.",
  },
];

/* Os 11 recursos, agrupados por objetivo. */
export const PILLARS = [
  {
    id: "atrair",
    n: "01",
    title: "Trazer gente nova",
    lead: "Sem verba de mídia.",
    features: [
      {
        icon: "ticket",
        title: "Cupom de influenciador",
        body: "Cada influenciador de Maracanaú recebe um código próprio e acompanha quantas vendas trouxe. O ranking entre eles rende publicação espontânea.",
      },
      {
        icon: "tag",
        title: "Promoção do dia",
        body: "Cada box publica uma oferta que vale até o meio-dia. Aos poucos o cliente pega o hábito de conferir antes de sair de casa.",
      },
      {
        icon: "zap",
        title: "Aviso no WhatsApp",
        badge: "Canal principal",
        body: "O cliente deixa o número na landing ou no próprio box e passa a receber as ofertas. Nada para instalar, nada para pagar de anúncio.",
      },
      {
        icon: "music",
        title: "Agenda de eventos",
        body: "A programação musical dos espaços públicos já existe e é da Secult. Ligada ao aplicativo, ela vira fluxo com data marcada.",
      },
    ],
  },
  {
    id: "fidelizar",
    n: "02",
    title: "Fazer voltar",
    lead: "E trazer alguém junto.",
    features: [
      {
        icon: "star",
        title: "Pontos por compra",
        body: "O cliente paga no Pix do box e envia o comprovante. O identificador da transação serve de chave única, então o mesmo comprovante não pontua duas vezes.",
      },
      {
        icon: "share",
        title: "Indicação",
        badge: "Crescimento",
        body: "Cada cliente tem um link. Quando a pessoa indicada compra, os dois recebem pontos.",
      },
      {
        icon: "gift",
        title: "Compra Premiada",
        badge: "Carro-chefe",
        body: "Compra acima do valor mínimo no mês concorre ao sorteio. O prêmio é comprado dos próprios permissionários.",
      },
    ],
  },
  {
    id: "vender",
    n: "03",
    title: "Vender além do balcão",
    lead: "O box tem três metros de frente. A venda não precisa ter.",
    features: [
      {
        icon: "spark",
        title: "Social media interno",
        body: "Jovens aprendizes contratados pela prefeitura produzem o conteúdo dos 60 boxes. O programa social sustenta a vitrine.",
      },
      {
        icon: "pin",
        title: "Mapa e totem",
        body: "O totem da entrada mostra onde fica cada box. Digitalizado, ele passa a responder pelo produto: o cliente escolhe o que procura e o setor acende.",
      },
    ],
  },
  {
    id: "gerir",
    n: "04",
    title: "Dar número à Secretaria",
    lead: "O que hoje é caderno.",
    features: [
      {
        icon: "clock",
        title: "Horários",
        body: "Horário declarado de cada box, do jeito que o cliente vê antes de sair de casa. A Secretaria passa a saber quem abre quando.",
      },
      {
        icon: "stars",
        title: "Avaliação por loja",
        body: "O cliente dá a nota. A média vira destaque na vitrine para quem vai bem e aviso antecipado para quem vai mal.",
      },
    ],
  },
];

/* --- Planta do térreo: quatro blocos de 15 boxes em volta da circulação central. --- */
export const SECTORS = {
  azul: { label: "Setor Azul", hex: "var(--color-setor-azul)" },
  amarelo: { label: "Setor Amarelo", hex: "var(--color-setor-amarelo)" },
  vermelho: { label: "Setor Vermelho", hex: "var(--color-setor-vermelho)" },
  verde: { label: "Setor Verde", hex: "var(--color-setor-verde)" },
};

export const SEG_FILTERS = ["Modas", "Calçados", "Acessórios", "Beleza", "Eletrônicos", "Alimentação"];

const mk = (start, s, list) =>
  list.map((x, i) => ({ n: String(start + i).padStart(2, "0"), s, name: x[0], seg: x[1] }));

export const BOXES = [
  ...mk(1, "azul", [
    ["Moda Cristal", "Modas"], ["Jeans do Norte", "Modas"], ["Elegance Fashion", "Modas"],
    ["Modinha da Ana", "Modas"], ["Baby Kids", "Modas"], ["Enxoval & Lar", "Modas"],
    ["Vestir Bem", "Modas"], ["Malharia Ceará", "Modas"], ["Íntima Charme", "Modas"],
    ["Bolsas & Cia", "Acessórios"], ["Cintos do Zé", "Acessórios"], ["Chapelaria Sol", "Acessórios"],
    ["Bijoux da Rê", "Acessórios"], ["Relojoaria Tempo", "Acessórios"], ["Óculos Center", "Acessórios"],
  ]),
  ...mk(16, "amarelo", [
    ["TecCell Assistência", "Serviços"], ["Som & Fone", "Eletrônicos"], ["Eletro Popular", "Eletrônicos"],
    ["Capinhas Já", "Eletrônicos"], ["Games Maracanaú", "Eletrônicos"], ["Recarga Center", "Eletrônicos"],
    ["Informática CE", "Eletrônicos"], ["Bella Cosméticos", "Beleza"], ["Perfumaria Luz", "Beleza"],
    ["Esmalteria Glow", "Beleza"], ["Salão da Bia", "Beleza"], ["Barbearia Central", "Beleza"],
    ["Papelaria Saber", "Serviços"], ["Costura Rápida", "Serviços"], ["Chaveiro Express", "Serviços"],
  ]),
  ...mk(31, "vermelho", [
    ["Cantinho do Açaí", "Alimentação"], ["Tapioca da Dona Zefa", "Alimentação"], ["Pastel do Centro", "Alimentação"],
    ["Café Estação", "Alimentação"], ["Sucos Tropical", "Alimentação"], ["Salgados da Vovó", "Alimentação"],
    ["Doce Sabor", "Alimentação"], ["Almoço Caseiro", "Alimentação"], ["Sorvete Gelado", "Alimentação"],
    ["Pisante Bom", "Calçados"], ["Chinelaria", "Calçados"], ["Tênis & Cia", "Calçados"],
    ["Sandália Feliz", "Calçados"], ["Sapataria Nordeste", "Calçados"], ["Bota & Couro", "Calçados"],
  ]),
  ...mk(46, "verde", [
    ["Modas Rebeca", "Modas"], ["Fashion Jovem", "Modas"], ["Alfaiataria Silva", "Modas"],
    ["Praia & Verão", "Modas"], ["Uniforme Escolar", "Modas"], ["Tecidos Maracanaú", "Modas"],
    ["Mochilas & Malas", "Acessórios"], ["Pulseiras Arte", "Acessórios"], ["Prata Fina", "Acessórios"],
    ["Cama Mesa Banho", "Modas"], ["Cortinas Lar", "Modas"], ["Utilidades Popular", "Modas"],
    ["Calçado Infantil", "Calçados"], ["Sapatilha Chic", "Calçados"], ["Meia Meia", "Calçados"],
  ]),
];

export const MAP = {
  n: "Totem",
  title: "A placa da entrada responde perguntas.",
  lead: "O totem traz a planta, os quatro setores e o código para baixar o aplicativo. Ligado ao SIMOVE, ele deixa de ser uma placa.",
  body: "O cliente escolhe o que procura e os boxes que vendem aquilo acendem na planta. Quem não quis instalar nada é atendido ali mesmo, de pé, na porta.",
  bullets: [
    ["Para quem chega sem o aplicativo", "o totem responde na entrada, sem cadastro."],
    ["Para quem já usa", "a mesma planta vai no bolso, com o box marcado."],
    ["Para a Secretaria", "cada toque registra o que procuraram e não acharam."],
  ],
  note: "Planta baseada no totem proposto pela equipe. Os nomes de loja são exemplos.",
};

export const PRIZE = {
  n: "Compra Premiada",
  title: "Comprou acima do mínimo no mês, está no sorteio.",
  body: "É o motivo para gastar aqui em vez de gastar no shopping. Como o prêmio é comprado dos próprios permissionários, o dinheiro do programa fica dentro do Centro.",
  ticket: ["0", "4", "2", "8", "1", "7"],
  points: [
    ["Uma compra", "acima do valor mínimo garante um número."],
    ["Cada R$ 50 a mais", "vale um número extra no mesmo sorteio."],
    ["Um sorteio por mês", "com resultado atrelado à Loteria Federal."],
  ],
  note: "Sorteio é promoção comercial e depende de autorização prévia da Secretaria de Prêmios e Apostas do Ministério da Fazenda (Lei 5.768/71), pedida por um CNPJ promotor. A associação de permissionários é a candidata natural. Levar isso pronto para a banca mostra que a operação foi pensada.",
};

export const STEPS = [
  {
    k: "01",
    title: "O influenciador publica",
    body: "Cupom com código próprio nas mãos de quem já fala com Maracanaú. Cada resgate é contado e aparece no ranking.",
  },
  {
    k: "02",
    title: "O aviso chega no WhatsApp",
    body: "Quem deixou o número recebe a oferta do dia e a agenda de eventos no aplicativo que já usa.",
  },
  {
    k: "03",
    title: "A compra vira ponto",
    body: "Pix no código do box, comprovante enviado, ponto na conta. Passou do valor mínimo, ganha o número da Compra Premiada.",
  },
  {
    k: "04",
    title: "O cliente indica",
    body: "O link pessoal rende pontos para os dois quando a pessoa indicada compra.",
  },
  {
    k: "05",
    title: "A Secretaria acompanha",
    body: "Horários, avaliação por loja, cupons resgatados e movimento por hora, num painel só.",
  },
];

export const EVENTS = {
  n: "Eventos",
  title: "A programação já existe. Falta avisar.",
  body: "A Sala do Empreendedor e a Secult mantêm música ao vivo nos espaços públicos do município. Hoje quem descobre é quem estava passando. Com a agenda dentro do SIMOVE, o show de sábado vira promoção de sábado, e o box sabe com uma semana de antecedência que vai ter movimento.",
};

export const AUDIENCES = [
  {
    who: "Cliente",
    items: [
      "Vitrine e mapa dos 60 boxes",
      "Cupom de influenciador da cidade",
      "Pontos que viram desconto na próxima compra",
      "Link de indicação que rende para os dois",
      "Compra Premiada todo mês",
    ],
  },
  {
    who: "Permissionário",
    items: [
      "Tudo pelo WhatsApp, sem instalar aplicativo",
      "Conteúdo feito pelos jovens aprendizes",
      "Avaliação boa vira destaque na vitrine",
    ],
  },
  {
    who: "Secretaria",
    items: [
      "Horário declarado e conferido",
      "Nota do cliente por box",
      "Jovens aprendizes com trabalho comprovado",
      "Relatório pronto para prestação de contas",
    ],
  },
];

export const ROADMAP = [
  { phase: "Hackathon", label: "MVP", items: ["Vitrine e mapa", "Pontos com Pix", "Disparo no WhatsApp"] },
  { phase: "90 dias", label: "Piloto", items: ["10 boxes", "5 influenciadores", "Primeira Compra Premiada"] },
  { phase: "6 meses", label: "Escala", items: ["Os 60 boxes", "Avaliação por loja", "Painel da Secretaria"] },
  { phase: "12 meses", label: "Replicação", items: ["Outros centros públicos da região", "Agenda cultural integrada", "Compra coletiva"] },
];

/* --- conteúdo do totem (exemplos para a demo) --- */
export const OFERTAS = [
  { box: "12", loja: "Chapelaria Sol", item: "Chapéu de palha", de: "39,90", por: "24,90", cupom: "LARISSA10" },
  { box: "41", loja: "Chinelaria", item: "Chinelo masculino", de: "45,00", por: "29,90", cupom: null },
  { box: "03", loja: "Elegance Fashion", item: "Vestido midi", de: "89,90", por: "59,90", cupom: "JOAO15" },
  { box: "17", loja: "Som & Fone", item: "Fone bluetooth", de: "79,00", por: "49,90", cupom: null },
  { box: "23", loja: "Bella Cosméticos", item: "Kit hidratante", de: "52,00", por: "35,00", cupom: "LARISSA10" },
  { box: "55", loja: "Prata Fina", item: "Corrente 45 cm", de: "120,00", por: "89,00", cupom: null },
];

export const AGENDA = [
  { dia: "SEX", data: "22", hora: "18h", titulo: "Forró pé de serra", local: "Praça da Estação", tipo: "Música" },
  { dia: "SÁB", data: "23", hora: "10h", titulo: "Feira de artesanato", local: "Alameda do Centro", tipo: "Feira" },
  { dia: "SÁB", data: "23", hora: "17h", titulo: "Samba do Centro", local: "Praça da Estação", tipo: "Música" },
  { dia: "DOM", data: "24", hora: "16h", titulo: "Roda de capoeira", local: "Praça José Augusto", tipo: "Cultura" },
];

export const MOTIVOS = [
  "Box fechado no horário de funcionamento",
  "Reclamação sobre atendimento",
  "Elogio a um permissionário",
  "Sugestão para o Centro",
  "Problema na estrutura (luz, água, limpeza)",
];

export const OUVIDORIA_TIPOS = [
  { id: "reclamacao", label: "Reclamação", hint: "Atendimento, box fechado ou cobrança" },
  { id: "elogio", label: "Elogio", hint: "Um permissionário ou o Centro" },
  { id: "sugestao", label: "Sugestão", hint: "Ideia para melhorar o espaço" },
  { id: "denuncia", label: "Denúncia", hint: "Irregularidade, sem se identificar" },
  { id: "info", label: "Informação", hint: "Horário, documentos, funcionamento" },
];

export const FORM = {
  title: "Receba as ofertas do Centro no WhatsApp",
  sub: "Oferta do dia, cupom de influenciador e agenda de eventos. Sem aplicativo e sem custo.",
};
