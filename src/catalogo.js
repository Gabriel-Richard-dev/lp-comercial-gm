// Catálogo e redes de cada loja, para a apresentação.
//
// Nenhum dos 60 permissionários cadastrou produto ou perfil ainda, então o
// conteúdo é derivado do próprio número do box: o mesmo box mostra sempre a
// mesma vitrine durante a demonstração, e nenhuma loja aparece vazia. Mesmo
// procedimento do saldo em pontos.js.
//
// Trocar por consulta ao cadastro do permissionário quando houver backend: a
// forma do retorno (itens, oferta, redes) é a que a tela já consome.

import { OFERTAS } from "./data.js";

function hash(s) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Preço termina em 0,90 / 0,50 / 0,00 porque é assim que se etiqueta no Centro.
const FINAIS = [0.9, 0.5, 0.0];

/** [nome do item, piso, teto] — faixa de preço praticada em cada segmento. */
const ITENS = {
  Modas: [
    ["Blusa de malha", 25, 60], ["Vestido midi", 60, 120], ["Calça jeans", 70, 140],
    ["Short sarja", 35, 70], ["Camisa social", 55, 110], ["Conjunto infantil", 40, 80],
    ["Saia plissada", 45, 90], ["Jaqueta jeans", 90, 170], ["Pijama", 30, 65],
  ],
  Calçados: [
    ["Chinelo de dedo", 20, 45], ["Tênis casual", 90, 180], ["Sandália rasteira", 35, 75],
    ["Sapatilha", 45, 90], ["Bota cano curto", 120, 220], ["Sapato social", 100, 190],
    ["Papete", 50, 100], ["Meia par", 8, 18],
  ],
  Acessórios: [
    ["Bolsa transversal", 55, 120], ["Cinto de couro", 35, 80], ["Chapéu de palha", 25, 55],
    ["Óculos de sol", 40, 95], ["Relógio digital", 70, 160], ["Colar folheado", 30, 75],
    ["Brinco argola", 15, 40], ["Carteira", 30, 70],
  ],
  Beleza: [
    ["Hidratante corporal", 25, 55], ["Perfume 100 ml", 70, 160], ["Kit de esmalte", 20, 45],
    ["Escova progressiva", 60, 130], ["Corte de cabelo", 25, 50], ["Barba completa", 20, 40],
    ["Manicure e pedicure", 30, 60], ["Máscara capilar", 30, 70],
  ],
  Eletrônicos: [
    ["Fone bluetooth", 45, 110], ["Capinha de celular", 15, 40], ["Carregador turbo", 30, 70],
    ["Caixa de som", 90, 200], ["Película 3D", 15, 35], ["Cabo USB-C", 12, 30],
    ["Troca de tela", 120, 280], ["Power bank", 60, 140],
  ],
  Alimentação: [
    ["Coxinha de frango", 5, 9], ["Açaí 500 ml", 12, 22], ["Tapioca recheada", 8, 16],
    ["Pastel assado", 6, 12], ["Café coado", 3, 7], ["Suco natural 400 ml", 7, 14],
    ["Almoço executivo", 15, 28], ["Bolo de rolo fatia", 6, 12],
  ],
  Serviços: [
    ["Cópia de chave", 12, 30], ["Ajuste de bainha", 15, 35], ["Impressão colorida", 2, 6],
    ["Encadernação", 8, 20], ["Conserto de zíper", 15, 35], ["Plastificação", 5, 12],
    ["Foto 3x4", 10, 20],
  ],
};

function preco(faixa, h) {
  const [, piso, teto] = faixa;
  const inteiro = piso + (h % Math.max(1, teto - piso));
  const valor = inteiro + FINAIS[h % FINAIS.length];
  return valor.toFixed(2).replace(".", ",");
}

/** "Sandália rasteira" → "sandalia-rasteira". Sem acento, sem espaço. */
export function slug(texto, sep = "-") {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tira o acento que o NFD separou da letra
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, sep)
    .replace(/^-|-$/g, "");
}

