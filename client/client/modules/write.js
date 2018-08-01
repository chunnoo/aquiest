_modules["write"] = function() {
  this.form = document.createElement("form");
  this.form.id = "form";

  this.input = document.createElement("input");
  this.input.id = "input";
  this.input.type = "text";
  this.input.name = "input";
  this.input.placeholder = "Text";
  this.input.autocomplete = "off";

  this.sendButton = document.createElement("input");
  this.sendButton.id = "send";
  this.sendButton.className = "button";
  this.sendButton.type = "submit";
  this.sendButton.value = "Send";

  let content = document.getElementById("content");
  this.form.appendChild(this.input);
  this.form.appendChild(this.sendButton);
  content.appendChild(this.form);

  this.init = function(data) {
    this.input.placeholder = data.text;
  };

  this.update = function(data) {
    this.input.placeholder = data.text;
  }

  this.form.onsubmit = function(e) {
    e.preventDefault();
    socket.emit("text", {text: this.input.value});
    this.input.value = "";
  }.bind(this);

  this.delete = function() {
    let content = document.getElementById("content");
    this.form.removeChild(this.input);
    this.form.removeChild(this.sendButton);
    content.removeChild(this.form);
  };
}
