"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Castbar = void 0;
const drawPriority_1 = require("./drawPriority");
const mechanic_1 = require("./mechanic");
class Castbar extends mechanic_1.Mechanic {
    constructor(spellName, x, y, width, height) {
        super();
        this.id = mechanic_1.MechanicId.CASTBAR;
        this.spellName = spellName;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dp = drawPriority_1.DrawPriority.CRITIAL;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Castbar = Castbar;
//# sourceMappingURL=castbar.js.map