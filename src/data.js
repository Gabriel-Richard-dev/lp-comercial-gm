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
    caption: "Movimento de fim de tarde no corredor central do Centro.",
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
  title: ["Sessenta boxes", "num só lugar."],
  sub: "As 60 lojas do Centro no seu celular: oferta do dia, cupom de desconto e pontos que voltam na próxima compra. Tudo pelo WhatsApp.",
  ctas: [
    { label: "Receber as ofertas", href: "#cta", primary: true },
    { label: "Ver a vitrine das lojas", href: "/catalogo" },
  ],
};

export const STATS = [
  { value: 60, suffix: "", label: "boxes em funcionamento", note: "modas, calçados, artigos e alimentação" },
  { value: 1200, suffix: " m²", label: "de área comercial", note: "reaberto em outubro de 2023" },
  { value: 4, suffix: "", label: "setores sinalizados por cor", note: "azul, amarelo, vermelho e verde" },
];

export const SEGMENTS = [
  "Modas", "Calçados", "Acessórios", "Bolsas", "Cosméticos", "Perfumaria",
  "Eletrônicos", "Papelaria", "Cama e mesa", "Bijuteria", "Conserto de celular", "Alimentação",
];

export const PILLARS = [
  {
    id: "antes",
    n: "01",
    title: "Antes de sair de casa",
    lead: "Você já sabe o que tem hoje.",
    features: [
      {
        icon: "tag",
        title: "Promoção do dia",
        body: "Cada box publica uma oferta que vale até o meio-dia.",
      },
      {
        icon: "success",
        title: "Aviso no WhatsApp",
        badge: "Canal principal",
        body: "Deixe seu número e receba as ofertas. Nada para instalar.",
      },
      {
        icon: "ticket",
        title: "Cupom de influenciador",
        body: "O código de quem você já segue em Maracanaú vale desconto no box.",
      },
      {
        icon: "music",
        title: "Agenda de eventos",
        body: "Show, feira e roda de samba no Centro, com data e hora.",
      },
    ],
  },
  {
    id: "compra",
    n: "02",
    title: "A cada compra",
    lead: "O que você gasta aqui volta.",
    features: [
      {
        icon: "star",
        title: "Pontos por compra",
        body: "Pague no Pix do box e envie o comprovante. Os pontos viram desconto na próxima.",
      },
      {
        icon: "share",
        title: "Indicação",
        badge: "Para os dois",
        body: "Você tem um link. Quando a pessoa indicada compra, os dois ganham pontos.",
      },
      {
        icon: "gift",
        title: "Compra Premiada",
        badge: "Todo mês",
        body: "Compra acima do valor mínimo concorre ao sorteio do mês.",
      },
    ],
  },
  {
    id: "achar",
    n: "03",
    title: "Na hora de achar o box",
    lead: "São 60 boxes em quatro setores.",
    features: [
      {
        icon: "pin",
        title: "Mapa e totem",
        body: "Escolha o que procura no totem da entrada e o setor acende na planta.",
      },
      {
        icon: "spark",
        title: "Vitrine das lojas",
        body: "Foto, preço e contato de cada uma das 60 lojas.",
      },
      {
        icon: "clock",
        title: "Horários",
        body: "O horário de cada box, atualizado por quem abre a porta.",
      },
      {
        icon: "stars",
        title: "Avaliação por loja",
        body: "A nota de quem já comprou, visível na vitrine.",
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
  lead: "Escolha o que procura e os boxes que vendem aquilo acendem na planta. De pé, na entrada, sem cadastro e sem instalar nada.",
  bullets: [
    ["Sem o aplicativo", "o totem responde ali mesmo."],
    ["Com o aplicativo", "a mesma planta vai no bolso, com o box já marcado."],
  ],
  note: "Simulação do totem. Os nomes de loja são exemplos.",
};

export const PRIZE = {
  n: "Compra Premiada",
  title: "Comprou acima do mínimo no mês, está no sorteio.",
  body: "Um sorteio por mês, com prêmio comprado nos próprios boxes do Centro.",
  ticket: ["0", "4", "2", "8", "1", "7"],
  points: [
    ["Uma compra", "acima do valor mínimo garante um número."],
    ["Cada R$ 50 a mais", "vale um número extra no mesmo sorteio."],
    ["Um sorteio por mês", "com resultado atrelado à Loteria Federal."],
  ],
  note: "Promoção comercial sujeita a autorização prévia do Ministério da Fazenda. Regulamento completo no lançamento.",
};

export const STEPS = [
  {
    k: "01",
    title: "A oferta chega",
    body: "Oferta do dia, cupom e agenda de eventos no WhatsApp que você já usa.",
  },
  {
    k: "02",
    title: "Você escolhe o box",
    body: "A vitrine e o mapa mostram quem vende o que você procura, e onde fica.",
  },
  {
    k: "03",
    title: "A compra vira ponto",
    body: "Pix no código do box, comprovante enviado, ponto na conta.",
  },
  {
    k: "04",
    title: "O ponto volta como desconto",
    body: "Acima do valor mínimo você ainda ganha um número da Compra Premiada.",
  },
];

export const EVENTS = {
  n: "Eventos",
  title: "A programação já existe. Falta avisar.",
  body: "Música ao vivo e feira nos espaços públicos do Centro, pela Sala do Empreendedor e pela Secult. Com a agenda dentro do SIMOVE, você fica sabendo antes — e o show de sábado vira passeio de sábado.",
};

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
  title: "Receba as ofertas do Centro no WhatsApp ou por e-mail",
  sub: "Oferta do dia, cupom de influenciador e agenda de eventos. Sem aplicativo e sem custo.",
};
