import { ArenaId } from "../data/arenaId"
import { BeloneBurst } from "../phase/p4s1/beloneBurst"
import { DoomAndTethers } from "../phase/p4s1/doomAndTethers"
import { Pinax } from "../phase/p4s1/pinax"
import { TethersAndTowers } from "../phase/p4s1/tethersAndTowers"
import { Victory } from "../phase/victory"
import { Encounter } from "./encounter"

export class P4S1 extends Encounter {

    arenaId: ArenaId = ArenaId.SQUARE

    constructor() {
        super()

        this.deathWalls = true

        this.script = [
            { restTime: 2000, phase: new DoomAndTethers() },
            { restTime: 2000, phase: new Pinax() },
            { restTime: 2000, phase: new BeloneBurst() },
            { restTime: 2000, phase: new TethersAndTowers() },
            { restTime: 2000, phase: new Pinax() },
            { restTime: 2000, phase: new Victory() },
        ]
    }
}