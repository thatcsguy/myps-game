"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicId = exports.Mechanic = void 0;
const drawPriority_1 = require("./drawPriority");
class Mechanic {
    constructor() {
        this.dp = drawPriority_1.DrawPriority.GROUND;
    }
    process(gameState, index) {
        if (gameState.now >= this.start && this.visibleFunction && !this.visibleFunctionRan) {
            this.visibleFunction(gameState, this);
            this.visibleFunctionRan = true;
        }
    }
    onVisible(fn) {
        this.visibleFunction = fn;
    }
    onComplete(fn) {
        this.completeFunction = fn;
    }
}
exports.Mechanic = Mechanic;
var MechanicId;
(function (MechanicId) {
    MechanicId[MechanicId["ANIMATION"] = 0] = "ANIMATION";
    MechanicId[MechanicId["CASTBAR"] = 1] = "CASTBAR";
    MechanicId[MechanicId["CHAIN"] = 2] = "CHAIN";
    MechanicId[MechanicId["CHARIOT"] = 3] = "CHARIOT";
    MechanicId[MechanicId["CONAL"] = 4] = "CONAL";
    MechanicId[MechanicId["DOOM_CIRCLE"] = 5] = "DOOM_CIRCLE";
    MechanicId[MechanicId["DYNAMO"] = 6] = "DYNAMO";
    MechanicId[MechanicId["HOMING_ORB"] = 7] = "HOMING_ORB";
    MechanicId[MechanicId["KNOCKBACK"] = 8] = "KNOCKBACK";
    MechanicId[MechanicId["LINE_AOE"] = 9] = "LINE_AOE";
    MechanicId[MechanicId["MARKER"] = 10] = "MARKER";
    MechanicId[MechanicId["PASSABLE_TETHER"] = 11] = "PASSABLE_TETHER";
    MechanicId[MechanicId["PINAX_SQUARE"] = 12] = "PINAX_SQUARE";
    MechanicId[MechanicId["PUDDLE"] = 13] = "PUDDLE";
    MechanicId[MechanicId["SPREAD"] = 14] = "SPREAD";
    MechanicId[MechanicId["STACK"] = 15] = "STACK";
    MechanicId[MechanicId["STRETCH_POINT_TETHER"] = 16] = "STRETCH_POINT_TETHER";
    MechanicId[MechanicId["TOWER"] = 17] = "TOWER";
})(MechanicId = exports.MechanicId || (exports.MechanicId = {}));
//# sourceMappingURL=mechanic.js.map