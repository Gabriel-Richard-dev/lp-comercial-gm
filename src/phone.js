const onlyDigits = (s) => s.replace(/\D/g, "");

export function maskPhone(v) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

// DDD válido (11-99), 10 ou 11 dígitos; celular (11) começa com 9.
export function validPhone(v) {
  const d = onlyDigits(v);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}

export function maskCPF(v) {
  const d = onlyDigits(v).slice(0, 11);
  const bloco = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean).join(".");
  return d.length > 9 ? `${bloco}-${d.slice(9)}` : bloco;
}

// Dígitos verificadores de verdade: o CPF é a chave dos pontos, um número
// digitado errado abriria o saldo de outra pessoa.
export function validCPF(v) {
  const d = onlyDigits(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = (n) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    return ((soma * 10) % 11) % 10;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

// Só pega erro de digitação: quem valida e-mail de verdade é o disparo.
// ponytail: regex simples, trocar por confirmação por link se o retorno subir.
export function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
