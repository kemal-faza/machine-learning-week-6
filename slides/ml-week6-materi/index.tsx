import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useIsActivePage,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#F3EAD8', text: '#211A14', accent: '#DD3B2C' },
  fonts: {
    display: "'Anton', 'Arial Narrow', 'Helvetica Neue', sans-serif",
    body: "'Work Sans', system-ui, -apple-system, sans-serif",
  },
  typeScale: { hero: 150, body: 30 },
  radius: 4,
};

/* ── webfonts: one link, keyed to this slide (home page mounts every slide) ── */
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Anton&family=Work+Sans:wght@400;500;600;700;800&family=Caveat:wght@500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
const FONT_LINK_ID = 'osd-webfont-ml-week6-materi';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

/* ── motion: one DNA; off-page pages are still, reduced-motion is honored ── */
const STYLE_ID = 'osd-styles-ml-week6-materi';
const css = `
  @keyframes w6r-rise { from { opacity: 0; transform: translateY(20px); } }
  @keyframes w6r-fade { from { opacity: 0; } }
  @keyframes w6r-pop  { from { opacity: 0; transform: rotate(8deg) scale(0.85); } }
  @keyframes w6r-wipe { from { transform: scaleX(0); } }
  .w6r-rise { animation: w6r-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .w6r-fade { animation: w6r-fade 0.75s ease both; }
  .w6r-pop  { animation: w6r-pop 0.7s cubic-bezier(0.34, 1.4, 0.4, 1) both; }
  .w6r-wipe { animation: w6r-wipe 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: left center; }
  [data-still] .w6r-rise, [data-still] .w6r-fade, [data-still] .w6r-pop, [data-still] .w6r-wipe { animation: none !important; }
  @media (prefers-reduced-motion: reduce) {
    .w6r-rise, .w6r-fade, .w6r-pop, .w6r-wipe { animation: none !important; }
  }
`;
if (typeof document !== 'undefined') {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  if (style.textContent !== css) style.textContent = css;
}

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

/** House transition: a 6px rise — barely enough to register. */
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

/* ── riso palette ── */
const C = {
  paper: '#F3EAD8',
  card: '#FBF5E7',
  ink: '#211A14',
  soft: '#4C4238',
  muted: '#7C6C59',
  red: '#DD3B2C',
  redSoft: 'rgba(221, 59, 44, 0.16)',
  teal: '#1B7A6C',
  tealSoft: 'rgba(27, 122, 108, 0.14)',
  yellow: '#C99A0C',
  yellowSoft: 'rgba(242, 190, 46, 0.30)',
  hairline: 'rgba(33, 26, 20, 0.18)',
  rule: 'rgba(33, 26, 20, 0.32)',
};
const dotRed = 'rgba(221, 59, 44, 0.32)';
const dotTeal = 'rgba(27, 122, 108, 0.28)';
const dotYellow = 'rgba(242, 190, 46, 0.55)';
const mono = "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace";
const hand = "'Caveat', cursive";

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
  letterSpacing: '-0.005em',
};

const display: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.005em',
  lineHeight: 1.04,
};

/* ── shared bits ─────────────────────────────────────────────────────────── */

const Halftone = ({
  tone = dotRed,
  size = 360,
  right = -150,
  top = -150,
  opacity = 0.5,
  bottom,
}: {
  tone?: string;
  size?: number;
  right?: number;
  top?: number;
  opacity?: number;
  bottom?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      right,
      top,
      bottom,
      opacity,
      pointerEvents: 'none',
      backgroundImage: `radial-gradient(${tone} 2.6px, transparent 3.1px)`,
      backgroundSize: '15px 15px',
    }}
  />
);

