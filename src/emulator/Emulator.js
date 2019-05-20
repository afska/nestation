import React, { Component } from "react";
import { Buffer } from "buffer";
import jsnes, { NES } from "jsnes";
import FrameTimer from "./FrameTimer";
import Screen from "./Screen";
import Speakers from "./Speakers";

class Emulator extends Component {
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
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
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
		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
	}

	_initialize(screen) {
		const { rom } = this.props;
		const bytes = Buffer.from(rom);

		this.speakers = new Speakers({
			onAudio: (actualSize, desiredSize) => {
				if (this.props.paused) return;

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
		window.jsnes = jsnes;
		window.nes = this.nes;
	}

	_onKeyDown = (e) => {
		switch (e.key) {
			case "s":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_B);
				break;
			case "d":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_A);
				break;
			case "ArrowUp":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_UP);
				break;
			case "ArrowDown":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_DOWN);
				break;
			case "ArrowLeft":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_LEFT);
				break;
			case "ArrowRight":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_RIGHT);
				break;
			case "Enter":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_START);
				break;
			case "Delete":
				this.nes.buttonDown(1, jsnes.Controller.BUTTON_SELECT);
				break;
			default:
		}
	};

	_onKeyUp = (e) => {
		switch (e.key) {
			case "s":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_B);
				break;
			case "d":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_A);
				break;
			case "ArrowUp":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_UP);
				break;
			case "ArrowDown":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_DOWN);
				break;
			case "ArrowLeft":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_LEFT);
				break;
			case "ArrowRight":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_RIGHT);
				break;
			case "Enter":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_START);
				break;
			case "Delete":
				this.nes.buttonUp(1, jsnes.Controller.BUTTON_SELECT);
				break;
			default:
		}
	};
}

export default Emulator;
