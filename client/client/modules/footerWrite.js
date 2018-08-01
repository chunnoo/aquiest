_modules["footerWrite"] = function() {
  this.form = document.createElement("form");
  this.form.id = "footerWriteForm";

  this.input = document.createElement("input");
  this.input.id = "footerWriteInput";
  this.input.type = "text";
  this.input.name = "input";
  this.input.placeholder = "Text";
  this.input.autocomplete = "off";

  this.sendButton = document.createElement("input");
  this.sendButton.id = "footerWriteButton";
  this.sendButton.type = "submit";
  this.sendButton.value = "Send";

  let footer = document.getElementById("footer");
  this.form.appendChild(this.input);
  this.form.appendChild(this.sendButton);
  footer.appendChild(this.form);

  this.init = function(data) {
    this.input.placeholder = data.text;
  };

  this.update = function(data) {
    this.input.placeholder = data.text;
  };

  this.form.onsubmit = function(e) {
    e.preventDefault();
    socket.emit("text", {text: this.input.value});
    this.input.value = "";
  }.bind(this);

  this.delete = function() {
    let footer = document.getElementById("footer");
    this.form.removeChild(this.input);
    this.form.removeChild(this.sendButton);
    footer.removeChild(this.form);
  };
}
