"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoomAndTethers = void 0;
const doomCircle_1 = require("../mechanic/doomCircle");
const passableTether_1 = require("../mechanic/passableTether");
const spread_1 = require("../mechanic/spread");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
const utils_1 = require("../utils");
const phase_1 = require("./phase");
class DoomAndTethers extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 10500;
        this.lastPhaseProcessTime = 0;
        this.doomStart = 0;
        this.doomImmuneStart = 0;
        this.doomEnd = 4700;
        this.doomImmuneEnd = 5000;
        this.tetherImmuneStart = 5300;
        this.tetherStart = 5300;
        this.tetherEnd = 9700;
        this.tetherImmuneEnd = 10000;
        this.spreadStart = 10000;
        this.spreadEnd = 10500;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        this.mechCount = ((gameState.players.size + 1) / 2) << 0;
        let statusTargets = gameState.randomPlayers(this.mechCount);
        for (let player of statusTargets) {
            let status = new status_1.Status(statusType_1.StatusType.RED_SHIELD);
            status.schedule(this.getPhaseStart() + this.doomImmuneStart, this.doomImmuneEnd - this.doomImmuneStart);
            gameState.players.get(player).statuses.push(status);
        }
        let doomTargets = gameState.randomPlayers(this.mechCount);
        for (let player of doomTargets) {
            let doom = new doomCircle_1.DoomCircle(25);
            doom.applyToTarget(player);
            this.schedule(doom, this.doomStart, this.doomEnd);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        if (phaseTime < this.doomEnd) {
            for (let [, player] of gameState.players) {
                if (player.hasStatusOfType(statusType_1.StatusType.RED_SHIELD)) {
                    for (let [, player2] of gameState.players) {
                        if (player.name == player2.name
                            || player2.hasStatusOfType(statusType_1.StatusType.RED_SHIELD)
                            || player2.hasStatusOfType(statusType_1.StatusType.SIMPLE_COUNTDOWN)) {
                            continue;
                        }
                        if ((0, utils_1.distance)(player.x, player.y, player2.x, player2.y) < player.r / 2) {
                            player.removeStatusOfType(statusType_1.StatusType.RED_SHIELD);
                            let status = new status_1.Status(statusType_1.StatusType.SIMPLE_COUNTDOWN);
                            status.schedule(gameState.now, 1000);
                            player.statuses.push(status);
                            let newDoomImmune = new status_1.Status(statusType_1.StatusType.RED_SHIELD);
                            newDoomImmune.schedule(this.getPhaseStart() + this.doomImmuneStart, this.doomImmuneEnd - this.doomImmuneStart);
                            player2.statuses.push(newDoomImmune);
                        }
                    }
                }
            }
        }
        if (this.lastPhaseProcessTime < this.tetherImmuneStart && this.tetherImmuneStart <= phaseTime) {
            let immuneTargets = gameState.randomPlayers(this.mechCount);
            for (let p of immuneTargets) {
                let player = gameState.players.get(p);
                let status = new status_1.Status(statusType_1.StatusType.YELLOW_SHIELD);
                status.schedule(this.getPhaseStart() + this.tetherImmuneStart, this.tetherImmuneEnd - this.tetherImmuneStart);
                player.statuses.push(status);
            }
            let tetherTargets = gameState.randomPlayers(this.mechCount);
            for (let p of tetherTargets) {
                let tether = new passableTether_1.PassableTether(400, 400);
                tether.applyToTarget(p);
                tether.onComplete((gameState, tether) => {
                    let player = gameState.players.get(tether.target);
                    if (!player.hasStatusOfType(statusType_1.StatusType.YELLOW_SHIELD)) {
                        gameState.messages.push(player.name + ' died to a tether');
                    }
                    let spread = new spread_1.Spread(200);
                    spread.applyToTarget(tether.target);
                    this.schedule(spread, this.spreadStart, this.spreadEnd);
                });
                this.schedule(tether, this.tetherStart, this.tetherEnd);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.DoomAndTethers = DoomAndTethers;
//# sourceMappingURL=doomAndTethers.js.map