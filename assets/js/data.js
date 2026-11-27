/*
 * 所有可改内容都在这个文件里。
 * - 加/删名言：直接改 quotes 数组。
 * - 加/删收藏夹：改 bookmarks 数组；id 要唯一。
 * - 以后写好文章：给条目加 href: "./pages/xxx.html"，就会变成真链接。
 */
window.SITE_DATA = {
  quotes: [
    { text: "We are such stuff as dreams are made on.", author: "William Shakespeare" },
    { text: "The wound is the place where the light enters you.", author: "Rumi" },
    { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: "Fyodor Dostoevsky" },
    { text: "In the middle of winter, I at last discovered that there was in me an invincible summer.", author: "Albert Camus" },
    { text: "The absurd is born of this confrontation between the human need and the unreasonable silence of the world.", author: "Albert Camus" },
    { text: "Man is condemned to be free.", author: "Jean-Paul Sartre" },
    { text: "A book must be the axe for the frozen sea within us.", author: "Franz Kafka" },
    { text: "What we call the beginning is often the end.", author: "T. S. Eliot" },
    { text: "The world breaks everyone, and afterward many are strong at the broken places.", author: "Ernest Hemingway" },
    { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
    { text: "We are what we pretend to be, so we must be careful about what we pretend to be.", author: "Kurt Vonnegut" },
    { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
    { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
    { text: "Not all those who wander are lost.", author: "J. R. R. Tolkien" },
    { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton" },
    { text: "What matters most is how well you walk through the fire.", author: "Charles Bukowski" },
    { text: "The dream is the small hidden door in the deepest and most intimate sanctum of the soul.", author: "Carl Jung" },
    { text: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
    { text: "Whereof one cannot speak, thereof one must be silent.", author: "Ludwig Wittgenstein" },
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "The heart has its reasons which reason knows nothing of.", author: "Blaise Pascal" },
    { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
    { text: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein" },
    { text: "No man ever steps in the same river twice.", author: "Heraclitus" },
    { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" }
  ],

  /* 2026-11-27 站主规定：门厅（index.html）不放任何文章。
     所有正文在 ./book/ 里，用的是 book/assets/js/data.js 那一份。
     这一份只留名言和柜子配置。
     原来这里挂着 7 组共 21 条旧占位，全部没有 href，点了只弹「还在整理」，
     站主因此以为文章没上传。整段已清空，别再往这里加条目。
     详见 交接文档.md §58。 */
  bookmarks: [],

  /*
   * 右侧固定柜子的抽屉配置（v0.4）。
   * - kind: "books" 书脊（点开一本 = 打开一个板块的目录）
   *         "files" 档案袋（一个袋子 = 一件作品，点击进下一层或提示）
   *         "card"  小抽屉里的一张卡（点击跳到某个 section）
   * - small: true 的是草图顶部那两只小抽屉
   * - 想换柜子里有什么：改这里就行，不用动 HTML
   */
  cabinets: [
    { id: "card-about", kind: "card", small: true, label: "关于", target: "sec-about" },
    { id: "card-site", kind: "card", small: true, label: "本站", target: "sec-about" },
    { id: "shelf-write", kind: "books", label: "写与读", groups: ["philosophy", "dreams", "creation"] },
    { id: "shelf-read", kind: "books", label: "看与玩", groups: ["media", "games"] },
    { id: "files-made", kind: "files", label: "做出来的", groups: ["design"] }
  ]
};
