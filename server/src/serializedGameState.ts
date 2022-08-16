import { ArenaId } from "./data/arenaId"
import { GameState } from "./gamestate"
import { Mechanic } from "./mechanic/mechanic"
import { Player } from "./player"
import { ReadyCheck } from "./readycheck"

export class SerializedGameState {
    now: number
    pl: Map<string, Player>
    mc: Mechanic[]
    ms: string[]

    ar: ArenaId
    dw: boolean

    rc: ReadyCheck

    constructor(gameState: GameState) {
        this.now = gameState.now

        this.pl = new Map<string, Player>()
        for (let [p, player] of gameState.players) {
            this.pl.set(p, player)
        }

        this.mc = []
        for (let mech of gameState.mechanics) {
            if (this.now >= mech.start) {
                this.mc.push(mech)
            }
        }

        this.ms = gameState.messages

        this.ar = gameState.arenaId
        this.dw = gameState.wallsAreDeath()

        this.rc = gameState.readycheck
    }

    serialize() {
        let filteredGameState = JSON.parse(JSON.stringify(this))
        filteredGameState.pl = Object.fromEntries(this.pl)
        return filteredGameState
    }
}