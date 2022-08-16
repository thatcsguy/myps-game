"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tower = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Tower extends mechanic_1.Mechanic {
    constructor(x, y, r, playersNeeded) {
        super();
        this.id = mechanic_1.MechanicId.TOWER;
        this.x = x;
        this.y = y;
        this.r = r;
        this.playersNeeded = playersNeeded;
        this.soakers = [];
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (this.start + this.duration <= gameState.now) {
            let playerCount = 0;
            for (let [, player] of gameState.players) {
                let dist = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
                if (dist < this.r) {
                    playerCount++;
                    this.soakers.push(player.name);
                }
            }
            if (playerCount < this.playersNeeded) {
                gameState.messages.push('tower was unsoaked');
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Tower = Tower;
//# sourceMappingURL=tower.js.map