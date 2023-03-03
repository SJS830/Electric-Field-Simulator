const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.classList.add("canvas");
document.body.appendChild(canvas);

function calculateLineDirection(x, y) {
  let fx = 0;
  let fy = 0;

  charges.forEach(charge => {
    let force = charge.calculateForce(x, y);
    fx += force[0];
    fy += force[1];
  });

  return Math.atan2(fy, fx);
}

class Charge {
  constructor(charge, x, y) {
    this.charge = charge;
    this.x = x;
    this.y = y;

    let domElement = document.createElement("span");
    domElement.classList.add("charge");
    domElement.style.left = (x - 50) + "px";
    domElement.style.top = (y - 50) + "px";
    domElement.innerHTML = "<p>" + charge + "</p>";
    domElement.draggable = true;

    document.body.appendChild(domElement);

    let lastDragTime = 0;

    domElement.addEventListener("drag", (event) => {
      if (lastDragTime + 500 > performance.now()) {
        return;
      }

      lastDragTime = performance.now();

      if (event.x == 0 && event.y == 0) {
        return;
      }

      this.x = event.x;
      this.y = event.y;
      
      domElement.style.left = (event.x - 50) + "px";
      domElement.style.top = (event.y - 50) + "px";

      updateCanvas();
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

      let x = this.x + Math.cos(angle) * 35;
      let y = this.y + Math.sin(angle) * 40;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 0; i < 100; i++) {
        let dir = calculateLineDirection(x, y);
        x += Math.cos(dir) * 10;
        y += Math.sin(dir) * 10;

        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  }
}

function updateCanvas() {
  let t = performance.now();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  charges.forEach(charge => {
    charge.drawFieldLines();
  });

  console.log(performance.now() - t);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateCanvas();
});

const charges = [new Charge(-3, 300, 300), new Charge(-3, 600, 300), new Charge(3, 800, 300)];
updateCanvas();
