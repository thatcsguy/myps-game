"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomingOrb = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class HomingOrb extends mechanic_1.Mechanic {
    constructor(x, y, r, speed, options) {
        super();
        this.id = mechanic_1.MechanicId.HOMING_ORB;
        this.lastProcessTime = -1;
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = speed;
        this.options = options;
        // maybe?
        //this.drawPriority = DrawPriority.OVER_PLAYER
    }
    applyToTarget(target) {
        this.target = target;
    }
    onCollision(fn) {
        this.collisionFunction = fn;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.messages.push('unsoaked orb exploded');
            gameState.cleanupMechanic(index);
            return;
        }
        if (this.lastProcessTime < 0) {
            this.lastProcessTime = gameState.now;
        }
        if (!this.target) {
            return;
        }
        let timeSinceLastProcess = gameState.now - this.lastProcessTime;
        let player = gameState.players.get(this.target);
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += this.speed * (timeSinceLastProcess / 1000) * Math.cos(angle);
        this.y += this.speed * (timeSinceLastProcess / 1000) * Math.sin(angle);
        for (let [, player] of gameState.players) {
            if ((0, utils_1.distance)(player.x, player.y, this.x, this.y) < this.r) {
                if (this.collisionFunction) {
                    this.collisionFunction(gameState, this);
                }
                gameState.cleanupMechanic(index);
            }
        }
        this.lastProcessTime = gameState.now;
    }
}
exports.HomingOrb = HomingOrb;
//# sourceMappingURL=homingOrb.js.map