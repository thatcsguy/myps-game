import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Conal } from "../../mechanic/conal"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { angleBetween } from "../../utils"
import { Phase } from "../phase"

export class Proteans extends Phase {

    phaseDuration = 4000
    lastPhaseProcessTime = 0

    castStart = 0
    castEnd = 3000

    proteanSnapshot = this.castEnd
    proteanStart = this.proteanSnapshot + 700
    proteanEnd = this.proteanStart + 300


    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let marker = new Marker(400, 400, 0)
        marker.dp = DrawPriority.UNDER_PLAYER
        marker.img = MarkerImg.THORDAN
        this.schedule(marker, 0, this.phaseDuration)

        let castbar = new Castbar("Mercy Concealed", 400, 200)
        this.schedule(castbar, this.castStart, this.castEnd)
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.proteanSnapshot && this.proteanSnapshot <= phaseTime) {
            for (let [, player] of this.gameState.players) {
                let conal = new Conal(400, 400, 400, angleBetween(400, 400, player.x, player.y), Math.PI / 16)
                this.schedule(conal, this.proteanStart, this.proteanEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}