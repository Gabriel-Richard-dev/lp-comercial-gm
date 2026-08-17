import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BRAND, PHOTOS, SECTORS, BOXES, SEG_FILTERS, OFERTAS, AGENDA, OUVIDORIA_TIPOS } from "./data";
import { Icon, FakeQR, Wordmark, FotoProduto } from "./ui";
import { maskCPF, validCPF } from "./phone";
import { saldoDe } from "./pontos";
import { catalogoDe } from "./catalogo";
import MapView from "./map/MapView";
import { CATEGORIES } from "./map/layout";

const IDLE_MS = 45000; // volta para a tela de espera, como num totem de verdade

const MENU = [
  { id: "mapa", icon: "pin", label: "Mapa das lojas", sub: "Onde fica cada box" },
  { id: "busca", icon: "bag", label: "O que você procura?", sub: "Ache quem vende" },
  { id: "ofertas", icon: "tag", label: "Ofertas do dia", sub: "Válidas até as 18h" },
  { id: "agenda", icon: "music", label: "Eventos", sub: "Shows e feiras da semana" },
  { id: "pontos", icon: "gift", label: "Meus pontos", sub: "Saldo e Compra Premiada" },
  { id: "ouvidoria", icon: "mega", label: "Ouvidoria", sub: "Reclamação, elogio ou sugestão" },
];

/* ---------- cabeçalho de tela interna ---------- */
function Bar({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-5 py-4">
      <button
        onClick={onBack}
        className="grid h-10 w-10 shrink-0 place-items-center bg-muted text-foreground transition hover:bg-secondary"
        aria-label="Voltar"
      >
        <Icon name="arrow" className="h-5 w-5 rotate-180" />
      </button>
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
    </div>
  );
}

/* ---------- telas ---------- */
function Idle({ onStart }) {
  return (
    <button
      onClick={onStart}
      className="flex h-full w-full flex-col overflow-hidden text-left"
    >
      {/* Foto sem chapa por cima; o texto vive no bloco sólido abaixo dela.
          O DS proíbe gradiente e proíbe texto sobre foto sem chapa sólida. */}
      <img src={PHOTOS.entrada.src} alt="" className="min-h-0 w-full flex-1 object-cover" />
      <div className="chapa w-full px-8 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">Centro Público Comercial</p>
        <p className="font-display text-xl font-bold uppercase tracking-tight">Geraldo Machado</p>
        <Wordmark mono className="mt-6 block text-5xl" />
        <p className="text-sm font-semibold uppercase tracking-[0.08em]">Maracanaú {BRAND.tagline}</p>
        <p className="mt-8 inline-block rounded-md border-2 border-primary-foreground px-6 py-4 text-base font-bold">
          Toque na tela para começar
        </p>
      </div>
    </button>
  );
}

function Home({ go }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Centro Público Comercial
        </p>
        <p className="font-display text-xl font-bold uppercase tracking-tight text-primary">Geraldo Machado</p>
        <p className="mt-3 font-display text-lg font-bold">Seja bem-vindo.</p>
        <p className="text-sm text-muted-foreground">O que você quer fazer?</p>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-5">
        {MENU.map((m) => (
          <button
            key={m.id}
            onClick={() => go(m.id)}
            className="flex flex-col items-start gap-2 border border-border p-4 text-left transition hover:border-primary hover:bg-muted"
          >
            <Icon name={m.icon} className="h-6 w-6 text-primary" />
            <span className="font-display text-sm font-bold leading-tight">{m.label}</span>
            <span className="text-xs leading-snug text-muted-foreground">{m.sub}</span>
          </button>
        ))}
      </div>

      <a
        href="/cadastro"
        className="flex items-center gap-3 border-t border-border bg-card px-5 py-3.5 text-left transition hover:bg-muted"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center bg-success text-success-foreground">
          <Icon name="success" className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-sm font-bold">Receber ofertas no WhatsApp</span>
          <span className="block text-xs text-muted-foreground">Deixe seu número aqui mesmo</span>
        </span>
        <Icon name="arrow" className="ml-auto h-5 w-5 text-muted-foreground" />
      </a>

      <button
        onClick={() => go("app")}
        className="flex items-center gap-3 bg-primary px-5 py-4 text-left text-primary-foreground transition hover:bg-primary/90"
      >
        <FakeQR className="h-12 w-12" />
        <span>
          <span className="block font-display text-sm font-bold">Leve o SIMOVE no celular</span>
          <span className="block text-xs text-primary-foreground">Ofertas, pontos e Compra Premiada</span>
        </span>
        <Icon name="arrow" className="ml-auto h-5 w-5" />
      </button>
    </div>
  );
}

