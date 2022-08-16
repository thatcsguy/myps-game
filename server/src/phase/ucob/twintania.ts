import { GameState } from "../../gamestate"
import { Castbar } from "../../mechanic/castbar"
import { Chariot } from "../../mechanic/chariot"
import { DrawPriority } from "../../mechanic/drawPriority"
import { Knockback } from "../../mechanic/knockback"
import { Marker, MarkerImg } from "../../mechanic/marker"
import { Puddle } from "../../mechanic/puddle"
import { Stack } from "../../mechanic/stack"
import { Twister } from "../../mechanic/twister"
import { HomingOrb } from "../../mechanic/homingOrb"
import { distance, epsilon } from "../../utils"
import { Phase } from "../phase"

export class Twintania extends Phase {

    phaseDuration = 60000
    lastPhaseProcessTime = 0

    // set 1
    dive1ChariotStart = 2000
    dive1ChariotEnd = this.dive1ChariotStart + 1000
    twister1CastStart = this.dive1ChariotEnd + 2000
    stack1Start = this.twister1CastStart
    stack1End = this.stack1Start + 3000
    neurolink1CastStart = this.stack1End + 1000
    neurolink1CastEnd = this.neurolink1CastStart + 2000

    // set 2
    dive2ChariotStart = this.neurolink1CastEnd + 3000
    dive2ChariotEnd = this.dive2ChariotStart + 1000
    hellfire1CastStart = this.dive2ChariotEnd + 2000
    hellfire1CastEnd = this.hellfire1CastStart + 6000

    generate1CastStart = this.hellfire1CastEnd + 2000
    generate1CastEnd = this.generate1CastStart + 3000
    hellfire2CastStart = this.generate1CastEnd
    hellfire2CastEnd = this.hellfire2CastStart + 6000

    generate2CastStart = this.hellfire2CastEnd + 2000
    generate2CastEnd = this.generate2CastStart + 3000
    twister2CastStart = this.generate2CastEnd


    diveCasts = [
        [1, 2000],
        [this.neurolink1CastEnd + 1000, this.neurolink1CastEnd + 3000]
    ]

    twisterCasts = [
        [this.twister1CastStart, this.twister1CastStart + 2000],
        [this.twister2CastStart, this.twister2CastStart + 2000]
    ]

    private boss: Marker
    private neurolinks: Marker[]

    init(gameState: GameState, phaseStart: number): void {
        super.init(gameState, phaseStart)

        this.neurolinks = []
    }

