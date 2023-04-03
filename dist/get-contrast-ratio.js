(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("canvas"));
	else if(typeof define === 'function' && define.amd)
		define(["canvas"], factory);
	else if(typeof exports === 'object')
		exports["getContrastRatio"] = factory(require("canvas"));
	else
		root["getContrastRatio"] = factory(root["canvas"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__13__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const rules = __webpack_require__(1);

module.exports = async function() {
    for (let i = 0; i < rules.length; i++) {
        if (rules[i].condition(arguments)) {
            const ratio = await rules[i].handle(arguments);
            return ratio;
        }
    }
}


/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const contrast = __webpack_require__(2);
const getAreaPixels = typeof window === "undefined" ? __webpack_require__(12) : __webpack_require__(14);
const getColors = __webpack_require__(15);

async function getImgColors(imgObj) {
    let hasAreaConf = imgObj.width && imgObj.height ? true : false;
    let imgColors;

    if (hasAreaConf) {
        imgColors = getColors(await getAreaPixels(imgObj.url, {x: imgObj.x, y: imgObj.y, width: imgObj.width, height: imgObj.height}));
    } else {
        imgColors = getColors(await getAreaPixels(imgObj.url));
    }
    return imgColors;
}

const twoColors = {
    condition: function (params) {
        return params.length === 2 && typeof params[0] === 'string' && typeof params[1] === 'string';
    },
    handle: function (params) {
        return contrast.ratio(params[0], params[1]).toFixed(2);
    }
}

const oneColorOneImg = {
    condition: function (params) {
        return params.length === 2 
        && ((typeof params[0] === 'object' && typeof params[1] === 'string') 
            || (typeof params[0] === 'string' && typeof params[1] === 'object'));
    },
    handle: async function (params) {
        let imgObj = typeof params[0] === 'object' ? params[0] : params[1];
        let colorStr = typeof params[0] === 'string' ? params[0] : params[1];
        let imgColors = await getImgColors(imgObj);
        return contrast.ratio(colorStr, imgColors[0].color).toFixed(2);
    }
}

const singleImg = {
    condition: function (params) {
        return params.length === 1 && typeof params[0] === 'object';
    },
    handle: async function (params) {
        let imgObj = params[0];
        let imgColors = await getImgColors(imgObj);
        if (imgColors.length >= 2) {
            return contrast.ratio(imgColors[0].color, imgColors[1].color).toFixed(2);
        } else {
            return 1;
        }
    }
}

const rules = [twoColors, oneColorOneImg, singleImg];
module.exports = rules;


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const rgb = __webpack_require__(3);
const wcag = __webpack_require__(4);
const isBlank = __webpack_require__(5);
const isNamedCssColor = __webpack_require__(8);
const cssColorNames = __webpack_require__(11);

module.exports.ratio = ratio;
module.exports.score = score;
module.exports.isAccessible = isAccessible;
module.exports.isNotTransparent = isNotTransparent;

function ratio(colorOne, colorTwo, options) {
  colorOne = getRgbTriplet(colorOne, options);
  colorTwo = getRgbTriplet(colorTwo, options);

  return wcag.rgb(colorOne, colorTwo);
}

function score(colorOne, colorTwo, options) {
  var wcagScore = wcag.score(ratio(colorOne, colorTwo, options));

  if (isBlank(wcagScore)) {
    return "F";
  } else {
    return wcagScore;
  }
}

function isAccessible(colorOne, colorTwo, options) {
  return ratio(colorOne, colorTwo, options) > 4.5;
}

function getRgbTriplet(providedColor, options) {
  if (typeof providedColor !== "string") {
    throw new TypeError("get-contrast expects colors as strings");
  }

  let color = providedColor.toLowerCase()

  if (isNamedCssColor(color)) {
    color = cssColorNames[color];
  }

  color = isNotTransparent(color, options);
  return color
    .match(/\((.*)\)/)[1]
    .split(",")
    .slice(0, 3);
}

function isNotTransparent(color, options) {
  options = options || {};

  // Convert to RGB.
  color = rgb(color);
  // Check if the rgb returned color is rgba and if the 'a' value is 0.
  const cArray = color.match(/\((.*)\)/)[1].split(",");
  if (cArray.length == 4 && cArray[3] == "0" && !options.ignoreAlpha) {
    throw new TypeError("get-contrast cannot contrast transparent colors");
  } else {
    return color;
  }
}


/***/ }),
/* 3 */
/***/ ((module) => {

"use strict";
/*
color
*/

var colors = {
    maroon      : "#800000",
    red         : "#ff0000",
    orange      : "#ffA500",
    yellow      : "#ffff00",
    olive       : "#808000",
    purple      : "#800080",
    fuchsia     : "#ff00ff",
    white       : "#ffffff",
    lime        : "#00ff00",
    green       : "#008000",
    navy        : "#000080",
    blue        : "#0000ff",
    aqua        : "#00ffff",
    teal        : "#008080",
    black       : "#000000",
    silver      : "#c0c0c0",
    gray        : "#808080",
    transparent : "#0000"
}

var RGBtoRGB = function(r, g, b, a){
    if (a == null || a === "") a = 1
    r = parseFloat(r)
    g = parseFloat(g)
    b = parseFloat(b)
    a = parseFloat(a)
    if (!(r <= 255 && r >= 0 && g <= 255 && g >= 0 && b <= 255 && b >= 0 && a <= 1 && a >= 0)) return null

    return [Math.round(r), Math.round(g), Math.round(b), a]
}

var HEXtoRGB = function(hex){
    if (hex.length === 3) hex += "f"
    if (hex.length === 4){
        var h0 = hex.charAt(0),
            h1 = hex.charAt(1),
            h2 = hex.charAt(2),
            h3 = hex.charAt(3)

        hex = h0 + h0 + h1 + h1 + h2 + h2 + h3 + h3
    }
    if (hex.length === 6) hex += "ff"
    var rgb = []
    for (var i = 0, l = hex.length; i < l; i += 2) rgb.push(parseInt(hex.substr(i, 2), 16) / (i === 6 ? 255 : 1))
    return rgb
}

// HSL to RGB conversion from:
// http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
// thank you!

var HUEtoRGB = function(p, q, t){
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
}

var HSLtoRGB = function(h, s, l, a){
    var r, b, g
    if (a == null || a === "") a = 1
    h = parseFloat(h) / 360
    s = parseFloat(s) / 100
    l = parseFloat(l) / 100
    a = parseFloat(a) / 1
    if (h > 1 || h < 0 || s > 1 || s < 0 || l > 1 || l < 0 || a > 1 || a < 0) return null
    if (s === 0){
        r = b = g = l
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q
        r = HUEtoRGB(p, q, h + 1 / 3)
        g = HUEtoRGB(p, q, h)
        b = HUEtoRGB(p, q, h - 1 / 3)
    }
    return [r * 255, g * 255, b * 255, a]
}

var keys = []
for (var c in colors) keys.push(c)

var shex  = "(?:#([a-f0-9]{3,8}))",
    sval  = "\\s*([.\\d%]+)\\s*",
    sop   = "(?:,\\s*([.\\d]+)\\s*)?",
    slist = "\\(" + [sval, sval, sval] + sop + "\\)",
    srgb  = "(?:rgb)a?",
    shsl  = "(?:hsl)a?",
    skeys = "(" + keys.join("|") + ")"


var xhex   = RegExp(shex, "i"),
    xrgb   = RegExp(srgb + slist, "i"),
    xhsl   = RegExp(shsl + slist, "i")

var color = function(input, array){
    if (input == null) return null
    input = (input + "").replace(/\s+/, "")

    var match = colors[input]
    if (match){
        return color(match, array)
    } else if (match = input.match(xhex)){
        input = HEXtoRGB(match[1])
    } else if (match = input.match(xrgb)){
        input = match.slice(1)
    } else if (match = input.match(xhsl)){
        input = HSLtoRGB.apply(null, match.slice(1))
    } else return null

    if (!(input && (input = RGBtoRGB.apply(null, input)))) return null
    if (array) return input
    if (input[3] === 1) input.splice(3, 1)
    return "rgb" + (input.length === 4 ? "a" : "") + "(" + input + ")"
}

var regexp = RegExp([skeys, shex, srgb + slist, shsl + slist].join("|"), "gi")

color.replace = function(string, method){
    if (!method) method = function(match){
        return color(match)
    }
    return (string + "").replace(regexp, method)
}

color.matches = function(string){
    return !!(string + "").match(regexp)
}

module.exports = color


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hex": () => (/* binding */ s),
/* harmony export */   "luminance": () => (/* binding */ c),
/* harmony export */   "rgb": () => (/* binding */ o),
/* harmony export */   "score": () => (/* binding */ f)
/* harmony export */ });
var n=.2126,r=.7152,t=.0722,e=1/12.92;function u(n){return Math.pow((n+.055)/1.055,2.4)}function a(a){var i=a[0]/255,c=a[1]/255,o=a[2]/255,s=i<=.03928?i*e:u(i),f=c<=.03928?c*e:u(c),l=o<=.03928?o*e:u(o);return s*n+f*r+l*t}function i(n){var r=255;8===(n=n.replace(/^#/,"")).length&&(r=parseInt(n.slice(6,8),16),n=n.substring(0,6)),4===n.length&&(r=parseInt(n.slice(3,4).repeat(2),16),n=n.substring(0,3)),3===n.length&&(n=n[0]+n[0]+n[1]+n[1]+n[2]+n[2]);var t=parseInt(n,16);return[t>>16,t>>8&255,255&t,r]}function c(n,r){return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function o(n,r){return c(a(n),a(r))}function s(n,r){return o(i(n),i(r))}function f(n){return n>=7?"AAA":n>=4.5?"AA":n>=3?"AA Large":"Fail"}
//# sourceMappingURL=index.m.js.map


/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isEmpty = __webpack_require__(6)
var isWhitespace = __webpack_require__(7)

function isString (object) {
  return typeof object === 'string'
}

module.exports = function (object) {
  return isString(object) && object.length ? isWhitespace(object) : isEmpty(object)
}


/***/ }),
/* 6 */
/***/ ((module) => {


/**
 * Has own property.
 *
 * @type {Function}
 */

var has = Object.prototype.hasOwnProperty

/**
 * To string.
 *
 * @type {Function}
 */

var toString = Object.prototype.toString

/**
 * Test whether a value is "empty".
 *
 * @param {Mixed} val
 * @return {Boolean}
 */

function isEmpty(val) {
  // Null and Undefined...
  if (val == null) return true

  // Booleans...
  if ('boolean' == typeof val) return false

  // Numbers...
  if ('number' == typeof val) return val === 0

  // Strings...
  if ('string' == typeof val) return val.length === 0

  // Functions...
  if ('function' == typeof val) return val.length === 0

  // Arrays...
  if (Array.isArray(val)) return val.length === 0

  // Errors...
  if (val instanceof Error) return val.message === ''

  // Objects...
  if (val.toString == toString) {
    switch (val.toString()) {

      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0
      }

      // Plain objects...
      case '[object Object]': {
        for (var key in val) {
          if (has.call(val, key)) return false
        }

        return true
      }
    }
  }

  // Anything else...
  return false
}

/**
 * Export `isEmpty`.
 *
 * @type {Function}
 */

module.exports = isEmpty


/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
/*!
 * is-whitespace <https://github.com/jonschlinkert/is-whitespace>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */



var cache;

module.exports = function isWhitespace(str) {
  return (typeof str === 'string') && regex().test(str);
};

function regex() {
  // ensure that runtime compilation only happens once
  return cache || (cache = new RegExp('^[\\s\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF"]+$'));
}


/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var cssColors = __webpack_require__(9)

module.exports = function isNamedCssColor (color) {
  if (typeof color !== 'string') {
    throw new TypeError('is-named-css-color expects a string')
  }

  var cssColorRegex = new RegExp('^' + cssColors().join('|') + '$', 'i')
  return cssColorRegex.test(color)
}


/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var cssColorNames = __webpack_require__(10);

module.exports = function cssColorList() {
  return Object.keys(cssColorNames);
}


/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"aqua":"#00ffff","aliceblue":"#f0f8ff","antiquewhite":"#faebd7","black":"#000000","blue":"#0000ff","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgreen":"#006400","darkturquoise":"#00ced1","deepskyblue":"#00bfff","green":"#008000","lime":"#00ff00","mediumblue":"#0000cd","mediumspringgreen":"#00fa9a","navy":"#000080","springgreen":"#00ff7f","teal":"#008080","midnightblue":"#191970","dodgerblue":"#1e90ff","lightseagreen":"#20b2aa","forestgreen":"#228b22","seagreen":"#2e8b57","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","limegreen":"#32cd32","mediumseagreen":"#3cb371","turquoise":"#40e0d0","royalblue":"#4169e1","steelblue":"#4682b4","darkslateblue":"#483d8b","mediumturquoise":"#48d1cc","indigo":"#4b0082","darkolivegreen":"#556b2f","cadetblue":"#5f9ea0","cornflowerblue":"#6495ed","mediumaquamarine":"#66cdaa","dimgray":"#696969","dimgrey":"#696969","slateblue":"#6a5acd","olivedrab":"#6b8e23","slategray":"#708090","slategrey":"#708090","lightslategray":"#778899","lightslategrey":"#778899","mediumslateblue":"#7b68ee","lawngreen":"#7cfc00","aquamarine":"#7fffd4","chartreuse":"#7fff00","gray":"#808080","grey":"#808080","maroon":"#800000","olive":"#808000","purple":"#800080","lightskyblue":"#87cefa","skyblue":"#87ceeb","blueviolet":"#8a2be2","darkmagenta":"#8b008b","darkred":"#8b0000","saddlebrown":"#8b4513","darkseagreen":"#8fbc8f","lightgreen":"#90ee90","mediumpurple":"#9370db","darkviolet":"#9400d3","palegreen":"#98fb98","darkorchid":"#9932cc","yellowgreen":"#9acd32","sienna":"#a0522d","brown":"#a52a2a","darkgray":"#a9a9a9","darkgrey":"#a9a9a9","greenyellow":"#adff2f","lightblue":"#add8e6","paleturquoise":"#afeeee","lightsteelblue":"#b0c4de","powderblue":"#b0e0e6","firebrick":"#b22222","darkgoldenrod":"#b8860b","mediumorchid":"#ba55d3","rosybrown":"#bc8f8f","darkkhaki":"#bdb76b","silver":"#c0c0c0","mediumvioletred":"#c71585","indianred":"#cd5c5c","peru":"#cd853f","chocolate":"#d2691e","tan":"#d2b48c","lightgray":"#d3d3d3","lightgrey":"#d3d3d3","thistle":"#d8bfd8","goldenrod":"#daa520","orchid":"#da70d6","palevioletred":"#db7093","crimson":"#dc143c","gainsboro":"#dcdcdc","plum":"#dda0dd","burlywood":"#deb887","lightcyan":"#e0ffff","lavender":"#e6e6fa","darksalmon":"#e9967a","palegoldenrod":"#eee8aa","violet":"#ee82ee","azure":"#f0ffff","honeydew":"#f0fff0","khaki":"#f0e68c","lightcoral":"#f08080","sandybrown":"#f4a460","beige":"#f5f5dc","mintcream":"#f5fffa","wheat":"#f5deb3","whitesmoke":"#f5f5f5","ghostwhite":"#f8f8ff","lightgoldenrodyellow":"#fafad2","linen":"#faf0e6","salmon":"#fa8072","oldlace":"#fdf5e6","bisque":"#ffe4c4","blanchedalmond":"#ffebcd","coral":"#ff7f50","cornsilk":"#fff8dc","darkorange":"#ff8c00","deeppink":"#ff1493","floralwhite":"#fffaf0","fuchsia":"#ff00ff","gold":"#ffd700","hotpink":"#ff69b4","ivory":"#fffff0","lavenderblush":"#fff0f5","lemonchiffon":"#fffacd","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightyellow":"#ffffe0","magenta":"#ff00ff","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","orange":"#ffa500","orangered":"#ff4500","papayawhip":"#ffefd5","peachpuff":"#ffdab9","pink":"#ffc0cb","red":"#ff0000","seashell":"#fff5ee","snow":"#fffafa","tomato":"#ff6347","white":"#ffffff","yellow":"#ffff00","rebeccapurple":"#663399"}');

/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkgrey":"#a9a9a9","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dimgrey":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","goldenrod":"#daa520","gold":"#ffd700","gray":"#808080","green":"#008000","greenyellow":"#adff2f","grey":"#808080","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavenderblush":"#fff0f5","lavender":"#e6e6fa","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgray":"#d3d3d3","lightgreen":"#90ee90","lightgrey":"#d3d3d3","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightslategrey":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370db","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#db7093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","slategrey":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"}');

/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { createCanvas, loadImage } = __webpack_require__(13);

function isNullObj(obj) {
    return !Object.keys(obj).length;
}

async function getAreaPixels(url, imgArea = {}) {
    const img = await loadImage(url);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let pixels;
    if (isNullObj(imgArea)) {
        pixels = ctx.getImageData(0, 0, img.width, img.height);
    } else {
        pixels = ctx.getImageData(
            imgArea.x,
            imgArea.y,
            imgArea.width,
            imgArea.height
        );
    }
    return pixels.data;
}

module.exports = getAreaPixels;


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__13__;

/***/ }),
/* 14 */
/***/ ((module) => {

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

function isNullObj(obj) {
    return !Object.keys(obj).length;
}

async function getAreaPixels(url, imgArea = {}) {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let pixels;
    if (isNullObj(imgArea)) {
        pixels = ctx.getImageData(0, 0, img.width, img.height);
    } else {
        pixels = ctx.getImageData(
            imgArea.x,
            imgArea.y,
            imgArea.width,
            imgArea.height
        );
    }
    return pixels.data;
}

module.exports = getAreaPixels;


/***/ }),
/* 15 */
/***/ ((module) => {

function getColors(data) {
    const colorsMap = {};

    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3];
        // skip fully transparent pixels
        if (alpha === 0) continue;

        let rgbComponents = Array.from(data.subarray(i, i + 3));

        // skip undefined data
        if (rgbComponents.indexOf(undefined) !== -1) continue;

        let color = `rgb(${rgbComponents.join(',')})`;

        if (colorsMap[color]) {
            colorsMap[color].count++;
        } else {
            colorsMap[color] = { color, count: 1 };
        }
    }

    const colors = Object.values(colorsMap);
    return colors.sort((a, b) => b.count - a.count);
}

module.exports = getColors;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});