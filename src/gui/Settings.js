import React, { Component } from "react";
import KeyBinding from "../widgets/KeyBinding";
import bus from "../events";
import config from "../config";
import strings from "../locales";
import styles from "./Settings.module.css";
import classNames from "classnames";
import _ from "lodash";

const BUTTONS = [
	{ name: "BUTTON_LEFT", displayName: "🠜" },
	{ name: "BUTTON_RIGHT", displayName: "🠞" },
	{ name: "BUTTON_UP", displayName: "🠝" },
	{ name: "BUTTON_DOWN", displayName: "🠟" },
	{ name: "BUTTON_B", displayName: "B" },
	{ name: "BUTTON_A", displayName: "A" },
	{ name: "BUTTON_SELECT", displayName: "SELECT" },
	{ name: "BUTTON_START", displayName: "START" }
];

export default class Settings extends Component {
	state = { mappingButton: null };

	componentDidMount() {
		window.addEventListener("keydown", this._onKeyDown);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this._onKeyDown);
	}

	render() {
		return (
			<div className={styles.settings}>
				<button
					type="button"
					className={classNames(styles.closeButton, "nes-btn", "is-error")}
					onClick={this._onClose}
				>
					x
				</button>

				<button
					type="button"
					className={classNames(
						styles.setDefaultsButton,
						"nes-btn",
						"is-warning"
					)}
					onClick={this._onSetDefaults}
				>
					{strings.setDefaults}
				</button>

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">{strings.sound}</div>

					<div>
						{config.soundOptions.map((it) => (
							<label key={it.name}>
								<input
									type="radio"
									className="nes-radio is-dark"
									name="sound"
									checked={config.options.sound === it.name}
									onChange={(e) => this._update("sound", it.name)}
								/>
								<span>{it.name}</span>
							</label>
						))}
					</div>
				</section>
				<br />
				<br />

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">{strings.buffering}</div>

					<div>
						{config.bufferingOptions.map((it) => (
							<label key={it.name}>
								<input
									type="radio"
									className="nes-radio is-dark"
									name="buffering"
									checked={config.options.buffering === it.name}
									onChange={() => this._update("buffering", it.name)}
								/>
								<span>{it.name}</span>
							</label>
						))}
					</div>
				</section>
				<br />
				<br />

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">{strings.input}</div>

					{BUTTONS.map((button) => (
						<KeyBinding
							key={button.name}
							name={button.name}
							displayName={button.displayName}
							isAssigning={this.state.mappingButton === button.name}
							onAssignStart={() =>
								this.setState({ mappingButton: button.name })
							}
							onAssignCancel={() => this.setState({ mappingButton: null })}
						/>
					))}
				</section>
			</div>
		);
	}

	_update(property, value) {
		_.set(config.options, property, value);
		config.save();
		this._notify();
	}

	_notify() {
		bus.emit("volume", config.sound.gain);
		bus.emit("keymap");
		this.forceUpdate();
	}

	_onClose = () => {
		bus.emit("closeSettings");
	};

	_onSetDefaults = () => {
		config.reset();
		this._notify();
	};

	_onAssign = () => {
		if (this.props.isAssigning) return;

		this.props.onAssignStart();
		window.addEventListener("keydown", this._onKeyDown);
	};

	_onKeyDown = (e) => {
		if (!this.state.mappingButton) return;

		e.preventDefault();

		const oldKey = _.findKey(
			config.options.input,
			(it) => it === this.state.mappingButton
		);
		const newKey = e.key;

		delete config.options.input[oldKey];
		config.options.input[newKey] = this.state.mappingButton;
		config.save();
		this._notify();

		this.setState({ mappingButton: null });
	};
}
