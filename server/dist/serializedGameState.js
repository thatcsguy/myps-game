"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedGameState = void 0;
class SerializedGameState {
    constructor(gameState) {
        this.now = gameState.now;
        this.pl = new Map();
        for (let [p, player] of gameState.players) {
            this.pl.set(p, player);
        }
        this.mc = [];
        for (let mech of gameState.mechanics) {
            if (this.now >= mech.start) {
                this.mc.push(mech);
            }
        }
        this.ms = gameState.messages;
        this.ar = gameState.arenaId;
        this.dw = gameState.wallsAreDeath();
        this.rc = gameState.readycheck;
    }
    serialize() {
        let filteredGameState = JSON.parse(JSON.stringify(this));
        filteredGameState.pl = Object.fromEntries(this.pl);
        return filteredGameState;
    }
}
exports.SerializedGameState = SerializedGameState;
//# sourceMappingURL=serializedGameState.js.map