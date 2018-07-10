function Button() {
  this.button = document.createElement("button");
  this.button.id = "button";
  this.button.innerHTML = "button";

  let content = document.getElementById("content");
  content.appendChild(this.button);

  this.returnValue = "";

  this.init = function(returnValue) {
    this.returnValue = returnValue;
  };

  this.setText = function(text) {
    this.button.innerHTML = text;
  };

  this.button.onclick = function() {
    socket.emit("button", {value: this.returnValue});
  }.bind(this);

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.button);
    this.button = null;
  };
}
