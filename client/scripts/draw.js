var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var sendButton = document.getElementById("send");

var paths = [];
var strokeSize = 3;
var strokeColor = "#000000";

var mouseDown = false;

function clear() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPath(index) {
  let path = paths[index].getPointArray();

  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 0; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.lineWidth = strokeSize/canvas.width;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function resize() {
  let style = window.getComputedStyle(canvas, null);
  canvas.style.height = style.width;
  canvas.width = parseInt(style.width);
  canvas.height = parseInt(style.width);

  clear();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(canvas.width, canvas.height);

  for (let i = 0; i < paths.length; i++) {
    drawPath(i);
  }
}

function init() {
  resize();
}

function startDraw(point) {
  paths.push(new Path());
  paths[paths.length - 1].addPoint(point);
}

function continueDraw(point) {
  let prev = paths[paths.length - 1].getLastPoint();
  paths[paths.length - 1].addPoint(point);

  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(point.x, point.y);
  ctx.lineWidth = strokeSize/canvas.width;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function endDraw(point) {
  paths[paths.length - 1].addPoint(point);
  paths[paths.length - 1].simplify();
  //drawPath(paths.length - 1);
}

function getMousePoint(e) {
  let rect = canvas.getBoundingClientRect();
  return new Point((e.clientX - rect.left)/canvas.width, (e.clientY - rect.top)/canvas.height);
}

function getTouchPoint(e) {
  let rect = canvas.getBoundingClientRect();
  return new Point((e.pageX - canvas.offsetLeft)/canvas.width, (e.pageY - canvas.offsetTop)/canvas.height);
}

canvas.onmousedown = function(e) {
  mouseDown = true;
  startDraw(getMousePoint(e));
}

canvas.onmousemove = function(e) {
  if (mouseDown) {
    continueDraw(getMousePoint(e));
  }
}

canvas.onmouseup = function(e) {
  if (mouseDown) {
    endDraw(getMousePoint(e));
  }
  mouseDown = false;
}

canvas.onmouseout = function(e) {
  if (mouseDown) {
    endDraw(getMousePoint(e));
  }
  mouseDown = false;
}

canvas.ontouchstart = function(e) {
  e.preventDefault();
  mouseDown = true;
  startDraw(getTouchPoint(e));
}

canvas.ontouchenter = function(e) {
  e.preventDefault();
  mouseDown = true;
  startDraw(getTouchPoint(e));
}

canvas.ontouchmove = function(e) {
  e.preventDefault();
  if (mouseDown) {
    continueDraw(getTouchPoint(e));
  }
}

canvas.ontouchend = function(e) {
  e.preventDefault();
  if (mouseDown) {
    endDraw(getTouchPoint(e));
  }
  mouseDown = false;
}

canvas.ontouchcancel = function(e) {
  e.preventDefault();
  if (mouseDown) {
    endDraw(getTouchPoint(e));
  }
  mouseDown = false;
}

canvas.ontouchleave = function(e) {
  e.preventDefault();
  if (mouseDown) {
    endDraw(getTouchPoint(e));
  }
  mouseDown = false;
}

send.onclick = function() {
  socket.emit("paths", {paths: paths});
  paths = [];
  clear();
}

window.onload = init;

window.onresize = resize;
