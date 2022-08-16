import { ArenaId } from "../data/arenaId"
import { P4Act1 } from "../phase/p4s2/p4Act1"
import { P4Act2 } from "../phase/p4s2/p4Act2"
import { P4Act4 } from "../phase/p4s2/p4Act4"
import { P4Finale } from "../phase/p4s2/p4Finale"
import { Victory } from "../phase/victory"
import { Encounter } from "./encounter"

export class P4S2 extends Encounter {

    arenaId: ArenaId = ArenaId.ROUND

    constructor() {
        super()

        this.deathWalls = true

        this.script = [
            { restTime: 2000, phase: new P4Act1() },
            { restTime: 2000, phase: new P4Act2() },
            { restTime: 2000, phase: new P4Act4() },
            { restTime: 2000, phase: new P4Finale() },
            { restTime: 2000, phase: new Victory() },
        ]
    }
}