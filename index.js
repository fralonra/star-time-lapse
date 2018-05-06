const option = Symbol('option');
const wrapper = Symbol('wrapper');

class starTimeLapse {
  constructor (opt = {}) {
    this.defaultOption = {
      /* drawing */
      sum: 50,
      pole: -1,
      poleStar: true,
      /* animation */
      run: true,
      clockwise: true,
      duration: 10000,
      delay: 0,
      /* style */
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: '#2a1f66',
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
    
    if (this[option].pole === -1) {
      this[option].pole = {
        x: sky.clientWidth / 2,
        y: sky.clientHeight / 2
      }
    }
    /* drawing */
    const canvas = document.createElement('canvas');
    canvas.innerHTML = 'Sorry, your browser does not support the canvas tag';
    this[option].radius = getRadius(sky.clientWidth / 2, sky.clientHeight / 2);
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
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      if (this[option].poleStar) drawPoleStar(ctx, this[option]);
      drawStars(ctx, this[option]);
      ctx.fill();
    }
    
    sky.appendChild(canvas);
    
    if (this[option].run) this.run();
  }
  
  run () {}
  
  stop () {}
};

function getRadius (x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function getPoint (x) {
  return Math.round(Math.random() * x);
}

function drawPoleStar (ctx, opt) {
  ctx.arc(opt.pole.x + opt.offset.x, opt.pole.y + opt.offset.y, 10, 0, 2 * Math.PI, true);
  ctx.closePath();
}

function drawStars (ctx, opt) {
  for (let i = 0; i < opt.sum; ++i) {
    drawStar(ctx, opt);
  }
}

function drawStar (ctx, opt) {
  ctx.arc(getPoint(opt.radius * 2) + opt.offset.x, getPoint(opt.radius * 2) + opt.offset.y, 5, 0, 2 * Math.PI, true);
  ctx.closePath();
}

module.exports = starTimeLapse;