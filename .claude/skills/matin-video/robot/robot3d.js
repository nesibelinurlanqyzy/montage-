// robot3d.js — 3D робот (three.js): жылтыр шлем, жарқыраған бет, қызғылт-сары құлаққап, микрофон.
// window.R3.draw(t, env, pose) — pose = {R:[иық,шынтақ,қол], L:[...]} (3D нүктелер)
import * as THREE from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';

const ACC = 0xff5a1f;
const cv = document.getElementById('r3');
const CW = cv.clientWidth, CH = cv.clientHeight;
const rd = new THREE.WebGLRenderer({canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true});
rd.setPixelRatio(3); rd.setSize(CW, CH, false);
rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.05;
rd.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(rd);
scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.32;
const cam = new THREE.PerspectiveCamera(26, CW / CH, 0.1, 50);
cam.position.set(0, 1.3, 7.4); cam.lookAt(0, 1.1, 0);

// жарық
const key = new THREE.DirectionalLight(0xfff1e6, 1.5); key.position.set(-3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(ACC, 5.0); rim.position.set(4, 2.2, -3.5); scene.add(rim);
const rim2 = new THREE.DirectionalLight(0xff8a50, 2.2); rim2.position.set(-4.5, 1.5, -3); scene.add(rim2);
const under = new THREE.PointLight(ACC, 3, 5, 2); under.position.set(0, 0.2, 2.2); scene.add(under);
scene.add(new THREE.HemisphereLight(0x3a302e, 0x0a0606, 0.6));

// материалдар
const shell = new THREE.MeshPhysicalMaterial({color: 0x2c2625, metalness: 0.35, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12});
const shellD = new THREE.MeshPhysicalMaterial({color: 0x161312, metalness: 0.4, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.2});
const visorM = new THREE.MeshPhysicalMaterial({color: 0x030303, metalness: 0.2, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03});
const glowM = new THREE.MeshBasicMaterial({color: ACC, toneMapped: false});
const rubber = new THREE.MeshStandardMaterial({color: 0x0e0c0c, roughness: 0.75, metalness: 0.1});

const robot = new THREE.Group(); scene.add(robot);
// дене
const torso = new THREE.Mesh(new THREE.SphereGeometry(0.8, 48, 32), shell);
torso.scale.set(0.82, 0.66, 0.62); torso.position.set(0, -0.28, 0); robot.add(torso);
const chest = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.07, 0.06, 4, 0.03), glowM);
chest.position.set(0, -0.02, 0.47); chest.rotation.x = -0.35; robot.add(chest);
const collar = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 12, 48), shellD);
collar.rotation.x = Math.PI / 2; collar.position.set(0, 0.24, 0); collar.scale.setScalar(0.7); robot.add(collar);
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 32), shellD); neck.position.set(0, 0.38, 0); robot.add(neck);

// бас
const head = new THREE.Group(); head.position.set(0, 1.26, 0); head.scale.setScalar(1.35); robot.add(head);
const helm = new THREE.Mesh(new RoundedBoxGeometry(1.36, 1.12, 1.06, 8, 0.44), shell); head.add(helm);
const visor = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.84, 0.3, 8, 0.14), visorM); visor.position.set(0, -0.04, 0.42); head.add(visor);
// бет текстурасы (көз, ауыз)
const fc = document.createElement('canvas'); fc.width = 512; fc.height = 384;
const fx = fc.getContext('2d');
const ftex = new THREE.CanvasTexture(fc); ftex.colorSpace = THREE.SRGBColorSpace;
const face = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.75), new THREE.MeshBasicMaterial({map: ftex, transparent: true, toneMapped: false}));
face.position.set(0, -0.04, 0.575); head.add(face);
// құлаққап
const band = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.055, 16, 64, Math.PI), rubber);
band.position.set(0, 0.02, -0.05); head.add(band);
for (const s of [-1, 1]) {
  const cup = new THREE.Group(); cup.position.set(s * 0.7, -0.05, 0); head.add(cup);
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.22, 40), shellD); c1.rotation.z = Math.PI / 2; cup.add(c1);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.03, 16, 64), glowM); ring.rotation.y = Math.PI / 2; ring.position.x = s * 0.1; cup.add(ring);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 40), rubber); cap.rotation.z = Math.PI / 2; cap.position.x = s * 0.12; cup.add(cap);
}
// микрофон (құлаққаптан шыққан иін)
const micG = new THREE.Group(); head.add(micG);
const boomCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.78, -0.12, 0.05), new THREE.Vector3(-0.8, -0.5, 0.35), new THREE.Vector3(-0.55, -0.6, 0.72), new THREE.Vector3(-0.38, -0.55, 0.82)]);
micG.add(new THREE.Mesh(new THREE.TubeGeometry(boomCurve, 40, 0.025, 10), rubber));
const micB = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.16, 8, 20), shellD);
micB.position.set(-0.34, -0.53, 0.84); micB.rotation.z = Math.PI / 2.4; micG.add(micB);
const micR = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.014, 10, 32), glowM);
micR.position.copy(micB.position).add(new THREE.Vector3(0.04, 0.02, 0)); micR.rotation.y = Math.PI / 2; micR.rotation.x = Math.PI / 2.4; micG.add(micR);

