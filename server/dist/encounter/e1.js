"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E1 = void 0;
const arenaId_1 = require("../data/arenaId");
const blastSpread_1 = require("../phase/blastSpread");
const dynamoToSpreads_1 = require("../phase/dynamoToSpreads");
const fourTowers_1 = require("../phase/fourTowers");
const knockToTowers_1 = require("../phase/knockToTowers");
const nineChariots_1 = require("../phase/nineChariots");
const puddleDrops_1 = require("../phase/puddleDrops");
const puddlesIntoTower_1 = require("../phase/puddlesIntoTower");
const safeEdges_1 = require("../phase/safeEdges");
const statueBaits_1 = require("../phase/statueBaits");
const victory_1 = require("../phase/victory");
const encounter_1 = require("./encounter");
class E1 extends encounter_1.Encounter {
    constructor() {
        super();
        this.arenaId = arenaId_1.ArenaId.SQUARE;
        this.script = [
            { restTime: 1000, phase: new dynamoToSpreads_1.DynamoToSpreads() },
            { restTime: 2000, phase: new nineChariots_1.NineChariots() },
            { restTime: 2000, phase: new knockToTowers_1.KnockToTowers() },
            { restTime: 700, phase: new fourTowers_1.FourTowers() },
            { restTime: 1500, phase: new safeEdges_1.SafeEdges() },
            { restTime: 2000, phase: new blastSpread_1.BlastSpread() },
            { restTime: 2000, phase: new puddleDrops_1.PuddleDrops(5) },
            { restTime: 2000, phase: new statueBaits_1.StatueBaits() },
            { restTime: 4000, phase: new puddlesIntoTower_1.PuddlesIntoTower() },
            { restTime: 2000, phase: new victory_1.Victory() },
        ];
    }
}
exports.E1 = E1;
//# sourceMappingURL=e1.js.map