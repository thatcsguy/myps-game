"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2 = void 0;
const arenaId_1 = require("../data/arenaId");
const fountainOfFire_1 = require("../phase/fountainOfFire");
const victory_1 = require("../phase/victory");
const encounter_1 = require("./encounter");
class E2 extends encounter_1.Encounter {
    constructor() {
        super();
        this.arenaId = arenaId_1.ArenaId.ROUND;
        this.deathWalls = true;
        this.script = [
            { restTime: 0, phase: new fountainOfFire_1.FountainOfFire() },
            { restTime: 2000, phase: new victory_1.Victory() },
        ];
    }
}
exports.E2 = E2;
//# sourceMappingURL=e2.js.map