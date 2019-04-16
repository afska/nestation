const FPS = 60.098;

export default class FrameTimer {
	constructor(options) {
		this.isRunning = true;

		// Run at 60 FPS
		this._onGenerateFrame = options.onGenerateFrame;
		// Run on animation frame
		this._onWriteFrame = options.onWriteFrame;

		this._interval = 1e3 / FPS;
		this._lastFrameTime = null;

		this._onAnimationFrame = this._onAnimationFrame.bind(this);
	}

	start() {
		this.isRunning = true;
		this._requestAnimationFrame();
	}

	stop() {
		this.isRunning = false;
		if (this._requestID) window.cancelAnimationFrame(this._requestID);
		this._lastFrameTime = null;
	}

	generateFrame() {
		this._onGenerateFrame();
		this._lastFrameTime += this._interval;
	}

	_requestAnimationFrame() {
		this._requestID = window.requestAnimationFrame(this._onAnimationFrame);
	}

	_onAnimationFrame(time) {
		this._requestAnimationFrame();
		// how many ms after 60fps frame time
		const excess = time % this._interval;

		// newFrameTime is the current time aligned to 60fps intervals.
		// i.e. 16.6, 33.3, etc ...
		const newFrameTime = time - excess;

		// first frame, do nothing
		if (this._lastFrameTime == null) {
			this._lastFrameTime = newFrameTime;
			return;
		}

		const numFrames = Math.round(
			(newFrameTime - this._lastFrameTime) / this._interval
		);

		// This can happen a lot on a 144Hz display
		if (numFrames === 0) return;

		// update display on first frame only
		this.generateFrame();
		this._onWriteFrame();

		// we generate additional frames evenly before the next
		// onAnimationFrame call.
		// additional frames are generated but not displayed
		// until next frame draw
		const timeToNextFrame = this._interval - excess;
		for (let i = 1; i < numFrames; i++) {
			setTimeout(() => {
				this.generateFrame();
			}, (i * timeToNextFrame) / numFrames);
		}
	}
}
