import { GameState } from "../gamestate"
import { StatusType } from "../status/statusType"
import { Mechanic, MechanicId } from "./mechanic"

export class DoomCircle extends Mechanic {

    id: MechanicId = MechanicId.DOOM_CIRCLE

    r: number
    target: string

    constructor(r: number) {
        super()
        this.r = r
    }

    applyToTarget(target: string): void {
        this.target = target
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            let targetPlayer = gameState.players.get(this.target)
            if (!targetPlayer.hasStatusOfType(StatusType.RED_SHIELD)) {
                gameState.messages.push(targetPlayer.name + ' died to doom')
            }
            gameState.cleanupMechanic(index)
        }
    }
}