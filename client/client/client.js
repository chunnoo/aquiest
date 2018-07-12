var socket = io("http://" + CONFIG_IP + ":8080");
var name = null;
var room = null;

var content = [];

function setClientData(receivedName, receivedRoom) {
  name = receivedName;
  room = receivedRoom;
  document.getElementById("headerText").innerHTML = name;
  document.getElementById("headerInfo").innerHTML = room;
}

function clear() {
  for (let i = 0; i < content.length; i++) {
    content[i].delete();
  }
  content = [];
}

function addJoin(firstPlaceholder, secondPlaceholder) {
  let join = new Join();
  join.init();
  join.setPlaceholders(firstPlaceholder, secondPlaceholder);
  content.push(join);
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

function addWrite(msgPlaceholder) {
  let write = new Write();
  write.setPlaceholder(msgPlaceholder);
  content.push(write);
}

function addDraw() {
  let draw = new Draw();
  draw.init();
  content.push(draw);
}

function addButton(msgText, msgReturnValue) {
  let button = new Button();
  button.init(msgReturnValue);
  button.setText(msgText);
  content.push(button);
}

socket.on("connect", function() {
  clear();
  addJoin("Name", "Room");
});

socket.on("rejected", function(msg) {
  clear();
  addJoin("Name", "Room");
  addDisplayText(msg.text);
});

socket.on("accepted", function(msg) {
  clear();
  setClientData(msg.name, msg.room);
  addDisplayText("Accepted into room");
});

socket.on("addButton", function(msg) {
  addButton(msg.text, msg.value);
});

socket.on("text", function(msg) {
  clear();
  addDisplayText(msg.text);
});

socket.on("write", function(msg) {
  clear();
  addWrite(msg.text);
});

socket.on("displayCanvasAndWrite", function(msg) {
  clear();
  addDisplayCanvas(msg.paths);
  addWrite("text");
});

socket.on("displayTextAndDraw", function(msg) {
  clear();
  addDisplayText(msg.text);
  addDraw();
});

socket.on("button", function(msg) {
  clear();
  addButton(msg.text, msg.value);
});
