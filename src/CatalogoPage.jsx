/* ============================== /catalogo ==============================
   A vitrine das 60 lojas. Duas leituras da mesma coisa: sem busca é a rua de
   lojas, e cada uma abre no lugar; com busca é o produto e o box onde ele está.

   Filtro e busca moram em catalogo.js, testados sem navegador: aqui só sobra
   estado de tela e marcação. */
import { useEffect, useMemo, useState } from "react";
import { PHOTOS, SECTORS, SEG_FILTERS, OFERTAS } from "./data";
import { Icon, FotoProduto, Shell } from "./ui";
import {
  vitrine, descontoPct, catalogoDe, fotoDe, FOTO_SEG,
  cupons, normalizar, combina, indexarItens, indexarLojas,
} from "./catalogo";
import { MAP_BOXES } from "./map/layout";

const CATEGORIAS = ["Tudo", ...SEG_FILTERS, "Serviços"];
const CUPONS = cupons(OFERTAS);

const menorPreco = (itens) =>
  itens.reduce((a, b) => (Number(a.preco.replace(",", ".")) <= Number(b.preco.replace(",", ".")) ? a : b))
    .preco;

/* Listas prontas no módulo: não dependem de estado e o mesmo box mostra sempre
   a mesma vitrine, então recalcular a cada tecla digitada seria desperdício. */
const ITENS = indexarItens(vitrine(MAP_BOXES));
const LOJAS = indexarLojas(
  MAP_BOXES.filter((b) => b.status !== "Vago").map((box) => {
    const { itens, oferta } = catalogoDe(box);
    return { ...box, itens, oferta, desde: menorPreco(itens) };
  })
);

/* ---------- estado da vitrine, espelhado na barra de endereço ----------
   Filtro que não está na URL não se compartilha e não volta: quem manda
   "olha os calçados" no WhatsApp precisa mandar um link que já abre filtrado.
   Uso replaceState, e não push: uma entrada de histórico por tecla digitada
   transformaria o botão voltar em desfazer letra por letra. */
function useFiltros() {
  const inicial = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    const cat = p.get("categoria");
    return {
      seg: CATEGORIAS.includes(cat) ? cat : "Tudo",
      q: p.get("busca") ?? "",
      cupom: CUPONS.some((c) => c.codigo === p.get("cupom")) ? p.get("cupom") : null,
    };
  }, []);

  const [seg, setSeg] = useState(inicial.seg);
  const [q, setQ] = useState(inicial.q);
  const [cupom, setCupom] = useState(inicial.cupom);

  useEffect(() => {
    const p = new URLSearchParams();
    if (seg !== "Tudo") p.set("categoria", seg);
    if (q.trim()) p.set("busca", q.trim());
    if (cupom) p.set("cupom", cupom);
    const busca = p.toString();
    window.history.replaceState(null, "", busca ? `?${busca}` : window.location.pathname);
  }, [seg, q, cupom]);

  return { seg, setSeg, q, setQ, cupom, setCupom };
}

/* ---------- peças ---------- */
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

/* Filtro ligado, com o botão de desligar dentro dele. */
function ChipFiltro({ label, onLimpar }) {
  return (
    <button
      onClick={onLimpar}
      className="flex items-center gap-1.5 bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground transition hover:bg-secondary hover:text-secondary-foreground"
    >
      {label}
      <span aria-hidden="true" className="text-sm leading-none">×</span>
      <span className="sr-only">tirar este filtro</span>
    </button>
  );
}

/* A busca acompanha a rolagem: a lista é longa e trocar de termo não pode
   custar uma subida até o topo. */
