// node --test src/map/layout.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT, MAP_BOXES, MARCADOR } from "./layout.js";

test("o anel de seleção cabe no vão entre dois boxes", () => {
  // O anel é desenhado para fora da pegada do box. Se a espessura passar de
  // metade do vão, o anel de um box encosta no do vizinho e deixa de responder
  // "qual deles eu cliquei".
  assert.ok(
    MARCADOR.espessura <= LAYOUT.gap / 2,
    `espessura ${MARCADOR.espessura} não cabe em gap/2 = ${LAYOUT.gap / 2}`
  );
});

test("boxes vizinhos ficam longe o bastante para os anéis não se tocarem", () => {
  const alcance = { x: LAYOUT.boxW + MARCADOR.espessura * 2, z: LAYOUT.boxD + MARCADOR.espessura * 2 };

  // Dois da mesma fileira, colunas seguidas: só o vão os separa. É o par mais
  // apertado da planta, então basta ele passar.
  const a = MAP_BOXES.find((b) => b.wing === "oeste" && b.row === 1 && b.col === 1);
  const b = MAP_BOXES.find((b) => b.wing === "oeste" && b.row === 1 && b.col === 2);
  assert.ok(Math.abs(a.position.x - b.position.x) >= alcance.x);

  const c = MAP_BOXES.find((b) => b.wing === "oeste" && b.row === 2 && b.col === 1);
  assert.ok(Math.abs(a.position.z - c.position.z) >= alcance.z);
});

test("todo box tem posição e tamanho que a cena consegue desenhar", () => {
  for (const box of MAP_BOXES) {
    for (const v of [box.position.x, box.position.z, box.size.w, box.size.d, box.size.h]) {
      assert.ok(Number.isFinite(v), `valor não finito no box ${box.number}`);
    }
  }
});
