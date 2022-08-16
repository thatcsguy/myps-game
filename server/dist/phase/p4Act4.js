"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P4Act4 = void 0;
const castbar_1 = require("../mechanic/castbar");
const chariot_1 = require("../mechanic/chariot");
const drawPriority_1 = require("../mechanic/drawPriority");
const marker_1 = require("../mechanic/marker");
const spread_1 = require("../mechanic/spread");
const stretchPointTether_1 = require("../mechanic/stretchPointTether");
const tower_1 = require("../mechanic/tower");
const phase_1 = require("./phase");
class P4Act4 extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 30000;
        this.lastPhaseProcessTime = 0;
        this.act4CastStart = 0;
        this.act4CastEnd = 4000;
        this.fakeStart = 1000;
        this.fakeEnd = this.act4CastEnd + 1000;
        this.wreathCastStart = 6000;
        this.wreathCastEnd = 9000;
        this.thornStart = 7500;
        this.thornEnd = this.phaseDuration;
        this.tetherStart = 9000;
        this.tetherEnd = this.phaseDuration;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        this.chariots = [];
        this.towers = [];
        let castbar = new castbar_1.Castbar("Act 4", 400, 400, 200, 30);
        this.schedule(castbar, this.act4CastStart, this.act4CastEnd);
        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2;
            let x = 400 + 350 * Math.cos(angle);
            let y = 400 + 350 * Math.sin(angle);
            let chariot = new chariot_1.Chariot(x, y, 550);
            this.schedule(chariot, this.fakeStart, this.fakeEnd);
            this.chariots.push(chariot);
        }
        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2 + Math.PI / 4;
            let x = 400 + 350 * Math.cos(angle);
            let y = 400 + 350 * Math.sin(angle);
            let tower = new tower_1.Tower(x, y, 50, 1);
            this.schedule(tower, this.fakeStart, this.fakeEnd);
            this.towers.push(tower);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        if (this.lastPhaseProcessTime < this.act4CastEnd && this.act4CastEnd <= phaseTime) {
            gameState.mechanics = [];
        }
        if (this.lastPhaseProcessTime < this.wreathCastStart && this.wreathCastStart <= phaseTime) {
            let castbar = new castbar_1.Castbar("Wreath of Thorns", 400, 400, 200, 30);
            this.schedule(castbar, this.wreathCastStart, this.wreathCastEnd);
        }
        if (this.lastPhaseProcessTime < this.thornStart && this.thornStart <= phaseTime) {
            let players = gameState.randomPlayers(8);
            for (let i = 0; i < 4; i++) {
                let marker = new marker_1.Marker(this.towers[i].x, this.towers[i].y, 20);
                marker.img = marker_1.MarkerImg.THORN;
                marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
                this.schedule(marker, this.thornStart, this.thornEnd);
                let tether = new stretchPointTether_1.StretchPointTether(this.towers[i].x, this.towers[i].y, 630, true);
                tether.applyToTarget(players[i]);
                tether.onComplete((gameState, tether) => {
                    if (tether.safe) {
                        this.schedule(this.towers[i], gameState.now - this.getPhaseStart(), gameState.now - this.getPhaseStart() + 1500);
                        marker.duration = gameState.now - marker.start + 300;
                        let spread = new spread_1.Spread(200);
                        spread.applyToTarget(players[i]);
                        this.schedule(spread, gameState.now - this.getPhaseStart(), gameState.now - this.getPhaseStart() + 1500);
                    }
                });
                this.schedule(tether, this.tetherStart, this.tetherEnd);
            }
            for (let i = 0; i < 4; i++) {
                let marker = new marker_1.Marker(this.chariots[i].x, this.chariots[i].y, 20);
                marker.img = marker_1.MarkerImg.THORN;
                marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
                this.schedule(marker, this.thornStart, this.thornEnd);
                let tether = new stretchPointTether_1.StretchPointTether(this.chariots[i].x, this.chariots[i].y, 650, true);
                tether.applyToTarget(players[i + 4]);
                tether.onComplete((gameState, tether) => {
                    if (tether.safe) {
                        this.schedule(this.chariots[i], gameState.now - this.getPhaseStart(), gameState.now - this.getPhaseStart() + 700);
                        marker.duration = gameState.now - marker.start + 300;
                    }
                });
                this.schedule(tether, this.tetherStart, this.tetherEnd);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.P4Act4 = P4Act4;
//# sourceMappingURL=p4Act4.js.map