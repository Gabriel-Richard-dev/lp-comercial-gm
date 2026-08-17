// node --test src/catalogo.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  catalogoDe, arroba, vitrine, descontoPct, fotoDe, termosDeFoto,
  normalizar, combina, indexarItens, indexarLojas, cupons,
} from "./catalogo.js";
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

test("a busca acha quem digita sem acento e em qualquer caixa", () => {
  const itens = indexarItens(vitrine(MAP_BOXES));
  const achou = (termo) =>
    itens.filter((i) => combina(i, { seg: "Tudo", termo: normalizar(termo), lojasDoCupom: null }));

  assert.ok(achou("sandalia").length > 0, "sem acento não achou");
  assert.equal(achou("sandalia").length, achou("Sandália").length);
  assert.equal(achou("calca").length, achou("calça").length);
  assert.equal(achou("CHINELO").length, achou("chinelo").length);
  assert.equal(achou("nao existe isso no centro").length, 0);
});

test("a busca de loja acha pelo nome, pelo segmento e pelo que ela vende", () => {
  const lojas = indexarLojas(
    MAP_BOXES.filter((b) => b.status !== "Vago").map((b) => ({ ...b, ...catalogoDe(b) }))
  );
  const acha = (termo) => lojas.filter((l) => combina(l, { termo: normalizar(termo) }));

  const alvo = lojas[0];
  assert.ok(acha(alvo.name).some((l) => l.number === alvo.number), "não achou pelo nome");
  assert.ok(acha(alvo.seg).length > 0, "não achou pelo segmento");
  assert.ok(acha(alvo.itens[0].nome).some((l) => l.number === alvo.number), "não achou pelo produto");
});

test("cupom nenhum não esvazia a lista, e cupom ligado corta pelas lojas dele", () => {
  const itens = indexarItens(vitrine(MAP_BOXES));
  const todos = itens.filter((i) => combina(i, { lojasDoCupom: null }));
  assert.equal(todos.length, itens.length);

  const [cupom] = cupons(OFERTAS);
  const doCupom = itens.filter((i) => combina(i, { lojasDoCupom: new Set(cupom.lojas) }));
  assert.ok(doCupom.length > 0 && doCupom.length < itens.length);
  assert.ok(doCupom.every((i) => cupom.lojas.includes(i.loja)));
});

test("segmento e termo se somam em vez de brigar", () => {
  const itens = indexarItens(vitrine(MAP_BOXES));
  const seg = itens[0].seg;
  const doSeg = itens.filter((i) => combina(i, { seg }));
  const doSegComTermo = itens.filter((i) => combina(i, { seg, termo: normalizar(itens[0].nome) }));

  assert.ok(doSeg.length > 0);
  assert.ok(doSegComTermo.length <= doSeg.length);
  assert.ok(doSegComTermo.every((i) => i.seg === seg));
});

test("o @ do perfil perde acento, espaço e pontuação", () => {
  assert.equal(arroba("Salgados da Vovó"), "@salgadosdavovo");
  assert.equal(arroba("Bolsas & Cia"), "@bolsascia");
  assert.equal(arroba("Informática CE"), "@informaticace");
});
