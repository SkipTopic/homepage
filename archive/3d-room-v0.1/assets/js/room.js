import * as THREE from '../../vendor/three.module.min.js';

/* ===========================================================
   房间尺寸（世界单位，1 单位 ≈ 1 米）
   相机取景靠这些数字算，改尺寸请同步看 camera-rig.js 的注释。
   =========================================================== */
export const ROOM = { w: 7.2, h: 4.2, d: 7.6 };
export const DOOR = { w: 1.55, h: 2.55, gap: 0.022 };

const PALETTE = {
  wall: '#f3e5cf',
  wallUpper: '#f6ede0',
  ceiling: '#f7ecdb',
  floor: '#c68f5c',
  wainscot: '#dcc0a0',
  trim: '#fffaf0',
  door: '#e2916f',
  doorPanel: '#d4825f',
  knob: '#e6b96b',
  rug: '#8fa8ca',
  rugInner: '#a8bcd9',
  leaf: '#78ad5c',
  leafDark: '#5f8f4a',
  pot: '#d98e73',
  glow: '#ffe0b0',
};

/* 三档色阶，做出「卡通赛璐璐」的明暗分层。
   注意：Three 的 toon 材质用 dotNL * 0.5 + 0.5 去采样渐变图，
   所以 dotNL = 0（侧面/背光）对应的是纹理正中间，不是最暗端。
   阶数不够时，所有面都会采样到偏亮的格子，画面就会发灰。 */
function makeGradientMap() {
  const steps = [0.16, 0.26, 0.42, 0.66, 0.88, 1.0];
  const data = new Uint8Array(steps.map((v) => Math.round(v * 255)));
  const tex = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

/* 墙面的竖向渐变：上亮下暗，避免大面积平涂显得空 */
function makeWallTexture(top, bottom) {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 256;
  const g = canvas.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const GRADIENT = makeGradientMap();

function toon(color, extra = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: GRADIENT, ...extra });
}

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
}

/* ---------------- 程序化贴图 ---------------- */

/* 木地板：随机色差的板条 + 木纹 + 拼缝 */
function makeFloorTexture() {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const g = canvas.getContext('2d');

  const rows = 6;
  const rowH = S / rows;
  const tones = ['#c68f5c', '#bd8452', '#c9945f', '#b97e4c', '#c28b58', '#bf8754'];

  g.fillStyle = tones[0];
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < rows; i++) {
    g.fillStyle = tones[i % tones.length];
    g.fillRect(0, i * rowH, S, rowH);

    // 木纹
    g.strokeStyle = 'rgba(122, 78, 46, 0.12)';
    g.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      const y = i * rowH + 7 + ((k + 1) * (rowH - 14)) / 7;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= S; x += 28) {
        g.lineTo(x, y + Math.sin(x * 0.021 + k * 1.7 + i) * 1.5);
      }
      g.stroke();
    }

    // 板条之间的缝
    g.fillStyle = 'rgba(98, 61, 34, 0.5)';
    g.fillRect(0, i * rowH, S, 1.5);

    // 板条端头接缝，避免纹理过于规整
    const joints = 2;
    for (let j = 0; j < joints; j++) {
      const x = ((i * 137 + j * 251 + 60) % S);
      g.fillStyle = 'rgba(98, 61, 34, 0.38)';
      g.fillRect(x, i * rowH, 1.5, rowH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.6, 2.8);
  tex.anisotropy = 4;
  return tex;
}

