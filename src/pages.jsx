import { useMemo, useState } from "react";
import { BRAND, PHOTOS, BOXES, SECTORS, SEG_FILTERS, OFERTAS } from "./data";
import { Icon, FakeQR, Logo, Wordmark } from "./ui";
import { maskPhone, validPhone } from "./phone";
import { saldoDe } from "./pontos";
import { vitrine, descontoPct, catalogoDe } from "./catalogo";
import { MAP_BOXES } from "./map/layout";

/* ---------- moldura comum das páginas internas ---------- */
function Shell({ children, foto }) {
  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <a href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="flex items-baseline gap-2">
              <Wordmark className="text-lg" />
              <span className="hidden text-xs text-muted-foreground sm:inline">{BRAND.tagline}</span>
            </span>
          </a>
          {/* Quatro links não cabem em linha no celular: quebram e não espremem. */}
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 whitespace-nowrap text-xs">
            <a href="/catalogo" className="text-muted-foreground transition hover:text-foreground">Vitrine</a>
            <a href="/cadastro" className="text-muted-foreground transition hover:text-foreground">Cadastro</a>
            <a href="/pontos" className="text-muted-foreground transition hover:text-foreground">Meus pontos</a>
            <a href="/totem" className="text-muted-foreground transition hover:text-foreground">Totem</a>
          </div>
        </div>
      </header>

      {foto && (
        <div className="h-40 w-full overflow-hidden sm:h-52">
          <img src={PHOTOS.entrada.src} alt={PHOTOS.entrada.alt} className="h-full w-full object-cover" />
        </div>
      )}

      <main className="mx-auto max-w-5xl px-5 py-12">{children}</main>

      <footer className="mx-auto max-w-5xl px-5 pb-12">
        <p className="rule pt-5 text-xs leading-relaxed text-muted-foreground">
          {BRAND.place}, {BRAND.city}. {PHOTOS.credit} Projeto de hackathon, sem vínculo oficial com a
          Prefeitura.
        </p>
      </footer>
    </div>
  );
}

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
  const [f, setF] = useState({ nome: "", tel: "", bairro: "", interesses: [...INTERESSES], aceite: false });
  const [erros, setErros] = useState({});
  const [pronto, setPronto] = useState(false);

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const toggleInteresse = (i) =>
    set("interesses", f.interesses.includes(i) ? f.interesses.filter((x) => x !== i) : [...f.interesses, i]);

  const enviar = (e) => {
    e.preventDefault();
    const novos = {};
    if (f.nome.trim().length < 2) novos.nome = "Escreva seu nome.";
    if (!validPhone(f.tel)) novos.tel = "Informe DDD e número, como (85) 9 9999-9999.";
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
            As mensagens vão para <strong className="text-foreground">{f.tel}</strong>. Você recebe no máximo uma por
            dia e sai quando quiser respondendo <strong className="text-foreground">SAIR</strong>.
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
            Receba as ofertas do Centro no seu WhatsApp.
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
                Concordo em receber mensagens do SIMOVE no WhatsApp e sei que posso sair a qualquer momento
                respondendo SAIR. Meus dados serão usados só para isso, conforme a LGPD.
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
  const [tel, setTel] = useState("");
  const [erro, setErro] = useState("");
  const [conta, setConta] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const consultar = (e) => {
    e.preventDefault();
    if (!validPhone(tel)) return setErro("Informe DDD e número, como (85) 9 9999-9999.");
    setErro("");
    setConta(saldoDe(tel));
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
            Digite o WhatsApp cadastrado para ver seu saldo, seu extrato e seus números da Compra Premiada.
          </p>

          <form onSubmit={consultar} noValidate className="mt-8 bg-card p-6 hairline">
            <label htmlFor="tel" className={rotulo}>WhatsApp</label>
            <input
              id="tel"
              value={tel}
              onChange={(e) => setTel(maskPhone(e.target.value))}
              placeholder="(85) 9 9999-9999"
              inputMode="tel"
              autoComplete="tel"
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
            Nesta demonstração o saldo é calculado a partir do próprio número digitado, então o mesmo número
            mostra sempre o mesmo resultado. No sistema real vem das compras confirmadas por Pix.
          </p>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Olá.</h1>
        <button
          onClick={() => { setConta(null); setTel(""); }}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          consultar outro número
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

/* ============================== /catalogo ============================== */

// Cupom de influenciador vale nas lojas que aderiram à campanha: a lista sai
// das próprias ofertas, para não existir cadastro de cupom mentindo sobre onde
// ele é aceito.
const CUPONS = Object.values(
  OFERTAS.filter((o) => o.cupom).reduce((acc, o) => {
    (acc[o.cupom] ??= { codigo: o.cupom, lojas: [] }).lojas.push(o.loja);
    return acc;
  }, {})
);

// O cliente escolhe a loja, não o carrinho: o Centro é físico, e quem procura
// "sandália" quer saber em que box ela está. Por isso a lista é de loja, e a
// busca por produto é que abre a lista de item.
const menorPreco = (itens) =>
  itens.reduce((a, b) => (Number(a.preco.replace(",", ".")) <= Number(b.preco.replace(",", ".")) ? a : b))
    .preco;

const LOJAS = MAP_BOXES.filter((b) => b.status !== "Vago").map((box) => {
  const { itens, oferta } = catalogoDe(box);
  return { ...box, itens, oferta, desde: menorPreco(itens) };
});

function BoxTag({ numero, setor, className = "h-9 w-9 text-xs" }) {
  const cor = SECTORS[setor];
  return (
    <span
      className={`grid shrink-0 place-items-center font-display font-bold ${className}`}
      style={
        cor
          ? { backgroundColor: cor.hex, color: "var(--color-setor-texto)" }
          : { backgroundColor: "var(--color-muted)" }
      }
    >
      {numero}
    </span>
  );
}

export function CatalogoPage() {
  const [seg, setSeg] = useState("Tudo");
  const [q, setQ] = useState("");
  const [cupom, setCupom] = useState(null);

  const todos = useMemo(() => vitrine(MAP_BOXES), []);

  const lojasDoCupom = cupom && new Set(CUPONS.find((c) => c.codigo === cupom).lojas);
  const termo = q.trim().toLowerCase();

  const itens = todos.filter(
    (i) =>
      (seg === "Tudo" || i.seg === seg) &&
      (!termo || i.nome.toLowerCase().includes(termo) || i.loja.toLowerCase().includes(termo)) &&
      (!lojasDoCupom || lojasDoCupom.has(i.loja))
  );

  const lojas = LOJAS.filter(
    (l) => (seg === "Tudo" || l.seg === seg) && (!lojasDoCupom || lojasDoCupom.has(l.name))
  );

  const ofertas = lojasDoCupom ? OFERTAS.filter((o) => o.cupom === cupom) : OFERTAS;

  return (
    <Shell>
      <div className="max-w-2xl">
        <h1 className="font-display text-secao font-bold leading-[1.05]">Vitrine do Centro</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          O que os {BOXES.length} boxes do {BRAND.place} vendem hoje, com as ofertas do dia e os cupons
          dos influenciadores da cidade. Achou? O box fica marcado no mapa da entrada.
        </p>
      </div>

      {/* ---------- ofertas do dia ---------- */}
      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h2 className="font-display text-2xl font-bold">Ofertas do dia</h2>
          <p className="text-xs text-muted-foreground">Só hoje, direto no box</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ofertas.map((o) => (
            <article key={o.box + o.item} className="flex flex-col bg-card p-5 hairline">
              <div className="flex items-center gap-3">
                <BoxTag numero={o.box} setor={BOXES.find((b) => b.n === o.box)?.s} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{o.loja}</p>
                  <p className="text-xs text-muted-foreground">Box {o.box}</p>
                </div>
                <span className="ml-auto bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                  −{descontoPct(o)}%
                </span>
              </div>

              <p className="mt-4 font-display text-lg font-bold leading-tight">{o.item}</p>
              <p className="mt-2 text-sm text-muted-foreground line-through">R$ {o.de}</p>
              <p className="font-display text-2xl font-bold tabular-nums">R$ {o.por}</p>

              {o.cupom && (
                <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-semibold">
                  <Icon name="ticket" className="h-4 w-4 shrink-0 text-primary" />
                  cupom {o.cupom}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ---------- cupons ---------- */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold">Cupons</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Mostre o código no caixa do box. Não precisa de aplicativo.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CUPONS.map((c) => {
            const ativo = cupom === c.codigo;
            return (
              <button
                key={c.codigo}
                onClick={() => setCupom(ativo ? null : c.codigo)}
                aria-pressed={ativo}
                className={`flex items-start gap-3 p-5 text-left transition ${
                  ativo ? "bg-primary text-primary-foreground" : "bg-card hairline hover:bg-muted"
                }`}
              >
                <Icon name="ticket" className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0">
                  <span className="block font-display text-lg font-bold tracking-wide">{c.codigo}</span>
                  <span className={`block text-xs ${ativo ? "" : "text-muted-foreground"}`}>
                    Vale em {c.lojas.join(", ")}
                  </span>
                </span>
                <span className="ml-auto shrink-0 text-xs font-bold uppercase tracking-[0.12em]">
                  {ativo ? "Ativo" : "Usar"}
                </span>
              </button>
            );
          })}
        </div>

        {cupom && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 bg-success px-4 py-3 text-sm font-semibold text-success-foreground"
          >
            <Icon name="check" className="h-4 w-4 shrink-0" />
            Mostrando só o que o cupom {cupom} atende.
            <button onClick={() => setCupom(null)} className="ml-auto underline underline-offset-2">
              Limpar
            </button>
          </p>
        )}
      </section>

      {/* ---------- lojas ---------- */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">
          {termo ? "O que achamos" : "Lojas do Centro"}
        </h2>

        <div className="mt-5 flex flex-col gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produto ou loja"
            aria-label="Buscar produto ou loja"
            className={campo}
          />

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {["Tudo", ...SEG_FILTERS, "Serviços"].map((s) => (
              <button
                key={s}
                onClick={() => setSeg(s)}
                aria-pressed={seg === s}
                className={`shrink-0 px-4 py-2 text-sm font-semibold transition ${
                  seg === s ? "bg-foreground text-background" : "bg-card hairline hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {termo
            ? `${itens.length} ${itens.length === 1 ? "item" : "itens"} em ${
                new Set(itens.map((i) => i.loja)).size
              } ${new Set(itens.map((i) => i.loja)).size === 1 ? "loja" : "lojas"}`
            : `${lojas.length} ${lojas.length === 1 ? "loja aberta" : "lojas abertas"}`}
        </p>

        {termo && itens.length === 0 && (
          <p className="mt-4 bg-card p-8 text-center text-sm text-muted-foreground hairline">
            Ninguém no Centro cadastrou isso ainda. Tente outro termo, ou fale com a Sala do
            Empreendedor: pode ser um box a abrir.
          </p>
        )}

        {/* Buscou produto: a resposta é o item e o box onde ele está. */}
        {termo && itens.length > 0 && (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((i) => (
              <li key={i.box + i.nome} className="flex items-center gap-3 bg-card p-4 hairline">
                <BoxTag numero={i.box} setor={i.setor} className="h-11 w-11 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold leading-snug">{i.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {i.loja} · {i.seg}
                  </p>
                </div>
                <p className="shrink-0 font-display text-base font-bold tabular-nums">R$ {i.preco}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Sem busca: a vitrine é a rua de lojas, e cada uma abre no lugar. */}
        {!termo && (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {lojas.map((l) => (
              <li key={l.number}>
                <details className="group bg-card hairline">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                    <BoxTag numero={l.number} setor={l.s} className="h-14 w-14 text-lg" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold leading-snug">{l.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {l.seg}
                        {SECTORS[l.s] && ` · ${SECTORS[l.s].label}`}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {l.itens.map((i) => i.nome).join(" · ")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-semibold tabular-nums text-foreground">
                          a partir de R$ {l.desde}
                        </span>{" "}
                        · {l.itens.length} itens
                      </p>
                    </div>

                    {l.oferta && (
                      <span className="shrink-0 bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                        oferta
                      </span>
                    )}
                    <Icon
                      name="arrow"
                      className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-90"
                    />
                  </summary>

                  <ul className="border-t border-border px-4">
                    {l.itens.map((i) => (
                      <li
                        key={i.nome}
                        className="flex items-baseline justify-between gap-3 border-b border-border py-2.5 last:border-0"
                      >
                        <span className="min-w-0 text-sm">{i.nome}</span>
                        <span className="shrink-0 text-sm font-bold tabular-nums">R$ {i.preco}</span>
                      </li>
                    ))}
                  </ul>

                  {l.oferta && (
                    <p className="m-4 flex items-start gap-2 bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground">
                      <Icon name="tag" className="mt-px h-4 w-4 shrink-0" />
                      <span>
                        {l.oferta.item}: de R$ {l.oferta.de} por R$ {l.oferta.por}
                        {l.oferta.cupom && ` · cupom ${l.oferta.cupom}`}
                      </span>
                    </p>
                  )}
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="rule mt-12 flex flex-wrap gap-3 pt-8">
        <a href="/totem" className="btn btn-primary">
          Achar no mapa da entrada
          <Icon name="arrow" className="h-4 w-4" />
        </a>
        <a href="/cadastro" className="btn btn-outline">
          Receber as ofertas no WhatsApp
        </a>
      </div>

      <p className="caption mt-8">
        Demonstração: enquanto os permissionários não cadastram os produtos, cada box mostra uma vitrine
        de exemplo do seu segmento. As ofertas e os cupons são os cadastrados em data.js.
      </p>
    </Shell>
  );
}
