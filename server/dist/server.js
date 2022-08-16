"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const e1_1 = require("./encounter/e1");
const e3_1 = require("./encounter/e3");
const e4_1 = require("./encounter/e4");
const gamestate_1 = require("./gamestate");
const stack_1 = require("./mechanic/stack");
const movement_1 = require("./movement");
const player_1 = require("./player");
const serializedGameState_1 = require("./serializedGameState");
const clientPath = path.join(__dirname, '/../../client');
const port = process.env.PORT || 3000;
let app = express();
let server = require("http").createServer(app);
let io = require('socket.io')(server);
app.use(express.static(clientPath));
const gameState = new gamestate_1.GameState();
gameState.godMode = true;
io.on('connection', (socket) => {
    console.log('New connection: ', socket.id);
    socket.on('newPlayer', (playerName) => {
        socket.on('ping', () => {
            io.to(socket.id).emit('ping');
        });
        socket.on('reset', () => {
            console.log('resetting');
            gameState.reset();
        });
        socket.on('e1', () => {
            console.log('starting E1');
            gameState.reset();
            gameState.encounter = new e1_1.E1();
        });
        socket.on('e3', () => {
            console.log('starting E3');
            gameState.reset();
            gameState.encounter = new e3_1.E3();
        });
        socket.on('e4', () => {
            console.log('starting E4');
            gameState.reset();
            gameState.encounter = new e4_1.E4();
        });
        socket.on('debug', () => {
            console.log(gameState);
        });
        socket.on('test', () => {
            console.log('testing new mechanic');
            let needed = (gameState.players.size + 1) / 2 - 1 << 0;
            let targets = gameState.randomPlayers(2);
            let stack1 = new stack_1.Stack(needed, 75);
            let stack2 = new stack_1.Stack(needed, 75);
            stack1.applyToTarget(targets[0]);
            stack2.applyToTarget(targets[1]);
            stack1.onComplete((gameState) => {
                let soakers1 = stack1.soakers(gameState);
                let soakers2 = stack2.soakers(gameState);
                for (let [p, player] of gameState.players) {
                    if (soakers1.includes(p) && soakers2.includes(p)) {
                        gameState.messages.push(player.name + ' died from double stacks');
                    }
                }
            });
            stack2.onComplete((gameState) => {
                let soakers1 = stack1.soakers(gameState);
                let soakers2 = stack2.soakers(gameState);
                for (let [p, player] of gameState.players) {
                    if (soakers1.includes(p) && soakers2.includes(p)) {
                        gameState.messages.push(player.name + ' died from double stacks');
                    }
                }
            });
            gameState.schedule(stack1, gameState.now, 1000);
            gameState.schedule(stack2, gameState.now, 1000);
        });
        if (gameState.players.has(playerName) || playerName == 'spec') {
            return;
        }
        let player = new player_1.Player(playerName);
        console.log('New player: ', playerName);
        gameState.players.set(playerName, player);
        socket.on('playerMovement', (playerMovement) => {
            const player = gameState.players.get(playerName);
            player.movementQueue.push(new movement_1.Movement(playerMovement));
        });
        socket.on('ready', () => {
            if (gameState.readycheck) {
                gameState.readycheck.markReady(playerName);
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            gameState.players.delete(playerName);
        });
    });
});
// Process at 60 fps, but only broadcast at 30
setInterval(() => {
    gameState.process();
    if (gameState.processCounter % 2 == 0) {
        io.sockets.emit('state', new serializedGameState_1.SerializedGameState(gameState).serialize());
    }
}, 1000 / 60);
server.listen(port, () => {
    console.log('Server is up on port:', port);
});
//# sourceMappingURL=server.js.map