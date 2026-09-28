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
  palette: {
    bg: '#f7f5ef',
    text: '#1b1b26',
    accent: '#3b38c8',
  },
  fonts: {
    display: "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif",
    body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  typeScale: { hero: 150, body: 34 },
  radius: 14,
};

const mono = "'SF Mono', ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace";

const C = {
  soft: '#3f3f4c',
  muted: '#6d6d7b',
  dim: '#9c9ca9',
  rule: '#d9d5c8',
  panel: '#f0ede3',
  edge: '#e2ddcd',
  knn: '#2f5fc4',
  knnSoft: 'rgba(47, 95, 196, 0.10)',
  dt: '#1f7a4d',
  dtSoft: 'rgba(31, 122, 77, 0.11)',
  svm: '#7b3fc4',
  svmSoft: 'rgba(123, 63, 196, 0.10)',
  red: '#c0392b',
  redSoft: 'rgba(192, 57, 43, 0.10)',
  ink: '#1b1b26',
  paper: '#f7f5ef',
};

const css = `
  .w6-anim { animation-fill-mode: both; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  [data-still] .w6-anim { animation: none !important; }
  @media (prefers-reduced-motion: reduce) { .w6-anim { animation: none !important; } }
  @keyframes w6-rise { from { opacity: 0; transform: translateY(18px); } }
  @keyframes w6-fade { from { opacity: 0; } }
  @keyframes w6-draw { from { stroke-dashoffset: 1; } }
  .w6-rise { animation-name: w6-rise; animation-duration: 0.7s; }
  .w6-fade { animation-name: w6-fade; animation-duration: 0.65s; }
  .w6-draw { animation-name: w6-draw; animation-duration: 1s; animation-timing-function: cubic-bezier(0.45, 0, 0.25, 1); }
`;

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

const pad2 = (n: number) => String(n).padStart(2, '0');

const Styles = () => <style>{css}</style>;

const DotPaper = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(rgba(27, 27, 38, 0.08) 1.1px, transparent 1.1px)',
      backgroundSize: '34px 34px',
      backgroundPosition: '17px 17px',
      pointerEvents: 'none',
    }}
  />
);

const PageFooter = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      className="w6-anim w6-fade"
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 52,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontFamily: mono,
        fontSize: 18,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.dim,
        animationDelay: '0.3s',
      }}
    >
      <span>Pembelajaran Mesin · Week 6</span>
      <span style={{ color: C.muted }}>
        {pad2(current)} / {pad2(total)}
      </span>
    </div>
  );
};

const Frame = ({
  eyebrow,
  tone = C.muted,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  tone?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      <DotPaper />
      <div
        className="w6-anim w6-fade"
        style={{
          position: 'absolute',
          left: 120,
          top: 78,
          fontFamily: mono,
          fontSize: 21,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: tone,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="w6-anim w6-rise"
        style={{
          position: 'absolute',
          left: 120,
          top: 112,
          margin: 0,
          maxWidth: 1680,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.06,
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          className="w6-anim w6-rise"
          style={{
            position: 'absolute',
            left: 120,
            top: 206,
            margin: 0,
            width: 1620,
            fontSize: 28,
            lineHeight: 1.5,
            color: C.soft,
            animationDelay: '0.07s',
          }}
        >
          {lead}
        </p>
      )}
      <div style={{ position: 'absolute', left: 120, right: 120, top: 330, bottom: 126 }}>
        {children}
      </div>
      <PageFooter />
    </div>
  );
};

const Chip = ({ color, label }: { color: string; label: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      height: 56,
      padding: '0 26px',
      borderRadius: 28,
      border: `1.5px solid ${C.edge}`,
      background: 'rgba(255, 255, 255, 0.55)',
      fontFamily: mono,
      fontSize: 22,
      color: C.soft,
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ width: 12, height: 12, borderRadius: 6, background: color }} />
    {label}
  </div>
);

const Bullet = ({ tone, children }: { tone: string; children: ReactNode }) => (
  <li style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
    <span style={{ fontFamily: mono, color: tone }}>—</span>
    <span>{children}</span>
  </li>
);

// ─── Cover ──────────────────────────────────────────────────────────────────

const Cover: Page = () => {
  const active = useIsActivePage();
  return (
    <div style={fill} data-still={active ? undefined : ''}>
      <Styles />
      <DotPaper />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 96,
          bottom: 96,
          width: 2,
          background: C.rule,
        }}
      />
      <div
        className="w6-anim w6-fade"
        style={{
          position: 'absolute',
          left: 168,
          top: 204,
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--osd-accent)',
        }}
      >
        Pembelajaran Mesin · Week 6
      </div>
      <h1
        className="w6-anim w6-rise"
        style={{
          position: 'absolute',
          left: 162,
          top: 258,
          margin: 0,
          fontFamily: 'var(--osd-font-display)',
          fontSize: 'var(--osd-size-hero)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.04,
          animationDelay: '0.06s',
        }}
      >
        kNN, Decision Tree
        <br />
        &amp; SVM
      </h1>
      <p
        className="w6-anim w6-rise"
        style={{
          position: 'absolute',
          left: 168,
          top: 616,
          margin: 0,
          width: 1380,
          fontSize: 30,
          lineHeight: 1.5,
          color: C.soft,
          animationDelay: '0.14s',
        }}
      >
        Tiga pendekatan supervised learning untuk klasifikasi: kemiripan tetangga, aturan pohon,
        dan margin maksimum.
      </p>
      <div
        className="w6-anim w6-rise"
        style={{ position: 'absolute', left: 168, top: 764, display: 'flex', gap: 20, animationDelay: '0.22s' }}
      >
        <Chip color={C.knn} label="01 · k-Nearest Neighbor" />
        <Chip color={C.dt} label="02 · Decision Tree" />
        <Chip color={C.svm} label="03 · Support Vector Machine" />
      </div>
      <PageFooter />
    </div>
  );
};

Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 280,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// ─── 2 · Lazy vs eager ──────────────────────────────────────────────────────

