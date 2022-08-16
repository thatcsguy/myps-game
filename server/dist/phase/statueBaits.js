"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatueBaits = void 0;
const conal_1 = require("../mechanic/conal");
const marker_1 = require("../mechanic/marker");
const phase_1 = require("./phase");
const animation_1 = require("../mechanic/animation");
const drawPriority_1 = require("../mechanic/drawPriority");
class StatueBaits extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.lastPhaseProcessTime = 0;
        this.phaseDuration = 8000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        this.statues = [];
        this.conalDirections = [];
        for (let i = 0; i < 4; i++) {
            let marker = new marker_1.Marker((i % 2 + 1) * 800 / 3, ((i / 2 << 0) + 1) * 800 / 3, 20);
            this.schedule(marker, 0, this.phaseDuration);
            this.statues.push(marker);
            let ccw = Math.random() < .5;
            this.conalDirections.push(ccw ? 1 : -1);
            let animation = new animation_1.Animation(animation_1.AnimationKey.ROTATION_MARKER, drawPriority_1.DrawPriority.OVER_PLAYER, { x: marker.x, y: marker.y, r: 30, ccw: ccw });
            this.schedule(animation, 0, this.phaseDuration);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        let baitTime = 3500;
        let firstConalDuration = 1500;
        let fastConalStarts = [5000, 5500, 6000, 6500, 7000, 7500];
        let fastConalDuration = 500;
        if (this.lastPhaseProcessTime < baitTime && baitTime <= phaseTime) {
            for (let s = 0; s < this.statues.length; s++) {
                let player = gameState.players.get(gameState.closestPlayer(this.statues[s].x, this.statues[s].y));
                let angle = Math.atan2(player.y - this.statues[s].y, player.x - this.statues[s].x);
                let conal = new conal_1.Conal(this.statues[s].x, this.statues[s].y, 700, angle, Math.PI / 4);
                this.schedule(conal, baitTime, baitTime + firstConalDuration);
                for (let i = 0; i < fastConalStarts.length; i++) {
                    let fastConal = new conal_1.Conal(this.statues[s].x, this.statues[s].y, 700, angle - this.conalDirections[s] * (i + 1) * Math.PI / 4, Math.PI / 4);
                    this.schedule(fastConal, fastConalStarts[i], fastConalStarts[i] + fastConalDuration);
                }
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.StatueBaits = StatueBaits;
//# sourceMappingURL=statueBaits.js.map