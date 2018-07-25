function GameScript(game) {
  this.game = game;

  this.script = document.createElement("script");

  this.script.onload = function() {
    initGame();
  };

  let scripts = document.getElementById("scripts");
  this.script.src = "/host/games/" + game + ".js";
  scripts.appendChild(this.script);


  this.delete = function() {
    let scripts = document.getElementById("scripts");
    scripts.removeChild(this.script);
    this.script = null;
  }
}
