"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoomCircle = void 0;
const statusType_1 = require("../status/statusType");
const mechanic_1 = require("./mechanic");
class DoomCircle extends mechanic_1.Mechanic {
    constructor(r) {
        super();
        this.id = mechanic_1.MechanicId.DOOM_CIRCLE;
        this.r = r;
    }
    applyToTarget(target) {
        this.target = target;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            let targetPlayer = gameState.players.get(this.target);
            if (!targetPlayer.hasStatusOfType(statusType_1.StatusType.RED_SHIELD)) {
                gameState.messages.push(targetPlayer.name + ' died to doom');
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.DoomCircle = DoomCircle;
//# sourceMappingURL=doomCircle.js.map