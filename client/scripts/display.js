function Display() {
  this.canvas = document.createElement("canvas");
  this.canvas.id = "canvas";
  this.canvas.style.cssText = "#canvas {width: calc(100% - 2em); max-width: 1024px; height: auto; margin: 1em;}";

  let content = document.getElementById("content");
  content.appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");

  this.paths = [];
  this.strokeSize = 3;
  this.strokeColor = "#000000";

  this.clear = function() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  this.drawPath = function(index) {
    let path = this.paths[index].getPointArray();

    this.ctx.beginPath();
    this.ctx.moveTo(path[0].x, path[0].y);
    for (let i = 0; i < path.length; i++) {
      this.ctx.lineTo(path[i].x, path[i].y);
    }
    this.ctx.lineWidth = this.strokeSize/this.canvas.width;
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.stroke();
  };

  this.resize = function() {
    let style = window.getComputedStyle(this.canvas, null);
    this.canvas.style.height = style.width;
    this.canvas.width = parseInt(style.width);
    this.canvas.height = parseInt(style.width);

    this.clear();

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.paths.length; i++) {
      this.drawPath(i);
    }
  };

  this.addPath = function(path) {
    Object.setPrototypeOf(path, Path.prototype);
    this.paths.push(path);
    this.drawPath(this.paths.length - 1);
  };

  this.init = function() {
    this.resize();
  };

  window.onresize = function(e) {
    this.resize();
  }.bind(this);

  this.delete = function() {
    window.onresize = function(e) {

    };
    let content = document.getElementById("content");
    content.removeChild(this.canvas);
  }
}