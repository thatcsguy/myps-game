"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movement = void 0;
class Movement {
    constructor(clientMove) {
        this.timestamp = clientMove.timestamp;
        this.frameTime = clientMove.frameTime;
        this.up = clientMove.up;
        this.down = clientMove.down;
        this.left = clientMove.left;
        this.right = clientMove.right;
    }
    isDiagonal() {
        return (this.left || this.right) && (this.up || this.down);
    }
}
exports.Movement = Movement;
//# sourceMappingURL=movement.js.map