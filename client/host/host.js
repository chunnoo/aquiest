var socket = io("http://" + CONFIG_IP + ":8080");
var room = null;

socket.on("connect", function() {
  socket.emit("requestNewRoom", {});
});

socket.on("newRoom", function(msg) {
  console.log("hmm");
  room = msg.room;
  document.getElementById("headerInfo").innerHTML = room;
});

socket.on("newMember", function(msg) {
  document.getElementById("content").innerHTML += "<h3>" + msg.name + "</h3>";
});
