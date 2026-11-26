/* 「我的房间」· 卷首插画（2026-11-26）
   底图是空房（8 个空框），每次挂载从四个池子里随机抽：
   4 本书 / 2 张专辑 / 1 张电影海报 / 1 张游戏实机画面，贴回空位。
   数据：assets/room/room-data.js（我的房间-生图/build_web_room.py 生成）
   用法：ROOM.mount(容器)；换一批：ROOM.roll()（图注上的「再摆一次」已接线）。 */
(function () {
  "use strict";

  var DATA = window.ROOM_DATA;
  var SELF = document.currentScript;
  var SRC = (SELF && SELF.getAttribute("src")) || "../assets/room/room.js";
  var ROOT = SRC.replace(/assets\/room\/room\.js.*$/, "");
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#1e3e74";
  var fig = null;
  var lastKey = "";
  var rollTimer = null;

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
      }
    }
    return node;
  }

  function url(p) {
    return ROOT + String(p).replace(/^\/+/, "");
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function take(pool, n) {
    if (!pool || !pool.length) return [];
    return shuffle(pool).slice(0, Math.min(n, pool.length));
  }

  function label(kind, item) {
    if (!item) return "空着";
    var t = item[1] || "";
    var m = item[2] || "";
    if (kind === "book") return "《" + t + "》" + (m ? " · " + m : "");
    if (kind === "album") return "专辑 · " + t + (m ? " · " + m : "");
    if (kind === "poster") return "电影 · 《" + t + "》" + (m ? " · " + m : "");
    return "游戏画面 · " + t;
  }

  function toast(message) {
    if (window.LAYOUT && typeof window.LAYOUT.showToast === "function") {
      window.LAYOUT.showToast(message);
      return;
    }
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2400);
  }

  function assign(slots) {
    var kinds = { book: [], album: [], poster: [], game: [] };
    slots.forEach(function (g) {
      var k = g.getAttribute("data-kind");
      if (kinds[k]) kinds[k].push(g);
    });

    var picks = {
      book: take(DATA.books, kinds.book.length),
      album: take(DATA.albums, kinds.album.length),
      poster: take(DATA.movies, 1),
      game: take(DATA.games, 1)
    };

    Object.keys(kinds).forEach(function (k) {
      kinds[k].forEach(function (g, i) {
        var item = picks[k][i];
        var img = g.querySelector("image");
        var title = g.querySelector("title");
        if (!item || !img) return;
        g.__roomPick = { kind: k, item: item };
        var text = label(k, item);
        if (title) title.textContent = text;
        g.setAttribute("aria-label", text);
        img.style.opacity = "0";
        img.setAttribute("href", url(item[0]));
        img.onload = function () { img.style.opacity = "1"; };
        img.onerror = function () { img.style.opacity = "1"; };
      });
    });

    lastKey = Object.keys(kinds).map(function (k) {
      return picks[k].map(function (it) { return it && it[0]; }).join("|");
    }).join("//");
  }

  function roll() {
    if (!fig) return;
    var n = 0;
    do {
      assign(fig.querySelectorAll(".room-slot"));
      n += 1;
    } while (n < 3 && lastKey === fig.__roomKey);
    fig.__roomKey = lastKey;
    fig.classList.remove("is-rolling");
    void fig.offsetWidth;
    fig.classList.add("is-rolling");
    window.clearTimeout(rollTimer);
    rollTimer = window.setTimeout(function () {
      fig.classList.remove("is-rolling");
    }, 520);
  }

  function mount(host) {
    if (!host || !DATA || !DATA.slots) return;
    host.textContent = "";
    fig = null;

    var figure = document.createElement("figure");
    figure.className = "room-plate";

    var frame = document.createElement("div");
    frame.className = "room-frame";

    var w = DATA.view.w;
    var h = DATA.view.h;
    var svg = svgEl("svg", {
      viewBox: "0 0 " + w + " " + h,
      role: "group",
      "aria-label": "我的房间：书架上的四本书、墙上的两张专辑、一张电影海报，和一块正在玩游戏的屏幕。每次打开随机换一套。"
    });

    var defs = svgEl("defs");
    var clip = svgEl("clipPath", { id: "room-screen-clip" });
    clip.appendChild(svgEl("path", { d: DATA.screenPath }));
    defs.appendChild(clip);
    svg.appendChild(defs);

    svg.appendChild(svgEl("image", {
      href: url("assets/room/room-base.webp") + "?v=20261126room",
      x: 0, y: 0, width: w, height: h,
      preserveAspectRatio: "none"
    }));

    DATA.slots.forEach(function (slot) {
      var g = svgEl("g", {
        "class": "room-slot",
        "data-kind": slot.k,
        tabindex: "0",
        role: "button"
      });
      g.appendChild(svgEl("title", {}));

      var attrs = {
        x: slot.x, y: slot.y, width: slot.w, height: slot.h,
        preserveAspectRatio: "xMidYMid slice"
      };
      if (slot.k === "game") attrs["clip-path"] = "url(#room-screen-clip)";
      var img = svgEl("image", attrs);
      img.style.opacity = "0";
      g.appendChild(img);

      var edge;
      if (slot.k === "game") {
        edge = svgEl("path", { d: DATA.screenPath, "class": "room-edge" });
      } else {
        edge = svgEl("rect", {
          x: slot.x, y: slot.y, width: slot.w, height: slot.h,
          "class": "room-edge", stroke: INK
        });
      }
      g.appendChild(edge);

      function speak() {
        var pick = g.__roomPick;
        toast(pick ? label(pick.kind, pick.item) : "这张还没贴上。");
      }
      g.addEventListener("click", speak);
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          speak();
        }
      });

      svg.appendChild(g);
    });

    frame.appendChild(svg);

    var cap = document.createElement("figcaption");
    cap.className = "room-cap";
    cap.innerHTML =
      '<span class="room-cap-kick">PLATE 01</span>' +
      '<span class="room-cap-name">我的房间</span>' +
      '<span class="room-cap-note">每次打开重摆一遍 · 点一下认名字</span>' +
      '<button class="room-roll" type="button" aria-label="重新随机摆一遍">再摆一次 ↻</button>';

    figure.appendChild(frame);
    figure.appendChild(cap);
    host.appendChild(figure);
    fig = figure;

    cap.querySelector(".room-roll").addEventListener("click", roll);
    roll();
  }

  window.ROOM = { mount: mount, roll: roll };
})();
