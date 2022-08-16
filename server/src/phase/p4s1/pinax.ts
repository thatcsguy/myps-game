import { GameState } from "../../gamestate"
import { Animation, AnimationKey } from "../../mechanic/animation"
import { Castbar } from "../../mechanic/castbar"
import { Chariot } from "../../mechanic/chariot"
import { Conal } from "../../mechanic/conal"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Knockback } from "../../mechanic/knockback"
import { LineAOE } from "../../mechanic/lineAOE"
import { PinaxSquare } from "../../mechanic/pinaxSquare"
import { Spread } from "../../mechanic/spread"
import { Stack } from "../../mechanic/stack"
import { Phase } from "../phase"

export class Pinax extends Phase {

    phaseDuration = 31000
    lastPhaseProcessTime = 0

    activateTimes = [8000, 10000, 18000, 26000]
    triggerTimes = [13000, 15000, 25000, 30000]

    pinax1Start = 6000
    pinax1End = 8000

    pinax2Start = 16000
    pinax2End = 18000

    shiftCastStart = 20000
    shiftCastEnd = 27000

    private activateIndex: number
    private triggerIndex: number

    private elements: Array<PinaxSquare.Element>
    private squares: Array<PinaxSquare>

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        let animation = new Animation(AnimationKey.SETTING_THE_SCENE, DrawPriority.UNDER_PLAYER)
        this.schedule(animation, 0, 5000)
        let castbar = new Castbar("Setting the Scene", 400, 400)
        this.schedule(castbar, 0, 5000)

        this.squares = []

        this.elements = [
            PinaxSquare.Element.WATER,
            PinaxSquare.Element.FIRE,
            PinaxSquare.Element.LIGHTNING,
            PinaxSquare.Element.POISON]
        this.activateIndex = 0
        this.triggerIndex = 0

        let startIndex = (Math.random() * 4) << 0
        let direction = Math.random() < .5 ? 1 : -1

        for (let i = 0; i < 4; i++) {
            let element = this.elements[(startIndex + direction * i + 4) % 4]
            let square = new PinaxSquare(element,
                (i == 0 || i == 3) ? 0 : 400,
                (i <= 1) ? 0 : 400,
                400,
                400)
            this.schedule(square, 2500, this.phaseDuration)
            this.squares.push(square)
        }

