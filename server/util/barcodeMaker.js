const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');
const fileUrl = require('file-url');
const path = require('path');

const html = (label) => {
  const height = label.length > 7 ? '100' : '80';
  return `<!DOCTYPE html>
<html>

<head>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>

<body>
  <script >/*! JsBarcode v3.11.0 | (c) Johan Lindell | MIT license */
  !function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=10)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t};e.default=function(t,e){return r({},t,e)}},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(t){function e(t,n){r(this,e);var o=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return o.name="InvalidInputException",o.symbology=t,o.input=n,o.message='"'+o.input+'" is not a valid input for '+o.symbology,o}return o(e,t),e}(Error),u=function(t){function e(){r(this,e);var t=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.name="InvalidElementException",t.message="Not supported type to render on",t}return o(e,t),e}(Error),s=function(t){function e(){r(this,e);var t=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.name="NoElementException",t.message="No element to render on.",t}return o(e,t),e}(Error);e.InvalidInputException=a,e.InvalidElementException=u,e.NoElementException=s},function(t,e,n){"use strict";function r(t){var e=["width","height","textMargin","fontSize","margin","marginTop","marginBottom","marginLeft","marginRight"];for(var n in e)e.hasOwnProperty(n)&&(n=e[n],"string"==typeof t[n]&&(t[n]=parseInt(t[n],10)));return"string"==typeof t.displayValue&&(t.displayValue="false"!=t.displayValue),t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={width:2,height:100,format:"auto",displayValue:!0,fontOptions:"",font:"monospace",text:void 0,textAlign:"center",textPosition:"bottom",textMargin:2,fontSize:20,background:"#ffffff",lineColor:"#000000",margin:10,marginTop:void 0,marginBottom:void 0,marginLeft:void 0,marginRight:void 0,valid:function(){}};e.default=r},function(t,e,n){"use strict";function r(t,e){return e.height+(e.displayValue&&t.text.length>0?e.fontSize+e.textMargin:0)+e.marginTop+e.marginBottom}function i(t,e,n){if(n.displayValue&&e<t){if("center"==n.textAlign)return Math.floor((t-e)/2);if("left"==n.textAlign)return 0;if("right"==n.textAlign)return Math.floor(t-e)}return 0}function o(t,e,n){for(var o=0;o<t.length;o++){var a,u=t[o],f=(0,c.default)(e,u.options);a=f.displayValue?s(u.text,f,n):0;var l=u.data.length*f.width;u.width=Math.ceil(Math.max(a,l)),u.height=r(u,f),u.barcodePadding=i(a,l,f)}}function a(t){for(var e=0,n=0;n<t.length;n++)e+=t[n].width;return e}function u(t){for(var e=0,n=0;n<t.length;n++)t[n].height>e&&(e=t[n].height);return e}function s(t,e,n){var r;if(n)r=n;else{if("undefined"==typeof document)return 0;r=document.createElement("canvas").getContext("2d")}return r.font=e.fontOptions+" "+e.fontSize+"px "+e.font,r.measureText(t).width}Object.defineProperty(e,"__esModule",{value:!0}),e.getTotalWidthOfEncodings=e.calculateEncodingAttributes=e.getBarcodePadding=e.getEncodingHeight=e.getMaximumHeightOfEncodings=void 0;var f=n(0),c=function(t){return t&&t.__esModule?t:{default:t}}(f);e.getMaximumHeightOfEncodings=u,e.getEncodingHeight=r,e.getBarcodePadding=i,e.calculateEncodingAttributes=o,e.getTotalWidthOfEncodings=a},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(12);e.default={CODE39:r.CODE39}},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e){r(this,t),this.api=e}return i(t,[{key:"handleCatch",value:function(t){if("InvalidInputException"!==t.name)throw t;if(this.api._options.valid===this.api._defaults.valid)throw t.message;this.api._options.valid(!1),this.api.render=function(){}}},{key:"wrapBarcodeCall",value:function(t){try{var e=t.apply(void 0,arguments);return this.api._options.valid(!0),e}catch(t){return this.handleCatch(t),this.api}}}]),t}();e.default=o},function(t,e,n){"use strict";function r(t){return t.marginTop=t.marginTop||t.margin,t.marginBottom=t.marginBottom||t.margin,t.marginRight=t.marginRight||t.margin,t.marginLeft=t.marginLeft||t.margin,t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t){if("string"==typeof t)return o(t);if(Array.isArray(t)){for(var e=[],n=0;n<t.length;n++)e.push(i(t[n]));return e}if("undefined"!=typeof HTMLCanvasElement&&t instanceof HTMLImageElement)return a(t);if(t&&"svg"===t.nodeName||"undefined"!=typeof SVGElement&&t instanceof SVGElement)return{element:t,options:(0,f.default)(t),renderer:l.default.SVGRenderer};if("undefined"!=typeof HTMLCanvasElement&&t instanceof HTMLCanvasElement)return{element:t,options:(0,f.default)(t),renderer:l.default.CanvasRenderer};if(t&&t.getContext)return{element:t,renderer:l.default.CanvasRenderer};if(t&&"object"===(void 0===t?"undefined":u(t))&&!t.nodeName)return{element:t,renderer:l.default.ObjectRenderer};throw new d.InvalidElementException}function o(t){var e=document.querySelectorAll(t);if(0!==e.length){for(var n=[],r=0;r<e.length;r++)n.push(i(e[r]));return n}}function a(t){var e=document.createElement("canvas");return{element:e,options:(0,f.default)(t),renderer:l.default.CanvasRenderer,afterRender:function(){t.setAttribute("src",e.toDataURL())}}}Object.defineProperty(e,"__esModule",{value:!0});var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s=n(13),f=r(s),c=n(15),l=r(c),d=n(1);e.default=i},function(t,e,n){"use strict";function r(t){function e(t){if(Array.isArray(t))for(var r=0;r<t.length;r++)e(t[r]);else t.text=t.text||"",t.data=t.data||"",n.push(t)}var n=[];return e(t),n}Object.defineProperty(e,"__esModule",{value:!0}),e.default=r},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e,n){t=""+t;var r=new e(t,n);if(!r.valid())throw new _.InvalidInputException(r.constructor.name,t);var i=r.encode();i=(0,d.default)(i);for(var o=0;o<i.length;o++)i[o].options=(0,c.default)(n,i[o].options);return i}function o(){return s.default.CODE128?"CODE128":Object.keys(s.default)[0]}function a(t,e,n){e=(0,d.default)(e);for(var r=0;r<e.length;r++)e[r].options=(0,c.default)(n,e[r].options),(0,p.default)(e[r].options);(0,p.default)(n),new(0,t.renderer)(t.element,e,n).render(),t.afterRender&&t.afterRender()}var u=n(5),s=r(u),f=n(0),c=r(f),l=n(9),d=r(l),h=n(7),p=r(h),g=n(8),v=r(g),y=n(2),m=r(y),b=n(6),w=r(b),_=n(1),x=n(3),O=r(x),E=function(){},C=function(t,e,n){var r=new E;if(void 0===t)throw Error("No element to render on was provided.");return r._renderProperties=(0,v.default)(t),r._encodings=[],r._options=O.default,r._errorHandler=new w.default(r),void 0!==e&&(n=n||{},n.format||(n.format=o()),r.options(n)[n.format](e,n).render()),r};C.getModule=function(t){return s.default[t]};for(var P in s.default)s.default.hasOwnProperty(P)&&function(t,e){E.prototype[e]=E.prototype[e.toUpperCase()]=E.prototype[e.toLowerCase()]=function(n,r){var o=this;return o._errorHandler.wrapBarcodeCall(function(){r.text=void 0===r.text?void 0:""+r.text;var a=(0,c.default)(o._options,r);a=(0,m.default)(a);var u=t[e],s=i(n,u,a);return o._encodings.push(s),o})}}(s.default,P);E.prototype.options=function(t){return this._options=(0,c.default)(this._options,t),this},E.prototype.blank=function(t){var e=new Array(t+1).join("0");return this._encodings.push({data:e}),this},E.prototype.init=function(){if(this._renderProperties){Array.isArray(this._renderProperties)||(this._renderProperties=[this._renderProperties]);var t;for(var e in this._renderProperties){t=this._renderProperties[e];var n=(0,c.default)(this._options,t.options);"auto"==n.format&&(n.format=o()),this._errorHandler.wrapBarcodeCall(function(){var e=n.value,r=s.default[n.format.toUpperCase()],o=i(e,r,n);a(t,o,n)})}}},E.prototype.render=function(){if(!this._renderProperties)throw new _.NoElementException;if(Array.isArray(this._renderProperties))for(var t=0;t<this._renderProperties.length;t++)a(this._renderProperties[t],this._encodings,this._options);else a(this._renderProperties,this._encodings,this._options);return this},E.prototype._defaults=O.default,"undefined"!=typeof window&&(window.JsBarcode=C),"undefined"!=typeof jQuery&&(jQuery.fn.JsBarcode=function(t,e){var n=[];return jQuery(this).each(function(){n.push(this)}),C(n,t,e)}),t.exports=C},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function t(e,n){r(this,t),this.data=e,this.text=n.text||e,this.options=n};e.default=i},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function a(t){return u(f(t))}function u(t){return v[t].toString(2)}function s(t){return g[t]}function f(t){return g.indexOf(t)}function c(t){for(var e=0,n=0;n<t.length;n++)e+=f(t[n]);return e%=43}Object.defineProperty(e,"__esModule",{value:!0}),e.CODE39=void 0;var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),d=n(11),h=function(t){return t&&t.__esModule?t:{default:t}}(d),p=function(t){function e(t,n){return r(this,e),t=t.toUpperCase(),n.mod43&&(t+=s(c(t))),i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,n))}return o(e,t),l(e,[{key:"encode",value:function(){for(var t=a("*"),e=0;e<this.data.length;e++)t+=a(this.data[e])+"0";return t+=a("*"),{data:t,text:this.text}}},{key:"valid",value:function(){return-1!==this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/)}}]),e}(h.default),g=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","-","."," ","$","/","+","%","*"],v=[20957,29783,23639,30485,20951,29813,23669,20855,29789,23645,29975,23831,30533,22295,30149,24005,21623,29981,23837,22301,30023,23879,30545,22343,30161,24017,21959,30065,23921,22385,29015,18263,29141,17879,29045,18293,17783,29021,18269,17477,17489,17681,20753,35770];e.CODE39=p},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t){var e={};for(var n in s.default)s.default.hasOwnProperty(n)&&(t.hasAttribute("jsbarcode-"+n.toLowerCase())&&(e[n]=t.getAttribute("jsbarcode-"+n.toLowerCase())),t.hasAttribute("data-"+n.toLowerCase())&&(e[n]=t.getAttribute("data-"+n.toLowerCase())));return e.value=t.getAttribute("jsbarcode-value")||t.getAttribute("data-value"),e=(0,a.default)(e)}Object.defineProperty(e,"__esModule",{value:!0});var o=n(2),a=r(o),u=n(3),s=r(u);e.default=i},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(0),a=function(t){return t&&t.__esModule?t:{default:t}}(o),u=n(4),s=function(){function t(e,n,i){r(this,t),this.canvas=e,this.encodings=n,this.options=i}return i(t,[{key:"render",value:function(){if(!this.canvas.getContext)throw new Error("The browser does not support canvas.");this.prepareCanvas();for(var t=0;t<this.encodings.length;t++){var e=(0,a.default)(this.options,this.encodings[t].options);this.drawCanvasBarcode(e,this.encodings[t]),this.drawCanvasText(e,this.encodings[t]),this.moveCanvasDrawing(this.encodings[t])}this.restoreCanvas()}},{key:"prepareCanvas",value:function(){var t=this.canvas.getContext("2d");t.save(),(0,u.calculateEncodingAttributes)(this.encodings,this.options,t);var e=(0,u.getTotalWidthOfEncodings)(this.encodings),n=(0,u.getMaximumHeightOfEncodings)(this.encodings);this.canvas.width=e+this.options.marginLeft+this.options.marginRight,this.canvas.height=n,t.clearRect(0,0,this.canvas.width,this.canvas.height),this.options.background&&(t.fillStyle=this.options.background,t.fillRect(0,0,this.canvas.width,this.canvas.height)),t.translate(this.options.marginLeft,0)}},{key:"drawCanvasBarcode",value:function(t,e){var n,r=this.canvas.getContext("2d"),i=e.data;n="top"==t.textPosition?t.marginTop+t.fontSize+t.textMargin:t.marginTop,r.fillStyle=t.lineColor;for(var o=0;o<i.length;o++){var a=o*t.width+e.barcodePadding;"1"===i[o]?r.fillRect(a,n,t.width,t.height):i[o]&&r.fillRect(a,n,t.width,t.height*i[o])}}},{key:"drawCanvasText",value:function(t,e){var n=this.canvas.getContext("2d"),r=t.fontOptions+" "+t.fontSize+"px "+t.font;if(t.displayValue){var i,o;o="top"==t.textPosition?t.marginTop+t.fontSize-t.textMargin:t.height+t.textMargin+t.marginTop+t.fontSize,n.font=r,"left"==t.textAlign||e.barcodePadding>0?(i=0,n.textAlign="left"):"right"==t.textAlign?(i=e.width-1,n.textAlign="right"):(i=e.width/2,n.textAlign="center"),n.fillText(e.text,i,o)}}},{key:"moveCanvasDrawing",value:function(t){this.canvas.getContext("2d").translate(t.width,0)}},{key:"restoreCanvas",value:function(){this.canvas.getContext("2d").restore()}}]),t}();e.default=s},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(14),o=r(i),a=n(17),u=r(a),s=n(16),f=r(s);e.default={CanvasRenderer:o.default,SVGRenderer:u.default,ObjectRenderer:f.default}},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=function(){function t(e,n,i){r(this,t),this.object=e,this.encodings=n,this.options=i}return i(t,[{key:"render",value:function(){this.object.encodings=this.encodings}}]),t}();e.default=o},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(0),a=function(t){return t&&t.__esModule?t:{default:t}}(o),u=n(4),s="http://www.w3.org/2000/svg",f=function(){function t(e,n,i){r(this,t),this.svg=e,this.encodings=n,this.options=i,this.document=i.xmlDocument||document}return i(t,[{key:"render",value:function(){var t=this.options.marginLeft;this.prepareSVG();for(var e=0;e<this.encodings.length;e++){var n=this.encodings[e],r=(0,a.default)(this.options,n.options),i=this.createGroup(t,r.marginTop,this.svg);this.setGroupOptions(i,r),this.drawSvgBarcode(i,r,n),this.drawSVGText(i,r,n),t+=n.width}}},{key:"prepareSVG",value:function(){for(;this.svg.firstChild;)this.svg.removeChild(this.svg.firstChild);(0,u.calculateEncodingAttributes)(this.encodings,this.options);var t=(0,u.getTotalWidthOfEncodings)(this.encodings),e=(0,u.getMaximumHeightOfEncodings)(this.encodings),n=t+this.options.marginLeft+this.options.marginRight;this.setSvgAttributes(n,e),this.options.background&&this.drawRect(0,0,n,e,this.svg).setAttribute("style","fill:"+this.options.background+";")}},{key:"drawSvgBarcode",value:function(t,e,n){var r,i=n.data;r="top"==e.textPosition?e.fontSize+e.textMargin:0;for(var o=0,a=0,u=0;u<i.length;u++)a=u*e.width+n.barcodePadding,"1"===i[u]?o++:o>0&&(this.drawRect(a-e.width*o,r,e.width*o,e.height,t),o=0);o>0&&this.drawRect(a-e.width*(o-1),r,e.width*o,e.height,t)}},{key:"drawSVGText",value:function(t,e,n){var r=this.document.createElementNS(s,"text");if(e.displayValue){var i,o;r.setAttribute("style","font:"+e.fontOptions+" "+e.fontSize+"px "+e.font),o="top"==e.textPosition?e.fontSize-e.textMargin:e.height+e.textMargin+e.fontSize,"left"==e.textAlign||n.barcodePadding>0?(i=0,r.setAttribute("text-anchor","start")):"right"==e.textAlign?(i=n.width-1,r.setAttribute("text-anchor","end")):(i=n.width/2,r.setAttribute("text-anchor","middle")),r.setAttribute("x",i),r.setAttribute("y",o),r.appendChild(this.document.createTextNode(n.text)),t.appendChild(r)}}},{key:"setSvgAttributes",value:function(t,e){var n=this.svg;n.setAttribute("width",t+"px"),n.setAttribute("height",e+"px"),n.setAttribute("x","0px"),n.setAttribute("y","0px"),n.setAttribute("viewBox","0 0 "+t+" "+e),n.setAttribute("xmlns",s),n.setAttribute("version","1.1"),n.setAttribute("style","transform: translate(0,0)")}},{key:"createGroup",value:function(t,e,n){var r=this.document.createElementNS(s,"g");return r.setAttribute("transform","translate("+t+", "+e+")"),n.appendChild(r),r}},{key:"setGroupOptions",value:function(t,e){t.setAttribute("style","fill:"+e.lineColor+";")}},{key:"drawRect",value:function(t,e,n,r,i){var o=this.document.createElementNS(s,"rect");return o.setAttribute("x",t),o.setAttribute("y",e),o.setAttribute("width",n),o.setAttribute("height",r),i.appendChild(o),o}}]),t}();e.default=f}]);</script>
  <div id="div">
    <svg id="svg"></svg>
  </div>

  <script> JsBarcode("#svg", "${label}", {
    format: "code39",
    font: "Tahoma",
    fontSize: 24,
    textAlign:"center",
    margin:0,
    marginTop:5,
    marginRight:25,
    marginLeft:25,
    marginBottom:5,
    height: ${height},
    width: 1.5,
    textMargin: -5,
    fontOptions: "bold"
  });
  </script>
</body>

</html>`;
};

