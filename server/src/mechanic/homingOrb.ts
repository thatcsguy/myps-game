import { GameState } from "../gamestate"
import { distance } from "../utils"
import { Mechanic, MechanicId } from "./mechanic"

export class HomingOrb extends Mechanic {

    id: MechanicId = MechanicId.HOMING_ORB

    x: number
    y: number
    r: number
    speed: number
    options: any

    target: string

    lastProcessTime = -1

    collisionFunction: (gameState: GameState, mech: HomingOrb) => void

    constructor(x: number, y: number, r: number, speed: number, options?: any) {
        super()
        this.x = x
        this.y = y
        this.r = r
        this.speed = speed

        this.options = options

        // maybe?
        //this.drawPriority = DrawPriority.OVER_PLAYER
    }

    applyToTarget(target: string) {
        this.target = target
    }

    onCollision(fn: (gameState: GameState, mech: HomingOrb) => void) {
        this.collisionFunction = fn
    }

    process(gameState: GameState, index: number): void {
        super.process(gameState, index)

        if (gameState.now >= this.start + this.duration) {
            gameState.messages.push('unsoaked orb exploded')
            gameState.cleanupMechanic(index)
            return
        }

        if (this.lastProcessTime < 0) {
            this.lastProcessTime = gameState.now
        }

        if (!this.target) {
            return
        }

        let timeSinceLastProcess = gameState.now - this.lastProcessTime

        let player = gameState.players.get(this.target)
        let angle = Math.atan2(player.y - this.y, player.x - this.x)

        this.x += this.speed * (timeSinceLastProcess / 1000) * Math.cos(angle)
        this.y += this.speed * (timeSinceLastProcess / 1000) * Math.sin(angle)

        for (let [, player] of gameState.players) {
            if (distance(player.x, player.y, this.x, this.y) < this.r) {
                if (this.collisionFunction) {
                    this.collisionFunction(gameState, this)
                }
                gameState.cleanupMechanic(index)
            }
        }

        this.lastProcessTime = gameState.now
    }
}