const FlowCard = ({
  tone,
  name,
  tag,
  children,
}: {
  tone: string;
  name: string;
  tag: string;
  children: ReactNode;
}) => (
  <div
    className="w6-anim w6-rise"
    style={{
      width: 818,
      height: 372,
      boxSizing: 'border-box',
      padding: '36px 40px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${C.edge}`,
      background: C.panel,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: tone }} />
      <span
        style={{
          fontFamily: 'var(--osd-font-display)',
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {name}
      </span>
      <span
        style={{
          marginLeft: 'auto',
          fontFamily: mono,
          fontSize: 20,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: tone,
        }}
      >
        {tag}
      </span>
    </div>
    <div style={{ height: 1, background: C.edge, margin: '24px 0 28px' }} />
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontSize: 27,
        lineHeight: 1.4,
        color: C.soft,
      }}
    >
      {children}
    </ul>
  </div>
);

const Foundations: Page = () => (
  <Frame
    eyebrow="§ Fondasi · Lazy vs Eager Learning"
    title="Dua ritme pembelajaran"
    lead="Kapan model dibangun menentukan di mana komputasi berat terjadi: saat pelatihan, atau saat prediksi."
  >
    <div style={{ display: 'flex', gap: 44 }}>
      <FlowCard tone={C.knn} name="Lazy learning" tag="kNN">
        <Bullet tone={C.knn}>Model tidak dilatih lebih dulu</Bullet>
        <Bullet tone={C.knn}>Batch berhenti setelah ekstraksi fitur</Bullet>
        <Bullet tone={C.knn}>Prediksi: hitung kemiripan ke semua data latih</Bullet>
      </FlowCard>
      <FlowCard tone={C.svm} name="Eager learning" tag="Tree · SVM">
        <Bullet tone={C.svm}>Model dibangun dari data latih</Bullet>
        <Bullet tone={C.svm}>Pelatihan penuh berjalan di batch learning</Bullet>
        <Bullet tone={C.svm}>Prediksi: langsung memakai model yang sudah jadi</Bullet>
      </FlowCard>
    </div>
    <div
      style={{
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '22px 32px',
        border: `1px solid ${C.edge}`,
        borderRadius: 'var(--osd-radius)',
        background: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 26, color: 'var(--osd-accent)' }}>→</span>
      <span style={{ fontSize: 26, color: C.soft }}>
        Intinya: lazy menunda kerja sampai ada pertanyaan; eager membayar di awal agar jawaban
        datang cepat.
      </span>
    </div>
  </Frame>
);

// ─── 3 · kNN cara kerja ─────────────────────────────────────────────────────

