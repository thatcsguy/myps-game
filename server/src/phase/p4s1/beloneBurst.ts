import { GameState } from "../../gamestate"
import { Animation, AnimationKey } from "../../mechanic/animation"
import { Castbar } from "../../mechanic/castbar"
import { Chariot } from "../../mechanic/chariot"
import { DrawPriority } from "../../mechanic/drawPriority"
import { HomingOrb } from "../../mechanic/homingOrb"
import { LineAOE } from "../../mechanic/lineAOE"
import { PinaxSquare } from "../../mechanic/pinaxSquare"
import { Tower } from "../../mechanic/tower"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { distance } from "../../utils"
import { Phase } from "../phase"

export class BeloneBurst extends Phase {

    phaseDuration = 21000
    lastPhaseProcessTime = 0

    sceneStart = 0
    sceneEnd = this.sceneStart + 5000

    squaresStart = (this.sceneStart + this.sceneEnd) / 2
    squaresEnd = this.phaseDuration

    bloodrakeStart = this.sceneEnd + 1000
    bloodrakeEnd = this.bloodrakeStart + 3000

    towerStart = this.bloodrakeEnd + 1000
    towerEnd = this.towerStart + 3000
    orbStart = this.towerEnd
    orbGrow1 = this.orbStart + 2000
    orbGrow2 = this.orbStart + 4000
    orbEnd = this.orbStart + 6000
    immuneStart = this.orbStart
    immuneEnd = this.orbEnd + 500

    periaktoiStart = (this.orbStart + this.orbEnd) / 2
    periaktoiEnd = this.orbEnd + 1000

    boomStart = this.periaktoiEnd
    boomEnd = this.boomStart + 300

    private elements: PinaxSquare.Element[]
    private squares: PinaxSquare[]

    private orbs: HomingOrb[]

    private safeIndex: number

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let animation = new Animation(AnimationKey.SETTING_THE_SCENE, DrawPriority.UNDER_PLAYER)
        this.schedule(animation, this.sceneStart, this.sceneEnd)
        let castbar = new Castbar("Setting the Scene", 400, 400)
        this.schedule(castbar, this.sceneStart, this.sceneEnd)

        this.squares = []
        this.elements = [
            PinaxSquare.Element.WATER,
            PinaxSquare.Element.FIRE,
            PinaxSquare.Element.LIGHTNING,
            PinaxSquare.Element.POISON]

        this.orbs = []

        let startIndex = (Math.random() * 4) << 0
        let direction = Math.random() < .5 ? 1 : -1

        for (let i = 0; i < 4; i++) {
            let element = this.elements[(startIndex + direction * i + 4) % 4]
            let square = new PinaxSquare(element,
                (i == 0 || i == 3) ? 0 : 400,
                (i <= 1) ? 0 : 400,
                400,
                400)
            this.schedule(square, this.squaresStart, this.squaresEnd)
            this.squares.push(square)
        }

        castbar = new Castbar("Bloodrake", 400, 400)
        this.schedule(castbar, this.bloodrakeStart, this.bloodrakeEnd)

        this.safeIndex = Math.random() * 4 << 0

        castbar = new Castbar("Periaktoi", 400, 400)
        this.schedule(castbar, this.periaktoiStart, this.periaktoiEnd)

        for (let i = 0; i < gameState.players.size; i++) {
            let angle = 2 * Math.PI / gameState.players.size * i
            let xOffset = 170 * Math.cos(angle)
            let yOffset = 170 * Math.sin(angle)

            let tower = new Tower(400 + xOffset, 400 + yOffset, 50, 1)
            tower.onComplete((gameState: GameState, tower: Tower) => {

                let player = gameState.closestPlayer(tower.x, tower.y)

                // Create orb
                let orbX = 400 + 370 * Math.cos(angle)
                let orbY = 400 + 370 * Math.sin(angle)
                let orb = new HomingOrb(orbX, orbY, 30, 20,
                    { color: ((i / 2 << 0) % 2 == 0) ? 'blue' : 'red' })
                orb.applyToTarget(player)
                orb.onCollision((gameState: GameState, orb: HomingOrb) => {
                    let chariot = new Chariot(orb.x, orb.y, 150, true)
                    chariot.onComplete((gameState: GameState, chariot: Chariot) => {
                        let soakers = []
                        for (let [, player] of gameState.players) {
                            if (distance(player.x, player.y, chariot.x, chariot.y) < chariot.r) {
                                soakers.push(player)
                                if (!player.hasStatusOfType(((i / 2 << 0) % 2 == 0) ? StatusType.BLUE_SHIELD : StatusType.RED_SHIELD)) {
                                    gameState.messages.push(player.name + ' died from soaking orb without proper resistance')
                                }
                            }
                        }
                        if (soakers.length < 2) {
                            for (let soaker of soakers) {
                                gameState.messages.push(soaker.name + ' died from soaking orb alone')
                            }
                        }
                    })
                    this.scheduleNow(chariot, 200)
                })
                this.schedule(orb, this.orbStart, this.orbEnd)
                this.orbs.push(orb)

                // Assign statuses
                if (gameState.players.get(player).statuses.length == 0) {
                    let status = new Status(((i / 2 << 0) % 2 == 0) ? StatusType.RED_SHIELD : StatusType.BLUE_SHIELD)
                    status.schedule(this.getPhaseStart() + this.immuneStart, this.immuneEnd - this.immuneStart)
                    gameState.players.get(player).statuses.push(status)
                }
            })
            this.schedule(tower, this.towerStart, this.towerEnd)
        }

    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.bloodrakeStart && this.bloodrakeStart <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                if (i == this.safeIndex) {
                    continue
                }
                this.squares[i].active = true
                this.squares[i].activeStart = this.getPhaseStart() + this.bloodrakeStart
            }
        }

        if (this.lastPhaseProcessTime < this.bloodrakeEnd && this.bloodrakeEnd <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                this.squares[i].active = false
            }
        }

        if ((this.lastPhaseProcessTime < this.orbGrow1 && this.orbGrow1 <= phaseTime) ||
            (this.lastPhaseProcessTime < this.orbGrow2 && this.orbGrow2 <= phaseTime)) {
            for (let orb of this.orbs) {
                orb.r += 5
            }
        }

        if (this.lastPhaseProcessTime < this.boomStart && this.boomStart <= phaseTime) {
            for (let i = 0; i < 4; i++) {
                if (i == this.safeIndex) {
                    continue
                }
                let aoe = new LineAOE(
                    this.squares[i].x + this.squares[i].width / 2,
                    this.squares[i].y,
                    this.squares[i].x + this.squares[i].width / 2,
                    this.squares[i].y + this.squares[i].height,
                    this.squares[i].width)
                this.schedule(aoe, this.boomStart, this.boomEnd)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}