import * as COLORS from "../constants/colors.js";
import ImageMobject from "./ImageMobject.js";

export default class CanvasText extends ImageMobject {
    canvas = document.createElement("canvas");

    canvasContext = this.canvas.getContext("2d");

    _text = "";

    fillColor = COLORS.WHITE;

    strokeColor = COLORS.BLACK;

    textFont = "helvetica";

    textSize = 60;

    /**
     * Creates a canvas text.
     * @param {string} text
     */
    constructor(text) {
        super();
        this.text = text;
    }

    /**
     * Updates this mobject. Will be called automatically.
     */
    update() {
        this.drawText2Canvas();
        super.update();
    }

    /**
     * Draws this text to inner canvas so it can be rendered to layer.
     * Will be called automatically.
     */
    drawText2Canvas() {
        const text = this.text;
        const canvas = this.canvas;
        const ctx = this.canvasContext;

        ctx.font = `${this.textSize}px ${this.textFont}`;
        const textParams = ctx.measureText(text);
        const width = textParams.width;
        const height = Math.abs(textParams.fontBoundingBoxAscent) + Math.abs(textParams.fontBoundingBoxDescent);

        canvas.width = width;
        canvas.height = height;
        this.width = width / 150;
        this.height = height / 150;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${this.textSize}px ${this.textFont}`;
        ctx.fillStyle = this.fillColor.toIntRGBAStr();
        ctx.strokeStyle = this.strokeColor.toIntRGBAStr();

        ctx.fillText(text, width / 2, height / 2);
    }

    set text(text) {
        this._text = text;
        this.image = this.canvas;
    }

    get text() {
        return this._text;
    }
}
