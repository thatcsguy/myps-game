"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chariot = void 0;
const utils_1 = require("../utils");
const mechanic_1 = require("./mechanic");
class Chariot extends mechanic_1.Mechanic {
    constructor(x, y, r, preventDeath) {
        super();
        this.id = mechanic_1.MechanicId.CHARIOT;
        this.baitComplete = false;
        this.x = x;
        this.y = y;
        this.r = r;
        this.preventDeath = preventDeath || false;
    }
    spawnOnPlayer(player) {
        this.playerTarget = player;
    }
    process(gameState, index) {
        super.process(gameState, index);
        if (this.playerTarget && !this.baitComplete && gameState.now >= this.start) {
            let player = gameState.players.get(this.playerTarget);
            this.x = player.x;
            this.y = player.y;
            this.baitComplete = true;
        }
        if (gameState.now >= this.start + this.duration) {
            if (!this.preventDeath) {
                for (let [, player] of gameState.players) {
                    let dist = (0, utils_1.distance)(player.x, player.y, this.x, this.y);
                    if (dist < this.r) {
                        gameState.messages.push(player.name + ' died to AOE');
                    }
                }
            }
            gameState.cleanupMechanic(index);
        }
    }
}
exports.Chariot = Chariot;
//# sourceMappingURL=chariot.js.map