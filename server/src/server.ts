import * as express from "express"
import * as path from "path"
import { Intro } from "./encounter/intro"
import { P4S1 } from "./encounter/p4s1"
import { P4S2 } from "./encounter/p4s2"
import { Thordan } from "./encounter/thordan"
import { Ucob4p } from "./encounter/ucob4p"
import { GameState } from "./gamestate"
import { Stack } from "./mechanic/stack"
import { Movement } from "./movement"
import { Player } from "./player"
import { SerializedGameState } from "./serializedGameState"

const clientPath = path.join(__dirname, '/../../client')
const port = process.env.PORT || 3000

let app = express()
let server = require("http").createServer(app)
let io = require('socket.io')(server)

app.use(express.static(clientPath))

const gameState = new GameState()
gameState.godMode = false

io.on('connection', (socket: any) => {
    console.log('New connection: ', socket.id)

    socket.on('newPlayer', (playerName: string) => {

        socket.on('ping', () => {
            io.to(socket.id).emit('ping')
        })

        socket.on('reset', () => {
            console.log('resetting')
            gameState.reset()
        })

        socket.on('start', (encounter: string) => {
            console.log('starting: ' + encounter)
            gameState.reset()
            switch (encounter) {
                case 'intro':
                    gameState.encounter = new Intro()
                    break
                case 'p4s1':
                    gameState.encounter = new P4S1()
                    break
                case 'p4s2':
                    gameState.encounter = new P4S2()
                    break
                case 'thordan':
                    gameState.encounter = new Thordan()
                    break
                case 'ucob':
                    gameState.encounter = new Ucob4p()
                    break
            }
        })

        socket.on('debug', () => {
            console.log(gameState)
        })

        socket.on('test', () => {
            console.log('testing new mechanic')

            let needed = (gameState.players.size + 1) / 2 - 1 << 0
            let targets = gameState.randomPlayers(2)

            let stack1 = new Stack(needed, 75)
            let stack2 = new Stack(needed, 75)
            stack1.applyToTarget(targets[0])
            stack2.applyToTarget(targets[1])

            stack1.onComplete((gameState: GameState) => {
                let soakers1 = stack1.soakers(gameState)
                let soakers2 = stack2.soakers(gameState)
                for (let [p, player] of gameState.players) {
                    if (soakers1.includes(p) && soakers2.includes(p)) {
                        gameState.messages.push(player.name + ' died from double stacks')
                    }
                }
            })
            stack2.onComplete((gameState: GameState) => {
                let soakers1 = stack1.soakers(gameState)
                let soakers2 = stack2.soakers(gameState)
                for (let [p, player] of gameState.players) {
                    if (soakers1.includes(p) && soakers2.includes(p)) {
                        gameState.messages.push(player.name + ' died from double stacks')
                    }
                }
            })

            gameState.schedule(stack1, gameState.now, 1000)
            gameState.schedule(stack2, gameState.now, 1000)
        })

        if (gameState.players.has(playerName) || playerName == 'spec') {
            return
        }

        let player = new Player(playerName)
        console.log('New player: ', playerName)
        gameState.players.set(playerName, player)

        socket.on('playerMovement', (playerMovement: any) => {
            const player = gameState.players.get(playerName)
            player.movementQueue.push(new Movement(playerMovement))
        })

        socket.on('ready', () => {
            if (gameState.readycheck) {
                gameState.readycheck.markReady(playerName)
            }
        })

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
            gameState.players.delete(playerName)
        })
    })
})

// Process at 60 fps, but only broadcast at 30
setInterval(() => {
    gameState.process()

    if (gameState.processCounter % 2 == 0) {
        io.sockets.emit('state', new SerializedGameState(gameState).serialize())
    }
}, 1000 / 60)


server.listen(port, () => {
    console.log('Server is up on port:', port)
})