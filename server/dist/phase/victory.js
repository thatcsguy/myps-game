"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victory = void 0;
const phase_1 = require("./phase");
class Victory extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 2000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        gameState.messages.push('poggers dude');
    }
}
exports.Victory = Victory;
//# sourceMappingURL=victory.js.map