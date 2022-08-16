import { GameState } from "../gamestate"
import { DrawPriority } from "./drawPriority"
import { Mechanic, MechanicId } from "./mechanic"

export class PinaxSquare extends Mechanic {

    id: MechanicId = MechanicId.PINAX_SQUARE

    x: number
    y: number
    width: number
    height: number
    element: PinaxSquare.Element

    active: boolean = false
    activeStart: number

    constructor(element: PinaxSquare.Element, x: number, y: number, width: number, height: number) {
        super()
        this.element = element
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.dp = DrawPriority.BACKGROUND
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }
    }
}

export namespace PinaxSquare {
    export enum Element {
        FIRE = "FIRE",
        LIGHTNING = "LIGHTNING",
        POISON = "POISON",
        WATER = "WATER",
    }
}