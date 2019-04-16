import React, { Component } from "react";
import jsnes from "jsnes";
import { Buffer } from "buffer";
import styles from "./App.module.css";

export default class App extends Component {
	render() {
		return (
			<div className={styles.app}>
				<div className={styles.header}>
					<section className={`${styles.link} message -left`}>
						<div className="nes-balloon from-left is-small">
							<p>
								Share <a href="/#">/room</a> to play with others!
							</p>
						</div>
						<br />
						<i className="nes-mario" />
					</section>

					<h2 className={styles.title}>
						<i className="nes-logo" />
						<span className={styles.titleText}>NEStation</span>
					</h2>
				</div>

				<div className={styles.main}>
					<section
						className={`${styles.game} nes-container is-dark with-title`}
					>
						<h3 className="title">Game</h3>
					</section>
				</div>
			</div>
		);
	}

	async componentDidMount() {
		const response = await fetch("rom.nes");
		const arrayBuffer = await response.arrayBuffer();
		const bytes = Buffer.from(arrayBuffer);

		var nes = new jsnes.NES({
			onFrame: function(frameBuffer) {
				console.log("FRAME", frameBuffer);
				// ... write frameBuffer to screen
			},
			onAudioSample: function(left, right) {
				// ... play audio sample
			}
		});

		// Load ROM data as a string
		nes.loadROM(bytes.toString("binary"));

		// Run frames at 60 fps, or as fast as you can.
		// You are responsible for reliable timing as best you can on your platform.
		nes.frame();
		nes.frame();
		// ...

		// Hook up whatever input device you have to the controller.
		// nes.buttonDown(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// nes.buttonUp(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// ...
	}
}
