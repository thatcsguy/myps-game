import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Dynamo } from "../../mechanic/dynamo"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Puddle } from "../../mechanic/puddle"
import { Spread } from "../../mechanic/spread"
import { Tower } from "../../mechanic/tower"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { Phase } from "../phase"

export class P4Finale extends Phase {

    phaseDuration = 30000
    lastPhaseProcessTime = 0

    finaleCastStart = 0
    finaleCastEnd = 4000

    fakeStart = 1000
    fakeEnd = this.finaleCastEnd + 1000

    dynamoThornStart = this.finaleCastEnd + 2000
    dynamoThornEnd = this.dynamoThornStart + 2000

    dynamoStart = this.dynamoThornEnd
    dynamoEnd = this.dynamoStart + 2000

    firstSpreadStart = this.dynamoEnd
    gapTime = 700
    firstShieldStart = this.firstSpreadStart + this.gapTime

    wreathCastStart = this.firstSpreadStart + 10 * this.gapTime

    firstThornStart = this.wreathCastStart + 1000

    wreathCastEnd = this.firstThornStart + this.gapTime * 7 + 500

    firstTowerStart = this.wreathCastEnd + 1000

    soakOrder: string[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.soakOrder = /*[
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
            this.gameState.randomPlayer(),
        ]*/ this.gameState.randomPlayers(8)

        let castbar = new Castbar("Finale", 400, 400)
        this.schedule(castbar, this.finaleCastStart, this.finaleCastEnd)

        for (let i = 0; i < 8; i++) {
            let angle = i * Math.PI / 4
            let x = 400 + 250 * Math.cos(angle)
            let y = 400 + 250 * Math.sin(angle)
            let tower = new Tower(x, y, 50, 1)
            this.schedule(tower, this.fakeStart, this.fakeEnd)
        }

        let dynamoThorn1 = new Marker(650, 650, 20)
        dynamoThorn1.dp = DrawPriority.OVER_PLAYER
        dynamoThorn1.img = MarkerImg.THORN
        this.schedule(dynamoThorn1, this.dynamoThornStart, this.dynamoThornEnd)
        let dynamoThorn2 = new Marker(150, 150, 20)
        dynamoThorn2.dp = DrawPriority.OVER_PLAYER
        dynamoThorn2.img = MarkerImg.THORN
        this.schedule(dynamoThorn2, this.dynamoThornStart, this.dynamoThornEnd)

        let dynamo1 = new Dynamo(dynamoThorn1.x, dynamoThorn1.y, 180, 520)
        let dynamo2 = new Dynamo(dynamoThorn2.x, dynamoThorn2.y, 180, 520)
        this.schedule(dynamo1, this.fakeStart, this.fakeEnd)
        this.schedule(dynamo2, this.fakeStart, this.fakeEnd)
    }

    process(phaseTime: number): void {

        // remove the fake mechanics
        if (this.lastPhaseProcessTime < this.finaleCastEnd && this.finaleCastEnd <= phaseTime) {
            this.gameState.mechanics = this.gameState.mechanics.filter((mech) => {
                return !(mech instanceof Tower || mech instanceof Dynamo)
            })
        }

        if (this.lastPhaseProcessTime < this.dynamoStart && this.dynamoStart <= phaseTime) {
            let dynamo1 = new Dynamo(650, 650, 180, 520)
            let dynamo2 = new Dynamo(150, 150, 180, 520)
            this.schedule(dynamo1, this.dynamoStart, this.dynamoEnd)
            this.schedule(dynamo2, this.dynamoStart, this.dynamoEnd)
        }

        if (this.lastPhaseProcessTime < this.firstSpreadStart && this.firstSpreadStart <= phaseTime) {
            for (let i = 0; i < 8; i++) {
                let spread = new Spread(100)
                spread.applyToTarget(this.soakOrder[i])
                spread.onComplete(() => {
                    let status = new Status(StatusType.PURPLE_SHIELD)
                    status.schedule(this.getPhaseStart() + this.firstShieldStart + i * this.gapTime,
                        this.firstTowerStart + this.gapTime - this.firstShieldStart + 300)
                    this.gameState.players.get(this.soakOrder[i]).statuses.push(status)
                })
                this.schedule(spread,
                    this.firstSpreadStart + i * this.gapTime,
                    this.firstSpreadStart + (i + 1) * this.gapTime)
            }
        }

        if (this.lastPhaseProcessTime < this.wreathCastStart && this.wreathCastStart <= phaseTime) {
            let castbar = new Castbar("Wreath of Thorns", 400, 400)
            this.schedule(castbar, this.wreathCastStart, this.wreathCastEnd)
        }

        if (this.lastPhaseProcessTime < this.firstThornStart && this.firstThornStart <= phaseTime) {
            let offsetAngle = (Math.random() * 8 << 0) * Math.PI / 4
            for (let i = 0; i < 8; i++) {
                let thorn = new Marker(
                    400 + 200 * Math.cos(i * Math.PI / 4 + offsetAngle),
                    400 + 200 * Math.sin(i * Math.PI / 4 + offsetAngle),
                    20)
                thorn.dp = DrawPriority.OVER_PLAYER
                thorn.img = MarkerImg.THORN
                this.schedule(thorn,
                    this.firstThornStart + this.gapTime * i,
                    this.firstTowerStart + this.gapTime * i)

                let tower = new Tower(thorn.x, thorn.y, 50, 1)
                let puddle = new Puddle(thorn.x, thorn.y, 50)
                this.schedule(tower,
                    this.firstTowerStart + this.gapTime * i,
                    this.firstTowerStart + this.gapTime * (i + 1))
                this.schedule(puddle,
                    this.firstTowerStart + this.gapTime * i,
                    this.firstTowerStart + this.gapTime * (i + 1))
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}