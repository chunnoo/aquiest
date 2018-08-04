_modules["multilineText"] = function() {
  this.div = document.createElement("div");
  this.div.id = "multilineText";
  this.div.className = "multilineText";

  this.lines = [];

  let content = document.getElementById("content");
  content.appendChild(this.div);

  this.init = function(data) {
    if (data.text || data.lines) {
      this.update(data);
    }
  };

  this.update = function(data) {
    if (data.text) {
      let newLine = document.createElement("p");
      newLine.className = "text";
      newLine.innerHTML = data.text;
      if (data.align) {
        newLine.style.textAlign = data.align;
      }
      this.lines.push(newLine);
      this.div.appendChild(newLine);
    } else if (data.lines) {
      for (let i = 0; i < data.lines.length; i++) {
        let newLine = document.createElement("p");
        newLine.className = "text";
        newLine.innerHTML = data.lines[i].text;
        if (data.lines[i].align) {
          newLine.style.textAlign = data.lines[i].align;
        }
        this.lines.push(newLine);
        this.div.appendChild(newLine);
      }
    }
    this.div.scrollTop = this.div.scrollHeight;
  };

  this.delete = function() {
    for (let i = 0; i < this.lines.length; i++) {
      this.div.removeChild(this.lines[i]);
    }
    this.lines = [];
    let content = document.getElementById("content");
    content.removeChild(this.div);
    this.div = null;
  };
}
