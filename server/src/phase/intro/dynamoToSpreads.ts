import { GameState } from "../../gamestate"
import { Dynamo } from "../../mechanic/dynamo"
import { Spread } from "../../mechanic/spread"
import { Phase } from "../phase"

export class DynamoToSpreads extends Phase {

    phaseDuration = 5000

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let dynamo = new Dynamo(400, 400, 100, 566)
        this.schedule(dynamo, 0, 3000)

        let spreadRadius = gameState.players.size <= 4 ? 370 : 200

        for (let [p,] of gameState.players) {
            let spread = new Spread(spreadRadius)
            spread.applyToTarget(p)
            this.schedule(spread, 2200, 5000)
        }
    }
}