const Arrow = ({
  d = 'M8 12 C56 16 100 36 112 74',
  head = 'M98 62 L114 80 L124 54',
  w = 140,
  h = 92,
  tone = C.teal,
}: {
  d?: string;
  head?: string;
  w?: number;
  h?: number;
  tone?: string;
}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
    <path d={d} stroke={tone} strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d={head} stroke={tone} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Tag = ({
  tone = C.red,
  children,
  style,
}: {
  tone?: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <span
    style={{
      display: 'inline-block',
      border: `2px solid ${tone}`,
      color: tone,
      fontFamily: mono,
      fontSize: 16,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      padding: '5px 12px',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

const Card = ({
  tone = C.teal,
  pad = 26,
  children,
  style,
}: {
  tone?: string;
  pad?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      background: C.card,
      border: `3px solid ${C.ink}`,
      boxShadow: `9px 9px 0 ${tone}`,
      padding: pad,
      ...style,
    }}
  >
    {children}
  </div>
);

const Li = ({
  tone = C.red,
  size = 25,
  children,
}: {
  tone?: string;
  size?: number;
  children: ReactNode;
}) => (
  <li style={{ display: 'flex', gap: 16, alignItems: 'baseline', fontSize: size, lineHeight: 1.5, fontWeight: 500 }}>
    <span style={{ width: 12, height: 12, background: tone, flex: 'none', transform: 'translateY(-2px)' }} />
    <span>{children}</span>
  </li>
);

const Hl = ({ children, tone = C.yellowSoft }: { children: ReactNode; tone?: string }) => (
  <span style={{ background: tone, padding: '0 6px 2px' }}>{children}</span>
);

const Formula = ({
  tone = C.teal,
  label,
  children,
  size = 29,
}: {
  tone?: string;
  label?: string;
  children: ReactNode;
  size?: number;
}) => (
  <div
    style={{
      background: C.card,
      border: `3px solid ${C.ink}`,
      boxShadow: `8px 8px 0 ${tone}`,
      padding: '22px 28px',
    }}
  >
    {label && (
      <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
        {label}
      </div>
    )}
    <div style={{ fontFamily: mono, fontSize: size, lineHeight: 1.5 }}>{children}</div>
  </div>
);

const Note = ({
  children,
  tone = C.teal,
  rotate = -3,
  size = 33,
  style,
}: {
  children: ReactNode;
  tone?: string;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    className="w6r-fade"
    style={{ fontFamily: hand, fontSize: size, lineHeight: 1.06, color: tone, transform: `rotate(${rotate}deg)`, ...style }}
  >
    {children}
  </div>
);

const Calc = ({
  tone = C.ink,
  note,
  children,
}: {
  tone?: string;
  note?: string;
  children: ReactNode;
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 28,
      padding: '13px 4px',
      borderTop: `1.5px solid ${C.hairline}`,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 25, color: tone }}>{children}</div>
    {note && <div style={{ fontSize: 21, fontWeight: 700, color: C.muted, textAlign: 'right' }}>{note}</div>}
  </div>
);

const Th = ({
  children,
  w,
  align = 'left',
  tone = C.ink,
}: {
  children: ReactNode;
  w?: number;
  align?: 'left' | 'center' | 'right';
  tone?: string;
}) => (
  <th
    style={{
      width: w,
      textAlign: align,
      fontFamily: mono,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: tone,
      padding: '0 14px 10px',
      borderBottom: `3px solid ${C.ink}`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </th>
);

const Td = ({
  children,
  align = 'left',
  tone,
  strong,
  num,
}: {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  tone?: string;
  strong?: boolean;
  num?: boolean;
}) => (
  <td
    style={{
      textAlign: align,
      padding: '10px 14px',
      fontSize: 22,
      lineHeight: 1.32,
      fontWeight: strong ? 700 : 500,
      fontFamily: num ? mono : undefined,
      color: tone,
      borderBottom: `1.5px solid ${C.hairline}`,
    }}
  >
    {children}
  </td>
);

/* ── page shell ──────────────────────────────────────────────────────────── */

const Sheet = ({
  chapter,
  tone = C.red,
  right = 'WEEK 06 · SUPERVISED LEARNING',
  foot = 'kNN · DECISION TREE · SVM',
  children,
}: {
  chapter: string;
  tone?: string;
  right?: string;
  foot?: string;
  children: ReactNode;
}) => {
  const active = useIsActivePage();
  const { current, total } = useSlidePageNumber();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Halftone size={380} right={-170} top={-170} opacity={0.42} />
      <div
        className="w6r-fade"
        style={{ position: 'absolute', left: 110, top: 48, display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <span style={{ width: 16, height: 16, background: tone, display: 'inline-block' }} />
        <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.soft }}>
          {chapter}
        </span>
      </div>
      <div
        className="w6r-fade"
        style={{
          position: 'absolute',
          right: 110,
          top: 48,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: C.muted,
          textTransform: 'uppercase',
          animationDelay: '0.06s',
        }}
      >
        {right}
      </div>
      <div style={{ position: 'absolute', left: 110, right: 110, top: 108, bottom: 88 }}>{children}</div>
      <div
        className="w6r-fade"
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          bottom: 38,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: C.muted,
          textTransform: 'uppercase',
          animationDelay: '0.4s',
        }}
      >
        <span>{foot}</span>
        <span style={{ fontFamily: mono }}>
          {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

const Head = ({
  kicker,
  tone = C.red,
  title,
  lead,
  right,
}: {
  kicker: string;
  tone?: string;
  title: ReactNode;
  lead?: ReactNode;
  right?: ReactNode;
}) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40 }}>
    <div style={{ maxWidth: right ? 1340 : undefined }}>
      <Tag tone={tone}>{kicker}</Tag>
      <h2 className="w6r-rise" style={{ ...display, margin: '20px 0 0', fontSize: 58, animationDelay: '0.05s' }}>
        {title}
      </h2>
      {lead && (
        <p
          className="w6r-rise"
          style={{ margin: '14px 0 0', maxWidth: 1330, fontSize: 26, lineHeight: 1.5, color: C.soft, fontWeight: 500, animationDelay: '0.1s' }}
        >
          {lead}
        </p>
      )}
    </div>
    {right}
  </div>
);
/* ═══ 01 · COVER ═══════════════════════════════════════════════════════════ */

const Cover: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={{ ...fill, padding: '76px 110px 46px', display: 'flex', flexDirection: 'column' }} data-still={active ? undefined : ''}>
      <Halftone size={520} right={-150} top={-160} opacity={0.6} />
      <div style={{ position: 'absolute', left: -130, bottom: 150, width: 300, height: 300, borderRadius: '50%', opacity: 0.5, backgroundImage: `radial-gradient(${dotTeal} 2.6px, transparent 3.1px)`, backgroundSize: '15px 15px', pointerEvents: 'none' }} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, fontWeight: 700, letterSpacing: '0.14em' }}>
        <div className="w6r-fade" style={{ animationDelay: '0.05s' }}>
          <span style={{ display: 'inline-block', width: 16, height: 16, background: C.red, marginRight: 16, transform: 'translateY(1px)' }} />
          PEMBELAJARAN MESIN · MINGGU 6
        </div>
        <div className="w6r-fade" style={{ color: C.soft, fontWeight: 600, animationDelay: '0.15s' }}>
          SUPERVISED LEARNING · KLASIFIKASI
        </div>
      </header>

      <div className="w6r-pop" style={{ position: 'absolute', top: 118, right: 118, background: C.red, color: C.card, border: `4px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: '16px 30px 14px', textAlign: 'center', transform: 'rotate(5deg)', animationDelay: '0.4s' }}>
        <div style={{ ...display, fontSize: 52 }}>Week 06</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.3em', marginTop: 6 }}>3 METODE KLASIK</div>
      </div>

      <main style={{ marginTop: 40 }}>
        <h1 style={{ ...display, margin: 0, fontSize: 138 }}>
          <span className="w6r-rise" style={{ display: 'block', animationDelay: '0.2s' }}>kNN</span>
          <span className="w6r-rise" style={{ display: 'block', animationDelay: '0.28s' }}>Decision Tree</span>
          <span className="w6r-rise" style={{ display: 'block', animationDelay: '0.36s' }}>
            <span style={{ color: C.red }}>&</span> SVM
          </span>
        </h1>

        <div className="w6r-wipe" style={{ display: 'inline-block', marginTop: 24, background: C.red, color: C.card, fontSize: 24, fontWeight: 800, letterSpacing: '0.2em', padding: '11px 24px 9px', transform: 'rotate(-1.2deg)', boxShadow: `7px 7px 0 ${C.ink}`, animationDelay: '0.5s' }}>
          RANGKUMAN · 21 SEKSI TRANSKRIP
        </div>

        <p className="w6r-rise" style={{ margin: '26px 0 0', fontSize: 29, lineHeight: 1.5, fontWeight: 500, color: C.soft, maxWidth: 1060, animationDelay: '0.6s' }}>
          Tiga cara mesin mengenali pola: dari <strong>kemiripan</strong> tetangga, dari <strong>aturan</strong> pohon keputusan, sampai{' '}
          <strong>margin</strong> terlebar SVM.
        </p>
      </main>

      <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
        <div className="w6r-rise" style={{ background: C.card, border: `3px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.teal}`, padding: '18px 24px 20px', animationDelay: '0.7s' }}>
          <div style={{ ...display, fontSize: 32, color: C.teal }}>01</div>
          <div style={{ fontSize: 27, fontWeight: 800, marginTop: 4 }}>k-Nearest Neighbor</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.soft, marginTop: 4, lineHeight: 1.4 }}>Mirip tetangga terdekat — hitung jarak, urutkan, voting.</div>
        </div>
        <div className="w6r-rise" style={{ background: C.card, border: `3px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.red}`, padding: '18px 24px 20px', animationDelay: '0.8s' }}>
          <div style={{ ...display, fontSize: 32, color: C.red }}>02</div>
          <div style={{ fontSize: 27, fontWeight: 800, marginTop: 4 }}>Decision Tree</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.soft, marginTop: 4, lineHeight: 1.4 }}>Entropi & information gain — atribut paling informatif menang.</div>
        </div>
        <div className="w6r-rise" style={{ background: C.card, border: `3px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.yellow}`, padding: '18px 24px 20px', animationDelay: '0.9s' }}>
          <div style={{ ...display, fontSize: 32, color: C.yellow }}>03</div>
          <div style={{ fontSize: 27, fontWeight: 800, marginTop: 4 }}>Support Vector Machine</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: C.soft, marginTop: 4, lineHeight: 1.4 }}>Hyperplane bermargin maksimum — plus kernel trick.</div>
        </div>
      </div>

      <footer className="w6r-fade" style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, letterSpacing: '0.2em', color: C.muted, animationDelay: '1s' }}>
        <span>MATA KULIAH · PEMBELAJARAN MESIN</span>
        <span>KEMIRIPAN · ATURAN · MARGIN</span>
      </footer>
    </div>
  );
};
Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

/* ═══ 02 · PETA MATERI ══════════════════════════════════════════════════════ */

const PetaTopik = ({ no, tone, title, seksi, items }: { no: string; tone: string; title: string; seksi: string; items: string[] }) => (
  <Card tone={tone} pad={24} style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ ...display, fontSize: 44, color: tone }}>{no}</span>
      <Tag tone={tone}>{seksi}</Tag>
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8, lineHeight: 1.15 }}>{title}</div>
    <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
      <Li tone={tone} size={21}>{items[0]}</Li>
      <Li tone={tone} size={21}>{items[1]}</Li>
      <Li tone={tone} size={21}>{items[2]}</Li>
      <Li tone={tone} size={21}>{items[3]}</Li>
      <Li tone={tone} size={21}>{items[4]}</Li>
    </ul>
  </Card>
);

const Peta: Page = () => (
  <Sheet chapter="Peta Materi" tone={C.red}>
    <Head
      kicker="Agenda"
      tone={C.red}
      title={<>Tiga Topik, Satu Alur Belajar</>}
      lead="Rangkuman inti dari 21 seksi transkrip: definisi, cara kerja, contoh hitung, dan isu praktis saat menerapkan."
    />
    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 44 }}>
      <PetaTopik
        no="01"
        tone={C.teal}
        title="k-Nearest Neighbor"
        seksi="7 seksi"
        items={[
          'Lazy vs eager learning',
          'Intuisi & Voronoi tessellation',
          'Ukuran jarak: Euclidean s.d. Mahalanobis',
          'Contoh hitung kertas tisu',
          'Memilih k, normalisasi, efisiensi',
        ]}
      />
      <PetaTopik
        no="02"
        tone={C.red}
        title="Decision Tree"
        seksi="8 seksi"
        items={[
          'Anatomi pohon: root, branch, leaf',
          'Studi kasus 14 sampel main tenis',
          'Entropi & information gain',
          'Pohon menjadi set of rules',
          'Overfitting, pruning, C4.5, one-hot',
        ]}
      />
      <PetaTopik
        no="03"
        tone={C.yellow}
        title="Support Vector Machine"
        seksi="6 seksi"
        items={[
          'Hyperplane, margin, support vector',
          'Derivasi matematis margin',
          'Contoh linear: hitung w, b, prediksi',
          'Kernel trick & kernel polinomial',
          'Implementasi Python (scikit-learn)',
        ]}
      />
    </div>
    <div className="w6r-fade" style={{ marginTop: 38, border: `3px solid ${C.ink}`, background: C.card, boxShadow: `9px 9px 0 ${dotYellow}`, padding: '18px 28px', display: 'flex', alignItems: 'center', gap: 26, animationDelay: '0.4s' }}>
      <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.14em', color: C.red, fontWeight: 600 }}>ALUR</span>
      <span style={{ fontSize: 25, fontWeight: 700 }}>
        kemiripan <span style={{ color: C.muted }}>(lazy)</span> → aturan <span style={{ color: C.muted }}>(eager)</span> → margin{' '}
        <span style={{ color: C.muted }}>(eager)</span>
      </span>
      <span style={{ marginLeft: 'auto', fontFamily: hand, fontSize: 30, color: C.teal, transform: 'rotate(-2deg)' }}>
        urutannya penting!
      </span>
    </div>
  </Sheet>
);
Peta.transition = transition;

/* ═══ 03 · FONDASI: PIPELINE ═══════════════════════════════════════════════ */

const FlowBox = ({ children, tone = C.ink, dim }: { children: ReactNode; tone?: string; dim?: boolean }) => (
  <div
    style={{
      border: `3px solid ${tone}`,
      background: C.card,
      padding: '12px 18px',
      minWidth: 210,
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 700,
      lineHeight: 1.25,
      opacity: dim ? 0.4 : 1,
    }}
  >
    {children}
  </div>
);

const FlowArrow = () => <span style={{ fontFamily: mono, fontSize: 30, color: C.red, fontWeight: 600 }}>→</span>;

const Fondasi: Page = () => (
  <Sheet chapter="Fondasi · Supervised Learning" tone={C.red}>
    <Head
      kicker="Konteks"
      tone={C.red}
      title={<>Dua Proses: Latih Dulu, Uji Kemudian</>}
      lead="Semua metode memakai pipeline yang sama — pembedanya: kapan komputasi besar dijalankan."
    />

    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card tone={C.teal} pad={18} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: mono, fontSize: 17, letterSpacing: '0.22em', color: C.teal, textTransform: 'uppercase' }}>
          Training · batch
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <FlowBox>Data berlabel</FlowBox>
          <FlowArrow />
          <FlowBox>Preprocessing</FlowBox>
          <FlowArrow />
          <FlowBox>Ekstraksi fitur</FlowBox>
          <FlowArrow />
          <FlowBox tone={C.teal}>Latih model</FlowBox>
          <span style={{ marginLeft: 8, fontFamily: hand, fontSize: 29, color: C.soft, transform: 'rotate(-2deg)' }}>← lazy berhenti sebelum ini</span>
        </div>
      </Card>

      <Card tone={C.red} pad={18} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: mono, fontSize: 17, letterSpacing: '0.22em', color: C.red, textTransform: 'uppercase' }}>
          Testing · real-time
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <FlowBox>Data uji baru</FlowBox>
          <FlowArrow />
          <FlowBox>Preprocessing</FlowBox>
          <FlowArrow />
          <FlowBox>Ekstraksi fitur</FlowBox>
          <FlowArrow />
          <FlowBox tone={C.red}>Prediksi kelas</FlowBox>
          <span style={{ marginLeft: 8, fontFamily: hand, fontSize: 29, color: C.soft, transform: 'rotate(-2deg)' }}>langsung, tanpa latih ulang</span>
        </div>
      </Card>
    </div>

    <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Batch learning</div>
        <p style={{ margin: '8px 0 0', fontSize: 21, lineHeight: 1.42, color: C.soft, fontWeight: 500 }}>
          Proses pembelajaran dijalankan lebih dulu, bisa offline, hasilnya model (eager) atau sekadar feature vector yang disimpan (lazy).
        </p>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Real-time process</div>
        <p style={{ margin: '8px 0 0', fontSize: 21, lineHeight: 1.42, color: C.soft, fontWeight: 500 }}>
          Begitu data uji datang, prediksi dijalankan. Metode eager tinggal memakai model; metode lazy baru mulai menghitung.
        </p>
      </div>
    </div>
  </Sheet>
);
Fondasi.transition = transition;

/* ═══ 04 · LAZY vs EAGER ═══════════════════════════════════════════════════ */

const LazyVsEager: Page = () => (
  <Sheet chapter="kNN · Seksi 1" tone={C.teal} foot="kNN · DECISION TREE · SVM">
    <Head
      kicker="Konsep Kunci"
      tone={C.teal}
      title={<>Lazy vs Eager Learning</>}
      lead="Keduanya supervised learning. Bedanya bukan pada hasil akhir, tapi pada kapan biaya komputasi dibayar."
    />

    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52 }}>
      <Card tone={C.teal} pad={30}>
        <Tag tone={C.teal}>Lazy · kNN</Tag>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 14 }}>“Nanti saja saat ditanya.”</div>
        <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <Li tone={C.teal} size={23}>Prediksi = menghitung kemiripan ke <Hl>seluruh</Hl> sampel latih.</Li>
          <Li tone={C.teal} size={23}>Batch learning berhenti di ekstraksi fitur — hasilnya disimpan.</Li>
          <Li tone={C.teal} size={23}>Tanpa prior knowledge soal distribusi data.</Li>
          <Li tone={C.teal} size={23}>Dikenal juga sebagai <strong>instance-based learning</strong>.</Li>
        </ul>
        <div style={{ marginTop: 18, fontFamily: mono, fontSize: 20, color: C.muted, borderTop: `1.5px solid ${C.hairline}`, paddingTop: 14 }}>
          1 data uji × 100 latih = 100 × hitung jarak<br />10 data uji × 100 latih = 1.000 × hitung jarak
        </div>
      </Card>

      <Card tone={C.red} pad={30}>
        <Tag tone={C.red}>Eager · DT & SVM</Tag>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 14 }}>“Dibangun dulu, dipakai berkali-kali.”</div>
        <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <Li tone={C.red} size={23}>Model klasifikasi / <em>target function</em> dibangun dari data latih.</Li>
          <Li tone={C.red} size={23}>Training = batch learning penuh, lalu model disimpan.</Li>
          <Li tone={C.red} size={23}>Testing cepat: data uji langsung diklasifikasi model.</Li>
          <Li tone={C.red} size={23}>SVM memilih hyperplane dengan margin sebesar mungkin.</Li>
        </ul>
        <div style={{ marginTop: 18, fontFamily: mono, fontSize: 20, color: C.muted, borderTop: `1.5px solid ${C.hairline}`, paddingTop: 14 }}>
          hasil training = model siap pakai<br />biaya mahal di depan, murah di belakang
        </div>
      </Card>
    </div>

    <div style={{ marginTop: 30, display: 'flex', alignItems: 'flex-start', gap: 18 }}>
      <Note rotate={-2} size={34} style={{ color: C.teal }}>
        biayanya tidak sama: kNN menunda hitung ke setiap prediksi
      </Note>
      <div style={{ marginLeft: 'auto', marginTop: -10 }}>
        <Arrow d="M10 80 C50 70 90 46 104 14" head="M90 26 L106 10 L112 34" />
      </div>
    </div>
  </Sheet>
);
LazyVsEager.transition = transition;
/* ═══ 05 · kNN INTUISI ══════════════════════════════════════════════════════ */

const KnnIntuisi: Page = () => (
  <Sheet chapter="kNN · Seksi 2" tone={C.teal}>
    <Head
      kicker="Intuisi"
      tone={C.teal}
      title={<>Yang Terdekat Biasanya Menang</>}
      lead="Koleksi latih: 8 lingkaran merah dan 9 segitiga biru, dua fitur X1 dan X2. Satu sampel kotak baru harus diprediksi kelasnya."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56, alignItems: 'start' }}>
      <svg viewBox="0 0 660 520" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <line x1="70" y1="40" x2="70" y2="470" stroke={C.rule} strokeWidth="2" />
        <line x1="70" y1="470" x2="640" y2="470" stroke={C.rule} strokeWidth="2" />
        <text x="52" y="36" fontFamily={mono} fontSize="19" fill={C.muted}>X2</text>
        <text x="628" y="492" fontFamily={mono} fontSize="19" fill={C.muted}>X1</text>
        <circle cx="545" cy="300" r="26" fill="none" stroke={C.teal} strokeWidth="2.5" strokeDasharray="7 6" />
        <circle cx="430" cy="205" r="26" fill="none" stroke={C.teal} strokeWidth="2.5" strokeDasharray="7 6" />
        <circle cx="445" cy="320" r="170" fill="none" stroke={C.muted} strokeWidth="2" strokeDasharray="8 8" opacity="0.55" />
        <circle cx="400" cy="120" r="12" fill={C.red} />
        <circle cx="470" cy="80" r="12" fill={C.red} />
        <circle cx="560" cy="140" r="12" fill={C.red} />
        <circle cx="500" cy="190" r="12" fill={C.red} />
        <circle cx="585" cy="235" r="12" fill={C.red} />
        <circle cx="430" cy="205" r="12" fill={C.red} />
        <circle cx="545" cy="300" r="12" fill={C.red} />
        <circle cx="390" cy="280" r="12" fill={C.red} />
        <polygon points="150,285 137,309 163,309" fill={C.teal} />
        <polygon points="215,240 202,264 228,264" fill={C.teal} />
        <polygon points="105,380 92,404 118,404" fill={C.teal} />
        <polygon points="175,415 162,439 188,439" fill={C.teal} />
        <polygon points="255,355 242,379 268,379" fill={C.teal} />
        <polygon points="300,300 287,324 313,324" fill={C.teal} />
        <polygon points="130,440 117,464 143,464" fill={C.teal} />
        <polygon points="260,180 247,204 273,204" fill={C.teal} />
        <polygon points="220,95 207,119 233,119" fill={C.teal} />
        <rect x="433" y="308" width="24" height="24" fill={C.card} stroke={C.ink} strokeWidth="4" />
        <text x="440" y="268" fontFamily={hand} fontSize="30" fill={C.ink}>data uji</text>
        <text x="512" y="92" fontFamily={mono} fontSize="18" fill={C.red}>kelas merah</text>
        <text x="86" y="186" fontFamily={mono} fontSize="18" fill={C.teal}>kelas biru</text>
        <text x="470" y="170" fontFamily={mono} fontSize="17" fill={C.muted}>← tetangga terdekat</text>
      </svg>

      <div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Li tone={C.teal} size={25}>
            Setiap sampel = <strong>feature vector</strong> (X1, X2); X1 jadi sumbu mendatar, X2 sumbu tegak.
          </Li>
          <Li tone={C.teal} size={25}>
            Tanpa menghitung apa pun, mata langsung menebak kelas <strong>merah</strong>: sampel uji paling dekat dengan lingkaran merah, dan jauh dari semua segitiga biru.
          </Li>
          <Li tone={C.teal} size={25}>
            Idenya: <Hl>kelas sebuah titik ditentukan oleh tetangga terdekatnya</Hl> — fitur yang mirip → kelas yang sama.
          </Li>
          <Li tone={C.teal} size={25}>
            Karena itu kNN tidak butuh asumsi distribusi data: cukup data latih dan cara mengukur kemiripan.
          </Li>
        </ul>
        <Note rotate={-2} size={33} style={{ marginTop: 26 }}>
          intuisi dulu, rumus menyusul — dan data uji di lapangan tidak cuma satu!
        </Note>
      </div>
    </div>
  </Sheet>
);
KnnIntuisi.transition = transition;

/* ═══ 06 · CARA KERJA + VORONOI ════════════════════════════════════════════ */

const Langkah = ({ no, tone, title, children }: { no: string; tone: string; title: string; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <div style={{ ...display, fontSize: 42, color: tone, lineHeight: 0.9, minWidth: 54 }}>{no}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 22, lineHeight: 1.45, color: C.soft, fontWeight: 500, marginTop: 4 }}>{children}</div>
    </div>
  </div>
);

const KnnCaraKerja: Page = () => (
  <Sheet chapter="kNN · Seksi 3" tone={C.teal}>
    <Head
      kicker="Cara Kerja"
      tone={C.teal}
      title={<>Hitung, Urutkan, Voting</>}
      lead="Tiga langkah yang sama dipakai untuk setiap data uji. Batas keputusan akhirnya terbentuk dari area Voronoi tiap titik."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 52, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Langkah no="1" tone={C.red} title="Hitung jarak">
          Ukur kemiripan data uji ke <strong>setiap</strong> sampel latih — misalnya Euclidean distance.
        </Langkah>
        <Langkah no="2" tone={C.red} title="Urutkan & ambil k">
          Cari k sampel dengan jarak <strong>terkecil</strong> (nilai D paling kecil = paling mirip).
        </Langkah>
        <Langkah no="3" tone={C.red} title="Voting mayoritas">
          Lihat label k tetangga itu, lalu ambil kelas yang paling dominan sebagai prediksi.
        </Langkah>
        <div style={{ marginTop: 4 }}>
          <Note rotate={-2} size={31}>
            k = banyaknya tetangga yang dilibatkan — bukan satu-satunya pilihan: coba 1, lalu 3, lalu 5.
          </Note>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 26 }}>
        <div>
          <svg viewBox="0 0 400 400" width="100%" style={{ display: 'block' }} aria-hidden="true">
            <circle cx="120" cy="180" r="11" fill={C.red} />
            <circle cx="300" cy="180" r="11" fill={C.red} />
            <line x1="120" y1="180" x2="300" y2="180" stroke={C.muted} strokeWidth="2" strokeDasharray="7 6" />
            <line x1="210" y1="40" x2="210" y2="360" stroke={C.red} strokeWidth="3" />
            <circle cx="210" cy="180" r="6" fill={C.ink} />
            <text x="132" y="238" fontFamily={mono} fontSize="18" fill={C.muted}>jarak sama</text>
            <text x="222" y="70" fontFamily={mono} fontSize="18" fill={C.red}>garis tegak lurus</text>
            <text x="24" y="372" fontFamily={mono} fontSize="17" fill={C.muted}>titik tengah → batas area</text>
          </svg>
          <div style={{ marginTop: 8, fontFamily: mono, fontSize: 16, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase' }}>
            Batas = titik yang berjarak sama
          </div>
        </div>
        <div>
          <svg viewBox="0 0 660 400" width="100%" style={{ display: 'block' }} aria-hidden="true">
            <circle cx="430" cy="90" r="11" fill={C.red} />
            <circle cx="540" cy="140" r="11" fill={C.red} />
            <circle cx="480" cy="230" r="11" fill={C.red} />
            <circle cx="580" cy="290" r="11" fill={C.red} />
            <circle cx="150" cy="120" r="11" fill={C.teal} />
            <circle cx="110" cy="250" r="11" fill={C.teal} />
            <circle cx="210" cy="320" r="11" fill={C.teal} />
            <circle cx="300" cy="300" r="11" fill={C.teal} />
            <path d="M320 0 L280 90 L340 180 L290 260 L350 340 L310 400" stroke={C.ink} strokeWidth="3.5" fill="none" />
            <rect x="392" y="300" width="20" height="20" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
            <text x="424" y="320" fontFamily={hand} fontSize="28" fill={C.ink}>di sini?</text>
            <text x="120" y="62" fontFamily={mono} fontSize="17" fill={C.teal}>area biru</text>
            <text x="500" y="62" fontFamily={mono} fontSize="17" fill={C.red}>area merah</text>
          </svg>
          <div style={{ marginTop: 8, fontFamily: mono, fontSize: 16, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase' }}>
            Voronoi tessellation → boundary non-linear
          </div>
        </div>
      </div>
    </div>
    <div className="w6r-fade" style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 20, animationDelay: '0.35s' }}>
      <Tag tone={C.teal}>catatan</Tag>
      <span style={{ fontSize: 23, fontWeight: 600, color: C.soft }}>
        Hasil boundary-nya bisa <Hl>non-linear</Hl> — kNN tidak hanya untuk masalah yang bisa dipisah garis lurus.
      </span>
    </div>
  </Sheet>
);
KnnCaraKerja.transition = transition;

/* ═══ 07 · ALGORITMA FORMAL ════════════════════════════════════════════════ */

const KnnAlgoritma: Page = () => (
  <Sheet chapter="kNN · Seksi 5" tone={C.teal}>
    <Head
      kicker="Algoritma"
      tone={C.teal}
      title={<>Dari Notasi ke Keputusan</>}
      lead="Data latih pasangan (Xi, Yi); data uji X tanpa label. Tiga langkah tadi, ditulis formal."
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'start' }}>
      <div>
      <Steps>
        <Step>
          <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '16px 4px' }}>
            <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, letterSpacing: '0.14em' }}>LANGKAH 1 · JARAK</div>
            <div style={{ fontFamily: mono, fontSize: 30, marginTop: 8 }}>D(X, Xi)  untuk setiap  i</div>
            <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 6 }}>
              Ukur kemiripan data uji X dengan tiap sampel latih Xi — pilihan ukurannya adalah hyperparameter.
            </div>
          </div>
        </Step>
        <Step>
          <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '16px 4px' }}>
            <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, letterSpacing: '0.14em' }}>LANGKAH 2 · k TETANGGA</div>
            <div style={{ fontFamily: mono, fontSize: 30, marginTop: 8 }}>ambil k nilai D terkecil</div>
            <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 6 }}>
              Nilai D paling kecil = paling mirip. Ambil sejumlah k sampel latih (Xi, Yi) dari daftar terurut.
            </div>
          </div>
        </Step>
        <Step>
          <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '16px 4px' }}>
            <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, letterSpacing: '0.14em' }}>LANGKAH 3 · KEPUTUSAN</div>
            <div style={{ fontFamily: mono, fontSize: 30, marginTop: 8 }}>Y = mayoritas(Yi dari k tetangga)</div>
            <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 6 }}>
              Kelas dengan jumlah suara terbanyak jadi prediksi — bukan jarak totalnya, tapi jumlah suaranya.
            </div>
          </div>
        </Step>
      </Steps>
    </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Formula label="Euclidean distance" tone={C.teal} size={27}>
          D(X, Xi) = √ Σ<sub>d=1..D</sub> (X<sub>d</sub> − X<sub>i,d</sub>)²
        </Formula>
        <Card tone={C.red} pad={24}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Dua hyperparameter</div>
          <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Li tone={C.red} size={21}>Ukuran kemiripan / distance</Li>
            <Li tone={C.red} size={21}>Nilai k (jumlah tetangga)</Li>
          </ul>
          <div style={{ marginTop: 14, fontSize: 20, color: C.soft, fontWeight: 500, lineHeight: 1.45 }}>
            Keduanya dicoba lewat validation set — bukan dipilih asal.
          </div>
        </Card>
        <Note rotate={-2} size={31}>
          target function-nya sendiri adalah classification boundary-nya
        </Note>
      </div>
    </div>
  </Sheet>
);
KnnAlgoritma.transition = transition;

/* ═══ 08 · UKURAN JARAK I ══════════════════════════════════════════════════ */

const KnnJarak1: Page = () => (
  <Sheet chapter="kNN · Seksi 5" tone={C.teal}>
    <Head
      kicker="Ukuran Jarak · 1/2"
      tone={C.teal}
      title={<>Euclidean: Simetris, tapi Pilih-pilih Skala</>}
      lead="Ukuran paling umum. Dua sifatnya yang perlu diingat justru yang paling sering bikin prediksi meleset."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 52, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone={C.teal} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Sifat 1 — simetris (spherical)</div>
          <div style={{ fontFamily: mono, fontSize: 21, marginTop: 8 }}>
            D(X, Xi) = D(Xi, X)  →  dibolak-balik hasilnya sama
          </div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Karena selisihnya dikuadratkan, arah tidak berpengaruh. Semua dimensi juga dianggap setara bobotnya.
          </div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Sifat 2 — sensitif perbedaan ekstrem</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Fitur dengan rentang besar mendominasi: selisih usia 5 tahun tidak berarti apa-apa di samping selisih gaji 500 ribu.
          </div>
          <div style={{ marginTop: 12, background: C.yellowSoft, padding: '10px 14px', fontFamily: mono, fontSize: 19, lineHeight: 1.5 }}>
            yg mirip: gaji beda 500rb — bukan yang usia beda 5 th<br />
            padahal bisa jadi justru usia yang menentukan → misclassified
          </div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 600, marginTop: 10 }}>
            Obatnya: normalisasi (dibahas di halaman isu).
          </div>
        </Card>
      </div>

      <div>
        <Steps>
          <Step>
            <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '14px 4px', fontFamily: mono, fontSize: 24 }}>
              D(P1, P2) = √( (0−2)² + (2−0)² ) = √8
            </div>
          </Step>
          <Step>
            <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '14px 4px', fontFamily: mono, fontSize: 24 }}>
              = 2√2 ≈ 2,83  <span style={{ color: C.muted }}>(P1 = (0,2), P2 = (2,0))</span>
            </div>
          </Step>
          <Step>
            <div style={{ borderTop: `1.5px solid ${C.hairline}`, padding: '14px 4px', fontFamily: mono, fontSize: 24 }}>
              D(P4, P3) = √( (5−3)² + (1−1)² ) = √4 = 2
            </div>
          </Step>
        </Steps>
        <svg viewBox="0 0 560 360" width="100%" style={{ display: 'block', marginTop: 18, height: 460 }} aria-hidden="true">
          <line x1="70" y1="40" x2="70" y2="320" stroke={C.rule} strokeWidth="2" />
          <line x1="70" y1="320" x2="530" y2="320" stroke={C.rule} strokeWidth="2" />
            <line x1="70" y1="200" x2="250" y2="320" stroke={C.muted} strokeWidth="2" strokeDasharray="7 6" />
            <line x1="340" y1="260" x2="520" y2="260" stroke={C.muted} strokeWidth="2" strokeDasharray="7 6" />
            <circle cx="70" cy="200" r="10" fill={C.teal} />
            <text x="82" y="184" fontFamily={mono} fontSize="19" fill={C.teal}>P1 (0,2)</text>
            <circle cx="250" cy="320" r="10" fill={C.red} />
            <text x="226" y="352" fontFamily={mono} fontSize="19" fill={C.red}>P2 (2,0)</text>
            <circle cx="340" cy="260" r="10" fill={C.red} />
            <text x="350" y="296" fontFamily={mono} fontSize="19" fill={C.red}>P3 (3,1)</text>
            <circle cx="520" cy="260" r="10" fill={C.teal} />
            <text x="438" y="238" fontFamily={mono} fontSize="19" fill={C.teal}>P4 (5,1)</text>
            <text x="138" y="270" fontFamily={mono} fontSize="17" fill={C.muted}>2√2</text>
            <text x="420" y="286" textAnchor="middle" fontFamily={mono} fontSize="17" fill={C.muted}>2</text>
        </svg>
      </div>
    </div>
  </Sheet>
);
KnnJarak1.transition = transition;

/* ═══ 09 · UKURAN JARAK II ═════════════════════════════════════════════════ */

const JarakCard = ({ tone, name, formula, children }: { tone: string; name: string; formula: string; children: ReactNode }) => (
  <div style={{ border: `3px solid ${C.ink}`, background: C.card, boxShadow: `7px 7px 0 ${tone}`, padding: '18px 22px' }}>
    <div style={{ fontSize: 23, fontWeight: 800 }}>{name}</div>
    <div style={{ fontFamily: mono, fontSize: 18, marginTop: 8, color: tone, lineHeight: 1.45 }}>{formula}</div>
    <div style={{ fontSize: 19.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.42 }}>{children}</div>
  </div>
);

const KnnJarak2: Page = () => (
  <Sheet chapter="kNN · Seksi 5" tone={C.teal}>
    <Head
      kicker="Ukuran Jarak · 2/2"
      tone={C.teal}
      title={<>Empat Alternatif, Satu Rumus Induk</>}
      lead="Pilih ukuran sesuai jenis fitur dan bentuk datanya — ini hyperparameter, bukan sekadar detail teknis."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 26 }}>
      <JarakCard tone={C.teal} name="Hamming" formula="jumlah fitur yang nilainya berbeda">
        Untuk fitur <strong>kategorikal</strong>. Suhu tinggi vs rendah = 1; ditambah satu fitur beda lagi = 2. Makin kecil, makin mirip.
      </JarakCard>
      <JarakCard tone={C.red} name="Manhattan / city block" formula="Σₖ |xₖ − yₖ|">
        Selisih tanpa dikuadratkan dan tanpa akar — hanya nilai absolut, lalu dijumlahkan.
      </JarakCard>
      <JarakCard tone={C.yellow} name="Chebyshev / max" formula="maxₖ |xₖ − yₖ|">
        Seperti Manhattan, tapi yang diambil hanya <strong>selisih terbesar</strong> dari seluruh fitur.
      </JarakCard>
      <JarakCard tone={C.teal} name="Minkowski" formula="(Σₖ |xₖ − yₖ|^p)^(1/p)">
        Rumus umum: p = 1 → Manhattan, p = 2 → Euclidean, p → ∞ → Chebyshev.
      </JarakCard>
      <div style={{ border: `3px dashed ${C.muted}`, background: 'transparent', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: hand, fontSize: 31, color: C.teal, transform: 'rotate(-2deg)', lineHeight: 1.1 }}>
          coba satu-satu, bandingkan hasilnya di validation set
        </div>
      </div>
      <div style={{ border: `3px solid ${C.ink}`, background: C.card, boxShadow: `7px 7px 0 ${C.teal}`, padding: '18px 22px' }}>
        <div style={{ fontSize: 23, fontWeight: 800 }}>Mahalanobis</div>
        <div style={{ fontFamily: mono, fontSize: 17, marginTop: 8, color: C.teal, lineHeight: 1.45 }}>
          √((x−y)ᵀ Σ⁻¹ (x−y))
        </div>
        <div style={{ fontSize: 19.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.42 }}>
          Memperhitungkan kovarians antar fitur. Contoh transkrip: dua titik berjarak 14,7 dengan ukuran biasa, ternyata hanya 6 secara Mahalanobis.
        </div>
      </div>
    </div>
    <div className="w6r-fade" style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 18, animationDelay: '0.35s' }}>
      <Tag tone={C.red}>ingat</Tag>
      <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>
        Semua ukuran sama-sama sah — bedanya cara memandang kemiripan. Pilih yang cocok dengan tipe fitur dan domain datanya.
      </span>
    </div>
  </Sheet>
);
KnnJarak2.transition = transition;

/* ═══ 10 · CONTOH KERTAS TISU 1/2 ══════════════════════════════════════════ */

const KnnTisu1: Page = () => (
  <Sheet chapter="kNN · Seksi 6" tone={C.teal}>
    <Head
      kicker="Contoh Hitung · 1/2"
      tone={C.teal}
      title={<>Kertas Tisu: Hitung Jarak ke 4 Sampel</>}
      lead="Survei kualitas kertas tisu: X1 = daya tahan keasaman, X2 = kekuatan. Kertas baru U = (3, 7) harus diprediksi: kelas T (tinggi) atau R (rendah)."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 52, alignItems: 'start' }}>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <Th>Sampel</Th>
              <Th align="center">X1</Th>
              <Th align="center">X2</Th>
              <Th align="right">Kelas</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td num>L1</Td>
              <Td num align="center">7</Td>
              <Td num align="center">7</Td>
              <Td align="right" tone={C.red} strong>R</Td>
            </tr>
            <tr>
              <Td num>L2</Td>
              <Td num align="center">7</Td>
              <Td num align="center">4</Td>
              <Td align="right" tone={C.red} strong>R</Td>
            </tr>
            <tr>
              <Td num>L3</Td>
              <Td num align="center">1</Td>
              <Td num align="center">4</Td>
              <Td align="right" tone={C.teal} strong>T</Td>
            </tr>
            <tr>
              <Td num>L4</Td>
              <Td num align="center">5</Td>
              <Td num align="center">10</Td>
              <Td align="right" tone={C.teal} strong>T</Td>
            </tr>
            <tr>
              <Td num strong>U</Td>
              <Td num align="center" strong>3</Td>
              <Td num align="center" strong>7</Td>
              <Td align="right" tone={C.muted} strong>…</Td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 16 }}>
          <Note rotate={-1.5} size={30}>
            urutannya: hitung dulu semua jarak — jangan menebak kelasnya sekarang
          </Note>
        </div>
      </div>

      <div>
        <Steps>
          <Step>
            <Calc tone={C.teal} note="L1 = (7,7)">
              D(U,L1) = √(16 + 0) = √16 = <strong>4</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.teal} note="L2 = (7,4)">
              D(U,L2) = √(16 + 9) = √25 = <strong>5</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.teal} note="L3 = (1,4)">
              D(U,L3) = √(4 + 9) = √13 ≈ <strong>3,61</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.teal} note="L4 = (5,10)">
              D(U,L4) = √(4 + 9) = √13 ≈ <strong>3,61</strong>
            </Calc>
          </Step>
          <Step>
            <div style={{ marginTop: 14, fontFamily: mono, fontSize: 21, color: C.muted }}>
              semua jarak siap → lanjut ke urutan & voting
            </div>
          </Step>
        </Steps>
      </div>
    </div>
  </Sheet>
);
KnnTisu1.transition = transition;

/* ═══ 11 · CONTOH KERTAS TISU 2/2 ══════════════════════════════════════════ */

const KnnTisu2: Page = () => (
  <Sheet chapter="kNN · Seksi 6" tone={C.teal}>
    <Head
      kicker="Contoh Hitung · 2/2"
      tone={C.teal}
      title={<>Urutkan, Lalu Voting</>}
      lead="Jarak diurutkan dari yang terkecil. Hasil prediksi bergantung pada k yang dipilih."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 52, alignItems: 'start' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Sampel</Th>
            <Th align="center">D(U,Li)</Th>
            <Th align="right">Kelas</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td num>1</Td>
            <Td num>L3</Td>
            <Td num align="center" strong>3,61</Td>
            <Td align="right" tone={C.teal} strong>T</Td>
          </tr>
          <tr>
            <Td num>2</Td>
            <Td num>L4</Td>
            <Td num align="center" strong>3,61</Td>
            <Td align="right" tone={C.teal} strong>T</Td>
          </tr>
          <tr>
            <Td num>3</Td>
            <Td num>L1</Td>
            <Td num align="center">4</Td>
            <Td align="right" tone={C.red} strong>R</Td>
          </tr>
          <tr>
            <Td num>4</Td>
            <Td num>L2</Td>
            <Td num align="center">5</Td>
            <Td align="right" tone={C.red} strong>R</Td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontSize: 21, fontWeight: 700, color: C.soft, lineHeight: 1.5 }}>
          Ranking = urutan jarak dari terkecil. Voting baru bisa dihitung setelah urutan ini siap.
        </div>
        <Steps>
          <Step>
            <Card tone={C.teal} pad={24}>
              <Tag tone={C.teal}>k = 1 · one nearest neighbor</Tag>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12 }}>
                Ranking 1 = L3 (T) → prediksi <span style={{ color: C.teal }}>T</span>
              </div>
              <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
                Hanya melihat tetangga paling dekat — paling sensitif terhadap outlier.
              </div>
            </Card>
          </Step>
          <Step>
            <Card tone={C.red} pad={24}>
              <Tag tone={C.red}>k = 3 · voting mayoritas</Tag>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12 }}>
                2 suara T (L3, L4) vs 1 suara R (L1) → <span style={{ color: C.red }}>T</span>
              </div>
              <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
                Keputusan lebih stabil karena melihat lebih banyak tetangga — yang menang suara, bukan jarak total.
              </div>
            </Card>
          </Step>
        </Steps>
        <Note rotate={-2} size={31}>
          dua nilai k, hasil yang sama — tapi belum tentu selalu begitu!
        </Note>
      </div>
    </div>
  </Sheet>
);
KnnTisu2.transition = transition;
/* ═══ 12 · ISU kNN: PILIH k ════════════════════════════════════════════════ */

const KnnIsuK: Page = () => (
  <Sheet chapter="kNN · Seksi 7 · Isu 1/5" tone={C.teal}>
    <Head
      kicker="Isu"
      tone={C.teal}
      title={<>Pilih k Ganjil, Hindari Seri</>}
      lead="Untuk klasifikasi biner, k ganjil mencegah seri pada voting sederhana."
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 52, alignItems: 'start' }}>
      <Card tone={C.teal} pad={28}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, display: 'inline-block' }} />
              <span style={{ marginLeft: 14, fontFamily: mono, fontSize: 20 }}>k = 5 → 3 vs 2 → kelas teal menang</span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, display: 'inline-block' }} />
              <span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, display: 'inline-block' }} />
              <span style={{ marginLeft: 14, fontFamily: mono, fontSize: 20, color: C.red }}>k = 4 → 2 vs 2 → seri! ?</span>
            </div>
          </div>
          <div style={{ borderTop: `1.5px solid ${C.hairline}`, paddingTop: 16, fontSize: 22, lineHeight: 1.5, color: C.soft, fontWeight: 500 }}>
            Keputusan seri bukan pilihan — harus ada jalan keluar:
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>1 · Undi / acak</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>Ibarat melempar koin untuk memilih kelas pemenang.</div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>2 · Turun ke 1-NN</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>Pakai tetangga terdekat saja — selalu menghasilkan satu kelas.</div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>3 · Pakai prior knowledge</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>Lihat kelas mana yang lebih dominan di keseluruhan data latih.</div>
        </Card>
        <Note rotate={-2} size={26} style={{ marginTop: 4 }}>
          kNN dasar memberi label, bukan confidence terkalibrasi; voting lokal kurang peka pada prior kelas
        </Note>
      </div>
    </div>
  </Sheet>
);
KnnIsuK.transition = transition;

/* ═══ 13 · ISU kNN: MISSING VALUE ══════════════════════════════════════════ */

const KnnMissing: Page = () => (
  <Sheet chapter="kNN · Seksi 7 · Isu 2/5" tone={C.teal}>
    <Head
      kicker="Isu"
      tone={C.teal}
      title={<>Data Bolong, Jarak Tak Bisa Dihitung</>}
      lead="Satu nilai atribut kosong (null) membuat D(X, Xi) tidak terdefinisi. Selesaikan dulu, baru hitung kemiripan."
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 52, alignItems: 'start' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Sampel</Th>
            <Th align="center">Suhu badan</Th>
            <Th align="center">Gejala?</Th>
            <Th align="right">Kelas</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td num>S1</Td>
            <Td num align="center">38,2</Td>
            <Td align="center">ya</Td>
            <Td align="right">A</Td>
          </tr>
          <tr>
            <Td num>S2</Td>
            <Td num align="center" tone={C.red} strong>?</Td>
            <Td align="center">ya</Td>
            <Td align="right">B</Td>
          </tr>
          <tr>
            <Td num>S3</Td>
            <Td num align="center">36,9</Td>
            <Td align="center">tidak</Td>
            <Td align="right">A</Td>
          </tr>
          <tr>
            <Td num>S4</Td>
            <Td num align="center">37,8</Td>
            <Td align="center">tidak</Td>
            <Td align="right">B</Td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Card tone={C.red} pad={26}>
          <Tag tone={C.red}>solusi paling sederhana</Tag>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 12 }}>Isi dengan rata-rata atributnya</div>
          <div style={{ fontFamily: mono, fontSize: 22, marginTop: 12, background: C.yellowSoft, padding: '10px 14px', display: 'inline-block' }}>
            ? → (38,2 + 36,9 + 37,8) / 3 = 37,63
          </div>
          <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 12, lineHeight: 1.5 }}>
            Setelah terisi, barulah jarak kemiripan bisa dihitung. Nilai imputasi lain (median, model) juga boleh — pilih yang paling masuk akal.
          </div>
        </Card>
        <Note rotate={-2} size={31}>
          missing value bukan cuma masalah kNN — strategi ini kepakai di metode lain juga
        </Note>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <Arrow d="M10 14 C56 20 96 44 108 78" head="M94 64 L110 82 L120 56" w={130} h={94} tone={C.red} />
          <div style={{ fontSize: 21, fontWeight: 600, color: C.soft, marginTop: 34 }}>
            selama ada ? di data, kemiripan tidak bisa dipercaya
          </div>
        </div>
      </div>
    </div>
  </Sheet>
);
KnnMissing.transition = transition;

/* ═══ 14 · ISU kNN: NORMALISASI ════════════════════════════════════════════ */

const KnnNormalisasi: Page = () => (
  <Sheet chapter="kNN · Seksi 7 · Isu 3/5" tone={C.teal}>
    <Head
      kicker="Isu"
      tone={C.teal}
      title={<>Samakan Skala Sebelum Menghitung Jarak</>}
      lead="Fitur dengan rentang besar menelan fitur kecil. Dua teknik yang dibahas di transkrip:"
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Formula label="Zero mean unit variance" tone={C.teal} size={26}>
          x′ᵢₘ = ( xᵢₘ − μₘ ) / σₘ
        </Formula>
        <Formula label="Min-max normalization" tone={C.red} size={26}>
          x′ = ( x − x_min ) / ( x_max − x_min )
        </Formula>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, lineHeight: 1.5 }}>
          Min-max memaksa semua nilai masuk rentang <strong>0 sampai 1</strong>. Ini normalisasi versi machine learning — beda dengan normalisasi di basis data.
        </div>
      </div>

      <Card tone={C.yellow} pad={26}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Kenapa perlu? Lihat usia vs gaji.</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr>
              <Th align="center">Orang</Th>
              <Th align="center">Usia</Th>
              <Th align="right">Gaji</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td align="center">A</Td>
              <Td num align="center">25</Td>
              <Td num align="right">3.000.000</Td>
            </tr>
            <tr>
              <Td align="center">B</Td>
              <Td num align="center">45</Td>
              <Td num align="right">8.000.000</Td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 16, fontFamily: mono, fontSize: 20, lineHeight: 1.55 }}>
          selisih usia = 20<br />
          selisih gaji = 5.000.000 — <span style={{ color: C.red }}>mendominasi total jarak</span>
        </div>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 600, marginTop: 12 }}>
          Akibatnya kemiripan jadi bias ke fitur bergaji — bisa salah prediksi.
        </div>
      </Card>
    </div>
    <Note rotate={-2} size={31} style={{ marginTop: 22 }}>
      latih: cek dulu rentang tiap fitur sebelum percaya hasil kNN
    </Note>
  </Sheet>
);
KnnNormalisasi.transition = transition;

/* ═══ 15 · ISU kNN: NILAI k OPTIMAL ════════════════════════════════════════ */

const KnnKOptimal: Page = () => (
  <Sheet chapter="kNN · Seksi 7 · Isu 4/5" tone={C.teal}>
    <Head
      kicker="Isu"
      tone={C.teal}
      title={<>k Terbaik? Coba Satu-Satu</>}
      lead="Besar k memengaruhi kinerja: tidak ada rumus ajaib, ada prosedur uji coba."
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr 0.9fr', gap: 40, alignItems: 'start' }}>
      <Card tone={C.teal} pad={24}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>k terlalu kecil</div>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
          Boundary tidak stabil: satu outlier bisa mengubah batas keputusan secara drastis.
        </div>
        <div style={{ fontFamily: mono, fontSize: 19, marginTop: 12, color: C.teal }}>k = 1 · paling sensitif</div>
      </Card>
      <Card tone={C.red} pad={24}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>k terlalu besar</div>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
          Prediksi condong ke kelas yang dominan di data latih — detail lokal hilang.
        </div>
        <div style={{ fontFamily: mono, fontSize: 19, marginTop: 12, color: C.red }}>k → N · selalu kelas mayoritas</div>
      </Card>
      <Card tone={C.yellow} pad={24}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Prosedur</div>
        <ol style={{ margin: '10px 0 0 18px', padding: 0, fontSize: 20.5, lineHeight: 1.6, fontWeight: 500, color: C.soft }}>
          <li>Ambil validation set</li>
          <li>Uji k = 1, 3, 5, …</li>
          <li>Catat kinerjanya</li>
          <li>Berhenti saat pola turun</li>
        </ol>
      </Card>
    </div>

    <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 48, alignItems: 'center' }}>
      <svg viewBox="0 0 760 260" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <line x1="70" y1="30" x2="70" y2="220" stroke={C.rule} strokeWidth="2" />
        <line x1="70" y1="220" x2="720" y2="220" stroke={C.rule} strokeWidth="2" />
        <path d="M90 70 C220 168 330 186 400 188 C500 186 610 140 700 62" stroke={C.red} strokeWidth="4" fill="none" />
        <circle cx="400" cy="188" r="10" fill={C.teal} />
        <text x="336" y="232" fontFamily={mono} fontSize="18" fill={C.teal}>titik optimum</text>
        <text x="14" y="48" fontFamily={mono} fontSize="18" fill={C.muted}>error</text>
        <text x="100" y="252" fontFamily={mono} fontSize="17" fill={C.muted}>kecil</text>
        <text x="652" y="252" fontFamily={mono} fontSize="17" fill={C.muted}>besar</text>
      </svg>
      <Note rotate={-2} size={32}>
        uji coba itu bagian dari pekerjaan — bukan tanda tidak paham
      </Note>
    </div>
  </Sheet>
);
KnnKOptimal.transition = transition;

/* ═══ 16 · ISU kNN: EFISIENSI ══════════════════════════════════════════════ */

const KnnEfisiensi: Page = () => (
  <Sheet chapter="kNN · Seksi 7 · Isu 5/5" tone={C.teal}>
    <Head
      kicker="Isu"
      tone={C.teal}
      title={<>Biaya Komputasi & Jalan Pintasnya</>}
      lead="Setiap data uji dibandingkan dengan seluruh data latih — mahal, apalagi kalau dimensinya besar."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 52, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Formula label="Biaya per prediksi" tone={C.teal} size={30}>
          O(N · D)
        </Formula>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          N = jumlah sampel latih, D = jumlah fitur. Training-nya murah (hanya menyimpan feature vector), testing-nya yang berat.
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, background: C.yellowSoft, padding: '12px 16px', lineHeight: 1.55 }}>
          10 data uji × 100 latih = 1.000 × hitung jarak
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Card tone={C.teal} pad={20}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Kurangi D (kolom)</div>
            <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6, lineHeight: 1.45 }}>
              Dimensionality reduction atau pemilihan fitur.
            </div>
          </Card>
          <Card tone={C.teal} pad={20}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Kurangi N (baris)</div>
            <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6, lineHeight: 1.45 }}>
              Ambil subset sampel representatif — strategi pemilihannya juga tantangan.
            </div>
          </Card>
        </div>
        <Card tone={C.red} pad={20}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>KD-tree — pintasan pencarian tetangga</div>
          <div style={{ fontFamily: mono, fontSize: 20, marginTop: 6, color: C.red }}>≈ O(log₂ N) rata-rata*</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6, lineHeight: 1.45 }}>
            Risikonya: tetangga yang sebenarnya paling mirip bisa jadi tidak ikut terperiksa.
          </div>
          <div style={{ fontSize: 17, color: C.muted, marginTop: 4 }}>*Dapat memburuk pada dimensi tinggi.</div>
        </Card>
        <div style={{ display: 'flex', gap: 18 }}>
          <Card tone={C.yellow} pad={20} style={{ flex: 1 }}>
            <div style={{ fontSize: 21, fontWeight: 800 }}>Inverted list</div>
            <div style={{ fontSize: 19.5, color: C.soft, fontWeight: 500, marginTop: 6 }}>Umum untuk data teks.</div>
          </Card>
          <Card tone={C.yellow} pad={20} style={{ flex: 1 }}>
            <div style={{ fontSize: 21, fontWeight: 800 }}>Locality-sensitive hashing</div>
            <div style={{ fontSize: 19.5, color: C.soft, fontWeight: 500, marginTop: 6 }}>Dipakai di fingerprinting.</div>
          </Card>
        </div>
      </div>
    </div>
  </Sheet>
);
KnnEfisiensi.transition = transition;

/* ═══ 17 · DT: ANATOMI ════════════════════════════════════════════════════ */

const DtAnatomi: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 1" tone={C.red} foot="kNN · DECISION TREE · SVM">
    <Head
      kicker="Definisi"
      tone={C.red}
      title={<>Anatomi Pohon Keputusan</>}
      lead="Struktur pohon untuk menspesifikasikan rangkaian pengambilan keputusan dan konsekuensinya."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 52, alignItems: 'start' }}>
      <svg viewBox="0 0 720 560" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <ellipse cx="360" cy="70" rx="96" ry="40" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="360" y="78" textAnchor="middle" fontFamily={mono} fontSize="21" fill={C.ink}>Outlook</text>
        <text x="360" y="24" textAnchor="middle" fontFamily={mono} fontSize="17" fill={C.red}>root node</text>

        <line x1="310" y1="106" x2="190" y2="200" stroke={C.ink} strokeWidth="2.5" />
        <line x1="360" y1="110" x2="360" y2="200" stroke={C.ink} strokeWidth="2.5" />
        <line x1="410" y1="106" x2="530" y2="200" stroke={C.ink} strokeWidth="2.5" />
        <text x="216" y="150" fontFamily={mono} fontSize="19" fill={C.muted}>sunny</text>
        <text x="346" y="140" fontFamily={mono} fontSize="19" fill={C.muted}>overcast</text>
        <text x="470" y="164" fontFamily={mono} fontSize="19" fill={C.muted}>rain</text>

        <ellipse cx="190" cy="240" rx="88" ry="38" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="190" y="248" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.ink}>Humidity</text>
        <text x="60" y="180" fontFamily={mono} fontSize="17" fill={C.teal}>internal node</text>

        <rect x="292" y="206" width="136" height="68" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="360" y="248" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>Yes</text>

        <ellipse cx="530" cy="240" rx="76" ry="38" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="530" y="248" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.ink}>Wind</text>

        <line x1="150" y1="276" x2="110" y2="360" stroke={C.ink} strokeWidth="2.5" />
        <line x1="230" y1="276" x2="270" y2="360" stroke={C.ink} strokeWidth="2.5" />
        <text x="86" y="322" fontFamily={mono} fontSize="18" fill={C.muted}>high</text>
        <text x="252" y="322" fontFamily={mono} fontSize="18" fill={C.muted}>normal</text>

        <rect x="52" y="380" width="118" height="64" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
        <text x="111" y="420" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>No</text>
        <rect x="212" y="380" width="118" height="64" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="271" y="420" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>Yes</text>

        <line x1="492" y1="276" x2="452" y2="360" stroke={C.ink} strokeWidth="2.5" />
        <line x1="568" y1="276" x2="608" y2="360" stroke={C.ink} strokeWidth="2.5" />
        <text x="424" y="322" fontFamily={mono} fontSize="18" fill={C.muted}>strong</text>
        <text x="586" y="322" fontFamily={mono} fontSize="18" fill={C.muted}>weak</text>

        <rect x="392" y="380" width="120" height="64" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
        <text x="452" y="420" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>No</text>
        <rect x="552" y="380" width="118" height="64" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="611" y="420" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>Yes</text>

        <text x="60" y="498" fontFamily={mono} fontSize="18" fill={C.teal}>rounded rect = leaf node (kelas)</text>
        <line x1="60" y1="522" x2="360" y2="522" stroke={C.red} strokeWidth="3.5" strokeDasharray="8 6" />
        <text x="60" y="550" fontFamily={mono} fontSize="18" fill={C.red}>depth = 1 · dari root ke internal node terjauh</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Node = satu fitur / kriteria</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Node paling atas disebut <strong>root</strong>; node keputusan di bawahnya <strong>internal node</strong>.
          </div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Branch = kemungkinan nilai</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Bisa biner (laki-laki/perempuan) atau lebih dari dua; untuk data kontinu berupa rentang.
          </div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Leaf = kelas hasil prediksi</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Digambar sebagai rounded rectangle — di sinilah keputusan berakhir.
          </div>
        </Card>
        <Card tone={C.yellow} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Depth = kedalaman pohon</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Dihitung dari root ke internal node terjauh — makin dangkal, makin efisien.
          </div>
        </Card>
        <Note rotate={-2} size={30}>
          notasi boleh luwes: cabang bisa ditulis langsung di garis, leaf pakai kotak biasa
        </Note>
      </div>
    </div>
  </Sheet>
);
DtAnatomi.transition = transition;
/* ═══ 18 · DT: DUA POHON ══════════════════════════════════════════════════ */

const DtDuaPohon: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 1" tone={C.red}>
    <Head
      kicker="Definisi · Lanjutan"
      tone={C.red}
      title={<>Satu Data, Dua Pohon</>}
      lead="Dua kelas, dua fitur (X1, X2). Pohon yang lebih dangkal lebih efisien — itulah yang dicari algoritma saat memilih atribut split."
    />
    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 46, alignItems: 'start' }}>
      <svg viewBox="0 0 640 520" width="100%" style={{ display: 'block', height: 460 }} aria-hidden="true">
        <line x1="80" y1="40" x2="80" y2="460" stroke={C.rule} strokeWidth="2" />
        <line x1="80" y1="460" x2="620" y2="460" stroke={C.rule} strokeWidth="2" />
        <text x="60" y="34" fontFamily={mono} fontSize="18" fill={C.muted}>X2</text>
        <text x="628" y="488" fontFamily={mono} fontSize="18" fill={C.muted}>X1</text>
        <line x1="184" y1="40" x2="184" y2="460" stroke={C.muted} strokeWidth="2" strokeDasharray="8 7" />
        <line x1="496" y1="40" x2="496" y2="460" stroke={C.muted} strokeWidth="2" strokeDasharray="8 7" />
        <line x1="80" y1="250" x2="620" y2="250" stroke={C.muted} strokeWidth="2" strokeDasharray="8 7" />
        <text x="192" y="76" fontFamily={mono} fontSize="17" fill={C.muted}>X1 = 2</text>
        <text x="512" y="64" fontFamily={mono} fontSize="17" fill={C.muted}>X1 = 8</text>
        <text x="592" y="242" fontFamily={mono} fontSize="17" fill={C.muted}>X2 = 5</text>
        <circle cx="132" cy="292" r="11" fill={C.teal} />
        <circle cx="184" cy="334" r="11" fill={C.teal} />
        <circle cx="496" cy="166" r="11" fill={C.teal} />
        <circle cx="496" cy="82" r="11" fill={C.teal} />
        <circle cx="132" cy="166" r="11" fill={C.red} />
        <circle cx="236" cy="208" r="11" fill={C.red} />
        <circle cx="340" cy="334" r="11" fill={C.red} />
        <circle cx="288" cy="124" r="11" fill={C.red} />
        <circle cx="392" cy="124" r="11" fill={C.red} />
        <circle cx="288" cy="418" r="11" fill={C.red} />
        <circle cx="120" cy="496" r="9" fill={C.teal} />
        <text x="140" y="503" fontFamily={mono} fontSize="17" fill={C.muted}>kelas teal</text>
        <circle cx="288" cy="496" r="9" fill={C.red} />
        <text x="308" y="503" fontFamily={mono} fontSize="17" fill={C.muted}>kelas merah</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <svg viewBox="0 0 620 240" width="100%" style={{ display: 'block', height: 214 }} aria-hidden="true">
          <text x="0" y="22" fontFamily={mono} fontSize="18" fill={C.red}>POHON A · root X2 · depth 1</text>
          <ellipse cx="310" cy="62" rx="86" ry="30" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="310" y="68" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.ink}>X2 &lt; 5 ?</text>
          <line x1="262" y1="88" x2="170" y2="128" stroke={C.ink} strokeWidth="2.5" />
          <line x1="358" y1="88" x2="450" y2="128" stroke={C.ink} strokeWidth="2.5" />
          <text x="186" y="106" fontFamily={mono} fontSize="16" fill={C.muted}>&lt; 5</text>
          <text x="404" y="106" fontFamily={mono} fontSize="16" fill={C.muted}>≥ 5</text>
          <ellipse cx="150" cy="152" rx="72" ry="26" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="150" y="158" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.ink}>X1 ≤ 2 ?</text>
          <ellipse cx="470" cy="152" rx="72" ry="26" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="470" y="158" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.ink}>X1 &lt; 8 ?</text>
          <line x1="112" y1="174" x2="86" y2="204" stroke={C.ink} strokeWidth="2.5" />
          <line x1="188" y1="174" x2="214" y2="204" stroke={C.ink} strokeWidth="2.5" />
          <rect x="42" y="206" width="86" height="28" rx="10" fill={C.teal} stroke={C.ink} strokeWidth="2.5" />
          <text x="85" y="226" textAnchor="middle" fontFamily={mono} fontSize="15" fill={C.card}>teal</text>
          <rect x="176" y="206" width="86" height="28" rx="10" fill={C.red} stroke={C.ink} strokeWidth="2.5" />
          <text x="219" y="226" textAnchor="middle" fontFamily={mono} fontSize="15" fill={C.card}>merah</text>
          <line x1="432" y1="174" x2="406" y2="204" stroke={C.ink} strokeWidth="2.5" />
          <line x1="508" y1="174" x2="534" y2="204" stroke={C.ink} strokeWidth="2.5" />
          <rect x="362" y="206" width="86" height="28" rx="10" fill={C.red} stroke={C.ink} strokeWidth="2.5" />
          <text x="405" y="226" textAnchor="middle" fontFamily={mono} fontSize="15" fill={C.card}>merah</text>
          <rect x="496" y="206" width="86" height="28" rx="10" fill={C.teal} stroke={C.ink} strokeWidth="2.5" />
          <text x="539" y="226" textAnchor="middle" fontFamily={mono} fontSize="15" fill={C.card}>teal</text>
        </svg>

        <svg viewBox="0 0 700 300" width="100%" style={{ display: 'block', height: 246 }} aria-hidden="true">
          <text x="0" y="20" fontFamily={mono} fontSize="18" fill={C.red}>POHON B · root X1 · depth 2</text>
          <ellipse cx="350" cy="52" rx="82" ry="27" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="350" y="58" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.ink}>X1 ≤ 2 ?</text>
          <line x1="302" y1="74" x2="196" y2="108" stroke={C.ink} strokeWidth="2.5" />
          <line x1="398" y1="74" x2="504" y2="108" stroke={C.ink} strokeWidth="2.5" />
          <text x="212" y="90" fontFamily={mono} fontSize="15" fill={C.muted}>≤ 2</text>
          <text x="446" y="90" fontFamily={mono} fontSize="15" fill={C.muted}>&gt; 2</text>
          <ellipse cx="170" cy="130" rx="70" ry="25" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="170" y="136" textAnchor="middle" fontFamily={mono} fontSize="17" fill={C.ink}>X2 &lt; 5 ?</text>
          <ellipse cx="530" cy="130" rx="70" ry="25" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="530" y="136" textAnchor="middle" fontFamily={mono} fontSize="17" fill={C.ink}>X2 &lt; 5 ?</text>
          <line x1="132" y1="150" x2="106" y2="178" stroke={C.ink} strokeWidth="2.5" />
          <line x1="208" y1="150" x2="234" y2="178" stroke={C.ink} strokeWidth="2.5" />
          <rect x="62" y="180" width="86" height="26" rx="10" fill={C.teal} stroke={C.ink} strokeWidth="2.5" />
          <text x="105" y="199" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>teal</text>
          <rect x="196" y="180" width="86" height="26" rx="10" fill={C.red} stroke={C.ink} strokeWidth="2.5" />
          <text x="239" y="199" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>merah</text>
          <line x1="492" y1="150" x2="466" y2="178" stroke={C.ink} strokeWidth="2.5" />
          <line x1="568" y1="150" x2="594" y2="178" stroke={C.ink} strokeWidth="2.5" />
          <rect x="422" y="180" width="86" height="26" rx="10" fill={C.red} stroke={C.ink} strokeWidth="2.5" />
          <text x="465" y="199" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>merah</text>
          <ellipse cx="620" cy="196" rx="66" ry="24" fill={C.card} stroke={C.ink} strokeWidth="3" />
          <text x="620" y="202" textAnchor="middle" fontFamily={mono} fontSize="16" fill={C.ink}>X1 &lt; 8 ?</text>
          <line x1="586" y1="216" x2="560" y2="248" stroke={C.ink} strokeWidth="2.5" />
          <line x1="654" y1="216" x2="678" y2="248" stroke={C.ink} strokeWidth="2.5" />
          <rect x="516" y="250" width="86" height="26" rx="10" fill={C.red} stroke={C.ink} strokeWidth="2.5" />
          <text x="559" y="269" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>merah</text>
          <rect x="640" y="250" width="56" height="26" rx="10" fill={C.teal} stroke={C.ink} strokeWidth="2.5" />
          <text x="668" y="269" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>teal</text>
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tag tone={C.red}>kesimpulan</Tag>
          <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>
            Pohon A lebih efektif: depth 1 vs depth 2 — splitting berikutnya tidak perlu banyak.
          </span>
        </div>
      </div>
    </div>
  </Sheet>
);
DtDuaPohon.transition = transition;

/* ═══ 19 · DT: STUDI KASUS TENIS ══════════════════════════════════════════ */

const DtTenis: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 2" tone={C.red}>
    <Head
      kicker="Studi Kasus"
      tone={C.red}
      title={<>14 Hari Main Tenis</>}
      lead="Data latih: 14 sampel, 3 fitur (outlook, humidity, wind) + 1 kelas (9 yes, 5 no). Data uji baru: rain, high, weak — main atau tidak?"
    />
    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Hari</Th>
            <Th>Outlook</Th>
            <Th>Hum</Th>
            <Th>Wind</Th>
            <Th align="right">Play</Th>
          </tr>
        </thead>
        <tbody>
          <tr><Td num>1</Td><Td>Sunny</Td><Td>High</Td><Td>Weak</Td><Td align="right" tone={C.red} strong>No</Td></tr>
          <tr><Td num>2</Td><Td>Sunny</Td><Td>High</Td><Td>Strong</Td><Td align="right" tone={C.red} strong>No</Td></tr>
          <tr><Td num>3</Td><Td>Overcast</Td><Td>High</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>4</Td><Td>Rain</Td><Td>High</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>5</Td><Td>Rain</Td><Td>Normal</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>6</Td><Td>Rain</Td><Td>Normal</Td><Td>Strong</Td><Td align="right" tone={C.red} strong>No</Td></tr>
          <tr><Td num>7</Td><Td>Overcast</Td><Td>Normal</Td><Td>Strong</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
        </tbody>
      </table>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Hari</Th>
            <Th>Outlook</Th>
            <Th>Hum</Th>
            <Th>Wind</Th>
            <Th align="right">Play</Th>
          </tr>
        </thead>
        <tbody>
          <tr><Td num>8</Td><Td>Sunny</Td><Td>High</Td><Td>Weak</Td><Td align="right" tone={C.red} strong>No</Td></tr>
          <tr><Td num>9</Td><Td>Sunny</Td><Td>Normal</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>10</Td><Td>Rain</Td><Td>Normal</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>11</Td><Td>Sunny</Td><Td>Normal</Td><Td>Strong</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>12</Td><Td>Overcast</Td><Td>High</Td><Td>Strong</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>13</Td><Td>Overcast</Td><Td>Normal</Td><Td>Weak</Td><Td align="right" tone={C.teal} strong>Yes</Td></tr>
          <tr><Td num>14</Td><Td>Rain</Td><Td>High</Td><Td>Strong</Td><Td align="right" tone={C.red} strong>No</Td></tr>
        </tbody>
      </table>
    </div>
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 44, alignItems: 'center' }}>
      <Card tone={C.red} pad={24}>
        <Tag tone={C.red}>data uji</Tag>
        <div style={{ fontFamily: mono, fontSize: 26, marginTop: 12, lineHeight: 1.6 }}>
          outlook = rain · humidity = high · wind = weak
        </div>
        <div style={{ fontSize: 21, fontWeight: 600, color: C.soft, marginTop: 8 }}>
          Ikuti cabangnya sampai daun — keputusan apa yang keluar?
        </div>
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: C.soft, lineHeight: 1.5 }}>
          Kolom <strong>“Hari”</strong> hanya nomor urut — tidak dipakai saat training maupun testing.
        </div>
        <Note rotate={-1.5} size={30}>
          perhatikan komposisinya: 9 yes, 5 no — dari sini semua perhitungan dimulai
        </Note>
      </div>
    </div>
  </Sheet>
);
DtTenis.transition = transition;

/* ═══ 20 · DT: SPLIT BERTAHAP ═════════════════════════════════════════════ */

const DtSplit: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 2" tone={C.red}>
    <Head
      kicker="Cara Kerja"
      tone={C.red}
      title={<>Pecah Terus Sampai Murni</>}
      lead="Satu fitur diuji, cabang yang sudah satu kelas berhenti. Cabang yang masih campur dipecah lagi dengan fitur lain."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'start' }}>
      <div>
      <Steps>
        <Step>
          <Calc tone={C.teal} note="4 yes · 0 no → pure">
            outlook = overcast → <strong>berhenti</strong>, daun = Yes
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="3 no · 2 yes → belum pure">
            outlook = sunny → pecah lagi dengan humidity
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.teal} note="high → 3 no (pure)">
            sunny + humidity high → No
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.teal} note="normal → 2 yes (pure)">
            sunny + humidity normal → Yes
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="3 yes · 2 no → belum pure">
            outlook = rain → pecah lagi dengan wind
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.teal} note="strong → No · weak → Yes">
            rain + wind → dua daun pure
          </Calc>
        </Step>
      </Steps>
    </div>

      <div>
        <svg viewBox="0 0 660 520" width="100%" style={{ display: 'block' }} aria-hidden="true">
          <ellipse cx="330" cy="60" rx="98" ry="36" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
          <text x="330" y="68" textAnchor="middle" fontFamily={mono} fontSize="21" fill={C.ink}>Outlook</text>
          <text x="330" y="18" textAnchor="middle" fontFamily={mono} fontSize="16" fill={C.muted}>root · 9 yes / 5 no</text>
          <line x1="272" y1="90" x2="140" y2="170" stroke={C.ink} strokeWidth="2.5" />
          <line x1="330" y1="96" x2="330" y2="170" stroke={C.ink} strokeWidth="2.5" />
          <line x1="388" y1="90" x2="520" y2="170" stroke={C.ink} strokeWidth="2.5" />
          <text x="164" y="130" fontFamily={mono} fontSize="18" fill={C.muted}>sunny</text>
          <text x="344" y="130" fontFamily={mono} fontSize="18" fill={C.muted}>overcast</text>
          <text x="452" y="130" fontFamily={mono} fontSize="18" fill={C.muted}>rain</text>

          <ellipse cx="140" cy="206" rx="86" ry="40" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
          <text x="140" y="200" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.ink}>Humidity</text>
          <text x="140" y="226" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.red}>3 no · 2 yes</text>

          <rect x="266" y="180" width="128" height="54" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
          <text x="330" y="206" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.card}>Yes</text>
          <text x="330" y="226" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.card}>4 yes · 0 no</text>

          <ellipse cx="520" cy="206" rx="76" ry="40" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
          <text x="520" y="200" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.ink}>Wind</text>
          <text x="520" y="226" textAnchor="middle" fontFamily={mono} fontSize="14" fill={C.red}>3 yes · 2 no</text>

          <line x1="96" y1="238" x2="66" y2="330" stroke={C.ink} strokeWidth="2.5" />
          <line x1="184" y1="238" x2="214" y2="330" stroke={C.ink} strokeWidth="2.5" />
          <text x="56" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>high</text>
          <text x="196" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>normal</text>
          <rect x="18" y="338" width="96" height="52" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
          <text x="66" y="370" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.card}>No</text>
          <rect x="166" y="338" width="96" height="52" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
          <text x="214" y="370" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.card}>Yes</text>

          <line x1="482" y1="238" x2="452" y2="330" stroke={C.ink} strokeWidth="2.5" />
          <line x1="558" y1="238" x2="588" y2="330" stroke={C.ink} strokeWidth="2.5" />
          <text x="424" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>strong</text>
          <text x="576" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>weak</text>
          <rect x="402" y="338" width="96" height="52" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
          <text x="450" y="370" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.card}>No</text>
          <rect x="538" y="338" width="96" height="52" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
          <text x="586" y="370" textAnchor="middle" fontFamily={mono} fontSize="18" fill={C.card}>Yes</text>

          <text x="18" y="438" fontFamily={mono} fontSize="17" fill={C.muted}>aturan berhenti:</text>
          <text x="18" y="466" fontFamily={mono} fontSize="17" fill={C.ink}>1. subset sudah pure (satu kelas)</text>
          <text x="18" y="492" fontFamily={mono} fontSize="17" fill={C.ink}>2. atribut sudah habis dipakai</text>
        </svg>
      </div>
    </div>
  </Sheet>
);
DtSplit.transition = transition;

/* ═══ 21 · DT: POHON FINAL & PREDIKSI ════════════════════════════════════ */

const DtFinal: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 2" tone={C.red}>
    <Head
      kicker="Hasil Akhir"
      tone={C.red}
      title={<>Pohon Final & Satu Prediksi</>}
      lead="Pohon lengkap dari 14 sampel. Sekarang jalankan data uji (rain, high, weak) dari root sampai daun."
    />
    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 46, alignItems: 'start' }}>
      <svg viewBox="0 0 760 460" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <ellipse cx="380" cy="62" rx="102" ry="38" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="380" y="70" textAnchor="middle" fontFamily={mono} fontSize="22" fill={C.ink}>Outlook</text>
        <line x1="312" y1="92" x2="190" y2="168" stroke={C.ink} strokeWidth="2.5" />
        <line x1="380" y1="100" x2="380" y2="168" stroke={C.ink} strokeWidth="2.5" />
        <line x1="448" y1="92" x2="570" y2="168" stroke={C.red} strokeWidth="4" />
        <text x="212" y="132" fontFamily={mono} fontSize="18" fill={C.muted}>sunny</text>
        <text x="388" y="124" fontFamily={mono} fontSize="18" fill={C.muted}>overcast</text>
        <text x="500" y="154" fontFamily={mono} fontSize="18" fill={C.red}>rain</text>

        <ellipse cx="190" cy="204" rx="92" ry="36" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="190" y="212" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.ink}>Humidity</text>
        <rect x="302" y="172" width="156" height="64" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="380" y="213" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.card}>Yes</text>
        <ellipse cx="570" cy="204" rx="82" ry="36" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="570" y="212" textAnchor="middle" fontFamily={mono} fontSize="20" fill={C.ink}>Wind</text>

        <line x1="146" y1="240" x2="112" y2="330" stroke={C.ink} strokeWidth="2.5" />
        <line x1="234" y1="240" x2="268" y2="330" stroke={C.ink} strokeWidth="2.5" />
        <text x="96" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>high</text>
        <text x="242" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>normal</text>
        <rect x="56" y="338" width="116" height="56" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
        <text x="114" y="374" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.card}>No</text>
        <rect x="212" y="338" width="116" height="56" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="270" y="374" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.card}>Yes</text>

        <line x1="532" y1="240" x2="498" y2="330" stroke={C.ink} strokeWidth="2.5" />
        <line x1="608" y1="240" x2="642" y2="330" stroke={C.red} strokeWidth="4" />
        <text x="470" y="292" fontFamily={mono} fontSize="16" fill={C.muted}>strong</text>
        <text x="630" y="292" fontFamily={mono} fontSize="16" fill={C.red}>weak</text>
        <rect x="440" y="338" width="116" height="56" rx="14" fill={C.red} stroke={C.ink} strokeWidth="3.5" />
        <text x="498" y="374" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.card}>No</text>
        <rect x="596" y="338" width="116" height="56" rx="14" fill={C.teal} stroke={C.ink} strokeWidth="3.5" />
        <text x="654" y="374" textAnchor="middle" fontFamily={mono} fontSize="19" fill={C.card}>Yes</text>

        <text x="20" y="436" fontFamily={hand} fontSize="26" fill={C.red}>garis tebal = jalur data uji</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Steps>
          <Step>
            <Card tone={C.red} pad={22}>
              <div style={{ fontFamily: mono, fontSize: 21 }}>1 · outlook = rain</div>
              <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
                dari root, ikuti cabang kanan menuju node Wind.
              </div>
            </Card>
          </Step>
          <Step>
            <Card tone={C.red} pad={22}>
              <div style={{ fontFamily: mono, fontSize: 21 }}>2 · wind = weak</div>
              <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
                humidity tidak dicek di cabang ini — pohon hanya menguji wind.
              </div>
            </Card>
          </Step>
          <Step>
            <Card tone={C.teal} pad={22}>
              <div style={{ fontFamily: mono, fontSize: 24, color: C.teal }}>3 · prediksi = Yes</div>
              <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
                sampel uji diklasifikasi “bermain tenis”.
              </div>
            </Card>
          </Step>
        </Steps>
        <Note rotate={-2} size={30}>
          perhatikan: humidity-nya high, tapi tidak pernah dilihat pohon
        </Note>
      </div>
    </div>
  </Sheet>
);
DtFinal.transition = transition;

/* ═══ 22 · DT: PURITY & ENTROPY ═══════════════════════════════════════════ */

const DtEntropy: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 3" tone={C.red}>
    <Head
      kicker="Ukuran"
      tone={C.red}
      title={<>Entropi: Derajat Ketidakpastian</>}
      lead="Kenapa perlu ukuran? Karena dengan ribuan sampel, mata tidak bisa lagi menilai split mana yang paling “bersih”."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '0.98fr 1.02fr', gap: 52, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Formula label="Entropy" tone={C.red} size={30}>
          H(S) = − Σ<sub>c∈C</sub> p<sub>c</sub> log₂ p<sub>c</sub>
        </Formula>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          p<sub>c</sub> = probabilitas kemunculan kelas c di dalam subset S. Skalanya: <strong>0 = pasti</strong>, <strong>1 = paling tidak pasti</strong>.
        </div>
        <Card tone={C.teal} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Pure set → H = 0</div>
          <div style={{ fontFamily: mono, fontSize: 20, marginTop: 8 }}>4 yes / 0 no · 0 yes / 4 no · n yes / 0 no</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Semua kelasnya sama; tidak ada ketidakpastian. (Probabilitasnya bisa 100% atau 0% — dua-duanya “pasti”.)
          </div>
        </Card>
        <Card tone={C.red} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Impure set 50:50 → H = 1</div>
          <div style={{ fontFamily: mono, fontSize: 20, marginTop: 8 }}>3 yes / 3 no · 4 / 4 · 5 / 5 · dst.</div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 6 }}>
            Paling tidak pasti — karena itu nilainya maksimal.
          </div>
        </Card>
      </div>

      <div>
      <Steps>
        <Step>
          <Calc tone={C.ink} note="komposisi 3 : 3">
            p_yes = 3/6 = 0,5  ·  p_no = 3/6 = 0,5
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="log₂ 0,5 = −1">
            H(S) = −(0,5 × −1) − (0,5 × −1)
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="50:50 selalu begitu">
            H(S) = 0,5 + 0,5 = <strong>1</strong>
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="4 yes / 0 no">
            H(S) = −(1 × log₂ 1) − (0 × log₂ 0) = <strong>0</strong>
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.muted} note="bekal untuk halaman berikutnya">
            H(9 yes, 5 no) = −(9/14 log₂ 9/14) − (5/14 log₂ 5/14) ≈ 0,94
          </Calc>
        </Step>
      </Steps>
    </div>
    </div>
  </Sheet>
);
DtEntropy.transition = transition;

/* ═══ 23 · DT: INFORMATION GAIN ═══════════════════════════════════════════ */

const DtGain: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 3" tone={C.red}>
    <Head
      kicker="Ukuran"
      tone={C.red}
      title={<>Information Gain: Pilih Split Terbaik</>}
      lead="Gain = penurunan ketidakpastian setelah data dipecah dengan sebuah fitur. Fitur dengan gain tertinggi jadi root."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 48, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Formula label="Information gain" tone={C.red} size={25}>
          IG(S, F) = H(S) − Σ<sub>f∈F</sub> ( |S<sub>f</sub>| / |S| ) H(S<sub>f</sub>)
        </Formula>
        <Steps>
          <Step>
            <Calc tone={C.ink} note="14 sampel">
              H(S) = 0,94
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.ink} note="weak: 8 sampel, H = 0,811">
              wind: 0,94 − (8/14 × 0,811) − (6/14 × 1)
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.ink} note="strong: 6 sampel (3:3), H = 1">
              IG(wind) = <strong>0,048</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.ink} note="dihitung dengan cara sama">
              IG(humidity) = <strong>0,152</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.red} note="tertinggi → root!">
              IG(outlook) = <strong>0,247</strong>
            </Calc>
          </Step>
        </Steps>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `3px solid ${C.ink}`, background: C.card, boxShadow: `9px 9px 0 ${C.red}`, padding: '24px 28px' }}>
          <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase' }}>Perbandingan gain</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 700 }}>
                <span>wind</span><span style={{ fontFamily: mono }}>0,048</span>
              </div>
              <div style={{ height: 18, marginTop: 5, background: 'transparent', border: `2px solid ${C.ink}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: '19%', background: C.teal, borderRight: `2px solid ${C.ink}` }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 700 }}>
                <span>humidity</span><span style={{ fontFamily: mono }}>0,152</span>
              </div>
              <div style={{ height: 18, marginTop: 5, background: 'transparent', border: `2px solid ${C.ink}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: '62%', background: C.teal, borderRight: `2px solid ${C.ink}` }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 800, color: C.red }}>
                <span>outlook</span><span style={{ fontFamily: mono }}>0,247</span>
              </div>
              <div style={{ height: 22, marginTop: 5, background: 'transparent', border: `2.5px solid ${C.ink}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: '100%', background: C.red, borderRight: `2px solid ${C.ink}` }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 600, lineHeight: 1.5 }}>
          Outlook punya satu cabang yang langsung pure (overcast = 4 yes / 0 no) — itulah kenapa ia paling informatif.
        </div>
        <Note rotate={-2} size={30}>
          proses diulang di tiap cabang sampai semua daun pure
        </Note>
      </div>
    </div>
  </Sheet>
);
DtGain.transition = transition;

