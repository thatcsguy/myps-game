import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Chariot } from "../../mechanic/chariot"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Spread } from "../../mechanic/spread"
import { PointTether } from "../../mechanic/pointTether"
import { Tower } from "../../mechanic/tower"
import { Phase } from "../phase"

export class P4Act4 extends Phase {

    phaseDuration = 30000
    lastPhaseProcessTime = 0

    act4CastStart = 0
    act4CastEnd = 4000

    fakeStart = 1000
    fakeEnd = this.act4CastEnd + 1000

    wreathCastStart = 6000
    wreathCastEnd = 9000

    thornStart = 7500
    thornEnd = this.phaseDuration

    tetherStart = 9000
    tetherEnd = this.phaseDuration

    chariots: Chariot[]
    towers: Tower[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.chariots = []
        this.towers = []

        let castbar = new Castbar("Act 4", 400, 400)
        this.schedule(castbar, this.act4CastStart, this.act4CastEnd)

        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2
            let x = 400 + 350 * Math.cos(angle)
            let y = 400 + 350 * Math.sin(angle)
            let chariot = new Chariot(x, y, 550)
            this.schedule(chariot, this.fakeStart, this.fakeEnd)
            this.chariots.push(chariot)
        }

        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2 + Math.PI / 4
            let x = 400 + 350 * Math.cos(angle)
            let y = 400 + 350 * Math.sin(angle)
            let tower = new Tower(x, y, 50, 1)
            this.schedule(tower, this.fakeStart, this.fakeEnd)
            this.towers.push(tower)
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.act4CastEnd && this.act4CastEnd <= phaseTime) {
            this.gameState.mechanics = []
        }

        if (this.lastPhaseProcessTime < this.wreathCastStart && this.wreathCastStart <= phaseTime) {
            let castbar = new Castbar("Wreath of Thorns", 400, 400)
            this.schedule(castbar, this.wreathCastStart, this.wreathCastEnd)
        }

        if (this.lastPhaseProcessTime < this.thornStart && this.thornStart <= phaseTime) {

            let players = this.gameState.randomPlayers(8)

            for (let i = 0; i < 4; i++) {
                let marker = new Marker(this.towers[i].x, this.towers[i].y, 20)
                marker.img = MarkerImg.THORN
                marker.dp = DrawPriority.OVER_PLAYER
                this.schedule(marker, this.thornStart, this.thornEnd)

                let tether = new PointTether(this.towers[i].x, this.towers[i].y, 630, true)
                tether.applyToTarget(players[i])
                tether.onStretch((gameState: GameState, tether: PointTether) => {
                    this.scheduleNow(this.towers[i], 1500)
                    marker.duration = gameState.now - marker.start + 300

                    let spread = new Spread(200)
                    spread.applyToTarget(players[i])
                    this.scheduleNow(spread, 1500)
                })
                this.schedule(tether, this.tetherStart, this.tetherEnd)
            }

            for (let i = 0; i < 4; i++) {
                let marker = new Marker(this.chariots[i].x, this.chariots[i].y, 20)
                marker.img = MarkerImg.THORN
                marker.dp = DrawPriority.OVER_PLAYER
                this.schedule(marker, this.thornStart, this.thornEnd)

                let tether = new PointTether(this.chariots[i].x, this.chariots[i].y, 650, true)
                tether.applyToTarget(players[i + 4])
                tether.onStretch((gameState: GameState, tether: PointTether) => {
                    this.scheduleNow(this.chariots[i], 700)
                    marker.duration = gameState.now - marker.start + 300
                })
                this.schedule(tether, this.tetherStart, this.tetherEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}