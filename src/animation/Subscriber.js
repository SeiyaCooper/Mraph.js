export default class Subscriber {
    static watch(target, handler, { maxDepth = 3, whiteList = [] } = {}) {
        if (maxDepth < 1) return;

        const watchList = new Set();
        whiteList.forEach((prop) => {
            watchList.add(prop);
        });

        const set = (obj, key, val) => {
            obj[key] = val;
            if (typeof target[key] === "object")
                target[key] = Subscriber.watch(target[key], handler, {
                    maxDepth: maxDepth - 1,
                    whiteList: target[key].watchList ?? [],
                });
            if (watchList.has(key) || watchList.size === 0)
                handler.set?.(obj, key, val);
            return true;
        };

        const get = (obj, key) => {
            handler.get?.(obj, key);
            return obj[key];
        };

        for (let key of Object.keys(target)) {
            if (watchList.has(key) && typeof target[key] === "object")
                target[key] = Subscriber.watch(target[key], handler, {
                    maxDepth: maxDepth - 1,
                    whiteList: target[key].watchList ?? [],
                });
        }

        return new Proxy(target, { set, get });
    }
}
