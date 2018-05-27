const Star = require('./star');

const option = Symbol('option');
const wrapper = Symbol('wrapper');
const stars = [];
const paths = [];
let canvas;
let ctx;
let running = false;

class StarTimeLapse {
  constructor (opt = {}) {
    this.defaultOption = {
      /* drawing */
      sum: 50,
      pole: -1,
      poleStar: true,
      radiusMin: 3,
      radiusMax: 9,
      /* animation */
      blink: true,
      run: true,
      clockwise: true,
      arc: 0.8,
      delay: 0,
      duration: 10000,
      fps: 60,
      /* style */
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: 'linear-gradient(#001, #232355)',
      style: {
        'z-index': -1,
        opacity: 0.8
      }
    };
    this[option] = Object.assign(this.defaultOption, opt);

    /* create wrapper and background */
    if (this[option].el) {
      this[wrapper] = this[option].el;
      this[wrapper].style.position = 'relative';
    } else {
      this[wrapper] = document.body;
    }

    const sky = document.createElement('div');
    sky.style.position = 'absolute';
    sky.style.top = this[option].top;
    sky.style.left = this[option].left;
    sky.style.bottom = this[option].bottom;
    sky.style.right = this[option].right;
    sky.style.background = this[option].background;
    sky.style.overflow = 'hidden';
    Object.keys(this[option].style).forEach(s => {
      sky.style[s] = this[option].style[s];
    });
    this[wrapper].appendChild(sky);

    /* drawing */
    canvas = document.createElement('canvas');
    canvas.innerHTML = 'Sorry, your browser does not support the canvas tag';
    this[option].radius = getRadius(sky.clientWidth / 2, sky.clientHeight / 2);
    if (this[option].pole === -1) {
      this[option].pole = {
        x: this[option].radius,
        y: this[option].radius
      };
    }
    this[option].offset = {
      x: this[option].radius - sky.clientWidth / 2,
      y: this[option].radius - sky.clientHeight / 2
    };
    canvas.width = this[option].radius * 2;
    canvas.height = this[option].radius * 2;
    canvas.style.position = 'absolute';
    canvas.style.left = `-${this[option].offset.x}px`;
    canvas.style.top = `-${this[option].offset.y}px`;
    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
      ctx.translate(this[option].pole.x, this[option].pole.y);
      if (this[option].poleStar) drawPoleStar(ctx, this[option]);
      drawStars(ctx, this[option]);
    }

    sky.appendChild(canvas);

    if (this[option].run) this.toggle();
  }

  toggle () {
    const interval = Math.round(1000 / this[option].fps);
    const degree = 360 * interval / this[option].duration;
    const { clockwise } = this[option];
    const animate = () => {
      if (running) {
        ctx.clearRect(-this[option].pole.x, -this[option].pole.y, canvas.getAttribute('width'), canvas.getAttribute('height'));
        paths.forEach((p, i) => {
          p.push(stars[i].position());
          if (p.length < 2) return;
          if (p.length > this[option].duration / interval * this[option].arc) p.splice(0, 1);
          if (p[0].x === 0 && p[0].y === 0) return;
          ctx.beginPath();
          p.forEach((pos, k) => {
            if (k < 1) return;
            ctx.lineTo(pos.x, pos.y);
          });
          ctx.strokeStyle = stars[i].color();
          ctx.stroke();
        });
        stars.forEach(s => {
          s.blink();
          s.revolve(degree, clockwise);
          s.draw();
        });
        setTimeout(() => {
          window.requestAnimationFrame(animate);
        }, interval);
      }
    };

    const start = () => {
      running = true;
    }
    const stop = () => {
      running = false;
    };

    if (!running) {
      start();
    } else {
      stop();
    }
    animate();
  }
};

function getRadius (x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function getPoint (x) {
  return Math.round(Math.random() * x);
}

function drawPoleStar (ctx, opt) {
  const x = 0;
  const y = 0;
  const radius = Math.ceil(Math.random() * opt.radiusMax + opt.radiusMin);
  const { pole, blink } = opt;
  drawStar(ctx, {
    x,
    y,
    radius,
    blink,
    pole
  });
}

function drawStars (ctx, opt) {
  for (let i = 0; i < opt.sum; ++i) {
    const x = getPoint(opt.radius * 2) - opt.pole.x;
    const y = getPoint(opt.radius * 2) - opt.pole.y;
    const radius = Math.ceil(Math.random() * opt.radiusMax + opt.radiusMin);
    const { pole, blink } = opt;
    drawStar(ctx, {
      x,
      y,
      radius,
      blink,
      pole
    });
  }
}

function drawStar (ctx, opt) {
  const star = new Star(ctx, opt);
  stars.push(star);
  paths.push([]);
  star.draw();
}

module.exports = StarTimeLapse;
