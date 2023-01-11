import Mraph from "../app.js";

class Action {
    constructor(events) {
        const self = this;
        function start() {
            if (events.start) events.start();
            self.isStarted = true;
        }
        function end() {
            if (events.end) events.end();
            self.isEnded = true;
        }
        function update(p) {
            if (events.update) events.update(p);
        }
        
        const map = new Map()
        this.events = map;
        this.isStarted = false;
        this.isEnded = false;
        
        map.set("start", start);
        map.set("update", update);
        map.set("end", end);
    }
    add(action) {
        return new Action({
            start: () => {
                this.events.get("start")();
                action.events.get("start")();
            },
            update: p => {
                this.events.get("update")(p);
                action.events.get("update")(p);
            },
            end: () => {
                this.events.get("end")();
                action.events.get("end")();
            }
        });
    }
}

const animation = {
    keyFrameList: new Map(),
    isFrameRateLocked: false,
    elapsedFrames: 0, // 已经经过的帧数
    onStart: () => {}, // 开始事件
    onEnd: () => {}, // 结束事件
    onUpdate: () => {}, // 更新事件
    

    start(layer) {
        const st = this.startTime; // 开始运行动画的时刻
        const et = this.endTime; // 结束的时刻
        const fl = this.keyFrameList; // 关键帧表
        const self = this;
        let start; // 开始的时刻
        
        if (this.isFrameRateLocked) {
            start = 0;
        } else {
            start = +new Date();
        }
        
        // 添加重新绘制事件与开始结束事件
        this.add(st / 1000, et / 1000, {
            start: () => {
                this.onStart();
            },
            update: () => {
                layer.background();
                layer.draw();
                this.onUpdate();
            },
            end: () => {
                this.onEnd();
            }
        });
        
        (function step() {
            let nextStep, now; // 下一关键帧 当前时间
            
            if (self.isFrameRateLocked) {
                now = self.elapsedFrames * 1000 / self.frameRate;
                self.elapsedFrames++;
            } else {
                now = +new Date() - start;
            }
            
            // 动画部分
            if (now > et && fl.size === 0) {
                cancelAnimationFrame(nextStep);
            } else if (now > st) {
                // 遍历执行动画
                for (let [t, action] of fl) runAnimate(t, action, now);
                nextStep = requestAnimationFrame(step);
            } else {
                nextStep = requestAnimationFrame(step);
            }
        })();
        
        function runAnimate(t, action, now) {
            if (now > t[0] && t[1] > now) {
                // 如果没有执行开始事件就执行
                if (!action.isStarted) {
                    action.events.get("start")();
                    action.events.get("update")(0);
                } else {
                    action.events.get("update")((now - t[0]) / (t[1] - t[0]));
                }
            } else if (now > t[1]) {
                action.events.get("update")(1);
                action.events.get("end")();
                fl.delete(t);
            }
        }
    },
    add(start, end, events) {
        start *= 1000;
        end *= 1000;
        const time = [start, end];
        const fl = this.keyFrameList; // 关键帧列表
        const action = new Action(events); // 动作

        // 动态添加
        if (fl.has(time)) {
            fl.set(time, action.add(fl.get(time)));
        } else {
            fl.set(time, action);
        }
        
        // 更新开始时间和结束时间
        if (this.startTime !== undefined) {
            if (start < this.startTime) this.startTime = start;
        } else {
            this.startTime = start;
        }
        if (this.endTime !== undefined) {
            if (end > this.endTime) this.endTime = end;
        } else {
            this.endTime = end;
        }
    },
    
    // 淡入动画曲线
    /**
     * @param {Number} now 当前时间点
     * @param {Number} start 开始的时间点
     * @param {Number} end 结束的时间点
     * @return {Number} 经过换算的时间点
     */
    easeIn(n, s, e) {
        return ((n - s) ** 2) / (e - s) + s;
    },
    // 淡出动画曲线
    easeOut(n, s, e) {
        return ((e - n) ** 2) / (s - e) + e;
    },
    // 淡入淡出动画曲线
    easeInOut(n, s, e) {
        const half = (e + s) / 2; // 时间段中点
        if (n >= half) {
            return this.easeOut(n, half, e);
        } else {
            return this.easeIn(n, s, half);
        }
    },
    
    //设置帧率
    set frameRate(value) {
        this._frameRate = value;
        this.isFrameRateLocked = true;
    },
    get frameRate() {
        return +this._frameRate;
    }
};

Mraph.animation = animation;
export default animation;