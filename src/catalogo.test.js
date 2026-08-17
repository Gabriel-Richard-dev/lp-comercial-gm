// node --test src/catalogo.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogoDe, arroba } from "./catalogo.js";
import { MAP_BOXES } from "./map/layout.js";

const ocupados = MAP_BOXES.filter((b) => b.status !== "Vago");

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

test("o @ do perfil perde acento, espaço e pontuação", () => {
  assert.equal(arroba("Salgados da Vovó"), "@salgadosdavovo");
  assert.equal(arroba("Bolsas & Cia"), "@bolsascia");
  assert.equal(arroba("Informática CE"), "@informaticace");
});