/* 门缝透出的暖光，用径向渐变当发光贴图 */
function makeGlowTexture() {
  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = S;
  const g = canvas.getContext('2d');
  const rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  rg.addColorStop(0, 'rgba(255, 238, 208, 0.95)');
  rg.addColorStop(0.32, 'rgba(255, 214, 160, 0.5)');
  rg.addColorStop(0.7, 'rgba(255, 198, 138, 0.14)');
  rg.addColorStop(1, 'rgba(255, 190, 130, 0)');
  g.fillStyle = rg;
  g.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* 圆角矩形（地毯用） */
function roundedRect(w, h, r) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/* ---------------- 房间主体 ---------------- */

function buildShell(group) {
  const { w, h, d } = ROOM;
  const halfW = w / 2;
  const halfD = d / 2;

  const wallMat = toon('#ffffff', { map: makeWallTexture('#fcf2e2', '#d6b997') });
  const ceilMat = toon(PALETTE.ceiling);

  // 地面
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    toon(PALETTE.floor, { map: makeFloorTexture() })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // 天花板
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

  // 后墙（门所在）
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
  back.position.set(0, h / 2, -halfD);
  back.receiveShadow = true;
  group.add(back);

  // 左墙
  const left = new THREE.Mesh(new THREE.PlaneGeometry(d, h), wallMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(-halfW, h / 2, 0);
  left.receiveShadow = true;
  group.add(left);

  // 右墙
  const right = new THREE.Mesh(new THREE.PlaneGeometry(d, h), wallMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(halfW, h / 2, 0);
  right.receiveShadow = true;
  group.add(right);

  // 前墙（在相机身后，纯粹为了不漏背景）
  const front = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
  front.rotation.y = Math.PI;
  front.position.set(0, h / 2, halfD);
  group.add(front);

  return { halfW, halfD };
}

/* 护墙板 + 踢脚线，注意后墙要给门让出缺口 */
function buildTrim(group) {
  const { w, h, d } = ROOM;
  const halfW = w / 2;
  const halfD = d / 2;

  const wainMat = toon(PALETTE.wainscot);
  const baseMat = toon(PALETTE.trim);

  const wainH = 0.95;
  const wainD = 0.035;
  const baseH = 0.13;
  const baseD = 0.05;

  const doorOuterHalf = (DOOR.w + 0.24) / 2;

  // 后墙：左右两段
  const segW = halfW - doorOuterHalf;
  if (segW > 0.02) {
    const cx = doorOuterHalf + segW / 2;
    group.add(box(segW, wainH, wainD, wainMat, -cx, wainH / 2, -halfD + wainD / 2));
    group.add(box(segW, wainH, wainD, wainMat, cx, wainH / 2, -halfD + wainD / 2));
    group.add(box(segW, baseH, baseD, baseMat, -cx, baseH / 2, -halfD + baseD / 2));
    group.add(box(segW, baseH, baseD, baseMat, cx, baseH / 2, -halfD + baseD / 2));
  }

  // 左右墙：整条
  for (const sign of [-1, 1]) {
    const x = sign * (halfW - wainD / 2);
    const bx = sign * (halfW - baseD / 2);
    const m1 = box(wainD, wainH, d, wainMat, x, wainH / 2, 0);
    const m2 = box(baseD, baseH, d, baseMat, bx, baseH / 2, 0);
    group.add(m1, m2);
  }
}

/* ---------------- 门 ---------------- */

function buildDoor(group) {
  const { d } = ROOM;
  const halfD = d / 2;

  const wallZ = -halfD;
  const frameMat = toon(PALETTE.trim);
  const slabMat = toon(PALETTE.door);
  const panelMat = toon(PALETTE.doorPanel);

  const doorW = DOOR.w;
  const doorH = DOOR.h;
  const gap = DOOR.gap;
  const jambW = 0.12;
  const frameDepth = 0.09;
  const frameZ = wallZ + frameDepth / 2 - 0.01;

  // 门框：左右门套 + 上横档
  const jambH = doorH + gap;
  group.add(box(jambW, jambH, frameDepth, frameMat, -(doorW / 2 + jambW / 2), jambH / 2, frameZ));
  group.add(box(jambW, jambH, frameDepth, frameMat, doorW / 2 + jambW / 2, jambH / 2, frameZ));
  group.add(
    box(doorW + jambW * 2, 0.13, frameDepth, frameMat, 0, jambH + 0.065, frameZ)
  );

  // 门板
  const slabDepth = 0.075;
  const slabZ = frameZ + 0.005;
  const slab = box(doorW - 0.02, doorH, slabDepth, slabMat, 0, gap + doorH / 2, slabZ);
  slab.castShadow = true;
  group.add(slab);

  const slabFront = slabZ + slabDepth / 2;

  // 两块凹板
  const panelW = doorW * 0.62;
  const panelDepth = 0.01;
  group.add(box(panelW, 0.86, panelDepth, panelMat, 0, 1.92, slabFront + panelDepth / 2 - 0.002));
  group.add(box(panelW, 0.92, panelDepth, panelMat, 0, 0.78, slabFront + panelDepth / 2 - 0.002));

  // 门把手
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.048, 20, 16), toon(PALETTE.knob));
  knob.position.set(doorW / 2 - 0.16, 1.06, slabFront + 0.045);
  knob.castShadow = true;
  group.add(knob);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, 0.05, 12),
    toon(PALETTE.knob)
  );
  stem.rotation.x = Math.PI / 2;
  stem.position.set(doorW / 2 - 0.16, 1.06, slabFront + 0.022);
  group.add(stem);

  // 门缝透出的光
  const slit = new THREE.Mesh(
    new THREE.PlaneGeometry(doorW - 0.05, gap * 1.1),
    new THREE.MeshBasicMaterial({ color: '#ffeecb' })
  );
  slit.position.set(0, gap / 2 + 0.002, slabFront + 0.001);
  group.add(slit);

  // 地板上的光斑
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 1.25),
    new THREE.MeshBasicMaterial({
      map: makeGlowTexture(),
      color: '#ffc98a',
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, 0.012, wallZ + 0.62);
  glow.renderOrder = 3;
  group.add(glow);

  // 门框内侧贴着地面的暖光（不要抬高，否则会照亮整扇门）
  const doorLight = new THREE.PointLight('#ffbf82', 0.45, 1.35, 2);
  doorLight.position.set(0, 0.05, wallZ + 0.3);
  group.add(doorLight);
}

