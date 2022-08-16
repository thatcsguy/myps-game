import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Chain } from "../../mechanic/chain"
import { Chariot } from "../../mechanic/chariot"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Knockback } from "../../mechanic/knockback"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Puddle } from "../../mechanic/puddle"
import { Stack } from "../../mechanic/stack"
import { Tower } from "../../mechanic/tower"
import { Status } from "../../status/status"
import { StatusType } from "../../status/statusType"
import { Phase } from "../phase"

export class P4Act2 extends Phase {

    phaseDuration = 32000
    lastPhaseProcessTime = 0

    actCastStart = 0
    actCastEnd = 4000

    fakeStart = 1000
    fakeEnd = this.actCastEnd + 1000

    wreathCastStart = 6000
    thorn1Start = 8000
    thorn2Start = 10500
    wreathCastEnd = 13000

    purpleStart = this.wreathCastEnd
    redStart = this.wreathCastEnd
    tealStart = this.wreathCastEnd

    ddCastStart = 15000
    ddCastEnd = 18000
    puddleChariotStart = 18000
    puddleChariotEnd = 20000

    purpleEnd = 21000
    thorn1End = 21000

    thorn2End = 28000
    redEnd = 32000
    tealEnd = 32000

    chariots: Chariot[]
    towers: Tower[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.chariots = []
        this.towers = []

        let castbar = new Castbar("Act 2", 400, 400)
        this.schedule(castbar, this.actCastStart, this.actCastEnd)

        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2 + Math.PI / 8
            let x = 400 + 350 * Math.cos(angle)
            let y = 400 + 350 * Math.sin(angle)
            let chariot = new Chariot(x, y, 350)
            this.schedule(chariot, this.fakeStart, this.fakeEnd)
            this.chariots.push(chariot)
        }

        for (let i = 0; i < 4; i++) {
            let angle = i * Math.PI / 2
            let x = 400 + 350 * Math.cos(angle)
            let y = 400 + 350 * Math.sin(angle)
            let tower = new Tower(x, y, 50, 1)
            this.schedule(tower, this.fakeStart, this.fakeEnd)
            this.towers.push(tower)
        }

        castbar = new Castbar("Wreath of Thorns", 400, 400)
        this.schedule(castbar, this.wreathCastStart, this.wreathCastEnd)

        for (let i = 0; i < 4; i += 2) {
            let marker = new Marker(this.chariots[i].x, this.chariots[i].y, 20)
            marker.img = MarkerImg.THORN
            marker.dp = DrawPriority.OVER_PLAYER
            this.schedule(marker, this.thorn1Start, this.thorn1End)
        }

        for (let i = 1; i < 4; i += 2) {
            let marker = new Marker(this.towers[i].x, this.towers[i].y, 20)
            marker.img = MarkerImg.THORN
            marker.dp = DrawPriority.OVER_PLAYER
            this.schedule(marker, this.thorn1Start, this.thorn1End)
        }

        for (let i = 1; i < 4; i += 2) {
            let marker = new Marker(this.chariots[i].x, this.chariots[i].y, 20)
            marker.img = MarkerImg.THORN
            marker.dp = DrawPriority.OVER_PLAYER
            this.schedule(marker, this.thorn2Start, this.thorn2End)
        }

