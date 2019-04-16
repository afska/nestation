import React, { Component } from "react";
import Emulator from "./emulator";
import BalloonMessage from "./BalloonMessage";
import { Buffer } from "buffer";
import styles from "./App.module.css";
import nesImage from "./assets/nes.png";

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
						className={`${
							styles.gameContainer
						} nes-container is-dark with-title`}
					>
						<h3 className="title">
							<img className={styles.nesImage} src={nesImage} alt="nes" />
						</h3>
						{this.state.bytes && (
							<Emulator
								bytes={this.state.bytes}
								ref={(ref) => (this.emulator = ref)}
							/>
						)}
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

		window.addEventListener("resize", this._resize);

		// TODO: Controllers
		// Hook up whatever input device you have to the controller.
		// nes.buttonDown(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// nes.buttonUp(1, jsnes.Controller.BUTTON_A);
		// nes.frame();
		// ...
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this._resize);
	}

	_resize = () => {};
}
