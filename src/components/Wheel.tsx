import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Gift, PartyPopper, RotateCcw } from 'lucide-react';
import { wa } from '../data';
import { gsap } from '../lib/gsap';
import { useSiteData } from '../lib/siteData';

interface WheelSegment {
  pct: number;
  weight: number;
}

const SEGMENTS: WheelSegment[] = [
  { pct: 5, weight: 30 },
  { pct: 10, weight: 25 },
  { pct: 15, weight: 18 },
  { pct: 20, weight: 12 },
  { pct: 25, weight: 8 },
  { pct: 30, weight: 5 },
  { pct: 35, weight: 2 },
];

const SEG_ANGLE = 360 / SEGMENTS.length;
const SEG_COLORS = ['#e11d2e', '#ffffff', '#ff8a92', '#fdecee', '#c70f24', '#ffffff', '#e11d2e'];

const WHEEL_SIZE = 420;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 195;

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

export default function Wheel() {
  const { courses, ready } = useSiteData();
  const [course, setCourse] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<WheelSegment | null>(null);
  const [confettiEls, setConfettiEls] = useState<number[]>([]);
  const wheelRef = useRef<SVGGElement>(null);
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
    if (!card) return;
    gsap.fromTo(card, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    const count = 26;
    setConfettiEls(Array.from({ length: count }, (_, i) => i));
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.wheel-confetti').forEach((el) => {
        gsap.fromTo(
          el,
          { y: -40, x: 0, rotation: 0, opacity: 1 },
          {
            y: () => 220 + Math.random() * 260,
            x: () => (Math.random() - 0.5) * 320,
            rotation: () => (Math.random() - 0.5) * 720,
            opacity: 0,
            duration: () => 1.1 + Math.random() * 0.9,
            delay: () => Math.random() * 0.35,
            ease: 'power2.out',
          }
        );
      });
    });
    return () => ctx.revert();
  }, [prize]);

  const coursesForSelect = useMemo(() => courses, [courses]);

  const spin = () => {
    if (spinning || !course) return;
    setPrize(null);
    setConfettiEls([]);
    const index = pickSegment();
    spinCount.current += 1;
    const spins = 5 + Math.floor(Math.random() * 3);
    const delta = spins * 360 + (360 - (index * SEG_ANGLE + SEG_ANGLE / 2));
    rotationRef.current += delta;
    setSpinning(true);
    gsap.to(wheelRef.current, {
      rotation: rotationRef.current,
      duration: 5,
      ease: 'power4.out',
      onComplete: () => {
        setSpinning(false);
        setPrize(SEGMENTS[index]);
      },
    });
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

      <main className="container wheel-main">
        <p className="eyebrow">Sorteio de descontos</p>
        <h2>Gire a roleta e garanta até 35% de desconto</h2>
        <p className="lead">
          Escolha o curso que você quer, gire a roleta e leve o prêmio para a sua matrícula.
        </p>

        <label className="wheel-course-label" htmlFor="wheel-course">
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

        <div className="wheel-stage">
          <span className="wheel-pointer" aria-hidden="true" />
          <svg
            className="wheel"
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            role="img"
            aria-label="Roleta de descontos de 5 a 35 por cento"
          >
            <g ref={wheelRef} style={{ transformOrigin: '50% 50%' }}>
              {SEGMENTS.map((_, index) => (
                <path key={index} d={segmentPath(index)} fill={SEG_COLORS[index % SEG_COLORS.length]} stroke="#dcdce2" strokeWidth="2" />
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

        <div className="wheel-actions">
          <button type="button" className="btn btn-primary" onClick={spin} disabled={spinning || !course}>
            <RotateCcw strokeWidth={2.4} /> {spinning ? 'Girando...' : 'Girar a roleta'}
          </button>
          {prize && (
            <a className="btn btn-outline" href="#roleta">
              <ArrowRight strokeWidth={2.4} /> Girar novamente
            </a>
          )}
        </div>

        {prize && (
          <div className="wheel-prize-overlay">
            {confettiEls.map((item) => (
              <span
                key={item}
                className="wheel-confetti"
                style={{
                  left: `${8 + (item * 37) % 84}%`,
                  background: item % 3 === 0 ? '#e11d2e' : item % 3 === 1 ? '#ff8a92' : '#c70f24',
                }}
                aria-hidden="true"
              />
            ))}
            <div className="wheel-prize-card" role="status">
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
      </main>
    </div>
  );
}