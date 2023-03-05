class Charge {
  constructor(charge, x, y) {
    this.charge = charge;
    this.x = x;
    this.y = y;

    let domElement = document.createElement("span");
    domElement.classList.add("charge");
    domElement.classList.add((charge < 0) ? "negatively_charged" : "positively_charged");
    domElement.style.left = (x - 50) + "px";
    domElement.style.top = (y - 50) + "px";
    domElement.innerHTML = "<p>" + charge + "</p>";
    domElement.draggable = true;

    document.body.appendChild(domElement);

    domElement.addEventListener("drag", (event) => {
      if (event.x == 0 && event.y == 0) {
        return;
      }

      this.x = Math.floor(event.x / 25) * 25; 
      this.y = Math.floor(event.y / 25) * 25;
      
      domElement.style.left = (this.x - 50) + "px";
      domElement.style.top = (this.y - 50) + "px";
    });

    //remove ghost image
    domElement.addEventListener("dragstart", (event) => {
      var img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      event.dataTransfer.setDragImage(img, 0, 0);
    });
  

    this.domElement = domElement;
  }

  calculateForce(x, y) {
    let dist = Math.hypot(this.x - x, this.y - y);
    return [(x - this.x) / Math.pow(dist, 2) * this.charge, (y - this.y) / Math.pow(dist, 2) * this.charge];
  }

  drawFieldLines() {
    let numLines = Math.abs(this.charge * 4);

    for (let n = 0; n < numLines; n++) {
      let angle = Math.PI + 2 * Math.PI * n / numLines;

      let x = this.x + Math.cos(angle) * 10;
      let y = this.y + Math.sin(angle) * 10;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i < 500; i++) {
        let [dir, magnitude] = calculateLineDirection(x, y);

        //arrow
        if (i % 10 == 0) {
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(dir - Math.PI / 2) * 10, y + Math.sin(dir - Math.PI / 2) * 10);
          ctx.lineTo(x + Math.cos(dir) * 10, y + Math.sin(dir) * 10);
          ctx.lineTo(x + Math.cos(dir + Math.PI / 2) * 10, y + Math.sin(dir + Math.PI / 2) * 10);
          ctx.lineTo(x, y);
          ctx.fill();
        }

        x += Math.cos(dir) * 10;
        y += Math.sin(dir) * 10;

        ctx.lineTo(x, y);
        ctx.stroke();

        if (isInsideNegativeCharge(x, y)) {
          break;
        }
      }
    }
  }
}