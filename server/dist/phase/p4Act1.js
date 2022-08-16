"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P4Act1 = void 0;
const castbar_1 = require("../mechanic/castbar");
const chariot_1 = require("../mechanic/chariot");
const drawPriority_1 = require("../mechanic/drawPriority");
const marker_1 = require("../mechanic/marker");
const tower_1 = require("../mechanic/tower");
const phase_1 = require("./phase");
class P4Act1 extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 16800;
        this.lastPhaseProcessTime = 0;
        this.castStart = 0;
        this.castEnd = 4000;
        this.fakeStart = 1000;
        this.fakeEnd = this.castEnd + 1000;
        this.thorn1Start = 6000;
        this.thorn2Start = 7500;
        this.thorn3Start = 9000;
        this.thorn1End = 12500;
        this.thorn2End = 13000;
        this.thorn3End = 16500;
        this.chariot1Start = 12500;
        this.chariot1End = 12800;
        this.towerStart = 13000;
        this.towerEnd = 14800;
        this.chariot2Start = 16500;
        this.chariot2End = 16800;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        this.chariots = [];
        this.towers = [];
        let castbar = new castbar_1.Castbar("Act 1", 400, 400, 200, 30);
        this.schedule(castbar, this.castStart, this.castEnd);
        let chariotPos = [
            [400, 100],
            [400, 700],
            [700, 400],
            [100, 400]
        ];
        for (let i = 0; i < 4; i++) {
            let chariot = new chariot_1.Chariot(chariotPos[i][0], chariotPos[i][1], 325);
            this.schedule(chariot, this.fakeStart, this.fakeEnd);
            this.chariots.push(chariot);
        }
        let diff1 = 100, diff2 = 200;
        let towerPos = [
            [400 - diff1, 400 - diff1],
            [400 - diff2, 400 - diff2],
            [400 + diff1, 400 - diff1],
            [400 + diff2, 400 - diff2],
            [400 - diff1, 400 + diff1],
            [400 - diff2, 400 + diff2],
            [400 + diff1, 400 + diff1],
            [400 + diff2, 400 + diff2],
        ];
        for (let i = 0; i < 8; i++) {
            let tower = new tower_1.Tower(towerPos[i][0], towerPos[i][1], 50, 1);
            this.schedule(tower, this.fakeStart, this.fakeEnd);
            this.towers.push(tower);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        if (this.lastPhaseProcessTime < this.castEnd && this.castEnd <= phaseTime) {
            gameState.mechanics = [];
        }
        if (this.lastPhaseProcessTime < this.thorn1Start && this.thorn1Start <= phaseTime) {
            if (Math.random() < .5) {
                this.chariots.push(this.chariots.shift());
                this.chariots.push(this.chariots.shift());
            }
            for (let i = 0; i < 4; i++) {
                let marker = new marker_1.Marker(this.chariots[i].x, this.chariots[i].y, 20);
                marker.img = marker_1.MarkerImg.THORN;
                marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
                let thornStart = (i < 2) ? this.thorn1Start : this.thorn3Start;
                let thornEnd = (i < 2) ? this.thorn1End : this.thorn3End;
                this.schedule(marker, thornStart, thornEnd);
                let chariotTime = (i < 2) ? this.chariot1Start : this.chariot2Start;
                this.schedule(this.chariots[i], chariotTime, chariotTime + 300);
            }
            for (let i = 0; i < 8; i++) {
                let marker = new marker_1.Marker(this.towers[i].x, this.towers[i].y, 20);
                marker.img = marker_1.MarkerImg.THORN;
                marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
                this.schedule(marker, this.thorn2Start, this.thorn2End);
                this.schedule(this.towers[i], this.towerStart, this.towerEnd);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.P4Act1 = P4Act1;
//# sourceMappingURL=p4Act1.js.map