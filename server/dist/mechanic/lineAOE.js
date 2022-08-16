"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineAOE = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class LineAOE extends mechanic_1.Mechanic {
    constructor(startX, startY, endX, endY, width) {
        super();
        this.id = mechanic_1.MechanicId.LINE_AOE;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.width = width;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            for (let [, player] of gameState.players) {
                if ((0, utils_1.isPointWithinLineHitbox)(player.x, player.y, this.startX, this.startY, this.endX, this.endY, this.width / 2)) {
                    gameState.messages.push(player.name + ' died to AOE');
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.LineAOE = LineAOE;
//# sourceMappingURL=lineAOE.js.map