        if (Math.random() < .5) {
            [this.elements[0], this.elements[2]] = [this.elements[2], this.elements[0]]
        }
        if (Math.random() < .5) {
            [this.elements[1], this.elements[3]] = [this.elements[1], this.elements[3]]
        }
    }

    getSquareOfElement(element: PinaxSquare.Element): PinaxSquare {
        for (let square of this.squares) {
            if (square.element == element) {
                return square
            }
        }
    }

    process(phaseTime: number): void {

        if (this.lastPhaseProcessTime < this.pinax1Start && this.pinax1Start <= phaseTime) {
            let castbar = new Castbar('Pinax', 400, 400)
            this.schedule(castbar, this.pinax1Start, this.pinax1End)
        }

        if (this.lastPhaseProcessTime < this.pinax2Start && this.pinax2Start <= phaseTime) {
            let castbar = new Castbar('Pinax', 400, 400)
            this.schedule(castbar, this.pinax2Start, this.pinax2End)
        }

        // Light up squares
        for (let time of this.activateTimes) {
            if (this.lastPhaseProcessTime < time && time <= phaseTime) {

                let square = this.getSquareOfElement(this.elements[this.activateIndex])
                this.activateIndex++

                square.activeStart = this.getPhaseStart() + time
                square.active = true
            }
        }

        // Trigger square effects
        for (let time of this.triggerTimes) {
            if (this.lastPhaseProcessTime < time && time <= phaseTime) {

                let square = this.getSquareOfElement(this.elements[this.triggerIndex])
                square.active = false
                this.triggerIndex++

                let aoe = new LineAOE(
                    square.x + square.width / 2,
                    square.y,
                    square.x + square.width / 2,
                    square.y + square.height,
                    square.width)
                this.schedule(aoe, time, time + 1000)

                switch (square.element) {
                    case PinaxSquare.Element.LIGHTNING:
                        let chariot = new Chariot(400, 400, 350)
                        this.schedule(chariot, time, time + 1000)
                        break
                    case PinaxSquare.Element.WATER:
                        let kb = new Knockback(400, 400, 300, 200)
                        this.schedule(kb, time, time + 1000)
                        break
                    case PinaxSquare.Element.FIRE:
                        if (this.gameState.players.size < 4) {
                            let stack = new Stack(this.gameState.players.size, 75)
                            stack.applyToTarget(this.gameState.randomPlayer())
                            this.schedule(stack, time, time + 2000)
                        } else {
                            let needed = (this.gameState.players.size == 4) ? 2 :
                                (this.gameState.players.size + 1) / 2 - 1 << 0
                            let targets = this.gameState.randomPlayers(2)

                            let stack1 = new Stack(needed, 75)
                            let stack2 = new Stack(needed, 75)
                            stack1.applyToTarget(targets[0])
                            stack2.applyToTarget(targets[1])

                            stack1.onComplete((gameState: GameState) => {
                                let soakers1 = stack1.soakers(gameState)
                                let soakers2 = stack2.soakers(gameState)
                                for (let [p, player] of gameState.players) {
                                    if (soakers1.includes(p) && soakers2.includes(p)) {
                                        gameState.messages.push(player.name + ' died from double stacks')
                                    }
                                }
                            })
                            stack2.onComplete((gameState: GameState) => {
                                let soakers1 = stack1.soakers(gameState)
                                let soakers2 = stack2.soakers(gameState)
                                for (let [p, player] of gameState.players) {
                                    if (soakers1.includes(p) && soakers2.includes(p)) {
                                        gameState.messages.push(player.name + ' died from double stacks')
                                    }
                                }
                            })

                            this.schedule(stack1, time, time + 2000)
                            this.schedule(stack2, time, time + 2000)
                        }
                        break
                    case PinaxSquare.Element.POISON:
                        for (let [p,] of this.gameState.players) {
                            let spread = new Spread(150)
                            spread.applyToTarget(p)
                            this.schedule(spread, time, time + 1000)
                        }
                        break
                }
            }
        }

        // Directional shift
        if (this.lastPhaseProcessTime < this.shiftCastStart && this.shiftCastStart <= phaseTime) {

            let castNamePrefixes = ["Northerly ", "Easterly ", "Southerly ", "Westerly "]
            let castNameSuffixes = ["Gust", "Strike"]

            let rand = Math.random() * 8 << 0
            let name = castNamePrefixes[rand % 4] + castNameSuffixes[(rand / 4) << 0]

            let castbar = new Castbar(name, 400, 400)
            this.schedule(castbar, this.shiftCastStart, this.shiftCastEnd)

            if (rand / 4 << 0 == 0) {
                let kb: Knockback
                if (rand % 4 == 0) {
                    kb = new Knockback(400, 0, 566, 200)
                } else if (rand % 4 == 1) {
                    kb = new Knockback(800, 400, 566, 200)
                } else if (rand % 4 == 2) {
                    kb = new Knockback(400, 800, 566, 200)
                } else {
                    kb = new Knockback(0, 400, 566, 200)
                }
                this.schedule(kb, this.shiftCastEnd, this.shiftCastEnd + 500)
            } else {
                let conal: Conal
                if (rand % 4 == 0) {
                    conal = new Conal(400, 0, 895, Math.PI / 2, Math.PI / 2)
                } else if (rand % 4 == 1) {
                    conal = new Conal(800, 400, 895, Math.PI, Math.PI / 2)
                } else if (rand % 4 == 2) {
                    conal = new Conal(400, 800, 895, 3 / 2 * Math.PI, Math.PI / 2)
                } else {
                    conal = new Conal(0, 400, 895, 0, Math.PI / 2)
                }
                this.schedule(conal, this.shiftCastEnd, this.shiftCastEnd + 500)
            }
        }

        this.lastPhaseProcessTime = phaseTime
    }
}