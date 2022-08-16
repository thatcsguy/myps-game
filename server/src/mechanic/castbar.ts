import { GameState } from "../gamestate"
import { DrawPriority } from "./drawPriority"
import { Mechanic, MechanicId } from "./mechanic"

export class Castbar extends Mechanic {

    id: MechanicId = MechanicId.CASTBAR

    spellName: string
    x: number
    y: number

    constructor(spellName: string, x: number, y: number) {
        super()
        this.spellName = spellName
        this.x = x
        this.y = y

        this.dp = DrawPriority.CRITIAL
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }
    }
}