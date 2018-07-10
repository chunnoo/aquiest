var display = new DisplayCanvas();
display.init();

socket.emit("testDisplayCanvas", {});

socket.on("testDisplayCanvas", function(msg) {
  display.addPaths(msg.paths);
});