const makeHtml = (fileName, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, content, (err) => {
      if (err) {
        console.log('Error making HTML');

        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const exportPdf = (url, options) => {
  return new Promise((resolve, reject) => {
    wkhtmltopdf(url, options, (err) => {
      if (err) {
        console.log('Error making PDF');

        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const makeBarocdesWKHTML = async (fileList) => {
  const promises = fileList.map(async (plan) => {
    const options = {
      output: `${plan}.pdf`,
      pageHeight: '25mm',
      pageWidth: '50mm',
      marginTop: '0cm',
      marginBottom: '0cm',
      marginLeft: '0cm',
      marginRight: '0cm',
    };
    const pathGeneratedHtml = path.join(__dirname, 'files', `${plan}.html`);
    const url = fileUrl(pathGeneratedHtml);

    try {
      console.log('pathGeneratedHtml', pathGeneratedHtml);
      await makeHtml(pathGeneratedHtml, html(plan));
      console.log('Now making pdf');
      console.log(url, options);

      await exportPdf(url, options);
      fs.unlink(pathGeneratedHtml, (err) => {
        if (err) {
          return console.error(err);
        }
      });
      console.log('pdf created');
      return `${plan}.pdf`;
    } catch (error) {
      console.log(error);
      throw new Error('Barcode generator failed');
    }
  });

  const r = await Promise.all(promises);
  return r;
};
module.exports = makeBarocdesWKHTML;

// makeBarocdesWKHTML(['s123456','s123457','s123454','s123453','s123451'], x=>console.log(x));
