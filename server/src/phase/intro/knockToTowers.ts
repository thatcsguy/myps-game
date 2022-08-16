import { GameState } from "../../gamestate"
import { Dynamo } from "../../mechanic/dynamo"
import { Knockback } from "../../mechanic/knockback"
import { Tower } from "../../mechanic/tower"
import { shuffle } from "../../utils"
import { Phase } from "../phase"

export class KnockToTowers extends Phase {

    phaseDuration = 3900

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let kbChoices = shuffle([
            [400, 50],
            [400, 750],
            [50, 400],
            [750, 400]
        ])
        let choice = kbChoices.pop()
        let kb = new Knockback(choice[0], choice[1], 700, 300)
        this.schedule(kb, 0, 2800)

        let dyn = new Dynamo(choice[0], choice[1], 200, 1000)
        this.schedule(dyn, 0, 2400)

        let towerChoices = shuffle([
            [100, 100],
            [100, 700],
            [700, 100],
            [700, 700]
        ])
        for (let i = 0; i < gameState.players.size; i++) {
            let choice = towerChoices.pop()
            let tower = new Tower(choice[0], choice[1], 50, 1)
            this.schedule(tower, 1300, 3900)
        }
    }
}