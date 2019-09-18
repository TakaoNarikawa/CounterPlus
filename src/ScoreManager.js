const xor = (a, b) => {
    return (a || b) && !(a && b);
}

class Score {
    constructor(p1, p2, servReversed, posReversed) {
        this.p1 = p1.score;
        this.p2 = p2.score;
        this.p1set = p1.set;
        this.p2set = p2.set;
        this.servReversed = servReversed;
        this.posReversed = posReversed;
    }
}

class Player {
    constructor() {
        this.score = 0;
        this.set = 0;
    }
}

export default class ScoreManager {
    constructor() {
        this.p1 = new Player();
        this.p2 = new Player();

        this.servReversed = false;
        this.posReversed = false;

        // once this is set, this will never changed
        this.primServReversed = false;

        this.gameset = 5;

        this.log = [new Score(this.p1, this.p2, this.servReversed, this.posReversed)];
        this.logIndex = 0;
    }

    addScore = (isP1) => {
        if (this.isSetFinished()) {
            this.proceedNextSet()
            return;
        }
        this.changeScore(isP1, true);
    }

    minusScore = (isP1) => {
        if ((isP1 && this.p1.score < 1) || (!isP1 && this.p2.score < 1)) {
            return;
        }
        this.changeScore(isP1, false);
    }

    changeScore = (isP1, isPlus) => {
        if (isP1) {
            this.p1.score += isPlus ? 1 : -1;
        } else {
            this.p2.score += isPlus ? 1 : -1;
        }
        this.changeServReversed();
        this.pushHistory();
        this.updateInterface();
    }
    updateInterface = () => {
        this.updateContentInterface(this.p1, this.p2, this.leftServes(), this.isPosReversed());
        this.updateBarInterface(this.logIncludes(this.logIndex + 1), this.logIncludes(this.logIndex - 1));
    }

    proceedNextSet = () => {
        let isP1Winner = this.p1.score > this.p2.score;
        this.p1.score = 0;
        this.p2.score = 0;
        if (isP1Winner) {
            this.p1.set += 1;
        } else {
            this.p2.set += 1;
        }

        this.posReversed = (this.p1.set + this.p2.set) % 2 === 1

        this.changeServReversed();
        this.pushHistory();
        this.updateInterface();
    }

    changeServReversed = () => {
        if (this.isDeuce()) {
            this.servReversed = xor((this.p1.score + this.p2.score) % 2 === 0, !this.primServReversed);
        } else {
            this.servReversed = xor(Math.floor((this.p1.score + this.p2.score) / 2) % 2 === 0, !this.primServReversed);
        }
    }

    undo = () => {
        if (this.logIncludes(this.logIndex - 1)) {
            this.logIndex--;
            this.restoreFromLog(this.logIndex);
        }
    }

    redo = () => {
        if (this.logIncludes(this.logIndex + 1)) {
            this.logIndex++;
            this.restoreFromLog(this.logIndex);
        }
    }

    pushHistory = () => {
        let newEle = new Score(this.p1, this.p2, this.servReversed, this.posReversed);
        if (this.log.length === this.logIndex + 1) {
            this.log.push(newEle);
        } else if (this.log.length > this.logIndex + 1) {
            // override cache
            this.log = this.log.slice(0, this.logIndex + 1);
            this.log.push(newEle);
        } else {
            console.log('unknown issue occured')
        }
        this.logIndex++;
    }

    restoreFromLog = (i) => {
        let log = this.log[i];
        this.p1.score = log.p1;
        this.p2.score = log.p2;
        this.p1.set = log.p1set;
        this.p2.set = log.p2set;
        this.servReversed = log.servReversed;
        this.posReversed = log.posReversed;

        this.updateInterface();
    }

    isDeuce = () => {
        return this.p1.score > 9 && this.p2.score > 9;
    }

    isSetFinished = () => {
        return Math.abs(this.p1.score - this.p2.score) > 1 && (this.p1.score > 10 || this.p2.score > 10);
    }
    isPosReversed = () => {
        return xor(this.posReversed, this.primServReversed);
    }
    leftServes = () => {
        return !xor(this.primServReversed, xor(this.posReversed, this.servReversed))
    }
    logIncludes = (i) => {
        return i > -1 && i < this.log.length;
    }
}