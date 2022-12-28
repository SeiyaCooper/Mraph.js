/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animation/animation.js":
/*!************************************!*\
  !*** ./src/animation/animation.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Action {\n    constructor(events) {\n        const self = this;\n        function start() {\n            if (events.start) events.start();\n            self.isStarted = true;\n        }\n        function end() {\n            if (events.end) events.end();\n            self.isEnded = true;\n        }\n        function update(p) {\n            if (events.update) events.update(p);\n        }\n        \n        const map = new Map()\n        this.events = map;\n        this.isStarted = false;\n        this.isEnded = false;\n        \n        map.set(\"start\", start);\n        map.set(\"update\", update);\n        map.set(\"end\", end);\n    }\n    add(action) {\n        return new Action({\n            start: () => {\n                this.events.get(\"start\")();\n                action.events.get(\"start\")();\n            },\n            update: p => {\n                this.events.get(\"update\")(p);\n                action.events.get(\"update\")(p);\n            },\n            end: () => {\n                this.events.get(\"end\")();\n                action.events.get(\"end\")();\n            }\n        });\n    }\n}\n\n\nconst animation = {\n    frameList: new Map(),\n\n    start() {\n        const start = +new Date();\n        const st = this.startTime; // 开始时间\n        const et = this.endTime; // 结束时间\n        const fl = this.frameList; // 关键帧表\n        \n        //添加重新绘制事件\n        this.add(st / 1000, et / 1000, {\n            update: () => {\n                mraph.background();\n                mraph.draw();\n            }\n        });\n        \n        (function step() {\n            const now = +new Date() - start;\n            let next;\n            if (now > et && fl.size === 0) {\n                cancelAnimationFrame(next);\n            } else if (now > st) {\n                // 遍历执行动画\n                for (let [t, action] of fl) {\n                    if (now > t[0] && t[1] > now) {\n                        // 如果没有执行开始事件就执行\n                        if (!action.isStarted) action.events.get(\"start\")();\n                        action.events.get(\"update\")((now - t[0]) / (t[1] - t[0]));\n                    } else if (now > t[1]) {\n                        action.events.get(\"update\")(1);\n                        action.events.get(\"end\")();\n                        fl.delete(t);\n                    }\n                }\n                next = requestAnimationFrame(step);\n            } else {\n                next = requestAnimationFrame(step);\n            }\n        })();\n    },\n    add(start, end, events) {\n        start *= 1000;\n        end *= 1000;\n        const time = [start, end];\n        const fl = this.frameList; // 关键帧列表\n        const action = new Action(events); // 动作\n\n        // 动态添加\n        if (fl.has(time)) {\n            fl.set(time, action.add(fl.get(time)));\n        } else {\n            fl.set(time, action);\n        }\n        \n        // 更新开始时间和结束时间\n        if (this.startTime !== undefined) {\n            if (start < this.startTime) this.startTime = start;\n        } else {\n            this.startTime = start;\n        }\n        if (this.endTime !== undefined) {\n            if (end > this.endTime) this.endTime = end;\n        } else {\n            this.endTime = end;\n        }\n    }\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (animation);\n\n//# sourceURL=webpack:///./src/animation/animation.js?");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _objects_point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects/point.js */ \"./src/objects/point.js\");\n/* harmony import */ var _objects_segment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects/segment.js */ \"./src/objects/segment.js\");\n/* harmony import */ var _objects_line_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects/line.js */ \"./src/objects/line.js\");\n/* harmony import */ var _objects_circle_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects/circle.js */ \"./src/objects/circle.js\");\n/* harmony import */ var _animation_animation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./animation/animation.js */ \"./src/animation/animation.js\");\n\n\n\n\n\n\nconst mraph = {\n    elements: [],\n\n    //初始化\n    setup(container, config) {\n        const main = document.createElement(\"canvas\");\n        container.appendChild(main);\n\n        if (config) {\n            if (config.width) {\n                main.width = 3 * config.width;\n                main.style.width = config.width + \"px\";\n            }\n            if (config.height) {\n                main.height = 3 * config.height;\n                main.style.height = config.height + \"px\";\n            }\n        }\n        \n        this.canvas = main;\n    },\n    // 绘制全体\n    draw() {\n        const els = this.elements;\n        for (const obj of els) {\n            obj.draw();\n        }\n    },\n    // 设置背景\n    background(color = \"white\") {\n        this.ctx2d.fillStyle = color;\n\n        const w = this.canvas.width;\n        const h = this.canvas.height;\n        this.ctx2d.fillRect(-w/2, -h/2, w, h);\n    },\n    // 从数组获取点\n    getPoint(array) {\n        if (array instanceof _objects_point_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n            return array;\n        } else {\n            return new _objects_point_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](...array, false);\n        }\n    },\n    //从点获取数组\n    getPos(point) {\n        if (point instanceof _objects_point_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]) {\n            return [point.x,\n                point.y];\n        } else {\n            return point;\n        }\n    },\n\n    set canvas(canvas) {\n        this._canvas = canvas;\n\n        const ctx = canvas.getContext(\"2d\");\n        this.ctx2d = ctx;\n        ctx.translate(canvas.width / 2, canvas.height / 2);\n        ctx.scale(1, -1);\n    },\n    get canvas() {\n        return this._canvas;\n    },\n};\nmraph.Point = _objects_point_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\nmraph.Segment = _objects_segment_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\nmraph.Line = _objects_line_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nmraph.Circle = _objects_circle_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"];\nmraph.animation = _animation_animation_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"];\n\nwindow.mraph = mraph;\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/objects/circle.js":
