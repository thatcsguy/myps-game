"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E4 = void 0;
const arenaId_1 = require("../data/arenaId");
const p4Act1_1 = require("../phase/p4Act1");
const p4Act2_1 = require("../phase/p4Act2");
const p4Act4_1 = require("../phase/p4Act4");
const victory_1 = require("../phase/victory");
const encounter_1 = require("./encounter");
class E4 extends encounter_1.Encounter {
    constructor() {
        super();
        this.arenaId = arenaId_1.ArenaId.ROUND;
        this.deathWalls = true;
        this.script = [
            { restTime: 2000, phase: new p4Act1_1.P4Act1() },
            { restTime: 2000, phase: new p4Act2_1.P4Act2() },
            { restTime: 2000, phase: new p4Act4_1.P4Act4() },
            { restTime: 2000, phase: new victory_1.Victory() },
        ];
    }
}
exports.E4 = E4;
//# sourceMappingURL=e4.js.map