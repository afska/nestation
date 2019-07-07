import React, { Component } from "react";
import KeyBinding from "../widgets/KeyBinding";
import bus from "../events";
import config from "../config";
import strings from "../locales";
import styles from "./Settings.module.css";
import classNames from "classnames";
import _ from "lodash";

export default class Settings extends Component {
	componentDidMount() {
		config.load();
		this.forceUpdate();
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

					<KeyBinding name="BUTTON_LEFT" displayName="🠜" />
					<KeyBinding name="BUTTON_RIGHT" displayName="🠞" />
					<KeyBinding name="BUTTON_UP" displayName="🠝" />
					<KeyBinding name="BUTTON_DOWN" displayName="🠟" />
					<KeyBinding name="BUTTON_B" displayName="B" />
					<KeyBinding name="BUTTON_A" displayName="A" />
					<KeyBinding name="BUTTON_SELECT" displayName="SELECT" />
					<KeyBinding name="BUTTON_START" displayName="START" />
				</section>
			</div>
		);
	}

	_update(property, value) {
		_.set(config.options, property, value);
		config.save();
		this.forceUpdate();
	}

	_onClose = () => {
		bus.emit("closeSettings");
	};
}
