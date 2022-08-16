import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Spread extends Mechanic {

    id: MechanicId = MechanicId.SPREAD

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
            for (let [p, player] of gameState.players) {
                if (p == this.target) {
                    continue
                }
                if (distance(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                    gameState.messages.push(player.name + ' died to failed spread')
                }
            }
            gameState.cleanupMechanic(index)
        }
    }
}