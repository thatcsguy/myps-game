import { GameState } from "../../gamestate"
import { PassableTether } from "../../mechanic/passableTether"
import { Puddle } from "../../mechanic/puddle"
import { Spread } from "../../mechanic/spread"
import { Tower } from "../../mechanic/tower"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { shuffle } from "../../utils"
import { Phase } from "../phase"

export class TethersAndTowers extends Phase {

    phaseDuration = 12000
    lastPhaseProcessTime = 0

    introTowerStart = 0
    introTowerEnd = 3000
    immunityStart = 3000
    immunityEnd = 12000
    tethersAndTowersStart = 3000
    tethersAndTowersEnd = 11600
    spreadsStart = 11600
    spreadsEnd = 11800

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        for (let i = 0; i < gameState.players.size; i++) {
            let angle = -Math.PI / 2 + (2 * Math.PI / gameState.players.size) * i
            let xOffset = 300 * Math.cos(angle)
            let yOffset = 300 * Math.sin(angle)

            let tower = new Tower(400 + xOffset, 400 + yOffset, 75, 1)
            this.schedule(tower, this.introTowerStart, this.introTowerEnd)
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.immunityStart && this.immunityStart <= phaseTime) {
            let puddleSoakerCount = (this.gameState.players.size / 2 + 1) << 0
            let puddleImmunePlayers = this.gameState.randomPlayers(puddleSoakerCount)
            for (let [p, player] of this.gameState.players) {
                if (puddleImmunePlayers.includes(p)) {
                    let status = new Status(StatusType.PURPLE_SHIELD)
                    status.schedule(this.getPhaseStart() + this.immunityStart, this.immunityEnd - this.immunityStart)
                    player.statuses.push(status)
                } else {
                    let status = new Status(StatusType.YELLOW_SHIELD)
                    status.schedule(this.getPhaseStart() + this.immunityStart, this.immunityEnd - this.immunityStart)
                    player.statuses.push(status)
                }
            }

            // tethers into spreads
            let tetherPlayers = this.gameState.randomPlayers(this.gameState.players.size - puddleSoakerCount)
            for (let i = 0; i < tetherPlayers.length; i++) {
                let tether = new PassableTether(400, 400)
                tether.applyToTarget(tetherPlayers[i])
                tether.onComplete((gameState: GameState, tether: PassableTether) => {
                    let player = gameState.players.get(tether.target)

                    let spread = new Spread(150)
                    spread.applyToTarget(tether.target)
                    this.schedule(spread, this.spreadsStart, this.spreadsEnd)

                    if (player.hasStatusOfType(StatusType.YELLOW_SHIELD)) {
                        return
                    }

                    gameState.messages.push(player.name + ' died from tether')
                })
                this.schedule(tether, this.tethersAndTowersStart, this.tethersAndTowersEnd)
            }

            // towers into puddles
            let counts = []
            for (let i = 0; i < 4; i++) {
                counts.push(i < puddleSoakerCount ? 1 : 0)
            }
            shuffle(counts)

            for (let i = 0; i < 4; i++) {
                let tower = new Tower((i % 2 == 0) ? 800 / 3 : 1600 / 3, i < 2 ? 800 / 3 : 1600 / 3, 80, counts[i])
                this.schedule(tower, this.tethersAndTowersStart, this.tethersAndTowersEnd)
                let puddle = new Puddle(tower.x, tower.y, tower.r)
                this.schedule(puddle, this.tethersAndTowersStart, this.tethersAndTowersEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}