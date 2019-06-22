import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import Speakers from "./Speakers";
import { Controller, LocalController } from "./controllers";
import jsnes, { NES } from "jsnes";

class Emulator extends Component {
	constructor(props) {
		super(props);

		const getNes = () => this.nes;
		this.localController = new LocalController(1, getNes);
		this.remoteController = new Controller(2, getNes);
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
		this.localController.attach();
	}

	componentWillUpdate(nextProps) {
		this.stop();
	}

	start() {
		this.speakers.start();
	}

	stop() {
		this.speakers.stop();
	}

	frame() {
		this.nes.frame();
		this.screen.writeBuffer();
	}

	componentWillUnmount() {
		this.stop();
		this.localController.detach();
	}

	_initialize(screen) {
		const { rom } = this.props;
		const bytes = Buffer.from(rom);

		this.speakers = new Speakers({
			onAudio: (actualSize, desiredSize) => {
				const frames = this.speakers.buffer.size() < desiredSize ? 2 : 1;

				const { syncer } = this.props;
				if (syncer) return syncer.sync(frames);

				// Timing is done by audio instead of `requestAnimationFrame`.
				this.frame();

				// `desiredSize` will be 2048, and the NES produces 1468 samples on each
				// frame so we might need a second frame to be run. Give up after that
				// though -- the system is not catching up
				if (frames > 1) this.frame();
			}
		});

		this.screen = screen;

		this.nes = new NES({
			onFrame: this.screen.setBuffer,
			onAudioSample: this.speakers.writeSample,
			sampleRate: this.speakers.getSampleRate()
		});

		// Load ROM data as a string and start
		this.nes.loadROM(bytes.toString("binary"));

		// DEBUG
		window.emulator = this;
		window.jsnes = jsnes;
	}
}

export default Emulator;
