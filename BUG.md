# 程式碼 Review 報告（Bug 與重構）

Review 日期：2026-07-05
範圍：`script.js`、`motor-match.js`、`mahjong-match.js`、`mahjong-4match.js` 與對應 HTML/CSS。

---

## 一、Bug 清單

### B1. `renderTileContent` 被定義兩次（重複函式定義互相覆蓋）
- 位置：`mahjong-match.js`（原第 770 行與第 1177 行）、`mahjong-4match.js`（原第 774 行與第 1181 行）
- 說明：同一檔案內 `renderTileContent` 有兩個定義。JavaScript 函式宣告後者覆蓋前者，第一個版本（emoji／文字牌面路徑）以及它專用的一整組 helper（`renderTextTile`、`renderGraphicTile`、`renderBambooSvg`、`renderCircleSvg`、`renderDragonSvg`、`renderBambooSprig`、`renderSpecialCircle`、`renderCirclePip`、`BAMBOO_COLORS`、`CIRCLE_COLORS`）全部成為永遠不會執行的死碼，約 300 行。
- 影響：目前畫面剛好使用「後面那個」定義所以看起來正常，但任何人修改第一個定義都不會有效果，極易誤導維護。
- 狀態：✅ 已修復（移除死碼版本，live 版本移入共用檔 `mahjong-tiles.js`）

### B2. `renderBambooPip` 被定義兩次且參數簽名不相容
- 位置：`mahjong-match.js`（原第 484 行與第 1122 行）、`mahjong-4match.js`（原第 488 行與第 1126 行）
- 說明：第一個版本吃單一物件參數 `({ x, y, color, rotate, scale })`，第二個版本吃 `(x, y, colorKey, options)`。後者覆蓋前者後，死碼中的 `renderBambooSvg` 仍以 `.map(renderBambooPip)` 傳入物件呼叫——若該路徑被重新啟用，會產生 `translate([object Object] undefined)` 的壞 SVG，是潛在地雷。
- 影響：潛在錯誤 + 維護混淆。
- 狀態：✅ 已修復（僅保留 live 簽名版本於共用檔）

### B3. 過關彈窗的 `setTimeout` 沒有被追蹤，`clearTimers()` 清不掉
- 位置：四個遊戲檔的 `handleMatch()`（例如 `script.js:369`）
- 說明：`window.setTimeout(showLevelCompleteOverlay, 280)` 的回傳 id 沒存進 `state`，`clearTimers()` 無法取消。若在這 280ms 空窗內重新開始關卡（或未來新增任何觸發 `startLevel` 的入口），過關彈窗會在新關卡開始後突然冒出來。
- 影響：時序競態；目前 UI 流程下難以觸發，但屬於未被管理的計時器。
- 狀態：✅ 已修復（新增 `state.levelCompleteTimeoutId`，並於 `clearTimers()` 一併清除）

### B4. `endGame()` 使用過時的 `window.open("", "_self"); window.close();` hack
- 位置：四個遊戲檔的 `endGame()`（例如 `script.js:421`）
- 說明：`window.open("", "_self")` 是舊 IE 時代用來繞過「腳本不得關閉非腳本開啟之視窗」限制的 hack。現代瀏覽器一律不允許關閉使用者自己開啟的分頁，而在部分瀏覽器中 `window.open("", "_self")` 反而可能把當前頁面替換成空白頁，讓後備的「遊戲已結束」彈窗顯示不出來。
- 影響：結束遊戲時可能出現空白頁而非預期的結束畫面。
- 狀態：✅ 已修復（移除 `window.open("", "_self")`，保留 `window.close()` 嘗試與後備彈窗）

### B5. `mahjong-4match.js` 殘留永遠不會執行的關卡／跳關機制死碼
- 位置：`mahjong-4match.js`（`JUMP_STEP`、`getJumpTargets()`、`renderJumpButtons()`、跳關按鈕監聽器、被註解掉的舊 `showLevelCompleteOverlay`、`nextLevelButton` 相關程式）
- 說明：此模式固定 4 對、單一關卡（`getMaxSupportedLevel()` 回傳 `INITIAL_LEVEL`），且 `mahjong-4match.html` 根本沒有 `#next-level-btn`、`#jump-panel`、`#jump-buttons` 元素，這些程式碼全靠 `?.` 防護才不會炸掉，實際上永遠是 no-op。
- 影響：死碼、誤導維護者以為此模式支援跳關。
- 狀態：✅ 已修復（移除死碼，`setLevel` 簡化為固定關卡）

