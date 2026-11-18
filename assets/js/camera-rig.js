import * as THREE from '../../vendor/three.module.min.js';
import { ROOM, DOOR } from './room.js';

const D2R = Math.PI / 180;

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ===========================================================
   取景 + 手持抖动

   核心是一句几何关系：
     某个宽度要在画面里刚好占满，需要的距离 = (宽度/2) / tan(水平半视角)
   竖屏时水平视角很窄，算出来的距离近 → 门占满屏宽，墙壁被裁掉；
   横屏时水平视角宽，算出来的距离远 → 整个房间进画面。
   两个距离按画面比例平滑插值，所以在任何屏幕上都成立，
   不是靠 CSS 拉伸，也不是写死的断点。
   =========================================================== */

export class CameraRig {
  constructor(camera) {
    this.camera = camera;

    this.fov = 46;

    // 竖屏：门左右各留 7.5% 的画面宽度
    this.doorMargin = 1.15;
    // 横屏：房间左右各留 6%，再乘以下面的系数整体后撤
    this.roomMargin = 1.06;
    // 后撤系数：让天花板和地板都能进画面，房间才「成立」
    this.roomPullback = 1.12;

    // 竖屏取景：稍微俯一点，让门在画面里居中
    this.eyeYPortrait = 1.5;
    this.lookYPortrait = 1.3;
    // 横屏取景：抬高一点，把地板和天花板都带进画面
    this.eyeYLandscape = 2.0;
    this.lookYLandscape = 1.92;

    this.distance = 5;
    this.eyeY = 1.7;
    this.lookY = 1.6;

    this.pointer = { x: 0, y: 0 }; // 阻尼后的值
    this.pointerTarget = { x: 0, y: 0 };
    this.parallaxEnabled = true;
    this.reduceMotion = false;

    this._lookAt = new THREE.Vector3();
    this._shake = new THREE.Vector3();
  }

  /* 屏幕尺寸变化时重算取景 */
  resize(width, height) {
    const aspect = width / Math.max(1, height);

    this.camera.fov = this.fov;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    const tanV = Math.tan((this.fov * D2R) / 2);
    const tanH = tanV * aspect;

    // 门（含留白）刚好填满画面宽度所需的距离
    const distDoor = (DOOR.w * 0.5 * this.doorMargin) / tanH;
    // 整个房间宽度刚好填满画面所需的距离，再后撤一点露出天地
    const distRoom = ((ROOM.w * 0.5 * this.roomMargin) / tanH) * this.roomPullback;

    // 0 = 竖屏看门，1 = 横屏看房间
    const t = smoothstep(0.62, 1.22, aspect);

    const dist = THREE.MathUtils.lerp(distDoor, distRoom, t);
    // 相机不能退到墙外面去
    this.distance = THREE.MathUtils.clamp(dist, 3.55, 6.9);
    this.eyeY = THREE.MathUtils.lerp(this.eyeYPortrait, this.eyeYLandscape, t);
    this.lookY = THREE.MathUtils.lerp(this.lookYPortrait, this.lookYLandscape, t);

    // 竖屏不跟随鼠标，避免门左右晃动吃掉留白
    this.parallaxEnabled = aspect >= 1.15;
  }

  setPointer(nx, ny) {
    if (!this.parallaxEnabled) return;
    this.pointerTarget.x = nx;
    this.pointerTarget.y = ny;
  }

  /* 每帧调用 */
  update(dt, time) {
    const cam = this.camera;

    // 鼠标视差：很轻，只是让画面有一点呼吸感
    const damp = Math.min(1, dt * 3.2);
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * damp;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * damp;

    const px = this.parallaxEnabled ? -this.pointer.x * 0.055 : 0;
    const py = this.parallaxEnabled ? -this.pointer.y * 0.035 : 0;

    // 手持抖动：几个不同频率的正弦叠加，避免看出规律
    const s = this.reduceMotion ? 0 : 1;
    const shake = this._shake;

    if (s) {
      shake.x =
        (Math.sin(time * 0.73) * 0.5 +
          Math.sin(time * 1.61 + 1.3) * 0.3 +
          Math.sin(time * 2.94 + 0.4) * 0.16) *
        0.007;
      shake.y =
        (Math.sin(time * 0.61 + 2.1) * 0.5 +
          Math.sin(time * 1.37 + 0.7) * 0.3 +
          Math.sin(time * 3.11 + 1.9) * 0.16) *
        0.006 +
        // 极慢的呼吸起伏
        Math.sin(time * 0.28) * 0.009;
    } else {
      shake.set(0, 0, 0);
    }

    cam.position.set(px + shake.x, this.eyeY + py + shake.y, -ROOM.d / 2 + this.distance);

    this._lookAt.set(0, this.lookY, -ROOM.d / 2 + 0.1);
    cam.lookAt(this._lookAt);

    if (s) {
      // 角度抖动比位移更接近真实手持感
      const rx =
        (Math.sin(time * 0.67 + 0.9) * 0.5 + Math.sin(time * 1.53 + 2.4) * 0.3) * 0.0022;
      const ry =
        (Math.sin(time * 0.59 + 1.7) * 0.5 + Math.sin(time * 1.79 + 0.2) * 0.3) * 0.0022;
      const rz = (Math.sin(time * 0.41 + 0.6) * 0.6 + Math.sin(time * 1.11) * 0.25) * 0.0016;

      cam.rotateX(rx);
      cam.rotateY(ry);
      cam.rotateZ(rz);
    }
  }
}
