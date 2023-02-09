import Action from "./action.js";
import { copy } from "../utils/utils.js";

const animation = {
    actionList: new Map(),
    minTime: Infinity,
    maxTime: 0,
    
    add: (start, stop, event) => {
        const action = new Action();
        const list = animation.actionList;
        const index = [start * 1000, stop * 1000];
        copy(action, event);
        
        if (list.has(index)) {
            list.set(index, action.merge(list.get(index)));
        } else {
            list.set(index, action);
        }
        
        animation.minTime = Math.min(animation.minTime, start * 1000);
        animation.maxTime = Math.max(animation.maxTime, stop * 1000);
    },
    start: () => {
        const st = +new Date();
        let timer;
        
        (function animate() {
            const now = +new Date() - st;
            const list = animation.actionList;
            
            if (now < animation.minTime) {
                timer = requestAnimationFrame(animate);
                return;
            } else if (now > animation.maxTime) {
                cancelAnimationFrame(timer);
                return;
            }
            
            for (const [index, action] of list) {
                action.run(...index, now);
                if (action.isStopped) list.delete(index);
            }
            
            timer = requestAnimationFrame(animate);
        })();
    }
};

export default animation;