"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPointWithinLineHitbox = exports.distancePointToLine = exports.angleBetween = exports.shuffle = exports.distance = void 0;
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
exports.distance = distance;
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
exports.shuffle = shuffle;
function angleBetween(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0);
}
exports.angleBetween = angleBetween;
function distancePointToLine(pointX, pointY, lineX1, lineY1, lineX2, lineY2) {
    let numerator = Math.abs((lineX2 - lineX1) * (lineY1 - pointY) - (lineX1 - pointX) * (lineY2 - lineY1));
    let denominator = distance(lineX1, lineY1, lineX2, lineY2);
    return numerator / denominator;
}
exports.distancePointToLine = distancePointToLine;
function isPointWithinLineHitbox(pointX, pointY, lineStartX, lineStartY, lineEndX, lineEndY, distance) {
    // Treat lineStart as origin
    let newEndX = lineEndX - lineStartX;
    let newEndY = lineEndY - lineStartY;
    let newPointX = pointX - lineStartX;
    let newPointY = pointY - lineStartY;
    // Rotate point and lineEnd so that lineEnd is on positive y-axis
    let rotationAngle = -(Math.atan2(newEndY, newEndX) - (Math.PI / 2));
    let rotatedPointX = newPointX * Math.cos(rotationAngle) - newPointY * Math.sin(rotationAngle);
    let rotatedPointY = newPointX * Math.sin(rotationAngle) + newPointY * Math.cos(rotationAngle);
    // rotatedEndX is 0
    let rotatedEndY = newEndX * Math.sin(rotationAngle) + newEndY * Math.cos(rotationAngle);
    // Check boundaries
    return Math.abs(rotatedPointX) < distance && rotatedPointY > 0 && rotatedPointY < rotatedEndY;
}
exports.isPointWithinLineHitbox = isPointWithinLineHitbox;
//# sourceMappingURL=utils.js.map