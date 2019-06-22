import React, { Component } from "react";
import { Buffer } from "buffer";
import FrameTimer from "./FrameTimer";
import Screen from "./Screen";
import Speakers from "./Speakers";
import Controller from "./Controller";
import jsnes, { NES } from "jsnes";

class Emulator extends Component {
	constructor(props) {
		super(props);

		this.controller = new Controller(1, {
			onButtonDown: (button) => this.controller.sync(this.nes, button, true),
			onButtonUp: (button) => this.controller.sync(this.nes, button, false)
		});
	}

	render() {
		return (
			<Screen
				ref={(screen) => {
					if (screen) this._initialize(screen);
				}}
			/>
		);
	}

	componentDidMount() {
		this.controller.attach();
	}

	componentWillUpdate(nextProps) {
		this.stop();
	}

	start() {
		this.frameTimer.start();
		this.speakers.start();
	}

	stop() {
		this.frameTimer.stop();
		this.speakers.stop();
	}

	componentWillUnmount() {
		this.stop();
		this.controller.detach();
	}

	_initialize(screen) {
		const { rom } = this.props;
		const bytes = Buffer.from(rom);

		this.speakers = new Speakers({
			onAudio: (actualSize, desiredSize) => {
				// Timing is done by audio instead of `requestAnimationFrame`.
				this.frameTimer.generateFrame();

				// `desiredSize` will be 2048, and the NES produces 1468 samples on each
				// frame so we might need a second frame to be run. Give up after that
				// though -- the system is not catching up
				if (this.speakers.buffer.size() < desiredSize)
					this.frameTimer.generateFrame();
			}
		});

		this.nes = new NES({
			onFrame: screen.setBuffer,
			onAudioSample: this.speakers.writeSample,
			sampleRate: this.speakers.getSampleRate()
		});

		this.frameTimer = new FrameTimer({
			onGenerateFrame: this.nes.frame,
			onWriteFrame: screen.writeBuffer
		});

		// Load ROM data as a string and start
		this.nes.loadROM(bytes.toString("binary"));

		// DEBUG
		window.emulator = this;
		window.jsnes = jsnes;
	}
}

export default Emulator;
