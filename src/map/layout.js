import { BOXES as SHOPS } from "../data";

/** Paleta e categorias iguais às do mapa CPC Geraldo Machado 3D. */
export const CATEGORIES = {
  vestuario: { label: "Vestuário", color: 0xe879a9, hex: "#e879a9" },
  alimentacao: { label: "Alimentação", color: 0x34d399, hex: "#34d399" },
  eletronicos: { label: "Eletrônicos", color: 0x60a5fa, hex: "#60a5fa" },
  acessorios: { label: "Acessórios", color: 0xfbbf24, hex: "#fbbf24" },
  servicos: { label: "Serviços", color: 0xa78bfa, hex: "#a78bfa" },
};

const SEG_TO_CAT = {
  Modas: "vestuario",
  Calçados: "vestuario",
  Acessórios: "acessorios",
  Beleza: "servicos",
  Eletrônicos: "eletronicos",
  Alimentação: "alimentacao",
  Serviços: "servicos",
};

const CATEGORY_KEYS = Object.keys(CATEGORIES);

/**
 * Mesma planta do cpc-geraldo-machado-3d:
 * 2 alas, 5 fileiras × 7 colunas = 70 boxes.
 * Os 60 nomes do SiMove ocupam 01–60; o restante fica vago.
 */
export function generateBoxes() {
  const boxes = [];
  let id = 1;

  const BOX_W = 2.6;
  const BOX_D = 2.4;
  const BOX_H = 2.3;
  const GAP = 0.35;
  const AISLE_W = 2.8;
  const ROWS = 5;
  const COLS = 7;

  const wingDepth = ROWS * BOX_D + (ROWS - 1) * GAP;
  const wingWidth = COLS * BOX_W + (COLS - 1) * GAP;
  const totalWidth = wingWidth * 2 + AISLE_W;
  const originX = -totalWidth / 2;
  const originZ = -wingDepth / 2;

  function addBox(wing, row, col) {
    const shop = SHOPS[id - 1];
    const category = shop
      ? SEG_TO_CAT[shop.seg] || "servicos"
      : CATEGORY_KEYS[id % CATEGORY_KEYS.length];
    const aisle =
      wing === "oeste"
        ? `Ala Oeste · Fileira ${row + 1}`
        : `Ala Leste · Fileira ${row + 1}`;

    const xOffset =
      wing === "oeste"
        ? originX + col * (BOX_W + GAP) + BOX_W / 2
        : originX + wingWidth + AISLE_W + col * (BOX_W + GAP) + BOX_W / 2;

    const z = originZ + row * (BOX_D + GAP) + BOX_D / 2;

    boxes.push({
      id,
      number: String(id).padStart(2, "0"),
      name: shop?.name ?? "Box vago",
      seg: shop?.seg ?? null,
      s: shop?.s ?? null,
      category,
      aisle,
      wing,
      row: row + 1,
      col: col + 1,
      status: shop ? "Ocupado" : "Vago",
      area: `${(BOX_W * BOX_D).toFixed(1)} m²`,
      position: { x: xOffset, y: BOX_H / 2, z },
      size: { w: BOX_W, h: BOX_H, d: BOX_D },
    });
    id++;
  }

  for (const wing of ["oeste", "leste"]) {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        addBox(wing, row, col);
      }
    }
  }

  return {
    boxes,
    dimensions: {
      totalWidth,
      totalDepth: wingDepth,
      boxW: BOX_W,
      boxD: BOX_D,
      boxH: BOX_H,
      aisleW: AISLE_W,
      wingWidth,
      wingDepth,
      originX,
      originZ,
    },
  };
}

export const { boxes: MAP_BOXES, dimensions: LAYOUT } = generateBoxes();
