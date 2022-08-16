import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Stack extends Mechanic {

    id: MechanicId = MechanicId.STACK

    target: string
    requiredPlayers: number

    r: number

    constructor(requiredPlayers: number, r: number) {
        super()
        this.requiredPlayers = requiredPlayers
        this.r = r
    }

    applyToTarget(player: string): void {
        this.target = player
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        let targetPlayer = gameState.players.get(this.target)

        if (gameState.now >= this.start + this.duration) {
            let soakers = []
            for (let [, player] of gameState.players) {
                if (distance(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                    soakers.push(player)
                }
            }
            if (soakers.length < this.requiredPlayers) {
                for (let p of soakers) {
                    gameState.messages.push(p.name + ' died to failed stack')
                }
            }
            gameState.cleanupMechanic(index)
        }
    }

    soakers(gameState: GameState): string[] {
        let soakers = []
        let targetPlayer = gameState.players.get(this.target)

        for (let [p, player] of gameState.players) {
            if (distance(player.x, player.y, targetPlayer.x, targetPlayer.y) < this.r) {
                soakers.push(p)
            }
        }
        return soakers
    }
}