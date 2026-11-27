/* 布局 09 · 对页书 — 翻页逻辑（2026-11-23）
   左页目录点条目 → 右页真的翻过去（rotateY 两段式）；目录保留各章正文。
   2026-11-27：早期整理稿（philosophy/dreams/creation/notes，35 篇）并入「探索」页末尾，
   不再单独成章。详见 交接文档.md §58。 */
(function () {
  "use strict";

  var L = window.LAYOUT;
  var toc = document.getElementById("toc");
  var leaf = document.getElementById("leaf");
  var rhNo = document.getElementById("rh-no");
  var rhTitle = document.getElementById("rh-title");
  var rhEn = document.getElementById("rh-en");
  var leafBody = document.getElementById("leaf-body");
  var folioNo = document.getElementById("folio-no");

  var PAGES = [
    { no: "Ⅰ", cn: "卷首", en: "PROLOGUE", lede: "摊开就能读：左页是目次，右页是正文。翻页是真的翻——纸从书脊那边卷过去。蓝色油墨印字，靛青做鬼影。", groups: [], room: true },
    /* 探索页顺序：先六组新博客（手机笔记），再接四组早期整理稿（聊天记录）。
       后四组 2026-11-27 之前没有任何页面渲染，等于全站点不开，详见 §58。
       双栏流式排下来，后四组正好落在下半页，不打断上面六组。 */
    { no: "Ⅱ", cn: "探索", en: "EXPLORE", lede: "还没想清楚的问题，写了一半的世界，梦里排好的片，还有技术、学习与生活的零碎笔记。", groups: ["blog-dream", "blog-essay", "blog-design", "blog-fiction", "blog-book", "blog-film", "philosophy", "dreams", "creation", "notes"], cols: 2 },
    { no: "Ⅲ", cn: "喜欢", en: "FAVORITES", lede: "看过、听过、借过、玩过——都记一笔。", groups: ["media", "games"], cols: 2 },
    { no: "Ⅳ", cn: "乐趣", en: "PLAYGROUND", lede: "界面和一点风——做出来的东西装在档案袋里。", groups: ["design"], cols: 2 },
    { no: "Ⅴ", cn: "关于", en: "ABOUT", lede: "", groups: ["about"], cols: 1 }
  ];
  var ROMAN = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];

  function renderBody(pg) {
    leafBody.textContent = "";
    if (pg.lede) leafBody.appendChild(L.el("p", "gc-lede drop-lede", pg.lede));
    /* 卷首的「我的房间」：每次翻回这一页都重新随机摆一遍（room.js 负责抽图） */
    if (pg.room && window.ROOM) {
      var roomHost = L.el("div", "room-mount");
      leafBody.appendChild(roomHost);
      window.ROOM.mount(roomHost);
    }
    if (pg.groups.length) {
      var wrap = L.el("div", pg.cols === 2 ? "cols-2" : "");
      pg.groups.forEach(function (gid) {
        var block = L.renderGroupBlock(gid);
        if (block) wrap.appendChild(block);
      });
      leafBody.appendChild(wrap);
    }
  }

  function turn(idx) {
    var pg = PAGES[idx];
    if (!pg) return;

    Array.prototype.forEach.call(toc.children, function (entry, i) {
      entry.classList.toggle("is-here", i === idx);
    });

    // 两段式翻页：先转走 → 换内容 → 转回来
    leaf.classList.add("is-turning");
    window.setTimeout(function () {
      rhNo.textContent = pg.no;
      rhTitle.textContent = pg.cn;
      rhEn.textContent = pg.en;
      folioNo.textContent = "— " + (idx + 1) + " —";
      renderBody(pg);
      leaf.classList.remove("is-turning");
    }, 270);
  }

  function buildToc() {
    PAGES.forEach(function (pg, i) {
      var entry = L.el("button", "toc-entry" + (pg.wall ? " is-wall" : ""));
      entry.type = "button";
      entry.appendChild(L.el("span", "t-no", pg.no));
      entry.appendChild(L.el("span", "t-name", pg.cn));
      entry.appendChild(L.el("span", "t-page", pg.wall ? "52 vols" : "p." + (i + 1)));
      entry.addEventListener("click", function () {
        turn(i);
      });
      toc.appendChild(entry);
    });
  }

  buildToc();
  L.wireWalls();
  L.startTicker(document.getElementById("ticker"));
  turn(0);
})();