/* ═══ 24 · DT: REKURSI DI CABANG ══════════════════════════════════════════ */

const DtRekursi: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 3" tone={C.red}>
    <Head
      kicker="Ukuran · Lanjutan"
      tone={C.red}
      title={<>Ulangi di Setiap Cabang</>}
      lead="Setelah root terpilih, perhitungan yang sama dijalankan pada tiap cabang — dengan subset data dan fitur yang tersisa."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
      <Card tone={C.red} pad={26}>
        <Tag tone={C.red}>cabang sunny · 5 sampel (2 yes, 3 no)</Tag>
        <div style={{ marginTop: 14, fontSize: 21, color: C.soft, fontWeight: 500 }}>
          Fitur <strong>outlook tidak dipertimbangkan lagi</strong> di cabang ini — sudah dipakai di atasnya.
        </div>
        <Steps>
          <Step>
            <Calc tone={C.teal} note="high → 3 no (pure) · normal → 2 yes (pure)">
              IG(humidity) = <strong>0,971</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.muted} note="kalah jauh">
              IG(wind) = 0,020
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.red} note="→ internal node berikutnya">
              pemenang: <strong>humidity</strong>
            </Calc>
          </Step>
        </Steps>
      </Card>

      <Card tone={C.red} pad={26}>
        <Tag tone={C.red}>cabang rain · 5 sampel (3 yes, 2 no)</Tag>
        <div style={{ marginTop: 14, fontSize: 21, color: C.soft, fontWeight: 500 }}>
          Dengan sisa fitur yang ada, satu fitur langsung memisahkan keduanya dengan sempurna.
        </div>
        <Steps>
          <Step>
            <Calc tone={C.teal} note="strong → No · weak → Yes (dua-duanya pure)">
              IG(wind) = <strong>0,971</strong>
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.muted} note="kalah jauh">
              IG(humidity) = 0,020
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.red} note="→ internal node berikutnya">
              pemenang: <strong>wind</strong>
            </Calc>
          </Step>
        </Steps>
      </Card>
    </div>
    <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 20 }}>
      <Tag tone={C.teal}>hasil</Tag>
      <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>
        Root outlook → sunny memakai humidity → rain memakai wind — persis pohon yang sudah kita prediksikan di halaman sebelumnya.
      </span>
    </div>
  </Sheet>
);
DtRekursi.transition = transition;
/* ═══ 25 · DT: SET OF RULES ═══════════════════════════════════════════════ */

