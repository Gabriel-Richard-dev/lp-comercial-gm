// node --test src/phone.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { maskPhone, validPhone, validEmail, maskCPF, validCPF } from "./phone.js";

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

test("validEmail pega erro de digitação", () => {
  assert.ok(validEmail("maria@gmail.com"));
  assert.ok(validEmail("  maria.silva@aluno.ifce.edu.br  "), "espaço nas pontas");
  assert.ok(!validEmail(""), "vazio não passa: o campo opcional é checado antes");
  assert.ok(!validEmail("maria@gmail"), "sem domínio");
  assert.ok(!validEmail("mariagmail.com"), "sem arroba");
  assert.ok(!validEmail("maria @gmail.com"), "espaço no meio");
});

test("maskCPF formata enquanto digita", () => {
  assert.equal(maskCPF("529"), "529");
  assert.equal(maskCPF("5299822"), "529.982.2");
  assert.equal(maskCPF("52998224725"), "529.982.247-25");
  assert.equal(maskCPF("529982247259999"), "529.982.247-25"); // corta o excesso
  assert.equal(maskCPF("529.982.247-25"), "529.982.247-25"); // idempotente
});

test("validCPF confere os dígitos verificadores", () => {
  assert.ok(validCPF("529.982.247-25"));
  assert.ok(validCPF("11144477735"));
  assert.ok(!validCPF(""));
  assert.ok(!validCPF("529982247"), "curto demais");
  assert.ok(!validCPF("52998224724"), "último dígito trocado");
  assert.ok(!validCPF("52998224735"), "penúltimo dígito trocado");
  assert.ok(!validCPF("11111111111"), "todos iguais passa na conta, mas não é CPF");
});

test("validPhone rejeita o que quebraria o disparo", () => {
  assert.ok(!validPhone(""));
  assert.ok(!validPhone("991234567"), "sem DDD");
  assert.ok(!validPhone("(05) 9 9123-4567"), "DDD abaixo de 11");
  assert.ok(!validPhone("85891234567"), "11 dígitos sem o 9 do celular");
  assert.ok(!validPhone("859912345678"), "dígitos demais");
});
