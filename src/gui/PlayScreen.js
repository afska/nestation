import React, { Component } from "react";
import Emulator from "../emulator";
import InviteHeader from "./InviteHeader";
import styles from "./PlayScreen.module.css";
import nesImage from "../assets/nes.png";
import _ from "lodash";

export default class PlayScreen extends Component {
	state = { rom: null };

	render() {
		const { rom } = this.state;

		return (
			<div
				className={styles.app}
				onDragOver={this._ignore}
				onDragEnter={this._ignore}
				onDrop={this._onFileDrop}
			>
				<InviteHeader
					onChannel={(channel) => (this.channel = channel)}
					rom={rom}
				/>

				<div className={styles.main}>
					<section
						className={`${
							styles.gameContainer
						} nes-container is-dark with-title`}
					>
						<h3 className="title">
							<img className={styles.nesImage} src={nesImage} alt="nes" />
						</h3>
						{rom && <Emulator rom={rom} ref={(ref) => (this.emulator = ref)} />}
					</section>
				</div>
			</div>
		);
	}

	componentDidMount() {
		window.addEventListener("resize", this._onResize);
		window.addEventListener("dragover", this._ignore);
		window.addEventListener("dragenter", this._ignore);
		window.addEventListener("drop", this._ignore);
	}

	componentWillUnmount() {}

	_onResize = () => {};

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();

		reader.onload = (event) => {
			this.setState({ rom: event.target.result });
		};

		reader.readAsArrayBuffer(file);
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};
}
