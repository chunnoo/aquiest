function Path() {
  this.pts = [];
}

Path.prototype = {
  addPoint: function(point) {
    this.pts.push(point);
  },
  getPointArray: function() {
    return this.pts;
  },
  getLastPoint: function() {
    return this.pts[this.pts.length - 1];
  },
  simplify: function(strength) {

  }
}
