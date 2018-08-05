_modules["clientList"] = function() {
  this.div = document.createElement("div");
  this.div.id = "clientList";
  this.div.className = "clientList";

  this.position = "left";

  this.clients = [];

  let content = document.getElementById("content");
  content.appendChild(this.div);

  this.init = function(data) {
    if (data.client || data.clients || data.position || data.highlight || data.clientData) {
      this.update(data);
    }
  };

  this.update = function(data) {
    if (data.client) {
      let newClient = {name: data.client, element: document.createElement("p")};
      newClient.element.className = "text";
      newClient.element.innerHTML = newClient.name;
      this.clients.push(newClient);
      this.div.appendChild(newClient.element);
    }
    if (data.clients) {
      for (let i = 0; i < data.clients.length; i++) {
        let newClient = {name: data.clients[i], element: document.createElement("p")};
        newClient.element.className = "text";
        newClient.element.innerHTML = newClient.name;
        this.clients.push(newClient);
        this.div.appendChild(newClient.element);
      }
    }
    if (data.clientData) {
     for (let i = 0; i < this.clients.length; i++) {
       this.clients[i].element.innerHTML += ": " + data.clientData[i];
     }
    }
    if (data.position) {
      this.position = data.position;
      this.div.style.alignItems = this.position;
      this.div.style.gridArea = this.position;
    }
    if (data.highlight) {
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].name === data.highlight || data.highlight === "") {
          this.clients[i].element.style.opacity = 1;
        } else {
          this.clients[i].element.style.opacity = 0.5;
        }
      }
    }
  };

  this.delete = function() {
    for (let i = 0; i < this.clients.length; i++) {
      this.div.removeChild(this.clients[i].element);
    }
    this.clients = [];
    let content = document.getElementById("content");
    content.removeChild(this.div);
    this.div = null;
  };
}
