"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Stack extends mechanic_1.Mechanic {
    constructor(requiredPlayers, r) {
        super();
        this.id = mechanic_1.MechanicId.STACK;
        this.requiredPlayers = requiredPlayers;
        this.r = r;
    }
    applyToTarget(player) {
        this.target = player;
    }
    process(gameState, index) {
        super.process(gameState, index);
        let targetPlayer = gameState.players.get(this.target);
        if (gameState.now >= this.start + this.duration) {
            let soakers = [];
            for (let [, player] of gameState.players) {
                if ((0, utils_1.distance)(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                    soakers.push(player);
                }
            }
            if (soakers.length < this.requiredPlayers) {
                for (let p of soakers) {
                    gameState.messages.push(p.name + ' died to failed stack');
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
    soakers(gameState) {
        let soakers = [];
        let targetPlayer = gameState.players.get(this.target);
        for (let [p, player] of gameState.players) {
            if ((0, utils_1.distance)(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                soakers.push(p);
            }
        }
        return soakers;
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map