_modules["multiButton"] = function(number) {
  this.multi = document.createElement("div");
  this.multi.id = "multiButtonDiv";
  this.multi.className = "multiButtonDiv";

  this.buttons = [];

  let content = document.getElementById("content");
  content.appendChild(this.multi);

  this.init = function(data) {
    for (let i = 0; i < data.values.length; i++) {
      let button = {element: null, value: data.values[i]};

      button.element = document.createElement("button");
      button.element.id = "multiButton" + i;
      button.element.innerHTML = data.texts[i];
      button.element.className = "multiButton";
      this.multi.appendChild(button.element);
      this.buttons.push(button);
    }
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].element.onclick = function() {
        socket.emit("button", {type: "clientData", value: this.value});
      }.bind(this.buttons[i]);
    }
    if (data.animationDelay) {
      this.multi.style.animationDelay = data.animationDelay;
    }
  };

  this.update = function(data) {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].element.innerHTML = data.texts[i];
    }
  };

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
