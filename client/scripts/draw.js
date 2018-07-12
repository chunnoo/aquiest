function Draw() {
  this.canvas = document.createElement("canvas");
  this.canvas.id = "canvas";
  this.sendButton = document.createElement("button");
  this.sendButton.id = "send";
  this.sendButton.innerHTML = "Send";

  let content = document.getElementById("content");
  content.appendChild(this.canvas);
  content.appendChild(this.sendButton);

  this.ctx = this.canvas.getContext("2d");

  this.paths = [];
  this.strokeSize = 3;
  this.strokeColor = "#000000";

  this.mouseDown = false;

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
    this.canvas.height = parseInt(style.height);

    this.clear();

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.paths.length; i++) {
      this.drawPath(i);
    }
  };

  this.init = function() {
    this.resize();
  };

  this.startDraw = function(point) {
    this.paths.push(new Path());
    this.paths[this.paths.length - 1].addPoint(point);
  };

  this.continueDraw = function(point) {
    let prev = this.paths[this.paths.length - 1].getLastPoint();
    this.paths[this.paths.length - 1].addPoint(point);

    this.ctx.beginPath();
    this.ctx.moveTo(prev.x, prev.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.lineWidth = this.strokeSize/this.canvas.width;
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.stroke();
  };

  this.endDraw = function(point) {
    this.paths[this.paths.length - 1].addPoint(point);
    this.paths[this.paths.length - 1].simplify();
    //drawPath(paths.length - 1);
  };

  this.getMousePoint = function(e) {
    let rect = this.canvas.getBoundingClientRect();
    return new Point((e.clientX - rect.left)/this.canvas.width, (e.clientY - rect.top)/this.canvas.height);
  };

  this.getTouchPoint = function(e) {
    let rect = this.canvas.getBoundingClientRect();
    return new Point((e.pageX - this.canvas.offsetLeft)/this.canvas.width, (e.pageY - this.canvas.offsetTop)/this.canvas.height);
  };

  this.canvas.onmousedown = function(e) {
    this.mouseDown = true;
    this.startDraw(this.getMousePoint(e));
  }.bind(this);

  this.canvas.onmousemove = function(e) {
    if (this.mouseDown) {
      this.continueDraw(this.getMousePoint(e));
    }
  }.bind(this);

  this.canvas.onmouseup = function(e) {
    if (this.mouseDown) {
      this.endDraw(this.getMousePoint(e));
    }
    this.mouseDown = false;
  }.bind(this);

  this.canvas.onmouseout = function(e) {
    if (this.mouseDown) {
      this.endDraw(this.getMousePoint(e));
    }
    this.mouseDown = false;
  }.bind(this);

  this.canvas.ontouchstart = function(e) {
    e.preventDefault();
    this.mouseDown = true;
    this.startDraw(this.getTouchPoint(e));
  }.bind(this);

  this.canvas.ontouchenter = function(e) {
    e.preventDefault();
    this.mouseDown = true;
    this.startDraw(this.getTouchPoint(e));
  }.bind(this);

  this.canvas.ontouchmove = function(e) {
    e.preventDefault();
    if (this.mouseDown) {
      this.continueDraw(this.getTouchPoint(e));
    }
  }.bind(this);

  this.canvas.ontouchend = function(e) {
    e.preventDefault();
    if (this.mouseDown) {
      this.endDraw(this.getTouchPoint(e));
    }
    this.mouseDown = false;
  }.bind(this);

  this.canvas.ontouchcancel = function(e) {
    e.preventDefault();
    if (this.mouseDown) {
      this.endDraw(this.getTouchPoint(e));
    }
    this.mouseDown = false;
  }.bind(this);

  this.canvas.ontouchleave = function(e) {
    e.preventDefault();
    if (this.mouseDown) {
      this.endDraw(this.getTouchPoint(e));
    }
    this.mouseDown = false;
  }.bind(this);

  this.sendButton.onclick = function() {
    socket.emit("paths", {paths: this.paths});
    this.paths = [];
    this.clear();
  }.bind(this);

  window.onresize = function(e) {
    this.resize();
  }.bind(this);

  this.delete = function() {
    window.onresize = function(e) {

    };
    let content = document.getElementById("content");
    content.removeChild(this.canvas);
    content.removeChild(this.sendButton);
  }
}
