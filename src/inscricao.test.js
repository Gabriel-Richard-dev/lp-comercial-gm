// node --test src/inscricao.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { paraE164 } from "./inscricao.js";

test("paraE164 monta o número que o backend aceita", () => {
  assert.equal(paraE164("(85) 9 9123-4567"), "+5585991234567"); // celular
  assert.equal(paraE164("(85) 3245-1234"), "+558532451234"); // fixo
  assert.equal(paraE164("85991234567"), "+5585991234567"); // já sem máscara
});

test("paraE164 recusa o que não forma um número brasileiro", () => {
  assert.equal(paraE164(""), null);
  assert.equal(paraE164("(85) 9 9123"), null); // incompleto
  assert.equal(paraE164("859912345678"), null); // dígito a mais
  // sem este null o backend receberia "+55" e gravaria um contato que nunca recebe nada.
  assert.equal(paraE164("abc"), null);
});
