// node --test src/catalogo.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { catalogoDe, arroba, vitrine, descontoPct, fotoDe, termosDeFoto } from "./catalogo.js";
import { MAP_BOXES } from "./map/layout.js";
import { OFERTAS } from "./data.js";

const ocupados = MAP_BOXES.filter((b) => b.status !== "Vago");

// Acento e cedilha viram nada no slug: se alguém mexer no nome do item sem
// rodar `npm run fotos`, a vitrine fica com buraco. Este teste avisa antes.
test("todo item da vitrine tem foto baixada", () => {
  const faltando = termosDeFoto().filter(
    (t) => !existsSync(new URL(`../public${fotoDe(t)}`, import.meta.url))
  );
  assert.deepEqual(faltando, [], "rode: npm run fotos");
});

test("o mesmo box mostra sempre a mesma vitrine", () => {
  const box = ocupados[7];
  assert.deepEqual(catalogoDe(box), catalogoDe(box));
});

test("nenhuma loja aparece sem item, e sem item repetido", () => {
  for (const box of ocupados) {
    const { itens } = catalogoDe(box);
    assert.ok(itens.length > 0, `box ${box.number} sem item`);
    const nomes = new Set(itens.map((i) => i.nome));
    assert.equal(nomes.size, itens.length, `box ${box.number} repetiu item`);
  }
});

test("todo preço sai no formato de etiqueta, em reais", () => {
  for (const box of ocupados) {
    for (const { preco } of catalogoDe(box).itens) {
      assert.match(preco, /^\d+,\d{2}$/, `preço estranho: ${preco}`);
      assert.ok(Number(preco.replace(",", ".")) > 0);
    }
  }
});

test("box vago não inventa loja", () => {
  const vago = MAP_BOXES.find((b) => b.status === "Vago");
  const { itens, redes, oferta } = catalogoDe(vago);
  assert.deepEqual(itens, []);
  assert.equal(redes, null);
  assert.equal(oferta, null);
});

test("a oferta do dia aparece na loja a que pertence", () => {
  // O box 12 tem oferta em data.js. Ela tem que chegar na tela do box 12.
  const box12 = MAP_BOXES.find((b) => b.number === "12");
  assert.equal(catalogoDe(box12).oferta?.box, "12");

  const semOferta = ocupados.find((b) => !catalogoDe(b).oferta);
  assert.ok(semOferta, "alguma loja tem que ficar sem oferta");
});

test("a vitrine geral traz toda loja ocupada, e nenhuma vaga", () => {
  const itens = vitrine(MAP_BOXES);
  const lojas = new Set(itens.map((i) => i.loja));
  assert.equal(lojas.size, ocupados.length);

  const vago = MAP_BOXES.find((b) => b.status === "Vago");
  assert.ok(!itens.some((i) => i.box === vago.number), "box vago entrou na vitrine");
});

test("todo item da vitrine sabe dizer de que loja e box veio", () => {
  for (const i of vitrine(MAP_BOXES)) {
    assert.ok(i.nome && i.preco && i.loja && i.box && i.seg, `item incompleto: ${JSON.stringify(i)}`);
  }
});

test("o desconto sai em % inteiro, com preço de etiqueta", () => {
  assert.equal(descontoPct({ de: "39,90", por: "24,90" }), 38);
  assert.equal(descontoPct({ de: "120,00", por: "89,00" }), 26);
  assert.equal(descontoPct({ de: "1.200,00", por: "600,00" }), 50); // ponto é milhar
  for (const o of OFERTAS) {
    const p = descontoPct(o);
    assert.ok(p > 0 && p < 100, `desconto fora da faixa em ${o.loja}: ${p}%`);
  }
});

test("o @ do perfil perde acento, espaço e pontuação", () => {
  assert.equal(arroba("Salgados da Vovó"), "@salgadosdavovo");
  assert.equal(arroba("Bolsas & Cia"), "@bolsascia");
  assert.equal(arroba("Informática CE"), "@informaticace");
});
