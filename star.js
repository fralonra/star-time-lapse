const colors = require('star-colors');

class Star {
  constructor (ctx, opt = {}) {
    this.ctx = ctx;

    const defaultOption = {
      x: 0,
      y: 0,
      radius: 1,
      color: genStarColor(),
      blink: true,
      blinkRatioMin: 0.6,
      blinkRatioMax: 0.8
    };

    this.option = Object.assign(defaultOption, opt);
    this.x = this.option.x;
    this.y = this.option.y;
    this.degree = Math.round(Math.random() * 360);
    this.distance = getDistance({
      x: this.x,
      y: this.y
    }, {
      x: 0,
      y: 0
    });

    this.blinkRatio = Math.random() * (this.option.blinkRatioMax - 0.1) + this.option.blinkRatioMin + 0.1;
    this.blinkLighter = true;
  }

  draw () {
    const ctx = this.ctx;
    const { radius, color } = this.option;
    const { r, g, b } = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, true);
    // ctx.closePath();

    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * this.blinkRatio);
    gradient.addColorStop(0, rgba(r, g, b, 1));
    gradient.addColorStop(0.3, rgba(r, g, b, 0.4));
    gradient.addColorStop(1, rgba(r, g, b, 0));
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  blink () {
    if (this.option.blink) {
      if ((this.blinkLighter && this.blinkRatio > this.option.blinkRatioMax)
        || (!this.blinkLighter && this.blinkRatio < this.option.blinkRatioMin)) {
        this.blinkLighter = !this.blinkLighter;
      }
      this.blinkRatio += this.blinkLighter ? 0.01 : -0.01;
    }
  }

  revolve (degree, clockwise = true) {
    if (this.x === 0 && this.y === 0) return;
    if (clockwise) {
      if (this.degree >= 360) this.degree = this.degree - 360;
      this.degree += degree;
    } else {
      if (this.degree <= 0) this.degree = 360 + this.degree;
      this.degree -= degree;
    }
    this.x = this.distance * Math.cos(getRadians(this.degree));
    this.y = this.distance * Math.sin(getRadians(this.degree));
  }

  color () {
    const { r, g, b } = this.option.color;
    return rgb(r, g, b);
  }

  position () {
    return {
      x: this.x,
      y: this.y
    };
  }
}

function rgb (r, g, b) {
  return `rgb(${r}, ${g}, ${b})`;
}

function rgba (r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function genStarColor () {
  return colors.randomRgb();
}

function getDistance (a, b) {
  return Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) +
                   Math.pow(Math.abs(a.y - b.y), 2));
}

function getRadians (degree) {
  return degree * Math.PI / 180;
}

module.exports = Star;
