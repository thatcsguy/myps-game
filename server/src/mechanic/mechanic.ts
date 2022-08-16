import { GameState } from "../gamestate"
import { DrawPriority } from "./drawPriority"

export abstract class Mechanic {

    id: MechanicId

    start: number
    duration: number

    dp: DrawPriority = DrawPriority.GROUND

    visibleFunction: (gameState: GameState, mech: Mechanic) => void
    visibleFunctionRan: boolean

    completeFunction: (gameState: GameState, mech: Mechanic) => void

    process(gameState: GameState, index: number): void {
        if (gameState.now >= this.start && this.visibleFunction && !this.visibleFunctionRan) {
            this.visibleFunction(gameState, this)
            this.visibleFunctionRan = true
        }
    }

    onVisible(fn: (gameState: GameState, mech: Mechanic) => void) {
        this.visibleFunction = fn
    }

    onComplete(fn: (gameState: GameState, mech: Mechanic) => void) {
        this.completeFunction = fn
    }
}

export enum MechanicId {
    ANIMATION = 0,
    CASTBAR = 1,
    CHAIN = 2,
    CHARIOT = 3,
    CONAL = 4,
    DOOM_CIRCLE = 5,
    DYNAMO = 6,
    HOMING_ORB = 7,
    KNOCKBACK = 8,
    LINE_AOE = 9,
    MARKER = 10,
    PASSABLE_TETHER = 11,
    PINAX_SQUARE = 12,
    PUDDLE = 13,
    SPREAD = 14,
    STACK = 15,
    POINT_TETHER = 16,
    TOWER = 17,
    TWISTER = 18,
}