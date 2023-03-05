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

  return [Math.atan2(fy, fx), Math.hypot(fy, fx)];
}

function isInsideNegativeCharge(x, y) {
  for (let i = 0; i < charges.length; i++) {
    let charge = charges[i];

    if (charge.charge < 0 && Math.hypot(x - charge.x, y - charge.y) < 40) {
      return true;
    }
  }

  return false;
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

    domElement.addEventListener("drag", (event) => {
      if (event.x == 0 && event.y == 0) {
        return;
      }

      this.x = Math.floor(event.x / 25) * 25; 
      this.y = Math.floor(event.y / 25) * 25;
      
      domElement.style.left = (this.x - 50) + "px";
      domElement.style.top = (this.y - 50) + "px";
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
});

//const charges = [new Charge(-3, 300, 300), new Charge(-3, 300, 300), new Charge(-3, 300, 300), new Charge(-3, 300, 300), new Charge(-3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300)];
//const charges = [new Charge(-3, 300, 300), new Charge(3, 300, 300)];
//const charges = [new Charge(3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300), new Charge(3, 300, 300)];
const charges = [];

for (let i = 0; i < 5; i++) {
  let charge =  0;
  if (i < 2) {
    charge = randint(-5, 0);
  } else {
    charge = randint(1, 6);
  }

  let x = 0;
  let y = 0;

  while (true) {
    x = randint(100, screen.width - 100);
    y = randint(100, screen.height - 100);

    let flag = false;

    for (let i = 0; i < charges.length; i++) {
      let charge = charges[i];

      if (Math.hypot(charge.x - x, charge.y - y) < 150) {
        flag = true;
        break;
      }
    }

    if (!flag) {
      break;
    }
  }

  charges.push(new Charge(charge, x, y));
}

function randint(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function animate() {
  updateCanvas();

  requestAnimationFrame(animate);
}

animate();