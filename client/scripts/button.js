function Button() {
  this.button = document.createElement("button");
  this.button.id = "button";
  this.button.innerHTML = "button";

  let content = document.getElementById("content");
  content.appendChild(this.button);

  this.type = "";
  this.value = "";

  this.init = function(type, value) {
    this.type = type;
    this.value = value;
  };

  this.setText = function(text) {
    this.button.innerHTML = text;
  };

  this.button.onclick = function() {
    socket.emit("button", {type: this.type, value: this.value});
  }.bind(this);

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.button);
    this.button = null;
  };
}
