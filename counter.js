class Count {
  constructor(p1, p2, p1set, p2set, P1Serves, isFirstPos) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1set = p1set;
    this.p2set = p2set;
    this.P1Serves = P1Serves;
    this.isFirstPos = isFirstPos;
  }
}
class Result {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

class Player {
  constructor() {
    this.score = 0;
    this.set = 0;
    this.name = '';
  }
}

setup = () => {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  // 変数初期化
  hasStarted = false;
  P1ServesFirst = true;
  isFirstPos = true;
  fullsetCourtChangeDone = false;
  P1Serves = P1ServesFirst;
  matchHistory = [];
  setHistory = [];
  touchStartPos = [];
  swipeLength = (new UI()).heightVW(5);
  gamesetNum = 5;

  p1 = new Player();
  p2 = new Player();
  p1.name = 'A';
  p2.name = 'B';
  phaze = 0;

  // ---- UI ----

  uimanager = new UIManager();
  uimanager.bgColor = [58, 58, 89];
  UIheight = 80;

  // uiview

  endGameButton = new UIView(0, 0, UIheight, UIheight);
  switchSideButton = new UIView(UIheight, 0, UIheight, UIheight);
  undoButton = new UIView(-2 * UIheight, 0, UIheight, UIheight);
  redoButton = new UIView(-UIheight, 0, UIheight, UIheight);

  endGameButton.onTouch = () => {
    console.log('endGame');
    resetLS();
    setup();
  }
  switchSideButton.onTouch = () => {
    console.log('switchSide');
    switchCourt();
  }
  undoButton.onTouch = () => {
    console.log('undo');
    undo();
  }
  redoButton.onTouch = () => {
    console.log('redo');
    redo();
  }

  undoButton.point.hAlign = 1;
  redoButton.point.hAlign = 1;

  let uiviews = [endGameButton, switchSideButton, undoButton, redoButton];
  for (let i = 0; i < uiviews.length; i++) {
    uiviews[i].alpha = 0;
    uiviews[i].border = true;
    uiviews[i].borderColor = [219, 59, 97];
    uiviews[i].touchEvent = true;
    uimanager.add(uiviews[i]);
  }

  // line

  line0 = new UILine(new UIPoint(0, UIheight, 0.5), new UIPoint(0, 0, 0.5, 1));
  line1 = new UILine(new UIPoint(0, UIheight), new UIPoint(0, UIheight, 2));

  let lines = [line0, line1];
  for (let i = 0; i < lines.length; i++) {
    lines[i].color = [219, 59, 97];
    lines[i].weight = 2;
    uimanager.add(lines[i]);
  }

  // label

  endGameLabel = new UILabel('試合終了', 0.5 * UIheight, UIheight * 0.5);
  switchSideLabel = new UILabel('入れ替え', 1.5 * UIheight, UIheight * 0.5);
  undoLabel = new UILabel('戻る', -1.5 * UIheight, UIheight * 0.5);
  redoLabel = new UILabel('進む', -0.5 * UIheight, UIheight * 0.5);
  console.log(undoLabel);
  undoLabel.point.hAlign = 1;
  redoLabel.point.hAlign = 1;

  let uilabels = [endGameLabel, switchSideLabel, undoLabel, redoLabel];
  for (let i = 0; i < uilabels.length; i++) {
    uilabels[i].staticSize = 15;
    uimanager.add(uilabels[i]);
  }

  towelLabel = new UILabel('タオルOK', 0, UIheight);
  howtouseDescription = new UILabel('点数を操作するには上下にスワイプしてください', 0, UIheight * 0.5);
  towelLabel.point.hAlign = 0.5;
  towelLabel.point.vAlign = 0.1;
  howtouseDescription.point.hAlign = 0.5;
  howtouseDescription.point.vAlign = 0;
  towelLabel.dynamicSize = true;
  towelLabel.dynamicSizeRate = 0.2;
  howtouseDescription.staticSize = 15;
  towelLabel.enabled = false;
  howtouseDescription.enabled = false;
  uimanager.add(towelLabel);
  uimanager.add(howtouseDescription);

  // score

  p1Score = new UILabel(p1.score, 0, UIheight);
  p2Score = new UILabel(p2.score, 0, UIheight);
  p1Name = new UILabel(p1.name, 0, UIheight);
  p2Name = new UILabel(p2.name, 0, UIheight);
  p1Set = new UILabel(p1.set, 0, UIheight);
  p2Set = new UILabel(p2.set, 0, UIheight);
  p1Score.dynamicSizeRate = 1.0;
  p2Score.dynamicSizeRate = 1.0;
  p1Name.dynamicSizeRate = 0.2;
  p2Name.dynamicSizeRate = 0.2;
  p1Set.dynamicSizeRate = 0.2;
  p2Set.dynamicSizeRate = 0.2;
  p1Score.point.vAlign = 0.5;
  p2Score.point.vAlign = 0.5;
  p1Name.point.vAlign = 0.1;
  p2Name.point.vAlign = 0.1;
  p1Set.point.vAlign = 0.85;
  p2Set.point.vAlign = 0.85;

  let p1p2uis = [p1Score, p2Score, p1Name, p2Name, p1Set, p2Set];
  for (let i = 0; i < p1p2uis.length; i++) {
    if (i % 2 == 0) {
      p1p2uis[i].point.hAlign = 0.25;
    } else {
      p1p2uis[i].point.hAlign = 0.75;
    }
    p1p2uis[i].dynamicSize = true;
    uimanager.add(p1p2uis[i]);
  }

  // circle

  serveIndicator = new UICircle(0.15, 0, 0);
  serveIndicator.point.hAlign = 0.25;
  serveIndicator.point.vAlign = 0.80;
  uimanager.add(serveIndicator);

  matchHistory.push(new Count(p1.score, p2.score, p1.set, p2.set, P1Serves, isFirstPos));

  if (localStorage.matchHistory) {
    restoreValues();
    restoreFromCache(phaze);
    valueUpdate();
    sideUpdate();
  }
  setSize();
  customDraw();
};

const preventDefaultTouchEvents = () => {
  var listener = function (e) {
    e.preventDefault();
  }
  document.addEventListener('touchmove', listener, { passive: false });
};

const xor = (a, b) => {
  return (a || b) && !(a && b);
}
const setSize = () => {
  let baseSize = 40;
  swipeLength = (new UI()).heightVW(5);
  uimanager.updateSize(baseSize);
}

const switchUISide = (ui, isLeftSide) => {
  if (isLeftSide) {
    ui.point.hAlign = 0.25;
  } else {
    ui.point.hAlign = 0.75
  }
}
const sideUpdate = () => {
  switchUISide(serveIndicator, !xor(isFirstPos, P1Serves));
  switchUISide(p1Score, !xor(isFirstPos, true));
  switchUISide(p2Score, !xor(isFirstPos, false));
  switchUISide(p1Name, !xor(isFirstPos, true));
  switchUISide(p2Name, !xor(isFirstPos, false));
  switchUISide(p1Set, !xor(isFirstPos, true));
  switchUISide(p2Set, !xor(isFirstPos, false));
}
const valueUpdate = () => {
  p1Score.label = p1.score;
  p2Score.label = p2.score;
  p1Set.label = p1.set;
  p2Set.label = p2.set;
  saveToLS();
}
const customDraw = () => {
  // towel
  if ((p1.score + p2.score) % 6 == 0 && (p1.score > 0 || p2.score > 0)) {
    towelLabel.enabled = true;
  } else {
    towelLabel.enabled = false;
  }
  if (p1.score + p2.score + p1.set + p2.set == 0) {
    howtouseDescription.enabled = true;
  } else {
    howtouseDescription.enabled = false;
  }
  uimanager.draw();
}

window.onresize = () => {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w, h);
  width = w;
  height = h;
  setSize();
  customDraw();
};

