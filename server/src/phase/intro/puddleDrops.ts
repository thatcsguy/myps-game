import { GameState } from "../../gamestate"
import { Chariot } from "../../mechanic/chariot"
import { Puddle } from "../../mechanic/puddle"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { Phase } from "../phase"

export class PuddleDrops extends Phase {

    initialMoveTime: number = 2000

    phaseDuration: number

    puddleCount: number

    constructor(puddleCount: number) {
        super()
        this.puddleCount = puddleCount
        this.phaseDuration = this.initialMoveTime + puddleCount * 1500 + 1000
    }

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        const gapTime = 1500

        let puddleRadius = gameState.players.size <= 4 ? 120 : 60

        for (let [p, player] of gameState.players) {
            let status = new Status(StatusType.DROPPING_PUDDLES)
            status.stacks = this.puddleCount
            status.schedule(this.getPhaseStart(), this.phaseDuration)
            player.statuses.push(status)

            for (let i = 0; i < this.puddleCount; i++) {
                let chariot = new Chariot(0, 0, puddleRadius)
                this.schedule(chariot, this.initialMoveTime + gapTime * i, this.initialMoveTime + gapTime * (i + 1))
                chariot.spawnOnPlayer(p)
                chariot.onVisible(() => {
                    status.stacks--
                })

                let puddleStart = this.initialMoveTime + gapTime * (i + 1)
                let puddleDuration = gapTime * (this.puddleCount - i)

                chariot.onComplete((gameState: GameState, mech: Chariot) => {
                    let puddle = new Puddle(mech.x, mech.y, puddleRadius)
                    this.schedule(puddle, puddleStart, puddleStart + puddleDuration)
                })
            }
        }
    }
}