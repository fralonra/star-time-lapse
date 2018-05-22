# star-time-lapse

[![Build Status](https://travis-ci.org/fralonra/star-time-lapse.svg?branch=master)](https://travis-ci.org/fralonra/star-time-lapse)
[![npm version](https://img.shields.io/npm/v/star-time-lapse.svg)](https://www.npmjs.com/package/star-time-lapse)

Using canvas to draw a star-filled sky with time-lapse effect. The color of the star is generated randomly by [star-colors](https://github.com/fralonra/star-colors).

## Demo

Visit the [demo](https://fralonra.github.io/star-time-lapse/demo/).

## Install

```bash
npm install --save star-time-lapse
```

## Usage

Include the `javascript` file in your **Html** and make a new `StarTimeLapse`:
```html
<script src="/path/to/star-time-lapse.min.js"></script>
<script>
  const s = new StarTimeLapse({
    /* options */
    el: document.getElementById('sky'),
    sum: 30,
    pole: {
      x: 100,
      y: 100
    },
    duration: 12000
  });
</script>
```

## API

### options
| Option | Description | Type | Default |
| --- | --- | --- | --- |
| el | The wrapper element. A sky element will be appended to it as a child element. | Element | document.body |
| sum | The amount of stars in the sky. Pole star excluded. | Number | 50 |
| pole | The polar coordinate. A valid value is an object with `x` and `y` as properties. For example, `{ x: 10, y: 10 }`. Default to the center of the sky element. | Object | - |
| poleStar | Draw a pole star or not. | Boolean | true |
| radiusMin | The minimun radius of a star in px. | Number | 3 |
| radiusMax | The maximun radius of a star in px. | Number | 9 |
| blink | Will the star blink or not. | Boolean | true |
| arc | The percentage of the star's track remains in the sky as time flies. Range from 0 (no track) to 1 (a full circle track). | Number | 0.8 |
| duration | How long stars spin one turn in milliseconds. | Number | 10000 |
| top | The `top` CSS property of the sky element. | Number | 0 |
| left | The `left` CSS property of the sky element. | Number | 0 |
| bottom | The `bottom` CSS property of the sky element. | Number | 0 |
| right | The `right` CSS property of the sky element. | Number | 0 |
| background | The `background` CSS property for the sky element. | String | 'linear-gradient(#001, #232355)' |
| style | Other CSS properties applied on the sky element. | Object | { 'z-index': -1, opacity: 0.8 } |