const StepRow = ({
  n,
  tone,
  title,
  children,
}: {
  n: string;
  tone: string;
  title: string;
  children?: ReactNode;
}) => (
  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
    <div
      style={{
        width: 52,
        height: 52,
        flexShrink: 0,
        borderRadius: 12,
        border: `2px solid ${tone}`,
        color: tone,
        fontFamily: mono,
        fontSize: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      {n}
    </div>
    <div style={{ paddingTop: 2 }}>
      <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
      {children}
    </div>
  </div>
);

const RankRow = ({
  rank,
  label,
  dist,
  cls,
  width,
  tone,
}: {
  rank: string;
  label: string;
  dist: string;
  cls: string;
  width: string;
  tone: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <span style={{ width: 40, fontFamily: mono, fontSize: 20, color: C.dim }}>{rank}</span>
    <span style={{ width: 44, fontFamily: mono, fontSize: 23 }}>{label}</span>
    <span style={{ flex: 1, height: 12, borderRadius: 6, background: C.edge, overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', width, borderRadius: 6, background: tone }} />
    </span>
    <span style={{ width: 74, textAlign: 'right', fontFamily: mono, fontSize: 22, color: C.soft }}>
      {dist}
    </span>
    <span
      style={{
        width: 44,
        height: 34,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: mono,
        fontSize: 20,
        background: cls === 'T' ? C.dtSoft : C.redSoft,
        color: cls === 'T' ? C.dt : C.red,
        border: `1px solid ${cls === 'T' ? 'rgba(31, 122, 77, 0.3)' : 'rgba(192, 57, 43, 0.3)'}`,
      }}
    >
      {cls}
    </span>
  </div>
);

const ResultRow = ({ text, note, tone }: { text: string; note: string; tone: string }) => (
  <div
    style={{
      marginTop: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 20px',
      borderRadius: 12,
      background: 'rgba(255, 255, 255, 0.65)',
      border: `1px solid ${C.edge}`,
    }}
  >
    <span style={{ width: 12, height: 12, borderRadius: 6, background: tone }} />
    <span style={{ fontFamily: mono, fontSize: 24 }}>{text}</span>
    <span style={{ marginLeft: 'auto', fontSize: 22, color: C.muted }}>{note}</span>
  </div>
);

const TissuePanel = () => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: '30px 34px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${C.edge}`,
      background: C.panel,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.14em', color: C.knn }}>
      CONTOH · KERTAS TISU
    </div>
    <div style={{ marginTop: 14, fontSize: 27, color: C.soft }}>
      Data uji U = (keasaman 3, kekuatan 7)
    </div>
    <Steps>
      <Step>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RankRow rank="#1" label="L3" dist="3,61" cls="T" width="72%" tone={C.dt} />
          <RankRow rank="#2" label="L4" dist="3,61" cls="T" width="72%" tone={C.dt} />
          <RankRow rank="#3" label="L1" dist="4,00" cls="R" width="80%" tone={C.red} />
          <RankRow rank="#4" label="L2" dist="5,00" cls="R" width="100%" tone={C.red} />
        </div>
      </Step>
      <Step>
        <ResultRow text="k = 1 → prediksi T" note="pakai tetangga terdekat" tone={C.dt} />
      </Step>
      <Step>
        <ResultRow text="k = 3 → prediksi T" note="T menang 2 suara dari 3" tone={C.dt} />
      </Step>
    </Steps>
  </div>
);

const KnnHow: Page = () => (
  <Frame
    eyebrow="§ 01 · k-Nearest Neighbor · Cara Kerja"
    tone={C.knn}
    title="Prediksi = meminjam label tetangga"
    lead="kNN tidak membangun model — prediksi dihitung saat data uji datang, dalam tiga langkah."
  >
    <div style={{ display: 'flex', gap: 64 }}>
      <div style={{ width: 920, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Steps>
          <Step>
            <StepRow n="1" tone={C.knn} title="Hitung jarak ke setiap sampel latih">
              <div
                style={{
                  marginTop: 16,
                  display: 'inline-block',
                  fontFamily: mono,
                  fontSize: 24,
                  padding: '14px 20px',
                  borderRadius: 10,
                  background: C.knnSoft,
                  border: '1px solid rgba(47, 95, 196, 0.25)',
                  color: C.soft,
                }}
              >
                d(x, x<sub>i</sub>) = √( Σ<sub>j</sub> (x<sub>j</sub> − x<sub>ij</sub>)² )
              </div>
            </StepRow>
          </Step>
          <Step>
            <StepRow n="2" tone={C.knn} title="Urutkan, lalu ambil k tetangga terdekat" />
          </Step>
          <Step>
            <StepRow n="3" tone={C.knn} title="Majority vote → kelas terbanyak jadi prediksi" />
          </Step>
        </Steps>
        <p style={{ margin: 0, fontSize: 23, color: C.muted }}>
          Jarak paling kecil = paling mirip. Kelas tidak ditentukan jarak total, tapi suara
          mayoritas k tetangga.
        </p>
      </div>
      <div style={{ flex: 1 }}>
        <TissuePanel />
      </div>
    </div>
  </Frame>
);

// ─── 4 · kNN isu ────────────────────────────────────────────────────────────

const IsuCell = ({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) => (
  <div
    style={{
      boxSizing: 'border-box',
      padding: '24px 30px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${C.edge}`,
      background: C.panel,
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.14em', color: C.knn }}>{n}</div>
    <div style={{ marginTop: 8, fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }}>
      {title}
    </div>
    <div style={{ marginTop: 10, fontSize: 24 , lineHeight: 1.42, color: C.soft }}>{children}</div>
  </div>
);

const KnnIssues: Page = () => (
  <Frame
    eyebrow="§ 01 · k-Nearest Neighbor · Isu"
    tone={C.knn}
    title="Lima hal yang perlu diwaspadai"
    lead="kNN sederhana, tetapi keputusan kecil di sekitar data bisa mengubah hasil prediksinya."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridAutoRows: '176px',
        gap: 36,
      }}
    >
      <IsuCell n="01" title="Sensitif outlier">
        Satu sampel salah label dapat mengubah batas keputusan secara frontal.
      </IsuCell>
      <IsuCell n="02" title="Tanpa tingkat keyakinan">
        Menang 3 dari 5 atau 5 dari 5 sama-sama hanya “mayoritas suara”.
      </IsuCell>
      <IsuCell n="03" title="Pemilihan k">
        Gunakan k ganjil agar tidak seri; uji beberapa nilai pada validation set.
      </IsuCell>
      <IsuCell n="04" title="Skala fitur">
        Rentang fitur yang jauh berbeda membuat jarak bias → normalisasi (min-max / zero-mean).
      </IsuCell>
      <IsuCell n="05" title="Biaya komputasi">
        Prediksi mengecek semua sampel: O(N·D) → dimensionality reduction, KD-tree, LSH.
      </IsuCell>
      <div
        style={{
          boxSizing: 'border-box',
          padding: '24px 30px',
          borderRadius: 'var(--osd-radius)',
          border: '1px solid rgba(47, 95, 196, 0.28)',
          background: C.knnSoft,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.14em', color: C.knn }}>
          INTUISI TUNING
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Besar k menggeser batas
        </div>
        <div style={{ marginTop: 10, fontSize: 24, lineHeight: 1.42, color: C.soft }}>
          k besar → mengikuti kelas dominan; k kecil → batas keputusan liar.
        </div>
      </div>
    </div>
  </Frame>
);

// ─── 5 · Decision Tree struktur ─────────────────────────────────────────────

const TreeFigure = () => (
  <svg viewBox="0 0 980 580" width={980} height={580} style={{ display: 'block' }}>
    <path
      d="M490 72 L170 252"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.15s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M490 72 L490 252"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.25s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M490 72 L810 252"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.35s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M170 252 L95 460"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.5s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M170 252 L280 460"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.58s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M810 252 L700 460"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.66s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M810 252 L885 460"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.74s' }}
      stroke={C.muted}
      strokeWidth={2}
      fill="none"
    />
    <text
      x={330}
      y={162}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      sunny
    </text>
    <text
      x={490}
      y={172}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      overcast
    </text>
    <text
      x={650}
      y={162}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      rain
    </text>
    <text
      x={132}
      y={352}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      high
    </text>
    <text
      x={225}
      y={352}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      normal
    </text>
    <text
      x={755}
      y={352}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      strong
    </text>
    <text
      x={847}
      y={352}
      textAnchor="middle"
      style={{
        fontFamily: mono,
        fontSize: 20,
        fill: C.muted,
        paintOrder: 'stroke',
        stroke: 'rgba(247, 245, 239, 0.95)',
        strokeWidth: 8,
        strokeLinejoin: 'round',
      }}
    >
      weak
    </text>
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.55s' }}>
      <ellipse cx={490} cy={72} rx={108} ry={44} fill={C.panel} stroke={C.muted} strokeWidth={2} />
      <text
        x={490}
        y={72}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: 'var(--osd-font-display)', fontSize: 27, fill: 'var(--osd-text)' }}
      >
        Outlook
      </text>
    </g>
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.7s' }}>
      <ellipse cx={170} cy={252} rx={108} ry={44} fill={C.panel} stroke={C.muted} strokeWidth={2} />
      <text
        x={170}
        y={252}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: 'var(--osd-font-display)', fontSize: 27, fill: 'var(--osd-text)' }}
      >
        Humidity
      </text>
      <ellipse cx={810} cy={252} rx={108} ry={44} fill={C.panel} stroke={C.muted} strokeWidth={2} />
      <text
        x={810}
        y={252}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: 'var(--osd-font-display)', fontSize: 27, fill: 'var(--osd-text)' }}
      >
        Wind
      </text>
      <rect x={415} y={220} width={150} height={64} rx={16} fill={C.dtSoft} stroke={C.dt} strokeWidth={2} />
      <text
        x={490}
        y={252}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 26, fill: C.dt }}
      >
        Yes
      </text>
    </g>
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.85s' }}>
      <rect x={20} y={428} width={150} height={64} rx={16} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text
        x={95}
        y={460}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 26, fill: C.red }}
      >
        No
      </text>
      <rect x={205} y={428} width={150} height={64} rx={16} fill={C.dtSoft} stroke={C.dt} strokeWidth={2} />
      <text
        x={280}
        y={460}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 26, fill: C.dt }}
      >
        Yes
      </text>
      <rect x={625} y={428} width={150} height={64} rx={16} fill={C.redSoft} stroke={C.red} strokeWidth={2} />
      <text
        x={700}
        y={460}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 26, fill: C.red }}
      >
        No
      </text>
      <rect x={810} y={428} width={150} height={64} rx={16} fill={C.dtSoft} stroke={C.dt} strokeWidth={2} />
      <text
        x={885}
        y={460}
        dy={9}
        textAnchor="middle"
        style={{ fontFamily: mono, fontSize: 26, fill: C.dt }}
      >
        Yes
      </text>
    </g>
  </svg>
);

