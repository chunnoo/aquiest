_modules["displayDraw"] = function() {
  this.canvas = document.createElement("canvas");
  this.canvas.id = "canvas";

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
    //this.canvas.style.height = style.width;
    this.canvas.width = parseInt(style.width);
    this.canvas.height = parseInt(style.height);

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

  this.addPaths = function(paths) {
    for (let i = 0; i < paths.length; i++) {
      this.addPath(paths[i]);
    }
  }

  this.init = function(data) {
    this.resize();
    if (data.paths) {
      this.addPaths(data.paths);
    }
    if (data.animationDelay) {
      this.canvas.style.animationDelay = data.animationDelay;
    }
  };

  this.update = function(data) {
    if (data.paths) {
      this.addPaths(data.paths);
    }
    if (data.path) {
      this.addPath(data.path);
    }
  }

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.canvas);
  }
}
