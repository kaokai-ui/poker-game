const INITIAL_PREVIEW_SECONDS = 5;
const MISMATCH_DELAY_MS = 900;
const MATCH_DELAY_MS = 450;
const INITIAL_LEVEL = 1;
const INITIAL_PAIR_COUNT = 2;
const JUMP_STEP = 5;
const MOBILE_BREAKPOINT = 768;
const CARD_ASPECT_RATIO = 0.72;
const MOBILE_BOTTOM_GUTTER = 28;

const TILE_ART_COLORS = {
  blue: "#4b63a2",
  blueDark: "#33497d",
  green: "#2f8c61",
  greenDark: "#1d6747",
  red: "#c65058",
  redDark: "#95383e",
  gold: "#d8b45a",
  frame: "#d8d0c4",
  shadow: "#e7dfd1"
};
/*
const TILE_NUMBER_LABELS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const TILE_HONOR_LABELS = {
  E: "東",
  S: "南",
  W: "西",
  N: "北",
  R: "中",
  G: "發"
};

const NUMBER_WORDS = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
*/
const TILE_NUMBER_LABELS = ["", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d"];
const TILE_HONOR_LABELS = {
  E: "\u6771",
  S: "\u5357",
  W: "\u897f",
  N: "\u5317",
  R: "\u4e2d",
  G: "\u767c"
};
const NUMBER_WORDS = ["\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d"];

const BAMBOO_COLORS = {
  green: "#67ab8c",
  darkGreen: "#43886a",
  blue: "#5a6aa1",
  red: "#d97982"
};
const CIRCLE_COLORS = {
  blue: "#5c6da7",
  red: "#d8787f",
  green: "#79af8d"
};

function mahjongGlyph(codePoint) {
  return String.fromCodePoint(codePoint);
}

function createWanTiles() {
  return NUMBER_WORDS.map((word, index) => ({
    key: `wan-${index + 1}`,
    face: `${word}萬`,
    category: "萬子",
    alias: "萬",
    detail: "數牌",
    accent: "#2563eb",
    tint: "#eaf2ff",
    ink: "#1d4ed8",
    displayType: "wan",
    topText: word
  }));
}

function createBambooTiles() {
  return NUMBER_WORDS.map((word, index) => ({
    key: `sou-${index + 1}`,
    face: `${word}條`,
    category: "索子",
    alias: "條子",
    detail: "數牌",
    accent: "#15803d",
    tint: "#e8f9ee",
    ink: "#166534",
    displayType: "bamboo",
    symbol: mahjongGlyph(0x1f010 + index),
    value: index + 1
  }));
}

function createCircleTiles() {
  return NUMBER_WORDS.map((word, index) => ({
    key: `tong-${index + 1}`,
    face: `${word}筒`,
    category: "筒子",
    alias: "餅",
    detail: "數牌",
    accent: "#b91c1c",
    tint: "#fff1f1",
    ink: "#b91c1c",
    displayType: "circle",
    symbol: mahjongGlyph(0x1f019 + index),
    value: index + 1
  }));
}

const tilePool = [
  ...createWanTiles(),
  ...createBambooTiles(),
  ...createCircleTiles(),
  {
    key: "wind-east",
    face: "東",
    category: "風牌",
    alias: "風牌",
    detail: "東風",
    accent: "#475569",
    tint: "#f3f4f6",
    ink: "#334155",
    displayType: "wind",
    glyph: "東"
  },
  {
    key: "wind-south",
    face: "南",
    category: "風牌",
    alias: "風牌",
    detail: "南風",
    accent: "#475569",
    tint: "#f3f4f6",
    ink: "#334155",
    displayType: "wind",
    glyph: "南"
  },
  {
    key: "wind-west",
    face: "西",
    category: "風牌",
    alias: "風牌",
    detail: "西風",
    accent: "#475569",
    tint: "#f3f4f6",
    ink: "#334155",
    displayType: "wind",
    glyph: "西"
  },
  {
    key: "wind-north",
    face: "北",
    category: "風牌",
    alias: "風牌",
    detail: "北風",
    accent: "#475569",
    tint: "#f3f4f6",
    ink: "#334155",
    displayType: "wind",
    glyph: "北"
  },
  {
    key: "dragon-red",
    face: "紅中",
    category: "三元牌",
    alias: "三元",
    detail: "紅中",
    accent: "#dc2626",
    tint: "#fff1f1",
    ink: "#b91c1c",
    displayType: "dragon",
    symbol: mahjongGlyph(0x1f004),
    variant: "red"
  },
  {
    key: "dragon-green",
    face: "發財",
    category: "三元牌",
    alias: "三元",
    detail: "發財",
    accent: "#15803d",
    tint: "#eefbf2",
    ink: "#166534",
    displayType: "dragon",
    symbol: mahjongGlyph(0x1f005),
    variant: "green"
  },
  {
    key: "dragon-white",
    face: "白板",
    category: "三元牌",
    alias: "三元",
    detail: "白板",
    accent: "#94a3b8",
    tint: "#f8fafc",
    ink: "#334155",
    displayType: "dragon",
    symbol: mahjongGlyph(0x1f006),
    variant: "white"
  },
  {
    key: "flower-spring",
    face: "春",
    category: "花牌",
    alias: "四季",
    detail: "春",
    accent: "#a855f7",
    tint: "#f7ecff",
    ink: "#7e22ce",
    displayType: "flower",
    glyph: "春",
    mark: "✿"
  },
  {
    key: "flower-summer",
    face: "夏",
    category: "花牌",
    alias: "四季",
    detail: "夏",
    accent: "#f97316",
    tint: "#fff2e8",
    ink: "#c2410c",
    displayType: "flower",
    glyph: "夏",
    mark: "✿"
  },
  {
    key: "flower-autumn",
    face: "秋",
    category: "花牌",
    alias: "四季",
    detail: "秋",
    accent: "#ca8a04",
    tint: "#fff9db",
    ink: "#a16207",
    displayType: "flower",
    glyph: "秋",
    mark: "✺"
  },
  {
    key: "flower-winter",
    face: "冬",
    category: "花牌",
    alias: "四季",
    detail: "冬",
    accent: "#0ea5e9",
    tint: "#ecfbff",
    ink: "#0369a1",
    displayType: "flower",
    glyph: "冬",
    mark: "✺"
  },
  {
    key: "flower-plum",
    face: "梅",
    category: "花牌",
    alias: "四君子",
    detail: "梅",
    accent: "#e11d48",
    tint: "#fff1f5",
    ink: "#be123c",
    displayType: "flower",
    glyph: "梅",
    mark: "❀"
  },
  {
    key: "flower-orchid",
    face: "蘭",
    category: "花牌",
    alias: "四君子",
    detail: "蘭",
    accent: "#7c3aed",
    tint: "#f5f1ff",
    ink: "#6d28d9",
    displayType: "flower",
    glyph: "蘭",
    mark: "❀"
  },
  {
    key: "flower-chrysanthemum",
    face: "菊",
    category: "花牌",
    alias: "四君子",
    detail: "菊",
    accent: "#d97706",
    tint: "#fff6e8",
    ink: "#b45309",
    displayType: "flower",
    glyph: "菊",
    mark: "✺"
  },
  {
    key: "flower-bamboo",
    face: "竹",
    category: "花牌",
    alias: "四君子",
    detail: "竹",
    accent: "#059669",
    tint: "#edfff8",
    ink: "#047857",
    displayType: "flower",
    glyph: "竹",
    mark: "❋"
  }
];

const boardStageElement = document.querySelector("#board-stage");
const boardElement = document.querySelector("#board");
const levelNumberElement = document.querySelector("#level-number");
const pairCountElement = document.querySelector("#pair-count");
const statusTextElement = document.querySelector("#status-text");
const overlayElement = document.querySelector("#overlay");
const dialogTitleElement = document.querySelector("#dialog-title");
const dialogMessageElement = document.querySelector("#dialog-message");
const continueButton = document.querySelector("#continue-btn");
const nextLevelButton = document.querySelector("#next-level-btn");
const endButton = document.querySelector("#end-btn");
const restartButton = document.querySelector("#restart-btn");
const jumpPanelElement = document.querySelector("#jump-panel");
const jumpButtonsElement = document.querySelector("#jump-buttons");

const state = {
  level: INITIAL_LEVEL,
  pairCount: INITIAL_PAIR_COUNT,
  cards: [],
  firstPickId: null,
  secondPickId: null,
  lockBoard: true,
  matchedPairs: 0,
  previewTimeoutId: null,
  countdownIntervalId: null,
  resolveTimeoutId: null
};

function shuffle(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function setStatus(message) {
  statusTextElement.textContent = message;
}

function clearTimers() {
  window.clearTimeout(state.previewTimeoutId);
  window.clearTimeout(state.resolveTimeoutId);
  window.clearInterval(state.countdownIntervalId);
}

function getMaxSupportedLevel() {
  return INITIAL_LEVEL + (tilePool.length - INITIAL_PAIR_COUNT);
}

function getPairCountForLevel(level) {
  return INITIAL_PAIR_COUNT + (level - INITIAL_LEVEL);
}

function setLevel(level) {
  const boundedLevel = Math.min(Math.max(level, INITIAL_LEVEL), getMaxSupportedLevel());
  state.level = boundedLevel;
  state.pairCount = getPairCountForLevel(boundedLevel);
}

function getPlayablePoolSize() {
  return Math.min(state.pairCount, tilePool.length);
}

function getPreviewSeconds() {
  return INITIAL_PREVIEW_SECONDS + (state.level - INITIAL_LEVEL);
}

function createDeck(pairCount) {
  const selectedTiles = shuffle(tilePool).slice(0, pairCount);
  const duplicatedTiles = selectedTiles.flatMap((tile, index) => ([
    {
      ...tile,
      id: `${tile.key}-${index}-a`,
      pairKey: tile.key,
      isFlipped: true,
      isMatched: false
    },
    {
      ...tile,
      id: `${tile.key}-${index}-b`,
      pairKey: tile.key,
      isFlipped: true,
      isMatched: false
    }
  ]));

  return shuffle(duplicatedTiles);
}

function getTileById(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

function updateHeader() {
  levelNumberElement.textContent = state.level;
  pairCountElement.textContent = getPlayablePoolSize();
}

function renderJumpButtons(targetLevels) {
  if (targetLevels.length === 0) {
    jumpButtonsElement.innerHTML = "";
    jumpPanelElement.classList.add("hidden");
    return;
  }

  jumpButtonsElement.innerHTML = targetLevels.map((level) => `
    <button type="button" data-jump-level="${level}">
      跳到第 ${level} 關
    </button>
  `).join("");

  jumpPanelElement.classList.remove("hidden");
}

function getMobileColumnCount(cardCount, availableWidth, availableHeight) {
  const gap = availableWidth < 420 ? 6 : 8;
  const maxColumns = Math.min(cardCount, availableWidth < 380 ? 6 : 8);
  let chosenColumns = Math.min(cardCount, 2);

  for (let columns = 2; columns <= maxColumns; columns += 1) {
    const cardWidth = (availableWidth - gap * (columns - 1)) / columns;

    if (cardWidth < 38) {
      break;
    }

    const rows = Math.ceil(cardCount / columns);
    const cardHeight = cardWidth / CARD_ASPECT_RATIO;
    const boardHeight = rows * cardHeight + gap * (rows - 1);
    chosenColumns = columns;

    if (boardHeight <= availableHeight) {
      break;
    }
  }

  return chosenColumns;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function syncBoardLayout() {
  boardElement.style.removeProperty("transform");
  boardElement.style.removeProperty("grid-template-columns");
  boardElement.style.removeProperty("--board-gap");
  boardStageElement.style.removeProperty("height");

  if (window.innerWidth > MOBILE_BREAKPOINT || state.cards.length === 0) {
    return;
  }

  const cardCount = state.cards.length;
  const gap = window.innerWidth < 420 ? 6 : 8;
  const availableWidth = Math.max(boardStageElement.clientWidth, 220);
  const stageTop = boardStageElement.getBoundingClientRect().top;
  const viewportHeight = getViewportHeight();
  const bottomGutter = window.innerWidth <= 480 ? MOBILE_BOTTOM_GUTTER : 16;
  const availableHeight = Math.max(viewportHeight - stageTop - bottomGutter, 160);
  const columns = getMobileColumnCount(cardCount, availableWidth, availableHeight);
  const rows = Math.ceil(cardCount / columns);
  const cardWidth = (availableWidth - gap * (columns - 1)) / columns;
  const cardHeight = cardWidth / CARD_ASPECT_RATIO;
  const naturalHeight = rows * cardHeight + gap * (rows - 1);

  boardElement.style.setProperty("--board-gap", `${gap}px`);
  boardElement.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  const scale = Math.min(1, availableHeight / naturalHeight);
  boardElement.style.transform = `scale(${scale})`;
  boardStageElement.style.height = `${naturalHeight * scale}px`;
}

function renderBambooPip({ x, y, color, rotate = 0, scale = 1 }) {
  const tone = BAMBOO_COLORS[color] ?? BAMBOO_COLORS.green;
  const line = color === "red" ? "#c45b65" : color === "blue" ? "#48578a" : BAMBOO_COLORS.darkGreen;

  return `
    <g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
      <rect x="-5.5" y="-20" width="11" height="12" rx="4" fill="${tone}" />
      <rect x="-5.5" y="-5" width="11" height="12" rx="4" fill="${tone}" />
      <rect x="-5.5" y="10" width="11" height="12" rx="4" fill="${tone}" />
      <path d="M0 -22 V22" stroke="${line}" stroke-width="1.8" stroke-linecap="round" opacity="0.6" />
      <path d="M-4 -8 H4 M-4 7 H4" stroke="rgba(255,255,255,0.45)" stroke-width="1.4" stroke-linecap="round" />
    </g>
  `;
}

function renderBambooSprig() {
  return `
    <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 16 V104" stroke="${BAMBOO_COLORS.green}" stroke-width="5.4" />
        <path d="M50 30 C34 26 24 18 18 8" stroke="${BAMBOO_COLORS.green}" stroke-width="4.6" />
        <path d="M50 48 C34 44 22 34 16 20" stroke="${BAMBOO_COLORS.green}" stroke-width="4.6" />
        <path d="M50 66 C66 60 78 48 84 32" stroke="${BAMBOO_COLORS.green}" stroke-width="4.6" />
        <path d="M50 84 C34 80 22 68 16 52" stroke="${BAMBOO_COLORS.green}" stroke-width="4.6" />
        <path d="M50 94 C66 90 76 82 82 70" stroke="${BAMBOO_COLORS.green}" stroke-width="4.6" />
        <circle cx="50" cy="56" r="5.5" fill="${BAMBOO_COLORS.red}" stroke="none" />
      </g>
    </svg>
  `;
}

function renderBambooSvg(value) {
  if (value === 1) {
    return renderBambooSprig();
  }

  const layouts = {
    2: [
      { x: 36, y: 62, color: "green" },
      { x: 64, y: 62, color: "green" }
    ],
    3: [
      { x: 50, y: 32, color: "green" },
      { x: 36, y: 82, color: "green" },
      { x: 64, y: 82, color: "green" }
    ],
    4: [
      { x: 36, y: 32, color: "green" },
      { x: 64, y: 32, color: "green" },
      { x: 36, y: 82, color: "green" },
      { x: 64, y: 82, color: "green" }
    ],
    5: [
      { x: 36, y: 28, color: "green" },
      { x: 64, y: 28, color: "green" },
      { x: 50, y: 56, color: "red" },
      { x: 36, y: 86, color: "green" },
      { x: 64, y: 86, color: "green" }
    ],
    6: [
      { x: 34, y: 22, color: "green" },
      { x: 66, y: 22, color: "green" },
      { x: 34, y: 56, color: "green" },
      { x: 66, y: 56, color: "green" },
      { x: 34, y: 90, color: "green" },
      { x: 66, y: 90, color: "green" }
    ],
    7: [
      { x: 34, y: 22, color: "green" },
      { x: 66, y: 22, color: "green" },
      { x: 34, y: 56, color: "green" },
      { x: 50, y: 56, color: "red" },
      { x: 66, y: 56, color: "green" },
      { x: 34, y: 90, color: "green" },
      { x: 66, y: 90, color: "green" }
    ],
    8: [
      { x: 34, y: 14, color: "green", scale: 0.95 },
      { x: 66, y: 14, color: "green", scale: 0.95 },
      { x: 34, y: 40, color: "green", scale: 0.95 },
      { x: 66, y: 40, color: "green", scale: 0.95 },
      { x: 34, y: 66, color: "green", scale: 0.95 },
      { x: 66, y: 66, color: "green", scale: 0.95 },
      { x: 34, y: 92, color: "green", scale: 0.95 },
      { x: 66, y: 92, color: "green", scale: 0.95 }
    ],
    9: [
      { x: 24, y: 20, color: "blue", scale: 0.9 },
      { x: 50, y: 20, color: "red", scale: 0.9 },
      { x: 76, y: 20, color: "green", scale: 0.9 },
      { x: 24, y: 56, color: "blue", scale: 0.9 },
      { x: 50, y: 56, color: "red", scale: 0.9 },
      { x: 76, y: 56, color: "green", scale: 0.9 },
      { x: 24, y: 92, color: "blue", scale: 0.9 },
      { x: 50, y: 92, color: "red", scale: 0.9 },
      { x: 76, y: 92, color: "green", scale: 0.9 }
    ]
  };

  const pips = (layouts[value] ?? []).map(renderBambooPip).join("");

  return `
    <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
      ${pips}
    </svg>
  `;
}

function renderCirclePip({ x, y, color, scale = 1 }) {
  const tone = CIRCLE_COLORS[color] ?? CIRCLE_COLORS.blue;

  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <circle cx="0" cy="0" r="12.5" fill="white" stroke="${tone}" stroke-width="4.3" />
      <circle cx="0" cy="0" r="5.8" fill="none" stroke="${tone}" stroke-width="3.4" />
      <circle cx="0" cy="0" r="1.8" fill="${tone}" />
    </g>
  `;
}

function renderSpecialCircle() {
  const petals = Array.from({ length: 8 }, (_, index) => {
    const angle = index * (Math.PI / 4);
    const x = 50 + Math.cos(angle) * 17;
    const y = 60 + Math.sin(angle) * 17;
    return `<circle cx="${x}" cy="${y}" r="4.3" fill="${CIRCLE_COLORS.green}" />`;
  }).join("");

  return `
    <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
      <circle cx="50" cy="60" r="29" fill="#fdfefe" stroke="${CIRCLE_COLORS.green}" stroke-width="4.2" />
      <circle cx="50" cy="60" r="20" fill="none" stroke="${CIRCLE_COLORS.green}" stroke-width="4.2" />
      <circle cx="50" cy="60" r="10" fill="none" stroke="${CIRCLE_COLORS.red}" stroke-width="4.2" />
      ${petals}
      <circle cx="50" cy="60" r="4.5" fill="${CIRCLE_COLORS.red}" />
    </svg>
  `;
}

function renderCircleSvg(value) {
  if (value === 1) {
    return renderSpecialCircle();
  }

  const layouts = {
    2: [
      { x: 50, y: 30, color: "blue" },
      { x: 50, y: 90, color: "green" }
    ],
    3: [
      { x: 35, y: 26, color: "blue" },
      { x: 50, y: 58, color: "red" },
      { x: 65, y: 90, color: "green" }
    ],
    4: [
      { x: 34, y: 30, color: "blue" },
      { x: 66, y: 30, color: "green" },
      { x: 34, y: 90, color: "green" },
      { x: 66, y: 90, color: "blue" }
    ],
    5: [
      { x: 34, y: 26, color: "blue" },
      { x: 66, y: 26, color: "green" },
      { x: 50, y: 58, color: "red" },
      { x: 34, y: 90, color: "green" },
      { x: 66, y: 90, color: "blue" }
    ],
    6: [
      { x: 34, y: 22, color: "green" },
      { x: 66, y: 22, color: "green" },
      { x: 34, y: 60, color: "red" },
      { x: 66, y: 60, color: "red" },
      { x: 34, y: 94, color: "red" },
      { x: 66, y: 94, color: "red" }
    ],
    7: [
      { x: 24, y: 18, color: "green", scale: 0.95 },
      { x: 50, y: 18, color: "green", scale: 0.95 },
      { x: 76, y: 18, color: "green", scale: 0.95 },
      { x: 34, y: 60, color: "red" },
      { x: 66, y: 60, color: "red" },
      { x: 34, y: 92, color: "red" },
      { x: 66, y: 92, color: "red" }
    ],
    8: [
      { x: 34, y: 12, color: "blue", scale: 0.9 },
      { x: 66, y: 12, color: "blue", scale: 0.9 },
      { x: 34, y: 38, color: "blue", scale: 0.9 },
      { x: 66, y: 38, color: "blue", scale: 0.9 },
      { x: 34, y: 64, color: "blue", scale: 0.9 },
      { x: 66, y: 64, color: "blue", scale: 0.9 },
      { x: 34, y: 90, color: "blue", scale: 0.9 },
      { x: 66, y: 90, color: "blue", scale: 0.9 }
    ],
    9: [
      { x: 24, y: 18, color: "blue", scale: 0.88 },
      { x: 50, y: 18, color: "blue", scale: 0.88 },
      { x: 76, y: 18, color: "blue", scale: 0.88 },
      { x: 24, y: 58, color: "red", scale: 0.88 },
      { x: 50, y: 58, color: "red", scale: 0.88 },
      { x: 76, y: 58, color: "red", scale: 0.88 },
      { x: 24, y: 98, color: "green", scale: 0.88 },
      { x: 50, y: 98, color: "green", scale: 0.88 },
      { x: 76, y: 98, color: "green", scale: 0.88 }
    ]
  };

  const pips = (layouts[value] ?? []).map(renderCirclePip).join("");

  return `
    <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
      ${pips}
    </svg>
  `;
}

function renderDragonSvg(variant) {
  if (variant === "white") {
    return `
      <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
        <rect x="22" y="16" width="56" height="88" rx="7" fill="none" stroke="#6274ab" stroke-width="5" />
        <rect x="34" y="30" width="32" height="60" rx="4" fill="none" stroke="#6274ab" stroke-width="2.8" opacity="0.45" />
        <path d="M28 26 L40 38 M72 26 L60 38 M28 94 L40 82 M72 94 L60 82" stroke="#6274ab" stroke-width="3.2" stroke-linecap="round" />
      </svg>
    `;
  }

  if (variant === "green") {
    return `
      <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
        <g fill="none" stroke="#4eaa7a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 22 C32 34 32 52 50 60 C68 68 68 86 50 98" />
          <path d="M50 22 C68 34 68 52 50 60 C32 68 32 86 50 98" />
          <path d="M38 44 C44 48 56 48 62 44" />
          <path d="M38 76 C44 80 56 80 62 76" />
        </g>
      </svg>
    `;
  }

  return `
    <svg class="tile-art-svg" viewBox="0 0 100 120" aria-hidden="true">
      <g fill="none" stroke="#d85863" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 20 L64 34 L50 48 L36 34 Z" />
        <path d="M50 48 V96" />
        <path d="M30 60 H70" />
        <path d="M36 78 H64" />
      </g>
    </svg>
  `;
}

function renderTextTile(card) {
  if (card.displayType === "wan") {
    return `
      <span class="tile-display tile-display-text tile-display-wan">
        <span class="tile-wan-number">${card.topText}</span>
        <span class="tile-wan-face">萬</span>
      </span>
    `;
  }

  if (card.displayType === "wind") {
    return `
      <span class="tile-display tile-display-text tile-display-wind">
        <span class="tile-glyph-text wind">${card.glyph}</span>
      </span>
    `;
  }

  return `
    <span class="tile-display tile-display-text tile-display-flower">
      <span class="tile-flower-mark">${card.mark}</span>
      <span class="tile-glyph-text flower">${card.glyph}</span>
    </span>
  `;
}

function renderGraphicTile(card) {
  return `
    <span class="tile-display tile-display-glyph ${card.displayType === "dragon" ? "tile-display-dragon-glyph" : ""}">
      <span class="tile-glyph-icon" aria-hidden="true">${card.symbol}</span>
    </span>
  `;
}

function renderTileContent(card) {
  if (card.displayType === "bamboo" || card.displayType === "circle" || card.displayType === "dragon") {
    return renderGraphicTile(card);
  }

  return renderTextTile(card);
}

function getCardTileType(card) {
  if (card.displayType === "wan") {
    return `m${card.key.split("-").pop()}`;
  }
  if (card.displayType === "bamboo") {
    return `s${card.value}`;
  }
  if (card.displayType === "circle") {
    return `p${card.value}`;
  }
  if (card.key === "wind-east") {
    return "E";
  }
  if (card.key === "wind-south") {
    return "S";
  }
  if (card.key === "wind-west") {
    return "W";
  }
  if (card.key === "wind-north") {
    return "N";
  }
  if (card.key === "dragon-red") {
    return "R";
  }
  if (card.key === "dragon-green") {
    return "G";
  }
  if (card.key === "dragon-white") {
    return "B";
  }
  return null;
}

function getTileSvgMarkup(tileType) {
  return [
    '<svg class="tile-image tile-art-svg" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">',
    renderTileFrame(),
    renderTileFace(tileType),
    "</svg>"
  ].join("");
}

function getFlowerTileSvgMarkup(card) {
  const topText = card.mark || "";
  const centerText = card.glyph || card.face || "";

  return [
    '<svg class="tile-image tile-art-svg" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">',
    renderTileFrame(),
    `<g transform="translate(80 106) scale(1.07 1.12) translate(-80 -106)">
      ${renderShadowedText(80, 60, topText, card.accent || TILE_ART_COLORS.gold, 40)}
      ${renderShadowedText(80, 124, centerText, card.ink || TILE_ART_COLORS.green, 90)}
    </g>`,
    "</svg>"
  ].join("");
}

function renderTileFrame() {
  return `
    <rect x="12" y="16" width="136" height="192" rx="18" fill="${TILE_ART_COLORS.shadow}" />
    <rect x="6" y="6" width="148" height="200" rx="18" fill="#fffdfa" stroke="${TILE_ART_COLORS.frame}" stroke-width="2.5" />
    <rect x="11" y="11" width="138" height="190" rx="15" fill="#ffffff" opacity="0.95" />
  `;
}

function renderTileFace(tileType) {
  let face = "";

  if (/^m[1-9]$/.test(tileType)) {
    face = renderCharacterTile(Number(tileType[1]));
  } else if (/^p[1-9]$/.test(tileType)) {
    face = renderPinTile(Number(tileType[1]));
  } else if (/^s[1-9]$/.test(tileType)) {
    face = renderBambooTile(Number(tileType[1]));
  } else {
    face = renderHonorTile(tileType);
  }

  return `<g transform="translate(80 106) scale(1.07 1.12) translate(-80 -106)">${face}</g>`;
}

/*
function renderCharacterTile(rank) {
  return [
    renderShadowedText(80, 70, TILE_NUMBER_LABELS[rank], TILE_ART_COLORS.blue, 84),
    renderShadowedText(80, 152, "萬", TILE_ART_COLORS.red, 68)
  ].join("");
}

*/
function renderCharacterTile(rank) {
  return [
    renderShadowedText(80, 70, TILE_NUMBER_LABELS[rank], TILE_ART_COLORS.blue, 84),
    renderShadowedText(80, 152, "\u842c", TILE_ART_COLORS.red, 68)
  ].join("");
}

function renderHonorTile(tileType) {
  if (tileType === "B") {
    return `
      <rect x="42" y="46" width="76" height="120" rx="10" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="5.6" />
      <rect x="54" y="58" width="52" height="96" rx="6" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="3.2" opacity="0.55" />
      <path d="M46 52 L64 52 L46 76 Z" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="3.2" stroke-linejoin="round" />
      <path d="M114 52 L96 52 L114 76 Z" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="3.2" stroke-linejoin="round" />
      <path d="M46 160 L64 160 L46 136 Z" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="3.2" stroke-linejoin="round" />
      <path d="M114 160 L96 160 L114 136 Z" fill="none" stroke="${TILE_ART_COLORS.blue}" stroke-width="3.2" stroke-linejoin="round" />
    `;
  }

  const fill = tileType === "R" ? TILE_ART_COLORS.red : tileType === "G" ? TILE_ART_COLORS.green : TILE_ART_COLORS.blue;
  const fontSize = tileType === "R" || tileType === "G" ? 124 : 116;
  return renderShadowedText(80, 118, TILE_HONOR_LABELS[tileType] || tileType, fill, fontSize);
}

function renderPinTile(rank) {
  switch (rank) {
    case 1:
      return renderPinOne();
    case 2:
      return renderPinMarks([
        { x: 80, y: 72, color: "blue" },
        { x: 80, y: 148, color: "green" }
      ]);
    case 3:
      return renderPinMarks([
        { x: 58, y: 70, color: "blue" },
        { x: 80, y: 110, color: "red" },
        { x: 102, y: 150, color: "green" }
      ]);
    case 4:
      return renderPinMarks([
        { x: 56, y: 72, color: "blue" },
        { x: 104, y: 72, color: "green" },
        { x: 56, y: 148, color: "green" },
        { x: 104, y: 148, color: "blue" }
      ]);
    case 5:
      return renderPinMarks([
        { x: 56, y: 72, color: "blue" },
        { x: 104, y: 72, color: "green" },
        { x: 80, y: 110, color: "red" },
        { x: 56, y: 148, color: "green" },
        { x: 104, y: 148, color: "blue" }
      ]);
    case 6:
      return renderPinMarks([
        { x: 62, y: 56, color: "blue" },
        { x: 98, y: 56, color: "green" },
        { x: 62, y: 122, color: "red" },
        { x: 98, y: 122, color: "red" },
        { x: 62, y: 160, color: "red" },
        { x: 98, y: 160, color: "red" }
      ]);
    case 7:
      return renderPinMarks([
        { x: 50, y: 44, color: "green", scale: 0.94 },
        { x: 80, y: 62, color: "green", scale: 0.94 },
        { x: 110, y: 80, color: "green", scale: 0.94 },
        { x: 62, y: 122, color: "red" },
        { x: 98, y: 122, color: "red" },
        { x: 62, y: 156, color: "red" },
        { x: 98, y: 156, color: "red" }
      ]);
    case 8:
      return renderPinMarks([
        { x: 60, y: 52, color: "blue", scale: 0.94 },
        { x: 100, y: 52, color: "blue", scale: 0.94 },
        { x: 60, y: 88, color: "blue", scale: 0.94 },
        { x: 100, y: 88, color: "blue", scale: 0.94 },
        { x: 60, y: 124, color: "blue", scale: 0.94 },
        { x: 100, y: 124, color: "blue", scale: 0.94 },
        { x: 60, y: 160, color: "blue", scale: 0.94 },
        { x: 100, y: 160, color: "blue", scale: 0.94 }
      ]);
    case 9:
      return renderPinMarks([
        { x: 44, y: 50, color: "blue", scale: 0.82 },
        { x: 80, y: 50, color: "blue", scale: 0.82 },
        { x: 116, y: 50, color: "blue", scale: 0.82 },
        { x: 44, y: 106, color: "red", scale: 0.82 },
        { x: 80, y: 106, color: "red", scale: 0.82 },
        { x: 116, y: 106, color: "red", scale: 0.82 },
        { x: 44, y: 162, color: "green", scale: 0.82 },
        { x: 80, y: 162, color: "green", scale: 0.82 },
        { x: 116, y: 162, color: "green", scale: 0.82 }
      ]);
    default:
      return "";
  }
}

function renderBambooTile(rank) {
  switch (rank) {
    case 1:
      return renderBambooBird();
    case 2:
      return renderBambooMarks([
        { x: 80, y: 68, color: "green" },
        { x: 80, y: 148, color: "green" }
      ]);
    case 3:
      return renderBambooMarks([
        { x: 80, y: 60, color: "green" },
        { x: 62, y: 146, color: "green" },
        { x: 98, y: 146, color: "green" }
      ]);
    case 4:
      return renderBambooMarks([
        { x: 60, y: 66, color: "green" },
        { x: 100, y: 66, color: "green" },
        { x: 60, y: 148, color: "green" },
        { x: 100, y: 148, color: "green" }
      ]);
    case 5:
      return renderBambooMarks([
        { x: 60, y: 64, color: "green" },
        { x: 100, y: 64, color: "green" },
        { x: 80, y: 106, color: "red" },
        { x: 60, y: 148, color: "green" },
        { x: 100, y: 148, color: "green" }
      ]);
    case 6:
      return renderBambooMarks([
        { x: 52, y: 64, color: "green" },
        { x: 80, y: 64, color: "green" },
        { x: 108, y: 64, color: "green" },
        { x: 52, y: 148, color: "green" },
        { x: 80, y: 148, color: "green" },
        { x: 108, y: 148, color: "green" }
      ]);
    case 7:
      return renderBambooMarks([
        { x: 80, y: 44, color: "red", length: 40, width: 7.2 },
        { x: 58, y: 98, color: "green", length: 40, width: 7.2 },
        { x: 58, y: 156, color: "green", length: 40, width: 7.2 },
        { x: 80, y: 98, color: "blue", length: 40, width: 7.2 },
        { x: 80, y: 156, color: "green", length: 40, width: 7.2 },
        { x: 102, y: 98, color: "green", length: 40, width: 7.2 },
        { x: 102, y: 156, color: "green", length: 40, width: 7.2 }
      ]);
    case 8:
      return renderBambooMarks([
        { x: 52, y: 72, color: "green", rotate: 0, length: 44, width: 7.2 },
        { x: 72, y: 70, color: "green", rotate: 30, length: 42, width: 7.2 },
        { x: 88, y: 70, color: "green", rotate: -30, length: 42, width: 7.2 },
        { x: 108, y: 72, color: "green", rotate: 0, length: 44, width: 7.2 },
        { x: 52, y: 144, color: "green", rotate: 0, length: 44, width: 7.2 },
        { x: 72, y: 146, color: "green", rotate: -30, length: 42, width: 7.2 },
        { x: 88, y: 146, color: "green", rotate: 30, length: 42, width: 7.2 },
        { x: 108, y: 144, color: "green", rotate: 0, length: 44, width: 7.2 }
      ]);
    case 9:
      return renderBambooMarks([
        { x: 50, y: 56, color: "blue", scale: 0.84 },
        { x: 50, y: 108, color: "blue", scale: 0.84 },
        { x: 50, y: 160, color: "blue", scale: 0.84 },
        { x: 80, y: 56, color: "red", scale: 0.84 },
        { x: 80, y: 108, color: "red", scale: 0.84 },
        { x: 80, y: 160, color: "red", scale: 0.84 },
        { x: 110, y: 56, color: "green", scale: 0.84 },
        { x: 110, y: 108, color: "green", scale: 0.84 },
        { x: 110, y: 160, color: "green", scale: 0.84 }
      ]);
    default:
      return "";
  }
}

function renderPinOne() {
  const petals = Array.from({ length: 8 }, (_, index) => {
    const angle = (Math.PI / 4) * index;
    const x = Math.cos(angle) * 20;
    const y = Math.sin(angle) * 20;
    const stroke = index % 2 === 0 ? TILE_ART_COLORS.red : TILE_ART_COLORS.green;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="none" stroke="${stroke}" stroke-width="3.2" />`;
  }).join("");

  return `
    <g transform="translate(80 108)">
      <circle r="40" fill="none" stroke="${TILE_ART_COLORS.green}" stroke-width="6" />
      <circle r="31" fill="none" stroke="${TILE_ART_COLORS.gold}" stroke-width="5" opacity="0.9" />
      <circle r="23" fill="#fffdfa" stroke="${TILE_ART_COLORS.green}" stroke-width="2.6" />
      ${petals}
      <circle r="13.5" fill="none" stroke="${TILE_ART_COLORS.red}" stroke-width="4.2" />
      <circle r="5.2" fill="${TILE_ART_COLORS.red}" />
    </g>
  `;
}

function renderBambooBird() {
  return `
    <g transform="translate(80 110)">
      <path d="M-24 28 C-18 6 -8 -12 12 -30 C28 -44 42 -34 40 -16 C38 -2 24 10 12 18 C22 20 32 28 36 40"
        fill="none"
        stroke="${TILE_ART_COLORS.green}"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M-8 10 C2 0 16 2 22 16 C10 18 0 18 -8 10 Z" fill="${TILE_ART_COLORS.blue}" opacity="0.78" />
      <circle cx="14" cy="-24" r="4.4" fill="${TILE_ART_COLORS.red}" />
      <path d="M20 -24 L32 -20 L20 -16" fill="${TILE_ART_COLORS.gold}" />
      <path d="M-8 24 L-26 44 M2 28 L-12 48 M14 28 L2 50" fill="none" stroke="${TILE_ART_COLORS.green}" stroke-width="4.2" stroke-linecap="round" />
      <path d="M-6 -2 C6 -18 18 -20 24 -4" fill="none" stroke="${TILE_ART_COLORS.greenDark}" stroke-width="3.2" stroke-linecap="round" />
    </g>
  `;
}

function renderPinMarks(marks) {
  return marks
    .map((mark) => renderPinPip(mark.x, mark.y, mark.color, mark.scale || 1))
    .join("");
}

function renderBambooMarks(marks) {
  return marks
    .map((mark) =>
      renderBambooPip(mark.x, mark.y, mark.color, {
        scale: mark.scale || 1,
        rotate: mark.rotate || 0,
        length: mark.length || null,
        width: mark.width || null
      })
    )
    .join("");
}

function renderPinPip(x, y, colorKey, scale = 1) {
  const color = getPipColor(colorKey);
  const outer = formatNumber(18.4 * scale);
  const middle = formatNumber(8.8 * scale);
  const inner = formatNumber(4.2 * scale);
  const strokeWidth = formatNumber(5.3 * scale);
  const middleWidth = formatNumber(2.4 * scale);

  return `
    <g transform="translate(${x} ${y})">
      <circle r="${outer}" fill="#fffdf9" stroke="${color}" stroke-width="${strokeWidth}" />
      <circle r="${middle}" fill="none" stroke="${color}" stroke-width="${middleWidth}" opacity="0.68" />
      <circle r="${inner}" fill="${color}" />
    </g>
  `;
}

function renderBambooPip(x, y, colorKey, { scale = 1, rotate = 0, length = null, width = null } = {}) {
  const color = getPipColor(colorKey);
  const edge = getPipEdgeColor(colorKey);
  const lineLength = length || 48 * scale;
  const lineWidth = width || 7.6 * scale;
  const glowWidth = lineWidth + 2.4 * scale;

  return `
    <g transform="translate(${x} ${y}) rotate(${rotate})">
      <path d="M0 ${formatNumber(-lineLength / 2)} V ${formatNumber(lineLength / 2)}" stroke="${edge}" stroke-width="${formatNumber(glowWidth)}" stroke-linecap="round" />
      <path d="M0 ${formatNumber(-lineLength / 2)} V ${formatNumber(lineLength / 2)}" stroke="${color}" stroke-width="${formatNumber(lineWidth)}" stroke-linecap="round" />
    </g>
  `;
}

function renderShadowedText(x, y, text, fill, fontSize) {
  const escaped = escapeXml(text);
  return `
    <text x="${x}" y="${y + 3}" text-anchor="middle" dominant-baseline="middle" font-family="KaiTi, STKaiti, BiauKai, PMingLiU, Noto Serif TC, serif" font-size="${fontSize}" font-weight="700" fill="#ffffff" opacity="0.62">${escaped}</text>
    <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="KaiTi, STKaiti, BiauKai, PMingLiU, Noto Serif TC, serif" font-size="${fontSize}" font-weight="700" fill="${fill}" stroke="#f7f1e7" stroke-width="1.2" paint-order="stroke fill">${escaped}</text>
  `;
}

function getPipColor(colorKey) {
  if (colorKey === "red") {
    return TILE_ART_COLORS.red;
  }
  if (colorKey === "green") {
    return TILE_ART_COLORS.green;
  }
  return TILE_ART_COLORS.blue;
}

function getPipEdgeColor(colorKey) {
  if (colorKey === "red") {
    return TILE_ART_COLORS.redDark;
  }
  if (colorKey === "green") {
    return TILE_ART_COLORS.greenDark;
  }
  return TILE_ART_COLORS.blueDark;
}

function formatNumber(value) {
  return Number(value).toFixed(2).replace(/\.?0+$/, "");
}

function escapeXml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTileContent(card) {
  const tileType = getCardTileType(card);
  const tileMarkup = tileType ? getTileSvgMarkup(tileType) : getFlowerTileSvgMarkup(card);

  return `
    <span class="tile-display tile-display-art" aria-hidden="true">
      ${tileMarkup}
    </span>
  `;
}

function renderBoard() {
  boardElement.innerHTML = state.cards.map((card) => {
    const faceUpClass = card.isFlipped || card.isMatched ? "face-up" : "";
    const matchedClass = card.isMatched ? "matched" : "";
    const lockedClass = state.lockBoard ? "locked" : "";
    const disabledAttribute = card.isMatched ? "disabled" : "";
    const label = `${card.face} ${card.category} ${card.alias}`;
    const styleAttribute = `--tile-accent:${card.accent}; --tile-tint:${card.tint}; --tile-ink:${card.ink};`;

    return `
      <button
        type="button"
        class="card ${faceUpClass} ${matchedClass} ${lockedClass}"
        data-card-id="${card.id}"
        aria-label="麻將 ${label}"
        aria-pressed="${card.isFlipped || card.isMatched}"
        style="${styleAttribute}"
        ${disabledAttribute}
        >
          <span class="card-inner">
            <span class="card-face card-back">
            </span>
            <span class="card-face card-front">
              ${renderTileContent(card)}
          </span>
        </span>
      </button>
    `;
  }).join("");

  window.requestAnimationFrame(syncBoardLayout);
}

function hideOverlay() {
  overlayElement.classList.add("hidden");
  overlayElement.setAttribute("aria-hidden", "true");
  jumpPanelElement.classList.add("hidden");
}

function showOverlay({ title, message, showContinue, showNextLevel, showEnd, showRestart, jumpTargets = [] }) {
  dialogTitleElement.textContent = title;
  dialogMessageElement.textContent = message;
  continueButton.classList.toggle("hidden", !showContinue);
  nextLevelButton.classList.toggle("hidden", !showNextLevel);
  endButton.classList.toggle("hidden", !showEnd);
  restartButton.classList.toggle("hidden", !showRestart);
  renderJumpButtons(jumpTargets);
  overlayElement.classList.remove("hidden");
  overlayElement.setAttribute("aria-hidden", "false");
}

function startPreviewCountdown() {
  let secondsLeft = getPreviewSeconds();
  setStatus(`第 ${state.level} 關：請先記住牌面，${secondsLeft} 秒後開始翻牌。`);

  state.countdownIntervalId = window.setInterval(() => {
    secondsLeft -= 1;

    if (secondsLeft > 0) {
      setStatus(`第 ${state.level} 關：請先記住牌面，${secondsLeft} 秒後開始翻牌。`);
    }
  }, 1000);
}

function endPreviewPhase() {
  window.clearInterval(state.countdownIntervalId);
  state.cards = state.cards.map((card) => ({ ...card, isFlipped: false }));
  state.lockBoard = false;
  renderBoard();
  setStatus(`第 ${state.level} 關開始，請翻兩張牌找出相同的麻將牌。`);
}

function startLevel() {
  clearTimers();
  hideOverlay();
  state.firstPickId = null;
  state.secondPickId = null;
  state.lockBoard = true;
  state.matchedPairs = 0;
  state.cards = createDeck(getPlayablePoolSize());
  updateHeader();
  renderBoard();
  startPreviewCountdown();
  state.previewTimeoutId = window.setTimeout(endPreviewPhase, getPreviewSeconds() * 1000);
}

function resetSelection() {
  state.firstPickId = null;
  state.secondPickId = null;
}

function getJumpTargets() {
  const targets = [];
  const maxSupportedLevel = getMaxSupportedLevel();

  for (let level = JUMP_STEP; level <= maxSupportedLevel; level += JUMP_STEP) {
    if (level > state.level) {
      targets.push(level);
    }
  }

  return targets;
}

function showLevelCompleteOverlay() {
  const hasHigherLevel = state.level < getMaxSupportedLevel();
  const message = hasHigherLevel
    ? "請選擇重玩本關、增加難度、快速跳關，或結束遊戲。"
    : "你已經到達目前最高難度，可以重玩本關或結束遊戲。";

  showOverlay({
    title: `第 ${state.level} 關完成`,
    message,
    showContinue: true,
    showNextLevel: hasHigherLevel,
    showEnd: true,
    showRestart: false,
    jumpTargets: hasHigherLevel ? getJumpTargets() : []
  });
}

function handleMismatch() {
  state.cards = state.cards.map((card) => {
    if (card.id === state.firstPickId || card.id === state.secondPickId) {
      return { ...card, isFlipped: false };
    }

    return card;
  });

  resetSelection();
  state.lockBoard = false;
  renderBoard();
  setStatus("沒有配對成功，再試一次。");
}

function handleMatch() {
  state.cards = state.cards.map((card) => {
    if (card.id === state.firstPickId || card.id === state.secondPickId) {
      return { ...card, isMatched: true };
    }

    return card;
  });

  state.matchedPairs += 1;
  resetSelection();

  if (state.matchedPairs === getPlayablePoolSize()) {
    state.lockBoard = true;
    renderBoard();
    setStatus(`第 ${state.level} 關完成。`);
    window.setTimeout(showLevelCompleteOverlay, 280);
    return;
  }

  state.lockBoard = false;
  renderBoard();
  setStatus("配對成功，繼續找下一對。");
}

function flipCard(cardId) {
  state.cards = state.cards.map((card) => (
    card.id === cardId ? { ...card, isFlipped: true } : card
  ));
  renderBoard();
}

function onCardSelect(cardId) {
  const card = getTileById(cardId);

  if (!card || state.lockBoard || card.isFlipped || card.isMatched) {
    return;
  }

  flipCard(cardId);

  if (!state.firstPickId) {
    state.firstPickId = cardId;
    setStatus("已翻開第一張牌，請再翻第二張。");
    return;
  }

  state.secondPickId = cardId;
  state.lockBoard = true;

  const firstCard = getTileById(state.firstPickId);
  const secondCard = getTileById(state.secondPickId);

  if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
    setStatus("配對成功。");
    state.resolveTimeoutId = window.setTimeout(handleMatch, MATCH_DELAY_MS);
    return;
  }

  setStatus("配對失敗，牌面即將翻回背面。");
  state.resolveTimeoutId = window.setTimeout(handleMismatch, MISMATCH_DELAY_MS);
}

function endGame() {
  clearTimers();
  state.lockBoard = true;
  setStatus("遊戲已結束。");

  window.open("", "_self");
  window.close();

  window.setTimeout(() => {
    showOverlay({
      title: "遊戲已結束",
      message: "瀏覽器可能阻止了自動關閉視窗，請直接關閉此分頁；若想重新挑戰，也可以重新開始。",
      showContinue: false,
      showNextLevel: false,
      showEnd: false,
      showRestart: true,
      jumpTargets: []
    });
  }, 300);
}

boardElement.addEventListener("click", (event) => {
  const cardButton = event.target.closest(".card");

  if (!cardButton) {
    return;
  }

  onCardSelect(cardButton.dataset.cardId);
});

jumpButtonsElement.addEventListener("click", (event) => {
  const jumpButton = event.target.closest("[data-jump-level]");

  if (!jumpButton) {
    return;
  }

  setLevel(Number(jumpButton.dataset.jumpLevel));
  startLevel();
});

continueButton.addEventListener("click", () => {
  startLevel();
});

nextLevelButton.addEventListener("click", () => {
  setLevel(state.level + 1);
  startLevel();
});

endButton.addEventListener("click", () => {
  endGame();
});

restartButton.addEventListener("click", () => {
  setLevel(INITIAL_LEVEL);
  startLevel();
});

window.addEventListener("resize", () => {
  window.requestAnimationFrame(syncBoardLayout);
});

window.visualViewport?.addEventListener("resize", () => {
  window.requestAnimationFrame(syncBoardLayout);
});

window.visualViewport?.addEventListener("scroll", () => {
  window.requestAnimationFrame(syncBoardLayout);
});

setLevel(INITIAL_LEVEL);
startLevel();
