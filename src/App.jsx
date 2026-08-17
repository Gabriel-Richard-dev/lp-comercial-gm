import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BRAND, PHOTOS, HERO, STATS, SEGMENTS, PILLARS, MAP, PRIZE,
  STEPS, EVENTS, FORM,
} from "./data";
import { Icon, Counter, Photo, Phone, PrizeRoll, WhatsForm, Logo, Wordmark, useReveal, MENOS_MOVIMENTO } from "./ui";

/* Bolinhas do herói: [esquerda %, topo %, diâmetro px, camada]. A camada é a
   profundidade — 1 é longe e anda pouco, 3 é perto e anda muito. Espalhadas
   pelas bordas para não disputar espaço com o texto do meio. */
const BOLHAS = [
  [6, 18, 10, 1], [14, 62, 18, 2], [9, 86, 7, 1], [3, 44, 6, 2],
  [22, 30, 6, 3], [28, 74, 12, 1], [36, 12, 9, 2], [44, 88, 6, 3],
  [52, 20, 14, 1], [61, 70, 8, 2], [68, 14, 6, 1], [74, 52, 20, 2],
  [80, 84, 9, 3], [88, 28, 12, 1], [93, 64, 7, 2], [97, 40, 5, 3],
];

/* ============================== NAV ============================== */
function Nav() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { y: -70, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.15 });

      // O estado da barra é função da posição do scroll, não de um intervalo:
      // ler direto não tem borda para errar. Com ScrollTrigger de 70 até "max"
      // a barra desativava ao encostar no fim da página — o estado "sobre foto"
      // voltava, e o texto claro sumia no fundo claro do CTA.
      // A cor vem de .nav-solida e .nav-hero, no CSS — nenhum literal aqui.
      const marcar = () => {
        const passou = window.scrollY > 70;
        ref.current?.classList.toggle("nav-solida", passou);
        ref.current?.classList.toggle("nav-hero", !passou);
      };
      marcar();
      window.addEventListener("scroll", marcar, { passive: true });
      return () => window.removeEventListener("scroll", marcar);
    },
    { scope: ref }
  );

  return (
    <nav ref={ref} className="nav-hero fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#topo" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="flex items-baseline gap-2">
            <Wordmark className="text-lg" />
            <span className="hidden text-xs text-muted-foreground sm:inline">{BRAND.tagline}</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 text-xs text-muted-foreground lg:flex">
          {[
            ["O que faz", "#plataforma"],
            ["Totem", "#totem"],
            ["Compra Premiada", "#premiada"],
            ["Como funciona", "#como"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="transition hover:text-foreground">{l}</a>
          ))}
        </div>
        <a href="#cta" className="btn btn-primary">
          Receber ofertas
        </a>
      </div>
    </nav>
  );
}