const LegendRow = ({
  kind,
  children,
}: {
  kind: 'ellipse' | 'edge' | 'node';
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
    <svg width={56} height={30} viewBox="0 0 56 30" style={{ flexShrink: 0 }}>
      {kind === 'ellipse' && (
        <ellipse cx={28} cy={15} rx={22} ry={12} fill={C.panel} stroke={C.muted} strokeWidth={2} />
      )}
      {kind === 'edge' && (
        <path d="M4 26 L52 4" stroke={C.muted} strokeWidth={2} strokeDasharray="4 4" fill="none" />
      )}
      {kind === 'node' && (
        <rect x={8} y={3} width={40} height={24} rx={9} fill={C.dtSoft} stroke={C.dt} strokeWidth={2} />
      )}
    </svg>
    <div style={{ fontSize: 26, lineHeight: 1.35, color: C.soft }}>{children}</div>
  </div>
);

const TreeStructure: Page = () => (
  <Frame
    eyebrow="§ 02 · Decision Tree · Struktur"
    tone={C.dt}
    title="Model berbentuk pohon keputusan"
    lead="Setiap node menguji satu fitur; setiap cabang adalah kemungkinan nilainya; setiap daun adalah kelas."
  >
    <div style={{ display: 'flex', gap: 56 }}>
      <TreeFigure />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Steps>
          <Step>
            <LegendRow kind="ellipse">
              <b>Root node</b> — uji pertama, letaknya di puncak pohon.
            </LegendRow>
          </Step>
          <Step>
            <LegendRow kind="ellipse">
              <b>Internal node</b> — uji lanjutan; depth dihitung dari root ke sini.
            </LegendRow>
          </Step>
          <Step>
            <LegendRow kind="edge">
              <b>Branch</b> — kemungkinan nilai fitur (sunny, overcast, rain).
            </LegendRow>
          </Step>
          <Step>
            <LegendRow kind="node">
              <b>Leaf node</b> — kelas keputusan (Yes / No).
            </LegendRow>
          </Step>
        </Steps>
        <p style={{ margin: 0, fontSize: 23, lineHeight: 1.5, color: C.muted }}>
          Contoh ini memakai 14 sampel main tenis (9 yes, 5 no). Atribut yang dipilih lebih dulu
          membuat pohon lebih dangkal — dan lebih efisien.
        </p>
      </div>
    </div>
  </Frame>
);

// ─── 6 · DT ID3 ─────────────────────────────────────────────────────────────

const FormulaCard = ({
  title,
  formula,
  note,
}: {
  title: string;
  formula: ReactNode;
  note: string;
}) => (
  <div
    className="w6-anim w6-rise"
    style={{
      boxSizing: 'border-box',
      padding: '30px 36px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${C.edge}`,
      background: C.panel,
    }}
  >
    <div style={{ fontSize: 27, fontWeight: 600, color: C.soft }}>{title}</div>
    <div style={{ marginTop: 18, fontFamily: mono, fontSize: 30 }}>{formula}</div>
    <div style={{ marginTop: 16, fontSize: 23, lineHeight: 1.5, color: C.muted }}>{note}</div>
  </div>
);

const GainRow = ({
  label,
  value,
  pct,
  highlight = false,
}: {
  label: string;
  value: string;
  pct: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '12px 16px',
      borderRadius: 10,
      background: highlight ? C.dtSoft : 'transparent',
    }}
  >
    <span style={{ width: 140, fontFamily: mono, fontSize: 23, color: C.soft }}>{label}</span>
    <span style={{ flex: 1, height: 14, borderRadius: 7, background: C.edge, overflow: 'hidden' }}>
      <span
        style={{
          display: 'block',
          height: '100%',
          width: pct,
          borderRadius: 7,
          background: highlight ? C.dt : C.muted,
        }}
      />
    </span>
    <span
      style={{
        width: 96,
        textAlign: 'right',
        fontFamily: mono,
        fontSize: 26,
        color: highlight ? C.dt : 'var(--osd-text)',
      }}
    >
      {value}
    </span>
  </div>
);

