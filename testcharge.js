class TestCharge {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.velocity_x = 0;
    this.velocity_y = 0;

    this.disabled = false;
  }

  step() {
    if (this.disabled) {
      return;
    }

    let [dir, magnitude] = calculateLineDirection(this.x, this.y);

    this.velocity_x += Math.cos(dir) * magnitude * 5;
    this.velocity_y += Math.sin(dir) * magnitude * 5;

    this.x += this.velocity_x;
    this.y += this.velocity_y;

    if (isInsideNegativeCharge(this.x, this.y)) {
      this.disabled = true;
    }
  }

  draw() {
    if (this.disabled) {
      return;
    }

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
  }
}
