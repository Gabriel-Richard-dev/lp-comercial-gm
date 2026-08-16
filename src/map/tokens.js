/**
 * Ponte entre os tokens CSS e o Three.js.
 *
 * O canvas WebGL não enxerga classe do Tailwind, então a cor precisa virar
 * número. Em vez de escrever hexadecimal no meio da cena, lemos a variável do
 * tema — assim uma mudança em `index.css` chega no mapa 3D também, e a
 * auditoria de contraste continua valendo para o que é texto.
 */

// O navegador resolve oklch() para rgb quando atribuímos a fillStyle.
let ctx = null;
function resolver(valor) {
  ctx ??= document.createElement("canvas").getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillStyle = valor;
  return ctx.fillStyle; // "#rrggbb" ou "rgba(...)"
}

const cache = new Map();

/** Cor de um token CSS como "#rrggbb". */
export function cssColorHex(nome) {
  if (cache.has(nome)) return cache.get(nome);
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  let hex = bruto ? resolver(bruto) : "";
  if (!hex.startsWith("#")) {
    // rgb(a) → hex, ou token ausente
    const n = hex.match(/\d+(\.\d+)?/g);
    hex = n
      ? "#" + n.slice(0, 3).map((v) => Math.round(+v).toString(16).padStart(2, "0")).join("")
      : (console.warn(`[mapa] token ${nome} não encontrado`), "#808080");
  }
  cache.set(nome, hex);
  return hex;
}

/** Cor de um token CSS como número, para materiais e luzes do Three.js. */
export function cssColorInt(nome) {
  return parseInt(cssColorHex(nome).slice(1), 16);
}

/** Esvazia o cache — usar se o tema mudar em tempo de execução. */
export function limparCacheDeCor() {
  cache.clear();
}
