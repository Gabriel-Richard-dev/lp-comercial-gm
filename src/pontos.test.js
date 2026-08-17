// node --test src/pontos.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { saldoDe } from "./pontos.js";

test("o mesmo número devolve sempre o mesmo saldo", () => {
  const a = saldoDe("(85) 9 9123-4567");
  const b = saldoDe("85991234567"); // mesma pessoa, formatação diferente
  assert.deepEqual(a, b);
});

test("números diferentes não caem todos no mesmo saldo", () => {
  const saldos = new Set(
    ["85991234567", "85998887766", "11987654321", "8532451234"].map((t) => saldoDe(t).saldo)
  );
  assert.ok(saldos.size > 1);
});

test("os campos derivados fecham com o saldo", () => {
  for (const tel of ["85991234567", "85998887766", "8532451234", "11912345678"]) {
    const c = saldoDe(tel);
    assert.ok(c.saldo >= 80 && c.saldo < 500, `saldo fora da faixa: ${c.saldo}`);
    assert.equal(c.premios, Math.floor(c.saldo / 150));
    assert.ok(c.faltam > 0 && c.faltam <= 150);
    assert.ok(c.progresso >= 0 && c.progresso <= 100);
    assert.ok(c.numeros.length >= 1 && c.numeros.length <= 4);
    assert.ok(c.numeros.every((n) => /^\d{6}$/.test(n)), "número da sorte deve ter 6 dígitos");
    assert.equal(c.extrato.length, 5);
    assert.equal(c.codigo.length, 6);
  }
});
