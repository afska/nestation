import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import FrameTimer from "./FrameTimer";
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
		this.frameTimer.start();
		this.speakers.start();
	}

	stop() {
		this.frameTimer.stop();
		this.speakers.stop();
	}

	frame() {
		this.nes.frame();
		this.screen.writeBuffer();

		// TODO: FIX RANDOMNESS
		console.log(
			window.emulator.fpsFrameCount,
			this.localController.toByte(),
			this.remoteController.toByte()
		);
	}

	componentWillUnmount() {
		this.stop();
		this.localController.detach();
	}

	_initialize(screen) {
		const { rom } = this.props;
		const bytes = Buffer.from(rom).toString("binary");

		this.screen = screen;

		this.speakers = new Speakers();

		this.nes = new NES({
			onFrame: this.screen.setBuffer,
			onAudioSample: this.speakers.writeSample,
			sampleRate: this.speakers.getSampleRate()
		});

		this.frameTimer = new FrameTimer(() => {
			const { syncer } = this.props;

			if (syncer) syncer.sync();
			else this.frame();
		});

		// Load ROM data as a string and start
		this.nes.loadROM(bytes);

		// DEBUG
		window.emulator = this;
		window.jsnes = jsnes;
	}
}

export default Emulator;
