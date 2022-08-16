"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FountainOfFire = void 0;
const globals_1 = require("../globals");
const chariot_1 = require("../mechanic/chariot");
const lineAOE_1 = require("../mechanic/lineAOE");
const marker_1 = require("../mechanic/marker");
const puddle_1 = require("../mechanic/puddle");
const spread_1 = require("../mechanic/spread");
const stretchPointTether_1 = require("../mechanic/stretchPointTether");
const tower_1 = require("../mechanic/tower");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
const phase_1 = require("./phase");
class FountainOfFire extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 20000;
        this.lastPhaseProcessTime = 0;
    }
    init(gameState, phaseStart) {
        this.phaseStart = phaseStart;
        const towerPatternRadius = 305;
        const towerRadius = 95;
        const towerDuration = 8000;
        let marker = new marker_1.Marker(globals_1.GLOBALS.arenaWidth / 2, globals_1.GLOBALS.arenaHeight / 2, 10);
        gameState.schedule(marker, phaseStart, this.phaseDuration);
        let startAngle = Math.random() < .5 ? 0 : Math.PI / 2;
        for (let i = 0; i < 4; i++) {
            let tower1 = new tower_1.Tower(globals_1.GLOBALS.arenaWidth / 2 + towerPatternRadius * Math.cos(startAngle + i * Math.PI / 4), globals_1.GLOBALS.arenaHeight / 2 + towerPatternRadius * Math.sin(startAngle + i * Math.PI / 4), towerRadius, 1);
            gameState.schedule(tower1, phaseStart + i * towerDuration / 2, towerDuration);
            let tower2 = new tower_1.Tower(globals_1.GLOBALS.arenaWidth / 2 + towerPatternRadius * Math.cos(startAngle + Math.PI + i * Math.PI / 4), globals_1.GLOBALS.arenaHeight / 2 + towerPatternRadius * Math.sin(startAngle + Math.PI + i * Math.PI / 4), towerRadius, 1);
            gameState.schedule(tower2, phaseStart + i * towerDuration / 2, towerDuration);
            if (i == 0) {
                tower1.onComplete((gameState, mech) => {
                    if (mech.soakers.length > 0) {
                        let status = new status_1.Status(statusType_1.StatusType.PURPLE_SHIELD);
                        status.schedule(phaseStart, this.phaseDuration);
                        gameState.players.get(mech.soakers[Math.random() * mech.soakers.length << 0]).statuses.push(status);
                    }
                });
                tower2.onComplete((gameState, mech) => {
                    if (mech.soakers.length > 0) {
                        let status = new status_1.Status(statusType_1.StatusType.PURPLE_SHIELD);
                        status.schedule(phaseStart, this.phaseDuration);
                        gameState.players.get(mech.soakers[Math.random() * mech.soakers.length << 0]).statuses.push(status);
                    }
                });
            }
            else {
                let puddle1 = new puddle_1.Puddle(globals_1.GLOBALS.arenaWidth / 2 + towerPatternRadius * Math.cos(startAngle + i * Math.PI / 4), globals_1.GLOBALS.arenaHeight / 2 + towerPatternRadius * Math.sin(startAngle + i * Math.PI / 4), towerRadius + 10);
                gameState.schedule(puddle1, phaseStart + i * towerDuration / 2, towerDuration);
                let puddle2 = new puddle_1.Puddle(globals_1.GLOBALS.arenaWidth / 2 + towerPatternRadius * Math.cos(startAngle + Math.PI + i * Math.PI / 4), globals_1.GLOBALS.arenaHeight / 2 + towerPatternRadius * Math.sin(startAngle + Math.PI + i * Math.PI / 4), towerRadius + 10);
                gameState.schedule(puddle2, phaseStart + i * towerDuration / 2, towerDuration);
            }
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.phaseStart;
        let spreadTimes = [1000, 5500, 10000];
        for (let time of spreadTimes) {
            if (this.lastPhaseProcessTime < time && time <= phaseTime) {
                let sorted = gameState.closestPlayers(globals_1.GLOBALS.arenaWidth / 2, globals_1.GLOBALS.arenaHeight / 2, gameState.players.size);
                for (let mech of gameState.mechanics) {
                    if (mech instanceof spread_1.Spread || mech instanceof stretchPointTether_1.StretchPointTether) {
                        sorted.splice(sorted.indexOf(mech.target), 1);
                    }
                }
                let targets = [];
                for (let i = 0; i < 2 && i < sorted.length; i++) {
                    targets.push(sorted[i]);
                }
                for (let target of targets) {
                    let spread = new spread_1.Spread(110);
                    spread.applyToTarget(target);
                    spread.onComplete((gameState, mech) => {
                        let player = gameState.players.get(mech.target);
                        let tether = new stretchPointTether_1.StretchPointTether(player.x, player.y, 500, false);
                        tether.applyToTarget(mech.target);
                        tether.onComplete((gameState, mech) => {
                            let lineEndX = tether.x + (player.x - tether.x) * .95;
                            let lineEndY = tether.y + (player.y - tether.y) * .95;
                            let lineAOE = new lineAOE_1.LineAOE(tether.x, tether.y, lineEndX, lineEndY, 75);
                            gameState.schedule(lineAOE, mech.start + mech.duration, 300);
                        });
                        gameState.schedule(tether, mech.start + mech.duration, 6500);
                        let chariot = new chariot_1.Chariot(player.x, player.y, 110);
                        gameState.schedule(chariot, mech.start + mech.duration, 2000);
                    });
                    gameState.schedule(spread, this.phaseStart + time, 6000);
                }
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.FountainOfFire = FountainOfFire;
//# sourceMappingURL=fountainOfFire.js.map