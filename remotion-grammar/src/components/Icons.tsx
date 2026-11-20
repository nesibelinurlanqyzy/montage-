import React from 'react';
import {C} from '../theme';

/* Псевдо-3D иконки: свет сверху-слева, тень справа, объёмные градиенты. */

export const Clock: React.FC<{size: number; f: number; color?: string; uid: string}> = ({size, f, color = C.blue, uid}) => {
  const m = (f * 6) % 360, h = (f * 0.5) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <radialGradient id={`ck${uid}`} cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#dbeafe" /><stop offset="1" stopColor="#93a8d8" /></radialGradient>
        <linearGradient id={`cr${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="#1e3a8a" /></linearGradient>
      </defs>
      <circle cx="106" cy="108" r="88" fill="rgba(0,0,0,0.35)" />
      <circle cx="100" cy="100" r="90" fill={`url(#cr${uid})`} />
      <circle cx="100" cy="100" r="74" fill={`url(#ck${uid})`} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x="97" y="32" width="6" height={i % 3 === 0 ? 16 : 9} rx="3" fill="#1e293b" transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <rect x="95" y="58" width="10" height="46" rx="5" fill="#0f172a" transform={`rotate(${h} 100 100)`} />
      <rect x="97" y="40" width="6" height="64" rx="3" fill={color} transform={`rotate(${m} 100 100)`} />
      <circle cx="100" cy="100" r="8" fill="#0f172a" />
      <ellipse cx="72" cy="60" rx="26" ry="12" fill="rgba(255,255,255,0.55)" transform="rotate(-30 72 60)" />
    </svg>
  );
};

export const Calendar: React.FC<{size: number; f: number; color?: string; header?: string; uid: string; circleDay?: number; circleP?: number; flip?: number}> = ({
  size, color = C.blue, header = '2025', uid, circleDay = 17, circleP = 0, flip = 0,
}) => {
  const cells = [] as React.ReactNode[];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
    const n = r * 5 + c + 1;
    const x = 34 + c * 28, y = 92 + r * 24;
    cells.push(<rect key={n} x={x} y={y} width="20" height="16" rx="4" fill={n === circleDay ? color : '#c7d2fe'} opacity={n === circleDay ? 1 : 0.9} />);
    if (n === circleDay) cells.push(
      <circle key="c" cx={x + 10} cy={y + 8} r="20" fill="none" stroke={C.red} strokeWidth="5" strokeLinecap="round"
        strokeDasharray="126" strokeDashoffset={126 * (1 - circleP)} transform={`rotate(-90 ${x + 10} ${y + 8})`} />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`cb${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#dfe6ff" /></linearGradient>
        <linearGradient id={`ch${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="#1e3a8a" /></linearGradient>
      </defs>
      <rect x="22" y="32" width="166" height="160" rx="22" fill="rgba(0,0,0,0.35)" />
      <rect x="14" y="24" width="166" height="160" rx="22" fill="#94a3d8" />
      <rect x="14" y="20" width="166" height="156" rx="22" fill={`url(#cb${uid})`} />
      <path d="M14 42 a22 22 0 0 1 22 -22 h122 a22 22 0 0 1 22 22 v30 h-166z" fill={`url(#ch${uid})`} />
      <text x="97" y="62" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="30" fill="#fff">{header}</text>
      {cells}
      {/* перелистывающийся лист */}
      {flip > 0 && flip < 1 && (
        <g transform={`translate(97 72) scale(1 ${Math.cos(flip * Math.PI)}) translate(-97 -72)`}>
          <rect x="14" y="72" width="166" height="104" rx="10" fill="#eef2ff" opacity="0.95" />
        </g>
      )}
      <rect x="48" y="6" width="14" height="34" rx="7" fill="#e2e8f0" stroke="#334155" strokeWidth="3" />
      <rect x="132" y="6" width="14" height="34" rx="7" fill="#e2e8f0" stroke="#334155" strokeWidth="3" />
    </svg>
  );
};

export const Question: React.FC<{size: number; color?: string; uid: string}> = ({size, color = C.purple, uid}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id={`q${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5d0fe" /><stop offset="0.5" stopColor={color} /><stop offset="1" stopColor="#4c1d95" /></linearGradient>
    </defs>
    <text x="108" y="168" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="190" fill="rgba(0,0,0,0.4)">?</text>
    {[6, 5, 4, 3, 2, 1].map((d) => (
      <text key={d} x={100 + d} y={160 + d} textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="190" fill="#3b0764">?</text>
    ))}
    <text x="100" y="160" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="190" fill={`url(#q${uid})`}>?</text>
  </svg>
);

/** Стилизованный Биг-Бен с объёмом: светлая лицевая грань + тёмная боковая. */
export const BigBen: React.FC<{height: number; f: number; uid: string}> = ({height, f, uid}) => {
  const w = height * 0.5;
  const m = (f * 4) % 360, h = (f * 0.4) % 360;
  return (
    <svg width={w} height={height} viewBox="0 0 200 400" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id={`bf${uid}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#d6a85a" /></linearGradient>
        <linearGradient id={`bs${uid}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a16d2c" /><stop offset="1" stopColor="#6b4318" /></linearGradient>
        <linearGradient id={`br${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38BDF8" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient>
        <radialGradient id={`bc${uid}`} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#fef3c7" /></radialGradient>
      </defs>
      {/* шпиль */}
      <path d="M100 0 L82 78 H118 Z" fill={`url(#br${uid})`} />
      <path d="M100 0 L118 78 H132 Z" fill="#1e3a8a" />
      <rect x="96" y="-14" width="8" height="18" rx="4" fill="#fde68a" />
      {/* верх с колоннами */}
      <rect x="74" y="78" width="52" height="40" fill={`url(#bf${uid})`} />
      <path d="M126 78 h14 l-6 40 h-8z" fill={`url(#bs${uid})`} />
      {[80, 92, 104, 116].map((x) => <rect key={x} x={x} y="86" width="5" height="26" rx="2" fill="#7c4a12" />)}
      {/* часовой блок */}
      <rect x="58" y="118" width="84" height="96" rx="4" fill={`url(#bf${uid})`} />
      <path d="M142 118 h20 l-4 96 h-16z" fill={`url(#bs${uid})`} />
      <circle cx="100" cy="166" r="34" fill="#7c4a12" />
      <circle cx="100" cy="166" r="29" fill={`url(#bc${uid})`} />
      <rect x="98" y="146" width="4" height="22" rx="2" fill="#1f2937" transform={`rotate(${m} 100 166)`} />
      <rect x="97.5" y="152" width="5" height="16" rx="2.5" fill="#1f2937" transform={`rotate(${h} 100 166)`} />
      <circle cx="100" cy="166" r="3.5" fill="#1f2937" />
      {/* башня */}
      <rect x="66" y="214" width="68" height="186" fill={`url(#bf${uid})`} />
      <path d="M134 214 h18 l-2 186 h-16z" fill={`url(#bs${uid})`} />
      {[0, 1, 2, 3, 4].map((r) => [76, 96, 116].map((x) => (
        <rect key={`${r}${x}`} x={x} y={228 + r * 34} width="10" height="22" rx="5" fill="#7c4a12" opacity="0.85" />
      )))}
      <rect x="60" y="210" width="80" height="6" fill="#b7853f" />
      <rect x="62" y="114" width="76" height="6" fill="#b7853f" />
    </svg>
  );
};

export const CheckBadge: React.FC<{size: number; p: number; color?: string}> = ({size, p, color = C.green}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="52" cy="54" r="44" fill="rgba(0,0,0,0.35)" />
    <circle cx="50" cy="50" r="44" fill={color} />
    <circle cx="50" cy="50" r="44" fill="url(#none)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
    <ellipse cx="36" cy="30" rx="18" ry="8" fill="rgba(255,255,255,0.35)" transform="rotate(-25 36 30)" />
    <path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="70" strokeDashoffset={70 * (1 - p)} />
  </svg>
);

export const CrossBadge: React.FC<{size: number; p: number}> = ({size, p}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="52" cy="54" r="44" fill="rgba(0,0,0,0.35)" />
    <circle cx="50" cy="50" r="44" fill={C.red} />
    <ellipse cx="36" cy="30" rx="18" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-25 36 30)" />
    <path d="M33 33 L67 67" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeDasharray="50" strokeDashoffset={50 * (1 - Math.min(1, p * 2))} />
    <path d="M67 33 L33 67" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeDasharray="50" strokeDashoffset={50 * (1 - Math.max(0, p * 2 - 1))} />
  </svg>
);

export const Star: React.FC<{size: number; uid: string; color?: string}> = ({size, uid, color = C.yellow}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id={`st${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fef9c3" /><stop offset="0.5" stopColor={color} /><stop offset="1" stopColor="#b45309" /></linearGradient>
    </defs>
    <path transform="translate(8 10)" d="M100 12 L126 72 L190 78 L142 120 L156 184 L100 150 L44 184 L58 120 L10 78 L74 72 Z" fill="rgba(0,0,0,0.35)" />
    <path d="M100 12 L126 72 L190 78 L142 120 L156 184 L100 150 L44 184 L58 120 L10 78 L74 72 Z" fill={`url(#st${uid})`} stroke="#fde68a" strokeWidth="4" strokeLinejoin="round" />
    <path d="M100 12 L100 150 L44 184 L58 120 L10 78 L74 72 Z" fill="rgba(255,255,255,0.18)" />
  </svg>
);

export const Plane: React.FC<{size: number; uid: string; color?: string}> = ({size, uid, color = C.purple}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id={`pl${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c4b5fd" /></linearGradient>
    </defs>
    <circle cx="100" cy="100" r="92" fill={color} opacity="0.25" />
    <circle cx="100" cy="100" r="80" fill={color} />
    <ellipse cx="74" cy="56" rx="34" ry="14" fill="rgba(255,255,255,0.3)" transform="rotate(-30 74 56)" />
    <g transform="rotate(-40 100 100)">
      <path d="M100 30 C110 30 112 50 112 60 L112 88 L166 118 L166 134 L112 118 L112 146 L130 160 L130 172 L100 162 L70 172 L70 160 L88 146 L88 118 L34 134 L34 118 L88 88 L88 60 C88 50 90 30 100 30Z" fill="rgba(0,0,0,0.3)" transform="translate(6 6)" />
      <path d="M100 30 C110 30 112 50 112 60 L112 88 L166 118 L166 134 L112 118 L112 146 L130 160 L130 172 L100 162 L70 172 L70 160 L88 146 L88 118 L34 134 L34 118 L88 88 L88 60 C88 50 90 30 100 30Z" fill={`url(#pl${uid})`} />
    </g>
  </svg>
);

export const Suitcase: React.FC<{size: number; uid: string; color?: string}> = ({size, uid, color = C.purple}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <linearGradient id={`sc${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9d5ff" /><stop offset="0.45" stopColor={color} /><stop offset="1" stopColor="#4c1d95" /></linearGradient>
    </defs>
    <rect x="72" y="22" width="56" height="40" rx="14" fill="none" stroke="#e9d5ff" strokeWidth="10" />
    <rect x="34" y="58" width="140" height="120" rx="22" fill="rgba(0,0,0,0.35)" />
    <rect x="26" y="50" width="148" height="122" rx="22" fill={`url(#sc${uid})`} />
    <rect x="62" y="50" width="12" height="122" fill="rgba(255,255,255,0.35)" />
    <rect x="126" y="50" width="12" height="122" fill="rgba(255,255,255,0.35)" />
    <circle cx="70" cy="110" r="6" fill={C.yellow} /><circle cx="140" cy="140" r="9" fill={C.blue} />
    <ellipse cx="60" cy="66" rx="26" ry="8" fill="rgba(255,255,255,0.35)" />
  </svg>
);
