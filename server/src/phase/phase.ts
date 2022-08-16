import { GameState } from "../gamestate"
import { Mechanic } from "../mechanic/mechanic"

export class Phase {

    private phaseStart: number
    protected gameState: GameState

    phaseDuration: number

    init(gameState: GameState, phaseStart: number): void {
        this.gameState = gameState
        this.phaseStart = phaseStart
    }

    process(phaseTime: number): void {
        // optional method
    }

    schedule(mech: Mechanic, start: number, end: number): void {
        this.gameState.schedule(mech, this.phaseStart + start, end - start)
    }

    scheduleNow(mech: Mechanic, duration: number): void {
        this.gameState.schedule(mech, this.gameState.now, duration)
    }

    getPhaseStart(): number {
        return this.phaseStart
    }
}