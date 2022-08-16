"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puddle = void 0;
const statusType_1 = require("../status/statusType");
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Puddle extends mechanic_1.Mechanic {
    constructor(x, y, r) {
        super();
        this.id = mechanic_1.MechanicId.PUDDLE;
        this.firstTick = true;
        this.x = x;
        this.y = y;
        this.r = r;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now < this.start) {
            return;
        }
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
        }
        if (this.firstTick) {
            this.firstTick = false;
            return;
        }
        for (let [, player] of gameState.players) {
            if (player.hasStatusOfType(statusType_1.StatusType.PURPLE_SHIELD)) {
                continue;
            }
            let dist = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
            if (dist < this.r) {
                gameState.messages.push(player.name + ' died to puddle');
            }
        }
    }
}
exports.Puddle = Puddle;
//# sourceMappingURL=puddle.js.map