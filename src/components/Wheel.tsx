import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Gift, Lock, PartyPopper, RotateCcw, X } from 'lucide-react';
import { wa } from '../data';
import { gsap } from '../lib/gsap';
import { useSiteData } from '../lib/siteData';

interface WheelSegment {
  pct: number;
  weight: number;
}

const SEGMENTS: WheelSegment[] = [
  { pct: 5, weight: 24 },
  { pct: 10, weight: 20 },
  { pct: 15, weight: 30 },
  { pct: 20, weight: 12 },
  { pct: 25, weight: 8 },
  { pct: 30, weight: 4 },
  { pct: 35, weight: 2 },
];

const SEG_ANGLE = 360 / SEGMENTS.length;
const SEG_COLORS = ['#e11d2e', '#ffffff', '#ff8a92', '#fdecee', '#c70f24', '#ffffff', '#e11d2e'];
const CONFETTI_COLORS = ['#e11d2e', '#ff8a92', '#c70f24', '#f2a33c', '#ffffff'];

const WHEEL_SIZE = 420;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 195;

const WHEEL_STEPS = [
  { n: '01', title: 'Escolha o curso', text: 'Selecione no menu abaixo o curso que você quer fazer.' },
  { n: '02', title: 'Gire a roleta', text: 'A sorte decide: você pode ganhar de 5% a 35% de desconto.' },
  { n: '03', title: 'Receba no WhatsApp', text: 'Clique no botão e fale com a gente para garantir seu prêmio.' },
];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  round: boolean;
  delay: number;
  size: number;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function segmentPath(index: number): string {
  const start = -90 + index * SEG_ANGLE;
  const end = start + SEG_ANGLE;
  const p1 = polarToCartesian(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, start);
  const p2 = polarToCartesian(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, end);
  return [
    `M ${WHEEL_CENTER} ${WHEEL_CENTER}`,
    `L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function labelPosition(index: number) {
  const mid = -90 + index * SEG_ANGLE + SEG_ANGLE / 2;
  return polarToCartesian(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS * 0.62, mid);
}

function pickSegment(): number {
  const total = SEGMENTS.reduce((sum, segment) => sum + segment.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < SEGMENTS.length; i++) {
    roll -= SEGMENTS[i].weight;
    if (roll <= 0) return i;
  }
  return SEGMENTS.length - 1;
}

function makeConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
    round: id % 4 === 0,
    delay: Math.random() * 0.7,
    size: 9 + Math.random() * 9,
  }));
}

export default function Wheel() {
  const { courses, ready } = useSiteData();
  const [course, setCourse] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<WheelSegment | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [hasSpun, setHasSpun] = useState(() => {
    try {
      return sessionStorage.getItem('sos-wheel-spun') === '1';
    } catch {
      return false;
    }
  });
  const wheelRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const spinCount = useRef(0);

  useEffect(() => {
    if (ready && courses.length > 0 && !course) {
      setCourse(courses[0].name);
    }
  }, [ready, courses, course]);

  useEffect(() => {
    if (spinCount.current === 0) return;
    const card = document.querySelector('.wheel-prize-card');
    if (card) {
      gsap.fromTo(
        card,
        { scale: 0.3, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.55)' }
      );
      gsap.fromTo(
        '.wheel-prize-card .wheel-prize-value',
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.45, ease: 'back.out(2.2)' }
      );
    }
    const layer = document.querySelector('.wheel-confetti-layer');
    if (layer) {
      gsap.fromTo(
        layer.children,
        { y: -40, opacity: 1 },
        {
          y: () => window.innerHeight + 80,
          x: () => (Math.random() - 0.5) * 240,
          rotation: () => (Math.random() - 0.5) * 1080,
          opacity: 0,
          duration: () => 2.6 + Math.random() * 2.2,
          delay: () => Math.random() * 0.6,
          ease: 'power1.in',
          stagger: 0.02,
        }
      );
    }
  }, [prize]);

  const coursesForSelect = useMemo(() => courses, [courses]);

  const spin = () => {
    if (spinning || !course || hasSpun) return;
    setPrize(null);
    setConfetti([]);
    const index = pickSegment();
    spinCount.current += 1;
    const spins = 5 + Math.floor(Math.random() * 3);
    const delta = spins * 360 + (360 - (index * SEG_ANGLE + SEG_ANGLE / 2));
    const finalRotation = rotationRef.current + delta;
    const overshoot = finalRotation + 6;
    const duration = 4.4 + spins * 0.3;
    rotationRef.current = finalRotation;
    setSpinning(true);
    const timeline = gsap.timeline({
      onComplete: () => {
        setSpinning(false);
        setConfetti(makeConfetti(44));
        setPrize(SEGMENTS[index]);
        try {
          sessionStorage.setItem('sos-wheel-spun', '1');
        } catch {
          /* ignore */
        }
        setHasSpun(true);
      },
    });
    timeline
      .to(wheelRef.current, { rotation: overshoot, duration, ease: 'power4.out' })
      .to(wheelRef.current, { rotation: finalRotation, duration: 0.8, ease: 'back.out(1.6)' });
    gsap.fromTo(
      stageRef.current,
      { scale: 1 },
      { scale: 1.04, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, clearProps: 'scale' }
    );
  };

  const wheelLabel = (index: number) => {
    const { x, y } = labelPosition(index);
    const rotate = -90 + index * SEG_ANGLE + SEG_ANGLE / 2;
    return (
      <text
        key={index}
        x={x}
        y={y}
        fill={index % 2 === 1 ? '#101014' : '#ffffff'}
        fontSize="26"
        fontWeight="800"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${rotate} ${x} ${y})`}
      >
        {SEGMENTS[index].pct}%
      </text>
    );
  };

  const prizeMessage = prize
    ? `Olá! Fui premiado com ${prize.pct}% de desconto e tenho interesse no curso de ${course}.`
    : '';

  return (
    <div className="wheel-shell">
      <header className="wheel-header">
        <div className="container wheel-header-row">
          <div className="wheel-brand">
            <Gift strokeWidth={2.2} />
            <div>
              <p className="eyebrow">S.O.S Cursos</p>
              <h2>Roleta Premiada</h2>
            </div>
          </div>
          <a className="btn btn-outline" href="#topo">
            <ArrowLeft strokeWidth={2.4} /> Voltar ao site
          </a>
        </div>
      </header>

      <section className="wheel-hero">
        <div className="container wheel-hero-row">
          <div className="wheel-hero-copy" data-reveal>
            <span className="wheel-hero-badge">
              <Gift strokeWidth={2.2} /> Sorteio de descontos
            </span>
            <h1>Gire a roleta e ganhe até 35% de desconto</h1>
            <p>
              Escolha o curso dos seus sonhos, gire a roleta premiada da S.O.S Cursos e leve seu
              desconto direto para o WhatsApp.
            </p>
            <ul className="wheel-hero-benefits">
              <li>Até 35% OFF na matrícula</li>
              <li>Válido em qualquer curso do catálogo</li>
              <li>1 girada por sessão com prêmio garantido</li>
            </ul>
          </div>
          <div className="wheel-hero-visual" data-reveal>
            <span className="wheel-shape wheel-shape-ring" aria-hidden="true"></span>
            <span className="wheel-shape wheel-shape-dots" aria-hidden="true"></span>
            <div className="image-frame">
              <img
                src="/assets/imagem_sos1.webp"
                alt="Estudante da S.O.S Cursos sorrindo com notebook nas mãos"
                width="1303"
                height="1207"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container wheel-main">
        <ol className="steps-grid wheel-steps" data-reveal>
          {WHEEL_STEPS.map((step) => (
            <li className="step-card" key={step.n}>
              <span className="step-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <label className="wheel-course-label" htmlFor="wheel-course" data-reveal>
          Qual curso você tem interesse?
          <select
            id="wheel-course"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            disabled={spinning || coursesForSelect.length === 0}
          >
            {coursesForSelect.map((item) => (
              <option key={item.id ?? item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="wheel-stage" ref={stageRef} data-reveal>
          <span className="wheel-deco wheel-deco-blob" aria-hidden="true"></span>
          <span className="wheel-deco wheel-deco-dots" aria-hidden="true"></span>
          <span className="wheel-pointer" aria-hidden="true" />
          <span className="wheel-offer-badge">ATÉ 35% OFF</span>
          <svg
            className="wheel"
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            role="img"
            aria-label="Roleta de descontos de 5 a 35 por cento"
            ref={wheelRef}
            style={{ transformOrigin: '50% 50%' }}
          >
            <g>
              {SEGMENTS.map((_, index) => (
                <path
                  key={index}
                  d={segmentPath(index)}
                  fill={SEG_COLORS[index % SEG_COLORS.length]}
                  stroke="#dcdce2"
                  strokeWidth="2"
                />
              ))}
              {SEGMENTS.map((_, index) => wheelLabel(index))}
            </g>
            <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="52" fill="#e11d2e" stroke="#ffffff" strokeWidth="6" />
            <text x={WHEEL_CENTER} y={WHEEL_CENTER - 8} fill="#ffffff" fontSize="16" fontWeight="800" textAnchor="middle">
              S.O.S
            </text>
            <text x={WHEEL_CENTER} y={WHEEL_CENTER + 16} fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
              Cursos
            </text>
          </svg>
        </div>

        <div className="wheel-actions" data-reveal>
          {hasSpun ? (
            <button type="button" className="btn btn-primary" disabled>
              <Lock strokeWidth={2.4} /> Desconto liberado
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={spin} disabled={spinning || !course}>
              <RotateCcw strokeWidth={2.4} className={spinning ? 'wheel-spin-icon' : undefined} />{' '}
              {spinning ? 'Girando...' : 'Girar a roleta'}
            </button>
          )}
        </div>
        {hasSpun && !prize && (
          <p className="wheel-locked" data-reveal>
            <Lock strokeWidth={2.2} /> Você já girou a roleta nesta sessão e seu desconto foi liberado.
            Use o WhatsApp para aproveitar sua vantagem.
          </p>
        )}
      </main>

      {prize && (
        <div className="wheel-prize-overlay">
          <div className="wheel-confetti-layer" aria-hidden="true">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className={piece.round ? 'wheel-confetti-piece round' : 'wheel-confetti-piece'}
                style={{
                  left: `${piece.left}%`,
                  width: piece.size,
                  height: piece.size * (piece.round ? 1 : 1.6),
                  background: piece.color,
                  animationDelay: `${piece.delay}s`,
                }}
              />
            ))}
          </div>
          <div className="wheel-prize-card" role="status">
              <button
                type="button"
                className="wheel-prize-close"
                onClick={() => setPrize(null)}
                aria-label="Fechar"
              >
                <X strokeWidth={2.4} />
              </button>
              <PartyPopper strokeWidth={2.2} />
              <p className="eyebrow">Você acabou de ganhar</p>
              <h3>PARABÉNS!</h3>
              <strong className="wheel-prize-value">{prize.pct}% de desconto</strong>
              <p className="wheel-prize-text">
                Receba <strong>{prize.pct}% OFF</strong> em qualquer curso, inclusive em <strong>{course}</strong>.
              </p>
              <a
                className="btn btn-primary"
                href={wa(prizeMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Gift strokeWidth={2.4} /> Receba {prize.pct}% de desconto
              </a>
              <p className="wheel-prize-note">
                Ao clicar, você será direcionado ao WhatsApp com a mensagem: “{prizeMessage}”
              </p>
            </div>
          </div>
      )}
    </div>
  );
}