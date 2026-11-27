/*
 * 所有可改内容都在这个文件里。
 * - 加/删名言：直接改 quotes 数组。
 * - 加/删收藏夹：改 bookmarks 数组；id 要唯一。
 * - 文章页在 修改UI界面/pages/ 下；href 用 "../pages/xxx.html"，
 *   相对的是每个布局的 index.html，十套布局共用同一份正文。
 * 2026-11-23：把「最有价值的文件夹」里的 26 篇整理稿接进来，
 * 原来的占位条目凡是能对上的，都换成了真链接。
 * 2026-11-23（第二批）：从 743 个对话的摘录里补了 26 篇，
 * 新增「杂记」分组（技术 / 学习 / 生活），四份占位条目换成真页。
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
      id: "blog-dream",
      label: "梦境",
      note: "梦是另一个片场。16 篇，保留原始的断裂感。",
      items: [
        { title: "水果棺材", note: "被丢在老家 / 捏坏的气球 / 法老与水果墓", tag: "2026", href: "../pages/blog/shui-guo-guan-cai.html" },
        { title: "考场（合辑）", note: "2026-06-21", tag: "2026", href: "../pages/blog/kao-chang.html" },
        { title: "一层套一层（合辑）", note: "2026-05-05", tag: "2026", href: "../pages/blog/yi-ceng-tao-yi-ceng.html" },
        { title: "不存在的楼层", note: "电梯停在一个不存在的楼层，监控拍不到我", tag: "2026", href: "../pages/blog/bu-cun-zai-de-lou-ceng.html" },
        { title: "第一排", note: "穿清朝衣服的老人，第二天全部\"老死了\"", tag: "2025", href: "../pages/blog/di-yi-pai.html" },
        { title: "种植园", note: "生气就长植物的超能力，和一枚落下来的导弹", tag: "2024", href: "../pages/blog/zhong-zhi-yuan.html" },
        { title: "自动切饺子机器", note: "上了非遗的机器，和一支关于上夜班的预告片", tag: "2024", href: "../pages/blog/zi-dong-qie-jiao-zi-ji-qi.html" },
        { title: "地下室", note: "妈妈把我藏在楼下的漫画全扔了", tag: "2024", href: "../pages/blog/di-xia-shi.html" },
        { title: "十六色", note: "一部从彩色褪成像素的电影", tag: "2024", href: "../pages/blog/shi-liu-se.html" },
        { title: "龙卷风", note: "车里看龙卷风，然后远处火山开始喷", tag: "2024", href: "../pages/blog/long-juan-feng.html" },
        { title: "借钱回家", note: "一个人跑去临海的城市，钱花完了", tag: "2024", href: "../pages/blog/jie-qian-hui-jia.html" },
        { title: "不受时间影响的人", note: "女孩问医生：那你怎么办", tag: "2024", href: "../pages/blog/bu-shou-shi-jian-ying-xiang-de-ren.html" },
        { title: "地面下的手", note: "地板冒出一只手，医生说那是楼下的", tag: "2023", href: "../pages/blog/di-mian-xia-de-shou.html" },
        { title: "妈妈背后", note: "旅游时看见母亲，走近发现她背后站着一个我", tag: "2023", href: "../pages/blog/ma-ma-bei-hou.html" },
        { title: "猫头上的角", note: "连环杀手发现自己的猫长了角", tag: "2023", href: "../pages/blog/mao-tou-shang-de-jiao.html" },
      ]
    },
    {
      id: "blog-essay",
      label: "随笔",
      note: "议论与观察，8 篇。",
      items: [
        { title: "寝室是一列火车", note: "你不知道明天醒来时，目的地是什么样", tag: "2026", href: "../pages/blog/qin-shi-shi-yi-lie-huo-che.html" },
        { title: "二次元游戏为什么都在死", note: "它的受众一直被高估了，像一片湖被当成海", tag: "2026", href: "../pages/blog/er-ci-yuan-you-xi-wei-shen-me-dou-zai-si.html" },
        { title: "我们错过的那些机会", note: "CS 的刀、塔科夫的视频、英伟达、比特币，我全都\"知道\"，然后什么都没做", tag: "2026", href: "../pages/blog/wo-men-cuo-guo-de-na-xie-ji-hui.html" },
        { title: "一张纸能保存一部电影吗", note: "我不要复制，我要\"如何拍\"", tag: "2025", href: "../pages/blog/yi-zhang-zhi-neng-bao-cun-yi-bu-dian-ying-ma.html" },
        { title: "会写代码，不等于会做游戏", note: "技术是入场券，不是能力", tag: "2025", href: "../pages/blog/hui-xie-dai-ma-bu-deng-yu-hui-zuo-you-xi.html" },
        { title: "图书馆为什么不进新书", note: "它服务的是\"应该读什么\"，不是\"想读什么\"", tag: "2025", href: "../pages/blog/tu-shu-guan-wei-shen-me-bu-jin-xin-shu.html" },
        { title: "退出键", note: "游戏里可以退出，现实里每次退出都要给理由", tag: "2025", href: "../pages/blog/tui-chu-jian.html" },
        { title: "自己的圈子", note: "我爸说，越学技术，越会质疑自己", tag: "2024", href: "../pages/blog/zi-ji-de-quan-zi.html" },
      ]
    },
    {
      id: "blog-design",
      label: "游戏设计",
      note: "设计笔记与企划，5 篇。",
      items: [
        { title: "白色弥漫：一个关于翻译的游戏", note: "你是全世界唯一听得懂她的人，所有人都等你翻译", tag: "2025", href: "../pages/blog/bai-se-mi-man.html" },
        { title: "卖梦的人", note: "靠做梦谋生的人，最后做不出自己的梦", tag: "2025", href: "../pages/blog/mai-meng-de-ren.html" },
        { title: "黑白世界", note: "颜色不是奖励，是物理法则", tag: "2024", href: "../pages/blog/hei-bai-shi-jie.html" },
        { title: "地图是一种语言", note: "分区即叙事，禁区比房间更有用", tag: "2024", href: "../pages/blog/di-tu-shi-yi-zhong-yu-yan.html" },
        { title: "一条走廊的两种读法", note: "把\"观察\"变成\"承担\"", tag: "2024", href: "../pages/blog/yi-tiao-zou-lang-de-liang-zhong-du-fa.html" },
      ]
    },
    {
      id: "blog-fiction",
      label: "小说与剧本",
      note: "虚构作品，7 篇，含 2 篇剧本。",
      items: [
        { title: "图书馆", note: "小说 · 一个关于捐书的寓言", tag: "2026", href: "../pages/blog/tu-shu-guan.html" },
        { title: "碎梦者（剧本）", note: "2025-03-25", tag: "2025", href: "../pages/blog/sui-meng-zhe.html" },
        { title: "每年关闭一些服务器", note: "小说 · 找一个不存在的家", tag: "2024", href: "../pages/blog/mei-nian-guan-bi-yi-xie-fu-wu-qi.html" },
        { title: "复制体的恋爱", note: "小说 · 用 AI 预判女友", tag: "2024", href: "../pages/blog/fu-zhi-ti-de-lian-ai.html" },
        { title: "太阳西出", note: "小说 · 太阳熄灭的那一天", tag: "2023", href: "../pages/blog/tai-yang-xi-chu.html" },
        { title: "梦如溪般", note: "小说 · 四重梦境循环", tag: "2023", href: "../pages/blog/meng-ru-xi-ban.html" },
        { title: "空痕（剧本）", note: "2023-03-19", tag: "2023", href: "../pages/blog/kong-hen.html" },
      ]
    },
    {
      id: "blog-book",
      label: "读书",
      note: "书评 4 篇。",
      items: [
        { title: "《设计中的设计》：设计不是造物", note: "2024-02-26", tag: "2024", href: "../pages/blog/she-ji-zhong-de-she-ji.html" },
        { title: "《照片的本质》：照片不是现实", note: "2024-02-25", tag: "2024", href: "../pages/blog/zhao-pian-de-ben-zhi.html" },
        { title: "《一个广告人的自白》：广告是为了卖货", note: "2024-02-24", tag: "2024", href: "../pages/blog/yi-ge-guang-gao-ren-de-zi-bai.html" },
        { title: "《基督山伯爵》：复仇完成之后", note: "2024-02-24", tag: "2024", href: "../pages/blog/ji-du-shan-bo-jue.html" },
      ]
    },
    {
      id: "blog-film",
      label: "影评",
      note: "影评 6 篇。",
      items: [
        { title: "《穿越时空的悲鸣与救赎》", note: "2026-01-15", tag: "2026", href: "../pages/blog/bu-neng-shuo-de-mi-mi.html" },
        { title: "《从神性的静默到都市的呢喃》", note: "2025-11-28", tag: "2025", href: "../pages/blog/dao-ma-zei-su-zhou-he.html" },
        { title: "《从街头的跳转到面包店的凝视》", note: "2025-11-06", tag: "2025", href: "../pages/blog/fa-guo-xin-lang-chao.html" },
        { title: "《在笑声中看见时代的眼泪》", note: "2025-10-10", tag: "2025", href: "../pages/blog/mo-deng-shi-dai.html" },
        { title: "《楚门的世界》：被观看的人生", note: "2025-03-04", tag: "2025", href: "../pages/blog/chu-men-de-shi-jie.html" },
        { title: "《时生》：你的决意，我的救赎", note: "2023-10-21", tag: "2023", href: "../pages/blog/shi-sheng.html" },
      ]
    },
    {
      id: "philosophy",
      label: "哲学",
      note: "一些还没想清楚的问题。",
      items: [
        { title: "介质与围墙", note: "社交、孤独，以及我们用来互相抵达的东西。", tag: "随笔", href: "../pages/jiezhi-yu-weiqiang.html" },
        { title: "技术跑得太快", note: "技术必须和社会承载力匹配，不然就是把没装刹车的车交给刚上车的人。", tag: "世界观", href: "../pages/jishu-pao-de-tai-kuai.html" },
        { title: "没有敌人的世界", note: "一个靠“安全冲突”维持秩序的雪原社会。", tag: "世界观", href: "../pages/meiyou-diren.html" },
        { title: "第三条路", note: "四个两难问题，我的答案都是“先不选”。", tag: "随笔", href: "../pages/di-san-tiao-lu.html" },
        { title: "AI 时代的混乱反叛", note: "当所有句子都被写光了，人还能怎么写。", tag: "观点", href: "../pages/hunluan-fanpan.html" },
        { title: "轮回", note: "轮回不在死后，在每天的重复里。", tag: "随笔", href: "../pages/lunhui.html" },
        { title: "上层建筑", note: "“经济基础决定上层建筑”被用来劝我认命。", tag: "随笔", href: "../pages/shangceng-jianzhu.html" },
        { title: "欠与还", note: "被照顾的人，是否天生欠照顾他的人。", tag: "随笔", href: "../pages/qian-yu-huan.html" },
        { title: "表盘上的加法", note: "9 加 4 等于 1，不是算术错了，是数字被弯成了圈。", tag: "随笔", href: "../pages/biaopan-shang-de-jiafa.html" },
        { title: "贫穷不是原罪", note: "穷最贵的地方不是吃穿，是试错成本。", tag: "观察", href: "../pages/pinkun-bushi-yuanzui.html" }
      ]
    },
    {
      id: "dreams",
      label: "解梦",
      note: "解梦、多夜连读，和从梦里长出来的角色。",
      items: [
        { title: "机械人梦", note: "迁徙、断桥，和只剩上半身的自己。", tag: "梦境", href: "../pages/jixie-ren-meng.html" },
        { title: "四夜八梦", note: "连续四晚，八个梦：被抛下、被考验、被评价。", tag: "记梦", href: "../pages/si-ye-ba-meng.html" },
        { title: "梦是潜艇", note: "预知梦、暴露弱点，和梦的边界。", tag: "长文", href: "../pages/meng-shi-qianting.html" },
        { title: "灯守·眠", note: "黑发双辫、闭眼、掌心暖灯的角色。", tag: "角色", href: "../pages/dengshou-mian.html" },
        { title: "没喊完的那半句话", note: "梦里那句“如果警察的目的是抓住坏人……”，一直没喊完。", tag: "记梦", href: "../pages/mei-hanwan-de-banju-hua.html" }
      ]
    },
    {
      id: "creation",
      label: "创作",
      note: "写到一半的世界。",
      items: [
        { title: "三主角的飞船", note: "理科黑客、古风少女、社交达人，一起飞向全灭。", tag: "小说", href: "../pages/san-zhujiao.html" },
        { title: "爬梯见山", note: "无尽梯子、山顶，和一套分镜工作流。", tag: "微剧本", href: "../pages/pa-ti-jian-qinling.html" },
        { title: "寝室剧", note: "导演说缺教室，我补了三场。", tag: "剧本", href: "../pages/qinshi-ju.html" },
        { title: "七幕剧备忘", note: "从性格翻转到性格揭示的校园现实剧。", tag: "剧本", href: "../pages/qimu-ju.html" },
        { title: "旧日记里的世界", note: "十几岁写的末地、深海和早餐室。", tag: "旧稿", href: "../pages/jiu-riji.html" },
        { title: "只有一个天空线", note: "40 秒，一架空中出租车，起飞、飞行、降落。", tag: "短片", href: "../pages/tiankongxian.html" },
        { title: "三个短故事", note: "极简主义者、漆黑一片、女演员出道。", tag: "短篇", href: "../pages/san-ge-duan-gushi.html" },
        { title: "3月32号", note: "一个不存在的一天，和一笔要还的“使用痕迹”。", tag: "短篇", href: "../pages/sanyue-sanshier.html" },
        { title: "造梦者", note: "人类造的梦有爆款，AI 造的没有。", tag: "设定", href: "../pages/zaomengzhe.html" },
        { title: "缺陷即能力", note: "先想他哪里坏了，再让故事从洞里长出来。", tag: "创作谈", href: "../pages/quexian-ji-nengli.html" },
        { title: "保留口语毛边", note: "台词修得太顺，人就不像人了。", tag: "创作谈", href: "../pages/baoliu-kouyu-maobian.html" },
        { title: "从窗到窗", note: "两个空间共用一片叶子，剪一刀就到了公园。", tag: "视听", href: "../pages/cong-chuang-dao-chuang.html" }
      ]
    },
    {
      id: "media",
      label: "书影音",
      note: "看过、听过、借过。",
      items: [
        { title: "宫崎夏次系", note: "读书记，以及一次过度润色的反省。", tag: "漫画" },
        { title: "一张纸存一部电影", note: "保存数据，还是保存“重拍的可能”。", tag: "长文", href: "../pages/yizhangzhi-cun-yibu-dianying.html" },
        { title: "从版权页读销量", note: "版次、印次、印数，是一本书的体检报告。", tag: "淘书", href: "../pages/banquanye-xiaoliang.html" },
        { title: "二手书多，就是坏书吗", note: "二手书少就是好书？先看看是谁在放手。", tag: "淘书", href: "../pages/ershou-shu-cunliang.html" },
        { title: "捐书：把图书馆当保管箱", note: "我只求毕业那天，书都还在。", tag: "捐书记", href: "../pages/juan-shu-baoguanxiang.html" },
        { title: "假如我是图书馆领导", note: "我大概会先删掉我自己爱看的书。", tag: "随笔", href: "../pages/tushuguan-lingdao.html" },
        { title: "大人与小孩", note: "一份双主角片单：大人给规则，小孩给不服从。", tag: "片单", href: "../pages/daren-yu-xiaohai.html" }
      ]
    },
    {
      id: "games",
      label: "游戏",
      note: "玩，也做。",
      items: [
        { title: "白色弥漫", note: "中世纪、坠落飞船，和一次翻译的背叛。", tag: "企划", href: "../pages/baise-miman.html" },
        { title: "随机的迷宫", note: "一格走廊、随机生成，和按 K 指路。", tag: "项目", href: "../pages/suiji-de-migong.html" },
        { title: "塔科夫式背包", note: "按住浮空、松手放置的手机端交互。", tag: "项目", href: "../pages/tarkov-shi-beibao.html" },
        { title: "把考试的次数做成血条", note: "6 颗心，是大学里六次考四级的机会。", tag: "设计", href: "../pages/kaoshi-de-cishu-zuo-cheng-xuetiao.html" },
        { title: "打字即走路", note: "《心墙》：打对一句，往前走一格。", tag: "项目", href: "../pages/dazi-ji-zoulu.html" }
      ]
    },
    {
      id: "design",
      label: "设计",
      note: "把想法做成能摸到的东西。",
      items: [
        { title: "空间魔方", note: "为租房者做小空间定制家具。", tag: "项目", href: "../pages/kongjian-mofang.html" },
        { title: "微光小厨", note: "一只穿白厨师服的鸟，和它的暖色厨房。", tag: "IP", href: "../pages/weiguang-xiaochu.html" },
        { title: "简谱琴键", note: "21 个键放不下时，先删哪三个。", tag: "界面", href: "../pages/jianpu-qinjian.html" },
        { title: "两个 APP 的草图", note: "一个管吃，一个管时间，其实是同一件事。", tag: "产品", href: "../pages/liangge-app-de-caotu.html" }
      ]
    },
    {
      id: "notes",
      label: "杂记",
      note: "技术、学习、生活里的零碎笔记。",
      items: [
        { title: "代码雨、烟花与水滴", note: "让一滴水碎得好看，是我那半年唯一的工作。", tag: "技术", href: "../pages/daomayu-yanhua-shuidi.html" },
        { title: "三渲二的颜色账本", note: "二次元不是滤镜，是一本颜色账。", tag: "技术", href: "../pages/sanxuanger-de-yanse-zhangben.html" },
        { title: "教资赋分制", note: "分数不是你的，是你在队伍里的位置。", tag: "学习", href: "../pages/jiaozi-fufenzhi.html" },
        { title: "哑巴英语", note: "哑巴不是不会说，是没有人给他一个说错也没关系的地方。", tag: "学习", href: "../pages/yaba-yingyu.html" },
        { title: "44 个 Shader 术语", note: "词表是散的，短文是一条线。", tag: "学习", href: "../pages/shader-shuyu-duanwen.html" },
        { title: "凑单经济学", note: "满减不是优惠，是让你替它清库存。", tag: "消费", href: "../pages/coudan-jingjixue.html" },
        { title: "一年后，商家把我解封了", note: "拉黑是短期止损，解封是长期逐利。", tag: "消费", href: "../pages/yinian-hou-jiefeng.html" },
        { title: "宿舍楼下那个没有监控的快递架", note: "方便省了十分钟，风险留给了一个没有监控的架子。", tag: "生活", href: "../pages/kuaidijia-meiyou-jiankong.html" }
      ]
    },
    {
      id: "about",
      label: "关于",
      note: "",
      items: [
        { title: "站主", note: "数字媒体艺术专业。写梦、写句子，做一点游戏和影像。", tag: "人", href: "../pages/guanyu.html" },
        { title: "GitHub", note: "代码、备份，和还没长完的东西。", tag: "代码", href: "https://github.com/skiptopic" },
        { title: "B 站", note: "视频和日常。", tag: "视频", href: "https://space.bilibili.com/400552856" },
        { title: "联系方式", note: "QQ / 邮箱 / 微信：整理中。", tag: "待补" },
        { title: "千万不要点我", note: "一扇关着的门，门后面是还在长的东西。", tag: "说明", egg: "site" }
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
    { id: "shelf-write", kind: "books", label: "写与读", groups: ["philosophy", "dreams", "creation", "notes"] },
    { id: "shelf-read", kind: "books", label: "看与玩", groups: ["media", "games"] },
    { id: "files-made", kind: "files", label: "做出来的", groups: ["design"] }
  ]
};
