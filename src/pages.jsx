import { useState } from "react";
import { BRAND, PHOTOS, BOXES, SECTORS } from "./data";
import { Icon, FakeQR } from "./ui";
import { maskPhone, validPhone } from "./phone";
import { saldoDe } from "./pontos";

/* ---------- moldura comum das páginas internas ---------- */
function Shell({ children, foto }) {
  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-[color:var(--edge)] bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <a href="/" className="flex items-baseline gap-2">
            <span className="font-display text-base font-bold tracking-tight">
              Si<span className="text-accent">Move</span>
            </span>
            <span className="hidden text-[11px] text-mist sm:inline">{BRAND.tagline}</span>
          </a>
          <div className="flex items-center gap-4 text-[13px]">
            <a href="/cadastro" className="text-mist transition hover:text-ink">Cadastro</a>
            <a href="/pontos" className="text-mist transition hover:text-ink">Meus pontos</a>
            <a href="/totem" className="text-mist transition hover:text-ink">Totem</a>
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
        <p className="rule pt-5 text-[12px] leading-relaxed text-mist">
          {BRAND.place}, {BRAND.city}. {PHOTOS.credit} Projeto de hackathon, sem vínculo oficial com a
          Prefeitura.
        </p>
      </footer>
    </div>
  );
}

const campo =
  "w-full border border-[color:var(--edge)] bg-paper px-4 py-3 text-base outline-none placeholder:text-mist focus:border-accent";
