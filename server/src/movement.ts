export class Movement {
    timestamp: number
    frameTime: number
    up: boolean
    down: boolean
    left: boolean
    right: boolean

    constructor(clientMove: any) {
        this.timestamp = clientMove.timestamp
        this.frameTime = clientMove.frameTime
        this.up = clientMove.up
        this.down = clientMove.down
        this.left = clientMove.left
        this.right = clientMove.right
    }

    isDiagonal(): boolean {
        return (this.left || this.right) && (this.up || this.down)
    }
}