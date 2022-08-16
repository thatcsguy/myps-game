"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyCheck = void 0;
class ReadyCheck {
    constructor() {
        this.ready = [];
    }
    playersReady() {
        return this.ready.length;
    }
    markReady(name) {
        if (!this.ready.includes(name)) {
            this.ready.push(name);
        }
    }
}
exports.ReadyCheck = ReadyCheck;
//# sourceMappingURL=readycheck.js.map