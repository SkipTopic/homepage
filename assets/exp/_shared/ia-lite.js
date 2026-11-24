/* 信息层级（IA）· 轻量版：给「大胆十页」共用
   把 #sec-like 里的分组列表换成「三行栏目 → 书架 / 游戏 / 影像」。
   数据：window.MANGA_DATA（52 本）、window.GAME_LIB（83 款）。 */
(function () {
  "use strict";

  var MANGA = window.MANGA_DATA || [];
  var LIB = window.GAME_LIB || [];

  /* 打开时打乱一次：不让某个固定条目永远排第一；筛选只在这个顺序里过滤 */
  var GAME_ORDER = null;
  var SHELF_ORDER = null;
  function shuffleList(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var MOVIE = window.MOVIE_DATA || [];
  var ALBUM = window.ALBUM_DATA || [];
  /* 游戏封面目录：跟着本文件自己的位置算，站点根目录和子目录里都能用
     （2026-11-25 转正到站点根时，写死的 ../../../ 会跑到盘符外面去） */
  var IA_SCRIPT = document.currentScript;
  var GAME_BASE = IA_SCRIPT
    ? new URL("./games/", IA_SCRIPT.src).href
    : "../../../assets/exp/_shared/games/";
  var host = null;
  var view = "hub";
  /* 嵌入在海报/弹层里时不能滚窗口（会把整张海报顶出视口），由调用方 noScroll 关掉 */
  var noScroll = false;

  var shelfState = { q: "", status: "全部" };
  var gameState = { q: "", genre: "全部" };

  function el(t, c, x) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (x !== undefined) n.textContent = x;
    return n;
  }

  /* 占位状态：等站主给真清单后换成读字段 */
  function statusOf(i) {
    var m = i % 3;
    return m === 0 ? "读完" : m === 1 ? "在读" : "想看";
  }

  function crumb(title) {
    var box = el("div", "ial-crumb");
    var back = el("button", null, "喜欢");
    back.type = "button";
    back.addEventListener("click", function () { render("hub"); });
    box.appendChild(back);
    box.appendChild(el("i", null, "/"));
    box.appendChild(el("span", null, title));
    return box;
  }

  /* ---------- 三行栏目 ---------- */

  function hub() {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("p", "ial-lede", "先去哪一间？四扇门都在这层。"));
    var rows = el("div", "ial-rows");
    [
      { v: "shelf", no: "01", name: "图书馆书架", note: "漫画、书、画集都在架上。左边筛，右边墙。", n: MANGA.length + " 本" },
      { v: "games", no: "02", name: "游戏", note: "别人做的游戏，玩过的都在这面墙上。", n: LIB.length + " 款" },
      { v: "films", no: "03", name: "影像", note: "电影、动画、短片。海报已搬上墙，点一张看资料卡。", n: MOVIE.length + " 部" },
      { v: "albums", no: "04", name: "音乐", note: "喜欢的歌按专辑归了堆。封面在墙上，点一张看是哪几首。", n: ALBUM.length + " 张" }
    ].forEach(function (s) {
      var b = el("button", "ial-row");
      b.type = "button";
      b.appendChild(el("span", "ial-no", s.no));
      var m = el("span", "ial-main");
      m.appendChild(el("b", null, s.name));
      m.appendChild(el("span", null, s.note));
      b.appendChild(m);
      b.appendChild(el("span", "ial-go", s.n + " →"));
      b.addEventListener("click", function () { render(s.v); });
      rows.appendChild(b);
    });
    frag.appendChild(rows);
    return frag;
  }

  /* ---------- 书架 ---------- */

  function shelf() {
    /* 打乱的是「条目 + 原始下标」的配对：statusOf(i) 按原下标算阅读状态，不能丢 */
    SHELF_ORDER = shuffleList(MANGA.map(function (m, i) { return { m: m, i: i }; }));
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb("图书馆书架"));
    var wrap = el("div", "ial-shelf");

    var rail = el("div", "ial-rail");
    rail.appendChild(el("h4", null, "搜索"));
    var s = document.createElement("input");
    s.className = "ial-search";
    s.type = "search";
    s.placeholder = "书名 / 作者";
    s.value = shelfState.q;
    s.addEventListener("input", function () { shelfState.q = s.value.trim(); paintShelf(); });
    rail.appendChild(s);

    rail.appendChild(el("h4", null, "阅读状态"));
    ["全部", "读完", "在读", "想看"].forEach(function (st) {
      var b = el("button", "ial-filter", st);
      b.type = "button";
      b.dataset.st = st;
      b.appendChild(el("em", null, String(st === "全部" ? MANGA.length : MANGA.filter(function (_, i) { return statusOf(i) === st; }).length)));
      if (shelfState.status === st) b.classList.add("is-on");
      b.addEventListener("click", function () {
        shelfState.status = st;
        Array.prototype.forEach.call(rail.querySelectorAll(".ial-filter"), function (x) {
          x.classList.toggle("is-on", x.dataset.st === st);
        });
        paintShelf();
      });
      rail.appendChild(b);
    });
    wrap.appendChild(rail);

    var wall = el("div", "ial-wall");
    wall.id = "ial-shelf-wall";
    wrap.appendChild(wall);
    frag.appendChild(wrap);
    setTimeout(paintShelf, 0);
    return frag;
  }

  function paintShelf() {
    var wall = document.getElementById("ial-shelf-wall");
    if (!wall) return;
    wall.textContent = "";
    var q = shelfState.q.toLowerCase();
    var n = 0;
    var list = SHELF_ORDER || MANGA.map(function (m, i) { return { m: m, i: i }; });
    list.forEach(function (entry) {
      var m = entry.m;
      var i = entry.i;
      var st = statusOf(i);
      if (shelfState.status !== "全部" && st !== shelfState.status) return;
      if (q && (m.title + " " + (m.author || "")).toLowerCase().indexOf(q) < 0) return;
      n++;
      var b = el("button", "ial-book");
      b.type = "button";
      var img = document.createElement("img");
      img.src = m.file;
      img.alt = m.title + " 封面";
      img.loading = "lazy";
      b.appendChild(img);
      b.appendChild(el("b", null, m.title));
      b.addEventListener("click", function () { card(m, st); });
      wall.appendChild(b);
    });
    if (!n) wall.appendChild(el("div", "ial-empty", "这格空的，换个筛子试试。"));
  }

  function modalShell() {
    var box = document.querySelector(".ial-modal");
    if (!box) {
      box = el("div", "ial-modal");
      document.body.appendChild(box);
    }
    box.textContent = "";
    var bg = el("div", "ial-modal-bg");
    bg.addEventListener("click", function () { box.hidden = true; });
    box.appendChild(bg);
    return box;
  }

  function addClose(box, card) {
    var close = el("button", "ial-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭");
    close.addEventListener("click", function () { box.hidden = true; });
    card.appendChild(close);
  }

  function doubanUrl(m) {
    return m.douban || "";
  }

  function card(m, st) {
    var box = modalShell();

    var c = el("div", "ial-card");
    var fig = el("div", "ial-fig");
    var img = document.createElement("img");
    img.src = m.file;
    img.alt = m.title + " 封面";
    fig.appendChild(img);
    c.appendChild(fig);

    var body = el("div", "ial-body");
    body.appendChild(el("p", "ial-kick", "收藏编号 " + (m.no || "—")));
    body.appendChild(el("h3", null, m.title));
    body.appendChild(el("p", "ial-kv", "作者 " + (m.author || "—")));
    body.appendChild(el("span", "ial-stamp", st));
    body.appendChild(el("p", "ial-desc", m.d || "这本的读记还没写完，先在架子上记住它。"));

    var actions = el("div", "ial-actions");
    var db = el("a", "ial-btn is-solid", "豆瓣条目 ↗");
    db.href = doubanUrl(m);
    db.target = "_blank";
    db.rel = "noopener";
    var back = el("button", "ial-btn", "放回书架");
    back.type = "button";
    back.addEventListener("click", function () { box.hidden = true; });
    actions.appendChild(db);
    actions.appendChild(back);
    body.appendChild(actions);
    c.appendChild(body);

    addClose(box, c);
    box.appendChild(c);
    box.hidden = false;
  }

  function gameCard(g) {
    var box = modalShell();

    var c = el("div", "ial-card is-game");
    var fig = el("div", "ial-fig is-game");
    var img = document.createElement("img");
    img.src = GAME_BASE + g.id + ".webp";
    img.alt = g.zh + " 封面";
    fig.appendChild(img);
    c.appendChild(fig);

    var body = el("div", "ial-body");
    body.appendChild(el("p", "ial-kick", "STEAM APP · " + g.id));
    body.appendChild(el("h3", null, g.zh));

    var meta = el("p", "ial-meta");
    meta.appendChild(el("span", null, "类型 " + ((g.g || []).join(" / ") || "—")));
    meta.appendChild(el("span", null, "我的时长 " + (g.h || "—")));
    if (g.dev) meta.appendChild(el("span", null, "开发 " + g.dev));
    if (g.y) meta.appendChild(el("span", null, "发行 " + g.y));
    body.appendChild(meta);

    body.appendChild(el("p", "ial-desc", g.d || "Steam 上没有留下简介，点下面的商店页去看看。"));
    if (g.en && g.en !== g.zh) body.appendChild(el("p", "ial-kv", "原名 " + g.en));

    var actions = el("div", "ial-actions");
    var steam = el("a", "ial-btn is-solid", "Steam 商店页 ↗");
    steam.href = "https://store.steampowered.com/app/" + g.id + "/";
    steam.target = "_blank";
    steam.rel = "noopener";
    var back = el("button", "ial-btn", "返回游戏库");
    back.type = "button";
    back.addEventListener("click", function () { box.hidden = true; });
    actions.appendChild(steam);
    actions.appendChild(back);
    body.appendChild(actions);
    c.appendChild(body);

    addClose(box, c);
    box.appendChild(c);
    box.hidden = false;
  }

  /* ---------- 游戏 ---------- */

  function genreList() {
    var m = {};
LIB.forEach(function (g) { (g.g || []).forEach(function (x) { m[x] = (m[x] || 0) + 1; }); });
    return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).slice(0, 8);
  }

  function games() {
    GAME_ORDER = shuffleList(LIB);
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb("游戏"));
    var wrap = el("div", "ial-shelf");

    var rail = el("div", "ial-rail");
    rail.appendChild(el("h4", null, "搜索"));
    var s = document.createElement("input");
    s.className = "ial-search";
    s.type = "search";
    s.placeholder = "游戏名 / 类型";
    s.value = gameState.q;
    s.addEventListener("input", function () { gameState.q = s.value.trim(); paintGames(); });
    rail.appendChild(s);

    rail.appendChild(el("h4", null, "类型"));
    function addFilter(g, n) {
      var b = el("button", "ial-filter", g);
      b.type = "button";
      b.dataset.g = g;
      b.appendChild(el("em", null, String(n)));
      if (gameState.genre === g) b.classList.add("is-on");
      b.addEventListener("click", function () {
        gameState.genre = g;
        Array.prototype.forEach.call(rail.querySelectorAll(".ial-filter"), function (x) {
          x.classList.toggle("is-on", x.dataset.g === g);
        });
        paintGames();
      });
      rail.appendChild(b);
    }
    addFilter("全部", LIB.length);
    genreList().forEach(function (g) {
      addFilter(g, LIB.filter(function (x) { return (x.g || []).indexOf(g) >= 0; }).length);
    });
    wrap.appendChild(rail);

    var wall = el("div", "ial-wall");
    wall.id = "ial-game-wall";
    wrap.appendChild(wall);
    frag.appendChild(wrap);
    setTimeout(paintGames, 0);
    return frag;
  }

  function paintGames() {
    var wall = document.getElementById("ial-game-wall");
    if (!wall) return;
    wall.textContent = "";
    var q = gameState.q.toLowerCase();
    var n = 0;
    (GAME_ORDER || LIB).forEach(function (g) {
      if (gameState.genre !== "全部" && (g.g || []).indexOf(gameState.genre) < 0) return;
      if (q && (g.zh + " " + (g.g || []).join(" ")).toLowerCase().indexOf(q) < 0) return;
      n++;
      var a = el("button", "ial-book");
      a.type = "button";
      var img = document.createElement("img");
      img.src = GAME_BASE + g.id + ".webp";
      img.alt = g.zh + " 封面";
      img.loading = "lazy";
      a.appendChild(img);
      a.appendChild(el("b", null, g.zh));
      a.title = g.zh + " · " + g.h;
      a.addEventListener("click", function () {
        gameCard(g);
      });
      wall.appendChild(a);
    });
    if (!n) wall.appendChild(el("div", "ial-empty", "这格空的，换个筛选试试。"));
  }

  /* ---------- 影像 ---------- */

  function albums() {
    if (window.ALBUM_WALL) {
      return window.ALBUM_WALL.render({ onBack: function () { render("hub"); } });
    }
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb("音乐"));
    frag.appendChild(el("div", "ial-empty", "专辑数据没加载（检查 _shared/albums-data.js 和 album-wall.js）。"));
    return frag;
  }

  function films() {
    if (window.MOVIE_WALL) {
      return window.MOVIE_WALL.render({ onBack: function () { render("hub"); } });
    }
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb("影像"));
    frag.appendChild(el("div", "ial-empty", "电影数据没加载（检查 _shared/movies-data.js 和 movie-wall.js）。"));
    return frag;
  }


  /* ---------- 探索：我做的游戏（我的东西归探索） ---------- */

  function mineInto() {
    var explore = document.getElementById("sec-explore");
    if (!explore) return;
    var body = explore.querySelector(".sec-body");
    if (!body || body.querySelector(".ial-mine")) return;

    var site = window.SITE_DATA || {};
    var g = (site.bookmarks || []).filter(function (x) { return x.id === "games"; })[0];
    if (!g) return;

    var block = el("div", "group ial-mine");
    var head = el("div", "group-head");
    head.appendChild(el("h3", "group-title", "游戏（我做的）"));
    head.appendChild(el("span", "group-count", g.items.length + " 个"));
    block.appendChild(head);
    block.appendChild(el("p", "group-note", "自己做的三款，图和工程以后补。"));

    var list = el("ul", "item-list");
    g.items.forEach(function (it) {
      var li = el("li", "item-row");
      var btn = el("button", "item-link");
      btn.type = "button";
      var row = el("span", "item-title-row");
      row.appendChild(el("span", "item-title", it.title));
      if (it.tag) row.appendChild(el("span", "item-tag", it.tag));
      btn.appendChild(row);
      if (it.note) btn.appendChild(el("span", "item-note", it.note));
      li.appendChild(btn);
      list.appendChild(li);
    });
    block.appendChild(list);
    body.appendChild(block);
  }

  /* ---------- 渲染 ---------- */

  function node(v) {
    if (v === "hub") return hub();
    if (v === "shelf") return shelf();
    if (v === "games") return games();
    if (v === "films") return films();
    if (v === "albums") return albums();
    return null;
  }

  function render(v) {
    if (!host) return;
    view = v;
    host.textContent = "";
    host.appendChild(node(v));
    host.classList.add("ial-host");
    if (v !== "hub" && !noScroll) window.scrollTo({ top: host.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  }

  function boot() {
    var like = document.getElementById("sec-like");
    if (!like) return;
    host = like.querySelector(".sec-body");
    if (!host) return;
    if (!host.querySelector(".ial-rows") && !host.querySelector(".ial-shelf") && !host.querySelector(".ial-empty")) {
      render("hub");
    }
    mineInto();
  }

  /* 对外：给别的页面就地挂载 */
  window.IAL = {
    mount: function (node, opts) {
      if (!node) return;
      host = node;
      noScroll = !!(opts && opts.noScroll);
      render("hub");
      mineInto();
    },
    /* 挂载后直接进某一间（shelf / games / films / hub）：便当格的三行就是靠它直达 */
    show: function (view2) {
      if (host) render(view2);
    },
    mine: mineInto
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function () { setTimeout(boot, 80); });
})();
