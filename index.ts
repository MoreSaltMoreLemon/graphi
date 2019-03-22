interface Coordinate {
  x: number;
  y: number;
}

window.addEventListener("load", main);

function main(): void {
  let canvas = document.querySelector("canvas");
  
  draw(canvas);

  // setInterval(() => drawWithResize(canvas), 100)
}

function drawWithResize(canvas: HTMLCanvasElement) {
  canvas.height = window.visualViewport.height;
  canvas.width = window.visualViewport.width;
  draw(canvas);
}

function draw(canvas: HTMLCanvasElement): void {
  let cx = canvas.getContext("2d");

  const offset = .1;
  const tr = absoluteCoordOffset(canvas, offset, offset, .5, .5);
  
  const xAxis = transformAll(tr, [{x: 0, y: 0}, {x: canvas.width, y: 0}]);
  const yAxis = transformAll(tr, [{x: 0, y: 0}, {x: 0, y: canvas.height}]);
  drawAxis(cx, xAxis, "grey", 10, 10);
  drawAxis(cx, yAxis, "grey", 10, 10);

  const toTheCorner = transformAll(tr, [{x: 0, y: 0}, {x: canvas.width, y: canvas.height}]);
  drawLine(cx, toTheCorner, "magenta")

  const data = transformAll(tr, [{x: 0, y: 0}, {x: 100, y: 10}, {x: 200, y: 20}, {x: 300, y: 30}]);
  drawLine(cx, data, "blue");

  const moarData = transformAll(tr, [{x: 0, y: 0}, {x: 100, y: 100}, {x: 200, y: 200}, {x: 300, y: 300}]);
  drawLine(cx, moarData, "red");

  
  const sine = transformAll(tr, genFn(Math.sin, {x: 0, y: 40}, canvas.width, 100, 50, 20));
  drawLine(cx, sine, "green");

  const cos = transformAll(tr, genFn(Math.cos, {x: 0, y: 40}, canvas.width, 100, 50, 20));
  drawLine(cx, cos, "green");

  const tan = transformAll(tr, genFn(Math.tan, {x: 0, y: 40}, canvas.width, 100, 50, 20));
  drawLine(cx, tan, "green");

  const sahir = transformAll(tr, genFn(sahirFn, {x: 0, y: 40}, canvas.width, 100, 50, 1));
  drawLine(cx, sahir, "green");
  
  const natLog = transformAll(tr, genFn(naturalLog, {x: 0, y: 40}, canvas.width, 100, 50, 1));
  drawLine(cx, natLog, "green");
}

function naturalLog(x) {
  return Math.log(x);
}

function sahirFn(x) {
  return Math.pow(Math.atan(x), 1 / 3);
}

function genFn(
  fn: Function,
  start: Coordinate, 
  end: number, 
  amplitude: number, 
  frequency: number, 
  step: number): Coordinate[] {
  const yOfX: Coordinate[] = [];
  for (; start.x < end; start.x += step) {
    yOfX.push(
       {x: start.x, 
        y: fn(start.x / frequency) * amplitude + start.y});
  }
return yOfX;
}

function genSine(
    start: Coordinate, 
    end: number, 
    amplitude: number, 
    frequency: number, 
    step: number): Coordinate[] {
  const sine: Coordinate[] = [];
  for (; start.x < end; start.x += step) {
    sine.push(
      {x: start.x, 
       y: Math.sin(start.x / frequency) * amplitude + start.y});
  }
  return sine;
}

function transformAll(
  transformFn: Function,
  coords: Coordinate[],
  ): Coordinate[] {
  return coords.map(coord => transformFn(coord));
}

function drawLine(
  cx: CanvasRenderingContext2D,
  coords: Coordinate[],
  color: string
  ): void {

  cx.strokeStyle = color;
  cx.beginPath();
  cx.moveTo(coords[0].x, coords[0].y);
  for (const coord of coords) {
    cx.lineTo(coord.x, coord.y);
  }
  cx.stroke();
}

function drawAxis(
  cx: CanvasRenderingContext2D,
  coord: Coordinate[],
  color: string,
  tickTotal: number,
  tickLength: number
): void {
  drawLine(cx, coord, "grey");
  
  const hyp = hypotenuse(coord[0], coord[1]);
  const angle = angleOfVector(coord[0], coord[1]);

  const isVertical = approxEqual(angle, -1.5707963267948966);
  
  const tickSpace = endOfVector({x: 0, y: 0}, angle, (hyp / tickTotal));
  
  const base = {x: coord[0].x, y: coord[0].y};

  for (let i = 0; i < tickTotal; i++) {

    base.x += isVertical ? 0: tickSpace.x;
    base.y += isVertical ? tickSpace.y: 0;
    
    const start = {x: base.x, y: base.y}
    const end = {x: base.x, y: base.y}

    if (isVertical) {
      start.x -= tickLength / 2;
      end.x += tickLength / 2
    } else {
      start.y -= tickLength / 2; 
      end.y += tickLength / 2;
    }

    drawLine(cx, [start, end], "black")
  }
}

function approxEqual(n1: number, n2: number, epsilon: number = 0.0001): boolean {
  return Math.abs(n1 - n2) < epsilon;
}

function hypotenuse(root: Coordinate, end: Coordinate): number {
  return Math.hypot(end.x - root.x, end.y - root.y);
}

function endOfVector(root: Coordinate, angle: number, hypotenuse: number): Coordinate {
  const opposite = Math.sin(angle) * hypotenuse;
  const adjacent = Math.cos(angle) * hypotenuse;
  
  return { x: root.x + adjacent, y: root.y + opposite };;
}

function angleOfVector(root: Coordinate, end: Coordinate): number {
  return Math.asin((end.y - root.y) / hypotenuse(root, end));
}



function absoluteCoordOffset(
  canvas: HTMLCanvasElement, 
  offsetX: number, offsetY: number, 
  scaleX: number, scaleY: number): Function {

  return (coord: Coordinate): Coordinate => {
    return {x: (coord.x * scaleX) + (canvas.width * offsetX), 
            y: (canvas.height - ((coord.y * scaleY) + (canvas.height * offsetY)))};
  }
}

function relativeCoordOffset(
  canvas: HTMLCanvasElement, 
  offsetX: number, offsetY: number, 
  scaleX: number, scaleY: number): Function {

  return (coord: Coordinate): Coordinate => {
    return {x: (coord.x * scaleX) + (canvas.width * offsetX), 
            y: (canvas.height - ((coord.y * scaleY) + (canvas.height * offsetY)))};
  }
}