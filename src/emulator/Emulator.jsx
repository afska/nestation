import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import FrameTimer from "./FrameTimer";
import Speakers from "./Speakers";
import { Controller, LocalController } from "./controllers";
import strings from "../locales";
import jsnes, { NES } from "jsnes";

export default class Emulator extends Component {
	constructor(props) {
		super(props);

		const getNes = () => this.nes;
		this.localController = new LocalController(1, getNes, props.onStartPressed);
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
		try {
			this.nes.frame();
			this.screen.writeBuffer();
		} catch (e) {
			this.props.onError(strings.errors.invalidRom, false);
		}
	}

	componentWillUnmount() {
		this.stop();
		this.localController.detach();
	}

	_initialize(screen) {
		const { rom, onError } = this.props;
		if (!rom) return;
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
		try {
			this.nes.loadROM(bytes);
		} catch (e) {
			onError(strings.errors.invalidRom, false);
		}

		// DEBUG
		window.emulator = this;
		window.jsnes = jsnes;
	}
}
