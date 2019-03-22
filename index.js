window.addEventListener("load", main);
function main() {
    let canvas = document.querySelector("canvas");
    draw(canvas);
    // setInterval(() => drawWithResize(canvas), 100)
}
function drawWithResize(canvas) {
    console.log(window.visualViewport.height);
    canvas.height = window.visualViewport.height;
    canvas.width = window.visualViewport.width;
    draw(canvas);
}
function draw(canvas) {
    let cx = canvas.getContext("2d");
    const offset = .1;
    const tr = absoluteCoordOffset(canvas, offset, offset, .5, .5);
    const xAxis = transformAll(tr, [{ x: 0, y: 0 }, { x: canvas.width, y: 0 }]);
    const yAxis = transformAll(tr, [{ x: 0, y: 0 }, { x: 0, y: canvas.height }]);
    console.log("PRINT Xaxis", canvas.width, canvas.height);
    drawAxis(cx, xAxis, "grey", 10, 10);
    console.log("PRINT Yaxis", canvas.width, canvas.height);
    drawAxis(cx, yAxis, "grey", 10, 10);
    const data = transformAll(tr, [{ x: 0, y: 0 }, { x: 100, y: 10 }, { x: 200, y: 20 }, { x: 300, y: 30 }]);
    drawLine(cx, data, "blue");
    const moarData = transformAll(tr, [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 200 }, { x: 300, y: 300 }]);
    drawLine(cx, moarData, "red");
}
function transformAll(transformFn, coords) {
    return coords.map(coord => transformFn(coord));
}
function drawLine(cx, coords, color) {
    cx.strokeStyle = color;
    cx.beginPath();
    cx.moveTo(coords[0].x, coords[0].y);
    for (const coord of coords) {
        cx.lineTo(coord.x, coord.y);
    }
    cx.stroke();
}
function drawAxis(cx, coord, color, tickTotal, tickLength) {
    console.log("INPUTS: ", coord, tickTotal, tickLength);
    drawLine(cx, coord, "grey");
    const hyp = hypotenuse(coord[0], coord[1]);
    const angle = angleOfVector(coord[0], coord[1]);
    const isVertical = approxEqual(angle, -1.5707963267948966);
    console.log("HYP", hyp, "ANGLE", angle, "VERTICAL?", isVertical);
    const tickSpace = endOfVector({ x: 0, y: 0 }, angle, (hyp / tickTotal));
    const base = { x: coord[0].x, y: coord[0].y };
    console.log("TICKSPACE", tickSpace, "BASE", base);
    for (let i = 0; i < tickTotal; i++) {
        // console.log(base);
        base.x += isVertical ? 0 : tickSpace.x;
        base.y += isVertical ? tickSpace.y : 0;
        const start = { x: base.x, y: base.y };
        const end = { x: base.x, y: base.y };
        if (isVertical) {
            start.x -= tickLength / 2;
            end.x += tickLength / 2;
        }
        else {
            start.y -= tickLength / 2;
            end.y += tickLength / 2;
        }
        console.log(isVertical, start, end);
        drawLine(cx, [start, end], "black");
    }
}
function approxEqual(n1, n2, epsilon = 0.0001) {
    return Math.abs(n1 - n2) < epsilon;
}
function hypotenuse(root, end) {
    return Math.hypot(end.x - root.x, end.y - root.y);
}
function endOfVector(root, angle, hypotenuse) {
    const opposite = Math.sin(angle) * hypotenuse;
    const adjacent = Math.cos(angle) * hypotenuse;
    return { x: root.x + adjacent, y: root.y + opposite };
    ;
}
function angleOfVector(root, end) {
    return Math.asin((end.y - root.y) / hypotenuse(root, end));
}
function absoluteCoordOffset(canvas, offsetX, offsetY, scaleX, scaleY) {
    return (coord) => {
        return { x: (coord.x * scaleX) + (canvas.width * offsetX),
            y: (canvas.height - ((coord.y * scaleY) + (canvas.height * offsetY))) };
    };
}
function relativeCoordOffset(canvas, offsetX, offsetY, scaleX, scaleY) {
    return (coord) => {
        return { x: (coord.x * scaleX) + (canvas.width * offsetX),
            y: (canvas.height - ((coord.y * scaleY) + (canvas.height * offsetY))) };
    };
}
