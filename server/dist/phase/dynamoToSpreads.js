"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoToSpreads = void 0;
const dynamo_1 = require("../mechanic/dynamo");
const spread_1 = require("../mechanic/spread");
const phase_1 = require("./phase");
class DynamoToSpreads extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 5000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let dynamo = new dynamo_1.Dynamo(400, 400, 100, 566);
        this.schedule(dynamo, 0, 300);
        let spreadRadius = gameState.players.size <= 4 ? 370 : 200;
        for (let [p,] of gameState.players) {
            let spread = new spread_1.Spread(spreadRadius);
            spread.applyToTarget(p);
            this.schedule(spread, 2200, 5000);
        }
    }
}
exports.DynamoToSpreads = DynamoToSpreads;
//# sourceMappingURL=dynamoToSpreads.js.map