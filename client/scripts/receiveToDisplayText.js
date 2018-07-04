var display = new DisplayText();

socket.on("text", function(msg) {
  display.setText(msg.text);
});