const DtRules: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 4" tone={C.red}>
    <Head
      kicker="Penerapan"
      tone={C.red}
      title={<>Dari Pohon ke Set of Rules</>}
      lead="Model pohon diubah menjadi kumpulan aturan — satu aturan untuk tiap daun, dibaca dari root menyusuri cabang."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 52, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Formula label="Conjunction — semua syarat harus terpenuhi" tone={C.red} size={22}>
          IF outlook=sunny AND humidity=high<br />
          THEN play = No
        </Formula>
        <Formula label="Disjunction — cukup salah satu" tone={C.teal} size={22}>
          IF outlook=overcast OR outlook=rain<br />
          THEN play = Yes
        </Formula>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          Contoh OR di atas berlaku untuk bentuk pohon yang berbeda — kalau dua cabang menghasilkan daun yang sama, cukup digabung dengan “atau”.
        </div>
        <Note rotate={-2} size={30}>
          satu daun = satu aturan; aturan dibangun per leaf, bukan per cabang
        </Note>
      </div>

      <Card tone={C.yellow} pad={26}>
        <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase' }}>
          Set of rules — pohon main tenis
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: mono, fontSize: 21, lineHeight: 1.5 }}>
          <div style={{ borderLeft: `5px solid ${C.red}`, paddingLeft: 16 }}>
            1  IF outlook=sunny AND humidity=high → No
          </div>
          <div style={{ borderLeft: `5px solid ${C.teal}`, paddingLeft: 16 }}>
            2  IF outlook=sunny AND humidity=normal → Yes
          </div>
          <div style={{ borderLeft: `5px solid ${C.teal}`, paddingLeft: 16 }}>
            3  IF outlook=overcast → Yes
          </div>
          <div style={{ borderLeft: `5px solid ${C.red}`, paddingLeft: 16 }}>
            4  IF outlook=rain AND wind=strong → No
          </div>
          <div style={{ borderLeft: `5px solid ${C.teal}`, paddingLeft: 16 }}>
            5  IF outlook=rain AND wind=weak → Yes
          </div>
        </div>
        <div style={{ marginTop: 20, fontSize: 20, color: C.soft, fontWeight: 500 }}>
          5 daun → 5 aturan. Aturan ke-3 cukup satu syarat karena jalurnya pendek.
        </div>
      </Card>
    </div>
  </Sheet>
);
DtRules.transition = transition;

