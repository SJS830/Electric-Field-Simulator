class Charge {
  constructor(charge, x, y) {
    this.charge = charge;
    this.x = x;
    this.y = y;
    this.disabled = false;
    this.linesGoingIn = [];

    let domElement = document.createElement("span");
    domElement.className = "charge " + ["negatively_charged", "neutrally_charged", "positively_charged"][Math.sign(this.charge) + 1];
    domElement.style.left = (x - 50) + "px";
    domElement.style.top = (y - 50) + "px";
    domElement.draggable = true;

    let chargeValue = document.createElement("input");
    chargeValue.className = "charge_value";
    chargeValue.type = "number";
    chargeValue.value = charge;
    domElement.appendChild(chargeValue);

    document.body.appendChild(domElement);

    chargeValue.addEventListener("change", () => {
      this.charge = chargeValue.value;

      domElement.className = "charge " + ["negatively_charged", "neutrally_charged", "positively_charged"][Math.sign(this.charge) + 1];
    });

    domElement.addEventListener("drag", (event) => {
      if (event.x == 0 && event.y == 0) {
        return;
      }

      this.x = Math.floor(event.x / 10) * 10;
      this.y = Math.floor(event.y / 10) * 10;

      domElement.style.left = (this.x - 50) + "px";
      domElement.style.top = (this.y - 50) + "px";
    });

    domElement.addEventListener("dblclick", (event) => {
      //dont activate on when user clicks the charge changer
      if (event.target.localName == "input") {
        return;
      }

      this.disabled = true;
      domElement.remove();
      event.stopPropagation();
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

  _drawFieldLinesNeg() {
    let numLines = Math.abs(this.charge * 4) - this.linesGoingIn.length;

    let angles = maximizeGaps(this.linesGoingIn, numLines);

    for (let n = 0; n < numLines; n++) {
      let angle = angles[n];

      let x = this.x + Math.cos(angle) * 10;
      let y = this.y + Math.sin(angle) * 10;

      // for debug
      ctx.beginPath();
      ctx.arc(this.x + Math.cos(angle) * 70, this.y + Math.sin(angle) * 70, 10, 0, 2 * Math.PI);
      ctx.fill();
      //

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

        //turn around
        dir += Math.PI;

        x += Math.cos(dir) * 10;
        y += Math.sin(dir) * 10;

        ctx.lineTo(x, y);
        ctx.stroke();

        if (isInsidePositiveCharge(x, y)) {
          break;
        }
      }
    }
  }

  _drawFieldLinesPos() {
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

        let chargeInside = isInsideNegativeCharge(x, y);
        if (chargeInside) {
          let angle = Math.atan2(y - chargeInside.y, x - chargeInside.x);
          chargeInside.linesGoingIn.push(((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI));
          break;
        }
      }
    }
  }

  drawFieldLines() {
    if (this.charge > 0) {
      this._drawFieldLinesPos();
    } else if (this.charge < 0) {
      this._drawFieldLinesNeg();
    }
  }
}
