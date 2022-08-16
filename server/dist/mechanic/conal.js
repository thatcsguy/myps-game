"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conal = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Conal extends mechanic_1.Mechanic {
    constructor(x, y, r, direction, width) {
        super();
        this.id = mechanic_1.MechanicId.CONAL;
        this.x = x;
        this.y = y;
        this.r = r;
        this.direction = direction;
        this.width = width;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (this.start + this.duration <= gameState.now) {
            for (let [, player] of gameState.players) {
                if ((0, utils_1.distance)(player.x, player.y, this.x, this.y) < this.r) {
                    let angle = Math.atan2(player.y - this.y, player.x - this.x);
                    if (angle < 0) {
                        angle += 2 * Math.PI;
                    }
                    if (Math.abs(this.direction - angle) < this.width / 2 ||
                        Math.abs(Math.max(this.direction, angle) - 2 * Math.PI -
                            Math.min(this.direction, angle)) < this.width / 2) {
                        gameState.messages.push(player.name + ' died to conal');
                    }
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Conal = Conal;
//# sourceMappingURL=conal.js.map