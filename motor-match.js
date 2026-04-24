const PREVIEW_SECONDS = 5;
const MISMATCH_DELAY_MS = 900;
const MATCH_DELAY_MS = 450;
const INITIAL_LEVEL = 1;
const INITIAL_PAIR_COUNT = 2;
const JUMP_STEP = 5;

const vehiclePool = [
  { key: "yamaha-cygnus", brand: "Yamaha", model: "Cygnus Gryphus", group: "一般機車", category: "速克達", colorName: "靛藍", icon: "🛵", accent: "#2563eb", tint: "#dbeafe" },
  { key: "honda-dio", brand: "Honda", model: "Dio", group: "一般機車", category: "都會通勤", colorName: "珍珠白", icon: "🛵", accent: "#cbd5e1", tint: "#f8fafc" },
  { key: "vespa-primavera", brand: "Vespa", model: "Primavera", group: "一般機車", category: "復古速克達", colorName: "薄荷綠", icon: "🛵", accent: "#10b981", tint: "#d1fae5" },
  { key: "sym-jet", brand: "SYM", model: "JET SL+", group: "一般機車", category: "街跑速克達", colorName: "霓虹黃", icon: "🛵", accent: "#eab308", tint: "#fef9c3" },
  { key: "gogoro-pulse", brand: "Gogoro", model: "Pulse", group: "一般機車", category: "電動旗艦", colorName: "冰川藍", icon: "🛵", accent: "#06b6d4", tint: "#cffafe" },
  { key: "kymco-rts", brand: "Kymco", model: "RTS 125", group: "一般機車", category: "街道跑旅", colorName: "消光灰", icon: "🛵", accent: "#6b7280", tint: "#e5e7eb" },
  { key: "kawasaki-zx6r", brand: "Kawasaki", model: "Ninja ZX-6R", group: "重型機車", category: "仿賽", colorName: "酸綠", icon: "🏍️", accent: "#65a30d", tint: "#ecfccb" },
  { key: "ducati-monster", brand: "Ducati", model: "Monster", group: "重型機車", category: "街車", colorName: "競速紅", icon: "🏍️", accent: "#dc2626", tint: "#fee2e2" },
  { key: "bmw-r1250gs", brand: "BMW", model: "R 1250 GS", group: "重型機車", category: "冒險旅跑", colorName: "冰川白", icon: "🏍️", accent: "#93c5fd", tint: "#eff6ff" },
  { key: "harley-fatboy", brand: "Harley-Davidson", model: "Fat Boy", group: "重型機車", category: "美式巡航", colorName: "亮黑", icon: "🏍️", accent: "#111827", tint: "#e5e7eb" },
  { key: "ktm-superduke", brand: "KTM", model: "1290 Super Duke", group: "重型機車", category: "暴力街跑", colorName: "烈橘", icon: "🏍️", accent: "#f97316", tint: "#ffedd5" },
  { key: "triumph-tiger", brand: "Triumph", model: "Tiger 900", group: "重型機車", category: "冒險休旅", colorName: "森林綠", icon: "🏍️", accent: "#15803d", tint: "#dcfce7" },
  { key: "toyota-corolla", brand: "Toyota", model: "Corolla Altis", group: "汽車", category: "家庭轎車", colorName: "珍珠白", icon: "🚗", accent: "#e2e8f0", tint: "#ffffff" },
  { key: "honda-civic", brand: "Honda", model: "Civic Hatchback", group: "汽車", category: "掀背車", colorName: "鈦灰", icon: "🚗", accent: "#64748b", tint: "#e2e8f0" },
  { key: "tesla-model3", brand: "Tesla", model: "Model 3", group: "汽車", category: "電動轎車", colorName: "午夜黑", icon: "🚘", accent: "#0f172a", tint: "#e2e8f0" },
  { key: "mazda-mx5", brand: "Mazda", model: "MX-5", group: "汽車", category: "敞篷跑車", colorName: "熾焰紅", icon: "🏎️", accent: "#ef4444", tint: "#fee2e2" },
  { key: "ford-ranger", brand: "Ford", model: "Ranger", group: "汽車", category: "皮卡", colorName: "海軍藍", icon: "🛻", accent: "#1d4ed8", tint: "#dbeafe" },
  { key: "mercedes-g", brand: "Mercedes-Benz", model: "G-Class", group: "汽車", category: "豪華休旅", colorName: "曜石黑", icon: "🚙", accent: "#1f2937", tint: "#e5e7eb" },
  { key: "subaru-outback", brand: "Subaru", model: "Outback", group: "汽車", category: "跨界旅行車", colorName: "山嵐綠", icon: "🚙", accent: "#16a34a", tint: "#dcfce7" },
  { key: "nissan-gtr", brand: "Nissan", model: "GT-R", group: "汽車", category: "雙門跑車", colorName: "鈦銀", icon: "🏎️", accent: "#94a3b8", tint: "#f8fafc" },
  { key: "mini-cooper", brand: "MINI", model: "Cooper", group: "汽車", category: "掀背小車", colorName: "亮黃", icon: "🚗", accent: "#facc15", tint: "#fef9c3" },
  { key: "jeep-wrangler", brand: "Jeep", model: "Wrangler", group: "汽車", category: "越野休旅", colorName: "沙漠棕", icon: "🚙", accent: "#a16207", tint: "#fef3c7" },
  { key: "porsche-911", brand: "Porsche", model: "911 Carrera", group: "汽車", category: "性能跑車", colorName: "珊瑚紅", icon: "🏎️", accent: "#f43f5e", tint: "#ffe4e6" },
  { key: "hyundai-staria", brand: "Hyundai", model: "Staria", group: "汽車", category: "商旅車", colorName: "銀灰", icon: "🚐", accent: "#9ca3af", tint: "#f3f4f6" },
  { key: "volvo-xc90", brand: "Volvo", model: "XC90", group: "汽車", category: "七人座休旅", colorName: "深藍", icon: "🚙", accent: "#1e40af", tint: "#dbeafe" },
  { key: "lexus-lm", brand: "Lexus", model: "LM", group: "汽車", category: "豪華商旅", colorName: "玄夜黑", icon: "🚐", accent: "#111827", tint: "#e5e7eb" },
  { key: "audi-tt", brand: "Audi", model: "TT Coupe", group: "汽車", category: "雙門轎跑", colorName: "流光橘", icon: "🚗", accent: "#fb923c", tint: "#ffedd5" },
  { key: "defender-110", brand: "Land Rover", model: "Defender 110", group: "汽車", category: "硬派越野", colorName: "銅棕", icon: "🚙", accent: "#92400e", tint: "#fef3c7" },
  { key: "bmw-m3", brand: "BMW", model: "M3", group: "汽車", category: "性能轎車", colorName: "電光藍", icon: "🚘", accent: "#3b82f6", tint: "#dbeafe" },
  { key: "honda-crv", brand: "Honda", model: "CR-V", group: "汽車", category: "家庭休旅", colorName: "霧銀", icon: "🚙", accent: "#94a3b8", tint: "#f8fafc" }
];

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
  return INITIAL_LEVEL + (vehiclePool.length - INITIAL_PAIR_COUNT);
}

