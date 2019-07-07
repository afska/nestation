import React, { Component } from "react";
import Emulator from "../emulator";
import InviteHeader from "./InviteHeader";
import JoinHeader from "./JoinHeader";
import Header from "../widgets/Header";
import TVNoise from "../widgets/TVNoise";
import Overlay from "../widgets/Overlay";
import Controls from "../widgets/Controls";
import helpers from "./helpers";
import bus from "../events";
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
					<Header>{strings.connected}</Header>
				) : token ? (
					<JoinHeader
						onSyncer={this._onSyncer}
						onError={this._onError}
						token={token}
					/>
				) : (
					<InviteHeader onSyncer={this._onSyncer} needsRom={!rom} />
				)}

				{
					<div className={styles.main}>
						<section
							className={`${
								styles.gameContainer
							} nes-container is-dark with-title`}
						>
							<h3 className="title">
								<img className={styles.nesImage} src={nesImage} alt="nes" />
							</h3>

							<div className={styles.overlay}>
								<Overlay />
							</div>

							{rom ? (
								<Emulator
									rom={rom}
									syncer={syncer}
									ref={(ref) => (this.emulator = ref)}
								/>
							) : (
								<TVNoise />
							)}
						</section>
					</div>
				}

				<div className={styles.controls}>
					<Controls />
				</div>
			</div>
		);
	}

	componentDidMount() {
		window.addEventListener("dragover", this._ignore);
		window.addEventListener("dragenter", this._ignore);
		window.addEventListener("drop", this._onFileDrop);
	}

	componentWillUnmount() {
		window.removeEventListener("dragover", this._ignore);
		window.removeEventListener("dragenter", this._ignore);
		window.removeEventListener("drop", this._onFileDrop);
	}

	_onSyncer = (syncer) => {
		this.setState({ syncer });

		syncer.on("rom", (rom) => {
			this._loadRom(rom, () => syncer.initializeEmulator(this.emulator), false);
		});
		syncer.on("start", () => this.emulator.start());

		syncer.initializeRom(this.state.rom);
	};

	_loadRom(rom, callback = _.noop, start = true) {
		bus.emit("error", null);

		this.setState({ rom }, () => {
			callback();
			if (start) this.emulator.start();
		});
	}

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();
		if (!file) return;

		reader.onload = (event) => {
			const rom = event.target.result;

			if (this.state.syncer) this.state.syncer.updateRom(rom);
			else this._loadRom(event.target.result);
		};

		reader.readAsArrayBuffer(file);
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	_onError = () => {
		this.setState({ rom: null, syncer: null });

		bus.emit("error", strings.errors.connectionFailed);
		helpers.cleanQueryString();
		window.location.href = "#/";
	};
}
