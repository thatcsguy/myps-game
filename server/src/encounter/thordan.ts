import { ArenaId } from "../data/arenaId"
import { LightningStorm } from "../phase/thordan/lightningStorm"
import { Proteans } from "../phase/thordan/proteans"
import { Sanctity } from "../phase/thordan/sanctity"
import { Encounter } from "./encounter"

export class Thordan extends Encounter {

    arenaId: ArenaId = ArenaId.ROUND

    constructor() {
        super()

        // maybe?
        // this.deathWalls = true

        this.script = [
            { restTime: 2000, phase: new Sanctity() },
            { restTime: 2000, phase: new Proteans() },
            { restTime: 2000, phase: new LightningStorm() },
        ]
    }
}