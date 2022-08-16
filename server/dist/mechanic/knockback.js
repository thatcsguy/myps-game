"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knockback = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Knockback extends mechanic_1.Mechanic {
    constructor(x, y, knockDistance, knockDuration) {
        super();
        this.id = mechanic_1.MechanicId.KNOCKBACK;
        this.x = x;
        this.y = y;
        this.knockDistance = knockDistance;
        this.knockDuration = knockDuration;
        this.knockEnds = new Map();
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (this.start + this.duration <= gameState.now) {
            gameState.cleanupMechanic(index);
            return;
        }
        let knockStart = this.start + this.duration - this.knockDuration;
        if (this.start + this.duration - this.knockDuration <= gameState.now) {
            let kbProgress = (gameState.now - knockStart) / this.knockDuration;
            for (let [p, player] of gameState.players) {
                if (!this.knockEnds.has(p)) {
                    let d = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
                    let ratio = this.knockDistance / d;
                    let dx = (player.x - this.x) * ratio;
                    let dy = (player.y - this.y) * ratio;
                    this.knockEnds.set(p, [player.x, player.y, player.x + dx, player.y + dy]);
                }
                let [startX, startY, endX, endY] = this.knockEnds.get(p);
                player.x = startX + (endX - startX) * kbProgress;
                player.y = startY + (endY - startY) * kbProgress;
                player.fixPosition(gameState);
            }
        }
    }
}
exports.Knockback = Knockback;
//# sourceMappingURL=knockback.js.map