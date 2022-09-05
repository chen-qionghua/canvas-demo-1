// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
var canvas = document.getElementById("canvas");
var thin = document.getElementById("thin");
var thick = document.getElementById("thick");
var black = document.getElementById("black");
var red = document.getElementById("red");
var yellow = document.getElementById("yellow");
var blue = document.getElementById("blue");
var eraser = document.getElementById("eraser");
var pen = document.getElementById("pen");
var clear = document.getElementById("clear");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.strokeStyle = "none";
ctx.lineWidth = 8;
ctx.lineCap = "round"; //线条转折处为圆，而不是直角锯齿状

var painting = false; //控制画画触发时机，是否按下

var eraserEnabled = false; //控制橡皮擦触发时机，是否擦除

var lastPoint = [undefined, undefined];
monitor();

function monitor() {
  thin.onclick = function () {
    lineWidth = 5;
    thin.classList.add('active');
    thick.classList.remove('active');
  };

  thick.onclick = function () {
    lineWidth = 8;
    thick.classList.add('active');
    thin.classList.remove('active');
  };

  black.onclick = function () {
    black.classList.add("active");
    red.classList.remove("active");
    yellow.classList.remove("active");
    blue.classList.remove("active");
    ctx.strokeStyle = "black";
  };

  red.onclick = function () {
    red.classList.add("active");
    black.classList.remove("active");
    yellow.classList.remove("active");
    blue.classList.remove("active");
    ctx.strokeStyle = "red";
  };

  yellow.onclick = function () {
    yellow.classList.add("active");
    black.classList.remove("active");
    red.classList.remove("active");
    blue.classList.remove("active");
    ctx.strokeStyle = "yellow";
  };

  blue.onclick = function () {
    blue.classList.add("active");
    black.classList.remove("active");
    red.classList.remove("active");
    yellow.classList.remove("active");
    ctx.strokeStyle = "blue";
  };

  eraser.onclick = function () {
    eraserEnabled = true;
    painting = false; //需要同时将painting 置为false，否则会画笔和橡皮擦会同时开启

    eraser.classList.add('active');
    pen.classList.remove('active');
  };

  pen.onclick = function () {
    eraserEnabled = false; // painting = true//不能开启，否则鼠标没有按下就开始画画

    pen.classList.add("active");
    eraser.classList.remove("active");
  };

  clear.onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  download.onclick = function () {
    var a = document.createElement('a');
    a.download = '我的涂鸦.png';
    var url = canvas.toDataURL();
    a.href = url;
    a.click();
  }; // 兼容手机


  var isTouchDevice = ("ontouchstart" in document.documentElement); //唯一检测是否为移动端的方法

  if (isTouchDevice) {
    canvas.ontouchstart = function (e) {
      //开始触摸
      painting = true;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      lastPoint = [x, y]; //记下第一次鼠标点击的位置，以作为画线的终点的参考点
    };

    canvas.ontouchmove = function (e) {
      //手指移动
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;

      if (painting) {
        drawLine(lastPoint[0], lastPoint[1], x, y);
        lastPoint = [x, y]; //需要实时更新画线的 起点，记录每次点击位置

        if (eraserEnabled) {
          ctx.clearRect(x - 10, y - 10, 30, 30);
        }
      }
    };

    canvas.ontouchend = function () {
      //结束触摸
      painting = false;
    };
  } else {
    //PC端
    canvas.onmousedown = function (e) {
      //鼠标按下
      painting = true;
      lastPoint = [e.clientX, e.clientY];
    };

    canvas.onmousemove = function (e) {
      //鼠标移动
      var x = e.clientX;
      var y = e.clientY;

      if (painting) {
        drawLine(lastPoint[0], lastPoint[1], x, y);
        lastPoint = [x, y];

        if (eraserEnabled) {
          ctx.clearRect(x - 10, y - 10, 30, 30);
        }
      }
    };

    canvas.onmouseup = function () {
      //鼠标抬起
      painting = false;
    };
  }
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); //起点

  ctx.lineTo(x2, y2); //终点

  ctx.stroke(); //描边
} //清除笔迹
//更换画笔颜色
//重置画板
},{}],"C:/Users/50008324/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61145" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/50008324/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map