const optimjs = require("optimization-js");

const going_in = [1, 2, 3];
const insertions = 10;

function make_initial() {
  let out = [];

  for (let i = 0; i < insertions; i++) {
    out.push(2 * Math.PI * i / insertions);
  }

  return out;
}

let num = 0;
function loss(angles) {
  for (let i = 0; i < angles.length; i++) {
    let pi2 = 2 * Math.PI;

    angles[i] = ((angles[i] % pi2) + pi2) % pi2;
  }

  let loss = 0;
  let gaps = [];

  for (let i = -1; i < going_in.length; i++) {
    gaps.push({
      left: (going_in[i]) ? (going_in[i]) : (going_in[going_in.length - 1] - 2 * Math.PI),
      right: (going_in[i + 1]) ? (going_in[i + 1]) : (2 * Math.PI + going_in[0])
    });
  }

  function get_gap(angle) {
    for (let i = 0; i < gaps.length; i++) {
      let gap = gaps[i];

      if (gap.left <= angle && angle <= gap.right) {
        return i;
      }
    }
  }

  for (let i = 0; i < angles.length; i++) {
    for (let j = i + 1; j < angles.length; j++) {
      if (get_gap(angles[i]) != get_gap(angles[j])) {
        continue;
      }

      loss += Math.pow(1 / (Math.abs(angles[i] - angles[j])), 2);
    }
  }

  angles.forEach(angle => {
    let gap = gaps[get_gap(angle)];

    loss += Math.pow(1 / (angle - gap.left) + 1 / (gap.right - angle), 2);
  });

  num += 1;
  if (num % 100000 == 0) {
    console.log(num, loss);
    console.log(going_in.map(a => "a(" + a + ")").join(", "));
    console.log(angles.map(a => "a(" + a + ")").join(", "));
  }

  return loss;
}

let x0 = make_initial();
let solution = optimjs.minimize_Powell(loss, x0);

let angles = [];
solution.argument.forEach(angle => {
  let pi2 = 2 * Math.PI;
  angles.push(((angle % pi2) + pi2) % pi2);
});
angles.sort();

console.log(solution);
console.log(going_in.map(a => "a(" + a + ")").join(", "));
console.log(angles.map(a => "a(" + a + ")").join(", "));
