function Join() {
  this.form = document.createElement("form");
  this.id = "form";

  this.first = document.createElement("input");
  this.first.id = "first";
  this.first.type = "text";
  this.first.name = "first";
  this.first.placeholder = "First";
  this.first.autocomplete = "off";

  this.second = document.createElement("input");
  this.second.id = "second";
  this.second.type = "text";
  this.second.name = "first";
  this.second.placeholder = "Second";
  this.second.autocomplete = "off";

  this.submit = document.createElement("input");
  this.submit.type = "submit";
  this.submit.id = "submit";
  this.submit.className = "button";
  this.submit.innerHTML = "Join";

  this.form.appendChild(this.first);
  this.form.appendChild(this.second);
  this.form.appendChild(this.submit);

  let content = document.getElementById("content");
  content.appendChild(this.form);

  this.init = function() {

  };

  this.setPlaceholders = function(first, second) {
    this.first.placeholder = first;
    this.second.placeholder = second;
  };

  this.clear = function() {
    this.first.value = "";
    this.second.value = "";
  }

  this.form.onsubmit = function(e) {
    e.preventDefault();
    socket.emit("join", {name: this.first.value, room: this.second.value});
    this.first.value = "";
    this.second.value = "";
  }.bind(this);

  this.delete = function() {
    this.form.removeChild(this.first);
    this.form.removeChild(this.second);
    this.form.removeChild(this.submit);
    let content = document.getElementById("content");
    content.removeChild(this.form);
  };
}
