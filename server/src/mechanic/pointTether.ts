import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class PointTether extends Mechanic {

    id: MechanicId = MechanicId.POINT_TETHER

    x: number
    y: number
    target: string

    len: number
    removeOnStretch: boolean

    // opt.s = whether to show stretch lines (default true)
    opt: any

    private stretchFn: (gameState: GameState, mech: Mechanic) => void

    constructor(x: number, y: number, len: number, removeOnStretch: boolean, opt?: any) {
        super()
        this.x = x
        this.y = y
        this.len = len
        this.removeOnStretch = removeOnStretch

        this.opt = opt
    }

    applyToTarget(target: string): void {
        this.target = target
    }

    onStretch(fn: (gameState: GameState, mech: Mechanic) => void) {
        this.stretchFn = fn
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        let player = gameState.players.get(this.target)
        if (!player) {
            gameState.cleanupMechanic(index)
            return
        }

        let stretched = distance(player.x, player.y, this.x, this.y) >= this.len
        if (stretched) {
            if (this.stretchFn) {
                this.stretchFn(gameState, this)
            }

            if (this.removeOnStretch) {
                gameState.cleanupMechanic(index)
                return
            }
        }

        if (gameState.now >= this.start + this.duration) {
            if (!stretched) {
                gameState.messages.push(player.name + ' failed to stretch tether')
            }
            gameState.cleanupMechanic(index)
        }
    }
}