import { GameState } from "../gamestate"
import { DrawPriority } from "./drawPriority"
import { Mechanic, MechanicId } from "./mechanic"

export class Animation extends Mechanic {

    id: MechanicId = MechanicId.ANIMATION

    key: AnimationKey
    options: any

    constructor(key: AnimationKey, drawPriority: DrawPriority, options?: any) {
        super()
        this.key = key
        this.dp = drawPriority
        this.options = options
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.cleanupMechanic(index)
        }
    }
}

export enum AnimationKey {
    SETTING_THE_SCENE = 0,
    ROTATION_MARKER = 1
}