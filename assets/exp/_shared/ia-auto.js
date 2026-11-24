/* 自动适配：给「布局 02–10」用。
   这些页面翻到「喜欢」时才渲染分组，所以盯着 DOM：
   一旦发现「书影音」和「游戏」两个 .gc-group 出现在同一个父节点里，
   就把那个父节点整体换成 IA 的三行栏目。 */
(function () {
  "use strict";

  var lastHost = null;

  function titleOf(g) {
    var t = g.querySelector(".gc-group-title, .group-title, h3");
    return t ? t.textContent.trim() : "";
  }

  function findContainer() {
    var groups = Array.prototype.slice.call(document.querySelectorAll(".gc-group, .group"));
    var media = null, games = null;
    groups.forEach(function (g) {
      var t = titleOf(g);
      if (!media && /书影音|图书馆|媒体/.test(t)) media = g;
      if (!games && /^游戏/.test(t)) games = g;
    });
    /* 必须两个分组同时在场才算「喜欢」的分组容器；
       只在首页当速览出现的单个「书影音」分组不能被整体换成三行栏目。 */
    if (media && games && media.parentNode === games.parentNode) return media.parentNode;
    return null;
  }

  function tryMount() {
    if (!window.IAL) return;
    var box = findContainer();
    if (!box) return;
    /* 页面每次重渲染都会换一个新容器，所以不能只挂一次 */
    if (box === lastHost && box.querySelector(".ial-rows")) return;
    lastHost = box;
    window.IAL.mount(box);
  }

  function boot() {
    tryMount();
    if (!window.MutationObserver) return;
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () { pending = false; tryMount(); }, 120);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
