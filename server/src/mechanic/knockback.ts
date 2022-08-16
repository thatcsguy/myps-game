import { GameState } from "../gamestate"
import { GLOBALS } from "../globals"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Knockback extends Mechanic {

    id: MechanicId = MechanicId.KNOCKBACK

    x: number
    y: number

    knockDistance: number
    knockDuration: number

    private knockEnds: Map<string, Array<number>>

    constructor(x: number, y: number, knockDistance: number, knockDuration: number) {
        super()
        this.x = x
        this.y = y
        this.knockDistance = knockDistance
        this.knockDuration = knockDuration

        this.knockEnds = new Map<string, Array<number>>()
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (this.start + this.duration <= gameState.now) {
            gameState.cleanupMechanic(index)
            return
        }

        let knockStart = this.start + this.duration - this.knockDuration

        if (this.start + this.duration - this.knockDuration <= gameState.now) {
            let kbProgress = (gameState.now - knockStart) / this.knockDuration

            for (let [p, player] of gameState.players) {
                if (!this.knockEnds.has(p)) {
                    let d = distance(player.x, player.y, this.x, this.y)
                    let ratio = this.knockDistance / d
                    let dx = (player.x - this.x) * ratio
                    let dy = (player.y - this.y) * ratio
                    this.knockEnds.set(p, [player.x, player.y, player.x + dx, player.y + dy])
                }

                let [startX, startY, endX, endY] = this.knockEnds.get(p)

                player.x = startX + (endX - startX) * kbProgress
                player.y = startY + (endY - startY) * kbProgress

                player.fixPosition(gameState)
            }
        }
    }
}