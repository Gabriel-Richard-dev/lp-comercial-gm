import { useRef, useState } from "react";
import { maskPhone, validPhone } from "./phone";
import { SECTORS, BOXES, SEG_FILTERS, PHOTOS } from "./data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ---------- ícones ---------- */
const PATHS = {
  ticket:
    "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Zm6 1v6h2V9H9Z",
  tag: "M11 2h9v9l-9 9-9-9 9-9Zm5 3a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 16 5Z",
  zap: "M12 3C6.9 3 3 6.6 3 11c0 2.3 1.1 4.3 2.9 5.7L5 21l4.6-1.6c.8.2 1.6.3 2.4.3 5.1 0 9-3.6 9-8S17.1 3 12 3Z",
  music: "M9 18.5a2.8 2.8 0 1 1-2-2.7V5.2L19 3v10.3a2.8 2.8 0 1 1-2-2.7V5.4L9 6.9v11.6Z",
  star: "m12 2 3 6.5 7 .9-5.1 4.8 1.3 7L12 17.8 5.8 21.2l1.3-7L2 9.4l7-.9L12 2Z",
  stars: "m9 2 2.2 4.8L16 7.5l-3.6 3.4.9 5L9 13.4 4.7 15.9l.9-5L2 7.5l4.8-.7L9 2Zm8.5 10 1.2 2.6 2.8.4-2 1.9.5 2.8-2.5-1.4-2.5 1.4.5-2.8-2-1.9 2.8-.4L17.5 12Z",
  share:
    "M18 2a3 3 0 0 0-2.9 3.8L8.9 9.3a3 3 0 1 0 0 5.4l6.2 3.5A3 3 0 1 0 16.1 16l-6.2-3.5a3 3 0 0 0 0-1l6.2-3.5A3 3 0 1 0 18 2Z",
  coffee: "M4 5h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V5Zm14 1h1.4a2.6 2.6 0 0 1 0 5.2H18V6ZM3 19h15v2H3v-2Z",
  gift: "M3 12h18v9H3v-9Zm-1-5h20v4H2V7Zm7.2-5a2.6 2.6 0 0 0 0 5.2H11V4.6A2.6 2.6 0 0 0 9.2 2Zm5.6 0A2.6 2.6 0 0 0 13 4.6v2.6h1.8a2.6 2.6 0 0 0 0-5.2Z",
  bag: "M6 7V6a6 6 0 1 1 12 0v1h3l-1.5 14h-15L3 7h3Zm2 0h8V6a4 4 0 0 0-8 0v1Z",
  spark: "m12 2 2.2 6.3L21 10.5l-6.1 2.7L12 21l-2.9-7.8L3 10.5l6.8-2.2L12 2Z",
  pin: "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 3v6l5 2 .8-1.8L13 11.4V7h-2Z",
  arrow: "M5 12h12.2l-4.6-4.6L14 6l7 6-7 6-1.4-1.4 4.6-4.6H5v-2Z",
  check: "m9.6 16.2-3.8-3.8L4.4 13.8l5.2 5.2L20 8.6l-1.4-1.4-9 9Z",
  mega: "M4 3h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8.4L4 20V4a1 1 0 0 1 1-1Zm3 5v2h10V8H7Zm0 4v2h7v-2H7Z",
};

export function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.spark} />
    </svg>
  );
}

/* ---------- reveal padrão ---------- */
export function useReveal(scope) {
  useGSAP(
    () => {
      gsap.set("[data-reveal]", { opacity: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out", overwrite: true }),
      });
    },
    { scope, dependencies: [] }
  );
}

/* ---------- contador ---------- */
export function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(obj.n).toLocaleString("pt-BR") + suffix;
        },
      });
    },
    { scope: ref }
  );
  return <span ref={ref}>0{suffix}</span>;
}

