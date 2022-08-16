import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Dynamo extends Mechanic {

    id: MechanicId = MechanicId.DYNAMO

    x: number
    y: number
    r1: number
    r2: number

    constructor(x: number, y: number, r1: number, r2: number) {
        super()
        this.x = x
        this.y = y
        this.r1 = r1
        this.r2 = r2
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (this.start + this.duration < gameState.now) {
            for (let [, player] of gameState.players) {
                let dist = distance(player.x, player.y, this.x, this.y)
                if (dist > this.r1 && dist < this.r2) {
                    gameState.messages.push(player.name + ' died to dynamo')
                }
            }
            gameState.cleanupMechanic(index)
        }
    }
}