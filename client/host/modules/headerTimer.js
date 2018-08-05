_modules["headerTimer"] = function() {
  this.timer = document.createElement("h2");
  this.timer.innerHTML = "0";
  this.timer.id = "headerTimer";
  this.timer.className = "headerTimer";

  let headerCenter = document.getElementById("headerCenter");
  headerCenter.appendChild(this.timer);

  this.time = 0;
  this.interval = 1;
  this.timerInterval = null;

  this.onInterval = function() {
    this.time -= this.interval;
    this.timer.innerHTML = this.time.toFixed(this.interval < 1 ? 2 : 0).toString();
    if (this.time <= 0) {
      this.timer.innerHTML = "Time's up!"
      headerCallback();
    }
  };

  this.init = function(data) {
    if (data.time) {
      this.time = data.time;
      this.timer.innerHTML = this.time.toFixed(this.interval < 1 ? 2 : 0).toString();
    }
    if (data.interval) {
      this.interval = data.interval;
    }
    this.timerInterval = setInterval(this.onInterval.bind(this), 1000 * this.interval);
  };

  this.update = function(data) {
    if (data.time) {
      this.time = data.time;
      this.timer.innerHTML = this.time.toFixed(this.interval < 1 ? 2 : 0).toString();
    }
    if (data.addTime) {
      this.time += data.addTime;
      this.timer.innerHTML = this.time.toFixed(this.interval < 1 ? 2 : 0).toString();
    }
  };

  this.getData = function() {
    return {time: this.time};
  }

  this.delete = function() {
    let headerCenter = document.getElementById("headerCenter");
    headerCenter.removeChild(this.timer);
    this.timer = null;
    clearInterval(this.timerInterval);
  };
}