        for (let i = 0; i < 4; i += 2) {
            let marker = new Marker(this.towers[i].x, this.towers[i].y, 20)
            marker.img = MarkerImg.THORN
            marker.dp = DrawPriority.OVER_PLAYER
            this.schedule(marker, this.thorn2Start, this.thorn2End)
        }
    }

    process(phaseTime: number): void {

        // remove the fake mechanics
        if (this.lastPhaseProcessTime < this.actCastEnd && this.actCastEnd <= phaseTime) {
            this.gameState.mechanics = this.gameState.mechanics.filter((mech) => {
                return !(mech instanceof Chariot || mech instanceof Tower)
            })
        }

        // assign chains
        if (this.lastPhaseProcessTime < this.wreathCastEnd && this.wreathCastEnd <= phaseTime) {
            let random = this.gameState.randomPlayers(8)

            if (random[0] && random[1]) {
                let purple = new Chain(600, true, { c: 'purple' })
                purple.applyToTargets(random[0], random[1])
                purple.onComplete((gameState: GameState, chain: Chain) => {
                    if (chain.isSafe(gameState)) {
                        let status = new Status(StatusType.PURPLE_SHIELD)
                        status.schedule(chain.start + chain.duration, 20000)
                        gameState.players.get(chain.target1).statuses.push(status)
                        gameState.players.get(chain.target2).statuses.push(status)
                    }
                })
                this.schedule(purple, this.purpleStart, this.purpleEnd)
            }

            if (random[2] && random[3]) {
                let red1 = new Chain(600, true, { c: 'red' })
                red1.applyToTargets(random[2], random[3])
                red1.onComplete((gameState: GameState, chain: Chain) => {
                    let stack1 = new Stack(3, 75)
                    let stack2 = new Stack(3, 75)
                    stack1.applyToTarget(chain.target1)
                    stack2.applyToTarget(chain.target2)
                    this.scheduleNow(stack1, 2000)
                    this.scheduleNow(stack2, 2000)
                })
                this.schedule(red1, this.redStart, this.redEnd)
            }

            if (random[4] && random[5]) {
                let red2 = new Chain(600, true, { c: 'red' })
                red2.applyToTargets(random[4], random[5])
                red2.onComplete((gameState: GameState, chain: Chain) => {
                    if (chain.isSafe(gameState)) {
                        let stack1 = new Stack(3, 75)
                        let stack2 = new Stack(3, 75)
                        stack1.applyToTarget(chain.target1)
                        stack2.applyToTarget(chain.target2)
                        this.scheduleNow(stack1, 2000)
                        this.scheduleNow(stack2, 2000)
                    }
                })
                this.schedule(red2, this.redStart, this.redEnd)
            }

            if (random[6] && random[7]) {
                let teal = new Chain(300, true, { c: 'teal', s: false })
                teal.applyToTargets(random[6], random[7])
                teal.killOnEnd = false
                teal.onComplete((gameState: GameState, chain: Chain) => {
                    if (chain.isSafe(gameState)) {
                        let kb = new Knockback(400, 400, 400, 400)
                        this.scheduleNow(kb, 2000)
                    }
                })
                this.schedule(teal, this.tealStart, this.tealEnd)
            }
        }

        // Dark Design cast
        if (this.lastPhaseProcessTime < this.ddCastStart && this.ddCastStart <= phaseTime) {
            let castbar = new Castbar('Dark Design', 400, 400)
            this.schedule(castbar, this.ddCastStart, this.ddCastEnd)
        }

        // puddle drops
        if (this.lastPhaseProcessTime < this.puddleChariotStart && this.puddleChariotStart <= phaseTime) {
            for (let [, player] of this.gameState.players) {
                let chariot = new Chariot(player.x, player.y, 100)
                this.schedule(chariot, this.puddleChariotStart, this.puddleChariotEnd)
            }
        }

        // even chariots, odd towers+puddles
        if (this.lastPhaseProcessTime < this.thorn1End && this.thorn1End <= phaseTime) {
            this.schedule(this.chariots[0], this.thorn1End, this.thorn1End + 2000)
            this.schedule(this.chariots[2], this.thorn1End, this.thorn1End + 2000)

            this.schedule(this.towers[1], this.thorn1End, this.thorn1End + 2000)
            let puddle1 = new Puddle(this.towers[1].x, this.towers[1].y, this.towers[1].r)
            this.schedule(puddle1, this.thorn1End, this.thorn1End + 2000)

            this.schedule(this.towers[3], this.thorn1End, this.thorn1End + 2000)
            let puddle3 = new Puddle(this.towers[3].x, this.towers[3].y, this.towers[3].r)
            this.schedule(puddle3, this.thorn1End, this.thorn1End + 2000)
        }

        // odd chariots, even towers+puddles
        if (this.lastPhaseProcessTime < this.thorn2End && this.thorn2End <= phaseTime) {
            this.schedule(this.chariots[1], this.thorn2End, this.thorn2End + 2000)
            this.schedule(this.chariots[3], this.thorn2End, this.thorn2End + 2000)

            this.schedule(this.towers[0], this.thorn2End, this.thorn2End + 2000)
            let puddle0 = new Puddle(this.towers[0].x, this.towers[0].y, this.towers[0].r)
            this.schedule(puddle0, this.thorn2End, this.thorn2End + 2000)

            this.schedule(this.towers[2], this.thorn2End, this.thorn2End + 2000)
            let puddle2 = new Puddle(this.towers[2].x, this.towers[2].y, this.towers[2].r)
            this.schedule(puddle2, this.thorn2End, this.thorn2End + 2000)
        }

        this.lastPhaseProcessTime = phaseTime
    }
}