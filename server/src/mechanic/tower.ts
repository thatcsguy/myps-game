import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Tower extends Mechanic {

    id: MechanicId = MechanicId.TOWER

    x: number
    y: number
    r: number
    playersNeeded: number

    soakers: string[]

    constructor(x: number, y: number, r: number, playersNeeded: number) {
        super()
        this.x = x
        this.y = y
        this.r = r
        this.playersNeeded = playersNeeded

        this.soakers = []
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (this.start + this.duration <= gameState.now) {
            let playerCount = 0
            for (let [, player] of gameState.players) {
                let dist = distance(player.x, player.y, this.x, this.y)
                if (dist < this.r) {
                    playerCount++
                    this.soakers.push(player.name)
                }
            }
            if (playerCount < this.playersNeeded) {
                gameState.messages.push('tower was unsoaked')
            }
            gameState.cleanupMechanic(index)
        }
    }
}