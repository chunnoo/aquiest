_modules["button"] = function() {
  this.button = document.createElement("button");
  this.button.id = "button";
  this.button.innerHTML = "button";

  let content = document.getElementById("content");
  content.appendChild(this.button);

  this.type = "";
  this.value = "";

  this.init = function(data) {
    if (!data.type) {
      this.type = "clientData";
    } else {
      this.type = data.type;
    }
    this.value = data.value;
    this.button.innerHTML = data.text;
  };

  this.update = function(data) {
    this.button.innerHTML = data.text;
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
