function ModuleScript(module, callback) {
  this.module = module;
  this.callback = callback;

  this.script = document.createElement("script");
  this.style = document.createElement("link");

  this.loaded = false;

  this.script.onload = function() {
    this.loaded = true;
    moduleLoaded(this.callback);
  }.bind(this);

  let scripts = document.getElementById("scripts");
  this.script.src = "/client/modules/" + this.module + ".js";
  scripts.appendChild(this.script);

  let head = document.getElementsByTagName("head")[0];
  this.style.setAttribute("rel", "stylesheet");
  this.style.setAttribute("type", "text/css");
  this.style.setAttribute("href", "/client/modules/styles/" + this.module + ".css");
  head.appendChild(this.style);


  this.delete = function() {
    let scripts = document.getElementById("scripts");
    scripts.removeChild(this.script);
    this.script = null;

    let head = document.getElementsByTagName("head")[0];
    head.removeChild(this.style);
    this.style = null;
  }
}
