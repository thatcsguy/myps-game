"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TethersAndTowers = void 0;
const passableTether_1 = require("../mechanic/passableTether");
const puddle_1 = require("../mechanic/puddle");
const spread_1 = require("../mechanic/spread");
const tower_1 = require("../mechanic/tower");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
const utils_1 = require("../utils");
const phase_1 = require("./phase");
class TethersAndTowers extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 12000;
        this.lastPhaseProcessTime = 0;
        this.introTowerStart = 0;
        this.introTowerEnd = 3000;
        this.immunityStart = 3000;
        this.immunityEnd = 12000;
        this.tethersAndTowersStart = 3000;
        this.tethersAndTowersEnd = 11600;
        this.spreadsStart = 11600;
        this.spreadsEnd = 11800;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        for (let i = 0; i < gameState.players.size; i++) {
            let angle = -Math.PI / 2 + (2 * Math.PI / gameState.players.size) * i;
            let xOffset = 300 * Math.cos(angle);
            let yOffset = 300 * Math.sin(angle);
            let tower = new tower_1.Tower(400 + xOffset, 400 + yOffset, 75, 1);
            this.schedule(tower, this.introTowerStart, this.introTowerEnd);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        if (this.lastPhaseProcessTime < this.immunityStart && this.immunityStart <= phaseTime) {
            let puddleSoakerCount = (gameState.players.size / 2 + 1) << 0;
            let puddleImmunePlayers = gameState.randomPlayers(puddleSoakerCount);
            for (let [p, player] of gameState.players) {
                if (puddleImmunePlayers.includes(p)) {
                    let status = new status_1.Status(statusType_1.StatusType.PURPLE_SHIELD);
                    status.schedule(this.getPhaseStart() + this.immunityStart, this.immunityEnd - this.immunityStart);
                    player.statuses.push(status);
                }
                else {
                    let status = new status_1.Status(statusType_1.StatusType.YELLOW_SHIELD);
                    status.schedule(this.getPhaseStart() + this.immunityStart, this.immunityEnd - this.immunityStart);
                    player.statuses.push(status);
                }
            }
            // tethers into spreads
            let tetherPlayers = gameState.randomPlayers(gameState.players.size - puddleSoakerCount);
            for (let i = 0; i < tetherPlayers.length; i++) {
                let tether = new passableTether_1.PassableTether(400, 400);
                tether.applyToTarget(tetherPlayers[i]);
                tether.onComplete((gameState, tether) => {
                    let player = gameState.players.get(tether.target);
                    let spread = new spread_1.Spread(150);
                    spread.applyToTarget(tether.target);
                    this.schedule(spread, this.spreadsStart, this.spreadsEnd);
                    if (player.hasStatusOfType(statusType_1.StatusType.YELLOW_SHIELD)) {
                        return;
                    }
                    gameState.messages.push(player.name + ' died from tether');
                });
                this.schedule(tether, this.tethersAndTowersStart, this.tethersAndTowersEnd);
            }
            // towers into puddles
            let counts = [];
            for (let i = 0; i < 4; i++) {
                counts.push(i < puddleSoakerCount ? 1 : 0);
            }
            (0, utils_1.shuffle)(counts);
            for (let i = 0; i < 4; i++) {
                let tower = new tower_1.Tower((i % 2 == 0) ? 800 / 3 : 1600 / 3, i < 2 ? 800 / 3 : 1600 / 3, 80, counts[i]);
                this.schedule(tower, this.tethersAndTowersStart, this.tethersAndTowersEnd);
                let puddle = new puddle_1.Puddle(tower.x, tower.y, tower.r);
                this.schedule(puddle, this.tethersAndTowersStart, this.tethersAndTowersEnd);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.TethersAndTowers = TethersAndTowers;
//# sourceMappingURL=tethersAndTowers.js.map