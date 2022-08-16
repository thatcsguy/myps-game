let socket = io()

let canvas = document.getElementById('ctx')
let ctx = canvas.getContext('2d')

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 900

const ARENA_WIDTH = 800
const ARENA_HEIGHT = 800

const ARENA_OFFSET_X = 50
const ARENA_OFFSET_Y = 50

const PLAYER_SPEED = 3.5 * 60
const PLAYER_RADIUS = 20

ctx.translate(ARENA_OFFSET_X, ARENA_OFFSET_Y)

let gameState = {}
let previousGameState
let lastTickClient

let players = {}

let showPing = false
let ping = 0

const squareArena = document.getElementById('bgImg')
const roundArena = document.getElementById('stone-bg')

const thorn = document.getElementById('thorn')
const thordan = document.getElementById('thordan-img')

let playerName = prompt('Name?')
socket.emit('newPlayer', playerName)

const drawPlayers = () => {
    for (let p in players) {
        let player = players[p]

        ctx.save()
        ctx.beginPath()
        ctx.arc(player.x, player.y, player.r, 0, 2 * Math.PI, true)
        ctx.fillStyle = '#000000'
        ctx.fill()

        ctx.font = '16px sans-serif'
        ctx.fillStyle = player.name == playerName ? '#00c2c9' : '#0023a1'
        let text = ctx.measureText(player.name)
        ctx.fillText(player.name, player.x - text.width / 2, player.y - player.r * 1.3)

        for (let status of player.statuses) {

            let remainingStr = (1 + (status.start + status.duration - gameState.duration) / 1000) << 0

            switch (status.type) {
                case 'PURPLE_SHIELD':
                    ctx.drawImage(document.getElementById('purple-shield'), player.x - 12, player.y - 12, 24, 24)
                    break
                case 'YELLOW_SHIELD':
                    ctx.drawImage(document.getElementById('yellow-shield'), player.x - 12, player.y - 12, 24, 24)
                    break
                case 'RED_SHIELD':
                    ctx.drawImage(document.getElementById('red-shield'), player.x - 12, player.y - 12, 24, 24)
                    break
                case 'BLUE_SHIELD':
                    ctx.drawImage(document.getElementById('blue-shield'), player.x - 12, player.y - 12, 24, 24)
                    break
                case 'DROPPING_PUDDLES':
                    if (status.stacks > 0) {
                        ctx.font = '16px sans-serif'
                        ctx.fillStyle = 'white'
                        let text = ctx.measureText(status.stacks)
                        ctx.fillText(status.stacks, player.x - text.width / 2, player.y + 8)
                    }
                    break
                case 'SIMPLE_COUNTDOWN':
                    ctx.font = '16px sans-serif'
                    ctx.fillStyle = 'white'
                    let text = ctx.measureText(remainingStr)
                    ctx.fillText(remainingStr, player.x - text.width / 2, player.y + 8)
                    break
            }
        }
        ctx.restore()
    }
}

const drawSpread = (mech, progress) => {
    ctx.save()
    ctx.beginPath()
    let player = players[mech.target]
    ctx.arc(player.x, player.y, mech.r, 0, 2 * Math.PI)

    let gradient = ctx.createRadialGradient(player.x, player.y, mech.r - 20,
        player.x, player.y, mech.r + 1)

    gradient.addColorStop(0, 'rgba(255, 138, 228, 0)')
    gradient.addColorStop(.84, 'rgba(255, 138, 228, 1)')
    gradient.addColorStop(.9, 'white')
    gradient.addColorStop(1, 'rgba(255, 138, 228, 1)')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()
}

const drawDoomCircle = (mech, progress) => {
    let player = players[mech.target]

    ctx.save()

    ctx.beginPath()
    ctx.arc(player.x, player.y, mech.r, 0, 2 * Math.PI)
    ctx.lineWidth = 6
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 6
    ctx.strokeStyle = 'black'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(player.x, player.y, mech.r, -Math.PI / 2, progress * 2 * Math.PI - Math.PI / 2)
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(165, 21, 2, 1)'
    ctx.stroke()
    ctx.restore()
}

