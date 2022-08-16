import { Mechanic } from "./mechanic/mechanic"
import { Encounter } from "./encounter/encounter"
import { Player } from "./player"
import { distance, shuffle } from "./utils"
import { ReadyCheck } from "./readycheck"
import { ArenaId } from "./data/arenaId"
import { Marker } from "./mechanic/marker"

export class GameState {
    now: number
    players: Map<string, Player>
    mechanics: Mechanic[]
    messages: string[]

    encounter: Encounter
    nextEncounter: Encounter

    arenaId: ArenaId

    readycheck: ReadyCheck

    processCounter: number

    godMode: boolean = false

    private start: number

    constructor() {
        this.start = Date.now()
        this.now = 0
        this.players = new Map<string, Player>()
        this.mechanics = []
        this.messages = []

        this.arenaId = ArenaId.SQUARE

        this.processCounter = 0
    }

    reset(): void {
        for (let [, player] of this.players) {
            player.reset()
        }
        this.start = Date.now()
        this.now = 0
        this.mechanics = []
        this.messages = []
        this.encounter = null
        this.readycheck = null
    }

    process(): void {
        this.processCounter++

        let now = Date.now()

        this.now = now - this.start

        if (this.encounter) {
            this.arenaId = this.encounter.arenaId
            this.encounter.process(this)
        }

        for (let [, player] of this.players) {
            player.process(this)
        }

        // mechs backwards to be able to splice without issues
        for (let i = this.mechanics.length - 1; i >= 0; i--) {
            let mech = this.mechanics[i]
            mech.process(this, i)
        }

        if (this.messages.length > 0 && !this.godMode) {

            if (this.encounter) {
                this.nextEncounter = this.encounter
                this.encounter = null
                this.readycheck = new ReadyCheck()
            }

            if (this.readycheck) {
                if (this.readycheck.playersReady() == this.players.size) {
                    this.reset()
                    this.encounter = this.nextEncounter
                    this.nextEncounter = null
                    this.encounter.reset()
                }
            }

            this.messages = [...new Set(this.messages)]
        }

        this.mechanics.sort((a, b) => {
            if (a.dp == b.dp) {
                if (a instanceof Marker && b instanceof Marker) {
                    return a.y - b.y
                }
            }
            return a.dp - b.dp
        })

        if (this.godMode) {
            this.messages = []
        }
    }

    schedule(mech: Mechanic, start: number, duration: number): void {
        mech.start = start
        mech.duration = duration
        this.mechanics.push(mech)
    }

    cleanupMechanic(index: number) {
        if (this.mechanics[index].completeFunction) {
            this.mechanics[index].completeFunction(this, this.mechanics[index])
        }
        this.mechanics.splice(index, 1)
    }

    closestPlayer(x: number, y: number): string {
        let closestDist = 50000
        let closestPlayer = null
        for (let [p, player] of this.players) {
            let dist = distance(x, y, player.x, player.y)
            if (dist < closestDist) {
                closestDist = dist
                closestPlayer = p
            }
        }
        return closestPlayer
    }

    closestPlayers(x: number, y: number, count: number): string[] {
        let arr: { name: string; dist: number }[] = []
        this.players.forEach((p) => {
            arr.push({
                name: p.name,
                dist: distance(p.x, p.y, x, y)
            })
        })
        arr = arr.sort((a, b) => {
            return a.dist - b.dist
        })
        let ret = []
        for (let i = 0; i < count && i < arr.length; i++) {
            ret.push(arr[i].name)
        }
        return ret
    }

    randomPlayer(): string {
        let keys = Array.from(this.players.keys())
        return keys[keys.length * Math.random() << 0]
    }

    randomPlayers(count: number): string[] {
        let keys = shuffle(Array.from(this.players.keys()))
        return keys.slice(0, count)
    }

    wallsAreDeath(): boolean {
        if (this.encounter) {
            return this.encounter.deathWalls
        }
        if (this.nextEncounter) {
            return this.nextEncounter.deathWalls
        }
        return false
    }
}