/* ═══ 26 · DT: OVERFITTING ════════════════════════════════════════════════ */

const DtOverfit: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 5" tone={C.red}>
    <Head
      kicker="Kinerja"
      tone={C.red}
      title={<>Satu Noise, Pohon Bertambah Dalam</>}
      lead="Pohon yang dipaksa cocok dengan data aneh justru kehilangan kemampuan generalisasi — itulah overfitting."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 50, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone={C.red} pad={24}>
          <Tag tone={C.red}>contoh noise</Tag>
          <div style={{ fontFamily: mono, fontSize: 21, marginTop: 12, lineHeight: 1.55 }}>
            sampel baru: sunny · normal · strong<br />keputusan aktual: <strong style={{ color: C.red }}>No</strong>
          </div>
          <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
            Padahal pohon yang ada memprediksi <strong>Yes</strong> (humidity normal). Pohon harus tumbuh lebih dalam hanya untuk satu titik ini.
          </div>
        </Card>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Li tone={C.red} size={22}>Akibatnya: cabang tambahan yang sangat spesifik pada noise.</Li>
          <Li tone={C.red} size={22}>Data uji normal lain justru ikut salah klasifikasi.</Li>
          <Li tone={C.red} size={22}>Overfitting juga muncul kalau data latih belum representatif (tidak mencakup seluruh kemungkinan).</Li>
        </ul>
      </div>

      <div>
        <svg viewBox="0 0 760 420" width="100%" style={{ display: 'block' }} aria-hidden="true">
          <line x1="80" y1="40" x2="80" y2="350" stroke={C.rule} strokeWidth="2" />
          <line x1="80" y1="350" x2="720" y2="350" stroke={C.rule} strokeWidth="2" />
          <text x="14" y="52" fontFamily={mono} fontSize="17" fill={C.muted}>akurasi</text>
          <text x="606" y="378" fontFamily={mono} fontSize="17" fill={C.muted}>jumlah node</text>
          <path d="M110 320 C240 260 360 180 720 92" stroke={C.teal} strokeWidth="4" fill="none" />
          <path d="M110 320 C230 220 330 150 430 140 C540 132 640 190 716 300" stroke={C.red} strokeWidth="4" fill="none" />
          <line x1="430" y1="140" x2="430" y2="350" stroke={C.muted} strokeWidth="2" strokeDasharray="7 6" />
          <circle cx="430" cy="140" r="9" fill={C.red} />
          <text x="352" y="118" fontFamily={mono} fontSize="17" fill={C.red}>puncak ≈ 0,75</text>
          <text x="444" y="182" fontFamily={mono} fontSize="16" fill={C.muted}>10–20 node</text>
          <text x="560" y="112" fontFamily={mono} fontSize="18" fill={C.teal}>training</text>
          <text x="600" y="252" fontFamily={mono} fontSize="18" fill={C.red}>testing</text>
          <text x="96" y="392" fontFamily="Caveat, cursive" fontSize="26" fill={C.muted}>semakin besar pohon ≠ semakin baik</text>
        </svg>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 600, marginTop: 10, lineHeight: 1.5 }}>
          Akurasi data latih terus naik; akurasi data uji justru turun setelah titik optimum. Yang kita pedulikan adalah yang kedua.
        </div>
      </div>
    </div>
  </Sheet>
);
DtOverfit.transition = transition;

/* ═══ 27 · DT: PRUNING & VALIDASI ═════════════════════════════════════════ */

const DtPruning: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 5" tone={C.red}>
    <Head
      kicker="Strategi"
      tone={C.red}
      title={<>Stop Awal atau Pangkas Belakangan</>}
      lead="Dua pendekatan menahan pohon agar tidak terlalu kompleks — keduanya butuh satu komponen baru: validation set."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 46, alignItems: 'start' }}>
      <Card tone={C.teal} pad={26}>
        <Tag tone={C.teal}>pendekatan 1</Tag>
        <div style={{ fontSize: 27, fontWeight: 800, marginTop: 12 }}>Early stopping</div>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.55 }}>
          Hentikan proses growing the tree <strong>seawal mungkin</strong>: begitu split baru tidak lagi menambah manfaat, berhenti.
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, marginTop: 16, background: C.yellowSoft, padding: '10px 14px' }}>
          node tidak ditumbuhkan → tidak perlu dipotong
        </div>
      </Card>
      <Card tone={C.red} pad={26}>
        <Tag tone={C.red}>pendekatan 2</Tag>
        <div style={{ fontSize: 27, fontWeight: 800, marginTop: 12 }}>Pruning</div>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.55 }}>
          Biarkan pohon tumbuh penuh dulu, lalu <strong>potong</strong> cabang / internal node yang hanya cocok untuk noise.
        </div>
        <div style={{ fontFamily: mono, fontSize: 20, marginTop: 16, background: C.yellowSoft, padding: '10px 14px' }}>
          tumbuh dulu → pangkas setelah evaluasi
        </div>
      </Card>
    </div>

    <Card tone={C.yellow} pad={26} style={{ marginTop: 30 }}>
      <div style={{ fontSize: 24, fontWeight: 800 }}>Kunci: validation set — bukan training, bukan testing</div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, border: `3px solid ${C.ink}`, background: C.tealSoft, padding: '14px 18px', textAlign: 'center', fontSize: 21, fontWeight: 700 }}>
          Training
        </div>
        <div style={{ flex: 1, border: `3px solid ${C.ink}`, background: C.yellowSoft, padding: '14px 18px', textAlign: 'center', fontSize: 21, fontWeight: 700 }}>
          Validation
        </div>
        <div style={{ flex: 1, border: `3px solid ${C.ink}`, background: C.redSoft, padding: '14px 18px', textAlign: 'center', fontSize: 21, fontWeight: 700 }}>
          Testing
        </div>
      </div>
      <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, marginTop: 14, lineHeight: 1.5 }}>
        Untuk setiap kandidat split / cabang: uji ke validation set. Kalau akurasinya <strong>menurun</strong> — di internal node itu, berhenti.
      </div>
    </Card>
  </Sheet>
);
DtPruning.transition = transition;

/* ═══ 28 · DT: C4.5 GAIN RATIO ════════════════════════════════════════════ */

