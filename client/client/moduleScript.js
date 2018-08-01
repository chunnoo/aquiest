function ModuleScript(module, callback) {
  this.module = module;

  this.script = document.createElement("script");

  this.loaded = false;

  this.script.onload = function() {
    this.loaded = true;
    moduleLoaded(callback);
  }.bind(this);

  let scripts = document.getElementById("scripts");
  this.script.src = "/client/modules/" + this.module + ".js";
  scripts.appendChild(this.script);


  this.delete = function() {
    let scripts = document.getElementById("scripts");
    scripts.removeChild(this.script);
    this.script = null;
  }
}