/** @ do perfil, a partir do nome da loja: "Salgados da Vovó" → "@salgadosdavovo" */
export function arroba(nome) {
  return "@" + slug(nome, "").slice(0, 22);
}

/**
 * Vitrine de um box do mapa.
 *
 * Box vago não tem vitrine: devolve a estrutura vazia para a tela mostrar o
 * aviso de disponível em vez de inventar loja onde não há.
 */
/**
 * A mesma vitrine do totem, virada do avesso: em vez de loja a loja, todos os
 * itens de todos os boxes numa lista só, que é como o cliente procura produto.
 *
 * Box vago não entra, porque catalogoDe não devolve item para ele.
 */
export function vitrine(boxes) {
  return boxes.flatMap((box) =>
    catalogoDe(box).itens.map((item) => ({
      ...item,
      box: box.number,
      loja: box.name,
      seg: box.seg,
      setor: box.s,
    }))
  );
}

/**
 * Desconto da oferta em %, a partir dos preços de data.js, que vêm escritos
 * como na etiqueta ("1.299,90"): o ponto é milhar e a vírgula é decimal.
 */
export function descontoPct({ de, por }) {
  const n = (v) => Number(String(v).replace(/\./g, "").replace(",", "."));
  return Math.round((1 - n(por) / n(de)) * 100);
}

/** Termo de busca de cada categoria: "Modas" sozinho devolve capa de revista. */
export const FOTO_SEG = {
  Modas: "arara de roupas femininas loja",
  Calçados: "tênis e sandálias em loja",
  Acessórios: "bolsas e bijuterias vitrine",
  Beleza: "cosméticos e perfumes",
  Eletrônicos: "fones e acessórios de celular",
  Alimentação: "salgados e lanches",
  Serviços: "chaveiro e consertos",
};

/**
 * Foto do produto. Os arquivos são baixados uma vez por `npm run fotos` e ficam
 * em public/, então a vitrine não depende de host de terceiro na hora da
 * demonstração — e o totem funciona sem internet.
 *
 * Trocar pela foto do permissionário quando houver upload: basta sobrescrever o
 * arquivo com o mesmo nome.
 */
export function fotoDe(termo) {
  return `/fotos/produtos/${slug(termo)}.jpg`;
}

/** Tudo que precisa de foto: item de vitrine, item de oferta e categoria. */
export function termosDeFoto() {
  return [
    ...new Set([
      ...Object.values(ITENS).flatMap((lista) => lista.map(([nome]) => nome)),
      ...OFERTAS.map((o) => o.item),
      ...Object.values(FOTO_SEG),
    ]),
  ];
}

export function catalogoDe(box) {
  if (!box || box.status === "Vago" || !box.seg) {
    return { itens: [], oferta: null, redes: null };
  }

  const lista = ITENS[box.seg] ?? ITENS.Serviços;
  const h = hash(box.number + box.name);

  // Embaralha os índices e pega os primeiros: garante item sem repetição, o que
  // um passo fixo não garante (passo 4 numa lista de 8 devolve o mesmo par).
  const ordem = lista.map((_, i) => i);
  for (let i = ordem.length - 1; i > 0; i--) {
    const j = (h >> (i % 16)) % (i + 1);
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  const itens = ordem.slice(0, Math.min(5, lista.length)).map((idx, i) => {
    const faixa = lista[idx];
    return { nome: faixa[0], preco: preco(faixa, h + i * 977) };
  });

  return {
    itens,
    oferta: OFERTAS.find((o) => o.box === box.number) ?? null,
    redes: {
      instagram: arroba(box.name),
      facebook: arroba(box.name),
      // Sem número: ninguém cadastrou WhatsApp ainda, e inventar 11 dígitos
      // aqui é arriscar imprimir a linha de uma pessoa de verdade no totem.
      whatsapp: null,
    },
  };
}
