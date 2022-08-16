import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Conal extends Mechanic {

    id: MechanicId = MechanicId.CONAL

    x: number
    y: number
    r: number
    direction: number
    width: number

    constructor(x: number, y: number, r: number, direction: number, width: number) {
        super()
        this.x = x
        this.y = y
        this.r = r
        this.direction = direction
        this.width = width
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (this.start + this.duration <= gameState.now) {
            for (let [, player] of gameState.players) {
                if (distance(player.x, player.y, this.x, this.y) < this.r) {

                    let angle = Math.atan2(player.y - this.y, player.x - this.x)
                    if (angle < 0) {
                        angle += 2 * Math.PI
                    }
                    if (Math.abs(this.direction - angle) < this.width / 2 ||
                        Math.abs(Math.max(this.direction, angle) - 2 * Math.PI -
                            Math.min(this.direction, angle)) < this.width / 2) {
                        gameState.messages.push(player.name + ' died to conal')
                    }
                }
            }
            gameState.cleanupMechanic(index)
        }
    }
}