import React, { Component } from "react";
import Emulator from "./emulator";
import BalloonMessage from "./BalloonMessage";
import { Buffer } from "buffer";
import styles from "./App.module.css";

export default class App extends Component {
	state = { bytes: null };

	render() {
		return (
			<div className={styles.app}>
				<div className={styles.header}>
					<BalloonMessage>
						Share <a href="/#">/room</a> to play with others!
					</BalloonMessage>

					<h2>
						<i className="nes-logo" />
						<span className={styles.titleText}>NEStation</span>
					</h2>
				</div>

				<div className={styles.main}>
					<section
						className={`${styles.game} nes-container is-dark with-title`}
					>
						<h3 className="title">Game</h3>
						{this.state.bytes && <Emulator bytes={this.state.bytes} />}
					</section>
				</div>
			</div>
		);
	}

	async componentDidMount() {
		const response = await fetch("rom.nes");
		const arrayBuffer = await response.arrayBuffer();
		const bytes = Buffer.from(arrayBuffer);
		this.setState({ bytes });

		// TODO: Controllers
		// Hook up whatever input device you have to the controller.
		// nes.buttonDown(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// nes.buttonUp(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// ...
	}
}
