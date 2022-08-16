"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnockToTowers = void 0;
const dynamo_1 = require("../mechanic/dynamo");
const knockback_1 = require("../mechanic/knockback");
const tower_1 = require("../mechanic/tower");
const utils_1 = require("../utils");
const phase_1 = require("./phase");
class KnockToTowers extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 3900;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let kbChoices = (0, utils_1.shuffle)([
            [400, 50],
            [400, 750],
            [50, 400],
            [750, 400]
        ]);
        let choice = kbChoices.pop();
        let kb = new knockback_1.Knockback(choice[0], choice[1], 700, 300);
        this.schedule(kb, 0, 2800);
        let dyn = new dynamo_1.Dynamo(choice[0], choice[1], 200, 1000);
        this.schedule(dyn, 0, 2400);
        let towerChoices = (0, utils_1.shuffle)([
            [100, 100],
            [100, 700],
            [700, 100],
            [700, 700]
        ]);
        for (let i = 0; i < gameState.players.size; i++) {
            let choice = towerChoices.pop();
            let tower = new tower_1.Tower(choice[0], choice[1], 50, 1);
            this.schedule(tower, 1300, 3900);
        }
    }
}
exports.KnockToTowers = KnockToTowers;
//# sourceMappingURL=knockToTowers.js.map