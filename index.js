const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.classList.add("canvas");
document.body.appendChild(canvas);

class Charge {
  constructor(charge, x, y) {
    this.x = x;
    this.y = y;

    let domElement = document.createElement("span");
    domElement.classList.add("charge");
    domElement.style.left = (x - 50) + "px";
    domElement.style.top = (y - 50) + "px";
    domElement.innerHTML = "<p>" + charge + "</p>";
    document.body.appendChild(domElement);

    this.domElement = domElement;
  }

  calculateForce(x, y) {
    let dist = Math.hypot(this.x - x, this.y - y);
    return [(x - this.x) / Math.pow(dist, 2), (y - this.y) / Math.pow(dist, 2)];
  }
}

const charges = [new Charge(5, 300, 300)];

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

document.addEventListener("click", (event) => {
  let x = event.x;
  let y = event.y;

  for (let i = 0; i < 5; i++) {
    console.log(x, y);
    ctx.fillRect(x - 2, y - 2, 4, 4);

    let dir = calculateLineDirection(x, y);
    x += Math.cos(dir) * 10;
    y += Math.sin(dir) * 10;
  }
});
