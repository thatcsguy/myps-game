"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeEdges = void 0;
const chariot_1 = require("../mechanic/chariot");
const spread_1 = require("../mechanic/spread");
const phase_1 = require("./phase");
class SafeEdges extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 6500;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        const coords = [
            [400, 400],
            [0, 0],
            [800, 0],
            [0, 800],
            [800, 800]
        ];
        for (let i = 0; i < coords.length; i++) {
            let chariot = new chariot_1.Chariot(coords[i][0], coords[i][1], 300);
            this.schedule(chariot, 0, 6500);
        }
        let choices = [
            [400, 0],
            [0, 400],
            [800, 400],
            [400, 800]
        ];
        let rand = Math.random() * 4 << 0;
        let chariot = new chariot_1.Chariot(choices[rand][0], choices[rand][1], 300);
        this.schedule(chariot, 2000, 6500);
        let shuffled = gameState.randomPlayers(2);
        for (let i = 0; i < 2 && i < shuffled.length; i++) {
            let spread = new spread_1.Spread(300);
            spread.applyToTarget(shuffled[i]);
            this.schedule(spread, 2000, 6500);
        }
    }
}
exports.SafeEdges = SafeEdges;
//# sourceMappingURL=safeEdges.js.map