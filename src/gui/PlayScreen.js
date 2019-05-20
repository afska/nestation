import React, { Component } from "react";
import Emulator from "../emulator";
import InviteHeader from "./InviteHeader";
import JoinHeader from "./JoinHeader";
import styles from "./PlayScreen.module.css";
import nesImage from "../assets/nes.png";
import _ from "lodash";

export default class PlayScreen extends Component {
	state = { rom: null, channel: null };

	render() {
		const { token } = this.props;
		const { rom, channel } = this.state;

		return (
			<div className={styles.app}>
				{channel ? (
					<div>CONNECTED</div>
				) : token ? (
					<JoinHeader
						onChannel={(channel) => this.setState({ channel })}
						token={token}
					/>
				) : (
					<InviteHeader
						onChannel={(channel) => this.setState({ channel })}
						rom={rom}
					/>
				)}

				{rom && (
					<div className={styles.main}>
						<section
							className={`${
								styles.gameContainer
							} nes-container is-dark with-title`}
						>
							<h3 className="title">
								<img className={styles.nesImage} src={nesImage} alt="nes" />
							</h3>
							<Emulator rom={rom} ref={(ref) => (this.emulator = ref)} />
						</section>
					</div>
				)}
			</div>
		);
	}

	componentDidMount() {
		window.addEventListener("dragover", this._ignore);
		window.addEventListener("dragenter", this._ignore);
		window.addEventListener("drop", this._onFileDrop);
		window.addEventListener("resize", this._onResize);
	}

	componentWillUnmount() {
		window.removeEventListener("dragover", this._ignore);
		window.removeEventListener("dragenter", this._ignore);
		window.removeEventListener("drop", this._onFileDrop);
		window.removeEventListener("resize", this._onResize);
	}

	_onChannel = (channel) => {
		this.setState({ channel });
	};

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();

		reader.onload = (event) => {
			this.setState({ rom: event.target.result }, () => {
				this.emulator.start();
			});
		};

		reader.readAsArrayBuffer(file);
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	_onResize = () => {};
}
