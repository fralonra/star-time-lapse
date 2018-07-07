(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StarTimeLapse = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Star = require('./star');

const option = Symbol('option');
const wrapper = Symbol('wrapper');
const stars = [];
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
    const { arc, clockwise } = this[option];
    const animate = () => {
      if (running) {
        ctx.clearRect(-this[option].pole.x, -this[option].pole.y, canvas.getAttribute('width'), canvas.getAttribute('height'));
        stars.forEach((s, i) => {
          const atan = Math.atan2(s.y, s.x);
          ctx.beginPath();
          ctx.arc(0, 0, s.distance, atan, atan + Math.PI * arc, clockwise);
          ctx.strokeStyle = s.color();
          ctx.stroke();
          ctx.closePath();
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
  star.draw();
}

module.exports = StarTimeLapse;

},{"./star":4}],2:[function(require,module,exports){
module.exports={"O5V":{"class":"O5V","r":"155","g":"176","b":"255","hex":"#9bb0ff"},"O6V":{"class":"O6V","r":"162","g":"184","b":"255","hex":"#a2b8ff"},"O7V":{"class":"O7V","r":"157","g":"177","b":"255","hex":"#9db1ff"},"O8V":{"class":"O8V","r":"157","g":"177","b":"255","hex":"#9db1ff"},"O9V":{"class":"O9V","r":"154","g":"178","b":"255","hex":"#9ab2ff"},"O9.5V":{"class":"O9.5V","r":"164","g":"186","b":"255","hex":"#a4baff"},"B0V":{"class":"B0V","r":"156","g":"178","b":"255","hex":"#9cb2ff"},"B0.5V":{"class":"B0.5V","r":"167","g":"188","b":"255","hex":"#a7bcff"},"B1V":{"class":"B1V","r":"160","g":"182","b":"255","hex":"#a0b6ff"},"B2V":{"class":"B2V","r":"160","g":"180","b":"255","hex":"#a0b4ff"},"B3V":{"class":"B3V","r":"165","g":"185","b":"255","hex":"#a5b9ff"},"B4V":{"class":"B4V","r":"164","g":"184","b":"255","hex":"#a4b8ff"},"B5V":{"class":"B5V","r":"170","g":"191","b":"255","hex":"#aabfff"},"B6V":{"class":"B6V","r":"172","g":"189","b":"255","hex":"#acbdff"},"B7V":{"class":"B7V","r":"173","g":"191","b":"255","hex":"#adbfff"},"B8V":{"class":"B8V","r":"177","g":"195","b":"255","hex":"#b1c3ff"},"B9V":{"class":"B9V","r":"181","g":"198","b":"255","hex":"#b5c6ff"},"A0V":{"class":"A0V","r":"185","g":"201","b":"255","hex":"#b9c9ff"},"A1V":{"class":"A1V","r":"181","g":"199","b":"255","hex":"#b5c7ff"},"A2V":{"class":"A2V","r":"187","g":"203","b":"255","hex":"#bbcbff"},"A3V":{"class":"A3V","r":"191","g":"207","b":"255","hex":"#bfcfff"},"A5V":{"class":"A5V","r":"202","g":"215","b":"255","hex":"#cad7ff"},"A6V":{"class":"A6V","r":"199","g":"212","b":"255","hex":"#c7d4ff"},"A7V":{"class":"A7V","r":"200","g":"213","b":"255","hex":"#c8d5ff"},"A8V":{"class":"A8V","r":"213","g":"222","b":"255","hex":"#d5deff"},"A9V":{"class":"A9V","r":"219","g":"224","b":"255","hex":"#dbe0ff"},"F0V":{"class":"F0V","r":"224","g":"229","b":"255","hex":"#e0e5ff"},"F2V":{"class":"F2V","r":"236","g":"239","b":"255","hex":"#ecefff"},"F4V":{"class":"F4V","r":"224","g":"226","b":"255","hex":"#e0e2ff"},"F5V":{"class":"F5V","r":"248","g":"247","b":"255","hex":"#f8f7ff"},"F6V":{"class":"F6V","r":"244","g":"241","b":"255","hex":"#f4f1ff"},"F7V":{"class":"F7V","r":"246","g":"243","b":"255","hex":"#f6f3ff"},"F8V":{"class":"F8V","r":"255","g":"247","b":"252","hex":"#fff7fc"},"F9V":{"class":"F9V","r":"255","g":"247","b":"252","hex":"#fff7fc"},"G0V":{"class":"G0V","r":"255","g":"248","b":"252","hex":"#fff8fc"},"G1V":{"class":"G1V","r":"255","g":"247","b":"248","hex":"#fff7f8"},"G2V":{"class":"G2V","r":"255","g":"245","b":"242","hex":"#fff5f2"},"G4V":{"class":"G4V","r":"255","g":"241","b":"229","hex":"#fff1e5"},"G5V":{"class":"G5V","r":"255","g":"244","b":"234","hex":"#fff4ea"},"G6V":{"class":"G6V","r":"255","g":"244","b":"235","hex":"#fff4eb"},"G7V":{"class":"G7V","r":"255","g":"244","b":"235","hex":"#fff4eb"},"G8V":{"class":"G8V","r":"255","g":"237","b":"222","hex":"#ffedde"},"G9V":{"class":"G9V","r":"255","g":"239","b":"221","hex":"#ffefdd"},"K0V":{"class":"K0V","r":"255","g":"238","b":"221","hex":"#ffeedd"},"K1V":{"class":"K1V","r":"255","g":"224","b":"188","hex":"#ffe0bc"},"K2V":{"class":"K2V","r":"255","g":"227","b":"196","hex":"#ffe3c4"},"K3V":{"class":"K3V","r":"255","g":"222","b":"195","hex":"#ffdec3"},"K4V":{"class":"K4V","r":"255","g":"216","b":"181","hex":"#ffd8b5"},"K5V":{"class":"K5V","r":"255","g":"210","b":"161","hex":"#ffd2a1"},"K7V":{"class":"K7V","r":"255","g":"199","b":"142","hex":"#ffc78e"},"K8V":{"class":"K8V","r":"255","g":"209","b":"174","hex":"#ffd1ae"},"M0V":{"class":"M0V","r":"255","g":"195","b":"139","hex":"#ffc38b"},"M1V":{"class":"M1V","r":"255","g":"204","b":"142","hex":"#ffcc8e"},"M2V":{"class":"M2V","r":"255","g":"196","b":"131","hex":"#ffc483"},"M3V":{"class":"M3V","r":"255","g":"206","b":"129","hex":"#ffce81"},"M4V":{"class":"M4V","r":"255","g":"201","b":"127","hex":"#ffc97f"},"M5V":{"class":"M5V","r":"255","g":"204","b":"111","hex":"#ffcc6f"},"M6V":{"class":"M6V","r":"255","g":"195","b":"112","hex":"#ffc370"},"M8V":{"class":"M8V","r":"255","g":"198","b":"109","hex":"#ffc66d"},"B1IV":{"class":"B1IV","r":"157","g":"180","b":"255","hex":"#9db4ff"},"B2IV":{"class":"B2IV","r":"159","g":"179","b":"255","hex":"#9fb3ff"},"B3IV":{"class":"B3IV","r":"166","g":"188","b":"255","hex":"#a6bcff"},"B6IV":{"class":"B6IV","r":"175","g":"194","b":"255","hex":"#afc2ff"},"B7IV":{"class":"B7IV","r":"170","g":"189","b":"255","hex":"#aabdff"},"B9IV":{"class":"B9IV","r":"180","g":"197","b":"255","hex":"#b4c5ff"},"A0IV":{"class":"A0IV","r":"179","g":"197","b":"255","hex":"#b3c5ff"},"A3IV":{"class":"A3IV","r":"190","g":"205","b":"255","hex":"#becdff"},"A4IV":{"class":"A4IV","r":"195","g":"210","b":"255","hex":"#c3d2ff"},"A5IV":{"class":"A5IV","r":"212","g":"220","b":"255","hex":"#d4dcff"},"A7IV":{"class":"A7IV","r":"192","g":"207","b":"255","hex":"#c0cfff"},"A9IV":{"class":"A9IV","r":"224","g":"227","b":"255","hex":"#e0e3ff"},"F0IV":{"class":"F0IV","r":"218","g":"224","b":"255","hex":"#dae0ff"},"F2IV":{"class":"F2IV","r":"227","g":"230","b":"255","hex":"#e3e6ff"},"F3IV":{"class":"F3IV","r":"227","g":"230","b":"255","hex":"#e3e6ff"},"F5IV":{"class":"F5IV","r":"241","g":"239","b":"255","hex":"#f1efff"},"F7IV":{"class":"F7IV","r":"240","g":"239","b":"255","hex":"#f0efff"},"F8IV":{"class":"F8IV","r":"255","g":"252","b":"253","hex":"#fffcfd"},"G0IV":{"class":"G0IV","r":"255","g":"248","b":"245","hex":"#fff8f5"},"G2IV":{"class":"G2IV","r":"255","g":"244","b":"242","hex":"#fff4f2"},"G3IV":{"class":"G3IV","r":"255","g":"238","b":"226","hex":"#ffeee2"},"G4IV":{"class":"G4IV","r":"255","g":"245","b":"238","hex":"#fff5ee"},"G5IV":{"class":"G5IV","r":"255","g":"235","b":"213","hex":"#ffebd5"},"G6IV":{"class":"G6IV","r":"255","g":"242","b":"234","hex":"#fff2ea"},"G7IV":{"class":"G7IV","r":"255","g":"231","b":"205","hex":"#ffe7cd"},"G8IV":{"class":"G8IV","r":"255","g":"233","b":"211","hex":"#ffe9d3"},"K0IV":{"class":"K0IV","r":"255","g":"225","b":"189","hex":"#ffe1bd"},"K1IV":{"class":"K1IV","r":"255","g":"216","b":"171","hex":"#ffd8ab"},"K2IV":{"class":"K2IV","r":"255","g":"229","b":"202","hex":"#ffe5ca"},"K3IV":{"class":"K3IV","r":"255","g":"219","b":"167","hex":"#ffdba7"},"O7III":{"class":"O7III","r":"158","g":"177","b":"255","hex":"#9eb1ff"},"O8III":{"class":"O8III","r":"157","g":"178","b":"255","hex":"#9db2ff"},"O9III":{"class":"O9III","r":"158","g":"177","b":"255","hex":"#9eb1ff"},"B0III":{"class":"B0III","r":"158","g":"177","b":"255","hex":"#9eb1ff"},"B1III":{"class":"B1III","r":"158","g":"177","b":"255","hex":"#9eb1ff"},"B2III":{"class":"B2III","r":"159","g":"180","b":"255","hex":"#9fb4ff"},"B3III":{"class":"B3III","r":"163","g":"187","b":"255","hex":"#a3bbff"},"B5III":{"class":"B5III","r":"168","g":"189","b":"255","hex":"#a8bdff"},"B7III":{"class":"B7III","r":"171","g":"191","b":"255","hex":"#abbfff"},"B9III":{"class":"B9III","r":"178","g":"195","b":"255","hex":"#b2c3ff"},"A0III":{"class":"A0III","r":"188","g":"205","b":"255","hex":"#bccdff"},"A3III":{"class":"A3III","r":"189","g":"203","b":"255","hex":"#bdcbff"},"A5III":{"class":"A5III","r":"202","g":"215","b":"255","hex":"#cad7ff"},"A6III":{"class":"A6III","r":"209","g":"219","b":"255","hex":"#d1dbff"},"A7III":{"class":"A7III","r":"210","g":"219","b":"255","hex":"#d2dbff"},"A8III":{"class":"A8III","r":"209","g":"219","b":"255","hex":"#d1dbff"},"A9III":{"class":"A9III","r":"209","g":"219","b":"255","hex":"#d1dbff"},"F0III":{"class":"F0III","r":"213","g":"222","b":"255","hex":"#d5deff"},"F2III":{"class":"F2III","r":"241","g":"241","b":"255","hex":"#f1f1ff"},"F4III":{"class":"F4III","r":"241","g":"240","b":"255","hex":"#f1f0ff"},"F5III":{"class":"F5III","r":"242","g":"240","b":"255","hex":"#f2f0ff"},"F6III":{"class":"F6III","r":"241","g":"240","b":"255","hex":"#f1f0ff"},"F7III":{"class":"F7III","r":"241","g":"240","b":"255","hex":"#f1f0ff"},"G0III":{"class":"G0III","r":"255","g":"242","b":"233","hex":"#fff2e9"},"G1III":{"class":"G1III","r":"255","g":"243","b":"233","hex":"#fff3e9"},"G2III":{"class":"G2III","r":"255","g":"243","b":"233","hex":"#fff3e9"},"G3III":{"class":"G3III","r":"255","g":"243","b":"233","hex":"#fff3e9"},"G4III":{"class":"G4III","r":"255","g":"243","b":"233","hex":"#fff3e9"},"G5III":{"class":"G5III","r":"255","g":"236","b":"211","hex":"#ffecd3"},"G6III":{"class":"G6III","r":"255","g":"236","b":"215","hex":"#ffecd7"},"G8III":{"class":"G8III","r":"255","g":"231","b":"199","hex":"#ffe7c7"},"G9III":{"class":"G9III","r":"255","g":"231","b":"196","hex":"#ffe7c4"},"K0III":{"class":"K0III","r":"255","g":"227","b":"190","hex":"#ffe3be"},"K1III":{"class":"K1III","r":"255","g":"223","b":"181","hex":"#ffdfb5"},"K2III":{"class":"K2III","r":"255","g":"221","b":"175","hex":"#ffddaf"},"K3III":{"class":"K3III","r":"255","g":"216","b":"167","hex":"#ffd8a7"},"K4III":{"class":"K4III","r":"255","g":"211","b":"146","hex":"#ffd392"},"K5III":{"class":"K5III","r":"255","g":"204","b":"138","hex":"#ffcc8a"},"K7III":{"class":"K7III","r":"255","g":"208","b":"142","hex":"#ffd08e"},"M0III":{"class":"M0III","r":"255","g":"203","b":"132","hex":"#ffcb84"},"M1III":{"class":"M1III","r":"255","g":"200","b":"121","hex":"#ffc879"},"M2III":{"class":"M2III","r":"255","g":"198","b":"118","hex":"#ffc676"},"M3III":{"class":"M3III","r":"255","g":"200","b":"119","hex":"#ffc877"},"M4III":{"class":"M4III","r":"255","g":"206","b":"127","hex":"#ffce7f"},"M5III":{"class":"M5III","r":"255","g":"197","b":"124","hex":"#ffc57c"},"M6III":{"class":"M6III","r":"255","g":"178","b":"121","hex":"#ffb279"},"M7III":{"class":"M7III","r":"255","g":"165","b":"097","hex":"#ffa561"},"M8III":{"class":"M8III","r":"255","g":"167","b":"097","hex":"#ffa761"},"M9III":{"class":"M9III","r":"255","g":"233","b":"154","hex":"#ffe99a"},"B2II":{"class":"B2II","r":"165","g":"192","b":"255","hex":"#a5c0ff"},"B5II":{"class":"B5II","r":"175","g":"195","b":"255","hex":"#afc3ff"},"F0II":{"class":"F0II","r":"203","g":"217","b":"255","hex":"#cbd9ff"},"F2II":{"class":"F2II","r":"229","g":"233","b":"255","hex":"#e5e9ff"},"G5II":{"class":"G5II","r":"255","g":"235","b":"203","hex":"#ffebcb"},"M3II":{"class":"M3II","r":"255","g":"201","b":"119","hex":"#ffc977"},"O9I":{"class":"O9I","r":"164","g":"185","b":"255","hex":"#a4b9ff"},"B0I":{"class":"B0I","r":"161","g":"189","b":"255","hex":"#a1bdff"},"B1I":{"class":"B1I","r":"168","g":"193","b":"255","hex":"#a8c1ff"},"B2I":{"class":"B2I","r":"177","g":"196","b":"255","hex":"#b1c4ff"},"B3I":{"class":"B3I","r":"175","g":"194","b":"255","hex":"#afc2ff"},"B4I":{"class":"B4I","r":"187","g":"203","b":"255","hex":"#bbcbff"},"B5I":{"class":"B5I","r":"179","g":"202","b":"255","hex":"#b3caff"},"B6I":{"class":"B6I","r":"191","g":"207","b":"255","hex":"#bfcfff"},"B7I":{"class":"B7I","r":"195","g":"209","b":"255","hex":"#c3d1ff"},"B8I":{"class":"B8I","r":"182","g":"206","b":"255","hex":"#b6ceff"},"B9I":{"class":"B9I","r":"204","g":"216","b":"255","hex":"#ccd8ff"},"A0I":{"class":"A0I","r":"187","g":"206","b":"255","hex":"#bbceff"},"A1I":{"class":"A1I","r":"214","g":"223","b":"255","hex":"#d6dfff"},"A2I":{"class":"A2I","r":"199","g":"214","b":"255","hex":"#c7d6ff"},"A5I":{"class":"A5I","r":"223","g":"229","b":"255","hex":"#dfe5ff"},"F0I":{"class":"F0I","r":"202","g":"215","b":"255","hex":"#cad7ff"},"F2I":{"class":"F2I","r":"244","g":"243","b":"255","hex":"#f4f3ff"},"F5I":{"class":"F5I","r":"219","g":"225","b":"255","hex":"#dbe1ff"},"F8I":{"class":"F8I","r":"255","g":"252","b":"247","hex":"#fffcf7"},"G0I":{"class":"G0I","r":"255","g":"239","b":"219","hex":"#ffefdb"},"G2I":{"class":"G2I","r":"255","g":"236","b":"205","hex":"#ffeccd"},"G3I":{"class":"G3I","r":"255","g":"231","b":"203","hex":"#ffe7cb"},"G5I":{"class":"G5I","r":"255","g":"230","b":"183","hex":"#ffe6b7"},"G8I":{"class":"G8I","r":"255","g":"220","b":"167","hex":"#ffdca7"},"K0I":{"class":"K0I","r":"255","g":"221","b":"181","hex":"#ffddb5"},"K1I":{"class":"K1I","r":"255","g":"220","b":"177","hex":"#ffdcb1"},"K2I":{"class":"K2I","r":"255","g":"211","b":"135","hex":"#ffd387"},"K3I":{"class":"K3I","r":"255","g":"204","b":"128","hex":"#ffcc80"},"K4I":{"class":"K4I","r":"255","g":"201","b":"118","hex":"#ffc976"},"K5I":{"class":"K5I","r":"255","g":"209","b":"154","hex":"#ffd19a"},"M0I":{"class":"M0I","r":"255","g":"204","b":"143","hex":"#ffcc8f"},"M1I":{"class":"M1I","r":"255","g":"202","b":"138","hex":"#ffca8a"},"M2I":{"class":"M2I","r":"255","g":"193","b":"104","hex":"#ffc168"},"M3I":{"class":"M3I","r":"255","g":"192","b":"118","hex":"#ffc076"},"M4I":{"class":"M4I","r":"255","g":"185","b":"104","hex":"#ffb968"},"N":{"class":"N","r":"255","g":"157","b":"000","hex":"#ff9d00"}}
},{}],3:[function(require,module,exports){
const data = require('./data');
const keys = Object.keys(data);

const chromaticity = {
  get (type) {
    return data[type] || null;
  },

  randomRgb () {
    const stellar = data[keys[Math.round(Math.random() * (keys.length - 1))]];
    return {
      r: stellar.r,
      g: stellar.g,
      b: stellar.b
    };
  },

  randomHex () {
    return data[keys[Math.round(Math.random() * (keys.length - 1))]].hex;
  }
};

module.exports = chromaticity;

},{"./data":2}],4:[function(require,module,exports){
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

},{"star-colors":3}]},{},[1])(1)
});
