// node --test src/pontos.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { saldoDe } from "./pontos.js";

const CPFS = ["52998224725", "11144477735", "39053344705", "12345678909"];

test("o mesmo CPF devolve sempre o mesmo saldo", () => {
  const a = saldoDe("529.982.247-25");
  const b = saldoDe("52998224725"); // mesma pessoa, formatação diferente
  assert.deepEqual(a, b);
});

test("CPFs diferentes não caem todos no mesmo saldo", () => {
  const saldos = new Set(CPFS.map((c) => saldoDe(c).saldo));
  assert.ok(saldos.size > 1);
});

test("os campos derivados fecham com o saldo", () => {
  for (const cpf of CPFS) {
    const c = saldoDe(cpf);
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

test("o link de indicação não carrega o CPF", () => {
  for (const cpf of CPFS) assert.ok(!cpf.includes(saldoDe(cpf).codigo), `código vazou dígitos do CPF: ${cpf}`);
});