function Busca({ q, setQ }) {
  return (
    <div className="sticky top-0 z-20 -mx-5 mt-6 border-b border-border bg-muted px-5 py-3">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          placeholder="Buscar produto ou loja"
          aria-label="Buscar produto ou loja"
          className="campo w-full"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="limpar a busca"
            className="absolute inset-y-0 right-3 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function Categorias({ seg, setSeg }) {
  return (
    <div className="-mx-5 mt-6 flex gap-4 overflow-x-auto px-5 pb-1">
      {CATEGORIAS.map((s) => {
        const ativo = seg === s;
        return (
          <button key={s} onClick={() => setSeg(s)} aria-pressed={ativo} className="w-20 shrink-0 text-center">
            <span
              className={`block h-20 w-20 overflow-hidden bg-muted outline-offset-2 transition ${
                ativo ? "outline outline-2 outline-foreground" : ""
              }`}
            >
              <img
                src={s === "Tudo" ? PHOTOS.entrada.src : fotoDe(FOTO_SEG[s])}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </span>
            <span className={`mt-2 block text-xs font-semibold leading-tight ${ativo ? "" : "text-muted-foreground"}`}>
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Preço e nome vivem no bloco sólido abaixo da foto: o DS proíbe gradiente e
   proíbe texto sobre foto sem chapa. */
function CardOferta({ o }) {
  return (
    <a
      href="/totem"
      className="group w-[84%] shrink-0 snap-start overflow-hidden bg-card hairline clicavel sm:w-[26rem]"
    >
      <div className="relative">
        <FotoProduto termo={o.item} ratio="aspect-[16/9]" />
        <span className="absolute left-0 top-0 bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
          −{descontoPct(o)}%
        </span>
      </div>
      <div className="chapa flex items-end justify-between gap-3 p-4">
        <span className="min-w-0">
          <span className="block font-display text-lg font-bold leading-tight">{o.item}</span>
          <span className="mt-0.5 block truncate text-xs">
            {o.loja} · box {o.box}
            {o.cupom && ` · cupom ${o.cupom}`}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block text-xs line-through">R$ {o.de}</span>
          <span className="block font-display text-2xl font-bold leading-none tabular-nums">R$ {o.por}</span>
        </span>
      </div>
    </a>
  );
}

function CardItem({ i }) {
  return (
    <li className="overflow-hidden bg-card hairline clicavel">
      <div className="relative">
        <FotoProduto termo={i.nome} />
        <BoxTag numero={i.box} setor={i.setor} className="absolute left-0 top-0 h-8 w-8 text-xs" />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold leading-snug">{i.nome}</p>
        <p className="truncate text-xs text-muted-foreground">{i.loja}</p>
        <p className="mt-1 font-display font-bold tabular-nums">R$ {i.preco}</p>
      </div>
    </li>
  );
}

function CardLoja({ l }) {
  return (
    <li>
      <details className="group overflow-hidden bg-card hairline clicavel">
        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <div className="relative">
            <FotoProduto termo={l.itens[0].nome} ratio="aspect-[16/10]" />
            <BoxTag numero={l.number} setor={l.s} className="absolute left-0 top-0 h-9 w-9 text-xs" />
            {l.oferta && (
              <span className="absolute right-0 top-0 bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                oferta
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold leading-snug">{l.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {l.seg} · a partir de{" "}
                <span className="font-semibold tabular-nums text-foreground">R$ {l.desde}</span>
              </p>
            </div>
            {/* Quantos produtos tem dentro: o cliente decide abrir sabendo o que
                ganha, em vez de só uma seta. */}
            <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              {l.itens.length} {l.itens.length === 1 ? "produto" : "produtos"}
              <Icon name="arrow" className="h-4 w-4 transition group-open:rotate-90" />
            </span>
          </div>
        </summary>

        <ul className="border-t border-border">
          {l.itens.map((i) => (
            <li key={i.nome} className="flex items-center gap-3 border-b border-border p-3 last:border-0">
              <FotoProduto termo={i.nome} ratio="" className="h-12 w-12 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-sm">{i.nome}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums">R$ {i.preco}</span>
            </li>
          ))}
        </ul>

        {l.oferta && (
          <p className="flex items-start gap-2 bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground">
            <Icon name="tag" className="mt-px h-4 w-4 shrink-0" />
            <span>
              {l.oferta.item}: de R$ {l.oferta.de} por R$ {l.oferta.por}
              {l.oferta.cupom && ` · cupom ${l.oferta.cupom}`}
            </span>
          </p>
        )}
      </details>
    </li>
  );
}

/* Vale para qualquer combinação de filtro, e não só para a busca: categoria
   com cupom também consegue não sobrar nada, e antes a página só ficava vazia. */
function NadaAqui({ onLimpar }) {
  return (
    <div className="mt-4 bg-card p-8 text-center hairline">
      <p className="text-sm text-muted-foreground">
        Nada por aqui com esses filtros. Tente outro termo ou outra categoria — se ninguém no Centro
        vende isso ainda, fale com a Sala do Empreendedor: pode ser um box a abrir.
      </p>
      <button onClick={onLimpar} className="btn btn-outline mt-6">
        Limpar os filtros
      </button>
    </div>
  );
}

/* ---------- página ---------- */
export function CatalogoPage() {
  const { seg, setSeg, q, setQ, cupom, setCupom } = useFiltros();

  const termo = normalizar(q.trim());
  const lojasDoCupom = useMemo(() => {
    const achado = CUPONS.find((c) => c.codigo === cupom);
    return achado ? new Set(achado.lojas) : null;
  }, [cupom]);

  const filtro = useMemo(() => ({ seg, termo, lojasDoCupom }), [seg, termo, lojasDoCupom]);
  const itens = useMemo(() => ITENS.filter((i) => combina(i, filtro)), [filtro]);
  const lojas = useMemo(() => LOJAS.filter((l) => combina(l, filtro)), [filtro]);
  const ofertas = lojasDoCupom ? OFERTAS.filter((o) => o.cupom === cupom) : OFERTAS;

  const buscando = termo.length > 0;
  const filtrando = seg !== "Tudo" || cupom || buscando;
  const vazio = buscando ? itens.length === 0 : lojas.length === 0;

  const limparTudo = () => {
    setSeg("Tudo");
    setQ("");
    setCupom(null);
  };

  return (
    <Shell>
      <h1 className="font-display text-3xl font-bold leading-none">Vitrine do Centro</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        As 60 lojas com preço e o número do box. Busque o produto ou escolha uma categoria.
      </p>

      <Busca q={q} setQ={setQ} />
      <Categorias seg={seg} setSeg={setSeg} />

      {/* O que está filtrando agora fica num lugar só, e cada filtro sai daqui
          mesmo — senão o cliente precisa lembrar onde clicou. */}
      {filtrando && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Mostrando</span>
          {seg !== "Tudo" && <ChipFiltro label={seg} onLimpar={() => setSeg("Tudo")} />}
          {cupom && <ChipFiltro label={`cupom ${cupom}`} onLimpar={() => setCupom(null)} />}
          {buscando && <ChipFiltro label={`“${q.trim()}”`} onLimpar={() => setQ("")} />}
        </div>
      )}

      <section className="rule mt-10 pt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Ofertas do dia</h2>
          <p className="text-xs text-muted-foreground">Só hoje, direto no box</p>
        </div>
        <div className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
          {ofertas.map((o) => (
            <CardOferta key={o.box + o.item} o={o} />
          ))}
        </div>
      </section>

      <section className="rule mt-10 flex flex-wrap items-center gap-2 pt-8">
        <h2 className="mr-1 font-display text-xl font-bold">Cupons</h2>
        {CUPONS.map((c) => {
          const ativo = cupom === c.codigo;
          return (
            <button
              key={c.codigo}
              onClick={() => setCupom(ativo ? null : c.codigo)}
              aria-pressed={ativo}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wide transition ${
                ativo ? "bg-primary text-primary-foreground" : "bg-card hairline hover:bg-muted"
              }`}
            >
              <Icon name="ticket" className="h-4 w-4 shrink-0" />
              {c.codigo}
            </button>
          );
        })}
      </section>

      <section className="rule mt-10 pt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{buscando ? "O que achamos" : "Lojas"}</h2>
          {/* A contagem é o retorno da busca: quem digita precisa saber se
              achou muito, pouco ou nada, sem contar cartão na tela. */}
          <p role="status" className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {buscando
              ? `${itens.length} ${itens.length === 1 ? "item" : "itens"} em ${
                  new Set(itens.map((i) => i.loja)).size
                } ${new Set(itens.map((i) => i.loja)).size === 1 ? "loja" : "lojas"}`
              : `${lojas.length} ${lojas.length === 1 ? "loja aberta" : "lojas abertas"}`}
          </p>
        </div>

        {vazio && <NadaAqui onLimpar={limparTudo} />}

        {/* Buscou produto: a resposta é o item e o box onde ele está. */}
        {buscando && itens.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {itens.map((i) => (
              <CardItem key={i.box + i.nome} i={i} />
            ))}
          </ul>
        )}

        {/* Sem busca: a vitrine é a rua de lojas, e cada uma abre no lugar. */}
        {!buscando && lojas.length > 0 && (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lojas.map((l) => (
              <CardLoja key={l.number} l={l} />
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
        Demonstração: enquanto os permissionários não cadastram produto, cada box mostra uma vitrine
        de exemplo do seu segmento e as fotos vêm de busca de imagem na web.
      </p>
    </Shell>
  );
}
