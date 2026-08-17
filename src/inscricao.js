// Ligação do formulário de /cadastro com o backend (httpAction do Convex).
//
// Sem VITE_CONVEX_SITE_URL a página continua sendo a demonstração de antes: valida,
// mostra a tela de sucesso e não manda nada. É o que deixa o preview publicável antes do
// backend estar apontado, sem um formulário que falha na cara de quem preenche.

const DDI_BRASIL = "55";

// O endpoint responde no domínio .convex.site (httpActions), nunca no .convex.cloud.
const env = import.meta.env ?? {};
export const BACKEND_URL = (env.VITE_CONVEX_SITE_URL ?? "").replace(/\/$/, "");
export const ORG_SLUG = env.VITE_ORG_SLUG ?? "cpc-geraldo-machado";

export const temBackend = () => BACKEND_URL !== "";

/** O formulário coleta número brasileiro mascarado; o backend só aceita E.164. `null`
 *  quando não dá para formar um número — validPhone já barrou antes, isto é a rede. */
export function paraE164(telefoneBr) {
  const digitos = String(telefoneBr).replace(/\D/g, "");
  if (digitos.length !== 10 && digitos.length !== 11) return null;

  return `+${DDI_BRASIL}${digitos}`;
}

// O backend devolve código, não frase: quem escreve o texto de erro é quem conhece o
// público da página.
const MENSAGEM_DO_CODIGO = {
  telefone_invalido: "Confira o DDD e o número do WhatsApp.",
  email_invalido: "Confira o e-mail digitado.",
  organizacao_invalida: "Cadastro indisponível agora. Tente de novo em alguns minutos.",
  box_invalido: "Cadastro indisponível agora. Tente de novo em alguns minutos.",
  invalid_payload: "Confira os dados e tente de novo.",
  server_misconfigured: "Cadastro indisponível agora. Tente de novo em alguns minutos.",
};

const FALHA_DE_REDE =
  "Não foi possível enviar agora. Verifique sua conexão e tente de novo.";

/** `{ ok: true }` ou `{ ok: false, erro }` — a página precisa dizer o que houve, e uma
 *  exceção subindo daqui viraria tela branca no meio do cadastro. */
export async function enviarCadastro({ nome, tel, email }) {
  const telefone = paraE164(tel);
  if (telefone === null) return { ok: false, erro: MENSAGEM_DO_CODIGO.telefone_invalido };

  try {
    const resposta = await fetch(`${BACKEND_URL}/publico/inscricoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationSlug: ORG_SLUG,
        telefone,
        nome: nome.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
      }),
    });

    if (resposta.ok) return { ok: true };

    const corpo = await resposta.json().catch(() => ({}));

    return { ok: false, erro: MENSAGEM_DO_CODIGO[corpo.code] ?? FALHA_DE_REDE };
  } catch {
    return { ok: false, erro: FALHA_DE_REDE };
  }
}
