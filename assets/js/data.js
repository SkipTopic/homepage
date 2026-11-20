/*
 * 所有可改内容都在这个文件里。
 * - 加/删名言：直接改 quotes 数组。
 * - 加/删收藏夹：改 bookmarks 数组；id 要唯一。
 * - 以后写好文章：给条目加 href: "./pages/xxx.html"，就会变成真链接。
 */
window.SITE_DATA = {
  quotes: [
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
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

  bookmarks: [
    {
      id: "philosophy",
      label: "哲学",
      note: "一些还没想清楚的问题。",
      items: [
        { title: "介质与围墙", note: "社交、孤独，以及我们用来互相抵达的东西。", tag: "随笔" },
        { title: "好奇心的休眠与苏醒", note: "应试教育之后，怎么把好奇心重新叫醒。", tag: "随笔" },
        { title: "没有敌人的世界", note: "克隆人、冲突，以及把敌人变成共同体。", tag: "随笔" }
      ]
    },
    {
      id: "dreams",
      label: "梦境",
      note: "梦是另一个片场。",
      items: [
        { title: "机械人梦", note: "迁徙、断桥，和只剩上半身的自己。", tag: "梦境" },
        { title: "梦是潜艇", note: "预知梦、暴露弱点，和梦的边界。", tag: "长文" },
        { title: "灯守·眠", note: "黑发双辫、闭眼、掌心暖灯的角色。", tag: "角色" }
      ]
    },
    {
      id: "creation",
      label: "创作",
      note: "写到一半的世界。",
      items: [
        { title: "三主角的飞船", note: "理科黑客、古风少女、社交达人，一起飞向全灭。", tag: "小说" },
        { title: "爬梯见秦岭", note: "无尽梯子、山顶，和一套分镜工作流。", tag: "微剧本" },
        { title: "七幕寝室剧", note: "从性格翻转到性格揭示的校园现实剧。", tag: "剧本" }
      ]
    },
    {
      id: "media",
      label: "书影音",
      note: "看过、听过、借过。",
      items: [
        { title: "图书馆书架", note: "在借阅、购买和收藏之间。", tag: "书" },
        { title: "宫崎夏次系", note: "读书记，以及一次过度润色的反省。", tag: "漫画" },
        { title: "一张纸存电影", note: "收藏、记忆与载体的尽头。", tag: "影像" }
      ]
    },
    {
      id: "games",
      label: "游戏",
      note: "玩，也做。",
      items: [
        { title: "白色弥漫", note: "中世纪、坠落飞船，和一次翻译的背叛。", tag: "企划" },
        { title: "随机的迷宫", note: "一格走廊、随机生成，和按 K 指路。", tag: "项目" },
        { title: "塔科夫式背包", note: "按住浮空、松手放置的手机端交互。", tag: "项目" }
      ]
    },
    {
      id: "visual",
      label: "影像",
      note: "镜头、转场和一点风。",
      items: [
        { title: "五分钟抵达云端", note: "eVTOL 低空经济，与做减法的三维短片。", tag: "短片" },
        { title: "教室—公园", note: "窗外的树与公园的树重叠，一次匹配剪辑。", tag: "转场" },
        { title: "圣地巡礼", note: "同机位也对不上动画角度：焦距与透视。", tag: "摄影" }
      ]
    },
    {
      id: "design",
      label: "设计",
      note: "把想法做成能摸到的东西。",
      items: [
        { title: "空间魔方", note: "为租房者做小空间定制家具。", tag: "项目" },
        { title: "微光小厨", note: "一只穿白厨师服的鸟，和它的暖色厨房。", tag: "IP" },
        { title: "简谱琴键", note: "21 个键放不下时，先删哪三个。", tag: "界面" }
      ]
    },
    {
      id: "about",
      label: "关于",
      note: "先放三句话，以后再补。",
      items: [
        { title: "站主", note: "数字媒体艺术专业。写梦、写句子，做一点游戏和影像。", tag: "人" },
        { title: "联系方式", note: "QQ / 邮箱 / 微信：整理中。", tag: "待补" },
        { title: "这个站", note: "一扇关着的门，门后面是还在长的东西。", tag: "说明" }
      ]
    }
  ],

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
    { id: "files-made", kind: "files", label: "做出来的", groups: ["visual", "design"] }
  ]
};
