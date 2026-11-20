(function () {
  "use strict";

  var data = window.SITE_DATA || {};
  var quotes = Array.isArray(data.quotes) ? data.quotes : [];
  var bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];

  // 导航四项点开后显示哪个收藏夹：改这里即可换对应关系
  var NAV_MAP = {
    philosophy: "philosophy",
    media: "media",
    visual: "visual",
    about: "about"
  };

  var bookmarksEl = document.getElementById("bookmarks");
  var panelsEl = document.getElementById("bookmark-panels");
  var quoteLayer = document.getElementById("quote-layer");
  var heroEl = document.getElementById("hero");
  var doorEl = document.querySelector(".door");
  var toggleBtn = document.getElementById("quote-toggle");
  var toastEl = document.getElementById("toast");
  var openPanelId = null;
  var toastTimer = null;
  var pulseTimer = null;
  var panelState = {};

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
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

  /* ---- 收藏夹面板：0fr → 1fr 的高度过渡 ---- */

  function setPanelOpen(id, shouldOpen) {
    var state = panelState[id];
    if (!state) return;
    state.open = shouldOpen;
    state.button.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      state.slot.hidden = false;
      // 等元素从 display:none 变为可渲染后，再开启过渡
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          state.slot.classList.add("is-open");
        });
      });
      openPanelId = id;
      return;
    }

    state.slot.classList.remove("is-open");
    window.setTimeout(function () {
      if (!state.open) state.slot.hidden = true;
    }, 360);
    if (openPanelId === id) openPanelId = null;
  }

  function closeAllPanels() {
    Object.keys(panelState).forEach(function (id) {
      setPanelOpen(id, false);
    });
    openPanelId = null;
  }

  function openPanel(id) {
    if (!panelState[id]) return;
    Object.keys(panelState).forEach(function (key) {
      setPanelOpen(key, key === id);
    });
    openPanelId = id;
  }

  function togglePanel(id) {
    if (openPanelId === id) {
      closeAllPanels();
    } else {
      openPanel(id);
    }
  }

  function buildBookmarkItem(item) {
    var link = el("a", "bookmark-item");
    var hasHref = typeof item.href === "string" && item.href.length > 0;
    link.href = hasHref ? item.href : "#";
    if (!hasHref) {
      link.dataset.soon = "true";
      link.title = "还在整理";
    }

    var row = el("span", "bookmark-title-row");
    row.appendChild(el("span", "bookmark-title", item.title || "未命名"));
    if (item.tag) row.appendChild(el("span", "bookmark-tag", item.tag));
    link.appendChild(row);

    if (item.note) {
      link.appendChild(el("p", "bookmark-note", item.note));
    }

    if (!hasHref) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        showToast("「" + (item.title || "这篇") + "」还在整理。");
      });
    }

    return link;
  }

  function buildPanel(group, button) {
    var panel = el("section", "bookmark-panel");
    panel.id = "panel-" + group.id;
    panel.setAttribute("aria-labelledby", button.id);

    var head = el("div", "panel-head");
    var heading = el("div", "panel-heading");
    heading.appendChild(el("h2", "panel-title", group.label + " / " + group.items.length));
    if (group.note) heading.appendChild(el("p", "panel-note", group.note));
    head.appendChild(heading);

    var close = el("button", "panel-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "收起" + group.label);
    close.addEventListener("click", closeAllPanels);
    head.appendChild(close);
    panel.appendChild(head);

    var grid = el("div", "panel-grid");
    group.items.forEach(function (item) {
      grid.appendChild(buildBookmarkItem(item));
    });
    panel.appendChild(grid);

    // 外面再包一层 slot，负责 0fr → 1fr 的展开动画
    var slot = el("div", "panel-slot");
    slot.hidden = true;
    slot.appendChild(panel);
    return slot;
  }

  function renderBookmarks() {
    if (!bookmarksEl || !panelsEl) return;

    bookmarks.forEach(function (group) {
      if (!group || !group.id || !Array.isArray(group.items)) return;

      var button = el("button", "bookmark");
      button.type = "button";
      button.id = "bookmark-" + group.id;
      button.dataset.group = group.id;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", "panel-" + group.id);
      button.title = "展开「" + group.label + "」";

      button.appendChild(el("span", "folder"));
      button.appendChild(el("span", "bookmark-label", group.label));
      button.appendChild(el("span", "bookmark-count", String(group.items.length)));

      button.addEventListener("click", function () {
        togglePanel(group.id);
      });

      bookmarksEl.appendChild(button);

      var slot = buildPanel(group, button);
      panelsEl.appendChild(slot);
      panelState[group.id] = { button: button, slot: slot, open: false };
    });
  }

  /* ---- 门后的名言：两列、随机、少数条目放大 ---- */

  function buildQuoteGroup(items) {
    var group = el("div", "quote-group");
    items.forEach(function (quote) {
      var major = Math.random() < 0.25 ? " is-major" : "";
      var figure = el("figure", "quote-item" + major);
      var text = el("blockquote", null, quote.text || "");
      figure.appendChild(text);
      if (quote.author) {
        figure.appendChild(el("figcaption", "quote-author", quote.author));
      }
      group.appendChild(figure);
    });
    return group;
  }

  function renderQuotes() {
    if (!quoteLayer || quotes.length === 0) return;

    var columnCount = 2;
    var perColumn = Math.min(16, Math.max(6, Math.ceil(quotes.length / columnCount)));
    var master = shuffle(quotes);

    for (var i = 0; i < columnCount; i += 1) {
      var column = el("div", "quote-col");
      if (i % 2 === 1) column.classList.add("is-down");

      var items = master.slice(i * perColumn, (i + 1) * perColumn);
      if (items.length < 2) items = shuffle(quotes).slice(0, Math.min(6, quotes.length));

      var track = el("div", "quote-track");
      var group = buildQuoteGroup(items);
      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(group);
      track.appendChild(clone);

      var duration = 46 + Math.random() * 38;
      track.style.setProperty("--duration", duration.toFixed(1) + "s");
      track.style.animationDelay = "-" + (Math.random() * duration).toFixed(1) + "s";

      column.appendChild(track);
      quoteLayer.appendChild(column);
    }
  }

  /* ---- 门的反应：有光、有纱、锁孔透亮，但门永远不开 ---- */

  function pulseDoor() {
    if (!heroEl) return;
    heroEl.classList.add("is-pulse");
    window.clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(function () {
      heroEl.classList.remove("is-pulse");
    }, 1700);
  }

  /* ---- 字幕开关：无限滚动超过 5 秒必须有暂停控制 ---- */

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function syncToggle() {
    if (!toggleBtn || !quoteLayer) return;
    var paused = quoteLayer.classList.contains("is-paused");
    toggleBtn.setAttribute("aria-pressed", String(paused));
    toggleBtn.setAttribute("aria-label", paused ? "播放名言滚动" : "暂停名言滚动");
    var icon = toggleBtn.querySelector(".footer-toggle-icon");
    if (icon) icon.textContent = paused ? "▶" : "❚❚";
  }

  function setupNav() {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-link"), function (button) {
      button.addEventListener("click", function () {
        var id = NAV_MAP[button.dataset.open] || button.dataset.open;
        if (panelState[id]) openPanel(id);
      });
    });
  }

  function setupKeyboard() {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && openPanelId) closeAllPanels();
    });
  }

  function setYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    renderBookmarks();
    renderQuotes();
    setupNav();
    setupKeyboard();
    setYear();

    if (doorEl) doorEl.addEventListener("click", pulseDoor);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        if (!quoteLayer) return;
        quoteLayer.classList.toggle("is-paused");
        syncToggle();
      });
      syncToggle();
      if (motionQuery.matches) toggleBtn.hidden = true;
      // 系统中途开启减少动效时也要跟上
      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", function (event) {
          toggleBtn.hidden = event.matches;
          if (event.matches && quoteLayer) {
            quoteLayer.classList.remove("is-paused");
            syncToggle();
          }
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
