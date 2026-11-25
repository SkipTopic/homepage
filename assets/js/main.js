(function () {
  "use strict";

  var data = window.SITE_DATA || {};
  var quotes = Array.isArray(data.quotes) ? data.quotes : [];
  var bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
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
  var toggleBtn = document.getElementById("quote-toggle");
  var toastEl = document.getElementById("toast");

  var sections = Array.prototype.slice.call(document.querySelectorAll(".sec"));
  var activeIndex = -1;
  var navLock = false;
  var toastTimer = null;
  var pulseTimer = null;
  var wheelAcc = 0;
  var doorLaunchLock = false;
  /* 2026-11-26 彩蛋：连点门 10 次以上，把手弹出去、掉地上，滚轮跟着失效 */
  var doorClicks = 0;
  var handleGone = false;
  var looseHandleEl = null; // 掉在地上的那颗把手（克隆体）
  var looseShadowEl = null;
  var DOOR_NAGS = [
    "别点了，打不开的。",
    "真的打不开。",
    "门是画上去的。",
    "再点它也不会开。",
    "把手有点松了。",
    "别怪我没提醒你。",
    "你手不疼吗？",
    "再点一下试试。",
    "行，你赢了。",
    "……"
  ];
  // 2026-11-25 转正：内页从「修改UI界面/布局09-对页书」搬进了站点内的 ./book/
  // 用相对路径（不带开头的 /），这样 GitHub Pages 在 /homepage/ 这种子路径下也能跳对
  var BOOK_INTERIOR = "book/index.html";
  // 2026-11-24 修复：motionQuery 之前只在 manga.js 的作用域里，main.js 没定义，滚轮开门会抛 ReferenceError
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

        // 书影音组：多给一块「打开漫画墙」的油墨按钮（封面墙在 manga.js）
        if (group.id === "media" && typeof window.__openMangaWall === "function") {
          var wallBtn = el("button", "wall-open");
          wallBtn.type = "button";
          wallBtn.appendChild(el("span", null, "打开漫画墙"));
          var mangaCount = (window.MANGA_DATA && window.MANGA_DATA.length) || 52;
          wallBtn.appendChild(el("span", "wall-open-count", mangaCount + " VOLS"));
          wallBtn.addEventListener("click", function () {
            window.__openMangaWall(wallBtn);
          });
          block.appendChild(wallBtn);
        }

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

    // 掉在地上的把手只属于门厅：翻走了就收起来，回来再摆出来
    if (looseHandleEl) looseHandleEl.style.display = index === 0 ? "" : "none";
    if (looseShadowEl) looseShadowEl.style.display = index === 0 ? "" : "none";

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

  /* 门厅 → 对页书内页：滚轮一到门底就“啪”地切过去，不做滚动翻页 */
  function launchBook() {
    if (doorLaunchLock) return;
    /* 把手掉了 = 门打不开：滚轮/键盘/上滑都别再把人送进内页 */
    if (handleGone) {
      showToast("把手都掉了，门开不了。");
      return;
    }
    doorLaunchLock = true;
    navLock = true;

    if (hallEl) hallEl.classList.add("is-launching");

    if (!motionQuery.matches) {
      var burst = el("div", "door-burst");
      document.body.appendChild(burst);
      window.requestAnimationFrame(function () {
        burst.classList.add("is-on");
      });
    }

    window.setTimeout(function () {
      window.location.href = BOOK_INTERIOR;
    }, motionQuery.matches ? 0 : 240);
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
        /* 2026-11-26 彩蛋：把手掉了以后，门厅的滚轮彻底失效（不翻页、也不进内页） */
        if (handleGone && activeIndex === 0) {
          wheelAcc = 0;
          return;
        }
        if (navLock) return;
        wheelAcc += e.deltaY;
        if (Math.abs(wheelAcc) < 60) return;
        var dir = wheelAcc > 0 ? 1 : -1;
        wheelAcc = 0;
        if (activeIndex === 0 && dir > 0) {
          launchBook();
          return;
        }
        goTo(activeIndex + dir);
      },
      { passive: false }
    );
  }

  /* 键盘：方向键 / PageUp Down / Home End */
  function setupKeyboardNav() {
    document.addEventListener("keydown", function (e) {
      // 漫画墙开着时：翻页/滚轮全部让路，Esc 只关墙
      if (document.body.classList.contains("mw-locked")) {
        if (e.key === "Escape" && typeof window.__closeMangaWall === "function") {
          window.__closeMangaWall();
        }
        return;
      }
      var next = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") next = activeIndex + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = activeIndex - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = sections.length - 1;
      else return;

      if (next === null) return;
      e.preventDefault();
      if (activeIndex === 0 && next === 1 && (e.key === "ArrowDown" || e.key === "PageDown")) {
        launchBook();
        return;
      }
      goTo(next);
    });
  }

  /* 触屏：在门厅往上滑也直接切到内页 */
  function setupTouchLaunch() {
    if (!snap) return;
    var touchStartY = null;
    snap.addEventListener(
      "touchstart",
      function (e) {
        if (activeIndex === 0 && e.touches.length) touchStartY = e.touches[0].clientY;
        else touchStartY = null;
      },
      { passive: true }
    );
    snap.addEventListener(
      "touchend",
      function (e) {
        if (touchStartY === null || !e.changedTouches.length) return;
        var moved = touchStartY - e.changedTouches[0].clientY;
        touchStartY = null;
        if (moved > 42) launchBook();
      },
      { passive: true }
    );
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

  /* ---------- 彩蛋：门把手（2026-11-26 站主脚本） ---------- */

  function rattleDoor() {
    if (!doorEl) return;
    doorEl.classList.remove("is-rattled");
    void doorEl.offsetWidth; // 重启动画
    doorEl.classList.add("is-rattled");
  }

  function onDoorClick() {
    if (handleGone) {
      showToast("把手都掉了，别点了。");
      return;
    }
    doorClicks += 1;
    pulseDoor();

    /* 前 10 下：一下一句，越点越心虚 */
    if (doorClicks <= 10) {
      showToast(DOOR_NAGS[doorClicks - 1]);
      if (doorClicks >= 6) rattleDoor();
      return;
    }
    breakHandle();
  }

  function breakHandle() {
    if (handleGone) return;
    handleGone = true;

    if (doorEl) {
      doorEl.classList.add("is-handle-gone");
      doorEl.setAttribute("aria-label", "一扇掉了把手的门");
    }
    if (hallEl) hallEl.classList.add("is-broken");

    /* 滚轮提示改成「坏了」，别让人以为是滚动卡住 */
    var hint = document.querySelector(".scroll-hint");
    if (hint) {
      var line = hint.querySelector(".scroll-hint-line");
      hint.textContent = "";
      if (line) hint.appendChild(line);
      hint.appendChild(document.createTextNode("把手掉了 · 滚轮也停了"));
    }

    var handle = document.querySelector(".door-handle");
    if (handle) dropHandle(handle);

    showToast("……把手掉了。");
    window.setTimeout(function () {
      showToast("滚轮也一起坏了。");
    }, 1100);
  }

  /* 把手从门板上弹出去 → 落地 → 弹几下 → 停住（位置用 left/top，transform 留给压扁动画） */
  function dropHandle(source) {
    var rect = source.getBoundingClientRect();
    var size = rect.width || 15;
    var frame = document.querySelector(".frame") || document.body;
    var fr = frame.getBoundingClientRect();

    var handle = document.createElement("span");
    handle.className = "door-handle is-loose";
    handle.setAttribute("aria-hidden", "true");
    handle.style.width = size + "px";
    handle.style.height = size + "px";
    handle.style.left = rect.left + "px";
    handle.style.top = rect.top + "px";
    document.body.appendChild(handle);
    looseHandleEl = handle;

    var shadow = document.createElement("span");
    shadow.className = "door-handle-shadow";
    shadow.setAttribute("aria-hidden", "true");
    document.body.appendChild(shadow);
    looseShadowEl = shadow;

    var minX = fr.left + 10;
    var maxX = Math.max(minX, fr.right - 10 - size);
    var floorY = Math.min(fr.bottom, window.innerHeight) - 12 - size;
    var shadowW = 22;

    function placeShadow(x, y) {
      var lift = Math.max(0, floorY - y);
      shadow.style.left = (x + size / 2 - shadowW / 2) + "px";
      shadow.style.top = (floorY + size - 3) + "px";
      shadow.style.opacity = String(Math.max(0.05, 0.34 - lift / 800));
      shadow.style.transform = "scaleX(" + (1 - Math.min(0.45, lift / 700)).toFixed(3) + ")";
    }

    /* 减少动态：直接放到地上 */
    if (motionQuery.matches) {
      var restX = Math.max(minX, Math.min(maxX, rect.left + 90));
      handle.style.left = restX + "px";
      handle.style.top = floorY + "px";
      placeShadow(restX, floorY);
      return;
    }

    var x = rect.left;
    var y = rect.top;
    var vx = 100 + Math.random() * 50; // 先往右弹（别飞太远，落在门右侧）
    var vy = -160; // 带一点上抛，像弹簧顶了一下
    var G = 2300;
    var last = performance.now();

    placeShadow(x, y);

    function hit() {
      handle.classList.remove("is-hit");
      void handle.offsetWidth;
      handle.classList.add("is-hit");
    }

    function step(now) {
      var dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      vy += G * dt;
      x += vx * dt;
      y += vy * dt;

      if (x < minX) { x = minX; vx = Math.abs(vx) * 0.5; }
      if (x > maxX) { x = maxX; vx = -Math.abs(vx) * 0.5; }

      if (y >= floorY) {
        y = floorY;
        if (Math.abs(vy) > 110) {
          vy = -Math.abs(vy) * 0.46;
          vx *= 0.84;
          hit();
        } else {
          vy = 0;
          vx *= 0.9; // 地面摩擦，慢慢打住
          if (Math.abs(vx) < 5) {
            handle.style.left = x + "px";
            handle.style.top = y + "px";
            placeShadow(x, y);
            return;
          }
        }
      }

      handle.style.left = x + "px";
      handle.style.top = y + "px";
      placeShadow(x, y);
      window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
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
    setupObserver();
    setupWheel();
    setupKeyboardNav();
    setupTouchLaunch();
    setYear();

    // 转场层用完就把类摘掉，保持 DOM 干净
    if (wipeEl) {
      wipeEl.addEventListener("animationend", function () {
        wipeEl.classList.remove("is-wiping");
      });
    }

    if (doorEl) doorEl.addEventListener("click", onDoorClick);

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        if (!quoteLayer) return;
        quoteLayer.classList.toggle("is-paused");
        syncToggle();
      });
      syncToggle();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
