"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spread = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Spread extends mechanic_1.Mechanic {
    constructor(r) {
        super();
        this.id = mechanic_1.MechanicId.SPREAD;
        this.r = r;
    }
    applyToTarget(target) {
        this.target = target;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            let targetPlayer = gameState.players.get(this.target);
            for (let [p, player] of gameState.players) {
                if (p == this.target) {
                    continue;
                }
                if ((0, utils_1.distance)(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                    gameState.messages.push(player.name + ' died to failed spread');
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Spread = Spread;
//# sourceMappingURL=spread.js.map