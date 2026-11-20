import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from './components/Background';
import {GlassCard} from './components/Common';
import {Calendar, Clock} from './components/Icons';
import {Text3D} from './components/Text';
import {C, FONT, FONT_KZ} from './theme';
import {hexA} from './anim';

/** Обложка Reels: «Present Perfect әлде Past Simple?» */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONT}}>
    <Background />
    <div style={{position: 'absolute', left: 70, top: 300, transform: 'rotate(-10deg)', opacity: 0.95}}><Clock size={200} f={40} uid="c1" /></div>
    <div style={{position: 'absolute', left: 790, top: 290, transform: 'rotate(10deg)'}}><Calendar size={210} f={0} uid="c2" header="2025" circleP={1} /></div>
    <div style={{position: 'absolute', left: 0, width: 1080, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
      <GlassCard color={C.purple} w={900} h={230} radius={44}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Text3D text="Present Perfect" size={104} from="#ffffff" to="#e9d5ff" side="#581c87" depth={10} rotX={8} glow={hexA(C.purple, 0.8)} />
        </div>
      </GlassCard>
      <div style={{fontFamily: FONT_KZ, fontWeight: 800, fontSize: 110, color: C.yellow, textShadow: `0 0 40px ${hexA(C.yellow, 0.7)}, 0 8px 0 #854d0e`}}>әлде</div>
      <GlassCard color={C.blue} w={900} h={230} radius={44}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Text3D text="Past Simple?" size={112} from="#ffffff" to="#bae6fd" side="#0c4a6e" depth={10} rotX={8} glow={hexA(C.blue, 0.8)} />
        </div>
      </GlassCard>
      <div style={{marginTop: 40, padding: '22px 48px', borderRadius: 999, background: hexA(C.yellow, 0.18), border: `3px solid ${C.yellow}`,
        fontFamily: FONT_KZ, fontWeight: 800, fontSize: 56, color: '#fff', boxShadow: `0 0 40px ${hexA(C.yellow, 0.5)}`}}>
        Айырмашылығы 45 секундта
      </div>
    </div>
  </AbsoluteFill>
);
