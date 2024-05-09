export default class MraphError {
    static error(msg) {
        console.error(`Mraph Error: ${msg}`);
    }

    static warn(msg) {
        console.warn(`Mraph Warning: ${msg}`);
    }
}
