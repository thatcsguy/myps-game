import { GameState } from "../gamestate"
import { StatusType } from "../status/statusType"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Puddle extends Mechanic {

    id: MechanicId = MechanicId.PUDDLE

    x: number
    y: number
    r: number

    private firstTick = true

    constructor(x: number, y: number, r: number) {
        super()
        this.x = x
        this.y = y
        this.r = r
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now < this.start) {
            return
        }

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }

        if (this.firstTick) {
            this.firstTick = false
            return
        }

        for (let [, player] of gameState.players) {
            if (player.hasStatusOfType(StatusType.PURPLE_SHIELD)) {
                continue
            }

            let dist = distance(player.x, player.y, this.x, this.y)
            if (dist < this.r) {
                gameState.messages.push(player.name + ' died to puddle')
            }
        }


    }
}