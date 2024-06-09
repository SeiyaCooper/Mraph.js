import MraphError from "../utils/MraphError.js";

export default class Recorder {
    /**
     * Data of video recorded, undefined by default.
     */
    data = undefined;

    /**
     * Callback function, will be called if data is available.
     */
    onAvailable = () => {};

    /**
     * A simple recorder helps you to recorde videos
     * @param {HTMLCanvasElement} target
     * @param {object} options An object used to define following parameters, optional
     * * mimeType {string} sets mime type of video recorded, optional.
     * * fps {number} sets fps of video recorded, optional.
     * * audioBitsPerSecond {number} The chosen bitrate for the audio component of the media, optional.
     * * videoBitsPerSecond {number} The chosen bitrate for the video component of the media, optional.
     * * bitsPerSecond {number} The chosen bitrate for the audio and video components of the media.
     *                          This can be specified instead of the above two properties.
     *                          If this is specified along with one or the other of the above properties, this will be used for the one that isn't specified.
     */
    constructor(target, { mimeType = "video/webm", fps, audioBitsPerSecond, videoBitsPerSecond, bitsPerSecond } = {}) {
        this.target = target;
        this.recorder = new MediaRecorder(target.captureStream(fps), {
            mimeType,
            audioBitsPerSecond,
            videoBitsPerSecond,
            bitsPerSecond,
        });
        this.recorder.ondataavailable = (e) => {
            this.data = e.data;
            this.onAvailable(this.data);
        };
    }

    /**
     * Start recording
     * @returns {this}
     */
    start() {
        const recorder = this.recorder;

        if (recorder.state === "inactive") {
            recorder.start();
        }

        if (recorder.state === "paused") {
            recorder.resume();
        }

        return this;
    }

    /**
     * Pause recording
     * @returns {this}
     */
    pause() {
        this.recorder.pause();
        return this;
    }

    /**
     * Stop recording
     * @returns {this}
     */
    stop() {
        this.recorder.stop();
        return this;
    }

    /**
     * Download a video if data is available
     * @param {string} name
     * @returns {this}
     */
    download(name = "video") {
        if (!this.data) {
            MraphError.error("Data is still not available, try calling this function in Recorder.onAvailable()");
            return this;
        }

        const a = document.createElement("a");
        const url = URL.createObjectURL(this.data);
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
        return this;
    }
}
