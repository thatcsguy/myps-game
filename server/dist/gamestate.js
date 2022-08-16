"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const utils_1 = require("./utils");
const readycheck_1 = require("./readycheck");
const arenaId_1 = require("./data/arenaId");
const marker_1 = require("./mechanic/marker");
class GameState {
    constructor() {
        this.godMode = false;
        this.start = Date.now();
        this.now = 0;
        this.players = new Map();
        this.mechanics = [];
        this.messages = [];
        this.arenaId = arenaId_1.ArenaId.SQUARE;
        this.processCounter = 0;
    }
    reset() {
        for (let [, player] of this.players) {
            player.reset();
        }
        this.start = Date.now();
        this.now = 0;
        this.mechanics = [];
        this.messages = [];
        this.encounter = null;
        this.readycheck = null;
    }
    process() {
        this.processCounter++;
        let now = Date.now();
        this.now = now - this.start;
        if (this.encounter) {
            this.arenaId = this.encounter.arenaId;
            this.encounter.process(this);
        }
        for (let [, player] of this.players) {
            player.process(this);
        }
        // mechs backwards to be able to splice without issues
        for (let i = this.mechanics.length - 1; i >= 0; i--) {
            let mech = this.mechanics[i];
            mech.process(this, i);
        }
        if (this.messages.length > 0 && !this.godMode) {
            if (this.encounter) {
                this.nextEncounter = this.encounter;
                this.encounter = null;
                this.readycheck = new readycheck_1.ReadyCheck();
            }
            if (this.readycheck) {
                if (this.readycheck.playersReady() == this.players.size) {
                    this.reset();
                    this.encounter = this.nextEncounter;
                    this.nextEncounter = null;
                    this.encounter.reset();
                }
            }
            this.messages = [...new Set(this.messages)];
        }
        this.mechanics.sort((a, b) => {
            if (a.dp == b.dp) {
                if (a instanceof marker_1.Marker && b instanceof marker_1.Marker) {
                    return a.y - b.y;
                }
            }
            return a.dp - b.dp;
        });
        if (this.godMode) {
            this.messages = [];
        }
    }
    schedule(mech, start, duration) {
        mech.start = start;
        mech.duration = duration;
        this.mechanics.push(mech);
    }
    cleanupMechanic(index) {
        if (this.mechanics[index].completeFunction) {
            this.mechanics[index].completeFunction(this, this.mechanics[index]);
        }
        this.mechanics.splice(index, 1);
    }
    closestPlayer(x, y) {
        let closestDist = 50000;
        let closestPlayer = null;
        for (let [p, player] of this.players) {
            let dist = (0, utils_1.distance)(x, y, player.x, player.y);
            if (dist < closestDist) {
                closestDist = dist;
                closestPlayer = p;
            }
        }
        return closestPlayer;
    }
    closestPlayers(x, y, count) {
        let arr = [];
        this.players.forEach((p) => {
            arr.push({
                name: p.name,
                dist: (0, utils_1.distance)(p.x, p.y, x, y)
            });
        });
        arr = arr.sort((a, b) => {
            return a.dist - b.dist;
        });
        let ret = [];
        for (let i = 0; i < count && i < arr.length; i++) {
            ret.push(arr[i].name);
        }
        return ret;
    }
    randomPlayer() {
        let keys = Array.from(this.players.keys());
        return keys[keys.length * Math.random() << 0];
    }
    randomPlayers(count) {
        let keys = (0, utils_1.shuffle)(Array.from(this.players.keys()));
        return keys.slice(0, count);
    }
    wallsAreDeath() {
        if (this.encounter) {
            return this.encounter.deathWalls;
        }
        if (this.nextEncounter) {
            return this.nextEncounter.deathWalls;
        }
        return false;
    }
}
exports.GameState = GameState;
//# sourceMappingURL=gamestate.js.map