const changeScore = (isP1, isPlus = true) => {
  if (isP1) {
    p1.score += isPlus ? 1 : -1;
  } else {
    p2.score += isPlus ? 1 : -1;
  }
  let isP1ServeAtSetStart = !xor((p1.set + p2.set) % 2 == 0, P1ServesFirst);
  let isDeuce = p1.score >= 10 && p2.score >= 10;

  if (isDeuce) {
    if ((p1.score + p2.score) % 2 == 0) { // 10-10 -> p1 serves
      P1Serves = !xor(true, isP1ServeAtSetStart);
    } else {
      P1Serves = !xor(false, isP1ServeAtSetStart);
    }
  } else {
    if (Math.floor((p1.score + p2.score) / 2) % 2 == 0) {
      P1Serves = !xor(true, isP1ServeAtSetStart);
    } else {
      P1Serves = !xor(false, isP1ServeAtSetStart);
    }
  }
  if (matchHistory.length == phaze + 1) {
    matchHistory.push(new Count(p1.score, p2.score, p1.set, p2.set, P1Serves, isFirstPos));
  } else if (matchHistory.length > phaze + 1) {
    // override cache
    matchHistory = matchHistory.slice(0, phaze + 1);
    matchHistory.push(new Count(p1.score, p2.score, p1.set, p2.set, P1Serves, isFirstPos));
  } else {
    console.log('unknown issue has occured')
  }
  phaze++;
}
const addScore = (isP1) => {
  hasStarted = true;
  let isEnd = isSetEnd();
  if (!isEnd) {
    changeScore(isP1, true);
    checkFullsetChangeCourt();
    sideUpdate();
    valueUpdate();
  } else {
    if (p1.score > p2.score) {
      p1.set++;
    } else {
      p2.set++;
    }
    saveSetScore();
    resetScore();
    isFirstPos = !isFirstPos;
    sideUpdate();
    valueUpdate();
    customDraw();

    let finishSetNum = Math.floor(gamesetNum / 2) + 1;
    if (p1.set == finishSetNum || p2.set == finishSetNum) {
      showResult();
    }
  }
}

