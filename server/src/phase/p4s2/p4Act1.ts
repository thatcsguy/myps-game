import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Chariot } from "../../mechanic/chariot"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Tower } from "../../mechanic/tower"
import { Phase } from "../phase"

export class P4Act1 extends Phase {

    phaseDuration = 16800
    lastPhaseProcessTime = 0

    castStart = 0
    castEnd = 4000

    fakeStart = 1000
    fakeEnd = this.castEnd + 1000

    wreathStart = 5000
    thorn1Start = 6000
    thorn2Start = 7500
    thorn3Start = 9000
    wreathEnd = 9500

    thorn1End = 12500
    thorn2End = 13500
    thorn3End = 16500

    chariot1Start = 12500
    chariot1End = 12800
    towerStart = 13500
    towerEnd = 14800
    chariot2Start = 16500
    chariot2End = 16800

    chariots: Chariot[]
    towers: Tower[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.chariots = []
        this.towers = []

        let castbar = new Castbar("Act 1", 400, 400)
        this.schedule(castbar, this.castStart, this.castEnd)

        let chariotPos = [
            [400, 100],
            [400, 700],
            [700, 400],
            [100, 400]
        ]
        for (let i = 0; i < 4; i++) {
            let chariot = new Chariot(chariotPos[i][0], chariotPos[i][1], 325)
            this.schedule(chariot, this.fakeStart, this.fakeEnd)
            this.chariots.push(chariot)
        }

        let diff1 = 100, diff2 = 200
        let towerPos = [
            [400 - diff1, 400 - diff1],
            [400 - diff2, 400 - diff2],
            [400 + diff1, 400 - diff1],
            [400 + diff2, 400 - diff2],
            [400 - diff1, 400 + diff1],
            [400 - diff2, 400 + diff2],
            [400 + diff1, 400 + diff1],
            [400 + diff2, 400 + diff2],
        ]
        for (let i = 0; i < 8; i++) {
            let tower = new Tower(towerPos[i][0], towerPos[i][1], 50, 1)
            this.schedule(tower, this.fakeStart, this.fakeEnd)
            this.towers.push(tower)
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.castEnd && this.castEnd <= phaseTime) {
            this.gameState.mechanics = []
        }

        if (this.lastPhaseProcessTime < this.wreathStart && this.wreathStart <= phaseTime) {
            let castbar = new Castbar("Wreath of Thorns", 400, 400)
            this.schedule(castbar, this.wreathStart, this.wreathEnd)
        }

        if (this.lastPhaseProcessTime < this.thorn1Start && this.thorn1Start <= phaseTime) {
            if (Math.random() < .5) {
                this.chariots.push(this.chariots.shift())
                this.chariots.push(this.chariots.shift())
            }

            for (let i = 0; i < 4; i++) {
                let marker = new Marker(this.chariots[i].x, this.chariots[i].y, 20)
                marker.img = MarkerImg.THORN
                marker.dp = DrawPriority.OVER_PLAYER
                let thornStart = (i < 2) ? this.thorn1Start : this.thorn3Start
                let thornEnd = (i < 2) ? this.thorn1End : this.thorn3End
                this.schedule(marker, thornStart, thornEnd)

                let chariotTime = (i < 2) ? this.chariot1Start : this.chariot2Start
                this.schedule(this.chariots[i], chariotTime, chariotTime + 300)
            }

            for (let i = 0; i < 8; i++) {
                let marker = new Marker(this.towers[i].x, this.towers[i].y, 20)
                marker.img = MarkerImg.THORN
                marker.dp = DrawPriority.OVER_PLAYER
                this.schedule(marker, this.thorn2Start, this.thorn2End)

                this.schedule(this.towers[i], this.towerStart, this.towerEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}