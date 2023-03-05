const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.classList.add("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

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

function randint(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

const charges = [];
const testCharges = [];

//initialize test charges
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

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  charges.forEach(charge => {
    charge.drawFieldLines();
  });

  testCharges.forEach(testCharge => {
    testCharge.step();
    testCharge.draw();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("click", (event) => {
  testCharges.push(new TestCharge(event.x, event.y));
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});