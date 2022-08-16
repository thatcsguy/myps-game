"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StretchPointTether = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class StretchPointTether extends mechanic_1.Mechanic {
    constructor(x, y, stretchLength, removeOnStretch) {
        super();
        this.id = mechanic_1.MechanicId.STRETCH_POINT_TETHER;
        this.x = x;
        this.y = y;
        this.stretchLength = stretchLength;
        this.removeOnStretch = removeOnStretch;
    }
    applyToTarget(target) {
        this.target = target;
    }
    process(gameState, index) {
        super.process(gameState, index);
        let player = gameState.players.get(this.target);
        if (!player) {
            gameState.cleanupMechanic(index);
            return;
        }
        this.safe = false;
        let dist = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
        if (dist >= this.stretchLength) {
            this.safe = true;
            if (this.removeOnStretch) {
                gameState.cleanupMechanic(index);
                return;
            }
        }
        if (gameState.now >= this.start + this.duration) {
            if (!this.safe) {
                gameState.messages.push(player.name + ' failed to stretch tether');
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.StretchPointTether = StretchPointTether;
//# sourceMappingURL=stretchPointTether.js.map