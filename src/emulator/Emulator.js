import React, { Component } from "react";
import jsnes, { NES } from "jsnes";
import FrameTimer from "./FrameTimer";
import Screen from "./Screen";
import Speakers from "./Speakers";

class Emulator extends Component {
	render() {
		return (
			<Screen
				ref={(screen) => {
					this.screen = screen;
				}}
				onGenerateFrame={() => {
					this.nes.frame();
				}}
			/>
		);
	}

	componentDidMount() {
		const { bytes } = this.props;

		this.speakers = new Speakers({
			onBufferUnderrun: (actualSize, desiredSize) => {
				if (this.props.paused) return;

				// Skip a video frame so audio remains consistent. This happens for
				// a variety of reasons:
				// - Frame rate is not quite 60fps, so sometimes buffer empties.
				// - Page is not visible, so `requestAnimationFrame` doesn't get fired.
				//   In this case emulator still runs at full speed, but timing is
				//   done by audio instead of `requestAnimationFrame`.
				// - System can't run emulator at full speed. In this case it'll stop
				//   firing `requestAnimationFrame`.
				this.frameTimer.generateFrame();

				// `desiredSize` will be 2048, and the NES produces 1468 samples on each
				// frame so we might need a second frame to be run. Give up after that
				// though -- the system is not catching up
				if (this.speakers.buffer.size() < desiredSize)
					this.frameTimer.generateFrame();
			}
		});

		this.nes = new NES({
			onFrame: this.screen.setBuffer,
			onAudioSample: this.speakers.writeSample,
			sampleRate: this.speakers.getSampleRate()
		});

		this.frameTimer = new FrameTimer({
			onGenerateFrame: this.nes.frame,
			onWriteFrame: this.screen.writeBuffer
		});

		// Load ROM data as a string and start
		this.nes.loadROM(bytes.toString("binary"));
		this.start();

		// DEBUG
		window.jsnes = jsnes;
		window.nes = this.nes;
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
	}
}

export default Emulator;