function getPairCountForLevel(level) {
  return INITIAL_PAIR_COUNT + (level - INITIAL_LEVEL);
}

function setLevel(level) {
  const boundedLevel = Math.min(Math.max(level, INITIAL_LEVEL), getMaxSupportedLevel());
  state.level = boundedLevel;
  state.pairCount = getPairCountForLevel(boundedLevel);
}

function createDeck(pairCount) {
  const selectedVehicles = shuffle(vehiclePool).slice(0, pairCount);
  const duplicatedVehicles = selectedVehicles.flatMap((vehicle, index) => ([
    {
      id: `${vehicle.key}-${index}-a`,
      pairKey: vehicle.key,
      brand: vehicle.brand,
      model: vehicle.model,
      group: vehicle.group,
      category: vehicle.category,
      colorName: vehicle.colorName,
      icon: vehicle.icon,
      accent: vehicle.accent,
      tint: vehicle.tint,
      isFlipped: true,
      isMatched: false
    },
    {
      id: `${vehicle.key}-${index}-b`,
      pairKey: vehicle.key,
      brand: vehicle.brand,
      model: vehicle.model,
      group: vehicle.group,
      category: vehicle.category,
      colorName: vehicle.colorName,
      icon: vehicle.icon,
      accent: vehicle.accent,
      tint: vehicle.tint,
      isFlipped: true,
      isMatched: false
    }
  ]));

  return shuffle(duplicatedVehicles);
}

