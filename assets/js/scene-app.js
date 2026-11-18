import * as THREE from '../../vendor/three.module.min.js';
import { createRoom } from './room.js';
import { CameraRig } from './camera-rig.js';

/* ===========================================================
   3D 场景本体

   画质参数现在全部压在「先能跑」这一档：
   关抗锯齿、像素比 1、阴影 1024、帧率锁 30。
   等确认稳定后再逐项往回加，见交接文档「待办」。
   =========================================================== */

const TARGET_FPS = 30;

export function startScene() {
  const canvas = document.getElementById('scene');

  // 万一兜底逻辑已经把静态图和提示亮出来了，这里收回去
  document.body.classList.remove('is-static');
  document.getElementById('poster')?.setAttribute('hidden', '');
  document.getElementById('boot-hint')?.setAttribute('hidden', '');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'default',
      stencil: false,
    });
  } catch (error) {
    document.body.classList.add('is-static');
    const poster = document.getElementById('poster');
    if (poster) poster.hidden = false;
    document.body.classList.add('ready');
    document.documentElement.dataset.scene = 'ready';
    console.info('[scene] WebGLRenderer 创建失败，退回静态图', error);
    return;
  }

  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e7d8c7');
  scene.add(createRoom());

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);
  const rig = new CameraRig(camera);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  rig.reduceMotion = reduceMotion.matches;
  reduceMotion.addEventListener?.('change', (e) => {
    rig.reduceMotion = e.matches;
  });

  /* ---------- 尺寸 ---------- */

  let resizeQueued = false;

  function resize() {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    rig.resize(width, height);
  }

  function requestResize() {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      resize();
    });
  }

  resize();
  window.addEventListener('resize', requestResize);
  window.addEventListener('orientationchange', requestResize);
  window.visualViewport?.addEventListener('resize', requestResize);

  /* ---------- 鼠标视差（竖屏自动关掉） ---------- */

  window.addEventListener(
    'pointermove',
    (event) => {
      rig.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1
      );
    },
    { passive: true }
  );

  /* ---------- 主循环 ---------- */

  const clock = new THREE.Clock();
  const frameInterval = 1000 / TARGET_FPS;
  let last = 0;
  let running = true;

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);

    if (now - last < frameInterval) return;
    last = now;

    const dt = Math.min(clock.getDelta(), 0.1);
    rig.update(dt, clock.elapsedTime);
    renderer.render(scene, camera);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      clock.getDelta();
      last = 0;
      requestAnimationFrame(frame);
    }
  });

  requestAnimationFrame((now) => {
    last = now;
    frame(now);
  });

  requestAnimationFrame(() => {
    document.documentElement.dataset.scene = 'ready';
    document.body.classList.add('ready');
  });
}
