import { GameState } from "../../gamestate"
import { Animation, AnimationKey } from "../../mechanic/animation"
import { Conal } from "../../mechanic/conal"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Marker } from "../../mechanic/marker"
import { Phase } from "../phase"

export class StatueBaits extends Phase {

    lastPhaseProcessTime = 0

    phaseDuration = 8000

    statues: Array<Marker>
    conalDirections: number[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.statues = []
        this.conalDirections = []

        for (let i = 0; i < 4; i++) {
            let marker = new Marker((i % 2 + 1) * 800 / 3, ((i / 2 << 0) + 1) * 800 / 3, 20)
            this.schedule(marker, 0, this.phaseDuration)
            this.statues.push(marker)

            let ccw = Math.random() < .5
            this.conalDirections.push(ccw ? 1 : -1)

            let animation = new Animation(
                AnimationKey.ROTATION_MARKER,
                DrawPriority.OVER_PLAYER,
                { x: marker.x, y: marker.y, r: 30, ccw: ccw })
            this.schedule(animation, 0, this.phaseDuration)
        }
    }

    process(phaseTime: number): void {

        let baitTime = 3500
        let firstConalDuration = 1500

        let fastConalStarts = [5000, 5500, 6000, 6500, 7000, 7500]
        let fastConalDuration = 500

        if (this.lastPhaseProcessTime < baitTime && baitTime <= phaseTime) {
            for (let s = 0; s < this.statues.length; s++) {
                let player = this.gameState.players.get(this.gameState.closestPlayer(this.statues[s].x, this.statues[s].y))
                let angle = Math.atan2(player.y - this.statues[s].y, player.x - this.statues[s].x)

                let conal = new Conal(this.statues[s].x, this.statues[s].y, 700,
                    angle,
                    Math.PI / 4)
                this.schedule(conal, baitTime, baitTime + firstConalDuration)

                for (let i = 0; i < fastConalStarts.length; i++) {
                    let fastConal = new Conal(this.statues[s].x, this.statues[s].y, 700,
                        angle - this.conalDirections[s] * (i + 1) * Math.PI / 4,
                        Math.PI / 4)
                    this.schedule(fastConal, fastConalStarts[i], fastConalStarts[i] + fastConalDuration)
                }
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}