/* ============================== HERO ============================== */
function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // Entrada: a foto abre fechando o zoom e o texto entra por cima dela,
      // linha por linha.
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.15 });
      tl.from(".hero-img", { scale: 1.32, duration: 2, ease: "power2.out" })
        .from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.8 }, 0.45)
        .from(".word", { yPercent: 110, duration: 1.1, stagger: 0.09 }, "-=0.45")
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.8 }, "-=0.7")
        .from(".hero-cta", { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.55")
        .from(".hero-rodape", { opacity: 0, duration: 0.9 }, "-=0.5");

      // Scrub não passa pela linha do tempo global, então o modo "menos
      // movimento" precisa cortar daqui para baixo na mão.
      if (MENOS_MOVIMENTO) return;

      gsap.to(".hero-seta", { y: 8, duration: 1.1, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Saída: o texto sai antes da foto, que continua subindo devagar.
      const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to(".hero-img", { yPercent: 12, ease: "none", scrollTrigger: st });
      gsap.to(".hero-conteudo", {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...st, end: "bottom 45%" },
      });
    },
    { scope: ref }
  );

  // Dois números por movimento do ponteiro; o desenho todo fica no CSS, que é
  // onde a cor pode morar. Toque não entra: no celular o dedo que rola a página
  // dispararia pointermove e sacudiria o herói inteiro.
  const seguirPonteiro = (e) => {
    if (MENOS_MOVIMENTO || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) / r.width);
    el.style.setProperty("--my", (e.clientY - r.top) / r.height);
  };

  return (
    <header
      ref={ref}
      id="topo"
      className="hero-foto relative flex min-h-dvh flex-col justify-center overflow-hidden text-primary-foreground"
      onPointerMove={seguirPonteiro}
    >
      <div className="hero-fundo absolute inset-0">
        <img
          src={PHOTOS.entrada.src}
          alt={PHOTOS.entrada.alt}
          width="1280"
          height="714"
          fetchPriority="high"
          decoding="async"
          className="hero-img h-full w-full scale-110 object-cover"
        />
      </div>

      {/* Bolinhas na frente do azul, em três profundidades: quanto mais perto,
          maior o deslocamento. Só reagem ao mouse, nunca sozinhas. */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {BOLHAS.map(([x, y, d, camada], i) => (
          <span
            key={i}
            className={`bolha bolha-${camada}`}
            style={{ left: `${x}%`, top: `${y}%`, width: `${d}px`, height: `${d}px` }}
          />
        ))}
      </div>

      <div className="hero-conteudo relative mx-auto w-full max-w-4xl px-5 py-24 text-center sm:py-28">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">{HERO.eyebrow}</p>

        <h1 className="hero-titulo mt-7 font-display text-display font-bold leading-[0.98] tracking-[-0.035em]">
          {HERO.title.map((w, i) => (
            <span key={i} className="block overflow-hidden py-[0.04em]">
              <span className="word inline-block">{w}</span>
            </span>
          ))}
        </h1>

        <p className="hero-sub mx-auto mt-8 max-w-xl text-base leading-relaxed">{HERO.sub}</p>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {HERO.ctas.map((c) => (
            <a key={c.href} href={c.href} className={`hero-cta btn ${c.primary ? "btn-claro" : "btn-contorno-claro"}`}>
              {c.label}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="mt-7 flex items-center justify-center gap-2 text-xs">
          <Icon name="pin" className="h-3.5 w-3.5 shrink-0" />
          {BRAND.address}, {BRAND.city}.
        </p>
      </div>

      {/* Só a dica de rolagem: o crédito da foto já está no rodapé da página, e
          lado a lado os dois não cabiam na largura de um celular. */}
      <div className="hero-rodape absolute inset-x-0 bottom-5 flex justify-center text-xs">
        <span className="hero-seta flex items-center gap-2">
          <Icon name="arrow" className="h-4 w-4 rotate-90" />
          role para ver
        </span>
      </div>
    </header>
  );
}

/* ============================== MARQUEE ============================== */
function Marquee() {
  const row = [...SEGMENTS, ...SEGMENTS];
  const strip = (hidden) => (
    <div className="marquee-track flex shrink-0 items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
      {row.map((s, i) => (
        <span key={i} className="flex items-center gap-6 whitespace-nowrap text-sm text-muted-foreground">
          {s}
          <span className="h-1 w-1 rounded-full bg-border" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="flex overflow-hidden border-b border-border py-3.5">
      {strip(false)}
      {strip(true)}
    </div>
  );
}

/* ============================== NÚMEROS ============================== */
function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} data-reveal className="rule pt-5">
            <p className="font-display text-4xl font-bold leading-none tracking-tight">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 text-sm font-semibold">{s.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================== A PLATAFORMA ============================== */
function Pillars() {
  return (
    <section id="plataforma" className="bg-muted py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            O que o SIMOVE faz
          </p>
          <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
            O Centro inteiro no seu bolso.
          </h2>
        </div>

        <div className="mt-16 space-y-14">
          {PILLARS.map((p) => (
            <div key={p.id}>
              <div data-reveal className="rule flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-5">
                <span className="font-display text-sm font-bold text-primary">{p.n}</span>
                <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.lead}</p>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {p.features.map((f) => (
                  <article key={f.title} data-reveal>
                    <Icon name={f.icon} className="h-5 w-5 text-primary" />
                    <h4 className="mt-4 font-display text-sm font-bold leading-snug">
                      {f.title}
                      {f.badge && (
                        <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wider text-primary">
                          {f.badge}
                        </span>
                      )}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== TOTEM ============================== */
function MapSection() {
  return (
    <section id="totem" className="mx-auto grid max-w-6xl items-start gap-14 px-5 py-24 lg:grid-cols-[1.1fr_1fr]">
      <div className="max-w-xl">
        <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {MAP.n}
        </p>
        <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
          {MAP.title}
        </h2>
        <p data-reveal className="mt-5 text-base leading-relaxed text-muted-foreground">{MAP.lead}</p>

        <div data-reveal className="mt-10">
          {MAP.bullets.map(([b, rest]) => (
            <div key={b} className="rule py-4">
              <p className="text-sm leading-relaxed">
                <strong>{b}</strong>, <span className="text-muted-foreground">{rest}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a data-reveal href="/totem" className="btn btn-primary">
            Abrir a simulação do totem
            <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a data-reveal href="/catalogo" className="btn btn-outline">
            Ver a vitrine das lojas
          </a>
        </div>

        <p data-reveal className="caption mt-6">{MAP.note}</p>
      </div>

      <div data-reveal>
        <Photo photo={PHOTOS.totem} className="mx-auto w-full max-w-sm" ratio="aspect-[13/20]" />
      </div>
    </section>
  );
}

/* ============================== COMPRA PREMIADA ============================== */
function Prize() {
  return (
    <section id="premiada" className="bg-muted py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {PRIZE.n}
          </p>
          <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
            {PRIZE.title}
          </h2>
          <p data-reveal className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{PRIZE.body}</p>

          <div data-reveal className="mt-10">
            {PRIZE.points.map(([b, rest]) => (
              <div key={b} className="rule py-4">
                <p className="text-sm leading-relaxed">
                  <strong>{b}</strong> <span className="text-muted-foreground">{rest}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pt-16">
          <div data-reveal className="hairline bg-background p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Seu número da sorte
            </p>
            <div className="mt-5">
              <PrizeRoll digits={PRIZE.ticket} />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Sorteio no dia 30.</p>
          </div>
          <p data-reveal className="caption mt-6">{PRIZE.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ============================== COMO FUNCIONA ============================== */
function How() {
  return (
    <section id="como" className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em]">
            Como funciona
          </p>
          <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
            Do aviso no WhatsApp ao desconto na próxima compra.
          </h2>
          <p data-reveal className="mt-5 max-w-md text-base leading-relaxed">
            Sem instalar aplicativo: tudo acontece no WhatsApp que você já usa.
          </p>

          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {STEPS.map((s) => (
              <article key={s.k} data-reveal className="border-t border-primary-foreground pt-5">
                <span className="font-display text-sm font-bold">{s.k}</span>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div data-reveal className="flex justify-center">
          <Phone />
        </div>
      </div>
    </section>
  );
}

/* ============================== EVENTOS ============================== */
function Events() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {EVENTS.n}
          </p>
          <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
            {EVENTS.title}
          </h2>
          <p data-reveal className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{EVENTS.body}</p>
        </div>
        <Photo photo={PHOTOS.musica} ratio="aspect-[3/2]" />
      </div>
    </section>
  );
}

/* ============================== CTA ============================== */
// No celular a seção ocupa a tela inteira: quem chega no CTA vê só o formulário.
function Cta() {
  return (
    <section id="cta" className="grid min-h-dvh content-center bg-muted py-16 lg:block lg:min-h-0 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <p data-reveal className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-success">
            <Icon name="success" className="h-4 w-4" /> WhatsApp
          </p>
          <h2 data-reveal className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
            {FORM.title}
          </h2>
          <p data-reveal className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{FORM.sub}</p>
          <p data-reveal className="mt-6 text-xs text-muted-foreground">
            Prefere a página completa?{" "}
            <a href="/cadastro" className="font-semibold text-primary underline underline-offset-2">
              Abrir o cadastro
            </a>{" "}
            ·{" "}
            <a href="/pontos" className="font-semibold text-primary underline underline-offset-2">
              Consultar meus pontos
            </a>{" "}
            ·{" "}
            <a href="/catalogo" className="font-semibold text-primary underline underline-offset-2">
              Ver a vitrine
            </a>
          </p>
        </div>
        <div data-reveal>
          <WhatsForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-12">
      <div className="rule flex flex-col gap-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold text-foreground">
            {BRAND.name} <span className="font-normal text-muted-foreground">· {BRAND.tagline}</span>
          </p>
          <p className="mt-1">{BRAND.place}, {BRAND.city}.</p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed sm:text-right">
          {PHOTOS.credit} Projeto de hackathon, sem vínculo oficial com a Prefeitura.
        </p>
      </div>
    </footer>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const scope = useRef(null);
  useReveal(scope);
  useGSAP(() => ScrollTrigger.refresh(), { scope });

  return (
    <div ref={scope}>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        {/* 21/9 vira uma fresta num celular: no estreito a foto fica em 3/2. */}
        <Photo photo={PHOTOS.mercado} className="mx-auto max-w-6xl px-5 pb-4" ratio="aspect-[3/2] sm:aspect-[21/9]" />
        <Pillars />
        <MapSection />
        <Prize />
        <How />
        <Events />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
