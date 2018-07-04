function Write() {
  this.input = document.createElement("input");
  this.input.id = "input";
  this.input.type = "text";
  this.input.name = "input";
  this.input.placeholder = "Text";
  this.input.autocomplete = "off";

  this.sendButton = document.createElement("button");
  this.sendButton.id = "send";
  this.sendButton.innerHTML = "Send";

  let content = document.getElementById("content");
  content.appendChild(this.input);
  content.appendChild(this.sendButton);

  this.init = function() {

  };

  this.setPlaceholder = function(text) {
    this.input.placeholder = text;
  };

  this.sendButton.onclick = function() {
    socket.emit("text", {text: this.input.value});
    this.input.value = "";
  }.bind(this);

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.input);
    content.removeChild(this.sendButton);
  };
}
