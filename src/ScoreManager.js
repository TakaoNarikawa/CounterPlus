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
        this.finalSetChangeCoatHasDone = false
        this.finalSetReversed = false

        this.log = [new Score(this.p1, this.p2, this.servReversed, this.posReversed)];
        this.logIndex = 0;

        this.changeGameset(5);

        this.updateContentInterface = () => {}
        this.updateBarInterface = () => {}
    }

    changeGameset = (n) => {
        this.gameSetNum = n;
        this.finalSetNum = this.calcFinalSetNum(n);
        console.log(this.finalSetNum)
    }

    calcFinalSetNum = (n) => {
        return Math.floor(n / 2)
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

        console.log(this.p1.set, this.finalSetNum, this.p2.set, this.finalSetNum, this.p1.score, this.p2.score, this.finalSetChangeCoatHasDone)
        if (this.p1.set === this.finalSetNum && this.p2.set === this.finalSetNum && (this.p1.score === 5 || this.p2.score === 5) && !this.finalSetChangeCoatHasDone) {
            alert("コートチェンジをしてください")
            this.finalSetChangeCoatHasDone = true;
            this.finalSetReversed = true;
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

        if (this.p1.set > this.finalSetNum || this.p2.set > this.finalSetNum) {
            let res = this.result();
            this.onEndGame(res);
            console.log(res)
        } else {
            this.posReversed = (this.p1.set + this.p2.set) % 2 === 1
            this.changeServReversed();
            this.pushHistory();
            this.updateInterface();
        }
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

    reset = () => {
        this.p1 = new Player();
        this.p2 = new Player();

        this.servReversed = false;
        this.posReversed = false;
        this.finalSetChangeCoatHasDone = false

        this.log = [new Score(this.p1, this.p2, this.servReversed, this.posReversed)];
        this.logIndex = 0;

        this.updateInterface();
    }

    result = () => {
        var setResults = []

        if (this.log.length < 1) {
            return [{
                p1score: 0,
                p2score: 0,
                p1set: 0,
                p2set: 0
            }]
        }

        for (var i = 1; i < this.log.length; i++) {
            let log = this.log[i]
            if (this.isSetFinished(log.p1, log.p2)) {
                let setResult = {
                    p1score: log.p1,
                    p2score: log.p2,
                    p1set: log.p1set,
                    p2set: log.p2set
                }
                if (log.p1 > log.p2) {
                    setResult.p1set += 1
                } else {
                    setResult.p2set += 1
                }
                setResults.push(setResult)
            }
        }

        let log = this.log[this.log.length - 1]

        if (!this.isSetFinished(log.p1, log.p2)) {
            let setResult = {
                p1score: log.p1,
                p2score: log.p2,
                p1set: log.p1set,
                p2set: log.p2set
            }
            setResults.push(setResult)
        }

        return setResults;
    }

    isDeuce = () => {
        return this.p1.score > 9 && this.p2.score > 9;
    }

    isSetFinished = (p1 = this.p1.score, p2 = this.p2.score) => {
        return Math.abs(p1 - p2) > 1 && (p1 > 10 || p2 > 10);
    }
    isPosReversed = () => {
        return xor(xor(this.posReversed, this.primServReversed), this.finalSetReversed);
    }
    leftServes = () => {
        return !xor(this.posReversed, this.servReversed)
    }
    logIncludes = (i) => {
        return i > -1 && i < this.log.length;
    }
}