const TreeId3: Page = () => (
  <Frame
    eyebrow="§ 02 · Decision Tree · ID3"
    tone={C.dt}
    title="Memilih split: entropy & information gain"
    lead="Atribut terbaik adalah yang paling banyak menurunkan ketidakpastian data."
  >
    <div style={{ display: 'flex', gap: 64 }}>
      <div style={{ width: 880, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <FormulaCard
          title="Entropy — derajat ketidakpastian"
          formula={
            <>
              H(S) = − Σ<sub>i</sub> p<sub>i</sub> · log₂ p<sub>i</sub>
            </>
          }
          note="0 = pure (semua satu kelas) · 1 = paling tidak pasti (50 : 50)."
        />
        <FormulaCard
          title="Information gain — penurunan ketidakpastian"
          formula={
            <>
              IG(S, A) = H(S) − Σ<sub>v</sub> ( |S<sub>v</sub>| / |S| ) · H(S<sub>v</sub>)
            </>
          }
          note="Rata-rata entropy tiap subset hasil split, dibobot ukuran subsetnya."
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Steps>
          <Step>
            <div
              style={{
                boxSizing: 'border-box',
                padding: '26px 30px',
                borderRadius: 'var(--osd-radius)',
                border: `1px solid ${C.edge}`,
                background: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.14em', color: C.muted }}>
                DATA ROOT · 14 SAMPEL
              </div>
              <div style={{ marginTop: 10, fontSize: 26, color: C.soft }}>
                9× yes dan 5× no, maka H(S) ={" "}
                <span style={{ fontFamily: mono, fontSize: 30, color: 'var(--osd-text)' }}>0,940</span>
              </div>
            </div>
          </Step>
          <Step>
            <div
              style={{
                boxSizing: 'border-box',
                padding: '20px 30px',
                borderRadius: 'var(--osd-radius)',
                border: `1px solid ${C.edge}`,
                background: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.14em', color: C.muted }}>
                INFORMATION GAIN PER FITUR
              </div>
              <div style={{ marginTop: 12 }}>
                <GainRow label="wind" value="0,048" pct="19%" />
                <GainRow label="humidity" value="0,152" pct="62%" />
                <GainRow label="outlook" value="0,247" pct="100%" highlight />
              </div>
            </div>
          </Step>
          <Step>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 24px',
                borderRadius: 12,
                background: C.dtSoft,
                border: `1.5px solid ${C.dt}`,
                fontSize: 27,
                color: C.dt,
              }}
            >
              → Outlook dipilih sebagai root node
            </div>
          </Step>
        </Steps>
        <p style={{ margin: 0, fontSize: 23, lineHeight: 1.5, color: C.muted }}>
          Proses diulang di setiap cabang: hitung gain fitur yang tersisa, pilih yang tertinggi,
          sampai subsetnya pure atau atributnya habis.
        </p>
      </div>
    </div>
  </Frame>
);

// ─── 7 · DT aturan & varian ─────────────────────────────────────────────────

const VariantCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div
    className="w6-anim w6-rise"
    style={{
      boxSizing: 'border-box',
      padding: '30px 34px',
      borderRadius: 'var(--osd-radius)',
      border: `1px solid ${C.edge}`,
      background: C.panel,
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
    <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.45, color: C.soft }}>{children}</div>
  </div>
);

const ruleLine: CSSProperties = {
  fontFamily: mono,
  fontSize: 21,
  padding: '10px 16px',
  borderRadius: 8,
  background: 'rgba(255, 255, 255, 0.65)',
  border: `1px solid ${C.edge}`,
  color: 'var(--osd-text)',
  marginBottom: 10,
  whiteSpace: 'nowrap',
};

const TreeRules: Page = () => (
  <Frame
    eyebrow="§ 02 · Decision Tree · Aturan & Varian"
    tone={C.dt}
    title="Aturan, batas, dan varian C4.5"
    lead="Pohon yang terbentuk bisa dibaca sebagai aturan — dengan empat catatan penting."
  >
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '286px', gap: 40 }}>
      <VariantCard title="Pohon → set of rules">
        <div style={ruleLine}>IF outlook = sunny AND humidity = high → no</div>
        <div style={ruleLine}>IF outlook = overcast → yes</div>
        <div style={{ marginTop: 14, fontSize: 23, color: C.muted }}>
          Setiap jalur root → daun menjadi aturan gabungan (AND).
        </div>
      </VariantCard>
      <VariantCard title="Overfitting pada pohon">
        Satu sampel noise dapat memaksa cabang baru: pohon makin dalam, makin cocok dengan noise —
        dan makin salah di data bersih.
        <div style={{ marginTop: 14, fontSize: 23, color: C.muted }}>
          Penawar: pruning, dengan validation set untuk menilai apakah cabangnya benar-benar
          berguna.
        </div>
      </VariantCard>
      <VariantCard title="C4.5 — gain ratio">
        <div style={{ ...ruleLine, marginBottom: 14 }}>gain ratio = gain ÷ split info</div>
        Meredam bias ID3 terhadap atribut dengan banyak nilai unik.
      </VariantCard>
      <VariantCard title="Nilai kontinus & multi-nilai">
        Kontinus: urutkan nilai unik, lalu split berbasis interval.
        <div style={{ marginTop: 14 }}>
          Multi-nilai: pecah jadi fitur biner — sunny / overcast / rain.
        </div>
      </VariantCard>
    </div>
  </Frame>
);

// ─── 8 · SVM linear ─────────────────────────────────────────────────────────

const MarginFigure = () => (
  <svg viewBox="0 0 840 620" width={700} height={517} style={{ display: 'block' }}>
    <line x1={70} y1={330} x2={790} y2={330} stroke={C.rule} strokeWidth={1.5} />
    <line x1={420} y1={30} x2={420} y2={600} stroke={C.rule} strokeWidth={1.5} />
    <text x={782} y={318} textAnchor="end" style={{ fontFamily: mono, fontSize: 23, fill: C.dim }}>
      x₁
    </text>
    <text x={434} y={44} style={{ fontFamily: mono, fontSize: 23, fill: C.dim }}>
      x₂
    </text>
    <path
      d="M100 10 L700 610"
      className="w6-anim w6-fade"
      style={{ animationDelay: '0.35s' }}
      stroke={C.red}
      strokeWidth={2.5}
      strokeDasharray="7 7"
      fill="none"
    />
    <path
      d="M400 10 L830 440"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.55s' }}
      stroke="var(--osd-accent)"
      strokeWidth={2.5}
      fill="none"
    />
    <path
      d="M250 10 L830 590"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.75s' }}
      stroke="var(--osd-text)"
      strokeWidth={3}
      fill="none"
    />
    <path
      d="M495 405 L645 255"
      className="w6-anim w6-fade"
      style={{ animationDelay: '1.05s' }}
      stroke={C.soft}
      strokeWidth={2}
      strokeDasharray="6 6"
      fill="none"
    />
    <path
      d="M487 413 L503 397"
      className="w6-anim w6-fade"
      style={{ animationDelay: '1.05s' }}
      stroke={C.soft}
      strokeWidth={2}
      fill="none"
    />
    <path
      d="M637 263 L653 247"
      className="w6-anim w6-fade"
      style={{ animationDelay: '1.05s' }}
      stroke={C.soft}
      strokeWidth={2}
      fill="none"
    />
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.95s' }}>
      <circle cx={570} cy={180} r={24} fill="none" stroke={C.soft} strokeWidth={2} strokeDasharray="5 6" />
      <circle cx={570} cy={480} r={24} fill="none" stroke={C.soft} strokeWidth={2} strokeDasharray="5 6" />
      <circle cx={270} cy={180} r={24} fill="none" stroke={C.soft} strokeWidth={2} strokeDasharray="5 6" />
    </g>
    <g className="w6-anim w6-fade" style={{ animationDelay: '1.15s' }}>
      <circle cx={570} cy={180} r={13} fill="var(--osd-bg)" stroke="var(--osd-accent)" strokeWidth={3.5} />
      <circle cx={570} cy={480} r={13} fill="var(--osd-bg)" stroke={C.red} strokeWidth={3.5} />
      <circle cx={270} cy={180} r={13} fill="var(--osd-bg)" stroke={C.red} strokeWidth={3.5} />
      <circle cx={270} cy={480} r={13} fill="var(--osd-bg)" stroke={C.red} strokeWidth={3.5} />
      <text x={596} y={172} style={{ fontFamily: mono, fontSize: 25, fill: 'var(--osd-accent)' }}>
        +1
      </text>
      <text x={302} y={172} style={{ fontFamily: mono, fontSize: 25, fill: C.red }}>
        −1
      </text>
      <text x={536} y={492} textAnchor="end" style={{ fontFamily: mono, fontSize: 25, fill: C.red }}>
        −1
      </text>
      <text x={244} y={492} textAnchor="end" style={{ fontFamily: mono, fontSize: 25, fill: C.red }}>
        −1
      </text>
    </g>
  </svg>
);

const SvmLinear: Page = () => (
  <Frame
    eyebrow="§ 03 · Support Vector Machine · Linear"
    tone={C.svm}
    title="Margin selebar mungkin"
    lead="Cari hyperplane dengan jarak terjauh ke titik terdekat dari kedua kelas."
  >
    <div style={{ display: 'flex', gap: 56 }}>
      <div>
        <div style={{ display: 'flex', gap: 28, fontFamily: mono, fontSize: 20, color: C.muted }}>
          <span>— hyperplane</span>
          <span style={{ color: C.red }}>– – minus plane</span>
          <span style={{ color: 'var(--osd-accent)' }}>— plus plane</span>
          <span>◌ support vector</span>
        </div>
        <MarginFigure />
        <div style={{ marginTop: 6, fontSize: 22, color: C.muted }}>
          Garis ganda putus-putus = lebar margin (2 / ||w||).
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div
          className="w6-anim w6-rise"
          style={{
            boxSizing: 'border-box',
            padding: '24px 30px',
            borderRadius: 'var(--osd-radius)',
            border: `1px solid ${C.edge}`,
            background: C.panel,
            fontFamily: mono,
            fontSize: 27,
          }}
        >
          f(x) = sign(w·x + b) → kelas ±1
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            fontSize: 26,
            lineHeight: 1.4,
            color: C.soft,
          }}
        >
          <Bullet tone={C.svm}>Hyperplane w·x + b = 0 memisahkan dua kelas.</Bullet>
          <Bullet tone={C.svm}>Plus/minus plane lewat titik terdekat: w·x + b = ±1.</Bullet>
          <Bullet tone={C.svm}>Support vector — titik yang menentukan posisi hyperplane.</Bullet>
          <Bullet tone={C.svm}>Maksimalkan margin 2 / ||w|| ≡ minimalkan ½·||w||².</Bullet>
        </ul>
        <p style={{ margin: 0, fontSize: 23, lineHeight: 1.5, color: C.muted }}>
          Contoh: dari 4 titik, tiga di antaranya — (1,1), (1,−1), (−1,1) — menjadi support
          vector; titik (−1,−1) tidak berpengaruh.
        </p>
      </div>
    </div>
  </Frame>
);

