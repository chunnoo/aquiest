var socket = io("http://" + CONFIG_IP + ":8080");
var name = null;
var room = null;

var _content = [];
var _footer = null;

function addToContent(element) {
  _content.push(element);
  let content = document.getElementById("content");
  content.scrollTop = content.scrollHeight;
}

function setClientData(receivedName, receivedRoom) {
  name = receivedName;
  room = receivedRoom;
  document.getElementById("headerText").innerHTML = name;
  document.getElementById("headerInfo").innerHTML = room;
}

function clear() {
  for (let i = 0; i < _content.length; i++) {
    _content[i].delete();
  }
  _content = [];
}

function addJoin(firstPlaceholder, secondPlaceholder) {
  let join = new Join();
  join.init();
  join.setPlaceholders(firstPlaceholder, secondPlaceholder);
  addToContent(join);
}

function addDisplayText(msgText) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  addToContent(displayText);
}

function addDisplayTextAlign(msgText, align) {
  let displayText = new DisplayText();
  displayText.setText(msgText);
  displayText.setAlign(align);
  addToContent(displayText);
}

function addDisplayCanvas(msgPaths) {
  let displayCanvas = new DisplayCanvas();
  displayCanvas.init();
  displayCanvas.addPaths(msgPaths);
  addToContent(displayCanvas);
}

function addWrite(msgPlaceholder) {
  let write = new Write();
  write.setPlaceholder(msgPlaceholder);
  addToContent(write);
}

function disableFooter() {
  if (_footer) {
    _footer.delete();
    _footer = null;
  }
}

function enableFooterWrite(placeholder) {
  disableFooter();
  let footerWrite = new FooterWrite();
  footerWrite.init();
  footerWrite.setPlaceholder(placeholder);
  _footer = footerWrite;
}

function addDraw() {
  let draw = new Draw();
  draw.init();
  addToContent(draw);
}

function addButton(msgText, msgType, msgValue) {
  let button = new Button();
  button.init(msgType, msgValue);
  button.setText(msgText);
  addToContent(button);
}

function addMultiButton(number, texts, values) {
  let multiButton = new MultiButton(number);
  multiButton.init(values);
  multiButton.setTexts(texts);
  addToContent(multiButton);
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
  if (msg.text !== "") {
    addDisplayText("Accepted into room");
  }
});

socket.on("clear", function(msg) {
  clear();
});

socket.on("addButton", function(msg) {
  addButton(msg.text, msg.type, msg.value);
});

socket.on("text", function(msg) {
  clear();
  if (msg.align) {
    addDisplayTextAlign(msg.text, msg.align);
  } else {
    addDisplayText(msg.text);
  }
});

socket.on("addText", function(msg) {
  if (msg.align) {
    addDisplayTextAlign(msg.text, msg.align);
  } else {
    addDisplayText(msg.text);
  }
});

socket.on("write", function(msg) {
  clear();
  addWrite(msg.text);
});

socket.on("footerWrite", function(msg) {
  enableFooterWrite(msg.text);
});

socket.on("footerDisable", function(msg) {
  disableFooter();
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
  addButton(msg.text, msg.type, msg.value);
});

socket.on("test", function(msg) {
  clear();
  addDisplayText("text");
  addDisplayTextAlign("left", "left");
  addDisplayTextAlign("right", "right");
  addWrite("text");
  addButton("text", "clientData", "value");
  addMultiButton(4, ["one", "two", "three", "four"], [1, 2, 3, 4]);
  addMultiButton(2, ["none", "write"], ["none", "write"]);
});

socket.on("testDraw", function(msg) {
  clear();
  addDraw();
});
