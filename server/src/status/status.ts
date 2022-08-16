import { Player } from "../player"
import { GameState } from "../gamestate"
import { StatusType } from "./statusType"

export class Status {

    type: StatusType

    start: number
    duration: number

    stacks: number

    constructor(type: StatusType) {
        this.type = type
    }

    schedule(start: number, duration: number) {
        this.start = start
        this.duration = duration
    }

    process(gameState: GameState, player: Player, index: number): void {
        if (gameState.now - this.start >= this.duration) {
            player.statuses.splice(index, 1)
        }
    }
}