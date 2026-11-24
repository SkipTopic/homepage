/* 游戏库：往「游戏」分组下面插一个按钮，点开整库。
   封面路径按本脚本自身位置推算，原始页和站点版都能跑。 */
(function () {
  "use strict";

  var SELF = (document.currentScript && document.currentScript.src) || "";
  var BASE = SELF ? SELF.replace(/[^/]*$/, "") + "games/" : "";
  function lib() { return window.GAME_LIB || []; }
  function cfg() { return window.GAMELIB_CONF || {}; }
  var overlay = null;
  var opener = null;

  function el(t, c, x) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (x !== undefined) n.textContent = x;
    return n;
  }

  function findGroup() {
    var heads = document.querySelectorAll("h1,h2,h3,h4,h5");
    for (var i = 0; i < heads.length; i++) {
      if (heads[i].textContent.replace(/\s/g, "") === "游戏") {
        var box = heads[i].closest(".group, .gc-group, .news-block");
        if (box && box.querySelector(".item-list, .gc-list")) return box;
      }
    }
    return null;
  }

  /* 找不到「游戏」分组时，挂在漫画墙入口旁边，保证每页都有入口 */
  function buildFallback() {
    if (document.querySelector(".gp-open")) return;
    var wall = document.querySelector("[data-open-wall]");
    if (!wall || !wall.parentNode) return;
    var btn = el("button", "gp-open gp-open--slim");
    btn.type = "button";
    btn.appendChild(el("span", null, cfg().buttonText || "打开游戏库"));
    btn.appendChild(el("span", "gp-open-n", lib().length + " 款"));
    btn.addEventListener("click", function () { open(btn); });
    wall.parentNode.insertBefore(btn, wall.nextSibling);
  }

  function buildButton(group) {
    if (group.querySelector(".gp-open")) return;
    var existing = document.querySelector(".gp-open");
    if (existing) {
      /* 之前挂在漫画墙旁边的兜底按钮，挪进「游戏」分组 */
      existing.classList.remove("gp-open--slim");
      var list0 = group.querySelector(".item-list, .gc-list");
      if (list0 && list0.parentNode === group) group.insertBefore(existing, list0);
      else group.appendChild(existing);
      return;
    }
    var btn = el("button", "gp-open");
    btn.type = "button";
    btn.appendChild(el("span", null, cfg().buttonText || "打开游戏库"));
    btn.appendChild(el("span", "gp-open-n", lib().length + " 款"));
    btn.addEventListener("click", function () { open(btn); });
    var list = group.querySelector(".item-list, .gc-list");
    if (list && list.parentNode === group) group.insertBefore(btn, list);
    else group.appendChild(btn);
  }

  function buildOverlay() {
    var root = el("div", "gp-lib");
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "gp-lib-title");

    root.appendChild(el("div", "gp-lib-bg")).addEventListener("click", close);

    var sheet = el("div", "gp-lib-sheet");
    var head = el("header", "gp-lib-head");
    var left = el("div");
    left.appendChild(el("p", "gp-lib-kick", cfg().kicker || "STEAM LIBRARY"));
    var h = el("h2", "gp-lib-title", cfg().title || "游戏库");
    h.id = "gp-lib-title";
    left.appendChild(h);
    if (cfg().lede) left.appendChild(el("p", "gp-lib-lede", cfg().lede));
    head.appendChild(left);

    var tools = el("div", "gp-lib-tools");
    tools.appendChild(el("span", "gp-lib-count", lib().length + " TITLES"));
    var closeBtn = el("button", "gp-lib-close", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "关闭游戏库");
    closeBtn.addEventListener("click", close);
    tools.appendChild(closeBtn);
    head.appendChild(tools);
    sheet.appendChild(head);

    var search = document.createElement("input");
    search.className = "gp-lib-search";
    search.type = "search";
    search.placeholder = "搜中文名 / 类型";
    sheet.appendChild(search);

    var grid = el("div", "gp-lib-grid");
    lib().forEach(function (g, i) {
      var a = el("a", "gp-t");
      a.href = "https://store.steampowered.com/app/" + g.id + "/";
      a.target = "_blank";
      a.rel = "noopener";
      a.style.setProperty("--i", i % 24);
      a.title = g.zh + "（" + g.h + "）";
      var img = document.createElement("img");
      img.src = BASE + g.id + ".webp";
      img.alt = g.zh + " 封面";
      img.loading = "lazy";
      a.appendChild(img);
      a.appendChild(el("b", null, g.zh));
      a.appendChild(el("i", null, g.h));
      a.dataset.name = g.zh + " " + (g.g || []).join(" ");
      grid.appendChild(a);
    });
    sheet.appendChild(grid);

    var foot = el("footer", "gp-lib-foot",
      cfg().foot || "封面来自 Steam · 点开去商店页 · 桌面端可用搜索框筛选");
    sheet.appendChild(foot);
    root.appendChild(sheet);

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      Array.prototype.forEach.call(grid.children, function (tile) {
        var hit = !q || tile.dataset.name.toLowerCase().indexOf(q) >= 0;
        tile.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      var empty = grid.querySelector(".gp-empty");
      if (!shown) {
        if (!empty) grid.appendChild(el("div", "gp-empty", "没有匹配的游戏"));
      } else if (empty) empty.remove();
    });

    document.body.appendChild(root);
    return root;
  }

  function open(trigger) {
    if (!overlay) overlay = buildOverlay();
    /* 每次打开把格子的顺序重排一次，不让某张封面永远在第一格 */
    var grid = overlay.querySelector(".gp-lib-grid");
    if (grid && grid.children.length > 1) {
      var items = Array.prototype.slice.call(grid.children);
      for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = items[i]; items[i] = items[j]; items[j] = t;
      }
      items.forEach(function (node) { grid.appendChild(node); });
    }
    opener = trigger || null;
    overlay.hidden = false;
    document.documentElement.classList.add("gp-lock");
    var closeBtn = overlay.querySelector(".gp-lib-close");
    if (closeBtn) closeBtn.focus();
    requestAnimationFrame(function () { overlay.classList.add("is-in"); });
  }

  function close() {
    if (!overlay) return;
    overlay.hidden = true;
    overlay.classList.remove("is-in");
    document.documentElement.classList.remove("gp-lock");
    if (opener && opener.focus) opener.focus();
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && !overlay.hidden) close();
  });

  function boot() {
    var group = findGroup();
    if (group) { buildButton(group); return; }
    buildFallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* 分组是 JS 渲染的：晚一拍再兜一次，并且盯着 DOM 变化（布局页的分组要翻版才出现） */
  window.addEventListener("load", function () { setTimeout(boot, 60); });
  if (window.MutationObserver) {
    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () { pending = false; boot(); }, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  window.GAMELIB = { open: function () { open(null); }, close: close, count: lib().length };
})();
