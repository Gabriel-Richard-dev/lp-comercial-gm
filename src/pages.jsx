import { useState } from "react";
import { BOXES, SECTORS } from "./data";
import { Icon, FakeQR, Shell } from "./ui";
import { maskPhone, validPhone, validEmail, maskCPF, validCPF } from "./phone";
import { saldoDe } from "./pontos";

const campo = "campo";
const rotulo = "rotulo";

const INTERESSES = [
  "Ofertas do dia",
  "Cupons de influenciador",
  "Compra Premiada",
  "Eventos e shows",
  "Novidades das lojas",
];

const BAIRROS = [
  "Centro", "Jereissati", "Pajuçara", "Novo Maracanaú", "Timbó", "Piratininga",
  "Acaracuzinho", "Alto Alegre", "Parque Luzardo Viana", "Outro bairro", "Outra cidade",
];

/* ============================== /cadastro ============================== */
export function CadastroPage() {
  const [f, setF] = useState({ nome: "", cpf: "", tel: "", email: "", bairro: "", interesses: [...INTERESSES], aceite: false });
  const [erros, setErros] = useState({});
  const [pronto, setPronto] = useState(false);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const toggleInteresse = (i) =>
    set("interesses", f.interesses.includes(i) ? f.interesses.filter((x) => x !== i) : [...f.interesses, i]);

  const enviar = (e) => {
    e.preventDefault();
    const novos = {};
    if (f.nome.trim().length < 2) novos.nome = "Escreva seu nome.";
    if (!validCPF(f.cpf)) novos.cpf = "CPF inválido. Confira os 11 dígitos.";
    if (!validPhone(f.tel)) novos.tel = "Informe DDD e número, como (85) 9 9999-9999.";
    if (f.email && !validEmail(f.email)) novos.email = "E-mail inválido. Confira se tem @ e o domínio.";
    if (f.interesses.length === 0) novos.interesses = "Escolha pelo menos um tipo de aviso.";
    if (!f.aceite) novos.aceite = "É preciso concordar em receber as mensagens.";
    setErros(novos);
    if (Object.keys(novos).length) return;
    // sem backend: trocar por POST no webhook do WhatsApp Business.
    setPronto(true);
  };

  if (pronto)
    return (
      <Shell>
        <div className="mx-auto max-w-xl bg-card p-8 hairline">
          <div className="grid h-12 w-12 place-items-center bg-success text-success-foreground">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight">
            Cadastro feito, {f.nome.trim().split(" ")[0]}.
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            As mensagens vão para <strong className="text-foreground">{f.tel}</strong>
            {f.email && <> e para <strong className="text-foreground">{f.email.trim()}</strong></>}. Você recebe no
            máximo uma por dia e sai quando quiser respondendo <strong className="text-foreground">SAIR</strong>
            {f.email && " ou pelo link de descadastro do e-mail"}.
          </p>

          <div className="rule mt-8 pt-6">
            <p className={rotulo}>Você vai receber</p>
            <ul className="mt-3 space-y-2">
              {f.interesses.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="rule mt-8 flex flex-wrap gap-3 pt-6">
            <a href="/pontos" className="btn btn-primary">
              Ver meus pontos
            </a>
            <a href="/" className="btn btn-outline">
              Voltar ao início
            </a>
          </div>

          <p className="caption mt-8">
            Nesta demonstração nada é enviado de verdade e nenhum dado sai do seu navegador.
          </p>
        </div>
      </Shell>
    );

  return (
    <Shell foto>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-success">
            <Icon name="success" className="h-4 w-4" /> WhatsApp
          </p>
          <h1 className="mt-5 font-display text-secao font-bold leading-[1.05]">
            Receba as ofertas do Centro no seu WhatsApp ou por e-mail.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Sem aplicativo para instalar e sem custo. Uma mensagem por dia, no máximo, com o que interessa
            para você.
          </p>

          <div className="rule mt-10 pt-6">
            {[
              ["Oferta do dia", "os boxes publicam até as 10h, você recebe na hora."],
              ["Cupom de influenciador", "código de quem você já segue aqui na cidade."],
              ["Compra Premiada", "aviso quando você entra no sorteio do mês."],
            ].map(([t, d]) => (
              <p key={t} className="rule py-3 text-sm leading-relaxed first:border-t-0 first:pt-0">
                <strong>{t}</strong>, <span className="text-muted-foreground">{d}</span>
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={enviar} noValidate className="bg-card p-6 hairline sm:p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="nome" className={rotulo}>Nome</label>
              <input
                id="nome"
                value={f.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Como quer ser chamado"
                autoComplete="given-name"
                aria-invalid={!!erros.nome}
                className={`mt-2 ${campo}`}
              />
              {erros.nome && <p role="alert" className="mt-1.5 text-sm text-destructive">{erros.nome}</p>}
            </div>

            <div>
              <label htmlFor="cpf" className={rotulo}>CPF</label>
              <input
                id="cpf"
                value={f.cpf}
                onChange={(e) => set("cpf", maskCPF(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                autoComplete="off"
                aria-invalid={!!erros.cpf}
                className={`mt-2 ${campo}`}
              />
              {erros.cpf ? (
                <p role="alert" className="mt-1.5 text-sm text-destructive">{erros.cpf}</p>
              ) : (
                <p className="caption mt-1.5">É a chave dos seus pontos: é o CPF que você informa no box.</p>
              )}
            </div>

            <div>
              <label htmlFor="tel" className={rotulo}>WhatsApp</label>
              <input
                id="tel"
                value={f.tel}
                onChange={(e) => set("tel", maskPhone(e.target.value))}
                placeholder="(85) 9 9999-9999"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={!!erros.tel}
                className={`mt-2 ${campo}`}
              />
              {erros.tel && <p role="alert" className="mt-1.5 text-sm text-destructive">{erros.tel}</p>}
            </div>

            <div>
              <label htmlFor="email" className={rotulo}>
                E-mail <span className="font-normal normal-case">(opcional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="voce@email.com"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!erros.email}
                className={`mt-2 ${campo}`}
              />
              {erros.email ? (
                <p role="alert" className="mt-1.5 text-sm text-destructive">{erros.email}</p>
              ) : (
                <p className="caption mt-1.5">Os mesmos avisos chegam por e-mail, se você quiser.</p>
              )}
            </div>

            <div>
              <label htmlFor="bairro" className={rotulo}>Bairro <span className="font-normal normal-case">(opcional)</span></label>
              <select
                id="bairro"
                value={f.bairro}
                onChange={(e) => set("bairro", e.target.value)}
                className={`mt-2 ${campo}`}
              >
                <option value="">Prefiro não dizer</option>
                {BAIRROS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <p className="caption mt-1.5">Ajuda a Secretaria a saber de onde vem o público do Centro.</p>
            </div>

            <fieldset>
              <legend className={rotulo}>O que você quer receber</legend>
              <div className="mt-3 space-y-2">
                {INTERESSES.map((i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-center gap-3 border border-border px-4 py-2.5 text-sm transition has-checked:border-primary has-checked:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={f.interesses.includes(i)}
                      onChange={() => toggleInteresse(i)}
                      className="h-4 w-4 accent-primary"
                    />
                    {i}
                  </label>
                ))}
              </div>
              {erros.interesses && (
                <p role="alert" className="mt-1.5 text-sm text-destructive">{erros.interesses}</p>
              )}
            </fieldset>

            <label className="flex cursor-pointer gap-3 bg-muted p-4 text-xs leading-relaxed">
              <input
                type="checkbox"
                checked={f.aceite}
                onChange={(e) => set("aceite", e.target.checked)}
                aria-invalid={!!erros.aceite}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              <span>
                Concordo em receber mensagens do SIMOVE no WhatsApp e, se eu informar o e-mail, também por
                e-mail. Sei que posso sair a qualquer momento respondendo SAIR ou pelo link de descadastro.
                Meus dados serão usados só para isso, conforme a LGPD.
              </span>
            </label>
            {erros.aceite && <p role="alert" className="text-sm text-destructive">{erros.aceite}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Quero receber <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}

/* ============================== /pontos ============================== */
export function PontosPage() {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [conta, setConta] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const consultar = (e) => {
    e.preventDefault();
    if (!validCPF(cpf)) return setErro("CPF inválido. Confira os 11 dígitos.");
    setErro("");
    setConta(saldoDe(cpf));
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`https://simove.app/i/${conta.codigo}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  if (!conta)
    return (
      <Shell foto>
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-secao font-bold leading-[1.05]">
            Meus pontos
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Digite seu CPF para ver seu saldo, seu extrato e seus números da Compra Premiada.
          </p>

          <form onSubmit={consultar} noValidate className="mt-8 bg-card p-6 hairline">
            <label htmlFor="cpf" className={rotulo}>CPF</label>
            <input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              aria-invalid={!!erro}
              className={`mt-2 ${campo}`}
            />
            {erro && <p role="alert" className="mt-1.5 text-sm text-destructive">{erro}</p>}
            <button
              type="submit"
              className="btn btn-primary mt-4 w-full"
            >
              Ver meu saldo
            </button>
            <p className="caption mt-4">
              Ainda não tem cadastro? <a href="/cadastro" className="text-primary underline underline-offset-2">Cadastre-se aqui</a>.
            </p>
          </form>

          <p className="caption mt-6">
            Os pontos ficam no CPF, não no telefone: trocar de número não perde o saldo. Nesta demonstração o
            saldo é calculado a partir do próprio CPF digitado, então o mesmo CPF mostra sempre o mesmo
            resultado. No sistema real vem das compras confirmadas por Pix.
          </p>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Olá.</h1>
        <button
          onClick={() => { setConta(null); setCpf(""); }}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          consultar outro CPF
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-primary p-8 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">Saldo de pontos</p>
          <p className="font-display text-6xl font-bold leading-none">{conta.saldo}</p>
          <p className="mt-3 text-sm text-primary-foreground">
            dá para {conta.premios} {conta.premios === 1 ? "troca" : "trocas"} por desconto nos boxes
          </p>
          <div className="mt-6 border-t border-primary-foreground pt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary-foreground">Faltam para o próximo prêmio</span>
              <span className="font-semibold">{conta.faltam} pontos</span>
            </div>
            <div className="mt-2 h-1.5 rounded-sm bg-primary-foreground/30">
              <div className="h-full bg-card" style={{ width: `${conta.progresso}%` }} />
            </div>
          </div>
        </div>

        <div className="border border-dashed border-primary bg-card p-8 text-center">
          <Icon name="gift" className="mx-auto h-7 w-7 text-primary" />
          <p className="mt-3 text-xs text-muted-foreground">Compra Premiada · sorteio dia 30</p>
          <p className="font-display text-4xl font-bold">{conta.numeros.length}</p>
          <p className="text-xs text-muted-foreground">
            {conta.numeros.length === 1 ? "número seu" : "números seus"} no sorteio
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {conta.numeros.map((n) => (
              <span key={n} className="bg-muted px-2.5 py-1 font-display text-sm font-bold tracking-widest">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-card p-8 hairline">
          <h2 className="font-display text-lg font-bold">Extrato</h2>
          <div className="mt-5 divide-y divide-[color:var(--edge-soft)]">
            {conta.extrato.map((e, i) => {
              const box = BOXES.find((b) => b.n === e.box);
              return (
                <div key={i} className="flex items-center gap-3 py-3">
                  {box ? (
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center text-xs font-bold text-setor-texto"
                      style={{ backgroundColor: SECTORS[box.s].hex }}
                    >
                      {box.n}
                    </span>
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-muted text-xs font-bold">
                      —
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{e.titulo}</p>
                    <p className="text-xs text-muted-foreground">{e.data}</p>
                  </div>
                  <span
                    className={`shrink-0 font-display text-sm font-bold ${
                      e.pts > 0 ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    {e.pts > 0 ? `+${e.pts}` : e.pts}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-card p-8 hairline">
            <h2 className="font-display text-lg font-bold">Indique e ganhe</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Quando a pessoa que você indicou fizer a primeira compra, vocês dois ganham 50 pontos.
            </p>
            <div className="mt-4 flex items-stretch">
              <span className="flex-1 truncate border border-border bg-muted px-3 py-2.5 text-xs">
                simove.app/i/{conta.codigo}
              </span>
              <button
                onClick={copiar}
                className="btn btn-primary shrink-0"
              >
                {copiado ? "copiado" : "copiar"}
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {conta.indicados} {conta.indicados === 1 ? "pessoa já usou" : "pessoas já usaram"} seu link.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-primary p-6 text-primary-foreground">
            <FakeQR className="h-16 w-16" />
            <div>
              <p className="font-display text-sm font-bold">Leve no celular</p>
              <p className="text-xs leading-snug text-primary-foreground">
                Saldo, cupons e avisos direto no WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="caption mt-8">
        Demonstração: saldo, extrato e números são gerados a partir do número informado e não representam
        compras reais.
      </p>
    </Shell>
  );
}
