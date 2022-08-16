"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerImg = exports.Marker = void 0;
const mechanic_1 = require("./mechanic");
class Marker extends mechanic_1.Mechanic {
    constructor(x, y, r) {
        super();
        this.id = mechanic_1.MechanicId.MARKER;
        this.x = x;
        this.y = y;
        this.r = r;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Marker = Marker;
var MarkerImg;
(function (MarkerImg) {
    MarkerImg[MarkerImg["THORN"] = 1] = "THORN";
})(MarkerImg = exports.MarkerImg || (exports.MarkerImg = {}));
//# sourceMappingURL=marker.js.map