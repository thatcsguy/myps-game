"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E3 = void 0;
const pinax_1 = require("../phase/pinax");
const doomAndTethers_1 = require("../phase/doomAndTethers");
const tethersAndTowers_1 = require("../phase/tethersAndTowers");
const victory_1 = require("../phase/victory");
const encounter_1 = require("./encounter");
const beloneBurst_1 = require("../phase/beloneBurst");
const arenaId_1 = require("../data/arenaId");
class E3 extends encounter_1.Encounter {
    constructor() {
        super();
        this.arenaId = arenaId_1.ArenaId.SQUARE;
        this.deathWalls = true;
        this.script = [
            { restTime: 2000, phase: new doomAndTethers_1.DoomAndTethers() },
            { restTime: 2000, phase: new pinax_1.Pinax() },
            { restTime: 2000, phase: new beloneBurst_1.BeloneBurst() },
            { restTime: 2000, phase: new tethersAndTowers_1.TethersAndTowers() },
            { restTime: 2000, phase: new pinax_1.Pinax() },
            { restTime: 2000, phase: new victory_1.Victory() },
        ];
    }
}
exports.E3 = E3;
//# sourceMappingURL=e3.js.map