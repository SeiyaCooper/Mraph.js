const findSlot = /!slot::([0-9a-zA-Z-_]+)/g;

export function replace(origin, name, value) {
    return origin.replace(findSlot, (match, key) => {
        if (key === name) {
            return value;
        } else {
            return match;
        }
    });
}
