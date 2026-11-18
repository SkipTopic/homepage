/* ===========================================================
   启动器

   这一步的唯一职责：判断这台机器能不能扛住实时 3D。
   扛不住就直接显示静态图，绝不去创建 WebGL 上下文。

   背景：这台开发机是 Windows Server 2022，没有显卡驱动，
   GPU 是 SwiftShader（用 CPU 模拟）。之前在没有这道判断时，
   打开页面会把 4 个核全部吃满，整机卡死到任务管理器都打不开。
   所以这个文件不是「优化」，是「保命」。

   手动强制 3D（只在有真显卡的机器上用）：index.html?force3d=1
   =========================================================== */

const force3d = new URLSearchParams(location.search).has('force3d');

function probeGraphics() {
  let canvas;
  let gl;
  try {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;

    // failIfMajorPerformanceCaveat: 一旦会落到软件渲染，浏览器直接返回 null。
    // 这是 WebGL 规范里专门为这种场景留的开关。
    const options = {
      failIfMajorPerformanceCaveat: true,
      powerPreference: 'default',
      antialias: false,
      depth: false,
      stencil: false,
    };
    gl = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
  } catch (error) {
    return { ok: false, reason: '创建 WebGL 上下文报错：' + error.message };
  }

  if (!gl) {
    return { ok: false, reason: '没有可用的硬件加速 WebGL' };
  }

  let renderer = '';
  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (info) renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '';
  } catch (error) {
    renderer = '';
  }

  // 双保险：有些浏览器不会因为 failIfMajorPerformanceCaveat 就拒绝
  try {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch (error) {
    /* 忽略 */
  }

  if (/swiftshader|llvmpipe|softpipe|software|microsoft basic render/i.test(renderer)) {
    return { ok: false, reason: '软件渲染器：' + renderer };
  }

  return { ok: true, renderer };
}

function usePoster(reason, showHint) {
  document.documentElement.dataset.scene = 'ready';
  document.body.classList.add('is-static');
  const poster = document.getElementById('poster');
  if (poster) poster.hidden = false;
  if (showHint) {
    const box = document.getElementById('boot-error');
    if (box) box.hidden = false;
  }
  document.body.classList.add('ready');
  if (reason) console.info('[scene] 使用静态图 →', reason);
}

async function boot() {
  const result = force3d ? { ok: true, renderer: 'forced by url' } : probeGraphics();

  if (!result.ok) {
    usePoster(result.reason, false);
    return;
  }

  try {
    // 只有确认能跑 3D，才去下载那 655 KB 的 three.js
    const { startScene } = await import('./scene-app.js');
    startScene();
  } catch (error) {
    // 典型场景：直接双击 index.html，file:// 下 ES 模块被拦
    usePoster('3D 模块加载失败：' + error.message, true);
  }
}

boot();
