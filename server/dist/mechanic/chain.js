"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Chain extends mechanic_1.Mechanic {
    constructor(breakLength, removeOnBreak, opt) {
        super();
        this.id = mechanic_1.MechanicId.CHAIN;
        this.killOnEnd = true;
        this.safe = false;
        this.breakLength = breakLength;
        this.removeOnBreak = removeOnBreak;
        this.opt = opt;
    }
    applyToTargets(target1, target2) {
        this.target1 = target1;
        this.target2 = target2;
    }
    process(gameState, index) {
        super.process(gameState, index);
        this.safe = this.isSafe(gameState);
        let player1 = gameState.players.get(this.target1);
        let player2 = gameState.players.get(this.target2);
        if (!player1 || !player2) {
            gameState.cleanupMechanic(index);
            return;
        }
        if (this.removeOnBreak && this.safe) {
            gameState.cleanupMechanic(index);
            return;
        }
        if (gameState.now >= this.start + this.duration) {
            if (!this.safe && this.killOnEnd) {
                gameState.messages.push(player1.name + ' and ' + player2.name + ' failed to break chain');
            }
            gameState.cleanupMechanic(index);
        }
    }
    isSafe(gameState) {
        if (!this.target1 || !this.target2) {
            return false;
        }
        let player1 = gameState.players.get(this.target1);
        let player2 = gameState.players.get(this.target2);
        let dist = (0, utils_1.distance)(player1.x, player1.y, player2.x, player2.y);
        return dist > this.breakLength;
    }
}
exports.Chain = Chain;
//# sourceMappingURL=chain.js.map