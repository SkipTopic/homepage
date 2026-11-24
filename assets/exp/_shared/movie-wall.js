/* 影像 · 电影墙（36 部，图片 720p WebP）
   所有布局共用：只输出结构 + 通用 .mw-film-* 类，颜色/字体走各页 token。
   数据：window.MOVIE_DATA（assets/exp/_shared/movies-data.js）
*/
(function () {
  "use strict";

  var MOVIES = (window.MOVIE_DATA || []).slice();
  var script = document.currentScript;
  var BASE = script ? new URL("./", script.src).href : "../../../assets/exp/_shared/";
  var state = { q: "", genre: "全部" };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function src(path) {
    return BASE + path;
  }

  function ratingText(m) {
    var r = Number(m.rating);
    return isFinite(r) && r > 0 ? r.toFixed(1) : "—";
  }

  function movieKey(m) {
    return [
      m.title, m.originalTitle, m.year, m.country,
      (m.directors || []).join(" "), (m.cast || []).join(" "),
      (m.genres || []).join(" ")
    ].join(" ").toLowerCase();
  }

  function genreList() {
    var counts = {};
    MOVIES.forEach(function (m) {
      (m.genres || []).forEach(function (g) {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return Object.keys(counts).sort(function (a, b) {
      if (counts[b] !== counts[a]) return counts[b] - counts[a];
      return a.localeCompare(b, "zh");
    }).map(function (g) { return { name: g, count: counts[g] }; });
  }

  function crumb(onBack) {
    var box = el("div", "mw-film-crumb");
    var back = el("button", null, "喜欢");
    back.type = "button";
    back.addEventListener("click", function () {
      if (typeof onBack === "function") onBack();
    });
    box.appendChild(back);
    box.appendChild(el("i", null, "/"));
    box.appendChild(el("span", null, "影像"));
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
    ORDER = shuffle(MOVIES);
    opts = opts || {};
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb(opts.onBack));
    frag.appendChild(el(
      "p", "mw-film-lede",
      "看得见的 " + MOVIES.length + " 部。海报已压到 720p，点一张看简介、短评和 3 张剧照；" +
      "按类型筛，搜索可以查中文名、原名、导演和演员。"
    ));

    var shelf = el("div", "mw-film-shelf");
    var rail = el("div", "mw-film-rail");

    rail.appendChild(el("h4", null, "搜索"));
    var search = document.createElement("input");
    search.className = "mw-film-search";
    search.type = "search";
    search.placeholder = "片名 / 原名 / 导演 / 演员";
    search.value = state.q;
    search.addEventListener("input", function () {
      state.q = search.value.trim();
      paintWall(wall);
    });
    rail.appendChild(search);

    rail.appendChild(el("h4", null, "类型"));
    var allBtn = el("button", "mw-film-filter", "全部");
    allBtn.type = "button";
    allBtn.dataset.genre = "全部";
    allBtn.appendChild(el("em", null, String(MOVIES.length)));
    if (state.genre === "全部") allBtn.classList.add("is-on");
    allBtn.addEventListener("click", function () { pickGenre("全部", rail); });
    rail.appendChild(allBtn);

    genreList().forEach(function (g) {
      var b = el("button", "mw-film-filter", g.name);
      b.type = "button";
      b.dataset.genre = g.name;
      b.appendChild(el("em", null, String(g.count)));
      if (state.genre === g.name) b.classList.add("is-on");
      b.addEventListener("click", function () { pickGenre(g.name, rail); });
      rail.appendChild(b);
    });
    shelf.appendChild(rail);

    var wall = el("div", "mw-film-grid");
    shelf.appendChild(wall);
    frag.appendChild(shelf);

    paintWall(wall);
    return frag;
  }

  function pickGenre(g, rail) {
    state.genre = g;
    Array.prototype.forEach.call(rail.querySelectorAll(".mw-film-filter"), function (x) {
      x.classList.toggle("is-on", x.dataset.genre === g);
    });
    var wall = rail.parentNode.querySelector(".mw-film-grid");
    paintWall(wall);
  }

  function paintWall(wall) {
    if (!wall) return;
    wall.textContent = "";
    var q = state.q.toLowerCase();
    var n = 0;
    (ORDER || MOVIES).forEach(function (m) {
      if (state.genre !== "全部" && (m.genres || []).indexOf(state.genre) < 0) return;
      if (q && movieKey(m).indexOf(q) < 0) return;
      n++;
      var card = el("button", "mw-film-card");
      card.type = "button";
      card.title = m.title + (m.originalTitle ? " · " + m.originalTitle : "");

      var img = document.createElement("img");
      img.src = src(m.poster);
      img.alt = m.title + " 海报";
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);

      card.appendChild(el("span", "mw-film-score", ratingText(m)));
      card.appendChild(el("b", "mw-film-name", m.title));
      card.appendChild(el("span", "mw-film-original", (m.originalTitle || "") + (m.year ? " · " + m.year : "")));

      card.addEventListener("click", function () { openFilm(m); });
      wall.appendChild(card);
    });
    if (!n) wall.appendChild(el("div", "mw-film-empty", "这格空的，换个类型或关键词试试。"));
  }

  function openFilm(m) {
    var old = document.querySelector(".mw-film-modal");
    if (old) old.remove();

    var modal = el("div", "mw-film-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", m.title + " 资料卡");

    var backdrop = el("div", "mw-film-backdrop");
    modal.appendChild(backdrop);

    var sheet = el("div", "mw-film-sheet");
    var hero = el("div", "mw-film-hero");
    var header = document.createElement("img");
    header.className = "mw-film-header";
    header.src = src(m.header);
    header.alt = m.title + " 头图";
    header.loading = "eager";
    hero.appendChild(header);
    hero.appendChild(el("span", "mw-film-shade"));

    var poster = el("div", "mw-film-poster");
    var pimg = document.createElement("img");
    pimg.src = src(m.poster);
    pimg.alt = m.title + " 海报";
    pimg.loading = "eager";
    poster.appendChild(pimg);
    hero.appendChild(poster);

    var head = el("div", "mw-film-head");
    head.appendChild(el("p", "mw-film-kick", "影像 · FILM " + m.no));
    head.appendChild(el("h3", null, m.title));
    head.appendChild(el("p", "mw-film-head-original", (m.originalTitle || "") + (m.year ? " · " + m.year : "")));
    head.appendChild(el("p", "mw-film-meta", [m.country, (m.genres || []).join(" / "), m.duration].filter(Boolean).join(" · ")));
    hero.appendChild(head);

    var score = el("div", "mw-film-bigscore");
    score.appendChild(el("b", null, ratingText(m)));
    score.appendChild(el("span", null, "豆瓣"));
    hero.appendChild(score);

    sheet.appendChild(hero);

    var body = el("div", "mw-film-body");
    if (m.review) {
      var quote = el("p", "mw-film-review");
      quote.textContent = "“" + m.review + "”";
      body.appendChild(quote);
    }
    if (m.summary) body.appendChild(el("p", "mw-film-summary", m.summary));

    var stills = el("div", "mw-film-stills");
    (m.stills || []).forEach(function (path, i) {
      var figure = el("figure", "mw-film-still");
      var img = document.createElement("img");
      img.src = src(path);
      img.alt = m.title + " 剧照 " + (i + 1);
      img.loading = "lazy";
      img.decoding = "async";
      figure.appendChild(img);
      stills.appendChild(figure);
    });
    if (stills.children.length) body.appendChild(stills);

    var foot = el("div", "mw-film-foot");
    var meta = el("p", null, "导演 " + ((m.directors || []).join("、") || "—") + " · " +
      ((m.cast || []).slice(0, 4).join("、") || "—") + (m.ratingCount ? " · " + Number(m.ratingCount).toLocaleString("zh-CN") + " 人评价" : ""));
    foot.appendChild(meta);
    if (m.doubanUrl) {
      var link = el("a", "mw-film-link", "豆瓣条目 ↗");
      link.href = m.doubanUrl;
      link.target = "_blank";
      link.rel = "noopener";
      foot.appendChild(link);
    }
    body.appendChild(foot);
    sheet.appendChild(body);

    var close = el("button", "mw-film-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭资料卡");
    close.addEventListener("click", closeModal);
    sheet.appendChild(close);

    modal.appendChild(sheet);
    document.body.appendChild(modal);
    document.body.classList.add("mw-film-open");

    backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", onKey);
    close.focus();

    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    function closeModal() {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("mw-film-open");
      modal.remove();
    }
  }

  window.MOVIE_WALL = {
    count: MOVIES.length,
    render: render,
    open: openFilm
  };
})();
