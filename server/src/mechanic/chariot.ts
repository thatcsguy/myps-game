import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Chariot extends Mechanic {

    id: MechanicId = MechanicId.CHARIOT

    x: number
    y: number
    r: number

    preventDeath: boolean

    private playerTarget: string
    private baitComplete: boolean = false

    constructor(x: number, y: number, r: number, preventDeath?: boolean) {
        super()
        this.x = x
        this.y = y
        this.r = r

        this.preventDeath = preventDeath || false
    }

    spawnOnPlayer(player: string): void {
        this.playerTarget = player
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (this.playerTarget && !this.baitComplete && gameState.now >= this.start) {
            let player = gameState.players.get(this.playerTarget)
            this.x = player.x
            this.y = player.y
            this.baitComplete = true
        }

        if (gameState.now >= this.start + this.duration) {
            if (!this.preventDeath) {
                for (let [, player] of gameState.players) {
                    let dist = distance(player.x, player.y, this.x, this.y)
                    if (dist < this.r) {
                        gameState.messages.push(player.name + ' died to AOE')
                    }
                }
            }
            gameState.cleanupMechanic(index)
        }
    }
}