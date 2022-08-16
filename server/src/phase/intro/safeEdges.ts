import { GameState } from "../../gamestate"
import { Chariot } from "../../mechanic/chariot"
import { Spread } from "../../mechanic/spread"
import { Phase } from "../phase"

export class SafeEdges extends Phase {

    phaseDuration = 6500

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        const coords = [
            [400, 400],
            [0, 0],
            [800, 0],
            [0, 800],
            [800, 800]
        ]
        for (let i = 0; i < coords.length; i++) {
            let chariot = new Chariot(coords[i][0], coords[i][1], 300)
            this.schedule(chariot, 0, 6500)
        }

        let choices = [
            [400, 0],
            [0, 400],
            [800, 400],
            [400, 800]
        ]
        let rand = Math.random() * 4 << 0
        let chariot = new Chariot(choices[rand][0], choices[rand][1], 300)
        this.schedule(chariot, 2000, 6500)

        let shuffled = gameState.randomPlayers(2)
        for (let i = 0; i < 2 && i < shuffled.length; i++) {
            let spread = new Spread(300)
            spread.applyToTarget(shuffled[i])
            this.schedule(spread, 2000, 6500)
        }
    }
}