const DtC45: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 6" tone={C.red}>
    <Head
      kicker="Varian"
      tone={C.red}
      title={<>C4.5: Menambal Bias ID3</>}
      lead="ID3 cenderung memilih fitur dengan banyak kemungkinan nilai — gain-nya tinggi semu. C4.5 menormalkannya dengan gain ratio."
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Card tone={C.red} pad={24}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Masalahnya</div>
          <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Li tone={C.red} size={21}>Fitur dengan nilai sangat banyak (diskret maupun kontinu) disukai ID3.</Li>
            <Li tone={C.red} size={21}>Padahal belum tentu fitur itu paling berguna.</Li>
            <Li tone={C.red} size={21}>Contoh: fitur angin dengan 2 nilai aman; fitur dengan puluhan nilai menipu.</Li>
          </ul>
        </Card>
        <Formula label="Gain ratio" tone={C.teal} size={26}>
          GainRatio(S, A) = Gain(S, A) / SplitInfo(S, A)
        </Formula>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Formula label="Split information" tone={C.red} size={24}>
          SplitInfo(S, A) = − Σ<sub>i=1..c</sub> (S<sub>i</sub> / S) log₂ (S<sub>i</sub> / S)
        </Formula>
        <div style={{ fontSize: 21, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          S<sub>i</sub> adalah jumlah kasus untuk masing-masing nilai dari fitur A. Split info “menghukum” fitur yang memecah data jadi banyak bagian.
        </div>
        <Card tone={C.teal} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Yang berubah hanya ukuran split-nya</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Alur pohon, cara membaca aturan, dan masalah overfitting-nya sama dengan ID3 — yang diganti adalah kriteria pemilihan atribut.
          </div>
        </Card>
        <Note rotate={-2} size={30}>
          C4.5 bukan satu-satunya varian, tapi paling umum dipakai
        </Note>
      </div>
    </div>
  </Sheet>
);
DtC45.transition = transition;

/* ═══ 29 · DT: ATRIBUT KONTINU ════════════════════════════════════════════ */

const DtKontinu: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 7" tone={C.red}>
    <Head
      kicker="Isu"
      tone={C.red}
      title={<>Kalau Atributnya Berupa Angka</>}
      lead="Humidity yang tadinya high/normal bisa datang sebagai angka. Split tidak lagi per kategori, tapi per interval."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 50, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Steps>
          <Step>
            <Calc tone={C.ink} note="langkah 1">urutkan semua nilai humidity dari kecil ke besar</Calc>
          </Step>
          <Step>
            <Calc tone={C.ink} note="langkah 2">ambil distinct value — 70 yang muncul 3× cukup ditulis sekali</Calc>
          </Step>
          <Step>
            <Calc tone={C.ink} note="langkah 3">bentuk interval: ≤65 / &gt;65, lalu ≤70 / &gt;70, dan seterusnya</Calc>
          </Step>
          <Step>
            <Calc tone={C.red} note="langkah 4">hitung gain tiap interval, pilih yang tertinggi</Calc>
          </Step>
        </Steps>
        <Note rotate={-2} size={30}>
          prosesnya sama seperti fitur kategorikal — cuma batasnya sekarang berupa angka
        </Note>
      </div>

      <div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontFamily: mono, fontSize: 23 }}>
          <span style={{ border: `2.5px solid ${C.teal}`, padding: '8px 14px' }}>65</span>
          <span style={{ border: `2.5px solid ${C.ink}`, padding: '8px 14px', opacity: 0.55 }}>70</span>
          <span style={{ border: `2.5px solid ${C.ink}`, padding: '8px 14px', opacity: 0.55 }}>70</span>
          <span style={{ border: `2.5px solid ${C.ink}`, padding: '8px 14px', opacity: 0.55 }}>70</span>
          <span style={{ border: `2.5px solid ${C.teal}`, padding: '8px 14px' }}>75</span>
          <span style={{ border: `2.5px solid ${C.teal}`, padding: '8px 14px' }}>78</span>
          <span style={{ border: `2.5px solid ${C.teal}`, padding: '8px 14px' }}>80</span>
          <span style={{ border: `2.5px solid ${C.ink}`, padding: '8px 14px', opacity: 0.55 }}>…</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 17, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          nilai terurut → distinct value
        </div>
        <svg viewBox="0 0 760 260" width="100%" style={{ display: 'block', marginTop: 22 }} aria-hidden="true">
          <line x1="40" y1="60" x2="720" y2="60" stroke={C.ink} strokeWidth="3" />
          <line x1="120" y1="40" x2="120" y2="80" stroke={C.red} strokeWidth="3.5" />
          <line x1="300" y1="40" x2="300" y2="80" stroke={C.red} strokeWidth="3.5" />
          <line x1="480" y1="40" x2="480" y2="80" stroke={C.red} strokeWidth="3.5" />
          <text x="86" y="30" fontFamily={mono} fontSize="18" fill={C.red}>≤65</text>
          <text x="266" y="30" fontFamily={mono} fontSize="18" fill={C.red}>≤70</text>
          <text x="446" y="30" fontFamily={mono} fontSize="18" fill={C.red}>≤75</text>
          <rect x="40" y="100" width="160" height="54" fill={C.tealSoft} stroke={C.ink} strokeWidth="2.5" />
          <rect x="200" y="100" width="180" height="54" fill={C.card} stroke={C.ink} strokeWidth="2.5" />
          <rect x="380" y="100" width="180" height="54" fill={C.yellowSoft} stroke={C.ink} strokeWidth="2.5" />
          <rect x="560" y="100" width="160" height="54" fill={C.redSoft} stroke={C.ink} strokeWidth="2.5" />
          <text x="86" y="176" fontFamily={mono} fontSize="18" fill={C.muted}>≤65</text>
          <text x="256" y="176" fontFamily={mono} fontSize="18" fill={C.muted}>66–70</text>
          <text x="436" y="176" fontFamily={mono} fontSize="18" fill={C.muted}>71–75</text>
          <text x="616" y="176" fontFamily={mono} fontSize="18" fill={C.muted}>&gt;75</text>
          <text x="40" y="226" fontFamily={mono} fontSize="17" fill={C.ink}>tiap kandidat batas dievaluasi gain-nya — ambil yang terbaik</text>
          <text x="40" y="252" fontFamily="Caveat, cursive" fontSize="26" fill={C.muted}>berbeda dari kNN: di sini nilai jadi batas split</text>
        </svg>
      </div>
    </div>
  </Sheet>
);
DtKontinu.transition = transition;

/* ═══ 30 · DT: REPRESENTASI DATA ══════════════════════════════════════════ */

const DtRepresentasi: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 8" tone={C.red}>
    <Head
      kicker="Isu"
      tone={C.red}
      title={<>Dari Data Mentah ke Vektor Fitur</>}
      lead="Sebagian besar algoritma pembelajaran butuh data dalam representasi numerik. Tiga kasus yang muncul di transkrip:"
    />
    <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 36 }}>
      <Card tone={C.teal} pad={24}>
        <Tag tone={C.teal}>numerik</Tag>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Gambar → vektor</div>
        <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
          Citra 28×28 piksel diperlakukan sebagai vektor 784 nilai intensitas.
        </div>
        <svg viewBox="0 0 260 120" width="100%" style={{ display: 'block', marginTop: 14 }} aria-hidden="true">
          <rect x="6" y="6" width="104" height="104" fill={C.card} stroke={C.ink} strokeWidth="2.5" />
          <line x1="6" y1="32" x2="110" y2="32" stroke={C.hairline} strokeWidth="1.5" />
          <line x1="6" y1="58" x2="110" y2="58" stroke={C.hairline} strokeWidth="1.5" />
          <line x1="6" y1="84" x2="110" y2="84" stroke={C.hairline} strokeWidth="1.5" />
          <line x1="32" y1="6" x2="32" y2="110" stroke={C.hairline} strokeWidth="1.5" />
          <line x1="58" y1="6" x2="58" y2="110" stroke={C.hairline} strokeWidth="1.5" />
          <line x1="84" y1="6" x2="84" y2="110" stroke={C.hairline} strokeWidth="1.5" />
          <text x="126" y="62" fontFamily={mono} fontSize="22" fill={C.red}>→</text>
          <text x="156" y="55" fontFamily={mono} fontSize="20" fill={C.ink}>[x₁, x₂,</text>
          <text x="156" y="80" fontFamily={mono} fontSize="20" fill={C.ink}>…, x₇₈₄]</text>
        </svg>
      </Card>

      <Card tone={C.red} pad={24}>
        <Tag tone={C.red}>teks</Tag>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Dokumen → frekuensi</div>
        <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
          Email atau dokumen direpresentasikan lewat <strong>frekuensi kemunculan kata</strong> — ada banyak varian lain.
        </div>
        <div style={{ fontFamily: mono, fontSize: 19, marginTop: 14, background: C.yellowSoft, padding: '10px 14px', lineHeight: 1.6 }}>
          “rapat”: 3 · “nilai”: 7<br />“ujian”: 1 · …
        </div>
      </Card>

      <Card tone={C.yellow} pad={24}>
        <Tag tone={C.yellow}>kategorikal</Tag>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Dua nilai → 0/1</div>
        <div style={{ fontSize: 20, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.5 }}>
          Fitur dengan tepat dua kemungkinan paling mudah: petakan langsung ke 0 dan 1.
        </div>
        <div style={{ fontFamily: mono, fontSize: 19, marginTop: 14, background: C.card, border: `2px solid ${C.ink}`, padding: '10px 14px', lineHeight: 1.6 }}>
          yes → 1  ·  no → 0<br />high → 1  ·  normal → 0
        </div>
        <div style={{ fontSize: 19, color: C.muted, fontWeight: 600, marginTop: 10 }}>
          Tapi bagaimana kalau nilainya lebih dari dua? → halaman berikutnya.
        </div>
      </Card>
    </div>
    <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 18 }}>
      <Tag tone={C.red}>catatan</Tag>
      <span style={{ fontSize: 22, fontWeight: 600, color: C.soft }}>
            Untuk fitur numerik real, nilainya bisa dipakai langsung tanpa transformasi khusus.
      </span>
    </div>
  </Sheet>
);
DtRepresentasi.transition = transition;

/* ═══ 31 · DT: ONE-HOT ════════════════════════════════════════════════════ */

const DtOneHot: Page = () => (
  <Sheet chapter="Decision Tree · Seksi 8" tone={C.red}>
    <Head
      kicker="Isu"
      tone={C.red}
      title={<>Fitur Bernilai Lebih dari Dua</>}
      lead="Memetakan sunny=0, overcast=1, rain=2 berbahaya: angkanya menyiratkan jarak dan urutan yang tidak nyata."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 48, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone={C.red} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Masalah jarak palsu</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.55 }}>
            Warna red=0, blue=1, green=2: seolah red–blue “berjarak” sama dengan blue–green, dan red lebih dekat ke blue daripada ke green. Padahal tidak begitu.
          </div>
        </Card>
        <Card tone={C.teal} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Solusi: one-hot encoding</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 10, lineHeight: 1.55 }}>
            Setiap nilai fitur menjadi <strong>fitur biner baru</strong>: muncul (1) atau tidak (0).
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, marginTop: 12 }}>
            outlook (3 nilai) → 3 fitur baru
          </div>
        </Card>
        <Note rotate={-2} size={30}>
          tidak hanya untuk decision tree — berlaku di supervised learning lain
        </Note>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Sampel</Th>
            <Th align="center">Outlook</Th>
            <Th align="center">f_sunny</Th>
            <Th align="center">f_overcast</Th>
            <Th align="right">f_rain</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td num>1</Td><Td>Sunny</Td><Td num align="center" tone={C.teal} strong>1</Td><Td num align="center">0</Td><Td num align="right">0</Td>
          </tr>
          <tr>
            <Td num>2</Td><Td>Sunny</Td><Td num align="center" tone={C.teal} strong>1</Td><Td num align="center">0</Td><Td num align="right">0</Td>
          </tr>
          <tr>
            <Td num>3</Td><Td>Overcast</Td><Td num align="center">0</Td><Td num align="center" tone={C.teal} strong>1</Td><Td num align="right">0</Td>
          </tr>
          <tr>
            <Td num>4</Td><Td>Rain</Td><Td num align="center">0</Td><Td num align="center">0</Td><Td num align="right" tone={C.teal} strong>1</Td>
          </tr>
          <tr>
            <Td num>5</Td><Td>Rain</Td><Td num align="center">0</Td><Td num align="center">0</Td><Td num align="right" tone={C.teal} strong>1</Td>
          </tr>
        </tbody>
      </table>
    </div>
  </Sheet>
);
DtOneHot.transition = transition;
/* ═══ 32 · SVM: INTUISI ═══════════════════════════════════════════════════ */

const SvmIntuisi: Page = () => (
  <Sheet chapter="SVM · Seksi 1" tone={C.yellow} foot="kNN · DECISION TREE · SVM">
    <Head
      kicker="Intuisi"
      tone={C.yellow}
      title={<>Banyak Garis Benar, Satu Paling Baik</>}
      lead="Pengklasifikasi linear: f(x) = sign(w·x + b). Dua kelas bisa dipisah dengan tak hingga garis — mana yang dipilih?"
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 48, alignItems: 'start' }}>
      <svg viewBox="0 0 660 520" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <line x1="70" y1="40" x2="70" y2="470" stroke={C.rule} strokeWidth="2" />
        <line x1="70" y1="470" x2="630" y2="470" stroke={C.rule} strokeWidth="2" />
        <circle cx="150" cy="120" r="11" fill={C.teal} />
        <circle cx="220" cy="90" r="11" fill={C.teal} />
        <circle cx="120" cy="220" r="11" fill={C.teal} />
        <circle cx="260" cy="180" r="11" fill={C.teal} />
        <circle cx="190" cy="300" r="11" fill={C.teal} />
        <circle cx="430" cy="340" r="11" fill={C.red} />
        <circle cx="520" cy="290" r="11" fill={C.red} />
        <circle cx="560" cy="400" r="11" fill={C.red} />
        <circle cx="470" cy="430" r="11" fill={C.red} />
        <circle cx="600" cy="340" r="11" fill={C.red} />
        <line x1="80" y1="430" x2="620" y2="160" stroke={C.ink} strokeWidth="3" strokeDasharray="10 8" opacity="0.5" />
        <line x1="80" y1="370" x2="620" y2="240" stroke={C.ink} strokeWidth="3" />
        <line x1="80" y1="300" x2="620" y2="330" stroke={C.ink} strokeWidth="3" strokeDasharray="10 8" opacity="0.5" />
        <text x="412" y="112" fontFamily={mono} fontSize="19" fill={C.muted}>kandidat garis lain</text>
        <text x="120" y="500" fontFamily={mono} fontSize="19" fill={C.teal}>kelas positif (+1)</text>
        <text x="432" y="500" fontFamily={mono} fontSize="19" fill={C.red}>kelas negatif (−1)</text>
        <text x="88" y="86" fontFamily="Caveat, cursive" fontSize="30" fill={C.teal}>semuanya benar?</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 15 }}>
          <Li tone={C.yellow} size={24}>
            <strong>Signum</strong>: nilai positif → kelas +1; negatif → −1; nol tepat di hyperplane.
          </Li>
          <Li tone={C.yellow} size={24}>
            Semua garis pada gambar sama-sama mengklasifikasikan data latih dengan benar — tapi belum tentu benar untuk data uji baru.
          </Li>
          <Li tone={C.yellow} size={24}>
            “Paling baik” = <Hl>memisahkan data latih dengan margin maksimum</Hl>; harapannya, batas ini juga menggeneralisasi ke data baru.
          </Li>
          <Li tone={C.yellow} size={24}>
            Garis pemisah terbaik disebut <strong>hyperplane</strong> — di ruang 2D ia berupa garis, di dimensi lebih tinggi berupa bidang.
          </Li>
        </ul>
        <Card tone={C.yellow} pad={22}>
          <div style={{ fontSize: 21, fontWeight: 600, color: C.soft, lineHeight: 1.5 }}>
            Cara memilihnya: ukur <strong>margin</strong> tiap kandidat, lalu ambil yang <strong>terlebar</strong>. Itulah Linear SVM (LSVM).
          </div>
        </Card>
        <Note rotate={-2} size={30}>
          cari hyperplane dengan margin maksimum
        </Note>
      </div>
    </div>
  </Sheet>
);
SvmIntuisi.transition = transition;

/* ═══ 33 · SVM: MARGIN & SUPPORT VECTOR ═══════════════════════════════════ */

const SvmMargin: Page = () => (
  <Sheet chapter="SVM · Seksi 1" tone={C.yellow}>
    <Head
      kicker="Konsep"
      tone={C.yellow}
      title={<>Margin Maksimum & Support Vector</>}
      lead="Support vector berada pada margin plane; lebar pita margin adalah dua kali jarak hyperplane ke support vector."
    />
    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1.06fr 0.94fr', gap: 46, alignItems: 'start' }}>
      <svg viewBox="0 0 760 560" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <line x1="40" y1="470" x2="730" y2="470" stroke={C.hairline} strokeWidth="2" />
        <line x1="40" y1="20" x2="40" y2="470" stroke={C.hairline} strokeWidth="2" />
        <line x1="46" y1="190" x2="712" y2="190" stroke={C.muted} strokeWidth="2.5" strokeDasharray="10 9" />
        <line x1="46" y1="350" x2="712" y2="350" stroke={C.muted} strokeWidth="2.5" strokeDasharray="10 9" />
        <line x1="46" y1="270" x2="712" y2="270" stroke={C.red} strokeWidth="3.5" />
        <line x1="620" y1="190" x2="620" y2="350" stroke={C.teal} strokeWidth="2.5" />
        <path d="M613 202 L620 188 L627 202" stroke={C.teal} strokeWidth="2.5" fill="none" />
        <path d="M613 338 L620 352 L627 338" stroke={C.teal} strokeWidth="2.5" fill="none" />
        <circle cx="180" cy="110" r="9" fill={C.teal} />
        <circle cx="340" cy="130" r="9" fill={C.teal} />
        <circle cx="280" cy="190" r="19" fill="none" stroke={C.teal} strokeWidth="3" />
        <circle cx="280" cy="190" r="9" fill={C.teal} />
        <circle cx="470" cy="130" r="9" fill={C.teal} />
        <circle cx="600" cy="90" r="9" fill={C.teal} />
        <circle cx="210" cy="410" r="9" fill={C.red} />
        <circle cx="360" cy="430" r="9" fill={C.red} />
        <circle cx="500" cy="350" r="19" fill="none" stroke={C.red} strokeWidth="3" />
        <circle cx="500" cy="350" r="9" fill={C.red} />
        <circle cx="640" cy="400" r="9" fill={C.red} />
        <text x="52" y="180" fontFamily={mono} fontSize="19" fill={C.muted}>plus plane</text>
        <text x="52" y="260" fontFamily={mono} fontSize="19" fill={C.red}>hyperplane</text>
        <text x="52" y="340" fontFamily={mono} fontSize="19" fill={C.muted}>minus plane</text>
        <text x="636" y="275" fontFamily={mono} fontSize="20" fill={C.teal}>margin width</text>
        <text x="300" y="220" fontFamily={mono} fontSize="17" fill={C.teal}>support vector</text>
        <text x="520" y="385" fontFamily={mono} fontSize="17" fill={C.red}>support vector</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card tone={C.yellow} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Kenapa margin harus maksimal?</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Margin lebar = ruang aman lebih besar → kemungkinan data uji baru salah klasifikasi mengecil.
          </div>
        </Card>
        <Card tone={C.yellow} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Hanya support vector yang menentukan</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Titik pada margin (support vector) menentukan hyperplane; titik yang jauh dari margin biasanya tidak mengubah solusinya.
          </div>
        </Card>
        <Card tone={C.teal} pad={22}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Hasil empiris</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Kombinasi <strong>maximum margin</strong> + <strong>support vector</strong> terbukti memberi hasil sangat baik pada banyak uji coba.
          </div>
        </Card>
        <Note rotate={-2} size={30}>
          titik yang jauh dari garis tidak ikut “menyokong” keputusan
        </Note>
      </div>
    </div>
  </Sheet>
);
SvmMargin.transition = transition;

/* ═══ 34 · SVM: FORMULASI ═════════════════════════════════════════════════ */

const SvmFormulasi: Page = () => (
  <Sheet chapter="SVM · Seksi 2" tone={C.yellow}>
    <Head
      kicker="Matematika · 1/2"
      tone={C.yellow}
      title={<>Tiga Garis, Satu Aturan</>}
      lead="Untuk mendapatkan hyperplane, kita spesifikasikan tiga garis: hyperplane itu sendiri, plus plane, dan minus plane."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Formula label="Plus plane — melalui support vector kelas +1" tone={C.teal} size={26}>
          w·x + b = +1
        </Formula>
        <Formula label="Hyperplane — yang dicari" tone={C.red} size={26}>
          w·x + b = 0
        </Formula>
        <Formula label="Minus plane — kelas −1" tone={C.teal} size={26}>
          w·x + b = −1
        </Formula>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone={C.yellow} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Aturan klasifikasi</div>
          <div style={{ fontFamily: mono, fontSize: 22, marginTop: 12, lineHeight: 1.7 }}>
            w·x + b ≥ +1  →  kelas +1<br />
            w·x + b ≤ −1  →  kelas −1<br />
            −1 &lt; w·x + b &lt; +1  →  area margin
          </div>
        </Card>
        <Card tone={C.teal} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Fakta geometris: w tegak lurus bidang</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Ambil dua vektor U dan V di plus plane: W·(U−V) = 0 — hasil kali titiknya nol, artinya W <strong>ortogonal</strong> terhadap bidang.
          </div>
        </Card>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, lineHeight: 1.5 }}>
          Titik pada minus plane ditulis x⁻, titik terdekat di plus plane ditulis x⁺. Keduanya terhubung arah W — bekal untuk menghitung margin.
        </div>
        <Note rotate={-2} size={30}>
          margin bukan jarak antar kelas — tapi lebar area di antara dua plane
        </Note>
      </div>
    </div>
  </Sheet>
);
SvmFormulasi.transition = transition;

/* ═══ 35 · SVM: DERIVASI MARGIN ═══════════════════════════════════════════ */

const SvmDerivasi: Page = () => (
  <Sheet chapter="SVM · Seksi 2" tone={C.yellow}>
    <Head
      kicker="Matematika · 2/2"
      tone={C.yellow}
      title={<>Dari Dua Plane ke M = 2 / √(w·w)</>}
      lead="Empat baris aljabar yang mengubah “margin selebar mungkin” menjadi fungsi objektif yang bisa dioptimalkan."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 50, alignItems: 'start' }}>
      <div>
      <Steps>
        <Step>
          <Calc tone={C.ink} note="bergerak dari x⁻ ke x⁺ searah W">
            x⁺ = x⁻ + λW
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="substitusi ke persamaan plus plane">
            (w·x⁻ + b) + λ(w·w) = +1
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="karena w·x⁻ + b = −1">
            −1 + λ‖w‖² = 1  →  λ = 2 / (w·w)
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="panjang vektor = √(w·w)">
            M = λ‖W‖ = 2 / √(w·w)
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="margin maksimum">
            maksimalkan 2 / √(w·w)
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="bentuk yang dioptimalkan">
            ≡ <strong>minimalkan ½ ‖w‖²</strong> dengan kendala yᵢ(w·xᵢ + b) ≥ 1
          </Calc>
        </Step>
      </Steps>
    </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Formula label="Fungsi objektif" tone={C.red} size={30}>
          min  ½ ‖w‖²
        </Formula>
        <Card tone={C.yellow} pad={24}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Solusinya lewat quadratic programming</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Masalah optimasi dengan kendala pertidaksamaan ini diselesaikan dengan teknik QP — di deck ini kita cukup memahami bentuk objektifnya.
          </div>
        </Card>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          ‖w‖ adalah panjang vektor W. Semakin kecil ‖w‖, semakin besar margin 2/‖w‖ — karena itu keduanya ekuivalen.
        </div>
        <Note rotate={-2} size={30}>
          ½ dipakai supaya turunannya nanti rapi — tidak mengubah solusinya
        </Note>
      </div>
    </div>
  </Sheet>
);
SvmDerivasi.transition = transition;

