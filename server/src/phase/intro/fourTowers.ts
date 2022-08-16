import { GameState } from "../../gamestate"
import { Tower } from "../../mechanic/tower"
import { Phase } from "../phase"

export class FourTowers extends Phase {

    phaseDuration = 3500

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let counts = [0, 0, 0, 0]
        for (let i = 0; i < gameState.players.size; i++) {
            counts[Math.random() * 4 << 0]++
        }
        for (let i = 0; i < 4; i++) {
            let tower = new Tower((i % 2 == 0) ? 800 / 3 : 1600 / 3, i < 2 ? 800 / 3 : 1600 / 3, 100, counts[i])
            this.schedule(tower, 0, 3500)
        }
    }
}