// қолдар
function limb(r) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, 1, 8, 20), shell); robot.add(m); return m; }
const ARM = {};
for (const s of ['R', 'L']) {
  ARM[s] = {up: limb(0.12), lo: limb(0.1), sh: new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 24), shellD),
    el: new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), shellD), hand: new THREE.Group(), ring: new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 10, 32), glowM)};
  const A = ARM[s]; robot.add(A.sh, A.el, A.hand, A.ring);
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 20), shell); palm.scale.set(1, 1.1, 0.75); A.hand.add(palm);
  for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.12, 6, 12), shellD); f.position.set((k - 1) * 0.085, 0.2, 0); A.hand.add(f); }
  const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.08, 6, 12), shellD); th.position.set(s === 'R' ? -0.15 : 0.15, 0.06, 0.02); th.rotation.z = s === 'R' ? 0.9 : -0.9; A.hand.add(th);
}
const UP = new THREE.Vector3(0, 1, 0);
function place(m, a, b) {
  const d = new THREE.Vector3().subVectors(b, a); const L = d.length();
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(UP, d.clone().normalize());
  m.scale.set(1, Math.max(0.01, L - 0.1), 1);
}
function drawFace(t, env) {
  fx.clearRect(0, 0, 512, 384);
  const bl = t % 3.4; const k = bl < 0.14 ? Math.abs(Math.cos(bl / 0.14 * Math.PI)) : 1;
  const eh = Math.max(10, 120 * k), ew = 74, gx = Math.sin(t * 0.6) * 8;
  fx.fillStyle = '#FFEBD0'; fx.shadowColor = 'rgba(255,214,170,0.95)'; fx.shadowBlur = 40;
  for (const x of [168, 344]) { rr(x - ew / 2 + gx, 160 - eh / 2, ew, eh, Math.min(ew, eh) / 2); fx.fill(); fx.fill(); }
  const mo = 8 + env * 52, mw = 54 + env * 10;
  fx.beginPath(); fx.moveTo(256 - mw, 262);
  fx.quadraticCurveTo(256, 262 + mo * 0.35, 256 + mw, 262);
  fx.quadraticCurveTo(256 + mw * 0.9, 272 + mo, 256, 276 + mo);
  fx.quadraticCurveTo(256 - mw * 0.9, 272 + mo, 256 - mw, 262); fx.closePath(); fx.fill(); fx.fill();
  fx.shadowBlur = 0; ftex.needsUpdate = true;
}
function rr(x, y, w, h, r) { fx.beginPath(); fx.moveTo(x + r, y); fx.arcTo(x + w, y, x + w, y + h, r); fx.arcTo(x + w, y + h, x, y + h, r); fx.arcTo(x, y + h, x, y, r); fx.arcTo(x, y, x + w, y, r); fx.closePath(); }

const V = a => new THREE.Vector3(a[0], a[1], a[2]);
window.R3 = {
  draw(t, env, pose, look) {
    robot.rotation.y = -0.16 + Math.sin(t * 0.5) * 0.06 + (look || 0);
    robot.position.y = Math.sin(t * 2.2) * 0.015;
    head.rotation.z = Math.sin(t * 1.3) * 0.05 + Math.sin(t * 3.1) * env * 0.04;
    head.rotation.x = -0.05 + env * 0.07 + Math.sin(t * 1.7) * 0.02;
    head.rotation.y = Math.sin(t * 0.8) * 0.1;
    head.position.y = 1.26 + Math.sin(t * 2.2) * 0.02 - env * 0.02;
        under.intensity = 2.5 + env * 2;
    for (const s of ['R', 'L']) {
      const A = ARM[s], p = pose[s]; const sh = V(p[0]), el = V(p[1]), hn = V(p[2]);
      A.sh.position.copy(sh); A.el.position.copy(el);
      place(A.up, sh, el); place(A.lo, el, hn);
      A.hand.position.copy(hn);
      const dir = new THREE.Vector3().subVectors(hn, el).normalize();
      A.hand.quaternion.setFromUnitVectors(UP, dir);
      A.ring.position.copy(el).lerp(hn, 0.75); A.ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    }
    drawFace(t, env);
    rd.render(scene, cam);
  }
};
window.R3READY = true;
