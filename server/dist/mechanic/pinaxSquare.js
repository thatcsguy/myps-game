"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinaxSquare = void 0;
const drawPriority_1 = require("./drawPriority");
const mechanic_1 = require("./mechanic");
class PinaxSquare extends mechanic_1.Mechanic {
    constructor(element, x, y, width, height) {
        super();
        this.id = mechanic_1.MechanicId.PINAX_SQUARE;
        this.active = false;
        this.element = element;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dp = drawPriority_1.DrawPriority.BACKGROUND;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
        }
    }
}
exports.PinaxSquare = PinaxSquare;
(function (PinaxSquare) {
    let Element;
    (function (Element) {
        Element["FIRE"] = "FIRE";
        Element["LIGHTNING"] = "LIGHTNING";
        Element["POISON"] = "POISON";
        Element["WATER"] = "WATER";
    })(Element = PinaxSquare.Element || (PinaxSquare.Element = {}));
})(PinaxSquare = exports.PinaxSquare || (exports.PinaxSquare = {}));
//# sourceMappingURL=pinaxSquare.js.map