/* 信息层级（IA）· 轻量版：给「大胆十页」共用
   把 #sec-like 里的分组列表换成「三行栏目 → 书架 / 游戏 / 影像」。
   数据：window.MANGA_DATA（52 本）、window.GAME_LIB（83 款）。 */
(function () {
  "use strict";

  var MANGA = window.MANGA_DATA || [];
  var LIB = window.GAME_LIB || [];

  /* ---------- 图书馆的二级分类（2026-11-25 站主要求） ----------
     一级：喜欢 → 图书馆书架；二级：纯漫画 / 文学。
     · 漫画 = MANGA_DATA（封面是扫描图，assets/img/covers/）；
     · 文学 = 下面这张 LIT 表（封面在 assets/img/books/，豆瓣条目按站主点名的版本取）。
       加书就往 LIT 里加一条：
       no / title / author / genre / pub / trans / status / d / cover / douban。
       cover 只写文件名，路径由 BOOK_BASE 按脚本位置算，站根和子目录都能用；
       没有 cover 的条目会退成「字封面」（竖排书名，见 textCover）。 */
  var LIT = [
    { no: "文 01", title: "我与地坛", author: "史铁生", genre: "散文",
      pub: "人民文学出版社 · 2011", cover: "01.jpg",
      douban: "https://book.douban.com/subject/5910656/",
      d: "地坛、母亲、病和时间。轮椅停在园子里，话一句一句说完。" },
    { no: "文 02", title: "三日间的幸福", author: "三秋缒", genre: "小说",
      pub: "百花洲文艺出版社 · 2017", trans: "许郁文", cover: "02.jpg",
      douban: "https://book.douban.com/subject/26980300/",
      d: "他把余下的寿命一年一年卖掉，只剩两个月时，遇见了监视员宫城。" },
    { no: "文 03", title: "义忆", author: "三秋缒", genre: "小说",
      pub: "新星出版社 · 2020", trans: "林枫", cover: "03.jpg",
      douban: "https://book.douban.com/subject/35239428/",
      d: "在可以购买虚假记忆的世界，他植入的“发小”某天真的出现在眼前。" },
    { no: "文 04", title: "夜蝉", author: "北村薰", genre: "推理",
      pub: "贵州人民出版社 · 2025", trans: "董纾含", cover: "04.jpg",
      douban: "https://book.douban.com/subject/37183412/",
      d: "嗜书少女和落语大师圆紫，三个短篇，夏天末尾的一点心事。" },
    { no: "文 05", title: "魔女宅急便6：新的启程", author: "角野荣子", genre: "童话",
      pub: "新星出版社 · 2015", trans: "田秀娟", cover: "05.jpg",
      douban: "https://book.douban.com/subject/26542927/",
      d: "琪琪当了妈妈，十一岁的双胞胎要自己决定：魔女这条路还走不走。" },
    { no: "文 06", title: "挪威的森林", author: "村上春树", genre: "小说",
      pub: "上海译文出版社 · 2001", trans: "林少华", cover: "06.jpg",
      douban: "https://book.douban.com/subject/1046265/",
      d: "渡边、直子、绿子。二十岁前后的爱和失去，和深山里的疗养院。" },
    { no: "文 07", title: "不哭不哭，痛痛飞走吧", author: "三秋缒", genre: "小说",
      pub: "新星出版社 · 2020", trans: "邱钟仁", cover: "07.jpg",
      douban: "https://book.douban.com/subject/34932097/",
      d: "他害死了一个女孩，女孩把死亡推迟十天，要他陪着去复仇。" },
    { no: "文 08", title: "我的造梦之路", author: "今敏", genre: "随笔",
      pub: "新星出版社 · 2015", trans: "焦阳", cover: "08.jpg",
      douban: "https://book.douban.com/subject/26613052/",
      d: "今敏的随笔集：从《未麻的房间》到《千年女优》，梦怎么变成画面。" },
    { no: "文 09", title: "恶意", author: "东野圭吾", genre: "推理",
      pub: "南海出版公司 · 2016", trans: "娄美莲", cover: "09.jpg",
      douban: "https://book.douban.com/subject/26877752/",
      d: "畅销作家被杀，凶手很快认罪，可动机怎么也说不通。" },
    { no: "文 10", title: "时生", author: "东野圭吾", genre: "小说",
      pub: "南海出版公司 · 2010", trans: "徐建雄", cover: "10.jpg",
      douban: "https://book.douban.com/subject/4152754/",
      d: "儿子走到生命尽头，父亲想起二十年前，他们其实已经见过。" },
    { no: "文 11", title: "失踪假日", author: "乙一", genre: "推理",
      pub: "浙江人民出版社 · 2020", trans: "张秀强 等", cover: "11.jpg",
      douban: "https://book.douban.com/subject/35094679/",
      d: "三个短篇：和亡灵同住、藏起一截手指、失踪的少女与绑架犯。" },
    { no: "文 12", title: "银河铁道之夜", author: "宫泽贤治", genre: "童话",
      pub: "上海译文出版社 · 2023", trans: "王小燕", cover: "12.jpg",
      douban: "https://book.douban.com/subject/36321612/",
      d: "乔凡尼在梦里搭上一列开往天国的火车，窗外是银河。" },
    { no: "文 13", title: "夏天、烟火和我的尸体", author: "乙一", genre: "推理",
      pub: "南海出版公司 · 2019", trans: "连子心", cover: "13.jpg",
      douban: "https://book.douban.com/subject/34778574/",
      d: "九岁那年的夏天，我从树上摔下去死了，然后看着他们藏我。" },
    { no: "文 14", title: "月亮与六便士", author: "毛姆", genre: "小说",
      pub: "浙江文艺出版社 · 2017", trans: "徐淳刚", cover: "14.jpg",
      douban: "https://book.douban.com/subject/26954760/",
      d: "四十岁抛下一切去画画的人。满地都是六便士，他抬头看月亮。" },
    { no: "文 15", title: "又做了，相同的梦", author: "住野夜", genre: "小说",
      pub: "化学工业出版社 · 2021", trans: "吕灵芝", cover: "15.jpg",
      douban: "https://book.douban.com/subject/35407568/",
      d: "没有朋友的小女孩，为了回答“幸福是什么”，每天去找她的奇怪朋友。" },
    { no: "文 16", title: "嫌疑人X的献身", author: "东野圭吾", genre: "推理",
      pub: "南海出版公司 · 2008", trans: "刘子倩", cover: "16.jpg",
      douban: "https://book.douban.com/subject/3211779/",
      d: "邻居母女失手杀了人，数学天才石神替她们布了一个警方撬不开的局。" }
  ];
  /* 给别的模块留个口子（以后对页书要摆同一份清单，直接读这里） */
  window.LIT_DATA = LIT;

  /* ---------- 小说的第三格（2026-11-25 晚第三批，站主点名） ----------
     字段和 LIT 完全一样；封面在 assets/img/books/novel/。 */
  var NOVELS = [
    { no: "小 01", title: "太宰治的词典", author: "北村薰", genre: "推理",
      pub: "贵州人民出版社 · 2025", trans: "董纾含", cover: "novel/01.jpg",
      douban: "https://book.douban.com/subject/37183410/",
      d: "圆紫系列终章。一本旧书里翻出皮埃尔·洛蒂的名字，太宰治、芥川、三岛由纪夫一路串下去。" },
    { no: "小 02", title: "梦日记：你的梦中，我已不在", author: "日日日", genre: "小说",
      pub: "PHP研究所 · 2013（日文原版）", cover: "novel/02.jpg",
      douban: "https://book.douban.com/subject/24935025/",
      d: "游戏《梦日记》的小说化：少女在梦里推开一扇扇门，门后没有出口。" },
    { no: "小 03", title: "苹果树上的外婆", author: "米拉·洛贝", genre: "儿童文学",
      pub: "新蕾出版社 · 2011（升级版）", trans: "张桂贞", cover: "novel/03.jpg",
      douban: "https://book.douban.com/subject/5404942/",
      d: "安迪没有外婆也没有奶奶，有一天外婆坐在他家的苹果树上，带他去冒险。" },
    { no: "小 04", title: "寻路中国：从乡村到工厂的自驾之旅", author: "彼得·海斯勒", genre: "纪实",
      pub: "上海译文出版社 · 2011", trans: "李雪顺", cover: "novel/04.jpg",
      douban: "https://book.douban.com/subject/5414391/",
      d: "何伟租一辆车，从长城脚下开到浙江的工厂，把变化中的中国一路记下来。" },
    { no: "小 05", title: "浴缸生活", author: "四季大雅", genre: "小说",
      pub: "尖端出版 · 2024", trans: "蔡柏頤", cover: "novel/05.jpg",
      douban: "https://book.douban.com/subject/37038235/",
      d: "二十二岁的矶原鱂受不了上司，搬回家，最后住进浴缸——至少水里安静。" },
    { no: "小 06", title: "世上为什么要有图书馆", author: "杨素秋", genre: "纪实",
      pub: "上海译文出版社 · 2024", cover: "novel/06.jpg",
      douban: "https://book.douban.com/subject/36593622/",
      d: "文学老师去碑林区挂职，接手一个建在地下、没几本书的图书馆，从编书目开始。" },
    { no: "小 07", title: "三体Ⅲ：死神永生", author: "刘慈欣", genre: "科幻",
      pub: "重庆出版社 · 2010", cover: "novel/07.jpg",
      douban: "https://book.douban.com/subject/5363767/",
      d: "黑暗森林之后，太阳系直面宇宙最底层的毁灭力量。三部曲的终章。" },
    { no: "小 08", title: "别哭", author: "曲小蛐", genre: "小说",
      pub: "百花洲文艺出版社 · 2021", cover: "novel/08.jpg",
      douban: "https://book.douban.com/subject/35373680/",
      d: "失明的唐染收到一台仿生机器人，黑暗里有人对她说：晚上好，主人。" },
    { no: "小 09", title: "仿造品和绚丽多彩的灰", author: "loundraw", genre: "小说",
      pub: "新星出版社 · 2019", trans: "miyuki", cover: "novel/09.jpg",
      douban: "https://book.douban.com/subject/34887326/",
      d: "蓝眼睛的少女带着旧相机像候鸟一样出现，少年一路追着她的轨迹。" },
    { no: "小 10", title: "白痴", author: "陀思妥耶夫斯基", genre: "小说",
      pub: "上海译文出版社 · 2015", trans: "荣如德", cover: "novel/10.jpg",
      douban: "https://book.douban.com/subject/25887933/",
      d: "梅诗金公爵回到彼得堡，被所有人叫作白痴——陀思妥耶夫斯基的晚年长篇。" },
    { no: "小 11", title: "我想成为你的眼泪", author: "四季大雅", genre: "小说",
      pub: "国际文化出版公司 · 2024", trans: "陈忠胜", cover: "novel/11.jpg",
      douban: "https://book.douban.com/subject/36673152/",
      d: "母亲变成盐的那个夏天之后，摇月的钢琴声是唯一的光；她的左手无名指断了。" },
    { no: "小 12", title: "仿生人会梦见电子羊吗？", author: "菲利普·迪克", genre: "科幻",
      pub: "译林出版社 · 2017", trans: "许东华", cover: "novel/12.jpg",
      douban: "https://book.douban.com/subject/27041533/",
      d: "赏金猎人追捕仿生人的一天，也是他开始怀疑自己的一天。" },
    { no: "小 13", title: "麦田里的守望者", author: "塞林格", genre: "小说",
      pub: "译林出版社 · 2018", trans: "孙仲旭", cover: "novel/13.jpg",
      douban: "https://book.douban.com/subject/26905152/",
      d: "霍尔顿被学校开除，在纽约晃了三天，看谁都是假货。" },
    { no: "小 14", title: "你当像鸟飞往你的山", author: "塔拉·韦斯特弗", genre: "回忆录",
      pub: "南海出版公司 · 2019", trans: "任爱红", cover: "novel/14.jpg",
      douban: "https://book.douban.com/subject/33440205/",
      d: "在爱达荷的山里长大，十七岁前没进过教室，后来一路读到剑桥。" },
    { no: "小 15", title: "日瓦戈医生", author: "帕斯捷尔纳克", genre: "小说",
      pub: "上海译文出版社 · 2020", trans: "白春仁 / 顾亚铃", cover: "novel/15.jpg",
      douban: "https://book.douban.com/subject/6952192/",
      d: "医生日瓦戈在革命与战争的缝隙里活着、爱着、写诗。" }
  ];
  window.NOVEL_DATA = NOVELS;

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
  /* 文学封面目录：同理按脚本位置算（_shared → exp → assets/img/books/） */
  var BOOK_BASE = IA_SCRIPT
    ? new URL("../../img/books/", IA_SCRIPT.src).href
    : "../assets/img/books/";
  var host = null;
  var view = "hub";
  /* 嵌入在海报/弹层里时不能滚窗口（会把整张海报顶出视口），由调用方 noScroll 关掉 */
  var noScroll = false;

  var shelfState = { q: "", status: "全部", cat: "全部" };
  var gameState = { q: "", genre: "全部" };

  /* 漫画 + 文学 + 小说合成一张书架；i 是各自数组里的原始下标，阅读状态占位要靠它算 */
  function shelfEntries() {
    var out = [];
    MANGA.forEach(function (m, i) { out.push({ item: m, i: i, cat: "漫画" }); });
    LIT.forEach(function (b, i) { out.push({ item: b, i: i, cat: "文学" }); });
    NOVELS.forEach(function (n, i) { out.push({ item: n, i: i, cat: "小说" }); });
    return out;
  }
  function totalBooks() { return MANGA.length + LIT.length + NOVELS.length; }

  function el(t, c, x) {
    var n = document.createElement(t);
    if (c) n.className = c;
    if (x !== undefined) n.textContent = x;
    return n;
  }

  /* 阅读状态：漫画还没有真字段，按编号粗分（占位）；
     文学 / 小说在数据里写了 status 就直接读（目前都没写，走占位）。 */
  function statusOf(entry) {
    var m = entry.item || {};
    if (m.status) return m.status;
    var k = entry.i % 3;
    return k === 0 ? "读完" : k === 1 ? "在读" : "想看";
  }

  /* 某类别下的书（不算搜索词）：给左栏计数用 */
  function inCat(entry, cat) {
    return cat === "全部" || entry.cat === cat;
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
      { v: "shelf", no: "01", name: "图书馆书架", note: "分三格：纯漫画、文学、小说。左边筛，右边墙。", n: totalBooks() + " 本" },
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
    /* 打乱的是「条目 + 原始下标」的配对：statusOf 按原下标算阅读状态，不能丢 */
    SHELF_ORDER = shuffleList(shelfEntries());
    var frag = document.createDocumentFragment();
    frag.appendChild(crumb("图书馆书架"));
    var wrap = el("div", "ial-shelf");

    var rail = el("div", "ial-rail");
    rail.id = "ial-shelf-rail";
    rail.appendChild(el("h4", null, "搜索"));
    var s = document.createElement("input");
    s.className = "ial-search";
    s.type = "search";
    s.placeholder = "书名 / 作者";
    s.value = shelfState.q;
    s.addEventListener("input", function () { shelfState.q = s.value.trim(); paintShelf(); });
    rail.appendChild(s);

    /* 二级分类：纯漫画 / 文学 / 小说（站主 2026-11-25 要求，分两批加齐） */
    rail.appendChild(el("h4", null, "类别"));
    var catBox = el("div", "ial-cat");
    [
      { k: "全部", label: "全部", n: totalBooks() },
      { k: "漫画", label: "纯漫画", n: MANGA.length },
      { k: "文学", label: "文学", n: LIT.length },
      { k: "小说", label: "小说", n: NOVELS.length }
    ].forEach(function (c) {
      var b = el("button", "ial-filter", c.label);
      b.type = "button";
      b.dataset.cat = c.k;
      b.appendChild(el("em", null, String(c.n)));
      if (shelfState.cat === c.k) b.classList.add("is-on");
      b.addEventListener("click", function () {
        shelfState.cat = c.k;
        Array.prototype.forEach.call(rail.querySelectorAll(".ial-filter[data-cat]"), function (x) {
          x.classList.toggle("is-on", x.dataset.cat === c.k);
        });
        paintRailCounts();
        paintShelf();
      });
      catBox.appendChild(b);
    });
    rail.appendChild(catBox);

    rail.appendChild(el("h4", null, "阅读状态"));
    ["全部", "读完", "在读", "想看"].forEach(function (st) {
      var b = el("button", "ial-filter", st);
      b.type = "button";
      b.dataset.st = st;
      b.appendChild(el("em", null, String(shelfCount(st))));
      if (shelfState.status === st) b.classList.add("is-on");
      b.addEventListener("click", function () {
        shelfState.status = st;
        Array.prototype.forEach.call(rail.querySelectorAll(".ial-filter[data-st]"), function (x) {
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

  /* 某个阅读状态在当前类别下有几本（「全部」就是当前类别的总数） */
  function shelfCount(st) {
    var list = SHELF_ORDER || shelfEntries();
    return list.filter(function (e) {
      return inCat(e, shelfState.cat) && (st === "全部" || statusOf(e) === st);
    }).length;
  }

  /* 换类别后，把「阅读状态」那几行的数字跟着换掉 */
  function paintRailCounts() {
    var rail = document.getElementById("ial-shelf-rail");
    if (!rail) return;
    Array.prototype.forEach.call(rail.querySelectorAll(".ial-filter[data-st]"), function (b) {
      var em = b.querySelector("em");
      if (em) em.textContent = String(shelfCount(b.dataset.st));
    });
  }

  /* 文学没有扫描封面时：排一张字封面（竖排书名 + 作者），不用图片 */
  function textCover(m) {
    var cv = el("span", "ial-cover");
    cv.appendChild(el("span", "ial-cover-kick", "LITERATURE"));
    cv.appendChild(el("span", "ial-cover-title", m.title));
    cv.appendChild(el("span", "ial-cover-foot", (m.author || "—") + (m.genre ? " · " + m.genre : "")));
    return cv;
  }

  /* 封面地址：文学写 cover 文件名（目录按脚本位置算），漫画写 file（各自数据里的相对路径） */
  function coverOf(m) {
    if (m.cover) return BOOK_BASE + m.cover;
    return m.file || "";
  }

  function bandHead(cat, n) {
    var LABEL = {
      "漫画": ["纯漫画", "COMICS"],
      "文学": ["文学", "LITERATURE"],
      "小说": ["小说", "NOVELS"]
    };
    var lb = LABEL[cat] || [cat, ""];
    var p = el("p", "ial-band");
    p.appendChild(el("b", null, lb[0]));
    p.appendChild(el("i", null, lb[1]));
    p.appendChild(el("em", null, n + " 本"));
    return p;
  }

  function bookTile(entry) {
    var m = entry.item;
    var st = statusOf(entry);
    var b = el("button", "ial-book");
    b.type = "button";
    var src = coverOf(m);
    if (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = m.title + " 封面";
      img.loading = "lazy";
      if (m.cover) {
        /* 文学封面：竖版书封比例不统一（2:3 ~ 0.62），不硬裁，
           外面衬一圈纸当「裱」——裁了会切掉封面上的书名。 */
        b.classList.add("is-lit");
        var shot = el("span", "ial-shot");
        shot.appendChild(img);
        b.appendChild(shot);
      } else {
        b.appendChild(img);
      }
      b.appendChild(el("b", null, m.title));
    } else {
      /* 字封面已经把书名竖排印在封面上了，下面这行就不再重复书名，改记编号 + 作者 */
      b.classList.add("is-text");
      b.appendChild(textCover(m));
      b.appendChild(el("b", null, (m.no || "文") + " · " + (m.author || "—")));
    }
    b.title = m.title + " · " + (m.author || "—") + " · " + st;
    b.addEventListener("click", function () { card(m, st, entry.cat); });
    return b;
  }

  function paintShelf() {
    var wall = document.getElementById("ial-shelf-wall");
    if (!wall) return;
    wall.textContent = "";
    var q = shelfState.q.toLowerCase();
    var list = (SHELF_ORDER || shelfEntries()).filter(function (entry) {
      if (!inCat(entry, shelfState.cat)) return false;
      if (shelfState.status !== "全部" && statusOf(entry) !== shelfState.status) return false;
      if (q) {
        var m = entry.item;
        if ((m.title + " " + (m.author || "")).toLowerCase().indexOf(q) < 0) return false;
      }
      return true;
    });

    var n = 0;
    wall.classList.toggle("is-banded", shelfState.cat === "全部");
    if (shelfState.cat === "全部") {
      /* 「全部」时按二级分类分成三带：纯漫画 → 文学 → 小说；带内保持打开时的随机顺序。
         每带是「横带 + 一片自己的网格」：横带 sticky 粘在本带顶上，
         滚到下一带时被本带底边推走，两条标题不会叠在一起。 */
      ["漫画", "文学", "小说"].forEach(function (c) {
        var group = list.filter(function (e) { return e.cat === c; });
        if (!group.length) return;
        var g = el("div", "ial-group");
        g.appendChild(bandHead(c, group.length));
        var grid = el("div", "ial-wall-grid");
        group.forEach(function (e) { n++; grid.appendChild(bookTile(e)); });
        g.appendChild(grid);
        wall.appendChild(g);
      });
    } else {
      list.forEach(function (e) { n++; wall.appendChild(bookTile(e)); });
    }
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
    if (m.douban) return m.douban;
    /* 没有条目地址时退到豆瓣搜索：至少点下去能看到这本书，不是死链 */
    if (m.title) {
      return "https://search.douban.com/book/subject_search?search_text=" + encodeURIComponent(m.title);
    }
    return "";
  }

  function card(m, st, cat) {
    var box = modalShell();

    var c = el("div", "ial-card");
    var fig = el("div", "ial-fig");
    var src = coverOf(m);
    if (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = m.title + " 封面";
      if (m.cover) {
        /* 卡片里给完整封面：按原比例，不裁也不衬纸 */
        c.classList.add("is-lit");
        fig.classList.add("is-lit");
      }
      fig.appendChild(img);
    } else {
      fig.classList.add("is-text");
      fig.appendChild(textCover(m));
    }
    c.appendChild(fig);

    var body = el("div", "ial-body");
    body.appendChild(el("p", "ial-kick", cat === "漫画"
      ? "收藏编号 " + (m.no || "—")
      : cat + " · " + (m.genre || "—")));
    body.appendChild(el("h3", null, m.title));
    body.appendChild(el("p", "ial-kv", "作者 " + (m.author || "—")));
    if (m.pub) body.appendChild(el("p", "ial-kv", "版本 " + m.pub + (m.trans ? " · " + m.trans + " 译" : "")));
    body.appendChild(el("span", "ial-stamp", st));
    body.appendChild(el("p", "ial-desc", m.d || "这本的读记还没写完，先在架子上记住它。"));

    var actions = el("div", "ial-actions");
    var db = el("a", "ial-btn is-solid", m.douban ? "豆瓣条目 ↗" : "豆瓣搜一搜 ↗");
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
