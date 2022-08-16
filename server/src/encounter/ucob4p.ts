import { ArenaId } from "../data/arenaId"
import { Twintania } from "../phase/ucob/twintania"
import { Encounter } from "./encounter"

export class Ucob4p extends Encounter {

    arenaId: ArenaId = ArenaId.ROUND

    constructor() {
        super()

        this.deathWalls = true

        this.script = [
            { restTime: 2000, phase: new Twintania() },
        ]
    }
}