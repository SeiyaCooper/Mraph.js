import MraphError from "../utils/MraphError.js";

export default class OfflineRecoder {
    /**
     * The video recorded, undefined by default.
     */
    video = undefined;

    frames = [];

    /**
     * A simple recorder helps you to recorde videos of an offline scene and download it.
     */
    constructor(target, { pictureMimeType = "image/webp", pictureQuality = 1 }) {
        this.target = target;
        this.pictureMimeType = pictureMimeType;
        this.pictureQuality = pictureQuality;
    }

    next() {
        const index = this.frames.length;
        this.target.toBlob((blob) => {
            if (blob === null) MraphError.error("Failed while creating a Blob object of target canvas element");
            this.pic[index] = blob;
        });
    }
}
