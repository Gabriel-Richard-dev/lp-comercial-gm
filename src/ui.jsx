import { useRef, useState } from "react";
import { maskPhone, validPhone, validEmail } from "./phone";
import { PHOTOS } from "./data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Quem marcou "menos movimento" no sistema recebe a página parada: acelerar a
   linha do tempo global faz toda animação do gsap terminar no primeiro quadro,
   sem tocar em tween nenhum. O resto (marquee, rolagem suave) o CSS corta. */
export const MENOS_MOVIMENTO =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (MENOS_MOVIMENTO) gsap.globalTimeline.timeScale(1000);

/* ---------- ícones ---------- */
const PATHS = {
  ticket:
    "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Zm6 1v6h2V9H9Z",
  tag: "M11 2h9v9l-9 9-9-9 9-9Zm5 3a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 16 5Z",
  success: "M12 3C6.9 3 3 6.6 3 11c0 2.3 1.1 4.3 2.9 5.7L5 21l4.6-1.6c.8.2 1.6.3 2.4.3 5.1 0 9-3.6 9-8S17.1 3 12 3Z",
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
  // Redes do permissionário. O WhatsApp reusa `success`, que já é o ícone dele
  // em toda a página — e o verde da marca é reservado justamente a esse par.
  instagram:
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.6 6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
  facebook:
    "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.45-.13-2.42 0-4.08 1.48-4.08 4.2v2.34H7.5V13h2.67v8h3.33Z",
};

/* ---------- símbolo da marca (app icon) ---------- */
export function Logo({ className = "h-9 w-9" }) {
  return (
    <img
      src="/marca/icon.svg"
      alt=""
      aria-hidden="true"
      width={36}
      height={36}
      className={`shrink-0 ${className}`}
    />
  );
}

/* ---------- logotipo: "SIM" em primary, "OVE" em success (IDENTITY.md §1) ----------
   A divisão de cor no meio da palavra é o traço mais reconhecível da marca. É a única
   superfície em que o verde aparece fora de "aberto agora" e "falar no WhatsApp". */
export function Wordmark({ className = "text-lg", descritivo = false, mono = false }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-tight ${className}`}>
      <span className={mono ? undefined : "text-primary"}>SIM</span>
      <span className={mono ? undefined : "text-success"}>OVE</span>
      {descritivo && (
        <span
          className={`ml-2 align-middle text-xs font-bold uppercase tracking-[0.08em] ${
            mono ? "" : "text-primary"
          }`}
        >
          Maracanaú modas e artigos
        </span>
      )}
    </span>
  );
}

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
      <div className={`overflow-hidden bg-muted ${ratio}`}>
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
        <div key={i} className="h-16 w-11 overflow-hidden bg-primary sm:h-20 sm:w-14" aria-hidden="true">
          <div className="reel-strip">
            {Array.from({ length: STRIP }, (_, j) => (
              <div
                key={j}
                className="flex h-16 items-center justify-center font-display text-3xl font-bold text-primary-foreground sm:h-20 sm:text-4xl"
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
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  // sem backend ainda: trocar por POST no webhook do WhatsApp Business.
  const submit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Escreva seu nome.");
    if (!validPhone(phone)) return setErr("WhatsApp inválido. Use DDD e número, como (85) 9 9999-9999.");
    if (email && !validEmail(email)) return setErr("E-mail inválido. Confira se tem @ e o domínio.");
    setErr("");
    setSent(true);
  };

  if (sent)
    return (
      <div className="flex items-center gap-3 hairline border-success bg-card p-5">
        <Icon name="check" className="h-6 w-6 shrink-0 text-success" />
        <p className="text-sm">
          Pronto, <strong>{name.split(" ")[0]}</strong>. As ofertas do Centro vão chegar no seu WhatsApp
          {email && " e no seu e-mail"}.
        </p>
      </div>
    );

  // Rótulo sempre visível acima do campo: o DS proíbe placeholder como rótulo.
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="rotulo" htmlFor="wf-nome">Nome</label>
        <input
          id="wf-nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como quer ser chamado"
          autoComplete="given-name"
          className="campo mt-2"
        />
      </div>
      <div>
        <label className="rotulo" htmlFor="wf-whats">WhatsApp</label>
        <input
          id="wf-whats"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          placeholder="(85) 9 9999-9999"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={!!err}
          aria-describedby={err ? "wf-erro" : undefined}
          className="campo mt-2"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="rotulo" htmlFor="wf-email">
          E-mail <span className="font-normal normal-case">(opcional)</span>
        </label>
        <input
          id="wf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          inputMode="email"
          autoComplete="email"
          className="campo mt-2"
        />
        <p className="caption mt-1.5">Se preferir receber os avisos por e-mail também.</p>
      </div>
      <button type="submit" className="btn btn-whatsapp sm:col-span-2">
        <Icon name="success" className="h-5 w-5" />
        Receber no WhatsApp
      </button>
      {err && (
        <p id="wf-erro" role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>
      )}
      <p className="caption sm:col-span-2">
        Só ofertas do Centro Geraldo Machado. Para sair, basta responder SAIR ou usar o link de descadastro do e-mail. O consentimento fica registrado, como pede a LGPD.
      </p>
    </form>
  );
}

/* ---------- QR gerado em CSS ---------- */
/**
 * Quadriculado com cara de QR, para a apresentação.
 *
 * Não codifica nada e não é lido por leitor nenhum — é adereço, e por isso
 * `aria-hidden`. Com `seed`, o desenho muda por loja em vez de repetir o mesmo
 * padrão em todas; sem `seed`, fica o de sempre.
 *
 * Deliberadamente não é um QR de verdade: um código escaneável precisaria de um
 * número, e inventar número manda quem escaneia para a linha de um estranho.
 */
export function FakeQR({ className = "h-14 w-14", seed = null, modules = 9 }) {
  const meio = modules - 3;
  return (
    <div
      className={`grid gap-px bg-card p-1 ${className}`}
      style={{ gridTemplateColumns: `repeat(${modules}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {Array.from({ length: modules * modules }, (_, i) => {
        const r = Math.floor(i / modules);
        const c = i % modules;
        // Os três blocos de canto ficam cheios, como as marcas de orientação de
        // um QR. Antes a condição usava r e c absolutos: só o canto superior
        // esquerdo fechava, e os outros dois saíam listrados.
        const corner = (r < 3 && c < 3) || (r < 3 && c >= meio) || (r >= meio && c < 3);
        let on;
        if (corner) {
          on = true;
        } else if (seed) {
          const v = i * 7 + (seed.charCodeAt(i % seed.length) || 0) * 13 + seed.length * 31;
          on = ((Math.imul(v, 2654435761) >>> 16) & 1) === 1;
        } else {
          on = (i * 7) % 3 === 0;
        }
        return <div key={i} className={on ? "bg-primary" : "bg-card"} />;
      })}
    </div>
  );
}

