// Baixa uma foto por produto para public/fotos/produtos/. Rode de novo depois
// de mexer na lista de itens: pula o que já está baixado.
//
//   npm run fotos
//
// Fonte: miniatura da busca de imagens do Bing — é a foto de catálogo do
// fabricante, a mesma que o Google mostra. O Google em si não serve resultado
// de imagem sem JS nem sem chave da Custom Search API, e bloqueia hotlink.
import { mkdir, writeFile, access } from "node:fs/promises";
import { termosDeFoto, slug } from "../src/catalogo.js";

const DIR = new URL("../public/fotos/produtos/", import.meta.url);
const busca = (t) => `https://tse2.mm.bing.net/th?q=${encodeURIComponent(t)}&w=600&h=450&c=7&p=0`;

await mkdir(DIR, { recursive: true });

let baixadas = 0;
for (const termo of termosDeFoto()) {
  const arquivo = new URL(`${slug(termo)}.jpg`, DIR);
  if (await access(arquivo).then(() => true, () => false)) continue;

  const r = await fetch(busca(termo));
  if (!r.ok) {
    console.error(`✗ ${termo}: HTTP ${r.status}`);
    continue;
  }
  await writeFile(arquivo, Buffer.from(await r.arrayBuffer()));
  console.log(`✓ ${termo}`);
  baixadas++;
}
console.log(`${baixadas} foto(s) nova(s) em public/fotos/produtos/`);
