/*
 * 书影音 · 漫画墙（v. RISO Ⅰ，2026-11-22）
 * - 数据：assets/js/manga-data.js（compress_covers.py 自动生成，52 本）
 * - 打开路径：柜子「看与玩」抽屉的书脊「书影音」、喜欢页的「打开漫画墙」按钮
 *   （main.js 里挂到 window.__openMangaWall）。
 * - 入场：封面按序从天上坠进格子，落地闪一次粉色套印；
 *   reduced-motion 时直接显示最终态（is-animating 不加）。
 * - 点封面/读记条目：现在是「还在整理」提示，条目有 href 后自动变真链接。
 */
(function () {
  "use strict";

  var manga = Array.isArray(window.MANGA_DATA) ? window.MANGA_DATA : [];
  var wallEl = document.getElementById("manga-wall");
  var gridEl = document.getElementById("mw-grid");
  var sheetEl = wallEl ? wallEl.querySelector(".mw-sheet") : null;
  var footLinksEl = document.getElementById("mw-foot-links");
  var toastEl = document.getElementById("toast");
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var closeTimer = null;
  var animTimer = null;
  var hideTimer = null;
  var opener = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i];
      list[i] = list[j];
      list[j] = t;
    }
    return list;
  }

  function pad(no) {
    return no < 10 ? "0" + no : String(no);
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  /* ---------- 封面格子 ---------- */

  function buildCards() {
    if (!gridEl) return;
    gridEl.textContent = "";
    var frag = document.createDocumentFragment();

    shuffle(manga.slice()).forEach(function (m, i) {
      var card = el("button", "mw-card");
      card.type = "button";
      // 确定性的错落：同一次入场每张的档期/微旋都固定，重印时节奏一致
      card.style.setProperty("--mw-i", String(i));
      card.style.setProperty("--mw-j", String((i * 7) % 9));
      card.style.setProperty("--mw-rot", (((i * 37) % 11) - 5) * 0.6 + "deg");
      card.setAttribute(
        "aria-label",
        "第 " + m.no + " 本 · " + (m.title || "") + (m.author ? " · " + m.author : "")
      );

      var cover = el("span", "mw-cover");
      cover.style.setProperty("--mw-ar", m.w + " / " + m.h);
      var img = document.createElement("img");
      img.src = m.file;
      img.alt = (m.title || "") + " 封面";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = m.w;
      img.height = m.h;
      cover.appendChild(img);
      card.appendChild(cover);

      var label = el("span", "mw-label");
      label.appendChild(el("span", "mw-label-no", pad(m.no)));
      label.appendChild(el("span", "mw-label-title", m.title || "未命名"));
      card.appendChild(label);

      card.addEventListener("click", function () {
        showToast("「" + (m.title || "这本") + "」的读记还在整理。");
      });

      frag.appendChild(card);
    });

    gridEl.appendChild(frag);
  }

  /* ---------- 报头侧的「重印」/关闭 ---------- */

  function replayDrop() {
    if (!wallEl) return;
    wallEl.classList.remove("is-animating");
    void wallEl.offsetWidth; // 重启动画
    if (!motionQuery.matches) wallEl.classList.add("is-animating");
    scheduleAnimCleanup();
  }

  function scheduleAnimCleanup() {
    window.clearTimeout(animTimer);
    if (!wallEl || !wallEl.classList.contains("is-animating")) return;
    // 52 张 × 20ms 档期 + 720ms 坠落 + 富余
    animTimer = window.setTimeout(function () {
      wallEl.classList.remove("is-animating");
    }, 52 * 20 + 9 * 7 + 720 + 300);
  }

  /* ---------- 开 / 关 ---------- */

  function openWall(fromEl) {
    if (!wallEl) return;
    opener = fromEl || null;

    if (gridEl) buildCards(); // 每次开墙都重洗重排（站主要求：进站顺序随机）

    window.clearTimeout(hideTimer); // 关墙动画还没走完就重开时，别让旧定时器把墙藏掉
    document.body.classList.add("mw-locked");
    wallEl.hidden = false;
    wallEl.classList.remove("is-open", "is-animating");
    void wallEl.offsetWidth;
    wallEl.classList.add("is-open");
    if (!motionQuery.matches) wallEl.classList.add("is-animating");
    if (sheetEl) sheetEl.scrollTop = 0;
    scheduleAnimCleanup();

    var closeBtn = wallEl.querySelector(".mw-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeWall() {
    if (!wallEl || wallEl.hidden) return;
    document.body.classList.remove("mw-locked");
    wallEl.classList.remove("is-open", "is-animating");
    window.clearTimeout(animTimer);
    hideTimer = window.setTimeout(function () {
      wallEl.hidden = true;
    }, 360);
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  /* ---------- 墙脚：读记入口（取 data.js 书影音组的条目） ---------- */

  function buildFootLinks() {
    if (!footLinksEl) return;
    var groups = (window.SITE_DATA && Array.isArray(window.SITE_DATA.bookmarks))
      ? window.SITE_DATA.bookmarks
      : [];
    var media = null;
    groups.forEach(function (g) {
      if (g && g.id === "media") media = g;
    });
    if (!media || !Array.isArray(media.items)) return;

    media.items.forEach(function (item) {
      var link = el("button", "mw-foot-link");
      link.type = "button";
      link.appendChild(el("span", null, item.title || "未命名"));
      if (item.tag) link.appendChild(el("span", "mw-foot-tag", item.tag));
      link.addEventListener("click", function () {
        if (typeof item.href === "string" && item.href.length > 0) {
          window.location.href = item.href;
        } else {
          showToast("「" + (item.title || "这篇") + "」还在整理。");
        }
      });
      footLinksEl.appendChild(link);
    });
  }

  function init() {
    if (!wallEl) return;
    buildFootLinks();

    Array.prototype.forEach.call(wallEl.querySelectorAll("[data-mw-close]"), function (btn) {
      btn.addEventListener("click", closeWall);
    });

    var replayBtn = wallEl.querySelector(".mw-replay");
    if (replayBtn) replayBtn.addEventListener("click", replayDrop);
  }

  // 先挂到 window 再等 DOMContentLoaded：main.js 的 init 比 manga.js 先跑，
  // 「打开漫画墙」按钮的判断要在那一刻就能看到这两个入口。
  window.__openMangaWall = openWall;
  window.__closeMangaWall = closeWall;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
