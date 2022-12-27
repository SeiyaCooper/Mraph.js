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
    frameList: new Map(),

    start() {
        const start = +new Date();
        const st = this.startTime; // 开始时间
        const et = this.endTime; // 结束时间
        const fl = this.frameList; // 关键帧表
        
        //添加重新绘制事件
        this.add(st / 1000, et / 1000, {
            update: () => {
                mraph.background();
                mraph.draw();
            }
        });
        
        (function step() {
            const now = +new Date() - start;
            let next;
            if (now > et && fl.size === 0) {
                cancelAnimationFrame(next);
            } else if (now > st) {
                // 遍历执行动画
                for (let [t, action] of fl) {
                    if (now > t[0] && t[1] > now) {
                        // 如果没有执行开始事件就执行
                        if (!action.isStarted) action.events.get("start")();
                        action.events.get("update")((now - t[0]) / (t[1] - t[0]));
                    } else if (now > t[1]) {
                        action.events.get("update")(1);
                        action.events.get("end")();
                        fl.delete(t);
                    }
                }
                next = requestAnimationFrame(step);
            } else {
                next = requestAnimationFrame(step);
            }
        })();
    },
    add(start, end, events) {
        start *= 1000;
        end *= 1000;
        const time = [start, end];
        const fl = this.frameList; // 关键帧列表
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
    }
};

export default animation;