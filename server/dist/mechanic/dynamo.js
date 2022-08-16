"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamo = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Dynamo extends mechanic_1.Mechanic {
    constructor(x, y, r1, r2) {
        super();
        this.id = mechanic_1.MechanicId.DYNAMO;
        this.x = x;
        this.y = y;
        this.r1 = r1;
        this.r2 = r2;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (this.start + this.duration < gameState.now) {
            for (let [, player] of gameState.players) {
                let dist = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
                if (dist > this.r1 && dist < this.r2) {
                    gameState.messages.push(player.name + ' died to dynamo');
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Dynamo = Dynamo;
//# sourceMappingURL=dynamo.js.map