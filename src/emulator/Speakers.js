import RingBuffer from "ringbufferjs";

const BUFFER_SIZE = 8192;
const DEFAULT_SAMPLE_RATE = 44100;

export default class Speakers {
	constructor(options) {
		this.onBufferUnderrun = options.onBufferUnderrun;
		this.bufferSize = BUFFER_SIZE;
		this.buffer = new RingBuffer(this.bufferSize * 2);

		this.writeSample = this.writeSample.bind(this);
		this._onAudioProcess = this._onAudioProcess.bind(this);
	}

	start() {
		if (!window.AudioContext) return; // (audio is not supported)

		this.audioCtx = new window.AudioContext();
		this.scriptNode = this.audioCtx.createScriptProcessor(1024, 0, 2);
		this.scriptNode.onaudioprocess = this._onAudioProcess;
		this.scriptNode.connect(this.audioCtx.destination);
	}

	stop() {
		if (this.scriptNode) {
			this.scriptNode.disconnect(this.audioCtx.destination);
			this.scriptNode.onaudioprocess = null;
			this.scriptNode = null;
		}

		if (this.audioCtx) {
			this.audioCtx.close().catch((e) => {
				console.error("ERROR", e);
			});
			this.audioCtx = null;
		}
	}

	getSampleRate() {
		if (!window.AudioContext) return DEFAULT_SAMPLE_RATE;

		const context = new window.AudioContext();
		const sampleRate = context.sampleRate;
		context.close();

		return sampleRate;
	}

	writeSample(left, right) {
		if (this.buffer.size() / 2 >= this.bufferSize) {
			// Buffer overrun
			this.buffer.deqN(this.bufferSize / 2);
		}

		this.buffer.enq(left);
		this.buffer.enq(right);
	}

	_onAudioProcess(event) {
		const left = event.outputBuffer.getChannelData(0);
		const right = event.outputBuffer.getChannelData(1);
		const size = left.length;

		// We're going to buffer underrun. Attempt to fill the buffer.
		if (this.buffer.size() < size * 2 && this.onBufferUnderrun) {
			this.onBufferUnderrun(this.buffer.size(), size * 2);
		}

		let samples;
		try {
			samples = this.buffer.deqN(size * 2);
		} catch (e) {
			// onBufferUnderrun failed to fill the buffer, so handle a real buffer underrun

			// ignore empty buffers... assume audio has just stopped
			const bufferSize = this.buffer.size() / 2;
			if (bufferSize > 0); // buffer underrun, needed {size}, got {bufferSize}
			for (let i = 0; i < size; i++) {
				left[i] = 0;
				right[i] = 0;
			}

			return;
		}

		for (let i = 0; i < size; i++) {
			left[i] = samples[i * 2];
			right[i] = samples[i * 2 + 1];
		}
	}
}
