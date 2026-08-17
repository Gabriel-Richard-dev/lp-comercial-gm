// Saldo de demonstração: derivado do próprio telefone, para o mesmo número
// mostrar sempre o mesmo resultado durante a apresentação.
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

export function saldoDe(tel) {
  const d = String(tel).replace(/\D/g, "");
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
    codigo: d.slice(-6),
    indicados: (h >> 7) % 5,
  };
}
