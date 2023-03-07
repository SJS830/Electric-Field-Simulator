//this function takes in an array of the angles of fixed "walls",
//and returns an array of num_insertions angles which maximizes
//the amount of space between each angle and the walls
function maximizeGaps(radian_ins, num_insertions) {
  radian_ins.sort();

  let gaps = [];

  for (let i = 0; i < radian_ins.length - 1; i++) {
    gaps.push({
      left: radian_ins[i],
      right: radian_ins[i + 1],
      original_gap: radian_ins[i + 1] - radian_ins[i],
      now_gap: radian_ins[i + 1] - radian_ins[i],
      num_insertions: 0
    });
  }

  gaps.push({
    left: radian_ins[radian_ins.length - 1],
    right: 2 * Math.PI + radian_ins[0],
    original_gap: 2 * Math.PI + radian_ins[0] - radian_ins[radian_ins.length - 1],
    now_gap: 2 * Math.PI + radian_ins[0] - radian_ins[radian_ins.length - 1],
    num_insertions: 0
  });

  for (let i = 0; i < num_insertions; i++) {
    let most_open_gap = gaps[0];

    for (let g = 1; g < gaps.length; g++) {
      if (gaps[g].now_gap > most_open_gap.now_gap) {
        most_open_gap = gaps[g];
      }
    }

    most_open_gap.num_insertions += 1;
    most_open_gap.now_gap = most_open_gap.original_gap / (most_open_gap.num_insertions + 1)
  }

  let angles = [];

  for (let g = 0; g < gaps.length; g++) {
    let gap = gaps[g];

    for (let i = 0; i < gap.num_insertions; i++) {
      angles.push(gap.left + (gap.right - gap.left) * (i + 1) / (gap.num_insertions + 1));
    }
  }

  return angles;
}

function randint(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}