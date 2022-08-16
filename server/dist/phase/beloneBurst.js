"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeloneBurst = void 0;
const animation_1 = require("../mechanic/animation");
const castbar_1 = require("../mechanic/castbar");
const chariot_1 = require("../mechanic/chariot");
const drawPriority_1 = require("../mechanic/drawPriority");
const homingOrb_1 = require("../mechanic/homingOrb");
const lineAOE_1 = require("../mechanic/lineAOE");
const pinaxSquare_1 = require("../mechanic/pinaxSquare");
const tower_1 = require("../mechanic/tower");
const status_1 = require("../status/status");
const statusType_1 = require("../status/statusType");
const utils_1 = require("../utils");
const phase_1 = require("./phase");
class BeloneBurst extends phase_1.Phase {
    constructor() {
        super(...arguments);
        this.phaseDuration = 20000;
        this.lastPhaseProcessTime = 0;
        this.sceneStart = 0;
        this.sceneEnd = 5000;
        this.squaresStart = 2500;
        this.squaresEnd = 20000;
        this.bloodrakeStart = 6000;
        this.bloodrakeEnd = 9000;
        this.towerStart = 10000;
        this.towerEnd = 13000;
        this.orbStart = 13000;
        this.orbEnd = 18000;
        this.immuneStart = 13000;
        this.immuneEnd = 19000;
        this.periaktoiStart = 15000;
        this.periaktoiEnd = 19000;
        this.boomStart = 19000;
        this.boomEnd = 19300;
    }
    init(gameState, phaseStart) {
        super.init(gameState, phaseStart);
        let animation = new animation_1.Animation(animation_1.AnimationKey.SETTING_THE_SCENE, drawPriority_1.DrawPriority.UNDER_PLAYER);
        this.schedule(animation, this.sceneStart, this.sceneEnd);
        let castbar = new castbar_1.Castbar("Setting the Scene", 400, 400, 200, 30);
        this.schedule(castbar, this.sceneStart, this.sceneEnd);
        this.squares = [];
        this.elements = [
            pinaxSquare_1.PinaxSquare.Element.WATER,
            pinaxSquare_1.PinaxSquare.Element.FIRE,
            pinaxSquare_1.PinaxSquare.Element.LIGHTNING,
            pinaxSquare_1.PinaxSquare.Element.POISON
        ];
        let startIndex = (Math.random() * 4) << 0;
        let direction = Math.random() < .5 ? 1 : -1;
        for (let i = 0; i < 4; i++) {
            let element = this.elements[(startIndex + direction * i + 4) % 4];
            let square = new pinaxSquare_1.PinaxSquare(element, (i == 0 || i == 3) ? 0 : 400, (i <= 1) ? 0 : 400, 400, 400);
            this.schedule(square, this.squaresStart, this.squaresEnd);
            this.squares.push(square);
        }
        castbar = new castbar_1.Castbar("Bloodrake", 400, 400, 200, 30);
        this.schedule(castbar, this.bloodrakeStart, this.bloodrakeEnd);
        this.safeIndex = Math.random() * 4 << 0;
        castbar = new castbar_1.Castbar("Periaktoi", 400, 400, 200, 30);
        this.schedule(castbar, this.periaktoiStart, this.periaktoiEnd);
        for (let i = 0; i < gameState.players.size; i++) {
            let angle = 2 * Math.PI / gameState.players.size * i;
            let xOffset = 170 * Math.cos(angle);
            let yOffset = 170 * Math.sin(angle);
            let tower = new tower_1.Tower(400 + xOffset, 400 + yOffset, 50, 1);
            tower.onComplete((gameState, tower) => {
                let player = gameState.closestPlayer(tower.x, tower.y);
                // Create orb
                let orbX = 400 + 370 * Math.cos(angle);
                let orbY = 400 + 370 * Math.sin(angle);
                let orb = new homingOrb_1.HomingOrb(orbX, orbY, 30, 20, { color: ((i / 2 << 0) % 2 == 0) ? 'blue' : 'red' });
                orb.applyToTarget(player);
                orb.onCollision((gameState, orb) => {
                    let chariot = new chariot_1.Chariot(orb.x, orb.y, 150, true);
                    chariot.onComplete((gameState, chariot) => {
                        let soakers = [];
                        for (let [, player] of gameState.players) {
                            if ((0, utils_1.distance)(player.x, player.y, chariot.x, chariot.y) < chariot.r) {
                                soakers.push(player);
                                if (!player.hasStatusOfType(((i / 2 << 0) % 2 == 0) ? statusType_1.StatusType.BLUE_SHIELD : statusType_1.StatusType.RED_SHIELD)) {
                                    gameState.messages.push(player.name + ' died from soaking orb without proper resistance');
                                }
                            }
                        }
                        if (soakers.length < 2) {
                            for (let soaker of soakers) {
                                gameState.messages.push(soaker.name + ' died from soaking orb alone');
                            }
                        }
                    });
                    gameState.schedule(chariot, gameState.now, 200);
                });
                this.schedule(orb, this.orbStart, this.orbEnd);
                // Assign statuses
                if (gameState.players.get(player).statuses.length == 0) {
                    let status = new status_1.Status(((i / 2 << 0) % 2 == 0) ? statusType_1.StatusType.RED_SHIELD : statusType_1.StatusType.BLUE_SHIELD);
                    status.schedule(this.getPhaseStart() + this.immuneStart, this.immuneEnd - this.immuneStart);
                    gameState.players.get(player).statuses.push(status);
                }
            });
            this.schedule(tower, this.towerStart, this.towerEnd);
        }
    }
    process(gameState) {
        let phaseTime = gameState.now - this.getPhaseStart();
        if (this.lastPhaseProcessTime < this.bloodrakeStart && this.bloodrakeStart <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                if (i == this.safeIndex) {
                    continue;
                }
                this.squares[i].active = true;
                this.squares[i].activeStart = this.getPhaseStart() + this.bloodrakeStart;
            }
        }
        if (this.lastPhaseProcessTime < this.bloodrakeEnd && this.bloodrakeEnd <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                this.squares[i].active = false;
            }
        }
        if (this.lastPhaseProcessTime < this.boomStart && this.boomStart <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                if (i == this.safeIndex) {
                    continue;
                }
                let aoe = new lineAOE_1.LineAOE(this.squares[i].x + this.squares[i].width / 2, this.squares[i].y, this.squares[i].x + this.squares[i].width / 2, this.squares[i].y + this.squares[i].height, this.squares[i].width);
                this.schedule(aoe, this.boomStart, this.boomEnd);
            }
        }
        this.lastPhaseProcessTime = phaseTime;
    }
}
exports.BeloneBurst = BeloneBurst;
//# sourceMappingURL=beloneBurst.js.map