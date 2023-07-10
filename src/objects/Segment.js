export default class Segment {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    get path() {
        return [
            ["begin"],
            ["move", this.start.pos],
            ["line", this.end.pos],
            ["close"],
            ["stroke"],
        ];
    }
}
