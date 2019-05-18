export default class FrameTimer {
	constructor(options) {
		this.isRunning = true;

		this._onGenerateFrame = options.onGenerateFrame;
		this._onWriteFrame = options.onWriteFrame;
	}

	start() {
		this.isRunning = true;
	}

	stop() {
		this.isRunning = false;
	}

	generateFrame() {
		this._onGenerateFrame();
		this._onWriteFrame();
	}
}
