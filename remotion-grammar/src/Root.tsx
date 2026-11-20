import React from 'react';
import {Composition, Still} from 'remotion';
import {GrammarVideo} from './GrammarVideo';
import {Cover} from './Cover';
import {FPS, TOTAL} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="GrammarVideo" component={GrammarVideo} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    <Still id="Cover" component={Cover} width={1080} height={1920} />
  </>
);