// ─── 9 · SVM kernel ─────────────────────────────────────────────────────────

const KernelFigure = () => (
  <svg viewBox="0 0 700 520" width={700} height={520} style={{ display: 'block' }}>
    <path
      d="M42 90 L105 202 L175 297 L210 332 L245 360 L280 379 L315 391 L350 395 L385 391 L420 379 L455 360 L490 332 L525 297 L595 202 L630 143 L658 90"
      className="w6-anim w6-draw"
      pathLength={1}
      style={{ strokeDasharray: '1', animationDelay: '0.5s' }}
      stroke="var(--osd-accent)"
      strokeWidth={3}
      fill="none"
      strokeLinejoin="round"
      opacity={0.9}
    />
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.8s' }}>
      <circle cx={350} cy={422} r={10} fill={C.red} />
      <circle cx={434} cy={413} r={10} fill={C.red} />
      <circle cx={238} cy={431} r={10} fill={C.red} />
      <circle cx={518} cy={386} r={10} fill={C.red} />
      <circle cx={168} cy={400} r={10} fill={C.red} />
      <circle cx={602} cy={323} r={10} fill={C.red} />
      <circle cx={91} cy={332} r={10} fill={C.red} />
    </g>
    <g className="w6-anim w6-fade" style={{ animationDelay: '0.95s' }}>
      <rect x={343} y={289} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={413} y={280} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={259} y={298} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={497} y={235} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={182} y={226} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={581} y={154} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={98} y={163} width={14} height={14} rx={3} fill="var(--osd-accent)" />
      <rect x={637} y={100} width={14} height={14} rx={3} fill="var(--osd-accent)" />
    </g>
    <text x={20} y={40} style={{ fontFamily: mono, fontSize: 21, fill: C.dim }}>
      φ(x) → ruang baru
    </text>
  </svg>
);