const minusScore = (isP1) => {
  if (isP1 && p1.score > 0) {
    changeScore(isP1, false);
  } else if (!isP1 && p2.score > 0) {
    changeScore(isP1, false);
  }
}
touchStarted = () => {
  touchStartPos = [mouseX, mouseY];
}

touchMoved = () => {
  customDraw()
  strokeWeight(10); // Beastly
  line(touchStartPos[0], touchStartPos[1], touchStartPos[0], mouseY);
  return false;
}
touchEnded = () => {
  console.log('touch ended called');
  let diff = touchStartPos[1] - mouseY;
  let x = (touchStartPos[0] + mouseX) / 2;
  let isP1 = !xor(x < width * 0.5, isFirstPos);
  if (diff > swipeLength) {
    console.log('addscore called in touch');
    addScore(isP1)
  } else if (diff < -swipeLength) {
    console.log('minusscore called in touch');
    minusScore(isP1);
  } else {
    onTouch();
  }
  customDraw();
}
const onTouch = () => {
  uimanager.onTouch();
};

const isSetEnd = () => {
  if (p1.score < 11 && p2.score < 11) {
    return false;
  } else {    //p1 p2 少なくとも一方が11以上
    return Math.abs(p1.score - p2.score) >= 2;
  }
}

const saveSetScore = (setNum = p1.set + p2.set) => { // setNum <- 1, 2, 3, ...
  if (setNum > setHistory.length) {
    setHistory.push(new Result(p1.score, p2.score));
  } else {
    setHistory[setNum - 1] = new Result(p1.score, p2.score);
  }
  console.table(setHistory);
}

const checkFullsetChangeCourt = () => {
  let setNumAtFullset = Math.floor(gamesetNum / 2);
  if (p1.set == setNumAtFullset && p2.set == setNumAtFullset && (p1.score == 5 || p2.score == 5) && !fullsetCourtChangeDone) {
    fullsetCourtChangeDone = true;
    alert('コートチェンジしてください');
    isFirstPos = !isFirstPos;
  }
}
const resetScore = () => {
  p1.score = 0;
  p2.score = 0;
  P1Serves = !xor((p1.set + p2.set) % 2 == 0, P1ServesFirst);
  matchHistory.push(new Count(p1.score, p2.score, p1.set, p2.set, P1Serves, isFirstPos));
  phaze++;
}

const matchHistoryIncludes = (i) => {
  return i >= 0 && i < matchHistory.length;
}

const restoreFromCache = (i) => {
  cache = matchHistory[i];
  console.log(phaze);
  p1.score = cache.p1;
  p2.score = cache.p2;
  p1.set = cache.p1set;
  p2.set = cache.p2set;
  P1Serves = cache.P1Serves;
  isFirstPos = cache.isFirstPos;
}

const undo = () => {
  if (matchHistoryIncludes(phaze - 1)) {
    phaze--;
    restoreFromCache(phaze);
    sideUpdate();
    valueUpdate();
    customDraw();
  }
}

const redo = () => {
  if (matchHistoryIncludes(phaze + 1)) {
    restoreFromCache(phaze + 1);
    phaze++;
    sideUpdate();
    valueUpdate();
    customDraw();
  }
}
const switchCourt = () => {
  isFirstPos = !isFirstPos;
}

const endGame = () => {
  if (p1.score > 0 || p2.score > 0) {
    saveSetScore(p1.set + p2.set + 1)
  } else if (p1.set == 0 && p2.set == 0) {
    saveSetScore(p1.set + p2.set + 1);
  }
  showResult();
}

const showResult = () => {
  resetLS();
  if (window.navigator.onLine) {
    var str = '';
    for (let i = 0; i < setHistory.length; i++) {
      let result = setHistory[i];
      str += String(result.p1) + '-' + String(result.p2) + '_';
    }
    str = str.slice(0, -1);
    let path = window.location.pathname;
    let dir = path.replace(/(.*?)[^/]*\..*$/, '$1');
    console.log(dir);
    location.href = dir + 'result.html' + "?result=" + encodeURIComponent(str);
  } else {
    var str = '';
    for (let i = 0; i < setHistory.length; i++) {
      let result = setHistory[i];
      str += String(result.p1) + ' - ' + String(result.p2) + '\n';
    }
    str = str.slice(0, -1);
    location.href = `data:,${encodeURIComponent(str)}`
  }
}