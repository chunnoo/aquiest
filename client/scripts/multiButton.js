function MultiButton(number) {
  this.multi = document.createElement("div");
  this.multi.id = "multiButtonDiv";
  this.multi.className = "multiButtonDiv";

  this.buttons = [];

  for (let i = 0; i < number; i++) {
    let button = {element: null, value: i};

    button.element = document.createElement("button");
    button.element.id = "multiButton" + i;
    button.element.innerHTML = "multi";
    button.element.className = "multiButton";
    this.multi.appendChild(button.element);
    this.buttons.push(button);
  }

  let content = document.getElementById("content");
  content.appendChild(this.multi);

  this.init = function(values) {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].value = values[i];
    }
  };

  this.setTexts = function(texts) {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].element.innerHTML = texts[i];
    }
  };

  for (let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].element.onclick = function() {
      socket.emit("button", {type: "clientData", value: this.value});
    }.bind(this.buttons[i]);
  }

  this.delete = function() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.multi.removeChild(this.buttons[i].element);
    }

    this.buttons = [];

    let content = document.getElementById("content");
    content.removeChild(this.mult);
    this.multi = null;
  };
}
