_modules["text"] = function() {
  this.text = document.createElement("p");
  this.text.id = "text";

  let content = document.getElementById("content");
  content.appendChild(this.text);

  this.init = function(data) {
    this.text.innerHTML = data.text;
    if (data.align) {
      this.text.style.textAlign = data.align;
    }
    if (data.animationDelay) {
      this.text.style.animationDelay = data.animationDelay;
    }
  };

  this.update = function(data) {
    this.text.innerHTML = data.text;
    if (data.align) {
      this.text.style.textAlign = data.align;
    }
  };

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.text);
  };
}
