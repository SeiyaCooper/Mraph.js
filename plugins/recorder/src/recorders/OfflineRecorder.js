import MraphError from "../../../../src/utils/MraphError.js";
import JSZip from "jszip";

export default class OfflineRecoder {
    /**
     * The video recorded, undefined by default.
     */
    video = undefined;

    /**
     * An array of every frames caputured.
     * @type {Blob[]}
     */
    frames = [];

    /**
     * The number of frames captured or capturing.
     */
    framesNum = [];

    /**
     * A simple recorder helps you to recorde videos of an offline scene and download it.
     */
    constructor(target, { pictureMimeType = "image/webp", pictureQuality = 1 } = {}) {
        this.target = target;
        this.pictureMimeType = pictureMimeType;
        this.pictureQuality = pictureQuality;
    }

    next(callback = () => {}) {
        const index = this.frames.length;
        this.framesNum = index + 1;
        this.target.toBlob(
            (blob) => {
                if (blob === null) MraphError.error("Failed while creating a Blob object of target canvas element");
                this.frames[index] = blob;
                callback();
            },
            this.pictureMimeType,
            this.pictureQuality
        );
    }

    async zip() {
        const zipper = new JSZip();

        let timer = setInterval(() => {
            if (this.framesNum === this.frames.length) clearInterval(timer);
        }, 100);

        this.frames.forEach((frame, index) => {
            zipper.file(`frame[${index}]${OfflineRecoder.mime2Ext(this.pictureMimeType)}`, frame);
        });

        const zipped = await zipper.generateAsync({ type: "blob" });

        return zipped;
    }

    static mime2Ext(mimeType) {
        switch (mimeType) {
            case "image/jpeg":
                return ".jpeg";
            case "image/png":
                return ".png";
            case "image/webp":
                return ".webp";
        }
    }
}
