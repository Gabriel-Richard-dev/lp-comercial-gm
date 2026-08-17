import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  BRAND, PHOTOS, HERO, STATS, SEGMENTS, PROBLEMS, PILLARS, MAP, PRIZE,
  STEPS, EVENTS, AUDIENCES, ROADMAP, FORM,
} from "./data";
import { Icon, Counter, Photo, Phone, PrizeRoll, WhatsForm, Wordmark, useReveal } from "./ui";

/* ============================== NAV ============================== */
function Nav() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { y: -70, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.15 });
      // a cor da barra vem de .nav-solida, no CSS — nenhum literal aqui
      ScrollTrigger.create({ start: 70, onToggle: (s) => ref.current?.classList.toggle("nav-solida", s.isActive) });
    },
    { scope: ref }
  );

  return (
    <nav ref={ref} className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#topo" className="flex items-baseline gap-2">
          <Wordmark className="text-lg" />
          <span className="hidden text-xs text-muted-foreground sm:inline">{BRAND.tagline}</span>
        </a>
        <div className="hidden items-center gap-6 text-xs text-muted-foreground lg:flex">
          {[
            ["Hoje", "#hoje"],
            ["Plataforma", "#plataforma"],
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
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.2 });
      tl.from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.7 })
        .from(".word", { yPercent: 110, duration: 1, stagger: 0.08 }, "-=0.35")
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-cta", { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.55")
        .from(".hero-meta", { opacity: 0, duration: 0.8 }, "-=0.5");

      // a foto sobe devagar enquanto a página rola
      gsap.to(".hero-photo img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: ".hero-photo", start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    },
    { scope: ref }
  );

  return (
    <header ref={ref} id="topo" className="pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {HERO.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-display font-bold leading-[0.98] tracking-[-0.035em]">
          {HERO.title.map((w, i) => (
            <span key={i} className="block overflow-hidden py-[0.04em]">
              <span className={`word inline-block ${i === 2 ? "text-primary" : ""}`}>{w}</span>
            </span>
          ))}
        </h1>

        <div className="rule mt-10 grid gap-8 pt-8 md:grid-cols-[1.2fr_1fr]">
          <p className="hero-sub max-w-xl text-base leading-relaxed text-muted-foreground">{HERO.sub}</p>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2.5">
              {HERO.ctas.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className={
                    c.primary
                      ? "hero-cta btn btn-primary"
                      : "hero-cta btn btn-outline"
                  }
                >
                  {c.label}
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="hero-meta flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Icon name="pin" className="mt-px h-3.5 w-3.5 shrink-0" />
              {BRAND.address}, {BRAND.city}.
            </p>
          </div>
        </div>
      </div>

      <div className="hero-photo mt-14 overflow-hidden">
        <div className="aspect-[16/9] max-h-[70vh] w-full overflow-hidden bg-muted sm:aspect-[21/9]">
          <img
            src={PHOTOS.entrada.src}
            alt={PHOTOS.entrada.alt}
            className="h-full w-full scale-110 object-cover"
          />
        </div>
        <div className="mx-auto max-w-6xl px-5">
          <p className="caption mt-3">{PHOTOS.entrada.caption} {PHOTOS.credit}</p>
        </div>
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
    <div className="mt-20 flex overflow-hidden border-y border-border py-3.5">
      {strip(false)}
      {strip(true)}
    </div>
  );
}

/* ============================== NÚMEROS ============================== */
function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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