/* ---------- foto oficial, com revelação por clip-path e legenda ---------- */
export function Photo({ photo, className = "", ratio = "aspect-[3/2]", priority = false }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      gsap.from(ref.current.querySelector("img"), {
        clipPath: "inset(0% 0% 100% 0%)",
        scale: 1.12,
        duration: 1.25,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );

  return (
    <figure ref={ref} className={className}>
      <div className={`overflow-hidden bg-sand ${ratio}`}>
        <img
          src={photo.src}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      </div>
      {photo.caption && <figcaption className="caption mt-3 max-w-md">{photo.caption}</figcaption>}
    </figure>
  );
}

/* ---------- roleta da Compra Premiada ---------- */
export function PrizeRoll({ digits }) {
  const ref = useRef(null);
  const STRIP = 30; // três voltas de 0-9

  useGSAP(
    () => {
      gsap.fromTo(
        gsap.utils.toArray(".reel-strip", ref.current),
        { yPercent: 0 },
        {
          yPercent: (i) => -((20 + Number(digits[i])) / STRIP) * 100,
          duration: 2.2,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 82%" },
        }
      );
    },
    { scope: ref, dependencies: [digits.join("")] }
  );

  return (
    <div ref={ref} className="flex gap-1.5" role="img" aria-label={`Número da sorte ${digits.join("")}`}>
      {digits.map((d, i) => (
        <div key={i} className="h-16 w-11 overflow-hidden bg-ink sm:h-20 sm:w-14" aria-hidden="true">
          <div className="reel-strip">
            {Array.from({ length: STRIP }, (_, j) => (
              <div
                key={j}
                className="flex h-16 items-center justify-center font-display text-3xl font-bold text-paper sm:h-20 sm:text-4xl"
              >
                {j % 10}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- opt-in do WhatsApp ---------- */
export function WhatsForm() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  // sem backend ainda: trocar por POST no webhook do WhatsApp Business.
  const submit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Escreva seu nome.");
    if (!validPhone(phone)) return setErr("WhatsApp inválido. Use DDD e número, como (85) 9 9999-9999.");
    setErr("");
    setSent(true);
  };

  if (sent)
    return (
      <div className="flex items-center gap-3 border border-zap/30 bg-zap/8 p-5">
        <Icon name="check" className="h-6 w-6 shrink-0 text-zap" />
        <p className="text-sm">
          Pronto, <strong>{name.split(" ")[0]}</strong>. As ofertas do Centro vão chegar no seu WhatsApp.
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <label className="sr-only" htmlFor="nome">Nome</label>
      <input
        id="nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        autoComplete="given-name"
        className="hairline bg-paper px-4 py-3 text-sm outline-none placeholder:text-mist focus:border-navy"
      />
      <label className="sr-only" htmlFor="zap">WhatsApp</label>
      <input
        id="zap"
        value={phone}
        onChange={(e) => setPhone(maskPhone(e.target.value))}
        placeholder="(85) 9 9999-9999"
        inputMode="tel"
        autoComplete="tel"
        aria-invalid={!!err}
        className="hairline bg-paper px-4 py-3 text-sm outline-none placeholder:text-mist focus:border-navy"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-navy px-6 py-3 text-sm font-semibold text-paper transition hover:bg-ink"
      >
        Quero receber <Icon name="arrow" className="h-4 w-4" />
      </button>
      {err && (
        <p role="alert" className="text-xs text-accent-ink sm:col-span-3">{err}</p>
      )}
      <p className="caption sm:col-span-3">
        Só ofertas do Centro Geraldo Machado. Para sair, basta responder SAIR. O consentimento fica registrado, como pede a LGPD.
      </p>
    </form>
  );
}

/* ---------- QR gerado em CSS ---------- */
export function FakeQR({ className = "h-14 w-14" }) {
  return (
    <div className={`grid grid-cols-9 gap-px bg-paper p-1 ${className}`} aria-hidden="true">
      {Array.from({ length: 81 }, (_, i) => {
        const r = Math.floor(i / 9);
        const c = i % 9;
        const corner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
        const on = corner ? (r === 0 || r === 2 || c === 0 || c === 2 || (r === 1 && c === 1)) : (i * 7) % 3 === 0;
        return <div key={i} className={on ? "bg-ink" : "bg-paper"} />;
      })}
    </div>
  );
}

/* ---------- planta: quatro blocos de 15 boxes em volta da praça ---------- */
// azul topo · amarelo direita · vermelho base · verde esquerda
function cellPos(i) {
  if (i < 15) return { gridRow: 1 + Math.floor(i / 5), gridColumn: 4 + (i % 5) };
  if (i < 30) return { gridRow: 4 + Math.floor((i - 15) / 3), gridColumn: 9 + ((i - 15) % 3) };
  if (i < 45) return { gridRow: 9 + Math.floor((i - 30) / 5), gridColumn: 4 + ((i - 30) % 5) };
  return { gridRow: 4 + Math.floor((i - 45) / 3), gridColumn: 1 + ((i - 45) % 3) };
}

export function FloorMap() {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const [hover, setHover] = useState(null);

  useGSAP(
    () => {
      gsap.from(".box-cell", {
        opacity: 0,
        scale: 0.4,
        duration: 0.45,
        ease: "back.out(1.8)",
        stagger: { each: 0.008, from: "center", grid: [11, 11] },
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    },
    { scope: ref }
  );

  useGSAP(
    () => {
      gsap.utils.toArray(".box-cell", ref.current).forEach((el) => {
        const on = !active || el.dataset.seg === active;
        gsap.to(el, { opacity: on ? 1 : 0.15, duration: 0.35, ease: "power2.out" });
      });
    },
    { scope: ref, dependencies: [active] }
  );

  const shown = hover ?? null;
  const hits = active ? BOXES.filter((b) => b.seg === active).length : 0;

  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {SEG_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setActive(active === s ? null : s)}
            aria-pressed={active === s}
            className={`px-2.5 py-1 text-[11px] font-semibold transition ${
              active === s ? "bg-ink text-paper" : "hairline text-mist hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid aspect-square grid-cols-11 grid-rows-11 gap-[3px]">
        {BOXES.map((b, i) => (
          <button
            key={b.n}
            style={{ ...cellPos(i), backgroundColor: SECTORS[b.s].hex }}
            data-seg={b.seg}
            onMouseEnter={() => setHover(b)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(b)}
            onBlur={() => setHover(null)}
            className="box-cell grid place-items-center text-[8px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-ink sm:text-[10px]"
            aria-label={`Box ${b.n}, ${b.name}, ${b.seg}, ${SECTORS[b.s].label}`}
          >
            {b.n}
          </button>
        ))}

        <div
          style={{ gridColumn: "4 / 9", gridRow: "4 / 9" }}
          className="relative grid place-items-center bg-sand-2"
        >
          <p className="text-[9px] font-bold uppercase leading-tight tracking-[0.2em] text-mist sm:text-[10px]">
            Circulação
          </p>
          <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[8px] font-semibold text-accent-ink sm:text-[9px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="ping absolute inline-flex h-full w-full rounded-full bg-accent" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            você está aqui
          </span>
        </div>
      </div>

      <div className="rule-soft mt-3 flex min-h-9 flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
        <div className="flex flex-wrap gap-2.5">
          {Object.values(SECTORS).map((s) => (
            <span key={s.label} className="flex items-center gap-1 text-[10px] text-mist">
              <span className="h-2 w-2" style={{ backgroundColor: s.hex }} />
              {s.label.replace("Setor ", "")}
            </span>
          ))}
        </div>
        <p className="text-[11px] font-semibold" aria-live="polite">
          {shown ? (
            <>
              {shown.n} · {shown.name} <span className="font-normal text-mist">· {shown.seg}</span>
            </>
          ) : active ? (
            `${hits} boxes vendem ${active}`
          ) : (
            <span className="font-normal text-mist">Escolha um segmento</span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ---------- o totem ---------- */
export function Totem({ children }) {
  return (
    <div className="mx-auto w-full max-w-sm bg-ink p-3">
      <div className="bg-paper">
        <div className="border-b border-navy/15 px-5 py-5 text-center">
          <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-mist">
            Centro Público Comercial
          </p>
          <p className="font-display text-lg font-bold uppercase tracking-tight text-navy">Geraldo Machado</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-mist">Maracanaú</p>
        </div>

        <div className="px-4 py-5">{children}</div>

        <div className="flex items-center gap-3 bg-navy px-4 py-3">
          <FakeQR className="h-12 w-12" />
          <div>
            <p className="font-display text-[11px] font-bold text-paper">Baixe o SiMove</p>
            <p className="text-[9px] leading-snug text-paper/70">
              Ofertas, eventos, pontos e a Compra Premiada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- telas do aplicativo ---------- */
const SCREENS = [
  {
    head: "WhatsApp",
    body: (
      <>
        <div className="flex items-center gap-2 border-b border-ink/10 pb-2">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-zap text-white">
            <Icon name="zap" className="h-3.5 w-3.5" />
          </div>
          <p className="text-[10px] font-semibold">SiMove Maracanaú</p>
        </div>
        <div className="max-w-[88%] bg-sand p-2.5">
          <p className="text-[10px] leading-relaxed">
            Hoje no Box 12: sandália a partir de <strong>R$ 29,90</strong>.
          </p>
        </div>
        <div className="max-w-[88%] bg-sand p-2.5">
          <p className="text-[10px] leading-relaxed">
            Cupom <strong>LARISSA10</strong> vale 10% até sexta.
          </p>
        </div>
        <div className="ml-auto max-w-[70%] bg-zap/15 p-2.5">
          <p className="text-[10px]">quero!</p>
        </div>
      </>
    ),
  },
  {
    head: "Seus pontos",
    body: (
      <>
        <div className="bg-navy p-3.5 text-paper">
          <p className="text-[9px] opacity-70">Saldo</p>
          <p className="font-display text-3xl font-bold">340</p>
          <p className="text-[9px] opacity-70">dois cafés nos boxes de alimentação</p>
        </div>
        <div className="hairline p-3">
          <p className="text-[10px] font-semibold">Indique e ganhe</p>
          <p className="mt-1 text-[9px] text-mist">A pessoa compra, vocês dois pontuam.</p>
          <div className="mt-2 flex items-center gap-1.5 bg-sand px-2 py-1.5">
            <Icon name="share" className="h-3 w-3 text-accent" />
            <span className="text-[9px] font-semibold">simove.app/gabi</span>
          </div>
        </div>
      </>
    ),
  },
  {
    head: "Compra Premiada",
    body: (
      <>
        <div className="border border-dashed border-accent/50 bg-accent/6 p-4 text-center">
          <Icon name="gift" className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-1.5 text-[9px] text-mist">Seu número da sorte</p>
          <p className="font-display text-2xl font-bold tracking-[0.15em]">042817</p>
        </div>
        <div className="bg-sand p-3">
          <p className="text-[10px] font-semibold">Sorteio dia 30</p>
          <p className="mt-1 text-[9px] text-mist">Você tem 3 números este mês.</p>
        </div>
      </>
    ),
  },
];

export function Phone({ className = "" }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const screens = gsap.utils.toArray(".screen", ref.current);
      gsap.set(screens, { autoAlpha: 0, y: 16 });
      gsap.set(screens[0], { autoAlpha: 1, y: 0 });
      const tl = gsap.timeline({ repeat: -1, defaults: { duration: 0.5, ease: "power2.inOut" } });
      screens.forEach((_, i) => {
        const next = screens[(i + 1) % screens.length];
        tl.to(screens[i], { autoAlpha: 0, y: -16, delay: 2.8 }).fromTo(
          next,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0 },
          "<0.15"
        );
      });
      return () => tl.kill();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative h-[400px] w-[200px] rounded-[1.75rem] bg-ink p-2.5 shadow-xl shadow-ink/20">
        <div className="absolute left-1/2 top-3 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-white/25" />
        <div className="relative h-full overflow-hidden rounded-[1.25rem] bg-paper">
          {SCREENS.map((s) => (
            <div key={s.head} className="screen absolute inset-0 flex flex-col gap-2 px-3 pb-4 pt-8">
              <p className="text-[11px] font-bold uppercase tracking-wide text-mist">{s.head}</p>
              {s.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { PHOTOS };
