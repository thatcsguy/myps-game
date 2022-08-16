"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const arenaId_1 = require("./data/arenaId");
const globals_1 = require("./globals");
const utils_1 = require("./utils");
class Player {
    constructor(name) {
        this.name = name;
        this.x = (globals_1.GLOBALS.arenaWidth * 0.8) * Math.random() + (globals_1.GLOBALS.arenaWidth * 0.1);
        this.y = (globals_1.GLOBALS.arenaHeight * 0.8) * Math.random() + (globals_1.GLOBALS.arenaHeight * 0.1);
        this.r = 20;
        this.speed = 3.5 * 60;
        this.movementQueue = [];
        this.statuses = [];
    }
    process(gameState) {
        while (this.movementQueue.length > 0) {
            this.processMove(gameState, this.movementQueue[0]);
            this.movementQueue.splice(0, 1);
        }
        // backwards to allow easy splicing
        for (let i = this.statuses.length - 1; i >= 0; i--) {
            this.statuses[i].process(gameState, this, i);
        }
    }
    processMove(gameState, move) {
        let dirSpeed = this.speed * (move.frameTime / 1000);
        if (move.isDiagonal()) {
            dirSpeed /= Math.sqrt(2);
        }
        if (move.left) {
            this.x -= dirSpeed;
        }
        if (move.right) {
            this.x += dirSpeed;
        }
        if (move.up) {
            this.y -= dirSpeed;
        }
        if (move.down) {
            this.y += dirSpeed;
        }
        this.fixPosition(gameState);
        this.lastProcessedMoveTime = move.timestamp;
    }
    fixPosition(gameState) {
        if (gameState.arenaId == arenaId_1.ArenaId.SQUARE) {
            if (gameState.wallsAreDeath() &&
                (this.x < 0 || this.x > globals_1.GLOBALS.arenaWidth || this.y < 0 || this.y > globals_1.GLOBALS.arenaHeight)) {
                gameState.messages.push(this.name + ' died to the wall');
            }
            this.x = Math.min(Math.max(this.x, 0), globals_1.GLOBALS.arenaWidth);
            this.y = Math.min(Math.max(this.y, 0), globals_1.GLOBALS.arenaHeight);
        }
        else if (gameState.arenaId == arenaId_1.ArenaId.ROUND) {
            let dist = (0, utils_1.distance)(this.x, this.y, globals_1.GLOBALS.arenaWidth / 2, globals_1.GLOBALS.arenaHeight / 2);
            if (dist > globals_1.GLOBALS.arenaWidth / 2) {
                if (gameState.wallsAreDeath()) {
                    gameState.messages.push(this.name + ' died to the wall');
                }
                let scalar = (globals_1.GLOBALS.arenaWidth / 2) / (dist);
                this.x = (this.x - (globals_1.GLOBALS.arenaWidth / 2)) * scalar + (globals_1.GLOBALS.arenaWidth / 2);
                this.y = (this.y - (globals_1.GLOBALS.arenaHeight / 2)) * scalar + (globals_1.GLOBALS.arenaHeight / 2);
            }
        }
    }
    reset() {
        this.movementQueue = [];
        this.statuses = [];
    }
    hasStatusOfType(type) {
        for (let status of this.statuses) {
            if (status.type == type) {
                return true;
            }
        }
        return false;
    }
    removeStatusOfType(type) {
        for (let i = 0; i < this.statuses.length; i++) {
            if (this.statuses[i].type == type) {
                this.statuses.splice(i, 1);
                return;
            }
        }
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map