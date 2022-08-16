import { ArenaId } from "../data/arenaId"
import { BlastSpread } from "../phase/intro/blastSpread"
import { DynamoToSpreads } from "../phase/intro/dynamoToSpreads"
import { FourTowers } from "../phase/intro/fourTowers"
import { KnockToTowers } from "../phase/intro/knockToTowers"
import { NineChariots } from "../phase/intro/nineChariots"
import { PuddleDrops } from "../phase/intro/puddleDrops"
import { PuddlesIntoTower } from "../phase/intro/puddlesIntoTower"
import { SafeEdges } from "../phase/intro/safeEdges"
import { StatueBaits } from "../phase/intro/statueBaits"
import { Victory } from "../phase/victory"
import { Encounter } from "./encounter"

export class Intro extends Encounter {

    arenaId: ArenaId = ArenaId.SQUARE

    constructor() {
        super()

        this.script = [
            { restTime: 1000, phase: new DynamoToSpreads() },
            { restTime: 2000, phase: new NineChariots() },
            { restTime: 2000, phase: new KnockToTowers() },
            { restTime: 700, phase: new FourTowers() },
            { restTime: 1500, phase: new SafeEdges() },
            { restTime: 2000, phase: new BlastSpread() },
            { restTime: 2000, phase: new PuddleDrops(5) },
            { restTime: 2000, phase: new StatueBaits() },
            { restTime: 4000, phase: new PuddlesIntoTower() },
            { restTime: 2000, phase: new Victory() },
        ]
    }
}