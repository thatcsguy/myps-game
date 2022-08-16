import { GameState } from "../../gamestate"
import { GLOBALS } from "../../globals"
import { Chariot } from "../../mechanic/chariot"
import { shuffle } from "../../utils"
import { Phase } from "../phase"

export class NineChariots extends Phase {

    phaseDuration = 7400

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        const timeBetween = 300
        const chariotR = GLOBALS.arenaWidth / 4
        const interval = (GLOBALS.arenaWidth / 2) / Math.sqrt(2)

        let coords = shuffle([
            [400 - interval, 400 - interval],
            [400, 400 - interval],
            [400 + interval, 400 - interval],
            [400 - interval, 400],
            [400, 400],
            [400 + interval, 400],
            [400 - interval, 400 + interval],
            [400, 400 + interval],
            [400 + interval, 400 + interval],
        ])

        for (let i = 0; i < coords.length; i++) {
            let chariot = new Chariot(coords[i][0], coords[i][1], chariotR)
            this.schedule(chariot, timeBetween * i, timeBetween * i + 5000)
        }
    }
}