/*!*******************************!*\
  !*** ./src/objects/circle.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ \"./src/objects/graph.js\");\n\n\nclass Circle extends _graph_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(p1, p2, draw) {\n        super(draw);\n        this.size = 5;\n        this.color = \"#F05D11FF\";\n        this.fillColor = \"#F05D1199\";\n        this.point1 = mraph.getPoint(p1);\n        //判断是否使用固定半径初始化\n        if (Object.prototype.toString.call(p2) == \"[object Number]\") {\n            //使用数字\n            const point = new mraph.Point(this.point1.x + p2, this.point1.y);\n            point.visible = false;\n            this.point2 = point;\n        } else {\n            this.point2 = mraph.getPoint(p2);\n        }\n    }\n    draw() {\n        if (!this.visible) return;\n        const ctx = mraph.ctx2d;\n        ctx.beginPath();\n        ctx.strokeStyle = this.color;\n        ctx.fillStyle = this.fillColor;\n        ctx.lineWidth = this.size;\n        ctx.arc(this.point1.x, this.point1.y, this.radius, 0, 2 * Math.PI);\n        ctx.stroke();\n        ctx.fill();\n        return this;\n    }\n    get radius() {\n        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Circle);\n\n//# sourceURL=webpack:///./src/objects/circle.js?");

/***/ }),

/***/ "./src/objects/graph.js":
/*!******************************!*\
  !*** ./src/objects/graph.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n//所有可绘制类的基类 负责初始化工作\nclass Graph {\n    constructor(...args) {\n        this.color = \"black\";\n        this.visible = true;\n        this.fillColor = \"rgba(0,0,0,0)\";\n        \n        //是否加入绘制列表\n        if (args[args.length - 1] !== false) {\n            mraph.elements.push(this);\n        }\n    }\n    resizeTo(scale, start, end) {\n        let initialSize, total; // 初始大小, 变化总量\n        \n        mraph.animation.add(start, end, {\n            start: () => {\n                initialSize = this.size;\n                total = initialSize * scale - initialSize;\n            },\n            update: p => {\n                this.size = initialSize + total * p;\n            }\n        });\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Graph);\n\n//# sourceURL=webpack:///./src/objects/graph.js?");

/***/ }),

