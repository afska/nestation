import React, { Component } from "react";
import { Buffer } from "buffer";
import Emulator from "../emulator";
import Header from "../widgets/Header";
import styles from "./PlayScreen.module.css";
import nesImage from "../assets/nes.png";

export default class PlayScreen extends Component {
	state = { bytes: null };

	render() {
		return (
			<div className={styles.app}>
				<Header>
					Share <a href="/#">/room</a> to play with others!
				</Header>

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
		if (!this.props.rom) {
			window.location.hash = "";
			return;
		}

		const arrayBuffer = this.props.rom;
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
