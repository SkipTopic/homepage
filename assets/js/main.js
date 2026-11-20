(function () {
  "use strict";

  var data = window.SITE_DATA || {};
  var quotes = Array.isArray(data.quotes) ? data.quotes : [];
  var bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
  var cabinets = Array.isArray(data.cabinets) ? data.cabinets : [];
  var groupById = {};
  bookmarks.forEach(function (g) {
    if (g && g.id) groupById[g.id] = g;
  });

  var snap = document.getElementById("snap");
  var quoteLayer = document.getElementById("quote-layer");
  var hallEl = document.getElementById("sec-hall");
  var doorEl = document.querySelector(".door");
  var indicatorEl = document.getElementById("page-indicator");
  var wipeEl = document.getElementById("wipe");
  var cabinetEl = document.getElementById("cabinet");
  var overlayEl = document.getElementById("directory");
  var overlayTitle = document.getElementById("directory-title");
  var overlayGrid = document.getElementById("directory-grid");
  var toggleBtn = document.getElementById("quote-toggle");
  var toastEl = document.getElementById("toast");
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  var sections = Array.prototype.slice.call(document.querySelectorAll(".sec"));
  var activeIndex = -1;
  var navLock = false;
  var openDrawerId = null;
  var openPanelId = null; // 指当前目录浮层对应的板块
  var toastTimer = null;
  var pulseTimer = null;
  var wheelAcc = 0;
  var overlayOpener = null;

  /* ---------- 工具 ---------- */

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

  function itemLink(item) {
    var hasHref = typeof item.href === "string" && item.href.length > 0;
    var link = el(hasHref ? "a" : "button", "item-link");
    if (hasHref) link.href = item.href;
    else link.type = "button";

    var row = el("span", "item-title-row");
    row.appendChild(el("span", "item-title", item.title || "未命名"));
    if (item.tag) row.appendChild(el("span", "item-tag", item.tag));
    link.appendChild(row);
    if (item.note) link.appendChild(el("span", "item-note", item.note));

    if (!hasHref) {
      link.addEventListener("click", function () {
        showToast("「" + (item.title || "这篇") + "」还在整理。");
      });
    }
    return link;
  }

  /* ---------- 各页内容：按 data-groups 从数据渲染 ---------- */

  function renderGroupLists() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-groups]"), function (body) {
      var ids = (body.getAttribute("data-groups") || "").split(",");
      ids.forEach(function (id) {
        var group = groupById[id.trim()];
        if (!group || !Array.isArray(group.items)) return;

        var block = el("div", "group");
        block.style.setProperty("--i", Array.prototype.indexOf.call(body.children, block));

        var head = el("div", "group-head");
        var h = el("h3", "group-title", group.label);
        h.id = "group-" + group.id;
        head.appendChild(h);
        head.appendChild(el("span", "group-count", group.items.length + " 篇"));
        block.appendChild(head);

        if (group.note) block.appendChild(el("p", "group-note", group.note));

        var list = el("ul", "item-list");
        list.setAttribute("aria-labelledby", h.id);
        group.items.forEach(function (item) {
          var li = el("li", "item-row");
          li.appendChild(itemLink(item));
          list.appendChild(li);
        });
        block.appendChild(list);

        body.appendChild(block);
      });
    });
  }

  /* ---------- 页码指示 ---------- */

  function renderIndicator() {
    if (!indicatorEl) return;
    sections.forEach(function (sec, i) {
      var b = el("button", null, "0" + (i + 1));
      b.type = "button";
      b.setAttribute("aria-label", "跳到第 " + (i + 1) + " 页 · " + (sec.dataset.title || ""));
      b.addEventListener("click", function () {
        goTo(i);
      });
      indicatorEl.appendChild(b);
    });
  }

  function setActive(index, first) {
    if (index === activeIndex) return;
    var prev = activeIndex;
    activeIndex = index;

    sections.forEach(function (sec, i) {
      sec.classList.toggle("is-active", i === index);
    });
    Array.prototype.forEach.call(indicatorEl.children, function (b, i) {
      b.classList.toggle("is-current", i === index);
      b.setAttribute("aria-current", i === index ? "true" : "false");
    });

    // 门厅不在视野时，名言静止（省 CPU）
    if (quoteLayer) quoteLayer.classList.toggle("is-idle", index !== 0);

    // 翻页转场：一张纸掠过
    if (!first && prev !== -1 && wipeEl && !motionQuery.matches) {
      wipeEl.classList.remove("is-wiping");
      void wipeEl.offsetWidth; // 重启动画
      wipeEl.classList.add("is-wiping");
    }
  }

  function goTo(index) {
    var i = Math.max(0, Math.min(sections.length - 1, index));
    navLock = true;
    sections[i].scrollIntoView({
      behavior: motionQuery.matches ? "auto" : "smooth",
      block: "start"
    });
    window.setTimeout(function () {
      navLock = false;
    }, motionQuery.matches ? 120 : 850);
  }

  function setupObserver() {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setActive(sections.indexOf(entry.target), false);
        });
      },
      { root: snap, threshold: 0.55 }
    );
    sections.forEach(function (sec) {
      io.observe(sec);
    });
    setActive(0, true);
  }

  /* 滚轮：一滚一页（触屏走原生 snap） */
  function setupWheel() {
    if (!snap) return;
    snap.addEventListener(
      "wheel",
      function (e) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        if (navLock) return;
        wheelAcc += e.deltaY;
        if (Math.abs(wheelAcc) < 60) return;
        var dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        goTo(activeIndex + dir);
      },
      { passive: false }
    );
  }

  /* 键盘：方向键 / PageUp Down / Home End */
  function setupKeyboardNav() {
    document.addEventListener("keydown", function (e) {
      if (openPanelId && e.key !== "Escape") return;
      var next = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = activeIndex + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = activeIndex - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = sections.length - 1;
      else if (e.key === "Escape") {
        if (openPanelId) closeOverlay();
        else if (openDrawerId) closeDrawer();
        return;
      } else return;

      if (next === null) return;
      e.preventDefault();
      goTo(next);
    });
  }

  /* ---------- 柜子：抽屉 / 书 / 档案袋 / 索引卡 ---------- */

  function setDrawer(id, shouldOpen) {
    var drawer = cabinetEl ? cabinetEl.querySelector('[data-drawer="' + id + '"]') : null;
    if (!drawer) return;
    var face = drawer.querySelector(".drawer-face");
    var box = drawer.querySelector(".drawer-box");
    drawer.classList.toggle("is-open", shouldOpen);
    face.setAttribute("aria-expanded", String(shouldOpen));
    if (box && "inert" in box) box.inert = !shouldOpen;
    openDrawerId = shouldOpen ? id : null;
  }

  function closeDrawer() {
    if (openDrawerId) setDrawer(openDrawerId, false);
  }

  function renderCabinet() {
    if (!cabinetEl) return;
    cabinets.forEach(function (cab) {
      if (!cab || !cab.id) return;
      var drawer = el("div", "drawer" + (cab.small ? " d-small" : ""));
      drawer.dataset.drawer = cab.id;

      var face = el("button", "drawer-face");
      face.type = "button";
      face.setAttribute("aria-expanded", "false");
      face.setAttribute("aria-controls", "drawerbox-" + cab.id);
      face.setAttribute("aria-label", "拉开抽屉：" + cab.label);
      face.appendChild(el("span", "drawer-plate", cab.label));
      face.appendChild(el("span", "drawer-pull"));
      face.addEventListener("click", function () {
        if (openDrawerId === cab.id) closeDrawer();
        else {
          closeDrawer();
          setDrawer(cab.id, true);
        }
      });
      drawer.appendChild(face);

      // 裁剪层：抽屉盒贴着柱左缘滑出，不产生框外溢出
      var clip = el("div", "drawer-clip");
      var box = el("div", "drawer-box");
      box.id = "drawerbox-" + cab.id;

      if (cab.kind === "books" && Array.isArray(cab.groups)) {
        cab.groups.forEach(function (gid) {
          var g = groupById[gid];
          if (!g) return;
          var book = el("button", "book");
          book.type = "button";
          book.appendChild(el("span", "book-title", g.label));
          book.setAttribute("aria-label", "抽出「" + g.label + "」这本书（共 " + g.items.length + " 篇）");
          book.addEventListener("click", function () {
            openOverlay(g, book);
          });
          box.appendChild(book);
        });
        box.appendChild(el("span", "drawer-box-note", "点书看目录"));
      } else if (cab.kind === "files" && Array.isArray(cab.groups)) {
        cab.groups.forEach(function (gid) {
          var g = groupById[gid];
          if (!g) return;
          g.items.forEach(function (item) {
            var file = el("button", "file");
            file.type = "button";
            var t = el("span", "file-title", item.title || "未命名");
            file.appendChild(t);
            file.setAttribute("aria-label", "档案袋：" + (item.title || ""));
            file.addEventListener("click", function () {
              if (item.href) window.location.href = item.href;
              else showToast("「" + (item.title || "这份档案") + "」还在整理。");
            });
            box.appendChild(file);
          });
        });
        box.appendChild(el("span", "drawer-box-note", "点袋看作品"));
      } else if (cab.kind === "card") {
        var card = el("button", "index-card", cab.label);
        card.type = "button";
        card.addEventListener("click", function () {
          var target = document.getElementById(cab.target);
          if (target) {
            goTo(sections.indexOf(target));
            closeDrawer();
          }
        });
        box.appendChild(card);
      }

      clip.appendChild(box);
      drawer.appendChild(clip);
      cabinetEl.appendChild(drawer);
    });

    // 点击抽屉以外的地方收起
    document.addEventListener("click", function (e) {
      if (!openDrawerId) return;
      if (cabinetEl.contains(e.target)) return;
      closeDrawer();
    });
  }

  /* ---------- 下一层目录浮层（点书打开） ---------- */

  function openOverlay(group, opener) {
    if (!overlayEl || !group) return;
    openPanelId = group.id;
    overlayOpener = opener || null;

    overlayTitle.textContent = "";
    overlayTitle.appendChild(el("span", null, group.label));
    overlayTitle.appendChild(el("span", "ov-en", group.items.length + " items · " + (group.note || "")));

    overlayGrid.textContent = "";
    var list = el("ul", "item-list");
    group.items.forEach(function (item) {
      var li = el("li", "item-row");
      li.appendChild(itemLink(item));
      list.appendChild(li);
    });
    overlayGrid.appendChild(list);

    overlayEl.hidden = false;
    window.requestAnimationFrame(function () {
      overlayEl.classList.add("is-open");
    });
    var closeBtn = overlayEl.querySelector("[data-close].panel-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeOverlay() {
    if (!overlayEl || !openPanelId) return;
    openPanelId = null;
    overlayEl.classList.remove("is-open");
    window.setTimeout(function () {
      overlayEl.hidden = true;
    }, 360);
    if (overlayOpener && overlayOpener.focus) overlayOpener.focus();
    overlayOpener = null;
  }

  function setupOverlay() {
    if (!overlayEl) return;
    Array.prototype.forEach.call(overlayEl.querySelectorAll("[data-close]"), function (btn) {
      btn.addEventListener("click", closeOverlay);
    });
  }

  /* ---------- 门与字幕（沿用 v0.3） ---------- */

  function pulseDoor() {
    if (!hallEl) return;
    hallEl.classList.add("is-pulse");
    window.clearTimeout(pulseTimer);
    pulseTimer = window.setTimeout(function () {
      hallEl.classList.remove("is-pulse");
    }, 1700);
  }

  function syncToggle() {
    if (!toggleBtn || !quoteLayer) return;
    var paused = quoteLayer.classList.contains("is-paused");
    toggleBtn.setAttribute("aria-pressed", String(paused));
    toggleBtn.setAttribute("aria-label", paused ? "播放名言滚动" : "暂停名言滚动");
    var icon = toggleBtn.querySelector(".footer-toggle-icon");
    if (icon) icon.textContent = paused ? "▶" : "❚❚";
  }

  /* ---------- 门后的名言（沿用 v0.3，两列、随机、少数放大） ---------- */

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
      var group = el("div", "quote-group");
      items.forEach(function (quote) {
        var major = Math.random() < 0.25 ? " is-major" : "";
        var figure = el("figure", "quote-item" + major);
        figure.appendChild(el("blockquote", null, quote.text || ""));
        if (quote.author) {
          figure.appendChild(el("figcaption", "quote-author", quote.author));
        }
        group.appendChild(figure);
      });
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

  /* ---------- 初始化 ---------- */

  function setYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function init() {
    renderGroupLists();
    renderQuotes();
    renderIndicator();
    renderCabinet();
    setupOverlay();
    setupObserver();
    setupWheel();
    setupKeyboardNav();
    setYear();

    // 保险：框架绝不允许横向滚动（抽屉的滑入空间都在框内裁剪）
    var frame = document.querySelector(".frame");
    if (frame) {
      frame.addEventListener("scroll", function () {
        if (frame.scrollLeft !== 0) frame.scrollLeft = 0;
      });
    }

    // 转场层用完就把类摘掉，保持 DOM 干净
    if (wipeEl) {
      wipeEl.addEventListener("animationend", function () {
        wipeEl.classList.remove("is-wiping");
      });
    }

    if (doorEl) doorEl.addEventListener("click", pulseDoor);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        if (!quoteLayer) return;
        quoteLayer.classList.toggle("is-paused");
        syncToggle();
      });
      syncToggle();
      if (motionQuery.matches) toggleBtn.hidden = true;
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
