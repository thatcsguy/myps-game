import { ArenaId } from "./data/arenaId"
import { GameState } from "./gamestate"
import { GLOBALS } from "./globals"
import { Movement } from "./movement"
import { Status } from "./status/status"
import { StatusType } from "./status/statusType"
import { distance } from "./utils"

export class Player {
    name: string
    x: number
    y: number
    r: number
    speed: number

    movementQueue: Movement[]
    lastProcessedMoveTime: number

    statuses: Status[]

    constructor(name: string) {
        this.name = name
        this.x = (GLOBALS.arenaWidth * 0.8) * Math.random() + (GLOBALS.arenaWidth * 0.1)
        this.y = (GLOBALS.arenaHeight * 0.8) * Math.random() + (GLOBALS.arenaHeight * 0.1)
        this.r = 20
        this.speed = 3.5 * 60
        this.movementQueue = []
        this.statuses = []
    }

    process(gameState: GameState): void {

        while (this.movementQueue.length > 0) {
            this.processMove(gameState, this.movementQueue[0])
            this.movementQueue.splice(0, 1)
        }

        // backwards to allow easy splicing
        for (let i = this.statuses.length - 1; i >= 0; i--) {
            this.statuses[i].process(gameState, this, i)
        }
    }

    private processMove(gameState: GameState, move: Movement) {
        let dirSpeed = this.speed * (move.frameTime / 1000)
        if (move.isDiagonal()) {
            dirSpeed /= Math.sqrt(2)
        }

        if (move.left) {
            this.x -= dirSpeed
        }
        if (move.right) {
            this.x += dirSpeed
        }
        if (move.up) {
            this.y -= dirSpeed
        }
        if (move.down) {
            this.y += dirSpeed
        }

        this.fixPosition(gameState)

        this.lastProcessedMoveTime = move.timestamp
    }

    fixPosition(gameState: GameState) {
        if (gameState.arenaId == ArenaId.SQUARE) {
            if (gameState.wallsAreDeath() &&
                (this.x < 0 || this.x > GLOBALS.arenaWidth || this.y < 0 || this.y > GLOBALS.arenaHeight)) {
                gameState.messages.push(this.name + ' died to the wall')
            }
            this.x = Math.min(Math.max(this.x, 0), GLOBALS.arenaWidth)
            this.y = Math.min(Math.max(this.y, 0), GLOBALS.arenaHeight)
        } else if (gameState.arenaId == ArenaId.ROUND) {
            let dist = distance(this.x, this.y, GLOBALS.arenaWidth / 2, GLOBALS.arenaHeight / 2)
            if (dist > GLOBALS.arenaWidth / 2) {
                if (gameState.wallsAreDeath()) {
                    gameState.messages.push(this.name + ' died to the wall')
                }
                let scalar = (GLOBALS.arenaWidth / 2) / (dist)
                this.x = (this.x - (GLOBALS.arenaWidth / 2)) * scalar + (GLOBALS.arenaWidth / 2)
                this.y = (this.y - (GLOBALS.arenaHeight / 2)) * scalar + (GLOBALS.arenaHeight / 2)
            }
        }
    }

    reset(): void {
        this.movementQueue = []
        this.statuses = []
    }

    hasStatusOfType(type: StatusType) {
        for (let status of this.statuses) {
            if (status.type == type) {
                return true
            }
        }
        return false
    }

    removeStatusOfType(type: StatusType) {
        for (let i = 0; i < this.statuses.length; i++) {
            if (this.statuses[i].type == type) {
                this.statuses.splice(i, 1)
                return
            }
        }
    }
}