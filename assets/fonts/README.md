# 本地字体 · 大胆的颜色方案（RISO Ⅰ）

全部放在 `assets/fonts/`，由 `assets/css/fonts.css` 用 `@font-face` 引入。**不联网、不依赖任何 CDN。**
配组来自「大胆01 蓝×荧光红」折页刊：Work Sans / Playfair Display / Lora Italic / Space Mono / 霞鹜文楷。

## 已加入的字体

| 字体 | 文件 | 字重 | 用途 | 许可证 |
|---|---|---|---|---|
| **Work Sans** | `work-sans-latin-400-normal.woff2` / `-700-` | 400 / 700 | 正文 UI 的拉丁字 | SIL OFL 1.1 |
| **Playfair Display** | `playfair-display-latin-400-normal.woff2` / `-700-` | 400 / 700 | 展示体、页码大编号、门上 HE | SIL OFL 1.1 |
| **Lora Italic** | `lora-latin-400-italic.woff2` | 400 italic | 名言、门上小字（斜体衬线） | SIL OFL 1.1 |
| **Space Mono** | `space-mono-latin-400-normal.woff2` | 400 | 刊号、kicker、编号、印刷小注 | SIL OFL 1.1 |
| **霞鹜文楷 Medium（子集）** | `LXGWWenKai-Medium-subset.woff2` | 400–700 | 中文标题/书脊/条目/墙名字条 | SIL OFL 1.1 |

## 关于文楷子集

- 全量 TTF 24MB 太重；`ZCode的工作区域/漫画封面脚本/subset_wenkai.py` 按**站内实际用字**（index.html + data.js + manga-data.js + manga.js，782 字）子集化成 162KB。
- **以后往 data.js 加新汉字**：重跑一遍该脚本即可，否则新字会回退到系统宋体（不会豆腐块，但字形不一致）。
- 拉丁字五件套来自 `方案库/fonts/`（npmmirror fontsource 渠道，全 OFL）。

## 版本

- v0.4 的 Cormorant Garamond / Cinzel / Space Grotesk 已随旧皮肤退役；正式站（仓库根目录）不受影响。
