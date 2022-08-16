import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Conal } from "../../mechanic/conal"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Dynamo } from "../../mechanic/dynamo"
import { LineAOE } from "../../mechanic/lineAOE"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Spread } from "../../mechanic/spread"
import { angleBetween } from "../../utils"
import { Phase } from "../phase"

export class LightningStorm extends Phase {

    phaseDuration = 10000
    lastPhaseProcessTime = 0

    thrustCastStart = 0
    thrustCastEnd = 5000

    lineStart = 5000
    lineEnd = 5700

    spreadStart = this.lineStart
    spreadEnd = this.lineEnd

    quakeStart = this.lineEnd
    quakeGap = 1000

    mercyCastStart = this.quakeStart + this.quakeGap * 1.5
    mercyCastEnd = this.mercyCastStart + 2000

    proteanSnapshot = this.mercyCastEnd
    proteanStart = this.proteanSnapshot + 700
    proteanEnd = this.proteanStart + 300

    private quakeMarker: Marker

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let rand = (Math.random() * 4 << 0)
        for (let i = 0; i < 4; i++) {
            if (i == rand) {
                continue
            }
            let angle = (Math.random() < .5) ? i * Math.PI / 4 : (i + 4) * Math.PI / 4
            let marker = new Marker(
                400 + 400 * Math.cos(angle),
                400 + 400 * Math.sin(angle),
                0)
            marker.dp = DrawPriority.UNDER_PLAYER
            marker.img = MarkerImg.THORDAN
            this.schedule(marker, 0, this.lineEnd)

            let line = new LineAOE(marker.x, marker.y,
                400 + 450 * Math.cos(angle + Math.PI),
                400 + 450 * Math.sin(angle + Math.PI),
                300)
            this.schedule(line, this.lineStart, this.lineEnd)
        }

        rand = (Math.random() * 8 << 0)
        this.quakeMarker = new Marker(
            400 + 100 * Math.cos(rand * Math.PI / 4),
            400 + 100 * Math.sin(rand * Math.PI / 4),
            0)
        this.quakeMarker.dp = DrawPriority.UNDER_PLAYER
        this.quakeMarker.img = MarkerImg.THORDAN
        this.schedule(this.quakeMarker, 0, this.quakeStart)

        let castbar = new Castbar("Spiral Thrust", 400, 200)
        this.schedule(castbar, this.thrustCastStart, this.thrustCastEnd)
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.spreadStart && this.spreadStart <= phaseTime) {
            for (let [p,] of this.gameState.players) {
                let spread = new Spread(90)
                spread.applyToTarget(p)
                this.schedule(spread, this.spreadStart, this.spreadEnd)
            }
        }

        if (this.lastPhaseProcessTime < this.quakeStart && this.quakeStart <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                let dynamo = new Dynamo(this.quakeMarker.x, this.quakeMarker.y, 130 * i, 130 * i + 130)
                this.schedule(dynamo, this.quakeStart + this.quakeGap * i, this.quakeStart + this.quakeGap * (i + 1))
            }
        }

        if (this.lastPhaseProcessTime < this.mercyCastStart && this.mercyCastStart <= phaseTime) {
            let castbar = new Castbar("Mercy Concealed", 400, 200)
            this.schedule(castbar, this.mercyCastStart, this.mercyCastEnd)

            let marker = new Marker(400, 400, 0)
            marker.dp = DrawPriority.UNDER_PLAYER
            marker.img = MarkerImg.THORDAN
            this.schedule(marker, this.mercyCastStart, this.phaseDuration)
        }

        if (this.lastPhaseProcessTime < this.proteanSnapshot && this.proteanSnapshot <= phaseTime) {
            for (let [, player] of this.gameState.players) {
                let conal = new Conal(400, 400, 400, angleBetween(400, 400, player.x, player.y), Math.PI / 16)
                this.schedule(conal, this.proteanStart, this.proteanEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}