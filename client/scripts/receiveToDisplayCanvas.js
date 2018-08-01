var display = new DisplayCanvas();
display.init();

socket.on("paths", function(msg) {
  for (let i = 0; i < msg.paths.length; i++) {
    display.addPath(msg.paths[i]);
  }
});
