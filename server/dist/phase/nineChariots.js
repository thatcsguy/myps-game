"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NineChariots = void 0;
const chariot_1 = require("../mechanic/chariot");
const globals_1 = require("../globals");
const utils_1 = require("../utils");
const phase_1 = require("./phase");
class NineChariots extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 7400;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        const timeBetween = 300;
        const chariotR = globals_1.GLOBALS.arenaWidth / 4;
        const interval = (globals_1.GLOBALS.arenaWidth / 2) / Math.sqrt(2);
        let coords = (0, utils_1.shuffle)([
            [400 - interval, 400 - interval],
            [400, 400 - interval],
            [400 + interval, 400 - interval],
            [400 - interval, 400],
            [400, 400],
            [400 + interval, 400],
            [400 - interval, 400 + interval],
            [400, 400 + interval],
            [400 + interval, 400 + interval],
        ]);
        for (let i = 0; i < coords.length; i++) {
            let chariot = new chariot_1.Chariot(coords[i][0], coords[i][1], chariotR);
            this.schedule(chariot, timeBetween * i, timeBetween * i + 5000);
        }
    }
}
exports.NineChariots = NineChariots;
//# sourceMappingURL=nineChariots.js.map