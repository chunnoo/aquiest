function Loading() {
  this.element = document.createElement("div");
  this.element.id = "loading";
  this.element.className = "loading";
  this.element.innerHTML = "Loading...";

  let wrapper = document.getElementById("wrapper");
  wrapper.appendChild(this.element);

  this.init = function(display) {
    if (display) {
      this.element.style.display = "block";
    } else {
      this.element.style.display = "none";
    }
  };

  this.update = function(display) {
    if (display) {
      this.element.style.display = "block";
    } else {
      this.element.style.display = "none";
    }
  }

  this.delete = function() {
    let wrapper = document.getElementById("wrapper");
    wrapper.removeChild(this.element);

    this.element = null;
  }

}
