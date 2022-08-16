import { Dynamo } from "../../mechanic/dynamo"
import { Knockback } from "../../mechanic/knockback"
import { Spread } from "../../mechanic/spread"
import { GameState } from "../../gamestate"
import { Phase } from "../phase"

export class BlastSpread extends Phase {

    phaseDuration = 5000

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let dynamo = new Dynamo(400, 400, 100, 566)
        this.schedule(dynamo, 0, 3700)

        let kb = new Knockback(400, 400, 300, 200)
        this.schedule(kb, 0, 4000)

        let spreadRadius = gameState.players.size <= 4 ? 370 : 200

        for (let [p,] of gameState.players) {
            let spread = new Spread(spreadRadius)
            spread.applyToTarget(p)
            this.schedule(spread, 1000, 5000)
        }
    }
}