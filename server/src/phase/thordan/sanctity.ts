import { GameState } from "../../gamestate"
import { Chariot } from "../../mechanic/chariot"
import { Puddle } from "../../mechanic/puddle"
import { Tower } from "../../mechanic/tower"
import { Phase } from "../phase"

export class Sanctity extends Phase {

    phaseDuration = 60000
    lastPhaseProcessTime = 0

    firstTowerStart = 0
    firstTowerEnd = this.firstTowerStart + 3000
    puddle1Start = this.firstTowerEnd
    puddle1End = 50000 // ?????

    chariotStart = this.firstTowerEnd
    chariotEnd = this.chariotStart + 7000
    puddle2Start = this.chariotEnd
    puddle2End = this.puddle1End

    inOutTowerStart = this.chariotStart
    inOutTowerEnd = this.puddle2Start + 1000

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        for (let i = 0; i < 4; i++) {
            let tower = new Tower(
                400 + 225 * Math.cos(i * Math.PI / 2),
                400 + 225 * Math.sin(i * Math.PI / 2),
                50, 2)
            this.schedule(tower, this.firstTowerStart, this.firstTowerEnd)
        }

        for (let i = 0; i < 8; i++) {
            if (i % 2 == 0) {
                let chariot = new Chariot(
                    400 + 225 * Math.cos(i * Math.PI / 4),
                    400 + 225 * Math.sin(i * Math.PI / 4),
                    130)
                this.schedule(chariot, this.chariotStart, this.chariotEnd)

                let puddle = new Puddle(
                    400 + 225 * Math.cos(i * Math.PI / 4),
                    400 + 225 * Math.sin(i * Math.PI / 4),
                    130)
                this.schedule(puddle, this.puddle2Start, this.puddle2End)
            } else {
                let puddle = new Puddle(
                    400 + 225 * Math.cos(i * Math.PI / 4),
                    400 + 225 * Math.sin(i * Math.PI / 4),
                    130)
                this.schedule(puddle, this.puddle1Start, this.puddle1End)
            }
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.inOutTowerStart && this.inOutTowerStart <= phaseTime) {
            let innerCount = 0
            for (let i = 0; i < 4; i++) {
                let outerCount = (Math.random() * 2 << 0) + 1
                innerCount += (2 - outerCount)
                let rand = (Math.random() * 3 << 0)
                for (let j = 0; j < 3; j++) {
                    if ((outerCount == 1 && rand == j) ||
                        outerCount == 2 && rand != j) {
                        let angle = (i * Math.PI / 2) + ((j - 1) * Math.PI / 8)
                        let tower = new Tower(
                            400 + 380 * Math.cos(angle),
                            400 + 380 * Math.sin(angle),
                            50, 1)
                        this.schedule(tower, this.inOutTowerStart, this.inOutTowerEnd)
                    }
                }
            }
            let startAngle = (Math.random() * 4 << 0) * (Math.PI / 2) + Math.PI / 4
            for (let i = 0; i < innerCount; i++) {
                let tower = new Tower(
                    400 + 90 * Math.cos(startAngle + i * Math.PI / 2),
                    400 + 90 * Math.sin(startAngle + i * Math.PI / 2),
                    50, 1)
                this.schedule(tower, this.inOutTowerStart, this.inOutTowerEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}