function MenuClientList() {
  this.div = document.createElement("div");
  this.div.id = "menuClientList";
  this.div.className = "menuClientListBottom";

  this.state = "bottom";

  this.clients = [];

  let content = document.getElementById("content");
  content.appendChild(this.div);

  this.init = function(data) {
    if (data.client || data.state) {
      this.update(data);
    }
  };

  this.update = function(data) {
    if (data.client) {
      let newClient = document.createElement("p");
      newClient.className = "text";
      newClient.innerHTML = data.client;
      this.clients.push(newClient);
      this.div.appendChild(newClient);
    }
    if (data.state) {
      if (data.state === "bottom") {
        this.state = "bottom";
        this.div.className = "menuClientListBottom";
      } else if (data.state === "center") {
        this.state = "center";
        this.div.className = "menuClientListCenter";
      }
    }
  };

  this.delete = function() {
    for (let i = 0; i < this.clients.length; i++) {
      this.div.removeChild(this.clients[i]);
    }
    this.clients = [];
    let content = document.getElementById("content");
    content.removeChild(this.div);
    this.div = null;
  };
}
