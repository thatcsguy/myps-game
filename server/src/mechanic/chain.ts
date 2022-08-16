import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class Chain extends Mechanic {

    id: MechanicId = MechanicId.CHAIN

    target1: string
    target2: string

    breakLength: number
    removeOnBreak: boolean

    killOnEnd: boolean = true
    safe: boolean = false

    // opt.c = color of tether (default red)
    // opt.s = whether to show stretch lines (default true)
    opt: any

    constructor(breakLength: number, removeOnBreak: boolean, opt?: any) {
        super()
        this.breakLength = breakLength
        this.removeOnBreak = removeOnBreak

        this.opt = opt
    }

    applyToTargets(target1: string, target2: string): void {
        this.target1 = target1
        this.target2 = target2
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        this.safe = this.isSafe(gameState)

        let player1 = gameState.players.get(this.target1)
        let player2 = gameState.players.get(this.target2)
        if (!player1 || !player2) {
            gameState.cleanupMechanic(index)
            return
        }

        if (this.removeOnBreak && this.safe) {
            gameState.cleanupMechanic(index)
            return
        }

        if (gameState.now >= this.start + this.duration) {
            if (!this.safe && this.killOnEnd) {
                gameState.messages.push(player1.name + ' and ' + player2.name + ' failed to break chain')
            }
            gameState.cleanupMechanic(index)
        }
    }

    isSafe(gameState: GameState) {
        if (!this.target1 || !this.target2) {
            return false
        }
        let player1 = gameState.players.get(this.target1)
        let player2 = gameState.players.get(this.target2)
        let dist = distance(player1.x, player1.y, player2.x, player2.y)
        return dist > this.breakLength
    }
}