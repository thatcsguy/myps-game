"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinax = void 0;
const animation_1 = require("../mechanic/animation");
const castbar_1 = require("../mechanic/castbar");
const chariot_1 = require("../mechanic/chariot");
const conal_1 = require("../mechanic/conal");
const drawPriority_1 = require("../mechanic/drawPriority");
const knockback_1 = require("../mechanic/knockback");
const lineAOE_1 = require("../mechanic/lineAOE");
const pinaxSquare_1 = require("../mechanic/pinaxSquare");
const spread_1 = require("../mechanic/spread");
const stack_1 = require("../mechanic/stack");
const phase_1 = require("./phase");
class Pinax extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 30000;
        this.lastPhaseProcessTime = 0;
        this.activateTimes = [7000, 9000, 17000, 25000];
        this.triggerTimes = [12000, 14000, 24000, 29000];
        this.shiftCastStart = 19000;
        this.shiftCastEnd = 26000;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let animation = new animation_1.Animation(animation_1.AnimationKey.SETTING_THE_SCENE, drawPriority_1.DrawPriority.UNDER_PLAYER);
        gameState.schedule(animation, phaseStart, 5000);
        let castbar = new castbar_1.Castbar("Setting the Scene", 400, 400, 200, 30);
        gameState.schedule(castbar, phaseStart, 5000);
        this.squares = [];
        this.elements = [
            pinaxSquare_1.PinaxSquare.Element.WATER,
            pinaxSquare_1.PinaxSquare.Element.FIRE,
            pinaxSquare_1.PinaxSquare.Element.LIGHTNING,
            pinaxSquare_1.PinaxSquare.Element.POISON
        ];
        this.activateIndex = 0;
        this.triggerIndex = 0;
        let startIndex = (Math.random() * 4) << 0;
        let direction = Math.random() < .5 ? 1 : -1;
        for (let i = 0; i < 4; i++) {
            let element = this.elements[(startIndex + direction * i + 4) % 4];
            let square = new pinaxSquare_1.PinaxSquare(element, (i == 0 || i == 3) ? 0 : 400, (i <= 1) ? 0 : 400, 400, 400);
            gameState.schedule(square, phaseStart + 2500, this.phaseDuration - 2500);
            this.squares.push(square);
        }
        if (Math.random() < .5) {
            [this.elements[0], this.elements[2]] = [this.elements[2], this.elements[0]];
        }
        if (Math.random() < .5) {
            [this.elements[1], this.elements[3]] = [this.elements[1], this.elements[3]];
        }
    }
    getSquareOfElement(element) {
        for (let square of this.squares) {
            if (square.element == element) {
                return square;
            }
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        // Light up squares
        for (let time of this.activateTimes) {
            if (this.lastPhaseProcessTime < time && time <= phaseTime) {
                let square = this.getSquareOfElement(this.elements[this.activateIndex]);
                this.activateIndex++;
                square.activeStart = this.getPhaseStart() + time;
                square.active = true;
            }
        }
        // Trigger square effects
        for (let time of this.triggerTimes) {
            if (this.lastPhaseProcessTime < time && time <= phaseTime) {
                let square = this.getSquareOfElement(this.elements[this.triggerIndex]);
                square.active = false;
                this.triggerIndex++;
                let aoe = new lineAOE_1.LineAOE(square.x + square.width / 2, square.y, square.x + square.width / 2, square.y + square.height, square.width);
                this.schedule(aoe, time, time + 1000);
                switch (square.element) {
                    case pinaxSquare_1.PinaxSquare.Element.LIGHTNING:
                        let chariot = new chariot_1.Chariot(400, 400, 350);
                        this.schedule(chariot, time, time + 1000);
                        break;
                    case pinaxSquare_1.PinaxSquare.Element.WATER:
                        let kb = new knockback_1.Knockback(400, 400, 300, 200);
                        this.schedule(kb, time, time + 1000);
                        break;
                    case pinaxSquare_1.PinaxSquare.Element.FIRE:
                        if (gameState.players.size < 4) {
                            let stack = new stack_1.Stack(gameState.players.size, 75);
                            stack.applyToTarget(gameState.randomPlayer());
                            this.schedule(stack, time, time + 2000);
                        }
                        else {
                            let needed = (gameState.players.size == 4) ? 2 :
                                (gameState.players.size + 1) / 2 - 1 << 0;
                            let targets = gameState.randomPlayers(2);
                            let stack1 = new stack_1.Stack(needed, 75);
                            let stack2 = new stack_1.Stack(needed, 75);
                            stack1.applyToTarget(targets[0]);
                            stack2.applyToTarget(targets[1]);
                            stack1.onComplete((gameState) => {
                                let soakers1 = stack1.soakers(gameState);
                                let soakers2 = stack2.soakers(gameState);
                                for (let [p, player] of gameState.players) {
                                    if (soakers1.includes(p) && soakers2.includes(p)) {
                                        gameState.messages.push(player.name + ' died from double stacks');
                                    }
                                }
                            });
                            stack2.onComplete((gameState) => {
                                let soakers1 = stack1.soakers(gameState);
                                let soakers2 = stack2.soakers(gameState);
                                for (let [p, player] of gameState.players) {
                                    if (soakers1.includes(p) && soakers2.includes(p)) {
                                        gameState.messages.push(player.name + ' died from double stacks');
                                    }
                                }
                            });
                            this.schedule(stack1, time, time + 2000);
                            this.schedule(stack2, time, time + 2000);
                        }
                        break;
                    case pinaxSquare_1.PinaxSquare.Element.POISON:
                        for (let [p,] of gameState.players) {
                            let spread = new spread_1.Spread(150);
                            spread.applyToTarget(p);
                            this.schedule(spread, time, time + 1000);
                        }
                        break;
                }
            }
        }
        // Directional shift
        if (this.lastPhaseProcessTime < this.shiftCastStart && this.shiftCastStart <= phaseTime) {
            let castNamePrefixes = ["Northerly ", "Easterly ", "Southerly ", "Westerly "];
            let castNameSuffixes = ["Gust", "Strike"];
            let rand = Math.random() * 8 << 0;
            let name = castNamePrefixes[rand % 4] + castNameSuffixes[(rand / 4) << 0];
            let castbar = new castbar_1.Castbar(name, 400, 400, 200, 30);
            this.schedule(castbar, this.shiftCastStart, this.shiftCastEnd);
            if (rand / 4 << 0 == 0) {
                let kb;
                if (rand % 4 == 0) {
                    kb = new knockback_1.Knockback(400, 0, 566, 200);
                }
                else if (rand % 4 == 1) {
                    kb = new knockback_1.Knockback(800, 400, 566, 200);
                }
                else if (rand % 4 == 2) {
                    kb = new knockback_1.Knockback(400, 800, 566, 200);
                }
                else {
                    kb = new knockback_1.Knockback(0, 400, 566, 200);
                }
                this.schedule(kb, this.shiftCastEnd, this.shiftCastEnd + 500);
            }
            else {
                let conal;
                if (rand % 4 == 0) {
                    conal = new conal_1.Conal(400, 0, 895, Math.PI / 2, Math.PI / 2);
                }
                else if (rand % 4 == 1) {
                    conal = new conal_1.Conal(800, 400, 895, Math.PI, Math.PI / 2);
                }
                else if (rand % 4 == 2) {
                    conal = new conal_1.Conal(400, 800, 895, 3 / 2 * Math.PI, Math.PI / 2);
                }
                else {
                    conal = new conal_1.Conal(0, 400, 895, 0, Math.PI / 2);
                }
                this.schedule(conal, this.shiftCastEnd, this.shiftCastEnd + 500);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.Pinax = Pinax;
//# sourceMappingURL=pinax.js.map