    process(phaseTime: number): void {

        // All dive timings
        for (let diveTime of this.diveCasts) {
            if (this.lastPhaseProcessTime < diveTime[0] && diveTime[0] <= phaseTime) {
                let castbar = new Castbar('Dive', 400, 200)
                this.schedule(castbar, diveTime[0], diveTime[1])
            }

            if (this.lastPhaseProcessTime < diveTime[1] && diveTime[1] <= phaseTime) {
                let rand = this.gameState.players.get(this.gameState.randomPlayer())
                let chariot = new Chariot(rand.x, rand.y, 50)
                chariot.onComplete((gameState: GameState, chariot: Chariot) => {
                    this.boss = new Marker(chariot.x, chariot.y, 20)
                    this.boss.img = MarkerImg.THORDAN
                    this.boss.dp = DrawPriority.OVER_PLAYER
                    this.schedule(this.boss, diveTime[1] + 1000, this.phaseDuration)
                })
                this.schedule(chariot, diveTime[1], diveTime[1] + 1000)
            }
        }

        // All twister timings
        for (let twisterTime of this.twisterCasts) {
            if (this.lastPhaseProcessTime < twisterTime[0] && twisterTime[0] <= phaseTime) {
                let castbar = new Castbar('Twister', 400, 200)
                this.schedule(castbar, twisterTime[0], twisterTime[1])
            }

            if (this.lastPhaseProcessTime < twisterTime[1] && twisterTime[1] <= phaseTime) {
                for (let [, player] of this.gameState.players) {
                    let twister = new Twister(player.x, player.y)
                    twister.onTrigger((gameState: GameState, twister: Twister) => {
                        let kb = new Knockback(twister.x + epsilon(), twister.y + epsilon(), 700, 250)
                        this.scheduleNow(kb, 250)
                    })
                    this.schedule(twister, twisterTime[1], twisterTime[1] + 4000)
                }
            }
        }

        if (this.lastPhaseProcessTime < this.stack1Start && this.stack1Start <= phaseTime) {
            let stack = new Stack(this.gameState.players.size, 50)
            stack.applyToTarget(this.gameState.randomPlayer())
            this.schedule(stack, this.stack1Start, this.stack1End)
        }

        if (this.lastPhaseProcessTime < this.neurolink1CastStart && this.neurolink1CastStart <= phaseTime) {
            let castbar = new Castbar('Neurolink', 400, 200)
            this.schedule(castbar, this.neurolink1CastStart, this.neurolink1CastEnd)
        }

        if (this.lastPhaseProcessTime < this.neurolink1CastEnd && this.neurolink1CastEnd <= phaseTime) {
            let marker = new Marker(this.boss.x, this.boss.y, 40)
            marker.img = MarkerImg.NEUROLINK
            marker.dp = DrawPriority.UNDER_PLAYER
            this.schedule(marker, this.neurolink1CastEnd, this.phaseDuration)
            this.neurolinks.push(marker)
            this.schedule(this.boss, 0, 0)
        }

        if (this.lastPhaseProcessTime < this.hellfire1CastStart && this.hellfire1CastStart <= phaseTime) {
            let target = this.gameState.closestPlayers(this.boss.x, this.boss.y, this.gameState.players.size)[this.gameState.players.size - 1]
            this.hellfire(target, this.hellfire1CastStart, this.hellfire1CastEnd)
        }

        if (this.lastPhaseProcessTime < this.generate1CastStart && this.generate1CastStart <= phaseTime) {
            let castbar = new Castbar('Generate', 400, 200)
            this.schedule(castbar, this.generate1CastStart, this.generate1CastEnd)
            let orb = new HomingOrb(this.boss.x, this.boss.y, 20, 0, { color: 'green' })
            orb.applyToTarget(this.gameState.randomPlayer())
            orb.onCollision((gameState: GameState, orb: HomingOrb) => {
                let closest = gameState.players.get(gameState.closestPlayer(orb.x, orb.y))
                for (let link of this.neurolinks) {
                    if (distance(closest.x, closest.y, link.x, link.y) < link.r) {
                        return
                    }
                }
                gameState.messages.push(closest.name + ' died to orb')
            })
            this.schedule(orb, this.generate1CastStart, this.phaseDuration)
            castbar.onComplete((gameState: GameState, castbar: Castbar) => {
                orb.speed = 3.7 * 60
            })
        }

        if (this.lastPhaseProcessTime < this.hellfire2CastStart && this.hellfire2CastStart <= phaseTime) {
            let target = this.gameState.closestPlayers(this.boss.x, this.boss.y, this.gameState.players.size)[this.gameState.players.size - 1]
            this.hellfire(target, this.hellfire2CastStart, this.hellfire2CastEnd)
        }

        if (this.lastPhaseProcessTime < this.generate2CastStart && this.generate2CastStart <= phaseTime) {
            let castbar = new Castbar('Generate', 400, 200)
            this.schedule(castbar, this.generate2CastStart, this.generate2CastEnd)
            let orb = new HomingOrb(this.boss.x, this.boss.y, 20, 0, { color: 'green' })
            orb.applyToTarget(this.gameState.randomPlayer())
            orb.onCollision((gameState: GameState, orb: HomingOrb) => {
                let closest = gameState.players.get(gameState.closestPlayer(orb.x, orb.y))
                for (let link of this.neurolinks) {
                    if (distance(closest.x, closest.y, link.x, link.y) < link.r) {
                        return
                    }
                }
                gameState.messages.push(closest.name + ' died to orb')
            })
            this.schedule(orb, this.generate2CastStart, this.phaseDuration)
            castbar.onComplete((gameState: GameState, castbar: Castbar) => {
                orb.speed = 3.7 * 60
            })
        }

        this.lastPhaseProcessTime = phaseTime
    }

    hellfire(target: string, start: number, end: number) {
        let castbar = new Castbar('Hellfire', 400, 200)
        this.schedule(castbar, start, end)
        for (let i = 0; i < 5; i++) {
            let chariot = new Chariot(0, 0, 80)
            chariot.spawnOnPlayer(target)
            chariot.onComplete((gameState: GameState, chariot: Chariot) => {
                let puddle = new Puddle(chariot.x, chariot.y, chariot.r)
                this.scheduleNow(puddle, 7000)
            })
            this.schedule(chariot,
                start + (i + 1) * 1000,
                start + (i + 1) * 1000 + 1000)
        }
    }
}