/* ═══ 36 · SVM: CONTOH HITUNG ═════════════════════════════════════════════ */

const SvmContoh: Page = () => (
  <Sheet chapter="SVM · Seksi 3" tone={C.yellow}>
    <Head
      kicker="Contoh · 1/2"
      tone={C.yellow}
      title={<>Empat Titik, Tiga Support Vector</>}
      lead="Data minimal: dua fitur, kelas +1 dan −1. Tiga titik menjadi support vector; satu titik tidak berpengaruh."
    />
    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 46, alignItems: 'start' }}>
      <div>
        <svg viewBox="0 0 560 480" width="100%" style={{ display: 'block' }} aria-hidden="true">
          <line x1="60" y1="60" x2="60" y2="420" stroke={C.hairline} strokeWidth="2" />
          <line x1="60" y1="240" x2="520" y2="240" stroke={C.hairline} strokeWidth="2" />
          <line x1="60" y1="240" x2="500" y2="240" stroke={C.rule} strokeWidth="2" />
          <line x1="260" y1="40" x2="260" y2="420" stroke={C.rule} strokeWidth="2" />
          <text x="500" y="268" fontFamily={mono} fontSize="18" fill={C.muted}>x₁</text>
          <text x="24" y="52" fontFamily={mono} fontSize="18" fill={C.muted}>x₂</text>
          <line x1="140" y1="80" x2="500" y2="320" stroke={C.red} strokeWidth="3" opacity="0.85" />
          <text x="346" y="108" fontFamily={mono} fontSize="18" fill={C.teal}>(1,1) +1</text>
          <text x="280" y="208" fontFamily={mono} fontSize="18" fill={C.red}>x₁+x₂−1=0</text>
          <circle cx="140" cy="160" r="22" fill="none" stroke={C.red} strokeWidth="3" />
          <circle cx="140" cy="160" r="10" fill={C.red} />
          <circle cx="380" cy="160" r="22" fill="none" stroke={C.teal} strokeWidth="3" />
          <circle cx="380" cy="160" r="10" fill={C.teal} />
          <circle cx="380" cy="320" r="22" fill="none" stroke={C.red} strokeWidth="3" />
          <circle cx="380" cy="320" r="10" fill={C.red} />
          <circle cx="140" cy="320" r="10" fill={C.muted} opacity="0.6" />
          <text x="76" y="360" fontFamily={mono} fontSize="18" fill={C.muted}>(−1,−1) −1</text>
          <text x="396" y="352" fontFamily={mono} fontSize="18" fill={C.red}>(1,−1) −1</text>
          <text x="76" y="208" fontFamily={mono} fontSize="17" fill={C.red}>(−1,1) −1</text>
          <text x="76" y="384" fontFamily={mono} fontSize="17" fill={C.muted}>bukan SV</text>
          <text x="60" y="452" fontFamily="Caveat, cursive" fontSize="27" fill={C.muted}>tiga titik bercincin = support vector</text>
        </svg>
      </div>

      <div>
      <Steps>
        <Step>
          <Calc tone={C.ink} note="4 kendala">
            yᵢ(w·xᵢ + b) ≥ 1 untuk i = 1…4
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="(+1,1): w₁ + w₂ + b ≥ 1">
            kendala 1 · kelas +1
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="(−1,1): w₁ − w₂ − b ≥ 1">
            kendala 3 · titik (−1,1)
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="kendala 1 + 2 → w₂ = 1">
            eliminasi: w₂ = 1
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="kendala 1 + 3 → w₁ = 1">
            eliminasi: w₁ = 1
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="kendala 2 + 3 → −2b = 2">
            eliminasi: b = −1
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.teal} note="hyperplane final">
            x₁ + x₂ − 1 = 0  →  x₂ = 1 − x₁
          </Calc>
        </Step>
      </Steps>
    </div>
    </div>
  </Sheet>
);
SvmContoh.transition = transition;

/* ═══ 37 · SVM: PREDIKSI DATA UJI ═════════════════════════════════════════ */

const SvmPrediksi: Page = () => (
  <Sheet chapter="SVM · Seksi 3" tone={C.yellow}>
    <Head
      kicker="Contoh · 2/2"
      tone={C.yellow}
      title={<>Uji Hyperplane ke Dua Titik Baru</>}
      lead="Dengan x₁ + x₂ − 1 = 0, prediksi cukup dihitung lewat tanda fungsi f(x)."
    />
    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 46, alignItems: 'start' }}>
      <svg viewBox="0 0 700 540" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <line x1="60" y1="30" x2="60" y2="500" stroke={C.hairline} strokeWidth="2" />
        <line x1="60" y1="350" x2="660" y2="350" stroke={C.hairline} strokeWidth="2" />
        <line x1="60" y1="150" x2="550" y2="500" stroke={C.muted} strokeWidth="2" strokeDasharray="10 9" />
        <line x1="60" y1="200" x2="480" y2="500" stroke={C.red} strokeWidth="3.5" />
        <line x1="60" y1="250" x2="410" y2="500" stroke={C.muted} strokeWidth="2" strokeDasharray="10 9" />
        <rect x="228" y="90" width="22" height="22" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="258" y="110" fontFamily={mono} fontSize="19" fill={C.ink}>(1,5) → +1</text>
        <rect x="298" y="428" width="22" height="22" fill={C.card} stroke={C.ink} strokeWidth="3.5" />
        <text x="328" y="448" fontFamily={mono} fontSize="19" fill={C.ink}>(2,−2) → −1</text>
        <text x="84" y="246" fontFamily={mono} fontSize="18" fill={C.red}>x₂ = 1 − x₁</text>
        <text x="66" y="138" fontFamily={mono} fontSize="17" fill={C.muted}>margin planes</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Steps>
          <Step>
            <Calc tone={C.teal} note="1 + 5 − 1 = 5 > 0">
              f(1,5) = +1 (signum positif)
            </Calc>
          </Step>
          <Step>
            <Calc tone={C.red} note="2 − 2 − 1 = −1 < 0">
              f(2,−2) = −1 (signum negatif)
            </Calc>
          </Step>
        </Steps>
        <Card tone={C.yellow} pad={24}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Cara membaca hasilnya</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.55 }}>
            Substitusi nilai x₁ dan x₂ ke persamaan hyperplane, lalu ambil tandanya. Untuk titik lain, konsepnya sama.
          </div>
        </Card>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          Titik (1,5) berada jauh di sisi kelas +1 — hasilnya konsisten dengan gambar. Begitu juga (2,−2) di sisi kelas −1.
        </div>
        <Note rotate={-2} size={30}>
          prediksi SVM = tanda fungsi, bukan jarak
        </Note>
      </div>
    </div>
  </Sheet>
);
SvmPrediksi.transition = transition;
/* ═══ 38 · SVM: NON-LINEAR & KERNEL ═══════════════════════════════════════ */

const SvmKernel: Page = () => (
  <Sheet chapter="SVM · Seksi 4" tone={C.yellow}>
    <Head
      kicker="Non-Linear"
      tone={C.yellow}
      title={<>Kalau Satu Garis Tidak Cukup</>}
      lead="Data yang tidak terpisah linear dipetakan ke ruang berdimensi lebih tinggi — di sana garis lurus kembali bekerja."
    />
    <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 50, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Card tone={C.red} pad={24}>
          <Tag tone={C.red}>masalah · satu dimensi</Tag>
          <svg viewBox="0 0 640 120" width="100%" style={{ display: 'block', marginTop: 12, height: 104 }} aria-hidden="true">
            <line x1="30" y1="70" x2="610" y2="70" stroke={C.rule} strokeWidth="2.5" />
            <circle cx="90" cy="70" r="11" fill={C.red} />
            <circle cx="150" cy="70" r="11" fill={C.red} />
            <circle cx="300" cy="70" r="11" fill={C.teal} />
            <circle cx="340" cy="70" r="11" fill={C.teal} />
            <circle cx="380" cy="70" r="11" fill={C.teal} />
            <circle cx="530" cy="70" r="11" fill={C.red} />
            <circle cx="590" cy="70" r="11" fill={C.red} />
            <text x="30" y="112" fontFamily={mono} fontSize="17" fill={C.muted}>satu titik potong tidak pernah memisahkan kelas merah & teal</text>
          </svg>
        </Card>
        <Card tone={C.teal} pad={24}>
          <Tag tone={C.teal}>solusi · dua dimensi</Tag>
          <svg viewBox="0 0 640 240" width="100%" style={{ display: 'block', marginTop: 12, height: 218 }} aria-hidden="true">
            <line x1="40" y1="210" x2="600" y2="210" stroke={C.hairline} strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="210" stroke={C.hairline} strokeWidth="2" />
            <text x="606" y="216" fontFamily={mono} fontSize="17" fill={C.muted}>x</text>
            <text x="14" y="28" fontFamily={mono} fontSize="17" fill={C.muted}>x²</text>
            <line x1="40" y1="130" x2="600" y2="130" stroke={C.red} strokeWidth="3" />
            <circle cx="90" cy="58" r="10" fill={C.red} />
            <circle cx="150" cy="82" r="10" fill={C.red} />
            <circle cx="530" cy="82" r="10" fill={C.red} />
            <circle cx="590" cy="58" r="10" fill={C.red} />
            <circle cx="260" cy="176" r="10" fill={C.teal} />
            <circle cx="320" cy="186" r="10" fill={C.teal} />
            <circle cx="380" cy="176" r="10" fill={C.teal} />
            <text x="418" y="120" fontFamily={mono} fontSize="17" fill={C.red}>bidang pemisah</text>
            <text x="46" y="60" fontFamily={mono} fontSize="17" fill={C.muted}>merah: x² besar</text>
            <text x="46" y="200" fontFamily={mono} fontSize="17" fill={C.teal}>teal: x² kecil</text>
          </svg>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Card tone={C.yellow} pad={24}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>Kernel trick</div>
          <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, marginTop: 8, lineHeight: 1.5 }}>
            Pemetaan ke dimensi lebih tinggi dilakukan lewat <strong>fungsi kernel</strong> — tanpa menghitung transformasi eksplisit. Fungsi linear di ruang baru = classifier non-linear di ruang asal.
          </div>
        </Card>
        <Formula label="Jenis kernel" tone={C.red} size={21}>
          polinomial  (xᵀy + c)<sup>d</sup><br />
          RBF  exp(−‖x−y‖² / 2σ²)<br />
          sigmoid  tanh(αxᵀy + c)
        </Formula>
        <div style={{ fontSize: 20.5, color: C.soft, fontWeight: 500, lineHeight: 1.55 }}>
          Di ruang 3D, hyperplane-nya berupa <strong>bidang</strong>. Semakin kompleks data, semakin banyak varian kernel yang dikembangkan peneliti.
        </div>
        <Card tone={C.teal} pad={22}>
          <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.5 }}>
            Linear kernel → data terpisah garis; kernel non-linear → data yang tidak terpisah linear.
          </div>
        </Card>
      </div>
    </div>
  </Sheet>
);
SvmKernel.transition = transition;

/* ═══ 39 · SVM: CONTOH POLINOMIAL ═════════════════════════════════════════ */

const SvmPolinomial: Page = () => (
  <Sheet chapter="SVM · Seksi 5" tone={C.yellow}>
    <Head
      kicker="Kernel"
      tone={C.yellow}
      title={<>Polinomial: Dari 2D ke 3D</>}
      lead="Contoh kernel polinomial homogen derajat 2 (c=0): fitur kuadrat mengubah pemisahan di ruang asal menjadi linear di ruang fitur."
    />
    <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 48, alignItems: 'start' }}>
      <div>
      <Steps>
        <Step>
          <Calc tone={C.ink} note="dua fitur awal">
            x = [x₁, x₂]ᵀ
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="hasil kali titik">
            x xᵀ = [[x₁², x₁x₂], [x₂x₁, x₂²]]
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.ink} note="perhatikan suku silangnya">
            x₁² · x₁x₂ · x₂x₁ · x₂²
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="komutatif; pemetaan kernel eksak memberi √2 pada suku silang">
            φ(x) = <strong>[x₁², √2 x₁x₂, x₂²]</strong>
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.red} note="contoh homogen: d = 2, c = 0">
            fitur 2D → fitur 3D
          </Calc>
        </Step>
        <Step>
          <Calc tone={C.teal} note="di ruang baru">
            data jadi <strong>linearly separable</strong> — hyperplane bisa dipasang
          </Calc>
        </Step>
      </Steps>
    </div>

      <div>
        <svg viewBox="0 0 660 420" width="100%" style={{ display: 'block' }} aria-hidden="true">
          <text x="0" y="20" fontFamily={mono} fontSize="17" fill={C.muted}>SEBELUM · ruang asal</text>
          <circle cx="180" cy="130" r="96" fill="none" stroke={C.hairline} strokeWidth="2.5" strokeDasharray="8 7" />
          <circle cx="180" cy="130" r="58" fill="none" stroke={C.hairline} strokeWidth="2.5" strokeDasharray="8 7" />
          <circle cx="180" cy="34" r="11" fill={C.red} />
          <circle cx="286" cy="130" r="11" fill={C.red} />
          <circle cx="180" cy="226" r="11" fill={C.red} />
          <circle cx="74" cy="130" r="11" fill={C.red} />
          <circle cx="140" cy="90" r="11" fill={C.teal} />
          <circle cx="220" cy="90" r="11" fill={C.teal} />
          <circle cx="180" cy="170" r="11" fill={C.teal} />
          <circle cx="218" cy="166" r="11" fill={C.teal} />
          <text x="70" y="280" fontFamily={mono} fontSize="17" fill={C.muted}>lingkaran dalam vs cincin luar</text>
          <text x="330" y="140" fontFamily={mono} fontSize="30" fill={C.red}>→</text>
          <text x="392" y="20" fontFamily={mono} fontSize="17" fill={C.muted}>SESUDAH · ruang fitur</text>
          <line x1="400" y1="230" x2="650" y2="230" stroke={C.hairline} strokeWidth="2" />
          <line x1="400" y1="40" x2="400" y2="230" stroke={C.hairline} strokeWidth="2" />
          <line x1="400" y1="120" x2="650" y2="120" stroke={C.red} strokeWidth="3" />
            <path d="M70 42 C150 64 210 158 320 194 C430 158 490 64 570 42" stroke={C.hairline} strokeWidth="2.5" fill="none" />
            <circle cx="260" cy="176" r="10" fill={C.teal} />
            <circle cx="320" cy="190" r="10" fill={C.teal} />
            <circle cx="380" cy="176" r="10" fill={C.teal} />
          <circle cx="580" cy="86" r="10" fill={C.red} />
          <circle cx="620" cy="70" r="10" fill={C.red} />
          <text x="440" y="112" fontFamily={mono} fontSize="16" fill={C.red}>pemisah linear</text>
        </svg>
        <div style={{ marginTop: 12, fontSize: 21, color: C.soft, fontWeight: 600, lineHeight: 1.5 }}>
          Di ruang 3D, dua kelas terpisah rapi — klasifikasi kembali menjadi masalah linear biasa.
        </div>
      </div>
    </div>
  </Sheet>
);
SvmPolinomial.transition = transition;

/* ═══ 40 · SVM: IMPLEMENTASI PYTHON ══════════════════════════════════════ */

const Code = ({ children, tone = C.yellow }: { children: ReactNode; tone?: string }) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 19,
      lineHeight: 1.72,
      background: C.card,
      border: `3px solid ${C.ink}`,
      boxShadow: `7px 7px 0 ${tone}`,
      padding: '16px 20px',
      whiteSpace: 'pre',
    }}
  >
    {children}
  </div>
);

const SvmPython: Page = () => (
  <Sheet chapter="SVM · Seksi 6" tone={C.yellow}>
    <Head
      kicker="Praktik"
      tone={C.yellow}
      title={<>scikit-learn: 45% → 100%</>}
      lead="Dataset sintetis dua kelas dengan radius 10 dan 5 (400 titik). Split 75/25 → 300 latih, 100 uji."
    />
    <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 46, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Code tone={C.red}>{`svc = SVC(kernel='linear')
svc.fit(X_train, y_train)
svc.score(X_test, y_test)
→ ± 0,45–0,50`}</Code>
          <Code tone={C.teal}>{`# fitur kuadrat + refit SVC linear
cols = ['x1', 'x2', 'x1²',
        'x2²', 'x1·x2']
X2 = df[cols]
Xtr, Xte, ytr, yte = train_test_split(
    X2, y, test_size=.25)
svc = SVC(kernel='linear')
svc.fit(Xtr, ytr)
svc.score(Xte, yte) → 1.00`}</Code>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Li tone={C.yellow} size={21}>Kernel linear pada data lingkaran: garis terbaik pun hanya menebak sekitar setengah.</Li>
          <Li tone={C.yellow} size={21}>Setelah tiga fitur kuadrat ditambahkan, data linearis — akurasi langsung 100% pada data uji.</Li>
          <Li tone={C.yellow} size={21}>SVC = Support Vector Classification; untuk regresi ada SVR.</Li>
        </ul>
        <Note rotate={-2} size={30}>
          fitur kuadrat dibuat manual, lalu SVC linear dilatih ulang
        </Note>
      </div>

      <svg viewBox="0 0 640 480" width="100%" style={{ display: 'block' }} aria-hidden="true">
        <text x="0" y="20" fontFamily={mono} fontSize="17" fill={C.muted}>KERNEL LINEAR · ± 50%</text>
        <circle cx="180" cy="170" r="118" fill="none" stroke={C.hairline} strokeWidth="2.5" strokeDasharray="8 7" />
        <circle cx="180" cy="170" r="64" fill="none" stroke={C.hairline} strokeWidth="2.5" strokeDasharray="8 7" />
        <circle cx="180" cy="52" r="10" fill={C.red} />
        <circle cx="298" cy="170" r="10" fill={C.red} />
        <circle cx="180" cy="288" r="10" fill={C.red} />
        <circle cx="62" cy="170" r="10" fill={C.red} />
        <circle cx="140" cy="130" r="10" fill={C.teal} />
        <circle cx="220" cy="130" r="10" fill={C.teal} />
        <circle cx="180" cy="210" r="10" fill={C.teal} />
        <line x1="30" y1="310" x2="330" y2="50" stroke={C.red} strokeWidth="3" />
        <text x="150" y="330" fontFamily={mono} fontSize="17" fill={C.red}>garis apa pun tetap meleset</text>

        <text x="360" y="20" fontFamily={mono} fontSize="17" fill={C.muted}>SETELAH FITUR KUADRAT · 100%</text>
        <line x1="372" y1="250" x2="620" y2="250" stroke={C.hairline} strokeWidth="2" />
        <line x1="372" y1="60" x2="372" y2="250" stroke={C.hairline} strokeWidth="2" />
        <line x1="372" y1="140" x2="620" y2="140" stroke={C.teal} strokeWidth="3" />
        <path d="M400 232 C440 226 470 196 500 160 C530 122 560 96 590 82" stroke={C.hairline} strokeWidth="2.5" fill="none" />
        <circle cx="420" cy="222" r="10" fill={C.teal} />
        <circle cx="460" cy="200" r="10" fill={C.teal} />
        <circle cx="500" cy="172" r="10" fill={C.teal} />
        <circle cx="560" cy="104" r="10" fill={C.red} />
        <circle cx="600" cy="90" r="10" fill={C.red} />
        <text x="398" y="130" fontFamily={mono} fontSize="16" fill={C.teal}>bidang pemisah</text>
        <text x="72" y="430" fontFamily="Caveat, cursive" fontSize="27" fill={C.muted}>fitur tambahan = “peta” ke ruang yang lebih tinggi</text>
      </svg>
    </div>
  </Sheet>
);
SvmPython.transition = transition;

/* ═══ 41 · REKAP ══════════════════════════════════════════════════════════ */

