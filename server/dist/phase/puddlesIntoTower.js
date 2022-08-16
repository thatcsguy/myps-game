"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuddlesIntoTower = void 0;
const chariot_1 = require("../mechanic/chariot");
const puddle_1 = require("../mechanic/puddle");
const spread_1 = require("../mechanic/spread");
const tower_1 = require("../mechanic/tower");
const phase_1 = require("./phase");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
class PuddlesIntoTower extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 14000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        const chariotR = 150;
        const puddleCount = 7;
        const puddleTimeGap = 1500;
        const initialMoveTime = 3000;
        let puddlePlayer = gameState.randomPlayer();
        let bigChariot = new chariot_1.Chariot(200, 200, 350);
        this.schedule(bigChariot, 0, initialMoveTime);
        let status = new status_1.Status(statusType_1.StatusType.DROPPING_PUDDLES);
        status.stacks = puddleCount;
        status.schedule(this.getPhaseStart(), this.phaseDuration);
        gameState.players.get(puddlePlayer).statuses.push(status);
        for (let i = 0; i < puddleCount; i++) {
            let chariot = new chariot_1.Chariot(0, 0, chariotR);
            this.schedule(chariot, initialMoveTime + puddleTimeGap * i, initialMoveTime + puddleTimeGap * (i + 1));
            chariot.spawnOnPlayer(puddlePlayer);
            chariot.onVisible(() => {
                status.stacks--;
            });
            let puddleStart = initialMoveTime + puddleTimeGap * (i + 1);
            let puddleDuration = (puddleCount - i) * puddleTimeGap;
            chariot.onComplete((gameState, mech) => {
                let puddle = new puddle_1.Puddle(mech.x, mech.y, chariotR);
                this.schedule(puddle, puddleStart, puddleStart + puddleDuration);
            });
        }
        let tower = new tower_1.Tower(200, 200, 150, gameState.players.size);
        this.schedule(tower, initialMoveTime, this.phaseDuration);
        let spreadPlayers = gameState.randomPlayers(2);
        for (let p of spreadPlayers) {
            let spread = new spread_1.Spread(200);
            spread.applyToTarget(p);
            this.schedule(spread, initialMoveTime, this.phaseDuration);
        }
    }
}
exports.PuddlesIntoTower = PuddlesIntoTower;
//# sourceMappingURL=puddlesIntoTower.js.map