### B6. 被註解掉的舊程式碼區塊殘留
- 位置：`mahjong-match.js` / `mahjong-4match.js`（舊版 `TILE_NUMBER_LABELS`、舊版 `renderCharacterTile` 等以 `/* ... */` 包住的區塊）
- 說明：與現行程式碼重複的註解區塊（僅差在中文字面 vs `\u` 逸出寫法），git 歷史已保留舊版，不需要留在原始碼裡。
- 狀態：✅ 已修復（移除）

### 其他（輕微、未修改）
- 預覽倒數的 `setInterval` 與結束預覽的 `setTimeout` 各跑各的，理論上有 ±1 秒的顯示誤差；實際感受不明顯，未調整。
- `motor-match.js` 沒有其他三個遊戲的手機版 `syncBoardLayout` 縮放邏輯，小螢幕高關卡時棋盤可能需要捲動；屬功能差異而非錯誤，未調整。

---

## 二、重構需求

### R1. 兩個麻將遊戲約 1,100 行完全重複（牌池資料＋牌面 SVG 繪製）
- 說明：`mahjong-match.js` 與 `mahjong-4match.js` 的 `tilePool` 資料（約 300 行）與牌面繪製函式（約 700 行）逐字重複，任何牌面調整都要改兩份（近期 git 歷史也確實是兩份同步改）。
- 處理：✅ 已重構——抽出共用檔 `mahjong-tiles.js`（以 `window.MahjongTiles` 提供 `tilePool` 與 `renderTileContent`），兩個遊戲檔與 HTML 改為引用共用檔。兩檔各縮減約 1,000 行。

### R2. 牌池資料含未使用欄位
- 說明：`tilePool` 的 `symbol`（Unicode 麻將字元）、`variant`、`detail`、`topText` 欄位只被 B1 的死碼使用，live 渲染路徑（`getCardTileType` → SVG）完全不需要。
- 處理：✅ 已重構（隨 R1 一併移除未使用欄位與 `mahjongGlyph()`）

### R3. 四個遊戲的核心翻牌引擎邏輯幾乎逐字重複（建議後續處理）
- 說明：`shuffle`、`state`、`clearTimers`、`setLevel`、`createDeck`、`renderBoard` 骨架、overlay 顯示/隱藏、預覽倒數、`handleMatch`/`handleMismatch`/`onCardSelect`、事件繫結……在四個檔案中重複，僅牌面內容與少數參數不同。理想上應抽成一個 config 驅動的共用引擎（例如 `match-engine.js`），各遊戲只提供牌池、牌面渲染函式與文案。
- 處理：⏸️ 本次未進行。原因：影響範圍涵蓋全部四個遊戲的所有互動流程，在沒有自動化測試的情況下一次改動風險過高；建議作為獨立工作項目，逐一遊戲切換並驗證。本次已先完成風險較低、重複最嚴重的 R1 作為第一步。

---

## 三、修復摘要

| 項目 | 動作 | 影響檔案 |
| --- | --- | --- |
| B1/B2/B6/R1/R2 | 新增共用 `mahjong-tiles.js`，移除兩個麻將檔中的重複定義、死碼、註解殘骸與未使用欄位 | `mahjong-tiles.js`（新增）、`mahjong-match.js`、`mahjong-4match.js`、`mahjong-match.html`、`mahjong-4match.html` |
| B3 | 追蹤過關彈窗計時器（`state.levelCompleteTimeoutId`）並於 `clearTimers()` 清除 | 四個遊戲 JS |
| B4 | 移除 `window.open("", "_self")` hack | 四個遊戲 JS |
| B5 | 移除 `mahjong-4match.js` 的關卡／跳關死碼 | `mahjong-4match.js` |
| R3 | 未處理，建議後續獨立進行 | — |
