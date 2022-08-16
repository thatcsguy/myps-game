"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
class Status {
    constructor(type) {
        this.type = type;
    }
    schedule(start, duration) {
        this.start = start;
        this.duration = duration;
    }
    process(gameState, player, index) {
        if (gameState.now - this.start >= this.duration) {
            player.statuses.splice(index, 1);
        }
    }
}
exports.Status = Status;
//# sourceMappingURL=status.js.map