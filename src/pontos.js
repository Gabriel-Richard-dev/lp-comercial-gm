// Saldo de demonstração: a conta de pontos é da pessoa, e a pessoa é o CPF —
// é o que o box digita na hora da compra e o que não muda quando ela troca de
// número. Derivado do próprio CPF para o mesmo documento mostrar sempre o
// mesmo resultado durante a apresentação.
// Trocar por consulta ao histórico de Pix confirmado quando houver backend.

const PREMIO = 150; // pontos por prêmio pequeno (desconto na próxima compra)

function hash(s) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const LOJAS = [
  ["12", "Chapelaria Sol", "Compra"],
  ["41", "Chinelaria", "Compra"],
  ["03", "Elegance Fashion", "Compra"],
  ["17", "Som & Fone", "Compra"],
  ["41", "Chinelaria", "Troca por desconto"],
  ["23", "Bella Cosméticos", "Compra"],
];

export function saldoDe(cpf) {
  const d = String(cpf).replace(/\D/g, "");
  const h = hash(d);

  const saldo = 80 + (h % 420);
  const numeros = Array.from({ length: 1 + ((h >> 3) % 4) }, (_, i) =>
    String((h >> (i * 4)) % 1000000).padStart(6, "0")
  );

  const extrato = [];
  for (let i = 0; i < 5; i++) {
    const [box, loja, tipo] = LOJAS[(h >> (i * 3)) % LOJAS.length];
    const troca = tipo !== "Compra" && i === 2;
    extrato.push({
      box,
      titulo: troca ? `Troca por desconto · ${loja}` : `Compra no ${loja}`,
      data: `${String(1 + ((h >> (i * 5)) % 28)).padStart(2, "0")}/08/2026`,
      pts: troca ? -PREMIO : 10 + ((h >> (i * 2)) % 60),
    });
  }

  return {
    saldo,
    premios: Math.floor(saldo / PREMIO),
    faltam: PREMIO - (saldo % PREMIO),
    progresso: Math.round(((saldo % PREMIO) / PREMIO) * 100),
    numeros,
    extrato,
    codigo: String(h % 1000000).padStart(6, "0"), // do hash, não do CPF: o link de indicação é público
    indicados: (h >> 7) % 5,
  };
}
