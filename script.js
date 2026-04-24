const INITIAL_PREVIEW_SECONDS = 5;
const MISMATCH_DELAY_MS = 900;
const MATCH_DELAY_MS = 450;
const INITIAL_LEVEL = 1;
const INITIAL_PAIR_COUNT = 2;
const JUMP_STEP = 5;
const MOBILE_BREAKPOINT = 768;

const cardPool = [
  { rank: "A", suit: "♠", key: "AS", color: "black" },
  { rank: "K", suit: "♠", key: "KS", color: "black" },
  { rank: "Q", suit: "♠", key: "QS", color: "black" },
  { rank: "J", suit: "♠", key: "JS", color: "black" },
  { rank: "10", suit: "♠", key: "10S", color: "black" },
  { rank: "9", suit: "♠", key: "9S", color: "black" },
  { rank: "A", suit: "♥", key: "AH", color: "red" },
  { rank: "K", suit: "♥", key: "KH", color: "red" },
  { rank: "Q", suit: "♥", key: "QH", color: "red" },
  { rank: "J", suit: "♥", key: "JH", color: "red" },
  { rank: "10", suit: "♥", key: "10H", color: "red" },
  { rank: "9", suit: "♥", key: "9H", color: "red" },
  { rank: "A", suit: "♦", key: "AD", color: "red" },
  { rank: "K", suit: "♦", key: "KD", color: "red" },
  { rank: "Q", suit: "♦", key: "QD", color: "red" },
  { rank: "J", suit: "♦", key: "JD", color: "red" },
  { rank: "10", suit: "♦", key: "10D", color: "red" },
  { rank: "9", suit: "♦", key: "9D", color: "red" },
  { rank: "A", suit: "♣", key: "AC", color: "black" },
  { rank: "K", suit: "♣", key: "KC", color: "black" },
  { rank: "Q", suit: "♣", key: "QC", color: "black" },
  { rank: "J", suit: "♣", key: "JC", color: "black" },
  { rank: "10", suit: "♣", key: "10C", color: "black" },
  { rank: "9", suit: "♣", key: "9C", color: "black" }
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
  return INITIAL_LEVEL + (cardPool.length - INITIAL_PAIR_COUNT);
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
  return Math.min(state.pairCount, cardPool.length);
}

function getPreviewSeconds() {
  return INITIAL_PREVIEW_SECONDS + (state.level - INITIAL_LEVEL);
}

function createDeck(pairCount) {
  const selectedCards = shuffle(cardPool).slice(0, pairCount);
  const duplicatedCards = selectedCards.flatMap((card, index) => ([
    {
      id: `${card.key}-${index}-a`,
      pairKey: card.key,
      rank: card.rank,
      suit: card.suit,
      color: card.color,
      isFlipped: true,
      isMatched: false
    },
    {
      id: `${card.key}-${index}-b`,
      pairKey: card.key,
      rank: card.rank,
      suit: card.suit,
      color: card.color,
      isFlipped: true,
      isMatched: false
    }
  ]));

  return shuffle(duplicatedCards);
}

function getCardById(cardId) {
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
    const cardHeight = cardWidth / 0.72;
    const boardHeight = rows * cardHeight + gap * (rows - 1);
    chosenColumns = columns;

    if (boardHeight <= availableHeight) {
      break;
    }
  }

  return chosenColumns;
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
  const availableHeight = Math.max(window.innerHeight - stageTop - 12, 160);
  const columns = getMobileColumnCount(cardCount, availableWidth, availableHeight);

  boardElement.style.setProperty("--board-gap", `${gap}px`);
  boardElement.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  const naturalHeight = boardElement.scrollHeight;
  const scale = Math.min(1, availableHeight / naturalHeight);
  boardElement.style.transform = `scale(${scale})`;
  boardStageElement.style.height = `${naturalHeight * scale}px`;
}

function renderBoard() {
  boardElement.innerHTML = state.cards.map((card) => {
    const faceUpClass = card.isFlipped || card.isMatched ? "face-up" : "";
    const matchedClass = card.isMatched ? "matched" : "";
    const lockedClass = state.lockBoard ? "locked" : "";
    const redClass = card.color === "red" ? "red" : "";
    const label = `${card.rank}${card.suit}`;
    const disabledAttribute = card.isMatched ? "disabled" : "";

    return `
      <button
        type="button"
        class="card ${faceUpClass} ${matchedClass} ${lockedClass}"
        data-card-id="${card.id}"
        aria-label="樸克牌 ${label}"
        aria-pressed="${card.isFlipped || card.isMatched}"
        ${disabledAttribute}
      >
        <span class="card-inner">
          <span class="card-face card-back">
            <span class="card-back-mark">🂠</span>
          </span>
          <span class="card-face card-front ${redClass}">
            <span class="card-corner">
              <span class="card-rank">${card.rank}</span>
              <span class="card-suit">${card.suit}</span>
            </span>
            <span class="card-center">${card.suit}</span>
            <span class="card-corner bottom">
              <span class="card-rank">${card.rank}</span>
              <span class="card-suit">${card.suit}</span>
            </span>
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
  setStatus(`第 ${state.level} 關開始，請翻兩張牌找出相同的樸克牌。`);
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
  const card = getCardById(cardId);

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

  const firstCard = getCardById(state.firstPickId);
  const secondCard = getCardById(state.secondPickId);

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

setLevel(INITIAL_LEVEL);
startLevel();
