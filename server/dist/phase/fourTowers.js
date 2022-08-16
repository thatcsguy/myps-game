"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FourTowers = void 0;
const tower_1 = require("../mechanic/tower");
const phase_1 = require("./phase");
class FourTowers extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 3500;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let counts = [0, 0, 0, 0];
        for (let i = 0; i < gameState.players.size; i++) {
            counts[Math.random() * 4 << 0]++;
        }
        for (let i = 0; i < 4; i++) {
            let tower = new tower_1.Tower((i % 2 == 0) ? 800 / 3 : 1600 / 3, i < 2 ? 800 / 3 : 1600 / 3, 100, counts[i]);
            this.schedule(tower, 0, 3500);
        }
    }
}
exports.FourTowers = FourTowers;
//# sourceMappingURL=fourTowers.js.map