const Rekap: Page = () => (
  <Sheet chapter="Rekap" tone={C.teal}>
    <Head
      kicker="Rekap"
      tone={C.teal}
      title={<>Tiga Metode, Satu Tabel</>}
      lead="Semuanya supervised learning untuk klasifikasi — yang berbeda: cara memandang keputusan dan kapan biayanya dibayar."
    />
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 30 }}>
      <thead>
        <tr>
          <Th w={220}>Aspek</Th>
          <Th tone={C.teal}>kNN</Th>
          <Th tone={C.red}>Decision Tree</Th>
          <Th tone={C.yellow}>SVM</Th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td strong>Kategori</Td>
          <Td>Lazy · instance-based</Td>
          <Td>Eager</Td>
          <Td>Eager</Td>
        </tr>
        <tr>
          <Td strong>Kunci keputusan</Td>
          <Td>Kemiripan: jarak + voting mayoritas</Td>
          <Td>Aturan; split dipilih via entropi & gain</Td>
          <Td>Margin: hyperplane & support vector</Td>
        </tr>
        <tr>
          <Td strong>Hyperparameter</Td>
          <Td>Nilai k & ukuran jarak</Td>
          <Td>Kedalaman, kriteria split, pruning</Td>
          <Td>Jenis kernel (C, γ di luar cakupan)</Td>
        </tr>
        <tr>
          <Td strong>Kelebihan</Td>
          <Td>Batas non-linear, tanpa asumsi distribusi</Td>
          <Td>Mudah dibaca sebagai aturan</Td>
          <Td>Margin maksimum membantu generalisasi</Td>
        </tr>
        <tr>
          <Td strong>Keterbatasan</Td>
          <Td>Sensitif outlier, mahal saat testing</Td>
          <Td>Rawan overfitting, perlu pruning</Td>
          <Td>Perlu pemilihan kernel & QP</Td>
        </tr>
        <tr>
          <Td strong>Normalisasi</Td>
          <Td tone={C.teal}>Sering perlu — jarak peka skala</Td>
          <Td>Biasanya tidak perlu</Td>
          <Td>Sering dianjurkan; penting untuk RBF</Td>
        </tr>
      </tbody>
    </table>
    <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 18 }}>
      <Note rotate={-1.5} size={31}>
        tiga sudut pandang berbeda untuk masalah yang sama: “data ini kelas apa?”
      </Note>
    </div>
  </Sheet>
);
Rekap.transition = transition;

/* ═══ 42 · TUGAS & PENUTUP ═══════════════════════════════════════════════ */

const Tugas: Page = () => (
  <Sheet chapter="Penutup" tone={C.red}>
    <Head
      kicker="Tugas"
      tone={C.red}
      title={<>Latihan Sebelum Bertemu Minggu Depan</>}
      lead="Tiga soal kecil yang memakai konsep dari tiap metode."
    />
    <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 36 }}>
      <Card tone={C.teal} pad={24}>
        <Tag tone={C.teal}>kNN</Tag>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 14, lineHeight: 1.5 }}>
          Data latih: A(1,2)+, B(3,1)−, C(0,4)−, D(4,4)+. Prediksi titik (1,1) dengan k=1 dan k=3 — apakah hasilnya sama?
        </div>
        <div style={{ fontSize: 19, color: C.soft, fontWeight: 500, marginTop: 12 }}>
          Latih: hitung jarak, urutkan, voting.
        </div>
      </Card>
      <Card tone={C.red} pad={24}>
        <Tag tone={C.red}>Decision Tree</Tag>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 14, lineHeight: 1.5 }}>
          Tambahkan satu sampel noise ke dataset main tenis. Amati: di node mana pohon harus tumbuh, dan bagaimana pengaruhnya ke data uji.
        </div>
        <div style={{ fontSize: 19, color: C.soft, fontWeight: 500, marginTop: 12 }}>
          Latih: pahami hubungan noise ↔ overfitting.
        </div>
      </Card>
      <Card tone={C.yellow} pad={24}>
        <Tag tone={C.yellow}>SVM</Tag>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 14, lineHeight: 1.5 }}>
          Ekstensi: coba SVC(kernel='poly', degree=2) pada dataset lingkaran. Bandingkan dengan demonstrasi fitur kuadrat manual + SVC linear.
        </div>
        <div style={{ fontSize: 19, color: C.soft, fontWeight: 500, marginTop: 12 }}>
          Latih: kernel trick & pemetaan fitur.
        </div>
      </Card>
    </div>

    <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ ...display, fontSize: 76 }}>Terima kasih</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.soft, marginTop: 12 }}>
          Rangkuman Week 6 — kNN, Decision Tree, SVM · 21 seksi sumber.
        </div>
      </div>
      <div style={{ background: C.red, color: C.card, border: `4px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, padding: '18px 30px', textAlign: 'center', transform: 'rotate(-4deg)' }}>
        <div style={{ ...display, fontSize: 42 }}>Week 06</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.28em', marginTop: 6 }}>SELESAI</div>
      </div>
    </div>
  </Sheet>
);
Tugas.transition = transition;
/* ═══ SPEAKER NOTES ═══════════════════════════════════════════════════════ */

export const notes: (string | undefined)[] = [
  `Selamat datang di rangkuman Week 6: kNN, Decision Tree, dan SVM.
Buka dengan pertanyaan pemantik: kalau data sudah punya label, bagaimana cara memprediksi label data baru? Ketiganya menjawab dengan cara berbeda — kemiripan, aturan, dan margin.
  Sebutkan bahwa deck ini merangkum inti 21 seksi transkrip: 7 seksi kNN, 8 seksi Decision Tree, dan 6 seksi SVM.`,
  `Perkenalkan agenda: tiga topik, masing-masing punya babnya sendiri.
Tekankan alur belajarnya: lazy (kNN) → eager (DT) → margin (SVM).
Sarankan audiens mengikuti berurutan, karena konsep jarak di kNN akan muncul lagi di SVM.`,
  `Jelaskan pipeline supervised learning: training dijalankan batch, testing berjalan real-time.
Pertanyaan kunci minggu ini: kapan komputasi besar dilakukan?
kNN menunda sampai data uji datang; DT dan SVM membangun model di awal. Ini akan dibahas detail di halaman berikutnya.`,
  `kNN = lazy learning: batch berhenti di ekstraksi fitur, prediksi menghitung kemiripan ke seluruh data latih.
DT & SVM = eager: model dibangun dari data latih, prediksi cepat.
Biaya komputasinya tidak setara; kNN menunda pencarian ke waktu prediksi, sehingga biaya bertambah per data uji.`,
  `Baca gambar bersama-sama: lingkaran merah di kanan atas, segitiga teal di kiri bawah, kotak data uji dekat kelas merah.
Tanpa perhitungan rumit, intuisi sudah menang. Tekankan konsep feature vector (X1, X2) dan bahwa kNN tidak butuh asumsi distribusi data.`,
  `Tiga langkah inti: hitung jarak, urutkan dan ambil k, lalu voting mayoritas.
Ceritakan dari transkrip: pada diagram, 1 tetangga terdekat memberi kelas teal, sedangkan 5 tetangga memberi mayoritas merah.
Jelaskan Voronoi: ruang dibagi area non-overlap, batasnya berupa garis yang berjarak sama — hasilnya boundary non-linear.`,
  `Tuliskan notasi formal: data latih (Xi, Yi), data uji X, jarak D(X, Xi).
Tegaskan dua hyperparameter: ukuran kemiripan dan nilai k.
Ingatkan: target function kNN sebenarnya adalah classification boundary-nya sendiri — tidak ada model eksplisit yang disimpan.`,
  `Rumus Euclidean dan dua sifatnya: simetris (dibolak-balik sama) dan sensitif perbedaan ekstrem.
Contohkan dari transkrip: selisih usia 5 tahun vs selisih gaji 500 ribu — gaji yang mendominasi, padahal belum tentu itu yang menentukan.
Kerjakan contoh P1–P4 pelan-pelan: P1–P2 = 2√2 ≈ 2,83; P4–P3 = 2.`,
  `Hamming untuk fitur kategorikal: hitung jumlah fitur yang nilainya berbeda.
Manhattan = jumlah selisih absolut; Chebyshev = selisih terbesar; Minkowski = bentuk umum (p = 1 Manhattan, p = 2 Euclidean, p → ∞ Chebyshev).
Mahalanobis memperhitungkan kovarians antar fitur: contoh transkrip dua titik berjarak 14,7 dengan ukuran biasa, hanya 6 secara Mahalanobis.`,
  `Data survei kertas tisu: L1–L4, data uji U = (3,7).
Minta audiens menghitung dulu sebelum menekan panah. Tunjukkan hasil: L1 = 4, L2 = 5, L3 = 3,61, L4 = 3,61.
Ingatkan: urutan jarak saja belum menentukan kelas — voting yang menentukan.`,
  `Urutkan jarak: L3, L4, L1, L2.
k = 1 → prediksi T (hanya L3). k = 3 → 2 suara T (L3, L4) vs 1 suara R (L1) → tetap T.
Pada data ini, k=2 memilih T tanpa seri; k=4 seri (2–2). Transkrip menunda keduanya untuk membahas isu voting berikutnya.`,
  `Untuk klasifikasi biner, k ganjil mencegah seri dalam voting sederhana.
Tunjukkan ilustrasi 3 lawan 2 vs 2 lawan 2. Kalau tetap seri: undi, turun ke 1-NN, atau pakai prior knowledge kelas yang lebih dominan.`,
  `Satu nilai kosong (null) membuat jarak kemiripan tidak bisa dihitung.
Solusi paling sederhana: imputasi dengan rata-rata atributnya — contoh 37,63.
Ingatkan bahwa ini masalah umum di machine learning, bukan hanya kNN; median atau model imputasi lain juga boleh.`,
  `Fitur dengan rentang besar menelan fitur kecil — normalisasi menyamakan skalanya.
Dua rumus: zero mean unit variance dan min-max (memaksa rentang 0–1). Tekankan ini normalisasi versi machine learning, beda dengan normalisasi basis data.
Contoh usia vs gaji menunjukkan fitur gaji mendominasi total jarak — bisa berujung salah prediksi.`,
  `Trade-off nilai k: kecil → boundary tidak stabil dan sensitif outlier; besar → prediksi condong ke kelas dominan.
Prosedurnya: uji k = 1, 3, 5, … pada validation set, catat kinerjanya, berhenti saat pola mulai turun.
Ingatkan bahwa uji coba adalah bagian dari pekerjaan, bukan tanda tidak paham.`,
  `Biaya kNN ada di testing: O(N · D) untuk setiap data uji — N sampel latih, D fitur.
Jalan pintas: kurangi kolom (dimensionality reduction / pemilihan fitur), kurangi baris (subset sampel), atau pakai KD-tree (≈ log₂ N rata-rata, dapat memburuk pada dimensi tinggi), inverted list (teks), dan locality-sensitive hashing (fingerprinting).
Sebutkan risikonya: KD-tree bisa melewatkan tetangga yang sebenarnya paling mirip.`,
  `Bentuk pohon: root, internal node, branch, leaf. Pada gambar, depth = 1 dari root ke internal node terjauh.
Contohkan cabang bisa biner atau multi-nilai; untuk data kontinu berupa rentang.
Tekankan notasi boleh luwes (nilai cabang boleh ditulis langsung di garis) — yang penting konsisten.`,
  `Dari satu dataset yang sama, dua pohon sama-sama benar — tapi Pohon A (root X2) depth 1, Pohon B (root X1) depth 2.
Pohon A lebih efektif karena tidak perlu banyak splitting lanjutan.
Inilah motivasi algoritma: cari atribut split paling optimal di tiap langkah.`,
  `Dataset klasik: 14 hari, 9 yes dan 5 no. Kolom "Hari" hanya nomor urut — bukan fitur.
Data uji baru: outlook rain, humidity high, wind weak. Tahan jawabannya sampai pohon terbentuk.`,
  `Cabang overcast langsung pure (4 yes, 0 no) → berhenti.
Sunny (3 no, 2 yes) dipecah dengan humidity; rain (3 yes, 2 no) dipecah dengan wind.
Aturan berhenti: subset sudah pure, atau atributnya sudah habis dipakai.`,
  `Ikuti jalur data uji: outlook rain → cabang kanan → wind weak → Yes.
Tegaskan humidity-nya high tapi tidak pernah dicek di cabang ini — pohon hanya menguji fitur yang relevan di tiap cabang.`,
  `Entropy mengukur derajat ketidakpastian. Skalanya: 0 (pasti) sampai 1 (paling tidak pasti).
Hitung bersama: 3 yes / 3 no → 1; 4 yes / 0 no → 0.
Simpan nilai 0,94 untuk 9 yes / 5 no — dipakai di halaman berikutnya.`,
  `Information gain = penurunan entropy setelah split.
Hitung: IG(wind) = 0,048; IG(humidity) = 0,152; IG(outlook) = 0,247 → outlook jadi root.
Alasan kualitatifnya: cabang overcast langsung pure, jadi outlook paling informatif.`,
  `Ulangi perhitungan yang sama di tiap cabang: sunny → humidity (0,971) vs wind (0,020); rain → wind (0,971) vs humidity (0,020).
Fitur yang sudah dipakai di atas tidak dipertimbangkan lagi di cabang bawahnya.
Hasilnya persis pohon yang dipakai untuk prediksi di halaman sebelumnya.`,
  `Pohon diubah menjadi set of rules: satu aturan untuk tiap daun, dibaca dari root menyusuri cabang.
Conjunction (AND) untuk syarat berlapis; disjunction (OR) kalau dua cabang menghasilkan daun yang sama.
Baca bersama 5 aturan pohon tenis; aturan ke-3 hanya satu syarat karena jalurnya pendek.`,
  `Contoh noise dari transkrip: sampel (sunny, normal, strong) → No, padahal pohon memprediksi Yes.
Pohon dipaksa tumbuh lebih dalam hanya untuk satu titik itu — dan data uji normal lain ikut salah.
Kurva: akurasi training terus naik, akurasi testing naik lalu turun; puncaknya di sekitar 10–20 node (≈ 0,75).`,
  `Dua strategi: early stopping (hentikan growing seawal mungkin) dan pruning (biarkan tumbuh, lalu pangkas cabang yang hanya cocok untuk noise).
Kuncinya validation set — bukan training, bukan testing.
Aturannya: kalau akurasi validasi menurun, di internal node itu kita stop.`,
  `ID3 cenderung memilih fitur dengan banyak kemungkinan nilai karena gain-nya tinggi semu.
C4.5 memakai gain ratio = gain / split info, di mana split info menghukum fitur yang memecah data jadi banyak bagian.
Tekankan: alur pohon dan masalah overfitting-nya sama — hanya kriteria split yang berubah.`,
  `Untuk atribut kontinu: urutkan nilai, ambil distinct value, bentuk kandidat interval (≤65 / >65, ≤70 / >70, …), lalu evaluasi gain tiap batas.
Contoh humidity: 65, 70, 75, 78, 80, dan seterusnya.
Berbeda dari kNN yang memakai nilai kontinu langsung saat menghitung jarak; di pohon keputusan, nilai diuji lewat batas split.`,
  `Sebagian besar algoritma butuh representasi numerik.
Citra 28×28 → vektor 784 nilai intensitas; teks/dokumen → frekuensi kemunculan kata; fitur kategorikal biner → 0/1.
Untuk fitur numerik real, cukup dipakai sebagai bilangan real tanpa transformasi khusus.`,
  `Masalah: memetakan sunny=0, overcast=1, rain=2 menyiratkan jarak dan urutan yang tidak nyata — sama seperti contoh warna red=0, blue=1, green=2.
Solusi: one-hot encoding — setiap nilai jadi fitur biner baru (1 kalau muncul, 0 kalau tidak).
Tekankan ini teknik umum di supervised learning, tidak hanya decision tree.`,
  `Pengklasifikasi linear: f(x) = sign(w·x + b). Nilai positif → kelas +1; negatif → kelas −1; nol tepat di hyperplane.
Banyak garis sama-sama benar untuk data latih — kita menginginkan margin maksimum agar model berpeluang menggeneralisasi lebih baik.
Warna diagram: teal = +1, merah = −1.`,
  `Support vector berada di plus/minus plane. Lebar pita antara dua plane adalah 2/‖w‖, atau dua kali jarak hyperplane ke support vector.
Margin lebar = ruang aman lebih besar = kemungkinan misclassified mengecil.
Titik jauh dari margin biasanya tidak mengubah hyperplane.`,
  `Tiga garis: plus plane (w·x + b = +1), hyperplane (w·x + b = 0), minus plane (w·x + b = −1).
Aturan klasifikasi: ≥ +1 → kelas +1; ≤ −1 → kelas −1; nilai di antara keduanya ada di bagian dalam area margin.
Fakta geometris: W tegak lurus bidang, karena W·(U − V) = 0 untuk dua titik di plane yang sama.`,
  `Ikuti derivasi pelan-pelan: x⁺ = x⁻ + λW, substitusi ke plus plane, pakai w·x⁻ + b = −1 → λ = 2/(w·w).
Maka margin M = λ‖W‖ = 2/√(w·w). Maksimalkan margin ≡ minimalkan ½‖w‖² dengan kendala yi(w·xi + b) ≥ 1.
Solusinya lewat quadratic programming — cukup dipahami bentuk objektifnya.`,
  `Empat titik data, tiga di antaranya support vector; kendala ketiganya aktif sehingga tanda ≥ menjadi =.
Jumlahkan kendala aktif: (1)+(2) → w₂ = 1; (1)+(3) → w₁ = 1; (2)+(3) → b = −1.
Hyperplane final: x₁ + x₂ − 1 = 0, atau x₂ = 1 − x₁.`,
  `Substitusi ke g(x)=w·x+b: g(1,5)=1+5−1=5, maka sign(g)=+1; g(2,−2)=2−2−1=−1, maka sign(g)=−1.
Prediksi SVM = tanda fungsi, bukan jarak.
Hasilnya konsisten dengan posisi titik di gambar.`,
  `Data 1D yang tidak bisa dipisah satu titik dipetakan ke ruang 2D (x, x²) → bisa dipisah garis horizontal.
Kernel trick: pemetaan ke dimensi lebih tinggi lewat fungsi kernel, tanpa transformasi eksplisit.
Sebutkan jenis kernel: polinomial, RBF, sigmoid — dan pembagian linear vs non-linear.`,
  `Untuk kernel homogen degree 2, φ(x)=[x1², √2 x1x2, x2²]; suku silang mendapat √2 agar φ(x)·φ(y)=(xᵀy)².
Contoh ini memakai c=0; konstanta c=1 menambah fitur orde lebih rendah yang tidak ditampilkan.
Dari 2 fitur jadi 3; di ruang baru data menjadi linearly separable.`,
  `Dataset sintetis dua kelas pada radius 10 dan 5: 400 titik. Split 75/25 → 300 latih, 100 uji.
Kernel linear ≈ 45–50% — garis terbaik pun hanya menebak setengah.
Setelah menambah fitur kuadrat secara manual, bentuk ulang X dan latih ulang SVC linear; skor uji yang ditunjukkan 100%. Ini terkait dengan ide kernel, tetapi bukan kernel trick yang dieksekusi otomatis oleh library.`,
  `Bandingkan ketiga metode dalam satu tabel: kategori, kunci keputusan, hyperparameter, kelebihan, keterbatasan, kebutuhan normalisasi.
Tegaskan: tiga sudut pandang berbeda untuk masalah yang sama — "data ini kelas apa?"`,
  `Sampaikan tiga latihan: kNN (A(1,2)+, B(3,1)−, C(0,4)−, D(4,4)+; uji (1,1): k=1 memberi +, k=3 memberi −), Decision Tree (tambah satu noise, amati pertumbuhan pohon), SVM (sebagai ekstensi, bandingkan SVC kernel polinomial dengan fitur kuadrat manual + SVC linear).
Tutup dengan mengajak mencoba dan ucapkan terima kasih.`,
];

export const meta: SlideMeta = {
  title: 'Rangkuman Week 6 — kNN, Decision Tree & SVM',
  createdAt: '2026-09-27T17:32:54.332Z',
};

export default [
  Cover,
  Peta,
  Fondasi,
  LazyVsEager,
  KnnIntuisi,
  KnnCaraKerja,
  KnnAlgoritma,
  KnnJarak1,
  KnnJarak2,
  KnnTisu1,
  KnnTisu2,
  KnnIsuK,
  KnnMissing,
  KnnNormalisasi,
  KnnKOptimal,
  KnnEfisiensi,
  DtAnatomi,
  DtDuaPohon,
  DtTenis,
  DtSplit,
  DtFinal,
  DtEntropy,
  DtGain,
  DtRekursi,
  DtRules,
  DtOverfit,
  DtPruning,
  DtC45,
  DtKontinu,
  DtRepresentasi,
  DtOneHot,
  SvmIntuisi,
  SvmMargin,
  SvmFormulasi,
  SvmDerivasi,
  SvmContoh,
  SvmPrediksi,
  SvmKernel,
  SvmPolinomial,
  SvmPython,
  Rekap,
  Tugas,
] satisfies Page[];
