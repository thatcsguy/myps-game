"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P4Act2 = void 0;
const castbar_1 = require("../mechanic/castbar");
const chain_1 = require("../mechanic/chain");
const chariot_1 = require("../mechanic/chariot");
const drawPriority_1 = require("../mechanic/drawPriority");
const knockback_1 = require("../mechanic/knockback");
const marker_1 = require("../mechanic/marker");
const puddle_1 = require("../mechanic/puddle");
const stack_1 = require("../mechanic/stack");
const tower_1 = require("../mechanic/tower");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
const phase_1 = require("./phase");
class P4Act2 extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 30000;
        this.lastPhaseProcessTime = 0;
        this.actCastStart = 0;
        this.actCastEnd = 4000;
        this.fakeStart = 1000;
        this.fakeEnd = this.actCastEnd + 1000;
        this.wreathCastStart = 6000;
        this.thorn1Start = 8000;
        this.thorn2Start = 10500;
        this.wreathCastEnd = 13000;
        this.purpleStart = this.wreathCastEnd;
        this.redStart = this.wreathCastEnd;
        this.tealStart = this.wreathCastEnd;
        this.ddCastStart = 15000;
        this.ddCastEnd = 18000;
        this.puddleChariotStart = 18000;
        this.puddleChariotEnd = 20000;
        this.purpleEnd = 21000;
        this.thorn1End = 21000;
        this.thorn2End = 26000;
        this.redEnd = 30000;
        this.tealEnd = 30000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        this.chariots = [];
        this.towers = [];
        let castbar = new castbar_1.Castbar("Act 2", 400, 400, 200, 30);
        this.schedule(castbar, this.actCastStart, this.actCastEnd);
        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2 + Math.PI / 8;
            let x = 400 + 350 * Math.cos(angle);
            let y = 400 + 350 * Math.sin(angle);
            let chariot = new chariot_1.Chariot(x, y, 350);
            this.schedule(chariot, this.fakeStart, this.fakeEnd);
            this.chariots.push(chariot);
        }
        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2;
            let x = 400 + 350 * Math.cos(angle);
            let y = 400 + 350 * Math.sin(angle);
            let tower = new tower_1.Tower(x, y, 50, 1);
            this.schedule(tower, this.fakeStart, this.fakeEnd);
            this.towers.push(tower);
        }
        castbar = new castbar_1.Castbar("Wreath of Thorns", 400, 400, 200, 30);
        this.schedule(castbar, this.wreathCastStart, this.wreathCastEnd);
        for (let i = 0; i < 4; i += 2) {
            let marker = new marker_1.Marker(this.chariots[i].x, this.chariots[i].y, 20);
            marker.img = marker_1.MarkerImg.THORN;
            marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
            this.schedule(marker, this.thorn1Start, this.thorn1End);
        }
        for (let i = 1; i < 4; i += 2) {
            let marker = new marker_1.Marker(this.towers[i].x, this.towers[i].y, 20);
            marker.img = marker_1.MarkerImg.THORN;
            marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
            this.schedule(marker, this.thorn1Start, this.thorn1End);
        }
        for (let i = 1; i < 4; i += 2) {
            let marker = new marker_1.Marker(this.chariots[i].x, this.chariots[i].y, 20);
            marker.img = marker_1.MarkerImg.THORN;
            marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
            this.schedule(marker, this.thorn2Start, this.thorn2End);
        }
        for (let i = 0; i < 4; i += 2) {
            let marker = new marker_1.Marker(this.towers[i].x, this.towers[i].y, 20);
            marker.img = marker_1.MarkerImg.THORN;
            marker.dp = drawPriority_1.DrawPriority.OVER_PLAYER;
            this.schedule(marker, this.thorn2Start, this.thorn2End);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        // remove the fake mechanics
        if (this.lastPhaseProcessTime < this.actCastEnd && this.actCastEnd <= phaseTime) {
            gameState.mechanics = gameState.mechanics.filter((mech) => {
                return !(mech instanceof chariot_1.Chariot || mech instanceof tower_1.Tower);
            });
        }
        // assign chains
        if (this.lastPhaseProcessTime < this.wreathCastEnd && this.wreathCastEnd <= phaseTime) {
            let random = gameState.randomPlayers(8);
            if (random[0] && random[1]) {
                let purple = new chain_1.Chain(600, true, { c: 'purple' });
                purple.applyToTargets(random[0], random[1]);
                purple.onComplete((gameState, chain) => {
                    if (chain.isSafe(gameState)) {
                        let status = new status_1.Status(statusType_1.StatusType.PURPLE_SHIELD);
                        status.schedule(chain.start + chain.duration, 20000);
                        gameState.players.get(chain.target1).statuses.push(status);
                        gameState.players.get(chain.target2).statuses.push(status);
                    }
                });
                this.schedule(purple, this.purpleStart, this.purpleEnd);
            }
            if (random[2] && random[3]) {
                let red1 = new chain_1.Chain(600, true, { c: 'red' });
                red1.applyToTargets(random[2], random[3]);
                red1.onComplete((gameState, chain) => {
                    let stack1 = new stack_1.Stack(3, 75);
                    let stack2 = new stack_1.Stack(3, 75);
                    stack1.applyToTarget(chain.target1);
                    stack2.applyToTarget(chain.target2);
                    gameState.schedule(stack1, gameState.now, 2000);
                    gameState.schedule(stack2, gameState.now, 2000);
                });
                this.schedule(red1, this.redStart, this.redEnd);
            }
            if (random[4] && random[5]) {
                let red2 = new chain_1.Chain(600, true, { c: 'red' });
                red2.applyToTargets(random[4], random[5]);
                red2.onComplete((gameState, chain) => {
                    if (chain.isSafe(gameState)) {
                        let stack1 = new stack_1.Stack(3, 75);
                        let stack2 = new stack_1.Stack(3, 75);
                        stack1.applyToTarget(chain.target1);
                        stack2.applyToTarget(chain.target2);
                        gameState.schedule(stack1, gameState.now, 2000);
                        gameState.schedule(stack2, gameState.now, 2000);
                    }
                });
                this.schedule(red2, this.redStart, this.redEnd);
            }
            if (random[6] && random[7]) {
                let teal = new chain_1.Chain(300, true, { c: 'teal', s: false });
                teal.applyToTargets(random[6], random[7]);
                teal.killOnEnd = false;
                teal.onComplete((gameState, chain) => {
                    if (chain.isSafe(gameState)) {
                        let kb = new knockback_1.Knockback(400, 400, 400, 400);
                        gameState.schedule(kb, gameState.now, 2000);
                    }
                });
                this.schedule(teal, this.tealStart, this.tealEnd);
            }
        }
        // Dark Design cast
        if (this.lastPhaseProcessTime < this.ddCastStart && this.ddCastStart <= phaseTime) {
            let castbar = new castbar_1.Castbar('Dark Design', 400, 400, 200, 30);
            this.schedule(castbar, this.ddCastStart, this.ddCastEnd);
        }
        // puddle drops
        if (this.lastPhaseProcessTime < this.puddleChariotStart && this.puddleChariotStart <= phaseTime) {
            for (let [, player] of gameState.players) {
                let chariot = new chariot_1.Chariot(player.x, player.y, 100);
                this.schedule(chariot, this.puddleChariotStart, this.puddleChariotEnd);
            }
        }
        // even chariots, odd towers+puddles
        if (this.lastPhaseProcessTime < this.thorn1End && this.thorn1End <= phaseTime) {
            this.schedule(this.chariots[0], this.thorn1End, this.thorn1End + 2000);
            this.schedule(this.chariots[2], this.thorn1End, this.thorn1End + 2000);
            this.schedule(this.towers[1], this.thorn1End, this.thorn1End + 2000);
            let puddle1 = new puddle_1.Puddle(this.towers[1].x, this.towers[1].y, this.towers[1].r);
            this.schedule(puddle1, this.thorn1End, this.thorn1End + 2000);
            this.schedule(this.towers[3], this.thorn1End, this.thorn1End + 2000);
            let puddle3 = new puddle_1.Puddle(this.towers[3].x, this.towers[3].y, this.towers[3].r);
            this.schedule(puddle3, this.thorn1End, this.thorn1End + 2000);
        }
        // odd chariots, even towers+puddles
        if (this.lastPhaseProcessTime < this.thorn2End && this.thorn2End <= phaseTime) {
            this.schedule(this.chariots[1], this.thorn2End, this.thorn2End + 2000);
            this.schedule(this.chariots[3], this.thorn2End, this.thorn2End + 2000);
            this.schedule(this.towers[0], this.thorn2End, this.thorn2End + 2000);
            let puddle0 = new puddle_1.Puddle(this.towers[0].x, this.towers[0].y, this.towers[0].r);
            this.schedule(puddle0, this.thorn2End, this.thorn2End + 2000);
            this.schedule(this.towers[2], this.thorn2End, this.thorn2End + 2000);
            let puddle2 = new puddle_1.Puddle(this.towers[2].x, this.towers[2].y, this.towers[2].r);
            this.schedule(puddle2, this.thorn2End, this.thorn2End + 2000);
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.P4Act2 = P4Act2;
//# sourceMappingURL=p4Act2.js.map