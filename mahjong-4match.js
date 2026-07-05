const PREVIEW_SECONDS = 8;
const MISMATCH_DELAY_MS = 900;
const MATCH_DELAY_MS = 450;
const LEVEL_COMPLETE_DELAY_MS = 280;
const FIXED_LEVEL = 1;
const FIXED_PAIR_COUNT = 4;
const MOBILE_BREAKPOINT = 768;
const CARD_ASPECT_RATIO = 0.72;
const MOBILE_BOTTOM_GUTTER = 28;

const { tilePool, renderTileContent } = window.MahjongTiles;

const boardStageElement = document.querySelector("#board-stage");
const boardElement = document.querySelector("#board");
const levelNumberElement = document.querySelector("#level-number");
const pairCountElement = document.querySelector("#pair-count");
const statusTextElement = document.querySelector("#status-text");
const overlayElement = document.querySelector("#overlay");
const dialogTitleElement = document.querySelector("#dialog-title");
const dialogMessageElement = document.querySelector("#dialog-message");
const continueButton = document.querySelector("#continue-btn");
const endButton = document.querySelector("#end-btn");
const restartButton = document.querySelector("#restart-btn");

const state = {
  cards: [],
  firstPickId: null,
  secondPickId: null,
  lockBoard: true,
  matchedPairs: 0,
  previewTimeoutId: null,
  countdownIntervalId: null,
  resolveTimeoutId: null,
  levelCompleteTimeoutId: null
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
  window.clearTimeout(state.levelCompleteTimeoutId);
  window.clearInterval(state.countdownIntervalId);
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
  levelNumberElement.textContent = FIXED_LEVEL;
  pairCountElement.textContent = FIXED_PAIR_COUNT;
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
}

function showOverlay({ title, message, showContinue, showEnd, showRestart }) {
  dialogTitleElement.textContent = title;
  dialogMessageElement.textContent = message;
  continueButton.classList.toggle("hidden", !showContinue);
  endButton.classList.toggle("hidden", !showEnd);
  restartButton.classList.toggle("hidden", !showRestart);
  overlayElement.classList.remove("hidden");
  overlayElement.setAttribute("aria-hidden", "false");
}

function startPreviewCountdown() {
  let secondsLeft = PREVIEW_SECONDS;
  setStatus(`請先記住牌面，${secondsLeft} 秒後開始翻牌。`);

  state.countdownIntervalId = window.setInterval(() => {
    secondsLeft -= 1;

    if (secondsLeft > 0) {
      setStatus(`請先記住牌面，${secondsLeft} 秒後開始翻牌。`);
    }
  }, 1000);
}

function endPreviewPhase() {
  window.clearInterval(state.countdownIntervalId);
  state.cards = state.cards.map((card) => ({ ...card, isFlipped: false }));
  state.lockBoard = false;
  renderBoard();
  setStatus("遊戲開始，請翻兩張牌找出相同的麻將牌。");
}

function startLevel() {
  clearTimers();
  hideOverlay();
  state.firstPickId = null;
  state.secondPickId = null;
  state.lockBoard = true;
  state.matchedPairs = 0;
  state.cards = createDeck(FIXED_PAIR_COUNT);
  updateHeader();
  renderBoard();
  startPreviewCountdown();
  state.previewTimeoutId = window.setTimeout(endPreviewPhase, PREVIEW_SECONDS * 1000);
}

function resetSelection() {
  state.firstPickId = null;
  state.secondPickId = null;
}

function showLevelCompleteOverlay() {
  showOverlay({
    title: "本局完成",
    message: "請選擇再玩一局，或直接結束遊戲。",
    showContinue: true,
    showEnd: true,
    showRestart: false
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

  if (state.matchedPairs === FIXED_PAIR_COUNT) {
    state.lockBoard = true;
    renderBoard();
    setStatus("本局完成。");
    state.levelCompleteTimeoutId = window.setTimeout(showLevelCompleteOverlay, LEVEL_COMPLETE_DELAY_MS);
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

  window.close();

  window.setTimeout(() => {
    showOverlay({
      title: "遊戲已結束",
      message: "瀏覽器可能阻止了自動關閉視窗，請直接關閉此分頁；若想重新挑戰，也可以重新開始。",
      showContinue: false,
      showEnd: false,
      showRestart: true
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

continueButton.addEventListener("click", () => {
  startLevel();
});

endButton.addEventListener("click", () => {
  endGame();
});

restartButton.addEventListener("click", () => {
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

startLevel();