/* ---------------- 陈设 ---------------- */

function buildProps(group) {
  const { d } = ROOM;
  const halfD = d / 2;
  const wallZ = -halfD;

  // 地毯
  const rugZ = wallZ + 2.3;
  const rugMat = toon(PALETTE.rug);
  const rug = new THREE.Mesh(new THREE.ShapeGeometry(roundedRect(3.6, 2.1, 0.24), 12), rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.008, rugZ);
  rug.receiveShadow = true;
  rug.renderOrder = 1;
  group.add(rug);

  const rugInner = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(3.22, 1.72, 0.18), 12),
    toon(PALETTE.rugInner)
  );
  rugInner.rotation.x = -Math.PI / 2;
  rugInner.position.set(0, 0.0095, rugZ);
  rugInner.receiveShadow = true;
  rugInner.renderOrder = 2;
  group.add(rugInner);

  // 盆栽（门左侧）
  const plant = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.28, 14), toon(PALETTE.pot));
  pot.position.y = 0.14;
  pot.castShadow = true;
  plant.add(pot);

  const leafGeo = new THREE.IcosahedronGeometry(0.15, 0);
  const leafMat = toon(PALETTE.leaf);
  const leafMatDark = toon(PALETTE.leafDark);
  const leafSpecs = [
    [0, 0.42, 0, 1.0, 1.5, 0.55],
    [0.17, 0.36, 0.06, 0.8, 1.2, 0.5],
    [-0.15, 0.37, -0.05, 0.75, 1.15, 0.5],
    [0.05, 0.52, -0.1, 0.65, 1.0, 0.45],
    [-0.06, 0.3, 0.14, 0.6, 0.9, 0.45],
  ];
  leafSpecs.forEach((s, i) => {
    const leaf = new THREE.Mesh(leafGeo, i % 2 ? leafMatDark : leafMat);
    leaf.position.set(s[0], s[1], s[2]);
    leaf.scale.set(s[3], s[4], s[5]);
    leaf.rotation.set(0.2 * i, 0.9 * i, 0.15 * i);
    leaf.castShadow = true;
    plant.add(leaf);
  });
  plant.position.set(-2.3, 0, wallZ + 0.62);
  group.add(plant);

  // 壁灯（门两侧）
  const sconceMat = toon(PALETTE.trim);
  const bulbMat = new THREE.MeshBasicMaterial({ color: '#ffe9c4' });
  for (const sign of [-1, 1]) {
    const x = sign * 1.28;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.14, 10), sconceMat);
    arm.rotation.x = Math.PI / 2;
    arm.position.set(x, 2.26, wallZ + 0.07);
    group.add(arm);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 12), bulbMat);
    bulb.position.set(x, 2.26, wallZ + 0.15);
    group.add(bulb);

    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.46),
      new THREE.MeshBasicMaterial({
        map: makeGlowTexture(),
        color: '#ffd79c',
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    halo.position.set(x, 2.26, wallZ + 0.16);
    halo.renderOrder = 4;
    group.add(halo);
  }

  // 后墙右侧挂画
  const artX = 2.35;
  const artY = 2.15;
  group.add(box(0.92, 1.12, 0.05, toon(PALETTE.trim), artX, artY, wallZ + 0.03));
  group.add(box(0.74, 0.94, 0.014, toon('#cfdcc9'), artX, artY, wallZ + 0.058));

  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), toon('#e0a086'));
  dot.position.set(artX + 0.03, artY + 0.04, wallZ + 0.067);
  group.add(dot);

  // 画下面一张窄边桌
  const tableW = 1.34;
  const tableH = 0.76;
  const tableD = 0.4;
  const tableX = artX;
  const tableZ = wallZ + tableD / 2 + 0.04;
  const woodMat = toon('#d9b892');

  const top = box(tableW, 0.05, tableD, woodMat, tableX, tableH, tableZ);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const leg = box(
        0.05,
        tableH,
        0.05,
        woodMat,
        tableX + sx * (tableW / 2 - 0.08),
        tableH / 2,
        tableZ + sz * (tableD / 2 - 0.07)
      );
      leg.castShadow = true;
      group.add(leg);
    }
  }

  // 桌上的小花瓶
  const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, 0.22, 12), toon('#8fa9c6'));
  vase.position.set(tableX - 0.4, tableH + 0.135, tableZ);
  vase.castShadow = true;
  group.add(vase);

  const sprig = new THREE.Mesh(new THREE.IcosahedronGeometry(0.09, 0), toon(PALETTE.leaf));
  sprig.position.set(tableX - 0.4, tableH + 0.31, tableZ);
  sprig.scale.set(1, 1.3, 0.8);
  sprig.castShadow = true;
  group.add(sprig);
}

/* ---------------- 灯光 ---------------- */

function buildLights(group) {
  const hemi = new THREE.HemisphereLight('#fff6ea', '#d8bda3', 0.28);
  group.add(hemi);

  const key = new THREE.DirectionalLight('#fff0d8', 1.55);
  key.position.set(-4.2, 7.4, 5.2);
  key.target.position.set(0, 0.9, -2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -3;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 26;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.025;
  group.add(key, key.target);

  // 补一盏很弱的冷光，避免暗部发闷
  const fill = new THREE.DirectionalLight('#e8f0ff', 0.18);
  fill.position.set(4, 3, 4);
  group.add(fill);
}

/* ---------------- 对外入口 ---------------- */

export function createRoom() {
  const group = new THREE.Group();
  buildShell(group);
  buildTrim(group);
  buildDoor(group);
  buildProps(group);
  buildLights(group);
  return group;
}
