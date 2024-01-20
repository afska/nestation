import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import FrameTimer from "./FrameTimer";
import Speaker from "./Speaker";
import { Controller, LocalController } from "./controllers";
import strings from "../locales";
import jsnes, { NES } from "jsnes";
import config from "../config";

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

	UNSAFE_componentWillUpdate(nextProps) {
		this.stop();
	}

	start() {
		this.speaker = new Speaker(config.sound.gain);
		this.speaker.start();

		this.frameTimer.start();
	}

	stop() {
		this.frameTimer.stop();
		if (this.speaker != null) {
			this.speaker.stop();
			this.speaker = null;
		}
	}

	frame() {
		try {
			this.nes.frame();
			this.screen.writeBuffer();
		} catch (e) {
			console.error(e);
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

		this.nes = new NES({
			onFrame: this.screen.setBuffer,
			onAudioSample: (s) => this.speaker.writeSample(s),
			sampleRate: 44100
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
