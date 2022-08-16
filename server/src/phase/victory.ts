import { GameState } from "../gamestate"
import { Phase } from "./phase"

export class Victory extends Phase {

    phaseDuration = 2000

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)
        gameState.messages.push('poggers dude')
    }

}