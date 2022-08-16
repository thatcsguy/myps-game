import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { DoomCircle } from "../../mechanic/doomCircle"
import { PassableTether } from "../../mechanic/passableTether"
import { Spread } from "../../mechanic/spread"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { distance } from "../../utils"
import { Phase } from "../phase"

export class DoomAndTethers extends Phase {

    phaseDuration = 15000
    lastPhaseProcessTime = 0

    bloodrakeCastStart = 0
    bloodrakeCaseEnd = 3000

    shieldsStart = 3000
    shieldsEnd = this.phaseDuration

    dirBeloneCastStart = 4000
    dirBeloneCastEnd = 7000

    doomStart = 7000

    invChlamysCastStart = 10000
    invChlamysCastEnd = 14700

    doomEnd = this.invChlamysCastEnd

    tetherStart = 10000
    tetherEnd = this.invChlamysCastEnd - 300

    spreadStart = this.tetherEnd
    spreadEnd = this.phaseDuration

    doomCount: number
    tetherCount: number

    dooms: DoomCircle[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.dooms = []

        let castbar = new Castbar("Bloodrake", 400, 400)
        this.schedule(castbar, this.bloodrakeCastStart, this.bloodrakeCaseEnd)

        this.doomCount = ((gameState.players.size + 1) / 2) << 0
        this.tetherCount = gameState.players.size - this.doomCount

        castbar = new Castbar("Director's Belone", 400, 400)
        this.schedule(castbar, this.dirBeloneCastStart, this.dirBeloneCastEnd)

        let doomTargets = gameState.randomPlayers(this.doomCount)
        for (let player of doomTargets) {
            let doom = new DoomCircle(25)
            doom.applyToTarget(player)
            this.schedule(doom, this.doomStart, this.doomEnd)
            this.dooms.push(doom)
        }

        castbar = new Castbar("Inversive Chlamys", 400, 400)
        this.schedule(castbar, this.invChlamysCastStart, this.invChlamysCastEnd)

        let tetherTargets = gameState.randomPlayers(this.tetherCount)
        for (let player of tetherTargets) {
            let tether = new PassableTether(400, 400)
            tether.applyToTarget(player)
            tether.onComplete((gameState: GameState, tether: PassableTether) => {
                let target = gameState.players.get(tether.target)
                if (!target.hasStatusOfType(StatusType.YELLOW_SHIELD)) {
                    this.gameState.messages.push(target.name + ' died to tether')
                }
                let spread = new Spread(200)
                spread.applyToTarget(tether.target)
                this.schedule(spread, this.spreadStart, this.spreadEnd)
            })
            this.schedule(tether, this.tetherStart, this.tetherEnd)
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.shieldsStart && this.shieldsStart <= phaseTime) {
            let targets = this.gameState.randomPlayers(this.gameState.players.size)

            for (let i = 0; i < targets.length; i++) {
                let status = new Status(i < this.doomCount ? StatusType.RED_SHIELD : StatusType.YELLOW_SHIELD)
                status.schedule(this.getPhaseStart() + this.shieldsStart, this.shieldsEnd - this.shieldsStart)
                this.gameState.players.get(targets[i]).statuses.push(status)
            }
        }

        if (this.doomStart < phaseTime && phaseTime < this.doomEnd) {
            for (let doom of this.dooms) {
                let target = this.gameState.players.get(doom.target)
                for (let [p, player] of this.gameState.players) {
                    if (player.name == target.name || player.hasStatusOfType(StatusType.SIMPLE_COUNTDOWN)) {
                        continue
                    }
                    let dist = distance(target.x, target.y, player.x, player.y)
                    if (dist < target.r / 2) {
                        doom.applyToTarget(p)
                        let status = new Status(StatusType.SIMPLE_COUNTDOWN)
                        status.schedule(this.gameState.now, 2000)
                        target.statuses.push(status)
                    }
                }
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}