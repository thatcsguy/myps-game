export function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    )
}

export function shuffle(array: Array<any>) {
    let currentIndex = array.length, randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}

export function angleBetween(x0: number, y0: number, x1: number, y1: number): number {
    return Math.atan2(y1 - y0, x1 - x0)
}

export function distancePointToLine(pointX: number, pointY: number,
    lineX1: number, lineY1: number, lineX2: number, lineY2: number): number {

    let numerator = Math.abs(
        (lineX2 - lineX1) * (lineY1 - pointY) - (lineX1 - pointX) * (lineY2 - lineY1)
    )
    let denominator = distance(lineX1, lineY1, lineX2, lineY2)
    return numerator / denominator
}

export function isPointWithinLineHitbox(pointX: number, pointY: number,
    lineStartX: number, lineStartY: number,
    lineEndX: number, lineEndY: number, distance: number): boolean {

    // Treat lineStart as origin
    let newEndX = lineEndX - lineStartX
    let newEndY = lineEndY - lineStartY
    let newPointX = pointX - lineStartX
    let newPointY = pointY - lineStartY

    // Rotate point and lineEnd so that lineEnd is on positive y-axis
    let rotationAngle = -(Math.atan2(newEndY, newEndX) - (Math.PI / 2))
    let rotatedPointX = newPointX * Math.cos(rotationAngle) - newPointY * Math.sin(rotationAngle)
    let rotatedPointY = newPointX * Math.sin(rotationAngle) + newPointY * Math.cos(rotationAngle)
    // rotatedEndX is 0
    let rotatedEndY = newEndX * Math.sin(rotationAngle) + newEndY * Math.cos(rotationAngle)

    // Check boundaries
    return Math.abs(rotatedPointX) < distance && rotatedPointY > 0 && rotatedPointY < rotatedEndY
}
export function epsilon() {
    return (Math.random() - .5) / 1000
}