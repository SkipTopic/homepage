/* 空间魔方 SpaceCube · 项目档案
   素材来自《空间魔方SpaceCube-脱敏版.pptx》（15 页）：
   logo + 3 张 PPT 实景图 + 一段「项目是做什么」说明，后面才是 13 个章节 + 4 个数字。
   图片只在这份档案里看，不挂 PPT/PDF 下载。
   摆在哪：乐趣 → 设计（站主自己的项目，不是「喜欢」里别人的东西）。 */
(function () {
  "use strict";

  /* 图片跟着 js 走：源页在 ZCode…/布局XX，站点版在 assets/exp/layoutXX，
     两边相对路径不同，用脚本自身地址算 base，logo 和照片才不会 404。 */
  var SCRIPT_BASE = (function () {
    var s = document.currentScript;
    if (!s) {
      var all = document.querySelectorAll('script[src*="project-cube.js"]');
      s = all[all.length - 1];
    }
    if (!s || !s.src) return "";
    return s.src.replace(/[^/]*$/, "");
  })();

  function asset(p) { return SCRIPT_BASE + p; }

  var DATA = {
    logo: "img/spacecube-logo.png",
    kicker: "项目档案 · 大学生创新创业大赛",
    title: "空间魔方",
    en: "SpaceCube",
    sub: "小空间定制化解决方案",
    quote: "方寸之间，自有天地",
    story: {
      lead: "空间魔方不卖家具，帮人把租来的小空间重新定制。",
      paras: [
        "现代人流动性高、搬家越来越频繁。上一间可能是 12㎡ 的合租次卧，下一间是 40㎡ 的老小区一居；房型、层高、采光、收纳位置全变了，旧家具搬过去不是大了就是小了，布局一乱，空间就更不够用。",
        "我们先上门量房，再用 3D 建模把柜体、桌面、睡眠和收纳按新家的尺寸重新排；工厂按模块生产，搬家能拆走、能补件，不用为一间房重买一整套家具。"
      ],
      audience: "适合刚搬家、换租房，或者房间小、角落异形、旧家具不合尺寸的人。",
      steps: [
        { no: "01", t: "量房", d: "异形角落、层高、动线，一次测清" },
        { no: "02", t: "排布", d: "3D 方案先看效果，再决定做什么" },
        { no: "03", t: "交付", d: "模块化生产，搬家能拆走重装" }
      ],
      photos: [
        { src: "img/spacecube-clutter.webp", alt: "搬家后堆满东西的桌面", cap: "东西一多，桌面先失守" },
        { src: "img/spacecube-measure.webp", alt: "用卷尺测量旧书桌", cap: "到了新家，先量清楚每一寸" },
        { src: "img/spacecube-after.webp", alt: "按新尺寸重排后的桌面", cap: "按新尺寸重排后的桌面" }
      ]
    },
    stats: [
      { n: "60%", t: "一线城市租房人群，居住面积不足 15㎡" },
      { n: "80 亿", t: "2025 年小空间定制市场规模" },
      { n: "200+", t: "已完成空间改造案例，满意度 98%" },
      { n: "40 万", t: "首轮资金需求，三年 ROI 超 50%" }
    ],
    chapters: [
      {
        no: "01", t: "市场现状",
        lede: "租房的人越来越多，房子越来越小。",
        points: [
          "一线城市超 60% 租房人群居住面积＜15㎡",
          "小空间定制市场规模预计 2025 年突破 80 亿元",
          "核心用户 18–35 岁，占 90%",
          "空间利用率不足 30%，标准化家具适配性差"
        ]
      },
      {
        no: "02", t: "行业背景",
        lede: "政策在推，需求在涨。",
        points: [
          "小微企业税收优惠：所得税 15%",
          "大学生创业补贴最高 10 万元",
          "定制化家居需求年增 12%",
          "用户愿为「高效 + 美观」多付 20%"
        ]
      },
      {
        no: "03", t: "市场痛点",
        lede: "三个卡点，全在最后一步之前。",
        points: [
          "空间浪费：异形区域装不进标准家具",
          "功能单一：收纳、办公、休闲没法兼顾",
          "体验割裂：自己量、自己买、自己装，门槛太高"
        ]
      },
      {
        no: "04", t: "技术方案",
        lede: "先建模，再下单，误差压到半厘米。",
        points: [
          "Blender 3D 建模 + AI 算法，尺寸误差＜0.5cm",
          "模块化配件：亚克力抽屉、折叠桌等",
          "设计稿直接对接柔性生产"
        ]
      },
      {
        no: "05", t: "服务流程",
        lede: "一条线走完，不用来回跑。",
        points: [
          "需求提交 → 3D 设计 → 柔性生产 → 安装指导",
          "免费 3 次方案修改",
          "社群化设计迭代：老用户提的改动进下一版"
        ]
      },
      {
        no: "06", t: "竞争优势",
        lede: "和三家比，差在哪、强在哪。",
        points: [
          "宜家：品牌与产业链强，标准化产品难适配小户型",
          "淘宝 DIY 店：便宜灵活，但缺设计、售后不稳",
          "Nitori：设计简约，异形空间适配有限、国内渗透低",
          "我们：AI 建模 + 柔性生产 + 一站式交付"
        ]
      },
      {
        no: "07", t: "商业模式",
        lede: "不靠卖家具，靠设计和链路。",
        points: [
          "设计服务费 100 元/次，可抵扣货款",
          "租房平台合作分佣 5%",
          "链路：客户需求 → AI 建模 → 柔性生产 → 分佣/直营"
        ]
      },
      {
        no: "08", t: "团队",
        lede: "六个人，六个岗位。",
        points: [
          "林亦舟：首席设计师，3D 方案设计与优化",
          "陈景和：行业现状、目标客户与市场容量",
          "许诺：对外输出公司文化",
          "顾明远：产品方向模板化",
          "周砚青：调研材料收集与图片处理",
          "沈知行：风险分类清单与对策"
        ]
      },
      {
        no: "09", t: "融资计划",
        lede: "四十万，三块花。",
        points: [
          "资金需求 40 万元",
          "技术研发 30% / 市场推广 40% / 供应链 20%",
          "3 年累计 ROI 超 50%，第 3 年净利率 20%"
        ]
      },
      {
        no: "10", t: "项目成果",
        lede: "已经跑过一遍的数据。",
        points: [
          "合作客户：自如公寓、5 所高校",
          "完成 200+ 空间改造，满意度 98%",
          "首年目标：覆盖 5 万用户，营收 500 万元"
        ]
      },
      {
        no: "11", t: "两个案例",
        lede: "一平米，和一个阳台。",
        points: [
          "高校宿舍 1㎡ 学习角：收纳 + 办公一体化",
          "出租屋阳台变形书桌：可折叠 + 智能照明"
        ]
      },
      {
        no: "12", t: "社会价值",
        lede: "少浪费一点材料，多给几个人岗位。",
        points: [
          "采用 E0 级板材，减少资源浪费",
          "累计提供 20+ 大学生实践岗位",
          "推动小空间定制从小众需求变成大众刚需"
        ]
      },
      {
        no: "13", t: "未来三年",
        lede: "从四个城市，到一套标准。",
        points: [
          "短期 1–2 年：覆盖北上广深，营收破 500 万",
          "中期 3–5 年：拓展智能家居，自适应桌面系统",
          "长期 5–10 年：参与制定行业技术标准"
        ]
      }
    ]
  };

  function el(t, c, x) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (x !== undefined) n.textContent = x;
    return n;
  }

  function logoImg(c, alt) {
    var im = el("img", c);
    im.src = asset(DATA.logo);
    im.alt = alt;
    im.decoding = "async";
    return im;
  }

  function buildStory() {
    var story = el("section", "pjt-story");
    story.setAttribute("aria-label", "项目是做什么的");

    var copy = el("div", "pjt-story-copy");
    copy.appendChild(el("p", "pjt-story-lead", DATA.story.lead));
    DATA.story.paras.forEach(function (t) {
      copy.appendChild(el("p", "pjt-story-p", t));
    });
    if (DATA.story.audience) {
      copy.appendChild(el("p", "pjt-story-audience", DATA.story.audience));
    }

    var steps = el("div", "pjt-steps");
    DATA.story.steps.forEach(function (x) {
      var d = el("div", "pjt-step");
      d.appendChild(el("b", null, x.no + " " + x.t));
      d.appendChild(el("span", null, x.d));
      steps.appendChild(d);
    });
    copy.appendChild(steps);
    story.appendChild(copy);

    var photos = el("div", "pjt-photos");
    DATA.story.photos.forEach(function (p, i) {
      var fig = el("figure", "pjt-photo" + (i === 0 ? " pjt-photo-wide" : ""));
      var im = el("img");
      im.src = asset(p.src);
      im.alt = p.alt;
      im.loading = "lazy";
      im.decoding = "async";
      fig.appendChild(im);
      fig.appendChild(el("figcaption", null, p.cap));
      photos.appendChild(fig);
    });
    story.appendChild(photos);
    return story;
  }

  function build() {
    var s = el("section", "pjt");
    s.setAttribute("aria-label", "项目档案：空间魔方 SpaceCube");

    var head = el("header", "pjt-head");
    head.appendChild(el("p", "pjt-kicker", DATA.kicker));
    var titleRow = el("div", "pjt-title-row");
    titleRow.appendChild(logoImg("pjt-logo", "空间魔方 SpaceCube logo"));
    var h = el("h2", "pjt-title", DATA.title + " ");
    h.appendChild(el("span", "pjt-en", DATA.en));
    titleRow.appendChild(h);
    head.appendChild(titleRow);
    head.appendChild(el("p", "pjt-sub", DATA.sub));
    head.appendChild(el("p", "pjt-quote", "「" + DATA.quote + "」"));
    s.appendChild(head);

    s.appendChild(buildStory());

    var stats = el("div", "pjt-stats");
    DATA.stats.forEach(function (x) {
      var d = el("div", "pjt-stat");
      d.appendChild(el("b", null, x.n));
      d.appendChild(el("span", null, x.t));
      stats.appendChild(d);
    });
    s.appendChild(stats);

    var list = el("ol", "pjt-chapters");
    DATA.chapters.forEach(function (c) {
      var li = el("li", "pjt-ch");
      li.appendChild(el("span", "pjt-no", c.no));
      li.appendChild(el("h3", null, c.t));
      if (c.lede) li.appendChild(el("p", "pjt-lede", c.lede));
      var ul = el("ul", "pjt-points");
      c.points.forEach(function (p) { ul.appendChild(el("li", null, p)); });
      li.appendChild(ul);
      list.appendChild(li);
    });
    s.appendChild(list);

    s.appendChild(el("p", "pjt-end", "—— " + DATA.quote));
    return s;
  }

  function mount(host) {
    if (!host || host.querySelector(".pjt")) return false;
    host.appendChild(build());
    return true;
  }

  /* 项目档案不铺在页面上：只在点了「设计」里的「空间魔方」之后，
     用一层抽屉打开。避免下拉就能直接看到整份 13 章。 */
  var drawer = null;

  function ensureDrawer() {
    if (drawer) return drawer;
    drawer = el("div", "pjt-drawer");
    drawer.hidden = true;
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "项目档案：空间魔方 SpaceCube");

    var bar = el("div", "pjt-drawer-bar");
    var barLeft = el("div", "pjt-drawer-left");
    var barLogo = logoImg("pjt-bar-logo", "");
    barLogo.setAttribute("aria-hidden", "true");
    barLeft.appendChild(barLogo);
    barLeft.appendChild(el("p", "pjt-drawer-kicker", "乐趣 / 设计 · 项目档案"));
    bar.appendChild(barLeft);
    var closeBtn = el("button", "pjt-drawer-close", "合上 ×");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", hide);
    bar.appendChild(closeBtn);
    drawer.appendChild(bar);

    var body = el("div", "pjt-drawer-body");
    drawer.appendChild(body);
    document.body.appendChild(drawer);
    return drawer;
  }

  function show() {
    var d = ensureDrawer();
    var body = d.querySelector(".pjt-drawer-body");
    if (!body.querySelector(".pjt")) mount(body);
    d.hidden = false;
    document.documentElement.classList.add("pjt-drawer-open");
    document.body.classList.add("pjt-drawer-open");
    body.scrollTop = 0;
    var closeBtn = d.querySelector(".pjt-drawer-close");
    if (closeBtn) closeBtn.focus();
  }

  function hide() {
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    document.documentElement.classList.remove("pjt-drawer-open");
    document.body.classList.remove("pjt-drawer-open");
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  /* 十页对「设计」条目的画法不同：有的是 .gc-item，有的是 .bag。
     用捕获阶段统一接住，点「空间魔方」就开抽屉。 */
  function projectEntry(target) {
    var item = target.closest && target.closest(".gc-item, .bag");
    if (!item || item.closest(".pjt-drawer")) return null;
    var label = item.querySelector(".gc-title, .bag-title");
    if (!label) return null;
    if (label.textContent.replace(/\s+/g, "").trim() !== "空间魔方") return null;
    var group = item.closest(".gc-group, .group");
    if (group) {
      var head = group.querySelector(".gc-group-title, .group-title, h3");
      if (head && head.textContent.trim() !== "设计") return null;
    }
    return item;
  }

  document.addEventListener("click", function (e) {
    var item = projectEntry(e.target);
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    show();
  }, true);

  window.PROJECT_CUBE = { data: DATA, mount: mount, open: show, close: hide, logo: asset(DATA.logo) };
})();
