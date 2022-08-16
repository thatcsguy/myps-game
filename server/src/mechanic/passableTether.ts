import { GameState } from "../gamestate"
import { isPointWithinLineHitbox } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class PassableTether extends Mechanic {

    id: MechanicId = MechanicId.PASSABLE_TETHER

    x: number
    y: number
    target: string

    constructor(x: number, y: number) {
        super()
        this.x = x
        this.y = y
    }

    applyToTarget(target: string) {
        this.target = target
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
            return
        }

        let targetPlayer = gameState.players.get(this.target)
        if (!targetPlayer) {
            gameState.cleanupMechanic(index)
            return
        }

        let playersWithTethers = []
        for (let mech of gameState.mechanics) {
            if (mech instanceof PassableTether) {
                if (mech.target) {
                    playersWithTethers.push(mech.target)
                }
            }
        }

        for (let [p, player] of gameState.players) {
            if (playersWithTethers.includes(p)) {
                continue
            }

            if (isPointWithinLineHitbox(player.x, player.y, this.x, this.y, targetPlayer.x, targetPlayer.y, player.speed / 60)) {
                this.target = p
            }
        }
    }
}