/* 布局 09 · 对页书 — 翻页逻辑（2026-11-23）
   左页目录点条目 → 右页真的翻过去（rotateY 两段式）；目录只保留五章正文。 */
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
    { no: "Ⅰ", cn: "卷首", en: "PROLOGUE", lede: "摊开就能读：左页是目次，右页是正文。翻页是真的翻——纸从书脊那边卷过去。蓝色油墨印字，靛青做鬼影。", groups: [] },
    { no: "Ⅱ", cn: "探索", en: "EXPLORE", lede: "还没想清楚的问题，写了一半的世界，梦里排好的片，还有技术、学习与生活的零碎笔记。", groups: ["blog-dream", "blog-essay", "blog-design", "blog-fiction", "blog-book", "blog-film"], cols: 2 },
    { no: "Ⅲ", cn: "喜欢", en: "FAVORITES", lede: "看过、听过、借过、玩过——都记一笔。", groups: ["media", "games"], cols: 2 },
    { no: "Ⅳ", cn: "乐趣", en: "PLAYGROUND", lede: "界面和一点风——做出来的东西装在档案袋里。", groups: ["design"], cols: 2 },
    { no: "Ⅴ", cn: "关于", en: "ABOUT", lede: "", groups: ["about"], cols: 1 }
  ];
  var ROMAN = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];

  function renderBody(pg) {
    leafBody.textContent = "";
    if (pg.lede) leafBody.appendChild(L.el("p", "gc-lede drop-lede", pg.lede));
    if (pg.wall) {
      // 图版页：墙直接印在右页（嵌入形态），不再砸全屏（备用入口在右下角圆钮）
      var wall = L.el("section", "manga-wall is-inline leaf-wall");
      wall.setAttribute("aria-label", "书影音 · 漫画墙（52 本）");
      var sheet = L.el("div", "mw-sheet");
      var head2 = L.el("header", "mw-head");
      var hwrap = L.el("div");
      var kick = L.el("p", "mw-kick", "PLATES · 图版目录 · 对页印刷");
      kick.setAttribute("aria-hidden", "true");
      hwrap.appendChild(kick);
      hwrap.appendChild(L.el("h3", "mw-title", "书影音"));
      hwrap.appendChild(L.el("p", "mw-sub", "52 幅插图印在摊开的书页上，中缝随滚动流过。悬停看图注变深。"));
      head2.appendChild(hwrap);
      var side = L.el("div", "mw-head-side");
      var replay = L.el("button", "mw-replay", "重新付印 ↻");
      replay.type = "button";
      side.appendChild(replay);
      var stamp = L.el("span", "mw-stamp");
      stamp.setAttribute("aria-hidden", "true");
      stamp.appendChild(L.el("span", null, "52"));
      stamp.appendChild(L.el("span", null, "VOLS"));
      side.appendChild(stamp);
      head2.appendChild(side);
      sheet.appendChild(head2);
      sheet.appendChild(L.el("div", "mw-grid"));
      var foot = L.el("footer", "mw-foot");
      var fin = L.el("div", "mw-foot-inner");
      fin.appendChild(L.el("p", "mw-foot-title", "读记在写："));
      fin.appendChild(L.el("div", "mw-foot-links"));
      fin.appendChild(L.el("p", "mw-foot-note", "封面长边 ≤720 · #51 无大陆版暂用台版封面"));
      foot.appendChild(fin);
      sheet.appendChild(foot);
      wall.appendChild(sheet);
      leafBody.appendChild(wall);
      window.__renderMangaInto(wall);
      window.setTimeout(function () {
        window.__replayMangaAt(wall);
      }, 300);
      return;
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
