// node --test src/phone.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { maskPhone, validPhone } from "./phone.js";

test("maskPhone formata enquanto digita", () => {
  assert.equal(maskPhone("8"), "8");
  assert.equal(maskPhone("85"), "85");
  assert.equal(maskPhone("85999"), "(85) 999");
  assert.equal(maskPhone("8532451234"), "(85) 3245-1234"); // fixo
  assert.equal(maskPhone("85991234567"), "(85) 9 9123-4567"); // celular
  assert.equal(maskPhone("85991234567999"), "(85) 9 9123-4567"); // corta o excesso
  assert.equal(maskPhone("(85) 9 9123-4567"), "(85) 9 9123-4567"); // idempotente
});

test("validPhone aceita fixo e celular com DDD", () => {
  assert.ok(validPhone("(85) 9 9123-4567"));
  assert.ok(validPhone("8532451234"));
});

test("validPhone rejeita o que quebraria o disparo", () => {
  assert.ok(!validPhone(""));
  assert.ok(!validPhone("991234567"), "sem DDD");
  assert.ok(!validPhone("(05) 9 9123-4567"), "DDD abaixo de 11");
  assert.ok(!validPhone("85891234567"), "11 dígitos sem o 9 do celular");
  assert.ok(!validPhone("859912345678"), "dígitos demais");
});
