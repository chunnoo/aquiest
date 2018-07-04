var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

var content = [];

function clear() {
  for (let i = 0; i < content.length; i++) {
    content[i].delete();
  }
  content = [];
}

function addDisplayText(msgText) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  content.push(displayText);
}

function addDisplayCanvas(msgPaths) {
  let displayCanvas = new DisplayCanvas();
  displayCanvas.init();
  displayCanvas.addPaths(msgPaths);
  content.push(displayCanvas);
}

socket.on("connect", function() {
  socket.emit("requestNewRoom", {});
});

socket.on("newRoom", function(msg) {
  console.log("hmm");
  room = msg.room;
  document.getElementById("headerInfo").innerHTML = room;
});

socket.on("newMember", function(msg) {
  addDisplayText(msg.name);
  //document.getElementById("content").innerHTML += "<h3>" + msg.name + "</h3>";
});

socket.on("start", function(msg) {
  socket.emit("start", {});
});

socket.on("text", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("next", function(msg) {
  socket.emit("next", {});
});

socket.on("displayText", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("displayCanvas", function(msg) {
  clear();
  addDisplayCanvas(msg.paths);
});
