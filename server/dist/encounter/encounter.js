"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encounter = void 0;
class Encounter {
    constructor() {
        this.currentIndex = 0;
        this.previousPhaseStart = 0;
        this.previousPhaseDuration = 0;
        this.deathWalls = false;
    }
    process(gameState) {
        if (this.activePhase) {
            this.activePhase.process(gameState);
        }
        if (this.currentIndex >= this.script.length
            || gameState.now - this.script[this.currentIndex].restTime <= this.previousPhaseStart + this.previousPhaseDuration) {
            return;
        }
        this.previousPhaseStart += this.previousPhaseDuration + this.script[this.currentIndex].restTime;
        this.activePhase = this.script[this.currentIndex].phase;
        this.activePhase.init(gameState, this.previousPhaseStart);
        this.previousPhaseDuration = this.activePhase.phaseDuration;
        this.currentIndex++;
    }
    reset() {
        this.currentIndex = 0;
        this.previousPhaseStart = 0;
        this.previousPhaseDuration = 0;
    }
}
exports.Encounter = Encounter;
//# sourceMappingURL=encounter.js.map