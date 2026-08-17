/**
 * Ponte entre os tokens CSS e o Three.js.
 *
 * O canvas WebGL não enxerga classe do Tailwind, então a cor precisa virar
 * número. Em vez de escrever hexadecimal no meio da cena, lemos a variável do
 * tema — assim uma mudança em `index.css` chega no mapa 3D também, e a
 * auditoria de contraste continua valendo para o que é texto.
 */

/**
 * Pinta a cor num pixel e lê de volta o que saiu.
 *
 * A versão anterior lia `ctx.fillStyle` de volta contando que o navegador
 * devolvesse "#rrggbb". O Chrome atual devolve a cor no espaço em que ela foi
 * escrita — `oklch(0.91 0.002 100)` entra e sai igual —, e o caminho de
 * fallback então lia os três números do oklch como se fossem RGB: o piso
 * `oklch(91% .002 100)` virava `#010064`. A cena inteira ficava num azul quase
 * preto. Ler o pixel devolve sRGB de verdade em qualquer navegador, para
 * qualquer sintaxe de cor que ele saiba analisar.
 */
let ctx = null;
function pixel(valor) {
  ctx ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000000";
  ctx.fillStyle = valor; // valor inválido não muda fillStyle: fica no preto
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data;
}

const cache = new Map();

/** Cor de um token CSS como "#rrggbb". */
export function cssColorHex(nome) {
  if (cache.has(nome)) return cache.get(nome);
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
  let hex;
  if (bruto) {
    const [r, g, b] = pixel(bruto);
    hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  } else {
    console.warn(`[mapa] token ${nome} não encontrado`);
    hex = "#808080";
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
