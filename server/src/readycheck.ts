export class ReadyCheck {

    private ready: Array<string>

    constructor() {
        this.ready = []
    }

    playersReady(): number {
        return this.ready.length
    }

    markReady(name: string): void {
        if (!this.ready.includes(name)) {
            this.ready.push(name)
        }
    }
}