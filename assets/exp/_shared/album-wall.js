/* 音乐 · 专辑墙（324 张，网页图 480px WebP）
   和 movie-wall.js 同一套约定：只输出结构 + 通用 .aw-* 类，颜色/字体走各页 token。
   数据：window.ALBUM_DATA（assets/exp/_shared/albums-data.js） */
(function () {
  "use strict";

  var ALBUMS = (window.ALBUM_DATA || []).slice();
  var script = document.currentScript;
  var BASE = script ? new URL("./", script.src).href : "../../../assets/exp/_shared/";
  var state = { q: "", era: "全部" };
  /* 分批渲染：324 张一次性建 DOM 会卡，先给 60 张，滚到底再自动接下一批 */
  var BATCH = 60;
  var view = { list: [], shown: 0, wall: null, obs: null };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function src(path) {
    return BASE + path;
  }

  function eraOf(a) {
    var y = parseInt(a.year, 10);
    if (!y) return "未标注";
    return Math.floor(y / 10) * 10 + "s";
  }

  function keyOf(a) {
    return [a.title, (a.artists || []).join(" "), (a.likedSongs || []).join(" "), a.year, a.company]
      .join(" ").toLowerCase();
  }

  function eraList() {
    var counts = {};
    ALBUMS.forEach(function (a) {
      var e = eraOf(a);
      counts[e] = (counts[e] || 0) + 1;
    });
    return Object.keys(counts).sort().map(function (e) {
      return { name: e, count: counts[e] };
    });
  }

  function crumb(onBack) {
    var box = el("div", "aw-crumb");
    var back = el("button", null, "喜欢");
    back.type = "button";
    back.addEventListener("click", function () {
      if (typeof onBack === "function") onBack();
    });
    box.appendChild(back);
    box.appendChild(el("i", null, "/"));
    box.appendChild(el("span", null, "音乐"));
    return box;
  }


  /* 打开时打乱一次：不让某个固定条目永远排第一。
     筛选（年代/类型）只在这个顺序里过滤，不会重新排回编号序。 */
  var ORDER = null;
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function render(opts) {
    ORDER = shuffle(ALBUMS);
    opts = opts || {};
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb(opts.onBack));
    frag.appendChild(el(
      "p", "aw-lede",
      "听过的 " + ALBUMS.length + " 张专辑。封面压到 320px、每次先铺 60 张；点一张看发行信息和你收藏的那几首，" +
      "按年代筛，搜索可以查专辑名、歌手和歌名。"
    ));

    var shelf = el("div", "aw-shelf");
    var rail = el("div", "aw-rail");

    rail.appendChild(el("h4", null, "搜索"));
    var search = document.createElement("input");
    search.className = "aw-search";
    search.type = "search";
    search.placeholder = "专辑 / 歌手 / 歌名";
    search.value = state.q;
    search.addEventListener("input", function () {
      state.q = search.value.trim();
      paintWall(wall);
    });
    rail.appendChild(search);

    rail.appendChild(el("h4", null, "年代"));
    var allBtn = el("button", "aw-filter", "全部");
    allBtn.type = "button";
    allBtn.dataset.era = "全部";
    allBtn.appendChild(el("em", null, String(ALBUMS.length)));
    if (state.era === "全部") allBtn.classList.add("is-on");
    allBtn.addEventListener("click", function () { pickEra("全部", rail); });
    rail.appendChild(allBtn);

    eraList().forEach(function (g) {
      var b = el("button", "aw-filter", g.name);
      b.type = "button";
      b.dataset.era = g.name;
      b.appendChild(el("em", null, String(g.count)));
      if (state.era === g.name) b.classList.add("is-on");
      b.addEventListener("click", function () { pickEra(g.name, rail); });
      rail.appendChild(b);
    });
    shelf.appendChild(rail);

    var wall = el("div", "aw-grid");
    shelf.appendChild(wall);
    frag.appendChild(shelf);

    paintWall(wall);
    return frag;
  }

  function pickEra(g, rail) {
    state.era = g;
    Array.prototype.forEach.call(rail.querySelectorAll(".aw-filter"), function (x) {
      x.classList.toggle("is-on", x.dataset.era === g);
    });
    var wall = rail.parentNode.querySelector(".aw-grid");
    paintWall(wall);
  }

  function paintWall(wall) {
    if (!wall) return;
    if (view.obs) { view.obs.disconnect(); view.obs = null; }
    view.wall = wall;
    view.shown = 0;

    var q = state.q.toLowerCase();
    view.list = (ORDER || ALBUMS).filter(function (a) {
      if (state.era !== "全部" && eraOf(a) !== state.era) return false;
      return !q || keyOf(a).indexOf(q) >= 0;
    });

    wall.textContent = "";
    if (!view.list.length) {
      wall.appendChild(el("div", "aw-empty", "这格空的，换个年代或关键词试试。"));
      return;
    }
    appendBatch();
  }

  function appendBatch() {
    var wall = view.wall;
    if (!wall) return;
    var old = wall.querySelector(".aw-more");
    if (old) old.remove();

    var end = Math.min(view.shown + BATCH, view.list.length);
    for (var i = view.shown; i < end; i++) {
      wall.appendChild(makeCard(view.list[i]));
    }
    view.shown = end;

    if (view.shown < view.list.length) {
      var left = view.list.length - view.shown;
      var more = el("button", "aw-more", "继续看（还有 " + left + " 张）");
      more.type = "button";
      more.addEventListener("click", appendBatch);
      wall.appendChild(more);
      if ("IntersectionObserver" in window) {
        view.obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { view.obs.disconnect(); view.obs = null; appendBatch(); }
          });
        }, { root: wall, rootMargin: "600px" });
        view.obs.observe(more);
      }
    }
  }

  function makeCard(a) {
    var card = el("button", "aw-card");
    card.type = "button";
    card.title = a.title + (a.artists && a.artists.length ? " · " + a.artists.join("、") : "");

    var img = document.createElement("img");
    img.src = src(a.cover);
    img.alt = a.title + " 封面";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 320;
    img.height = 320;
    card.appendChild(img);

    var meta = el("span", "aw-meta");
    meta.appendChild(el("b", "aw-name", a.title));
    meta.appendChild(el("span", "aw-artist", (a.artists || []).join("、")));
    card.appendChild(meta);

    card.addEventListener("click", function () { openAlbum(a); });
    return card;
  }

  function openAlbum(a) {
    var old = document.querySelector(".aw-modal");
    if (old) old.remove();

    var modal = el("div", "aw-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", a.title + " 专辑资料");

    var backdrop = el("div", "aw-backdrop");
    modal.appendChild(backdrop);

    var sheet = el("div", "aw-sheet");

    var cover = el("div", "aw-cover");
    var img = document.createElement("img");
    img.src = src(a.cover);
    img.alt = a.title + " 封面";
    img.loading = "eager";
    cover.appendChild(img);
    sheet.appendChild(cover);

    var body = el("div", "aw-body");
    body.appendChild(el("p", "aw-kick", "音乐 · ALBUM " + String(a.no).padStart(3, "0")));
    body.appendChild(el("h3", null, a.title));
    body.appendChild(el("p", "aw-by", (a.artists || []).join("、") || "—"));
    body.appendChild(el("p", "aw-info", [
      a.date || a.year || "",
      a.company || "",
      a.trackCount ? a.trackCount + " 首" : ""
    ].filter(Boolean).join(" · ")));

    if (a.likedSongs && a.likedSongs.length) {
      body.appendChild(el("h4", "aw-sub", a.likedSongs.length > 1 ? "你收藏的 " + a.likedSongs.length + " 首" : "你收藏的这首"));
      var list = el("ul", "aw-songs");
      a.likedSongs.forEach(function (s) {
        list.appendChild(el("li", null, s));
      });
      body.appendChild(list);
    }

    var foot = el("div", "aw-foot");
    if (a.url) {
      var link = el("a", "aw-link", "网易云专辑 ↗");
      link.href = a.url;
      link.target = "_blank";
      link.rel = "noopener";
      foot.appendChild(link);
    }
    body.appendChild(foot);
    sheet.appendChild(body);

    var close = el("button", "aw-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭专辑资料");
    close.addEventListener("click", closeModal);
    sheet.appendChild(close);

    modal.appendChild(sheet);
    document.body.appendChild(modal);
    document.body.classList.add("aw-open");

    backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", onKey);
    close.focus();

    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    function closeModal() {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("aw-open");
      modal.remove();
    }
  }

  window.ALBUM_WALL = {
    count: ALBUMS.length,
    render: render,
    open: openAlbum
  };
})();
