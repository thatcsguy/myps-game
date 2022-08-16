import { GameState } from "../gamestate"
import { isPointWithinLineHitbox } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class LineAOE extends Mechanic {

    id: MechanicId = MechanicId.LINE_AOE

    startX: number
    startY: number
    endX: number
    endY: number
    width: number

    constructor(startX: number, startY: number, endX: number, endY: number, width: number) {
        super()
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
        this.width = width
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            for (let [, player] of gameState.players) {
                if (isPointWithinLineHitbox(player.x, player.y, this.startX, this.startY, this.endX, this.endY, this.width / 2)) {
                    gameState.messages.push(player.name + ' died to AOE')
                }
            }
            gameState.cleanupMechanic(index)
        }
    }
}