/***/ "./src/objects/line.js":
/*!*****************************!*\
  !*** ./src/objects/line.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _segment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./segment.js */ \"./src/objects/segment.js\");\n\n\nclass Line extends _segment_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(...args) {\n        super(...args);\n        this.color = \"#C61C1CFF\";\n    }\n    draw() {\n        if (!this.visible) return;\n        const ctx = mraph.ctx2d;\n        ctx.beginPath();\n        ctx.lineWidth = this.size;\n        ctx.strokeStyle = this.color;\n        \n        const w = mraph.canvas.width; // Canvas 宽\n        const h = mraph.canvas.height; // Canvas 高\n        const p1 = this.point1 // 起始点\n        const p2 = this.point2 // 结束点\n        // 分横坐标是否相等两种情况\n        if (p2.x - p1.x !== 0) {\n            const s = this.slope; // 斜率\n            \n            //计算在屏幕最左和最右的交点并连接\n            ctx.moveTo(-w/2, p1.y + (-w/2 - p1.x) * s);\n            ctx.lineTo(w/2, p2.y + (w/2 - p2.x) * s);\n        } else {\n            ctx.moveTo(p1.x, -h/2);\n            ctx.lineTo(p1.x, h/2);\n        }\n        ctx.stroke();\n        return this;\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Line);\n\n//# sourceURL=webpack:///./src/objects/line.js?");

/***/ }),

/***/ "./src/objects/point.js":
/*!******************************!*\
  !*** ./src/objects/point.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ \"./src/objects/graph.js\");\n\n\n/**\n * 点\n * @class\n */\nclass Point extends _graph_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor(x, y, draw) {\n        super(draw);\n        this.size = 10;\n        this.x = x;\n        this.y = y;\n    }\n    draw() {\n        if(!this.visible) return;\n        const ctx = mraph.ctx2d;\n        \n        ctx.beginPath();\n        ctx.lineWidth = 2 * this.size;\n        ctx.fillStyle = this.color;\n        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);\n        ctx.fill();\n        \n        return this;\n    }\n    moveTo(pos, start, end) {\n        let startX, startY; // 初始坐标\n        let xDis, yDis; // 距离\n        const self = this;\n        \n        mraph.animation.add(start, end, {\n            start: () => {\n                pos = mraph.getPos(pos); // 目标位置\n                startX = self.x;\n                startY = self.y;\n                xDis = pos[0] - startX;\n                yDis = pos[1] - startY;\n            },\n            update: p => {\n                self.x = startX + xDis * p;\n                self.y = startY + yDis * p;\n            }\n        });\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Point);\n\n//# sourceURL=webpack:///./src/objects/point.js?");

/***/ }),

/***/ "./src/objects/segment.js":
/*!********************************!*\
  !*** ./src/objects/segment.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./graph.js */ \"./src/objects/graph.js\");\n\n\n/**\n * 线段\n * @class\n */\nclass Segment extends _graph_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    /**\n     * 构造一条新线段\n     * @constructor\n     * @param {Point} p1 线段的起始点\n     * @param {Point} p2 线段的结束点\n     * @return {Segment}\n     */\n    constructor(p1, p2, draw) {\n        super(draw);\n        this.size = 5;\n        this.point1 = mraph.getPoint(p1);\n        this.point2 = mraph.getPoint(p2);\n    }\n    /**\n     * 绘制线端\n     */\n    draw() {\n        if (!this.visible) return;\n        const ctx = mraph.ctx2d;\n\n        ctx.beginPath();\n        ctx.lineWidth = this.size;\n        ctx.strokeStyle = this.color;\n        ctx.moveTo(this.point1.x, this.point1.y);\n        ctx.lineTo(this.point2.x, this.point2.y);\n        ctx.stroke();\n\n        return this;\n    }\n    /**\n     * 线段长度\n     */\n    get length() {\n        return Math.hypot(this.point2.x - this.point1.x, this.point2.y - this.point1.y);\n    }\n    /**\n     * 线段斜率\n     */\n    get slope() {\n        return (this.point2.y - this.point1.y) / (this.point2.x - this.point1.x);\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Segment);\n\n//# sourceURL=webpack:///./src/objects/segment.js?");

/***/ })

/******/ 	});
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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;