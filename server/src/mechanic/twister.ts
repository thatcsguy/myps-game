import { GameState } from "../gamestate"
import { StatusType } from "../status/statusType"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Twister extends Mechanic {

    id: MechanicId = MechanicId.TWISTER

    x: number
    y: number

    private moveTime = 300

    triggerFunction: (gameState: GameState, mech: Mechanic) => void

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now < this.start + this.moveTime) {
            return
        }

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }

        for (let [, player] of gameState.players) {
            if (distance(player.x, player.y, this.x, this.y) < 20) {
                this.triggerFunction(gameState, this)
            }
        }

    }

    onTrigger(fn: (gameState: GameState, mech: Mechanic) => void) {
        this.triggerFunction = fn
    }
}