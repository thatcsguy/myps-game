import { GameState } from "../../gamestate"
import { Chariot } from "../../mechanic/chariot"
import { Puddle } from "../../mechanic/puddle"
import { Spread } from "../../mechanic/spread"
import { Tower } from "../../mechanic/tower"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { Phase } from "../phase"

export class PuddlesIntoTower extends Phase {

    phaseDuration = 14000

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        const chariotR = 150
        const puddleCount = 7
        const puddleTimeGap = 1500
        const initialMoveTime = 3000

        let puddlePlayer = gameState.randomPlayer()

        let bigChariot = new Chariot(200, 200, 350)
        this.schedule(bigChariot, 0, initialMoveTime)

        let status = new Status(StatusType.DROPPING_PUDDLES)
        status.stacks = puddleCount
        status.schedule(this.getPhaseStart(), this.phaseDuration)
        gameState.players.get(puddlePlayer).statuses.push(status)

        for (let i = 0; i < puddleCount; i++) {
            let chariot = new Chariot(0, 0, chariotR)
            this.schedule(chariot, initialMoveTime + puddleTimeGap * i, initialMoveTime + puddleTimeGap * (i + 1))
            chariot.spawnOnPlayer(puddlePlayer)
            chariot.onVisible(() => {
                status.stacks--
            })

            let puddleStart = initialMoveTime + puddleTimeGap * (i + 1)
            let puddleDuration = (puddleCount - i) * puddleTimeGap
            chariot.onComplete((gameState: GameState, mech: Chariot) => {
                let puddle = new Puddle(mech.x, mech.y, chariotR)
                this.schedule(puddle, puddleStart, puddleStart + puddleDuration)
            })
        }

        let tower = new Tower(200, 200, 150, gameState.players.size)
        this.schedule(tower, initialMoveTime, this.phaseDuration)

        let spreadPlayers = gameState.randomPlayers(2)
        for (let p of spreadPlayers) {
            let spread = new Spread(200)
            spread.applyToTarget(p)
            this.schedule(spread, initialMoveTime, this.phaseDuration)
        }
    }

}