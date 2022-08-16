"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phase = void 0;
class Phase {
    init(gameState, phaseStart) {
        this.gameState = gameState;
        this.phaseStart = phaseStart;
    }
    process(gameState) {
        // optional method
    }
    schedule(mech, start, end) {
        this.gameState.schedule(mech, this.phaseStart + start, end - start);
    }
    getPhaseStart() {
        return this.phaseStart;
    }
}
exports.Phase = Phase;
//# sourceMappingURL=phase.js.map