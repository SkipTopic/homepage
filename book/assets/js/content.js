/*
 * content.js — 十布局共用内容层（修改UI界面，2026-11-23）
 * 所有布局共用：
 *  - renderGroupBlock(id, opts)  把 data.js 的板块渲染成 .gc-group（标题+计数+说明+条目）
 *  - renderItems(id, opts)       只要条目列表
 *  - wireWalls()                 接线所有 [data-open-wall] → 漫画墙
 *  - installWallGuard()          墙开着时吞掉键盘翻页、Esc 只关墙
 *  - startTicker(el)             字幕跑马灯：名言逐条淡入淡出（每 7s）
 * 条目点击：有 href 跳转，没有则 toast「还在整理」（和正式站一致）。
 * 依赖：data.js / manga-data.js / manga.js（__openMangaWall）/ #toast。
 */
(function () {
  "use strict";

  var data = window.SITE_DATA || {};
  var bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
  var quotes = Array.isArray(data.quotes) ? data.quotes : [];
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  var tickerTimer = null;
  var tickerIdx = -1;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  /* 「千万不要点我」彩蛋：连点四下才放行。中途停手 15 秒就忘掉之前点过什么。 */
  var EGG_STEPS = [
    "这里什么都没有。",
    "别点了。",
    "真的别点了。",
    "好吧，既然你这么想看，我就给你看。"
  ];
  var EGG_URL = "https://www.bilibili.com/video/BV1GJ411x7h7/";
  var eggCount = 0;
  var eggTimer = null;

  function playSiteEgg() {
    var step = Math.min(eggCount, EGG_STEPS.length - 1);
    showToast(EGG_STEPS[step]);
    eggCount += 1;
    window.clearTimeout(eggTimer);
    if (eggCount >= EGG_STEPS.length) {
      eggTimer = window.setTimeout(function () {
        window.location.href = EGG_URL;
      }, 1400);
    } else {
      eggTimer = window.setTimeout(function () { eggCount = 0; }, 15000);
    }
  }

  function groupById(id) {
    var found = null;
    bookmarks.forEach(function (g) {
      if (g && g.id === id) found = g;
    });
    return found;
  }

  function makeItemLink(item) {
    var hasHref = typeof item.href === "string" && item.href.length > 0;
    var link = el(hasHref ? "a" : "button", "gc-item");
    if (hasHref) {
      link.href = item.href;
      /* 站外链接新开一页，别把站点顶掉 */
      if (/^https?:/i.test(item.href)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } else link.type = "button";

    var row = el("span", "gc-title-row");
    row.appendChild(el("span", "gc-title", item.title || "未命名"));
    if (item.tag) row.appendChild(el("span", "gc-tag", item.tag));
    link.appendChild(row);
    if (item.note) link.appendChild(el("span", "gc-note", item.note));

    if (item.egg === "site") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        playSiteEgg();
      });
      return link;
    }

    if (!hasHref) {
      link.addEventListener("click", function () {
        showToast("「" + (item.title || "这篇") + "」还在整理。");
      });
    }
    return link;
  }

  function makeWallButton(count) {
    var btn = el("button", "wall-open");
    btn.type = "button";
    btn.setAttribute("data-open-wall", "");
    btn.appendChild(el("span", null, "打开漫画墙"));
    btn.appendChild(el("span", "wall-open-count", count + " VOLS"));
    return btn;
  }

  /* 板块整块：标题 + 计数 + 说明 + 条目；media 组自动带墙按钮 */
  function renderGroupBlock(id, opts) {
    opts = opts || {};
    var group = groupById(id);
    if (!group) return null;
    var block = el("div", "gc-group" + (opts.blockClass ? " " + opts.blockClass : ""));
    if (opts.noHead) {
      block.appendChild(renderItems(id, opts));
      return block;
    }
    var head = el("div", "gc-head");
    head.appendChild(el("h3", "gc-group-title", group.label));
    head.appendChild(el("span", "gc-count", group.items.length + " 篇"));
    block.appendChild(head);
    if (group.note && !opts.noNote) block.appendChild(el("p", "gc-lede", group.note));
    if (group.id === "media" && !opts.noWallButton) {
      var mangaCount = (window.MANGA_DATA && window.MANGA_DATA.length) || 52;
      block.appendChild(makeWallButton(mangaCount));
    }
    block.appendChild(renderItems(id, opts));
    return block;
  }

  function renderItems(id, opts) {
    opts = opts || {};
    var group = groupById(id);
    var list = el("ul", "gc-list");
    if (!group) return list;
    group.items.forEach(function (item) {
      var li = el("li", "gc-row");
      li.appendChild(makeItemLink(item));
      list.appendChild(li);
    });
    return list;
  }

  /* 接线漫画墙按钮 + Esc 守卫 */
  function wireWalls() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-open-wall]") : null;
      if (t && typeof window.__openMangaWall === "function") {
        window.__openMangaWall(t);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!document.body.classList.contains("mw-locked")) return;
      if (e.key === "Escape" && typeof window.__closeMangaWall === "function") {
        window.__closeMangaWall();
        return;
      }
      // 墙开着时吞掉布局自己的翻页键
      e.stopPropagation();
    }, true); // 捕获阶段先于布局自己的键盘处理
  }

  /* 字幕跑马灯：名言逐条淡入淡出 */
  function startTicker(el2) {
    if (!el2 || quotes.length === 0) return;
    function next() {
      tickerIdx = (tickerIdx + 1) % quotes.length;
      var q = quotes[tickerIdx];
      el2.classList.add("is-fading");
      window.setTimeout(function () {
        el2.textContent = "“" + (q.text || "") + "”" + (q.author ? " —— " + q.author : "");
        el2.classList.remove("is-fading");
      }, 380);
    }
    next();
    tickerTimer = window.setInterval(next, 7000);
  }

  window.LAYOUT = {
    el: el,
    showToast: showToast,
    groupById: groupById,
    renderGroupBlock: renderGroupBlock,
    renderItems: renderItems,
    wireWalls: wireWalls,
    startTicker: startTicker,
    quotes: quotes
  };
})();