function Mapa({ onBack }) {
  const [mode, setMode] = useState("2d");
  const [active, setActive] = useState(null);
  const [sel, setSel] = useState(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Bar title="Mapa das lojas" onBack={onBack} />

      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="flex shrink-0 rounded bg-muted p-0.5">
          {[
            ["2d", "2D"],
            ["3d", "3D"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`px-2.5 py-1 text-xs font-semibold transition ${
                mode === id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {SEG_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setActive(active === s ? null : s)}
              aria-pressed={active === s}
              className={`shrink-0 px-2 py-1 text-xs font-semibold transition ${
                active === s ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <MapView mode={mode} filter={active} selectedId={sel?.id ?? null} onSelect={setSel} />
      </div>

      {sel ? <PainelLoja box={sel} onClose={() => setSel(null)} /> : <Legenda />}
    </div>
  );
}

function Legenda() {
  return (
    <div className="border-t border-border px-5 py-4">
      <p className="text-sm font-semibold" aria-live="polite">
        Toque num box para ver a loja
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Arraste para mover, pinça para aproximar.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {Object.values(CATEGORIES).map((c) => (
          <span key={c.label} className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: c.hex }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- ficha da loja, embaixo do mapa ---------- */
function PainelLoja({ box, onClose }) {
  const { itens, oferta, redes } = catalogoDe(box);
  const setor = SECTORS[box.s];
  const vago = box.status === "Vago";
  const [qr, setQr] = useState(false);

  return (
    // A altura é limitada e o miolo rola: a ficha cresce até quase metade da
    // tela e para, senão a loja escolhida some do mapa junto com o toque.
    <section
      className="flex max-h-[52%] shrink-0 flex-col border-t-2 border-primary bg-card"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 px-5 pt-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center font-display text-lg font-bold"
          style={
            setor
              ? { backgroundColor: setor.hex, color: "var(--color-setor-texto)" }
              : { backgroundColor: "var(--color-muted)" }
          }
        >
          {box.number}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold leading-tight">{box.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {vago ? "Disponível para locação" : box.seg}
            {setor && ` · ${setor.label}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {box.aisle} · {box.area}
          </p>
        </div>

        {/* 48px: alvo de toque de dedo, não de cursor. */}
        <button
          onClick={onClose}
          aria-label="Fechar a ficha da loja"
          className="grid h-12 w-12 shrink-0 place-items-center bg-muted text-foreground transition hover:bg-secondary"
        >
          <span aria-hidden="true" className="text-xl font-bold leading-none">
            ×
          </span>
        </button>
      </div>

      {!vago && (
        <>
          <div className="mt-3 flex flex-wrap gap-2 px-5">
            <span className="flex items-center gap-1.5 bg-muted px-3 py-2 text-xs font-semibold">
              <Icon name="instagram" className="h-4 w-4" />
              {redes.instagram}
            </span>
            <span className="flex items-center gap-1.5 bg-muted px-3 py-2 text-xs font-semibold">
              <Icon name="facebook" className="h-4 w-4" />
              {redes.facebook}
            </span>
            {/* Verde reservado ao WhatsApp, conforme o DS. */}
            <button
              onClick={() => setQr(true)}
              className="flex items-center gap-1.5 bg-success px-3 py-2 text-xs font-semibold text-success-foreground transition hover:bg-success/90"
            >
              <Icon name="success" className="h-4 w-4" />
              Chamar no WhatsApp
            </button>
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            {oferta && (
              <div className="mb-3 flex items-center gap-3 bg-accent p-2.5 text-accent-foreground">
                <FotoProduto termo={oferta.item} ratio="" className="h-20 w-20 shrink-0" />
                <span className="min-w-0 flex-1 text-sm font-bold">
                  <span className="flex items-center gap-1.5">
                    <Icon name="tag" className="h-4 w-4 shrink-0" />
                    {oferta.item}
                  </span>
                  <span className="block text-xs font-semibold">
                    de R$ {oferta.de} por R$ {oferta.por}
                    {oferta.cupom && ` · cupom ${oferta.cupom}`}
                  </span>
                </span>
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Catálogo
            </p>
            {/* Foto de 80 px: quem lê está de pé, a meio metro do vidro. */}
            <ul className="mt-1.5">
              {itens.map((i) => (
                <li
                  key={i.nome}
                  className="flex items-center gap-3 border-b border-border py-2.5 last:border-0"
                >
                  <FotoProduto termo={i.nome} ratio="" className="h-20 w-20 shrink-0" />
                  <span className="min-w-0 flex-1 text-sm font-semibold">{i.nome}</span>
                  <span className="shrink-0 text-sm font-bold tabular-nums">R$ {i.preco}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {vago && (
        <p className="px-5 pb-4 pt-3 text-sm text-muted-foreground">
          Fale com a Sala do Empreendedor para alugar este box.
        </p>
      )}

      {qr && <ModalWhats box={box} redes={redes} onClose={() => setQr(false)} />}
    </section>
  );
}

/**
 * QR para chamar a loja no WhatsApp.
 *
 * O código é adereço: não há WhatsApp cadastrado para nenhum dos 60 boxes, e um
 * QR escaneável só existiria com um número real — inventar um manda quem
 * escaneia para a linha de uma pessoa que não tem nada a ver com o Centro. O
 * aviso embaixo diz isso na cara, em vez de deixar alguém apontando a câmera
 * para um quadriculado que nunca vai abrir conversa nenhuma.
 *
 * Quando o cadastro do permissionário tiver telefone, o que muda aqui é trocar
 * o adereço por um QR de `https://wa.me/<numero>` e apagar o aviso.
 */
function ModalWhats({ box, redes, onClose }) {
  const fecharRef = useRef(null);

  useEffect(() => {
    fecharRef.current?.focus();
    const aoTeclar = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/60 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-whats"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-card p-6 text-center shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          Box {box.number}
        </p>
        <h4 id="titulo-whats" className="mt-1 font-display text-xl font-bold leading-tight">
          {box.name}
        </h4>

        <div className="mt-5 flex justify-center">
          <FakeQR seed={box.number + box.name} modules={21} className="h-52 w-52 border-4 border-primary" />
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
          <Icon name="success" className="h-5 w-5 text-success" />
          Aponte a câmera do celular
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{redes.instagram}</p>

        <p className="mt-4 bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground">
          Código de demonstração. Esta loja ainda não cadastrou o WhatsApp.
        </p>

        <button
          ref={fecharRef}
          onClick={onClose}
          className="mt-5 w-full bg-primary px-4 py-3.5 font-display text-base font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function Busca({ onBack }) {
  const [q, setQ] = useState("");
  const termo = q.trim().toLowerCase();
  const achados = termo
    ? BOXES.filter(
        (b) => b.name.toLowerCase().includes(termo) || b.seg.toLowerCase().includes(termo)
      )
    : [];

  const sugestoes = ["sandália", "fone", "vestido", "açaí", "bolsa", "tênis", "perfume"];

  return (
    <div className="flex h-full flex-col">
      <Bar title="O que você procura?" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Digite o produto ou a loja"
          autoFocus
          className="campo"
        />

        {!termo && (
          <>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Procurados hoje
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="caption mt-8">
              No SIMOVE completo esta busca também vai para o WhatsApp dos 60 boxes. O primeiro que responder
              fica com a venda.
            </p>
          </>
        )}

        {termo && (
          <div className="mt-5">
            <p className="text-sm text-muted-foreground">
              {achados.length === 0
                ? "Nenhum box encontrado. A busca fica registrada para a Secretaria."
                : `${achados.length} ${achados.length === 1 ? "resultado" : "resultados"}`}
            </p>
            <div className="mt-3 divide-y divide-border">
              {achados.map((b) => (
                <div key={b.n} className="flex items-center gap-3 py-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center text-xs font-bold text-setor-texto"
                    style={{ backgroundColor: SECTORS[b.s].hex }}
                  >
                    {b.n}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.seg} · {SECTORS[b.s].label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Ofertas({ onBack }) {
  return (
    <div className="flex h-full flex-col">
      <Bar title="Ofertas do dia" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {OFERTAS.map((o) => (
            <div key={o.box + o.item} className="flex items-center gap-4 px-5 py-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-muted font-display text-sm font-bold">
                {o.box}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-tight">{o.item}</p>
                <p className="text-xs text-muted-foreground">{o.loja}</p>
                {o.cupom && (
                  <p className="mt-1 inline-block rounded-sm bg-warning px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-warning-foreground">
                    cupom {o.cupom}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground line-through">R$ {o.de}</p>
                <p className="font-display text-base font-bold text-primary">R$ {o.por}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="caption px-5 py-5">
          Cupons com nome são de influenciadores da cidade. Cada resgate é contado no ranking deles.
        </p>
      </div>
    </div>
  );
}

function Agenda({ onBack }) {
  return (
    <div className="flex h-full flex-col">
      <Bar title="Eventos da semana" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <img src={PHOTOS.musica.src} alt={PHOTOS.musica.alt} className="h-40 w-full object-cover" />
        <div className="divide-y divide-border">
          {AGENDA.map((e) => (
            <div key={e.titulo + e.data} className="flex items-center gap-4 px-5 py-4">
              <div className="w-12 shrink-0 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{e.dia}</p>
                <p className="font-display text-2xl font-bold leading-none">{e.data}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-tight">{e.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {e.hora} · {e.local}
                </p>
              </div>
              <span className="shrink-0 border border-border px-2 py-0.5 text-xs text-muted-foreground">{e.tipo}</span>
            </div>
          ))}
        </div>
        <p className="caption px-5 py-5">
          Programação da Sala do Empreendedor com a Secult. No aplicativo, quem marca presença recebe lembrete
          no WhatsApp.
        </p>
      </div>
    </div>
  );
}

function Pontos({ onBack }) {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [dados, setDados] = useState(null);

  const consultar = (e) => {
    e.preventDefault();
    if (!validCPF(cpf)) return setErro("CPF inválido. Confira os 11 dígitos.");
    setErro("");
    setDados(saldoDe(cpf)); // mesma conta da página /pontos
  };

  return (
    <div className="flex h-full flex-col">
      <Bar title="Meus pontos" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5">
        {!dados ? (
          <form onSubmit={consultar}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Digite seu CPF para ver seu saldo e seus números da Compra Premiada.
            </p>
            <input
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              aria-invalid={!!erro}
              className="campo mt-4"
            />
            {erro && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {erro}
              </p>
            )}
            <button type="submit" className="btn btn-primary mt-4 w-full">
              Consultar
            </button>
            <p className="caption mt-6">
              O saldo fica no CPF, o mesmo que você informa no box na hora da compra. Nesta demonstração ele é
              gerado a partir do próprio CPF; no sistema real vem do histórico de compras confirmadas por Pix.
            </p>
          </form>
        ) : (
          <div>
            <div className="bg-primary p-6 text-primary-foreground">
              <p className="text-xs uppercase tracking-wider text-primary-foreground">Saldo de pontos</p>
              <p className="font-display text-5xl font-bold leading-none">{dados.saldo}</p>
              <p className="mt-2 text-sm text-primary-foreground">
                dá para {dados.premios} {dados.premios === 1 ? "troca" : "trocas"} por desconto nos boxes
              </p>
            </div>

            <div className="mt-4 border border-dashed border-primary bg-secondary p-5 text-center">
              <Icon name="gift" className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">Compra Premiada · sorteio dia 30</p>
              <p className="font-display text-2xl font-bold">
                {dados.numeros.length} {dados.numeros.length === 1 ? "número" : "números"}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {dados.numeros.map((n) => (
                  <span key={n} className="bg-card px-2 py-1 font-display text-xs font-bold tracking-widest">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setDados(null);
                setCpf("");
              }}
              className="btn btn-outline mt-4 w-full"
            >
              Consultar outro CPF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function protocoloDemo() {
  const n = String(Math.floor(1000 + Math.random() * 9000));
  return `OUV-${new Date().getFullYear()}-${n}`;
}

function Ouvidoria({ onBack }) {
  const [tipo, setTipo] = useState(null);
  const [box, setBox] = useState("");
  const [msg, setMsg] = useState("");
  const [protocolo, setProtocolo] = useState(null);

  if (protocolo)
    return (
      <div className="flex h-full flex-col">
        <Bar title="Ouvidoria" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <Icon name="check" className="h-12 w-12 text-success" />
          <p className="mt-4 font-display text-xl font-bold">Manifestação registrada.</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Vai para a Secretaria do Trabalho sem identificar quem enviou. Guarde o protocolo para consultar
            no aplicativo.
          </p>
          <p className="mt-6 rounded-md bg-muted px-5 py-3 font-display text-lg font-bold tracking-widest">
            {protocolo}
          </p>
          <button onClick={onBack} className="btn btn-primary mt-8">
            Voltar ao início
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <Bar title="Ouvidoria" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Canal anônimo da Secretaria do Trabalho. Escolha o tipo e descreva o que aconteceu.
        </p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</p>
        <div className="mt-2 space-y-2">
          {OUVIDORIA_TIPOS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`w-full rounded-md border p-3.5 text-left transition ${
                tipo === t.id ? "border-primary bg-muted" : "border-border hover:border-primary"
              }`}
            >
              <span className="block font-display text-sm font-bold">{t.label}</span>
              <span className="block text-xs text-muted-foreground">{t.hint}</span>
            </button>
          ))}
        </div>

        {tipo && (
          <>
            <label htmlFor="boxnum" className="mt-6 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Número do box (opcional)
            </label>
            <input
              id="boxnum"
              value={box}
              onChange={(e) => setBox(e.target.value.replace(/\D/g, "").slice(0, 2))}
              placeholder="Ex: 12"
              inputMode="numeric"
              className="campo mt-2"
            />

            <label htmlFor="ouvmsg" className="rotulo mt-5">
              Relato
            </label>
            <textarea
              id="ouvmsg"
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 400))}
              placeholder="Escreva em poucas palavras. Não é obrigatório se identificar."
              rows={4}
              className="campo mt-2 resize-none py-3"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{msg.length}/400</p>

            <button
              onClick={() => setProtocolo(protocoloDemo())}
              className="btn btn-primary mt-3 w-full"
            >
              Enviar para a Ouvidoria
            </button>
            <p className="caption mt-4">
              Nesta demonstração o registro não sai do totem. No sistema real a Secretaria recebe e responde
              pelo protocolo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function BaixarApp({ onBack }) {
  return (
    <div className="flex h-full flex-col">
      <Bar title="Leve o SIMOVE" onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <FakeQR className="h-44 w-44 border border-border" />
        <p className="mt-6 font-display text-xl font-bold">Aponte a câmera do celular.</p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Ofertas no WhatsApp, pontos por compra, seu link de indicação e os números da Compra Premiada.
        </p>
        <p className="caption mt-8 max-w-xs">
          Nesta demonstração o código não leva a lugar nenhum.
        </p>
      </div>
    </div>
  );
}

/* ---------- carcaça do totem ---------- */
export default function TotemApp() {
  const [screen, setScreen] = useState("idle");
  const [clock, setClock] = useState(() => new Date());
  const telaRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // volta sozinho para a tela de espera, como um totem de verdade
  useEffect(() => {
    clearTimeout(timer.current);
    if (screen !== "idle") timer.current = setTimeout(() => setScreen("idle"), IDLE_MS);
    return () => clearTimeout(timer.current);
  }, [screen]);

  const toque = () => {
    if (screen === "idle") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScreen("idle"), IDLE_MS);
  };

  useGSAP(
    () => {
      gsap.fromTo(
        telaRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    },
    { dependencies: [screen] }
  );

  const voltar = () => setScreen("home");
  const telas = {
    idle: <Idle onStart={() => setScreen("home")} />,
    home: <Home go={setScreen} />,
    mapa: <Mapa onBack={voltar} />,
    busca: <Busca onBack={voltar} />,
    ofertas: <Ofertas onBack={voltar} />,
    agenda: <Agenda onBack={voltar} />,
    pontos: <Pontos onBack={voltar} />,
    ouvidoria: <Ouvidoria onBack={voltar} />,
    app: <BaixarApp onBack={voltar} />,
  };

  const hora = clock.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-0 sm:p-6">
      <div className="mb-4 hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
        <a href="/" className="underline underline-offset-2 hover:text-foreground">
          ← voltar para a página do Centro
        </a>
        <span>·</span>
        <span>O totem da entrada, do jeito que ele fica na tela. Volta ao início após 45 s parado.</span>
      </div>

      {/* `relative`: é esta moldura que o popup do WhatsApp cobre. Sem ela o
          overlay escapa para a janela inteira e escurece a página em volta do
          totem, que na simulação é o cenário, não a tela do aparelho. */}
      <div
        onPointerDown={toque}
        className="relative flex h-screen w-full flex-col overflow-hidden bg-card sm:h-[calc(100vh-6rem)] sm:max-h-[880px] sm:w-auto sm:rounded-[1.75rem] sm:border-[10px] sm:border-primary sm:shadow-2xl sm:shadow-foreground/25"
        style={{ aspectRatio: "9 / 16" }}
      >
        {screen !== "idle" && (
          <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-1.5 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">
              <Wordmark className="text-xs" /> · {BRAND.tagline}
            </span>
            <span>{hora}</span>
          </div>
        )}
        <div ref={telaRef} className="flex min-h-0 flex-1 flex-col">
          {telas[screen]}
        </div>
      </div>

      <p className="mt-3 px-4 text-center text-xs text-muted-foreground sm:hidden">
        <a href="/" className="underline underline-offset-2">
          voltar para a página do Centro
        </a>
      </p>
    </div>
  );
}
