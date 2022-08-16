"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassableTether = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class PassableTether extends mechanic_1.Mechanic {
    constructor(x, y) {
        super();
        this.id = mechanic_1.MechanicId.PASSABLE_TETHER;
        this.x = x;
        this.y = y;
    }
    applyToTarget(target) {
        this.target = target;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
            return;
        }
        let targetPlayer = gameState.players.get(this.target);
        if (!targetPlayer) {
            gameState.cleanupMechanic(index);
            return;
        }
        let playersWithTethers = [];
        for (let mech of gameState.mechanics) {
            if (mech instanceof PassableTether) {
                if (mech.target) {
                    playersWithTethers.push(mech.target);
                }
            }
        }
        for (let [p, player] of gameState.players) {
            if (playersWithTethers.includes(p)) {
                continue;
            }
            if ((0, utils_1.isPointWithinLineHitbox)(player.x, player.y, this.x, this.y, targetPlayer.x, targetPlayer.y, player.speed / 60)) {
                this.target = p;
            }
        }
    }
}
exports.PassableTether = PassableTether;
//# sourceMappingURL=passableTether.js.map