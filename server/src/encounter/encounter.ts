import { ArenaId } from "../data/arenaId"
import { GameState } from "../gamestate"
import { Phase } from "../phase/phase"
import { EncounterScriptEntry } from "./encounterScriptEntry"

export class Encounter {

    protected script: Array<EncounterScriptEntry>

    private activePhase: Phase

    private currentIndex = 0
    private previousPhaseStart = 0
    private previousPhaseDuration = 0

    arenaId: ArenaId
    deathWalls: boolean = false

    process(gameState: GameState): void {
        if (this.activePhase) {
            this.activePhase.process(gameState.now - this.activePhase.getPhaseStart())
        }

        if (this.currentIndex >= this.script.length
            || gameState.now - this.script[this.currentIndex].restTime <= this.previousPhaseStart + this.previousPhaseDuration) {
            return
        }

        this.previousPhaseStart += this.previousPhaseDuration + this.script[this.currentIndex].restTime
        this.activePhase = this.script[this.currentIndex].phase
        this.activePhase.init(gameState, this.previousPhaseStart)
        this.previousPhaseDuration = this.activePhase.phaseDuration
        this.currentIndex++
    }

    reset(): void {
        this.currentIndex = 0
        this.previousPhaseStart = 0
        this.previousPhaseDuration = 0
    }
}