/* ---------- telas do aplicativo ---------- */
const SCREENS = [
  {
    head: "WhatsApp",
    body: (
      <>
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-success text-success-foreground">
            <Icon name="success" className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-semibold">SIMOVE Maracanaú</p>
        </div>
        <div className="max-w-[88%] bg-muted p-2.5">
          <p className="text-xs leading-relaxed">
            Hoje no Box 12: sandália a partir de <strong>R$ 29,90</strong>.
          </p>
        </div>
        <div className="max-w-[88%] bg-muted p-2.5">
          <p className="text-xs leading-relaxed">
            Cupom <strong>LARISSA10</strong> vale 10% até sexta.
          </p>
        </div>
        <div className="ml-auto max-w-[70%] bg-muted p-2.5">
          <p className="text-xs">quero!</p>
        </div>
      </>
    ),
  },
  {
    head: "Seus pontos",
    body: (
      <>
        <div className="bg-primary p-3.5 text-primary-foreground">
          <p className="text-xs opacity-70">Saldo</p>
          <p className="font-display text-3xl font-bold">340</p>
          <p className="text-xs opacity-70">duas trocas por desconto nos boxes</p>
        </div>
        <div className="hairline p-3">
          <p className="text-xs font-semibold">Indique e ganhe</p>
          <p className="mt-1 text-xs text-muted-foreground">A pessoa compra, vocês dois pontuam.</p>
          <div className="mt-2 flex items-center gap-1.5 bg-muted px-2 py-1.5">
            <Icon name="share" className="h-3 w-3 text-primary" />
            <span className="text-xs font-semibold">simove.app/gabi</span>
          </div>
        </div>
      </>
    ),
  },
  {
    head: "Compra Premiada",
    body: (
      <>
        <div className="border border-dashed border-primary bg-secondary p-4 text-center">
          <Icon name="gift" className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1.5 text-xs text-muted-foreground">Seu número da sorte</p>
          <p className="font-display text-2xl font-bold tracking-[0.15em]">042817</p>
        </div>
        <div className="bg-muted p-3">
          <p className="text-xs font-semibold">Sorteio dia 30</p>
          <p className="mt-1 text-xs text-muted-foreground">Você tem 3 números este mês.</p>
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
      <div className="relative h-[400px] w-[200px] rounded-[1.75rem] bg-primary p-2.5 shadow-sm">
        <div className="absolute left-1/2 top-3 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-primary-foreground" />
        <div className="relative h-full overflow-hidden rounded-[1.25rem] bg-card">
          {SCREENS.map((s) => (
            <div key={s.head} className="screen absolute inset-0 flex flex-col gap-2 px-3 pb-4 pt-8">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.head}</p>
              {s.body}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { PHOTOS };
