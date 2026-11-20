# 本地字体

全部放在 `assets/fonts/`，由 `assets/css/fonts.css` 用 `@font-face` 引入。**不联网、不依赖 Google Fonts CDN。**

## 已加入的字体

| 字体 | 文件 | 字重 | 用途 | 许可证 |
|---|---|---|---|---|
| **Cormorant Garamond** | `cormorant-garamond-normal.woff2` | 300–700（可变） | 门上小字、`who has`、左右名言 | SIL OFL 1.1 |
| Cormorant Garamond Italic | `cormorant-garamond-italic.woff2` | 400 | 门上小字、`who has` 斜体 | SIL OFL 1.1 |
| **Cinzel** | `cinzel-normal.woff2` | 400–900（可变） | 门上 `HE` 的罗马大写 | SIL OFL 1.1 |
| **Space Grotesk** | `space-grotesk-normal.woff2` | 300–700（可变） | 导航、收藏夹、作者名、数字 | SIL OFL 1.1 |

许可证原文：

- `OFL-CormorantGaramond.txt`
- `OFL-Cinzel.txt`
- `OFL-SpaceGrotesk.txt`

## 关于 CC0

严格意义上以 CC0 发布的整套英文字体很少；这里选的是 **SIL Open Font License 1.1**，它允许：

- 免费使用、复制、合并、修改、分发；
- **商用**；
- 嵌入网页和软件；
- 只要保留版权声明与许可证，且不把字体本身单独售卖。

对网站来说，OFL 比 CC0 更常见、也更有保障（包含专利授权）。如果站主坚持只要 CC0，可以再替换。

## 中文字体

中文暂时使用系统字体（Noto Sans SC / 微软雅黑 / 苹方），没有把几 MB 的中文字体放进仓库。
如果以后要统一中文观感，可以再加一套**子集化**的中文字体（只打包网站上实际出现的字），否则全量字体会明显拖慢首屏。

## 怎么换字体

1. 把新的 `.woff2` 放进 `assets/fonts/`，许可证也放进来。
2. 在 `assets/css/fonts.css` 加一个 `@font-face`。
3. 改 `assets/css/tokens.css` 里的变量：
   - `--font-ui` 界面
   - `--font-quote` 左右名言
   - `--font-display` 门上小字 / `who has`
   - `--font-title` 门上 `HE`

## 来源

Google Fonts（字体文件与 OFL 许可证均从官方仓库 / `fonts.gstatic.com` 下载）。
