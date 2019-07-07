import React, { Component } from "react";
import KeyBinding from "../widgets/KeyBinding";
import bus from "../events";
import config from "../config";
import strings from "../locales";
import styles from "./Settings.module.css";
import classNames from "classnames";

export default class Settings extends Component {
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

					{config.soundOptions.map((it) => (
						<label key={it.name}>
							<input
								type="radio"
								className="nes-radio is-dark"
								name="answer-dark"
							/>
							<span>{it.name}</span>
						</label>
					))}
				</section>
				<br />
				<br />

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">{strings.buffering}</div>

					{config.bufferingOptions.map((it) => (
						<label key={it.name}>
							<input
								type="radio"
								className="nes-radio is-dark"
								name="answer-dark"
							/>
							<span>{it.name}</span>
						</label>
					))}
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

	_onClose = () => {
		bus.emit("closeSettings");
	};
}
