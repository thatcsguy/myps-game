import { GameState } from "../gamestate"
import { Mechanic, MechanicId } from "./mechanic"

export class Marker extends Mechanic {

    id: MechanicId = MechanicId.MARKER

    x: number
    y: number
    r: number

    img: MarkerImg

    constructor(x: number, y: number, r: number) {
        super()
        this.x = x
        this.y = y
        this.r = r
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }
    }
}

export enum MarkerImg {
    THORN = 1,
    THORDAN = 2,
    NEUROLINK = 3,
}