const SvmKernel: Page = () => (
  <Frame
    eyebrow="§ 03 · Support Vector Machine · Non-Linear"
    tone={C.svm}
    title="Saat garis lurus tidak cukup"
    lead="Untuk data yang tidak terpisah linear, SVM memetakan data ke ruang berdimensi lebih tinggi."
  >
    <div style={{ display: 'flex', gap: 60 }}>
      <div>
        <KernelFigure />
        <div style={{ marginTop: 10, fontSize: 22, color: C.muted }}>
          ■ kelas +1 · ● kelas −1 · — batas keputusan hasil kernel polinomial (skema).
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Steps>
          <Step>
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Di ruang 2D, dua kelas ini tidak bisa dipisahkan satu garis lurus — berapa pun
              garisnya, pasti ada yang salah kelas.
            </div>
          </Step>
          <Step>
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              SVM memetakan data lewat φ(x) ke dimensi lebih tinggi; di ruang baru itu batas
              linier kembali bisa bekerja.
            </div>
          </Step>
          <Step>
            <div style={{ fontSize: 28, lineHeight: 1.45, color: C.soft }}>
              Kernel trick: hasil kali titik di ruang baru dihitung langsung — tanpa transformasi
              eksplisit.
            </div>
            <div
              style={{
                marginTop: 24,
                boxSizing: 'border-box',
                padding: '24px 30px',
                borderRadius: 12,
                background: C.ink,
                color: '#e8e6f0',
                fontFamily: mono,
                fontSize: 24,
                lineHeight: 1.7,
              }}
            >
              <div>
                <span style={{ color: '#9a97c9' }}>from</span> sklearn.svm{' '}
                <span style={{ color: '#9a97c9' }}>import</span> SVC
              </div>
              <div>
                model = SVC(kernel=<span style={{ color: '#8fd0a0' }}>'poly'</span>)
              </div>
            </div>
          </Step>
        </Steps>
        <p style={{ margin: 0, fontSize: 23, lineHeight: 1.5, color: C.muted }}>
          Kernel lain: linear, RBF, sigmoid — pilih sesuai bentuk data, dan waspadai overfitting
          saat dimensi naik.
        </p>
      </div>
    </div>
  </Frame>
);

// ─── 10 · Rekap ─────────────────────────────────────────────────────────────