function getCardById(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

function updateHeader() {
  levelNumberElement.textContent = state.level;
  pairCountElement.textContent = state.pairCount;
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

function renderBoard() {
  boardElement.innerHTML = state.cards.map((card) => {
    const faceUpClass = card.isFlipped || card.isMatched ? "face-up" : "";
    const matchedClass = card.isMatched ? "matched" : "";
    const lockedClass = state.lockBoard ? "locked" : "";
    const disabledAttribute = card.isMatched ? "disabled" : "";
    const label = `${card.brand} ${card.model} ${card.group} ${card.category} ${card.colorName}`;
    const styleAttribute = `--vehicle-accent:${card.accent}; --vehicle-tint:${card.tint};`;

    return `
      <button
        type="button"
        class="card ${faceUpClass} ${matchedClass} ${lockedClass}"
        data-card-id="${card.id}"
        aria-label="車款 ${label}"
        aria-pressed="${card.isFlipped || card.isMatched}"
        style="${styleAttribute}"
        ${disabledAttribute}
      >
        <span class="card-inner">
          <span class="card-face card-back">
            <span class="card-back-mark">🏁</span>
            <span class="card-back-text">Motor Match</span>
          </span>
          <span class="card-face card-front">
            <span class="vehicle-band"></span>
            <span class="vehicle-top">
              <span class="vehicle-tag">${card.group}</span>
              <span class="vehicle-brand">${card.brand}</span>
            </span>
            <span class="vehicle-emoji">${card.icon}</span>
            <span class="vehicle-model">${card.model}</span>
            <span class="vehicle-meta">${card.category}</span>
            <span class="vehicle-color">
              <span class="vehicle-color-dot"></span>
              <span>${card.colorName}</span>
            </span>
          </span>
        </span>
      </button>
    `;
  }).join("");
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
  let secondsLeft = PREVIEW_SECONDS;
  setStatus(`第 ${state.level} 關：請先記住車款，${secondsLeft} 秒後開始翻牌。`);

  state.countdownIntervalId = window.setInterval(() => {
    secondsLeft -= 1;

    if (secondsLeft > 0) {
      setStatus(`第 ${state.level} 關：請先記住車款，${secondsLeft} 秒後開始翻牌。`);
    }
  }, 1000);
}

function endPreviewPhase() {
  window.clearInterval(state.countdownIntervalId);
  state.cards = state.cards.map((card) => ({ ...card, isFlipped: false }));
  state.lockBoard = false;
  renderBoard();
  setStatus(`第 ${state.level} 關開始，請翻兩張牌找出相同的車款。`);
}

function startLevel() {
  clearTimers();
  hideOverlay();
  state.firstPickId = null;
  state.secondPickId = null;
  state.lockBoard = true;
  state.matchedPairs = 0;
  state.cards = createDeck(state.pairCount);
  updateHeader();
  renderBoard();
  startPreviewCountdown();
  state.previewTimeoutId = window.setTimeout(endPreviewPhase, PREVIEW_SECONDS * 1000);
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

  if (state.matchedPairs === state.pairCount) {
    state.lockBoard = true;
    renderBoard();
    setStatus(`第 ${state.level} 關完成。`);
    window.setTimeout(showLevelCompleteOverlay, 280);
    return;
  }

  state.lockBoard = false;
  renderBoard();
  setStatus("配對成功，繼續找下一對車款。");
}

function flipCard(cardId) {
  state.cards = state.cards.map((card) => (
    card.id === cardId ? { ...card, isFlipped: true } : card
  ));
  renderBoard();
}

function onCardSelect(cardId) {
  const card = getCardById(cardId);

  if (!card || state.lockBoard || card.isFlipped || card.isMatched) {
    return;
  }

  flipCard(cardId);

  if (!state.firstPickId) {
    state.firstPickId = cardId;
    setStatus("已翻開第一張車款，請再翻第二張。");
    return;
  }

  state.secondPickId = cardId;
  state.lockBoard = true;

  const firstCard = getCardById(state.firstPickId);
  const secondCard = getCardById(state.secondPickId);

  if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
    setStatus("配對成功。");
    state.resolveTimeoutId = window.setTimeout(handleMatch, MATCH_DELAY_MS);
    return;
  }

  setStatus("配對失敗，車款即將翻回背面。");
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

setLevel(INITIAL_LEVEL);
startLevel();
