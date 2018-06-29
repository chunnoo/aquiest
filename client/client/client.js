var socket = io("http://" + CONFIG_IP + ":8080");
var name = null;
var room = null;

socket.on("connect", function() {
  fetch("/client/client", {method: "POST", credentials: "same-origin"})
    .then(function(res) {
      if (res.status !== 200) {
        console.log("Status code: " + res.status);
        return;
      }
      //res.json().then(function(data) {
        //console.log(data);
      //});
      res.json().then(function(data) {
        name = data.name;
        room = data.room;

        document.getElementById("headerText").innerHTML = name;
        document.getElementById("headerInfo").innerHTML = room;

        socket.emit("joinRoom", {name: name, room: room});
      });
    })
    .catch(function(err) {
      console.log("Error:" + err);
    });
});

socket.on("accepted", function(msg) {
  document.getElementById("content").innerHTML = "<h3>Accepted into room</h3>";
});
