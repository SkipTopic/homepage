/*
 * 书影音 · 漫画墙（v. RISO Ⅰ，2026-11-22；2026-11-23 深夜重构为双形态）
 * - 数据：assets/js/manga-data.js（compress_covers.py 自动生成，52 本，3:4 裁齐）
 * - 双形态同一套骨架：
 *   ① 嵌入形态（主）：各布局站把 .manga-wall.is-inline 挂进页面内容序列
 *      （翻版/到站/翻帧/揭海报/滚动自然到达），layout.js 调 __renderMangaInto(root)
 *      渲染一次，再用 __replayMangaAt(root) 在到达时播入场动画。
 *   ② 全屏 overlay（备用）：右下角小圆钮 / 原入口仍可 __openMangaWall 砸出整版墙。
 * - 顺序：每次渲染都 Fisher-Yates 洗牌（站主要求：进站顺序随机）；
 *   「重印 ↻」只重放动画不重洗。
 * - 入场只 transform/opacity；reduced-motion 直接最终态（is-animating 不加）。
 * - 点封面：现在是「还在整理」提示，条目有 href 后自动变真链接。
 */
(function () {
  "use strict";

  var manga = Array.isArray(window.MANGA_DATA) ? window.MANGA_DATA : [];
  var wallEl = document.getElementById("manga-wall");
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

  /* ---------- 封面卡片（洗牌后渲染进任意 .mw-grid） ---------- */

  function buildCardsInto(grid) {
    if (!grid) return;
    grid.textContent = "";
    var frag = document.createDocumentFragment();

    shuffle(manga.slice()).forEach(function (m, i) {
      var card = el("button", "mw-card");
      card.type = "button";
      // 确定性的错落：同一次入场每张的档期/微旋都固定
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

    grid.appendChild(frag);
  }

  /* ---------- 墙脚：读记入口（取 data.js 书影音组的条目） ---------- */

  function buildFootLinksInto(footLinks) {
    if (!footLinks) return;
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
      footLinks.appendChild(link);
    });
  }

  /* ---------- 入场动画：is-animating 加在 root（overlay 或 inline 同规则） ---------- */

  function replayOn(root) {
    if (!root) return;
    root.classList.remove("is-animating");
    void root.offsetWidth; // 重启动画
    if (!motionQuery.matches) root.classList.add("is-animating");
    scheduleAnimCleanup(root);
  }

  function scheduleAnimCleanup(root) {
    window.clearTimeout(animTimer);
    if (!root.classList.contains("is-animating")) return;
    // 52 张 × 20ms 档期 + 入场 ≤900ms + 富余
    animTimer = window.setTimeout(function () {
      root.classList.remove("is-animating");
    }, 52 * 20 + 9 * 7 + 900 + 300);
  }

  /* ---------- 渲染进任意容器（overlay 与 inline 共用） ---------- */

  function renderInto(root) {
    buildCardsInto(root.querySelector(".mw-grid"));
    buildFootLinksInto(root.querySelector(".mw-foot-links"));
    var replayBtn = root.querySelector(".mw-replay");
    if (replayBtn && !replayBtn.dataset.wired) {
      replayBtn.dataset.wired = "1";
      replayBtn.addEventListener("click", function () {
        replayOn(root);
      });
    }
  }

  /* ---------- 嵌入形态入口（各站 layout.js 调） ---------- */

  window.__renderMangaInto = function (root) {
    if (!root || root.dataset.built) return root;
    root.dataset.built = "1";
    renderInto(root);
    return root;
  };

  // 到达该版/帧/页/展厅时调用：重放一次入场动画（reduced-motion 下无动画）
  window.__replayMangaAt = replayOn;

  /* ---------- 全屏 overlay（备用入口） ---------- */

  function openWall(fromEl) {
    if (!wallEl) return;
    opener = fromEl || null;

    if (!wallEl.dataset.built) {
      wallEl.dataset.built = "1";
      renderInto(wallEl);
    }

    window.clearTimeout(hideTimer); // 关墙动画还没走完就重开时，别让旧定时器把墙藏掉
    document.body.classList.add("mw-locked");
    wallEl.hidden = false;
    wallEl.classList.remove("is-open", "is-animating");
    void wallEl.offsetWidth;
    wallEl.classList.add("is-open");
    if (!motionQuery.matches) wallEl.classList.add("is-animating");
    var sheet = wallEl.querySelector(".mw-sheet");
    if (sheet) sheet.scrollTop = 0;
    scheduleAnimCleanup(wallEl);

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

  window.__openMangaWall = openWall;
  window.__closeMangaWall = closeWall;

  function init() {
    if (!wallEl) return;

    Array.prototype.forEach.call(wallEl.querySelectorAll("[data-mw-close]"), function (btn) {
      btn.addEventListener("click", closeWall);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
