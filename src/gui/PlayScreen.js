import React, { Component } from "react";
import Emulator from "../emulator";
import InviteHeader from "./InviteHeader";
import JoinHeader from "./JoinHeader";
import styles from "./PlayScreen.module.css";
import nesImage from "../assets/nes.png";
import strings from "../locales";
import _ from "lodash";

export default class PlayScreen extends Component {
	state = { rom: null, syncer: null };

	render() {
		const { token } = this.props;
		const { rom, syncer } = this.state;

		return (
			<div className={styles.app}>
				{syncer ? (
					<div>{strings.connected}</div>
				) : token ? (
					<JoinHeader onSyncer={this._onSyncer} token={token} />
				) : (
					<InviteHeader onSyncer={this._onSyncer} needsRom={!rom} />
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
							<Emulator
								rom={rom}
								syncer={syncer}
								ref={(ref) => (this.emulator = ref)}
							/>
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

	_onSyncer = (syncer) => {
		this.setState({ syncer });

		syncer.initializeRom(this.state.rom);
		syncer.on("rom", (rom) => {
			this._loadRom(rom, () => {
				syncer.initializeEmulator(this.emulator);
			});
		});
	};

	_loadRom(rom, callback = _.noop) {
		this.setState({ rom }, () => {
			this.emulator.start();
			callback();
		});
	}

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();

		reader.onload = (event) => {
			this._loadRom(event.target.result);
		};

		reader.readAsArrayBuffer(file);
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	_onResize = () => {};
}
