"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuddleDrops = void 0;
const chariot_1 = require("../mechanic/chariot");
const puddle_1 = require("../mechanic/puddle");
const phase_1 = require("./phase");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
class PuddleDrops extends phase_1.Phase {
    constructor(puddleCount) {
        super();
        this.initialMoveTime = 2000;
        this.puddleCount = puddleCount;
        this.phaseDuration = this.initialMoveTime + puddleCount * 1500 + 1000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        const gapTime = 1500;
        let puddleRadius = gameState.players.size <= 4 ? 120 : 60;
        for (let [p, player] of gameState.players) {
            let status = new status_1.Status(statusType_1.StatusType.DROPPING_PUDDLES);
            status.stacks = this.puddleCount;
            status.schedule(this.getPhaseStart(), this.phaseDuration);
            player.statuses.push(status);
            for (let i = 0; i < this.puddleCount; i++) {
                let chariot = new chariot_1.Chariot(0, 0, puddleRadius);
                this.schedule(chariot, this.initialMoveTime + gapTime * i, this.initialMoveTime + gapTime * (i + 1));
                chariot.spawnOnPlayer(p);
                chariot.onVisible(() => {
                    status.stacks--;
                });
                let puddleStart = this.initialMoveTime + gapTime * (i + 1);
                let puddleDuration = gapTime * (this.puddleCount - i);
                chariot.onComplete((gameState, mech) => {
                    let puddle = new puddle_1.Puddle(mech.x, mech.y, puddleRadius);
                    this.schedule(puddle, puddleStart, puddleStart + puddleDuration);
                });
            }
        }
    }
}
exports.PuddleDrops = PuddleDrops;
//# sourceMappingURL=puddleDrops.js.map