const rotulo = "block text-[12px] font-semibold uppercase tracking-wider text-mist";

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
        <div className="mx-auto max-w-xl bg-paper p-8 hairline">
          <div className="grid h-12 w-12 place-items-center bg-zap text-paper">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight">
            Cadastro feito, {f.nome.trim().split(" ")[0]}.
          </h1>
          <p className="mt-4 leading-relaxed text-mist">
            As mensagens vão para <strong className="text-ink">{f.tel}</strong>. Você recebe no máximo uma por
            dia e sai quando quiser respondendo <strong className="text-ink">SAIR</strong>.
          </p>

          <div className="rule mt-8 pt-6">
            <p className={rotulo}>Você vai receber</p>
            <ul className="mt-3 space-y-2">
              {f.interesses.map((i) => (
                <li key={i} className="flex gap-2.5 text-[15px] text-mist">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="rule mt-8 flex flex-wrap gap-3 pt-6">
            <a href="/pontos" className="bg-accent px-5 py-3 text-sm font-semibold text-paper transition hover:bg-navy">
              Ver meus pontos
            </a>
            <a href="/" className="hairline bg-paper px-5 py-3 text-sm font-semibold transition hover:bg-sand">
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
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zap">
            <Icon name="zap" className="h-4 w-4" /> WhatsApp
          </p>
          <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.05]">
            Receba as ofertas do Centro no seu WhatsApp.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-mist">
            Sem aplicativo para instalar e sem custo. Uma mensagem por dia, no máximo, com o que interessa
            para você.
          </p>

          <div className="rule mt-10 pt-6">
            {[
              ["Oferta do dia", "os boxes publicam até as 10h, você recebe na hora."],
              ["Cupom de influenciador", "código de quem você já segue aqui na cidade."],
              ["Compra Premiada", "aviso quando você entra no sorteio do mês."],
            ].map(([t, d]) => (
              <p key={t} className="rule-soft py-3 text-[15px] leading-relaxed first:border-t-0 first:pt-0">
                <strong>{t}</strong>, <span className="text-mist">{d}</span>
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={enviar} noValidate className="bg-paper p-6 hairline sm:p-8">
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
              {erros.nome && <p role="alert" className="mt-1.5 text-xs text-accent-ink">{erros.nome}</p>}
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
              {erros.tel && <p role="alert" className="mt-1.5 text-xs text-accent-ink">{erros.tel}</p>}
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
                    className="flex cursor-pointer items-center gap-3 border border-[color:var(--edge)] px-4 py-2.5 text-[15px] transition has-checked:border-accent has-checked:bg-sand"
                  >
                    <input
                      type="checkbox"
                      checked={f.interesses.includes(i)}
                      onChange={() => toggleInteresse(i)}
                      className="h-4 w-4 accent-[#1b5aa8]"
                    />
                    {i}
                  </label>
                ))}
              </div>
              {erros.interesses && (
                <p role="alert" className="mt-1.5 text-xs text-accent-ink">{erros.interesses}</p>
              )}
            </fieldset>

            <label className="flex cursor-pointer gap-3 bg-sand p-4 text-[13px] leading-relaxed">
              <input
                type="checkbox"
                checked={f.aceite}
                onChange={(e) => set("aceite", e.target.checked)}
                aria-invalid={!!erros.aceite}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1b5aa8]"
              />
              <span>
                Concordo em receber mensagens do SiMove no WhatsApp e sei que posso sair a qualquer momento
                respondendo SAIR. Meus dados serão usados só para isso, conforme a LGPD.
              </span>
            </label>
            {erros.aceite && <p role="alert" className="text-xs text-accent-ink">{erros.aceite}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 font-semibold text-paper transition hover:bg-navy"
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
          <h1 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] font-bold leading-[1.05]">
            Meus pontos
          </h1>
          <p className="mt-4 leading-relaxed text-mist">
            Digite o WhatsApp cadastrado para ver seu saldo, seu extrato e seus números da Compra Premiada.
          </p>

          <form onSubmit={consultar} noValidate className="mt-8 bg-paper p-6 hairline">
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
            {erro && <p role="alert" className="mt-1.5 text-xs text-accent-ink">{erro}</p>}
            <button
              type="submit"
              className="mt-4 w-full bg-accent px-6 py-3.5 font-semibold text-paper transition hover:bg-navy"
            >
              Ver meu saldo
            </button>
            <p className="caption mt-4">
              Ainda não tem cadastro? <a href="/cadastro" className="text-accent-ink underline underline-offset-2">Cadastre-se aqui</a>.
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
          className="text-[13px] text-mist underline underline-offset-2 hover:text-ink"
        >
          consultar outro número
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-accent p-8 text-paper">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/70">Saldo de pontos</p>
          <p className="font-display text-6xl font-bold leading-none">{conta.saldo}</p>
          <p className="mt-3 text-[15px] text-paper/80">
            dá para {conta.cafes} {conta.cafes === 1 ? "café" : "cafés"} nos boxes de alimentação
          </p>
          <div className="mt-6 border-t border-paper/25 pt-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-paper/70">Faltam para o próximo prêmio</span>
              <span className="font-semibold">{conta.faltam} pontos</span>
            </div>
            <div className="mt-2 h-1.5 bg-paper/25">
              <div className="h-full bg-paper" style={{ width: `${conta.progresso}%` }} />
            </div>
          </div>
        </div>

        <div className="border border-dashed border-accent/50 bg-paper p-8 text-center">
          <Icon name="gift" className="mx-auto h-7 w-7 text-accent" />
          <p className="mt-3 text-[13px] text-mist">Compra Premiada · sorteio dia 30</p>
          <p className="font-display text-4xl font-bold">{conta.numeros.length}</p>
          <p className="text-[13px] text-mist">
            {conta.numeros.length === 1 ? "número seu" : "números seus"} no sorteio
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {conta.numeros.map((n) => (
              <span key={n} className="bg-sand px-2.5 py-1 font-display text-sm font-bold tracking-widest">
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-paper p-8 hairline">
          <h2 className="font-display text-lg font-bold">Extrato</h2>
          <div className="mt-5 divide-y divide-[color:var(--edge-soft)]">
            {conta.extrato.map((e, i) => {
              const box = BOXES.find((b) => b.n === e.box);
              return (
                <div key={i} className="flex items-center gap-3 py-3">
                  {box ? (
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center text-[11px] font-bold text-white"
                      style={{ backgroundColor: SECTORS[box.s].hex }}
                    >
                      {box.n}
                    </span>
                  ) : (
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-sand text-[11px] font-bold">
                      —
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{e.titulo}</p>
                    <p className="text-[12px] text-mist">{e.data}</p>
                  </div>
                  <span
                    className={`shrink-0 font-display text-sm font-bold ${
                      e.pts > 0 ? "text-zap" : "text-mist"
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
          <div className="bg-paper p-8 hairline">
            <h2 className="font-display text-lg font-bold">Indique e ganhe</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-mist">
              Quando a pessoa que você indicou fizer a primeira compra, vocês dois ganham 50 pontos.
            </p>
            <div className="mt-4 flex items-stretch">
              <span className="flex-1 truncate border border-[color:var(--edge)] bg-sand px-3 py-2.5 text-[13px]">
                simove.app/i/{conta.codigo}
              </span>
              <button
                onClick={copiar}
                className="shrink-0 bg-accent px-4 text-[13px] font-semibold text-paper transition hover:bg-navy"
              >
                {copiado ? "copiado" : "copiar"}
              </button>
            </div>
            <p className="mt-3 text-[13px] text-mist">
              {conta.indicados} {conta.indicados === 1 ? "pessoa já usou" : "pessoas já usaram"} seu link.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy p-6 text-paper">
            <FakeQR className="h-16 w-16" />
            <div>
              <p className="font-display text-sm font-bold">Leve no celular</p>
              <p className="text-[12px] leading-snug text-paper/70">
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
