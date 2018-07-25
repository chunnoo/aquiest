function DisplayText() {
  this.text = document.createElement("p");
  this.text.id = "text";

  let content = document.getElementById("content");
  content.appendChild(this.text);

  this.clear = function() {
    this.text.innerHTML = "";
  };

  this.setText = function(text) {
    this.text.innerHTML = text;
  };

  this.setAlign = function(align) {
    this.text.style.textAlign = align;
  }

  this.delete = function() {
    let content = document.getElementById("content");
    content.removeChild(this.text);
  }
}
