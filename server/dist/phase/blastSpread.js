"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlastSpread = void 0;
const dynamo_1 = require("../mechanic/dynamo");
const knockback_1 = require("../mechanic/knockback");
const spread_1 = require("../mechanic/spread");
const phase_1 = require("./phase");
class BlastSpread extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 5000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let dynamo = new dynamo_1.Dynamo(400, 400, 100, 566);
        this.schedule(dynamo, 0, 3700);
        let kb = new knockback_1.Knockback(400, 400, 300, 200);
        this.schedule(kb, 0, 4000);
        let spreadRadius = gameState.players.size <= 4 ? 370 : 200;
        for (let [p,] of gameState.players) {
            let spread = new spread_1.Spread(spreadRadius);
            spread.applyToTarget(p);
            this.schedule(spread, 1000, 5000);
        }
    }
}
exports.BlastSpread = BlastSpread;
//# sourceMappingURL=blastSpread.js.map