/* ============================== HOJE (o problema) ============================== */
function Problems() {
  return (
    <section id="hoje" className="bg-muted py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Como está hoje
            </p>
            <h2
              data-reveal
              className="mt-5 max-w-lg font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
            >
              O movimento existe. O alcance é que para na calçada.
            </h2>
            <Photo photo={PHOTOS.mercado} className="mt-10" ratio="aspect-[4/3]" />
          </div>

          <div>
            {PROBLEMS.map((p) => (
              <div key={p.n} data-reveal className="rule py-7 first:border-t-0 first:pt-0">
                <div className="flex gap-5">
                  <span className="font-display text-sm font-bold text-primary">{p.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== A PLATAFORMA ============================== */
function Pillars() {
  return (
    <section id="plataforma" className="mx-auto max-w-6xl px-5 py-24">
      <div className="max-w-2xl">
        <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          A plataforma
        </p>
        <h2
          data-reveal
          className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
        >
          Onze recursos, quatro objetivos.
        </h2>
        <p data-reveal className="mt-5 text-base leading-relaxed text-muted-foreground">
          Trazer gente nova, fazer voltar, ampliar a venda de cada box e entregar número à Secretaria.
        </p>
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
    </section>
  );
}

/* ============================== TOTEM ============================== */
function MapSection() {
  return (
    <section id="totem" className="bg-muted py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {MAP.n}
          </p>
          <h2
            data-reveal
            className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
          >
            {MAP.title}
          </h2>
          <p data-reveal className="mt-5 text-base leading-relaxed text-muted-foreground">{MAP.lead}</p>
          <p data-reveal className="mt-4 text-base leading-relaxed text-muted-foreground">{MAP.body}</p>

          <div data-reveal className="mt-10">
            {MAP.bullets.map(([b, rest]) => (
              <div key={b} className="rule py-4">
                <p className="text-sm leading-relaxed">
                  <strong>{b}</strong>, <span className="text-muted-foreground">{rest}</span>
                </p>
              </div>
            ))}
          </div>

          <a
            data-reveal
            href="/totem"
            className="btn btn-primary mt-8"
          >
            Abrir a simulação do totem
            <Icon name="arrow" className="h-4 w-4" />
          </a>

          <p data-reveal className="caption mt-6">{MAP.note}</p>
        </div>

        <div data-reveal>
          <Photo photo={PHOTOS.totem} className="mx-auto w-full max-w-sm" ratio="aspect-[13/20]" />
        </div>
      </div>
    </section>
  );
}

/* ============================== COMPRA PREMIADA ============================== */
function Prize() {
  return (
    <section id="premiada" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p data-reveal className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {PRIZE.n}
          </p>
          <h2
            data-reveal
            className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
          >
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
          <div data-reveal className="hairline bg-muted p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Seu número da sorte
            </p>
            <div className="mt-5">
              <PrizeRoll digits={PRIZE.ticket} />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Sorteio no dia 30.</p>
          </div>
          <p data-reveal className="caption mt-6">
            <strong className="text-foreground">Atenção jurídica.</strong> {PRIZE.note}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================== COMO FUNCIONA ============================== */
function How() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const track = ref.current.querySelector(".track");
      const panels = gsap.utils.toArray(".panel", track);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 80),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            scrub: 0.8,
            end: () => "+=" + (track.scrollWidth - window.innerWidth + 400),
            invalidateOnRefresh: true,
          },
        });
        panels.forEach((p) => {
          gsap.from(p.querySelector(".panel-in"), {
            opacity: 0.2,
            y: 30,
            scrollTrigger: {
              trigger: p,
              containerAnimation: tween,
              start: "left 78%",
              end: "left 42%",
              scrub: true,
            },
          });
        });
        return () => tween.kill();
      });
    },
    { scope: ref }
  );

  return (
    <section id="como" ref={ref} className="overflow-hidden bg-primary py-24 text-primary-foreground md:py-0">
      <div className="md:flex md:h-screen md:items-center">
        <div className="track flex flex-col gap-10 px-5 md:flex-row md:gap-16 md:px-[8vw]">
          <div className="panel shrink-0 md:w-[34vw]">
            <div className="panel-in">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground">
                Como funciona
              </p>
              <h2 className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]">
                Do post do influenciador ao painel da Secretaria.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground">
                Um caminho só, sem maquininha nova e sem exigir que o permissionário instale nada.
              </p>
              <div className="mt-8 hidden items-center gap-2 text-xs text-primary-foreground md:flex">
                <Icon name="arrow" className="h-4 w-4" /> role para o lado
              </div>
            </div>
          </div>

          {STEPS.map((s) => (
            <article key={s.k} className="panel shrink-0 md:w-[24vw]">
              <div className="panel-in border-t border-primary-foreground pt-5">
                <span className="font-display text-sm font-bold text-primary">{s.k}</span>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug">{s.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-primary-foreground">{s.body}</p>
              </div>
            </article>
          ))}

          <div className="panel flex shrink-0 items-center justify-center md:w-[26vw]">
            <div className="panel-in">
              <Phone />
            </div>
          </div>
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
          <h2
            data-reveal
            className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
          >
            {EVENTS.title}
          </h2>
          <p data-reveal className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{EVENTS.body}</p>
        </div>
        <Photo photo={PHOTOS.musica} ratio="aspect-[3/2]" />
      </div>
    </section>
  );
}

/* ============================== PARA QUEM ============================== */
function Audiences() {
  return (
    <section className="bg-muted py-24">
      <div className="mx-auto max-w-6xl px-5">
        <h2
          data-reveal
          className="max-w-xl font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
        >
          Três lados, o mesmo sistema.
        </h2>
        <p data-reveal className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          O lado do permissionário vive no WhatsApp. Se depender de instalar aplicativo, ele não usa.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.who} data-reveal className="rule pt-5">
              <h3 className="font-display text-lg font-bold">{a.who}</h3>
              <ul className="mt-5 space-y-3">
                {a.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== ROADMAP ============================== */
function Roadmap() {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.from(".line-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 72%", end: "bottom 72%", scrub: 0.7 },
      });
    },
    { scope: ref }
  );

  return (
    <section id="roadmap" ref={ref} className="mx-auto max-w-6xl px-5 py-24">
      <h2
        data-reveal
        className="font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
      >
        O que roda agora e o que vem depois.
      </h2>
      <div className="relative mb-10 mt-12 h-px w-full bg-[color:var(--edge)]">
        <div className="line-fill h-px w-full bg-primary" />
      </div>
      <div className="grid gap-8 md:grid-cols-4">
        {ROADMAP.map((r, i) => (
          <div key={r.phase} data-reveal>
            <div className="mb-3 flex items-center gap-2">
              <span className={`h-1.5 w-1.5 ${i === 0 ? "bg-primary" : "bg-border"}`} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r.phase}</span>
            </div>
            <h3 className="font-display text-lg font-bold">{r.label}</h3>
            <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              {r.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================== CTA ============================== */
function Cta() {
  return (
    <section id="cta" className="bg-muted py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1fr_1fr]">
        <div>
          <p data-reveal className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-success">
            <Icon name="success" className="h-4 w-4" /> WhatsApp
          </p>
          <h2
            data-reveal
            className="mt-5 font-display text-secao font-bold leading-[1.08] tracking-[-0.025em]"
          >
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
          {PHOTOS.credit} Dados do Centro e do município: Prefeitura de Maracanaú e IBGE.
          Projeto de hackathon, sem vínculo oficial com a Prefeitura.
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
        <Problems />
        <Pillars />
        <MapSection />
        <Prize />
        <How />
        <Events />
        <Audiences />
        <Roadmap />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