const RecapRow = ({
  tone,
  name,
  sub,
  tipe,
  idea,
  watch,
}: {
  tone: string;
  name: string;
  sub: string;
  tipe: string;
  idea: string;
  watch: string;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '300px 190px 640px 1fr',
      alignItems: 'center',
      height: 122,
      borderTop: `1px solid ${C.rule}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 14, height: 14, borderRadius: 7, background: tone, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: 'var(--osd-font-display)', fontSize: 32, fontWeight: 700 }}>
          {name}
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 17,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tone,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
    <div style={{ fontSize: 25, color: C.muted }}>{tipe}</div>
    <div style={{ fontSize: 25, color: C.soft, paddingRight: 30 }}>{idea}</div>
    <div style={{ fontSize: 25, color: C.muted }}>{watch}</div>
  </div>
);

const Recap: Page = () => (
  <Frame
    eyebrow="§ Rekap · Pembelajaran Mesin"
    title="Tiga alat, tiga karakter"
    lead="Kemiripan, aturan, atau margin — sesuaikan dengan bentuk data dan kebutuhan."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 190px 640px 1fr',
        alignItems: 'center',
        height: 44,
        fontFamily: mono,
        fontSize: 18,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: C.dim,
      }}
    >
      <span>Metode</span>
      <span>Tipe</span>
      <span>Ide kunci</span>
      <span>Catatan</span>
    </div>
    <RecapRow
      tone={C.knn}
      name="kNN"
      sub="lazy learning"
      tipe="Lazy"
      idea="Kemiripan jarak + majority vote k tetangga terdekat"
      watch="Sensitif outlier & skala fitur"
    />
    <RecapRow
      tone={C.dt}
      name="Decision Tree"
      sub="eager learning"
      tipe="Eager"
      idea="Split atribut dengan information gain tertinggi"
      watch="Rawan overfitting → pruning"
    />
    <RecapRow
      tone={C.svm}
      name="SVM"
      sub="eager learning"
      tipe="Eager"
      idea="Margin maksimum; kernel untuk data non-linear"
      watch="Pemilihan kernel & parameter"
    />
    <div
      className="w6-anim w6-rise"
      style={{
        marginTop: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        padding: '32px 40px',
        borderRadius: 'var(--osd-radius)',
        background: C.ink,
        color: C.paper,
      }}
    >
      <span style={{ fontFamily: 'var(--osd-font-display)', fontSize: 40, fontWeight: 700 }}>
        Terima kasih — Week 6
      </span>
      <span style={{ fontFamily: mono, fontSize: 22, color: '#b9b6d8' }}>
        Latihan: prediksi data baru dengan k = 1 dan k = 3
      </span>
    </div>
  </Frame>
);

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: 'cubic-bezier(0.4, 0, 1, 1)', keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const notes: (string | undefined)[] = [
  `Selamat bertemu di sesi Week 6. Minggu ini kita membahas tiga metode supervised learning untuk klasifikasi: kNN, Decision Tree, dan SVM.
Buka dengan pertanyaan pemantik: kalau data sudah punya label, bagaimana cara memprediksi label data baru? Ketiganya menjawab dengan cara berbeda — kemiripan, aturan, dan margin.`,
  `Kunci pembedanya satu: kapan komputasi besar dilakukan. kNN menunda sampai ada data uji — pipeline batch-nya berhenti di ekstraksi fitur. Decision Tree dan SVM membangun model di awal, jadi prediksinya cepat tetapi bayar di pelatihan.
Contohkan: satu data uji dibanding 100 data latih berarti 100 kali perhitungan jarak; kalau data ujinya 10, jadi 1.000 kali.`,
  `Alur tiga langkah: hitung jarak, urutkan, lalu voting. Di contoh kertas tisu, U = (3, 7). Jarak L3 dan L4 = 3,61, L1 = 4, L2 = 5.
k = 1 → prediksi T; k = 3 → T menang 2 suara lawan 1. Tekankan: kelas ditentukan suara mayoritas, bukan jarak total. Kenapa k = 2 atau 4 tidak dipakai? Itu masuk slide isu.`,
  `Lima catatan. Pertama, satu mislabel bisa menggeser batas keputusan secara frontal. Kedua, voting tidak memberi tingkat keyakinan — 3 dari 5 dan 5 dari 5 sama-sama “menang”.
Ketiga, pilih k ganjil supaya tidak seri, dan cari nilainya lewat validation set. Keempat, fitur dengan rentang berbeda jauh harus dinormalisasi — min-max atau zero-mean. Kelima, biaya prediksi O(N·D); solusinya dimensionality reduction, KD-tree, LSH.
Singgung juga missing value: bisa diimputasi, misalnya dengan rata-rata atributnya.`,
  `Bentuknya pohon: root, internal node, branch, leaf. Depth dihitung dari root ke internal node terjauh.
Contoh 14 sampel main tenis (9 yes, 5 no) — perhatikan bahwa memilih atribut yang tepat membuat pohon lebih dangkal dan lebih efisien. Inilah yang dicari proses splitting.`,
  `Entropy mengukur ketidakpastian: pure = 0, 50:50 = 1. Information gain adalah penurunan ketidakpastian setelah split.
Hitung untuk setiap fitur: wind 0,048; humidity 0,152; outlook 0,247 — outlook tertinggi, jadi root. Proses diulang di tiap cabang sampai subset pure atau atributnya habis.`,
  `Pohon bisa dibaca sebagai aturan: setiap jalur root → daun menjadi gabungan kondisi AND.
Bahayanya overfitting — satu noise memaksa cabang baru; penawarnya pruning dengan validation set. Varian C4.5 memakai gain ratio agar tidak bias ke atribut ber-nilai banyak.
Terakhir, dua isu representasi: fitur kontinus di-split berbasis interval; fitur multi-nilai dipecah menjadi fitur biner.`,
  `Alurnya: cari hyperplane w·x + b = 0; plus/minus plane melewati support vector; margin = 2 / ||w||. Optimasinya quadratic programming: maksimalkan margin ≡ minimalkan ½·||w||².
Di contoh 4 titik, tiga titik menjadi support vector; titik (−1,−1) tidak berpengaruh pada posisi hyperplane. Boleh disinggung bahwa SVM sempat sangat populer sebelum era deep learning.`,
  `Kalau data tidak terpisah linear, tambahkan dimensi lewat pemetaan φ(x). Kernel menghitung hasil kali titik di ruang baru tanpa transformasi eksplisit — inilah kernel trick.
Contoh implementasi: SVC(kernel='poly') di scikit-learn menghasilkan batas keputusan non-linear. Ingatkan risiko overfitting ketika dimensi naik.`,
  `Tutup dengan tabel: kNN — lazy, kemiripan; Decision Tree — eager, aturan; SVM — eager, margin.
Beri tugas seperti di transkrip: coba prediksi data baru dengan k = 1 dan k = 3, lalu bandingkan hasilnya. Terima kasih.`,
];

export const meta: SlideMeta = {
  title: 'Pembelajaran Mesin · Week 6 — kNN, Decision Tree & SVM',
  createdAt: '2026-09-27T17:07:03.891Z',
};

export default [
  Cover,
  Foundations,
  KnnHow,
  KnnIssues,
  TreeStructure,
  TreeId3,
  TreeRules,
  SvmLinear,
  SvmKernel,
  Recap,
] satisfies Page[];