const drawConal = (mech, progress) => {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(mech.x, mech.y)
    ctx.lineTo(
        mech.x + mech.r * Math.cos(mech.direction - .5 * mech.width),
        mech.y + mech.r * Math.sin(mech.direction - .5 * mech.width),
    )
    ctx.arc(
        mech.x,
        mech.y,
        mech.r,
        mech.direction - .5 * mech.width,
        mech.direction + .5 * mech.width,
    )
    ctx.lineTo(mech.x, mech.y)
    ctx.closePath()

    let gradient = ctx.createRadialGradient(mech.x, mech.y, 0, mech.x, mech.y, mech.r)
    gradient.addColorStop(0, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.95, 'rgba(255, 159, 25, .6)')
    gradient.addColorStop(1, 'rgba(255, 224, 138, .8)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(mech.x, mech.y)
    ctx.lineTo(
        mech.x + mech.r * progress * Math.cos(mech.direction - .5 * mech.width),
        mech.y + mech.r * progress * Math.sin(mech.direction - .5 * mech.width),
    )
    ctx.arc(
        mech.x,
        mech.y,
        mech.r * progress,
        mech.direction - .5 * mech.width,
        mech.direction + .5 * mech.width,
    )

    gradient = ctx.createRadialGradient(mech.x, mech.y, 0, mech.x, mech.y, mech.r * progress)
    gradient.addColorStop(0, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(1, 'rgba(255, 136, 25, .6)')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.restore()
}

const drawDynamo = (mech, progress) => {
    ctx.save()

    // Scale the inner to outer radius for visual effect
    let rScaler = 1
    if (mech.duration > 500 && (mech.duration * progress) < 200) {
        rScaler = (mech.duration * progress) / 200
    }

    let outerR = mech.r1 + (mech.r2 - mech.r1) * rScaler

    let gradient = ctx.createRadialGradient(mech.x, mech.y, mech.r1,
        mech.x, mech.y, outerR)
    gradient.addColorStop(1, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.12, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.05, 'rgba(255, 159, 25, .6)')
    gradient.addColorStop(0, 'rgba(255, 224, 138, .8)')
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.arc(mech.x, mech.y, outerR, 0, 2 * Math.PI, false)
    ctx.arc(mech.x, mech.y, mech.r1, 0, 2 * Math.PI, true)
    ctx.fill()


    let progR = mech.r1 + (1 - progress) * (mech.r2 - mech.r1) * rScaler

    gradient = ctx.createRadialGradient(mech.x, mech.y, progR,
        mech.x, mech.y, outerR)
    gradient.addColorStop(1, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(.12, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(0, 'rgba(255, 136, 25, .6)')
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.arc(mech.x, mech.y, progR, 0, 2 * Math.PI, false)
    ctx.arc(mech.x, mech.y, outerR, 0, 2 * Math.PI, true)
    ctx.fill()


    ctx.restore()
}

const drawChariot = (mech, progress) => {
    ctx.save()

    let rScaler = 1
    if (mech.duration > 500 && (mech.duration * progress) < 200) {
        rScaler = (mech.duration * progress) / 200
    }

    ctx.beginPath()
    ctx.arc(mech.x, mech.y, mech.r * rScaler, 0, 2 * Math.PI)

    let gradient = ctx.createRadialGradient(mech.x, mech.y, 0,
        mech.x, mech.y, mech.r * rScaler)

    gradient.addColorStop(0, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.95, 'rgba(255, 159, 25, .6)')
    gradient.addColorStop(1, 'rgba(255, 224, 138, .8)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    let progR = progress * mech.r * rScaler
    ctx.arc(mech.x, mech.y, progR * rScaler, 0, 2 * Math.PI)

    gradient = ctx.createRadialGradient(mech.x, mech.y, 0,
        mech.x, mech.y, progR * rScaler)

    gradient.addColorStop(0, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(1, 'rgba(255, 136, 25, .6)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.restore()
}

const drawPuddle = (mech, progress) => {
    ctx.save()

    ctx.fillStyle = 'rgba(57, 0, 92, .3)'
    ctx.beginPath()
    ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = 'rgba(57, 0, 92, .8)'
    ctx.beginPath()
    ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.restore()
}

const drawMarker = (mech, progress) => {
    ctx.save()

    if (mech.img == 1) {
        let fallDuration = 300
        let fallDistance = 1000
        let shrinkDuration = 300

        let x = mech.x
        let y = mech.y
        let width = 83
        let height = 213
        if (progress * mech.duration < fallDuration) {
            y -= (fallDuration - progress * mech.duration) / fallDuration * fallDistance
        } else if (progress * mech.duration > mech.duration - shrinkDuration) {
            let scalar = 1 - ((progress * mech.duration) - (mech.duration - shrinkDuration)) / shrinkDuration
            width *= scalar
            height *= scalar
        } else {
            ctx.fillStyle = 'red'
            ctx.beginPath()
            ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
            ctx.fill()
        }
        ctx.drawImage(thorn, x - width / 2, y - height, width, height)
    } else if (mech.img == 2) {

        let x = mech.x
        let y = mech.y
        let width = 90
        let height = 110

        ctx.beginPath()
        ctx.arc(x, y, width / 3, 0, 2 * Math.PI)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.drawImage(thordan, x - width * 2 / 3, y - height * 9 / 10, width, height)
    } else if (mech.img == 3) {
        ctx.fillStyle = 'rgba(12, 11, 59, .6)'
        ctx.strokeStyle = '#2320b3'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    } else {
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
        ctx.fill()
    }

    ctx.restore()
}

const drawKnockback = (mech, progress) => {
    ctx.save()

    ctx.fillStyle = 'white'

    ctx.translate(mech.x, mech.y)

    ctx.beginPath()
    let offset = 8 * (((gameState.now - mech.start) * 3 / 1000) % 1)
    let tip = 8
    for (let i = 0; i < 8; i++) {

        for (let a = 1; a <= 3; a++) {
            ctx.moveTo(a * tip + offset, a * tip + offset)

            ctx.beginPath()
            ctx.lineTo(a * tip + offset, a * tip + offset - 8)
            ctx.lineTo(a * tip + offset - 8, a * tip + offset)
            ctx.lineTo(a * tip + offset, a * tip + offset)
            ctx.fill()
        }
        ctx.rotate(Math.PI / 4)
    }
    ctx.restore()
}

const drawStack = (mech, progress) => {
    ctx.save()

    let player = players[mech.target]
    let minPoint = 20
    let maxPoint = 40
    let arrowDiff = 20
    let tipLength = 20

    let r = minPoint + (maxPoint - minPoint) * (1 - (((gameState.now - mech.start) * 2 / 1000) % 1))

    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.arc(player.x, player.y, mech.r, 0, Math.PI * 2)
    ctx.stroke()

    ctx.translate(player.x, player.y)

    let gradientCenter = r + arrowDiff + tipLength
    let gradient = ctx.createRadialGradient(
        gradientCenter, gradientCenter, 0,
        gradientCenter, gradientCenter, arrowDiff + tipLength + arrowDiff)
    gradient.addColorStop(.3, 'rgba(250, 161, 27, .1)')
    gradient.addColorStop(.65, 'rgba(250, 161, 27, .7)')
    gradient.addColorStop(.85, 'white')
    ctx.fillStyle = gradient

    for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        ctx.moveTo(r, r + tipLength)
        ctx.lineTo(r, r)
        ctx.lineTo(r + tipLength, r)
        ctx.lineTo(r + arrowDiff + tipLength, r + arrowDiff)
        ctx.lineTo(r + arrowDiff, r + arrowDiff)
        ctx.lineTo(r + arrowDiff, r + arrowDiff + tipLength)
        ctx.closePath()
        ctx.fill()

        ctx.rotate(Math.PI / 2)
    }


    ctx.restore()
}

const drawTower = (mech, progress) => {
    ctx.save()

    ctx.save()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 6
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 15

    ctx.beginPath()
    ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI, true)
    ctx.stroke()
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = '#ff9f19'
    ctx.lineWidth = 4
    ctx.setLineDash([20, 3, 3, 3, 3, 3, 3, 3])

    ctx.beginPath()
    let offset = Math.PI * (progress * mech.duration) / 3000
    ctx.arc(mech.x, mech.y, mech.r, offset, offset + 2 * Math.PI)
    ctx.stroke()
    ctx.restore()

    ctx.beginPath()
    ctx.font = (mech.r / 2 << 0) + 'px sans-serif'
    let message = "" + mech.playersNeeded
    let text = ctx.measureText(message)

    ctx.fillStyle = '#ff9f19'
    ctx.fillText(message, mech.x - text.width / 2, mech.y + mech.r / 5)
    ctx.strokeStyle = 'black'
    ctx.strokeText(message, mech.x - text.width / 2, mech.y + mech.r / 5)

    ctx.restore()
}

const drawPassableTether = (mech, progress) => {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'yellow'
    ctx.moveTo(mech.x, mech.y)
    ctx.lineTo(players[mech.target].x, players[mech.target].y)
    ctx.stroke()
    ctx.restore()
}

const drawChain = (mech, progress) => {
    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = (mech.opt && mech.opt.c) || 'red'
    ctx.moveTo(players[mech.target1].x, players[mech.target1].y)
    ctx.lineTo(players[mech.target2].x, players[mech.target2].y)
    ctx.stroke()

    let showStretch = true
    if (mech.opt && mech.opt.s == false) {
        showStretch = false
    }
    if (showStretch && !mech.safe) {
        ctx.translate(
            (players[mech.target1].x + players[mech.target2].x) / 2,
            (players[mech.target1].y + players[mech.target2].y) / 2)
        ctx.rotate(Math.atan2(
            players[mech.target2].y - players[mech.target1].y,
            players[mech.target2].x - players[mech.target1].x))

        ctx.strokeStyle = 'rgba(212, 148, 207, .5)'

        let dist = distance(
            players[mech.target1].x, players[mech.target1].y,
            players[mech.target2].x, players[mech.target2].y)
        let arrowLength = 25
        for (let i = 30; i < dist / 2; i += 30) {
            ctx.beginPath()
            ctx.moveTo(i - arrowLength, -10)
            ctx.lineTo(i, 0)
            ctx.lineTo(i - arrowLength, 10)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(-i + arrowLength, -10)
            ctx.lineTo(-i, 0)
            ctx.lineTo(-i + arrowLength, 10)
            ctx.stroke()
        }
    }
    ctx.restore()
}

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const drawPointTether = (mech, progress) => {
    let player = players[mech.target]
    let safe = true
    if (mech.len > 0) {
        safe = distance(player.x, player.y, mech.x, mech.y) >= mech.len
    }

    ctx.save()
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgb(125, 56, 150)'
    ctx.moveTo(mech.x, mech.y)
    ctx.lineTo(player.x, player.y)
    ctx.stroke()

    if (!safe && (!mech.opt || mech.opt.s !== false)) {
        ctx.translate((mech.x + player.x) / 2, (mech.y + player.y) / 2)
        ctx.rotate(Math.atan2(player.y - mech.y, player.x - mech.x))

        ctx.strokeStyle = 'rgba(212, 148, 207, .5)'

        let dist = distance(player.x, player.y, mech.x, mech.y)
        let arrowLength = 25
        for (let i = 30; i < dist / 2; i += 30) {
            ctx.beginPath()
            ctx.moveTo(i - arrowLength, -10)
            ctx.lineTo(i, 0)
            ctx.lineTo(i - arrowLength, 10)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(-i + arrowLength, -10)
            ctx.lineTo(-i, 0)
            ctx.lineTo(-i + arrowLength, 10)
            ctx.stroke()
        }
    }
    ctx.restore()
}

const drawLineAOE = (mech, progress) => {
    ctx.save()
    let angle = Math.atan2(mech.endY - mech.startY, mech.endX - mech.startX)
    let length = distance(mech.startX, mech.startY, mech.endX, mech.endY)

    ctx.translate(mech.startX, mech.startY)
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.moveTo(0, -mech.width / 2)
    ctx.lineTo(length, -mech.width / 2)
    ctx.lineTo(length, mech.width / 2)
    ctx.lineTo(0, mech.width / 2)
    ctx.closePath()

    let gradient = ctx.createLinearGradient(0, 0, length, 0)
    gradient.addColorStop(0, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 159, 25, .2)')
    gradient.addColorStop(.95, 'rgba(255, 159, 25, .6)')
    gradient.addColorStop(1, 'rgba(255, 224, 138, .8)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -mech.width / 2)
    ctx.lineTo(length * progress, -mech.width / 2)
    ctx.lineTo(length * progress, mech.width / 2)
    ctx.lineTo(0, mech.width / 2)
    ctx.closePath()

    gradient = ctx.createLinearGradient(0, 0, length * progress, 0)
    gradient.addColorStop(0, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(.88, 'rgba(255, 136, 25, .2)')
    gradient.addColorStop(1, 'rgba(255, 136, 25, .6)')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.restore()
}

const drawPinaxSquare = (mech, progress) => {
    ctx.save()
    switch (mech.element) {
        case 'FIRE':
            ctx.fillStyle = 'rgba(250, 147, 12, .3)'
            break
        case 'WATER':
            ctx.fillStyle = 'rgba(168, 178, 189, .3)'
            break
        case 'LIGHTNING':
            ctx.fillStyle = 'rgba(28, 130, 232, .3)'
            break
        case 'POISON':
            ctx.fillStyle = 'rgba(67, 191, 0, .3)'
            break
    }
    ctx.fillRect(mech.x, mech.y, mech.width, mech.height)

    if (mech.active) {
        ctx.strokeStyle = 'rgba(0,0,0,.6)'
        ctx.lineWidth = 5
        ctx.setLineDash([20])

        ctx.beginPath()
        let offset = 2 * Math.PI * (((progress * mech.duration) / 3000) % 1)
        ctx.arc(mech.x + mech.width / 2, mech.y + mech.height / 2, mech.width / 4, offset, offset + 2 * Math.PI)
        ctx.stroke()
    }

    ctx.restore()
}

const drawHomingOrb = (mech, progress) => {
    ctx.save()

    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(255,255,255,.5)'
    ctx.moveTo(mech.x, mech.y)
    ctx.lineTo(players[mech.target].x, players[mech.target].y)
    ctx.stroke()

    let gradient = ctx.createRadialGradient(
        mech.x + 5, mech.y - 5, 3,
        mech.x, mech.y, mech.r)
    gradient.addColorStop(0, 'lightgrey')
    gradient.addColorStop(1, mech.options.color)
    ctx.fillStyle = gradient

    ctx.beginPath()
    ctx.arc(mech.x, mech.y, mech.r, 0, 2 * Math.PI)
    ctx.fill()

    ctx.restore()
}

const drawTwister = (mech, progress) => {
    ctx.save()

    ctx.lineWidth = 2
    ctx.strokeStyle = '#03C03C'

    ctx.moveTo(mech.x, mech.y)
    ctx.beginPath()
    for (let i = 0; i < 20; i += .2) {
        ctx.lineTo(
            mech.x + i * Math.cos(3 * 2 * Math.PI * i / 20),
            mech.y + i * Math.sin(3 * 2 * Math.PI * i / 20),
        )
    }
    ctx.stroke()

    ctx.restore()
}

const drawCastbar = (mech, progress) => {
    ctx.save()

    let border = 3

    ctx.fillStyle = 'black'
    ctx.fillRect(
        mech.x - 100,
        mech.y,
        200,
        10)

    ctx.fillStyle = 'red'
    ctx.fillRect(
        mech.x - 100 + border,
        mech.y + border,
        (200 - 2 * border) * progress,
        10 - border * 2)

    ctx.font = '20px sans-serif'

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 4
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 2
    ctx.strokeText(
        mech.spellName,
        mech.x - 97,
        mech.y - 3)

    ctx.fillStyle = 'white'
    ctx.fillText(
        mech.spellName,
        mech.x - 97,
        mech.y - 3)

    ctx.restore()
}

const drawMessages = () => {
    if (!gameState.ms || gameState.ms == 0) {
        return
    }

    ctx.save()
    ctx.translate(-ARENA_OFFSET_X, -ARENA_OFFSET_Y)
    ctx.fillStyle = 'rgba(0,0,0,.6)'
    ctx.beginPath()
    ctx.rect(0, CANVAS_HEIGHT * 3 / 16, CANVAS_WIDTH, CANVAS_HEIGHT / 8)
    ctx.fill()

    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    for (let i = 0; i < gameState.ms.length; i++) {
        let message = gameState.ms[i]
        let text = ctx.measureText(message)
        ctx.fillText(message, CANVAS_WIDTH / 2 - text.width / 2, CANVAS_HEIGHT / 4 + 20 * i)
    }
    ctx.restore()
}

const drawReadyCheck = () => {
    if (!gameState.rc) {
        return
    }

    ctx.save()
    ctx.translate(ARENA_WIDTH / 2 - 100, ARENA_HEIGHT / 2 - 100)
    ctx.fillStyle = 'rgba(0,0,0,.6)'
    ctx.beginPath()
    ctx.rect(0, 0, 200, (Object.keys(players).length - 1) * 22 + 65)
    ctx.fill()

    let centerX = 100

    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'

    let title = 'Press (R) when ready'
    let text = ctx.measureText(title)
    ctx.fillText(title, centerX - text.width / 2, 25)

    let i = 0
    for (let p in players) {
        let name = players[p].name
        ctx.fillStyle = 'white'
        ctx.fillText(name, 20, i * 22 + 50)

        if (gameState.rc.ready.includes(name)) {
            let str = 'READY'
            let text = ctx.measureText(str)
            ctx.fillStyle = 'green'
            ctx.fillText(str, 200 - 20 - text.width, i * 22 + 50)
        } else {
            let str = 'WAITING'
            let text = ctx.measureText(str)
            ctx.fillStyle = 'gray'
            ctx.fillText(str, 200 - 20 - text.width, i * 22 + 50)
        }
        i++
    }
    ctx.restore()
}

const drawPing = () => {
    if (!showPing || ping == 0) {
        return
    }

    ctx.save()
    let str = ping + 'ms'
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif 100'
    let text = ctx.measureText(str)
    ctx.translate(-ARENA_OFFSET_X, -ARENA_OFFSET_Y)
    ctx.fillText(str, CANVAS_WIDTH - text.width - 3, CANVAS_HEIGHT - 3)
    ctx.restore()
}

const drawArena = () => {

    if (gameState.ar == 0) {
        ctx.drawImage(squareArena, 0, 0, ARENA_WIDTH, ARENA_HEIGHT)

        if (gameState.dw) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(ARENA_WIDTH, 0)
            ctx.lineTo(ARENA_WIDTH, ARENA_HEIGHT)
            ctx.lineTo(0, ARENA_HEIGHT)
            ctx.closePath()
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        }
    }


    if (gameState.ar == 1) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, ARENA_WIDTH / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(roundArena, 0, 0, ARENA_WIDTH, ARENA_HEIGHT)
        ctx.restore()

        if (gameState.dw) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(ARENA_WIDTH / 2, ARENA_HEIGHT / 2, ARENA_WIDTH / 2, 0, Math.PI * 2)
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        }
    }
}

const handleAnimation = (mech, progress) => {
    ctx.save()
    if (mech.key == 0) {
        ctx.fillStyle = '#454545'
        ctx.strokeStyle = 'black'

        let scale = 1
        if (progress < .2) {
            scale = progress * 5
        } else if (progress >= .8) {
            scale = (1 - progress) * 5
        }
        ctx.fillRect(0, 0, ARENA_WIDTH / 2 * scale, ARENA_HEIGHT / 2)
        ctx.fillRect(ARENA_WIDTH / 2, 0, ARENA_WIDTH / 2, ARENA_HEIGHT / 2 * scale)
        ctx.fillRect(ARENA_WIDTH / 2 * (2 - scale), ARENA_HEIGHT / 2, ARENA_WIDTH / 2 * scale, ARENA_HEIGHT / 2)
        ctx.fillRect(0, ARENA_HEIGHT / 2 * (2 - scale), ARENA_WIDTH / 2, ARENA_HEIGHT / 2 * scale)

        ctx.strokeRect(0, 0, ARENA_WIDTH / 2 * scale, ARENA_HEIGHT / 2)
        ctx.strokeRect(ARENA_WIDTH / 2, 0, ARENA_WIDTH / 2, ARENA_HEIGHT / 2 * scale)
        ctx.strokeRect(ARENA_WIDTH / 2 * (2 - scale), ARENA_HEIGHT / 2, ARENA_WIDTH / 2 * scale, ARENA_HEIGHT / 2)
        ctx.strokeRect(0, ARENA_HEIGHT / 2 * (2 - scale), ARENA_WIDTH / 2, ARENA_HEIGHT / 2 * scale)

    } else if (mech.key == 1) {
        let arrowTip = 10
        ctx.lineWidth = 3
        ctx.strokeStyle = 'white'

        ctx.translate(mech.options.x, mech.options.y)

        if (mech.options.ccw) {
            ctx.scale(-1, 1)
        }

        ctx.rotate(2 * Math.PI * (((progress * mech.duration) / 1700) % 1))

        for (let i = 0; i < 4; i++) {
            ctx.beginPath()
            ctx.moveTo(0 + arrowTip, mech.options.r - arrowTip)
            ctx.lineTo(0, mech.options.r)
            ctx.lineTo(0 + arrowTip, mech.options.r + arrowTip)
            ctx.arc(0, 0, mech.options.r, Math.PI / 2, Math.PI / 8, true)
            ctx.stroke()
            ctx.rotate(Math.PI / 2)
        }
    }
    ctx.restore()
}

socket.on('state', (serverGameState) => {

    lastTickClient = Date.now()

    for (let p in serverGameState.pl) {
        let player = serverGameState.pl[p]
        // Server reconcilliation
        if (player.name == playerName) {
            let j = 0
            while (j < movementBuffer.length) {
                var move = movementBuffer[j]
                if (move.timestamp <= player.lastProcessedMoveTime) {
                    // Already processed. Its effect is already taken into account into the world update
                    // we just got, so we can drop it.
                    movementBuffer.splice(j, 1)
                } else {
                    // Not processed by the server yet. Re-apply it.
                    applyMove(player, move)
                    j++
                }
            }
        }
    }

    previousGameState = gameState
    gameState = serverGameState
})

const applyMove = (player, move) => {
    let dirSpeed = PLAYER_SPEED * move.frameTime / 1000

    if ((move.left || move.right) && (move.up || move.down)) {
        dirSpeed /= Math.sqrt(2)
    }

    if (move.left) {
        player.x -= dirSpeed
    }
    if (move.right) {
        player.x += dirSpeed
    }
    if (move.up) {
        player.y -= dirSpeed
    }
    if (move.down) {
        player.y += dirSpeed
    }

    if (gameState.ar == 0) {
        if (player.x < 0) {
            player.x = 0
        }
        if (player.x > ARENA_WIDTH) {
            player.x = ARENA_WIDTH
        }

        if (player.y < 0) {
            player.y = 0
        }
        if (player.y > ARENA_HEIGHT) {
            player.y = ARENA_HEIGHT
        }
    } else if (gameState.ar == 1) {
        let dist = distance(player.x, player.y, ARENA_WIDTH / 2, ARENA_HEIGHT / 2)
        if (dist > ARENA_WIDTH / 2) {
            let scalar = (ARENA_WIDTH / 2) / (dist)
            player.x = (player.x - (ARENA_WIDTH / 2)) * scalar + (ARENA_WIDTH / 2)
            player.y = (player.y - (ARENA_HEIGHT / 2)) * scalar + (ARENA_HEIGHT / 2)
        }
    }
}

const playerMovement = {
    timestamp: 0,
    frameTime: 0,
    up: false,
    down: false,
    left: false,
    right: false
}
let movementBuffer = []

const keyDownHandler = (e) => {
    if (e.repeat) { return }
    if (e.keyCode == 68) {
        playerMovement.right = true
    } else if (e.keyCode == 65) {
        playerMovement.left = true
    } else if (e.keyCode == 87) {
        playerMovement.up = true
    } else if (e.keyCode == 83) {
        playerMovement.down = true
    } else if (e.keyCode = 82) { // R
        socket.emit('ready')
    }
}
const keyUpHandler = (e) => {
    if (e.keyCode == 68) {
        playerMovement.right = false
    } else if (e.keyCode == 65) {
        playerMovement.left = false
    } else if (e.keyCode == 87) {
        playerMovement.up = false
    } else if (e.keyCode == 83) {
        playerMovement.down = false
    }
}

document.addEventListener('keydown', keyDownHandler, true)
document.addEventListener('keyup', keyUpHandler, true)


const calcPlayerPositions = () => {
    players = {}
    for (let p in gameState.pl) {
        let player = gameState.pl[p]

        players[p] = {
            name: player.name,
            r: player.r,
            speed: player.speed,
            statuses: player.statuses
        }

        // local player is predicted elsewhere
        if (playerName == player.name ||
            !previousGameState || !previousGameState.pl || !previousGameState.pl[p]) {
            players[p].x = player.x
            players[p].y = player.y
        } else {
            let tickProgress = (Date.now() - lastTickClient) / (gameState.now - previousGameState.now)
            tickProgress = Math.min(tickProgress, 1)
            players[p].x = previousGameState.pl[p].x + tickProgress * (gameState.pl[p].x - previousGameState.pl[p].x)
            players[p].y = previousGameState.pl[p].y + tickProgress * (gameState.pl[p].y - previousGameState.pl[p].y)
        }
    }
}

setInterval(() => {

    let now = Date.now()
    playerMovement.frameTime = frameTime = now - playerMovement.timestamp
    playerMovement.timestamp = now
    socket.emit('playerMovement', playerMovement)

    let copiedMovement = Object.assign({}, playerMovement)
    movementBuffer.push(copiedMovement)
    while (movementBuffer.length > 30) {
        movementBuffer.shift()
    }

    // calc movement
    if (gameState && gameState.pl && gameState.pl[playerName]) {
        applyMove(gameState.pl[playerName], playerMovement)
    }

    window.requestAnimationFrame(() => {

        calcPlayerPositions()

        ctx.save()
        ctx.fillStyle = '#02082b'
        ctx.fillRect(-ARENA_OFFSET_X, -ARENA_OFFSET_Y, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.restore()

        drawArena()

        let playersDrawn = false

        // Mehanics are sorted by increasing draw priority on the server
        for (let e in gameState.mc) {
            let mech = gameState.mc[e]


            //let progress = (gameState.now - mech.start) / mech.duration
            let progress = ((gameState.now + Date.now() - lastTickClient) - mech.start) / mech.duration
            if (progress >= 1) {
                continue
            }

            // Draw the players as soon as we find a mechanic intended to be above them
            if (!playersDrawn && mech.dp > 2) {
                drawPlayers()
                playersDrawn = true
            }

            switch (mechIds[mech.id]) {
                case 'conal':
                    drawConal(mech, progress)
                    break
                case 'passable-tether':
                    drawPassableTether(mech, progress)
                    break
                case 'dynamo':
                    drawDynamo(mech, progress)
                    break
                case 'knockback':
                    drawKnockback(mech, progress)
                    break
                case 'tower':
                    drawTower(mech, progress)
                    break
                case 'chariot':
                    drawChariot(mech, progress)
                    break
                case 'chain':
                    drawChain(mech, progress)
                    break
                case 'spread':
                    drawSpread(mech, progress)
                    break
                case 'puddle':
                    drawPuddle(mech, progress)
                    break
                case 'marker':
                    drawMarker(mech, progress)
                    break
                case 'stack':
                    drawStack(mech, progress)
                    break
                case 'point-tether':
                    drawPointTether(mech, progress)
                    break
                case 'line-aoe':
                    drawLineAOE(mech, progress)
                    break
                case 'pinax-square':
                    drawPinaxSquare(mech, progress)
                    break
                case 'castbar':
                    drawCastbar(mech, progress)
                    break
                case 'animation':
                    handleAnimation(mech, progress)
                    break
                case 'doom-circle':
                    drawDoomCircle(mech, progress)
                    break
                case 'homing-orb':
                    drawHomingOrb(mech, progress)
                    break
                case 'twister':
                    drawTwister(mech, progress)
                    break
            }
        }

        // Ensure players get drawn
        if (!playersDrawn) {
            drawPlayers()
            playersDrawn = true
        }

        drawMessages()
        drawReadyCheck()
        drawPing()
    })
}, 1000 / 60)

setInterval(() => {
    pingStart = Date.now()
    socket.emit('ping')
}, 1000)


document.getElementById('debug').addEventListener('click', () => {
    console.log(gameState)
    socket.emit('debug')
})

document.getElementById('test').addEventListener('click', () => {
    socket.emit('test')
})

document.getElementById('intro').addEventListener('click', () => {
    socket.emit('start', 'intro')
})

document.getElementById('p4s1').addEventListener('click', () => {
    socket.emit('start', 'p4s1')
})

document.getElementById('p4s2').addEventListener('click', () => {
    socket.emit('start', 'p4s2')
})

document.getElementById('thordan').addEventListener('click', () => {
    socket.emit('start', 'thordan')
})

document.getElementById('ucob').addEventListener('click', () => {
    socket.emit('start', 'ucob')
})

document.getElementById('reset').addEventListener('click', () => {
    socket.emit('reset')
})



let pingStart = 0

document.getElementById('ping').addEventListener('click', () => {
    pingStart = Date.now()
    showPing = !showPing
})

socket.on('ping', () => {
    ping = Date.now() - pingStart
})

const mechIds = {
    0: 'animation',
    1: 'castbar',
    2: 'chain',
    3: 'chariot',
    4: 'conal',
    5: 'doom-circle',
    6: 'dynamo',
    7: 'homing-orb',
    8: 'knockback',
    9: 'line-aoe',
    10: 'marker',
    11: 'passable-tether',
    12: 'pinax-square',
    13: 'puddle',
    14: 'spread',
    15: 'stack',
    16: 'point-tether',
    17: 'tower',
    18: 'twister'
}