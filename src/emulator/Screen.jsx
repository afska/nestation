import React, { Component } from "react";
import styles from "./Screen.module.css";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const FULL_ALPHA = 0xff000000;

export default class Screen extends Component {
	constructor(props) {
		super(props);

		this.setBuffer = this.setBuffer.bind(this);
		this.writeBuffer = this.writeBuffer.bind(this);
	}

	render() {
		return (
			<canvas
				className={styles.screen}
				width={SCREEN_WIDTH}
				height={SCREEN_HEIGHT}
				ref={(canvas) => {
					if (canvas) this._initCanvas(canvas);
				}}
			/>
		);
	}

	setBuffer(buffer) {
		for (let y = 0; y < SCREEN_HEIGHT; ++y) {
			for (let x = 0; x < SCREEN_WIDTH; ++x) {
				const i = y * SCREEN_WIDTH + x;
				// Convert pixel from NES BGR to canvas ABGR
				this.buf32[i] = FULL_ALPHA | buffer[i];
			}
		}
	}

	writeBuffer() {
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	}

	_initCanvas(canvas) {
		this.context = canvas.getContext("2d");
		this.imageData = this.context.getImageData(
			0,
			0,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);

		// Set alpha to opaque
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

		// Buffer to write on next animation frame
		this.buf = new ArrayBuffer(this.imageData.data.length);

		// Get the canvas buffer in 8bit and 32bit
		this.buf8 = new Uint8ClampedArray(this.buf);
		this.buf32 = new Uint32Array(this.buf);

		// Set alpha
		for (let i = 0; i < this.buf32.length; ++i) {
			this.buf32[i] = FULL_ALPHA;
		}
	}
}
