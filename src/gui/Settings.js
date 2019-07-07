import React, { Component } from "react";
import KeyBinding from "../widgets/KeyBinding";
import bus from "../events";
import strings from "../locales";
import styles from "./Settings.module.css";
import classNames from "classnames";

const SOUND_OPTIONS = [
	{ name: "100%", value: 100 },
	{ name: "75%", value: 75 },
	{ name: "50%", value: 50 },
	{ name: "25%", value: 25 },
	{ name: strings.disabled, value: 0 }
];

const BUFFERING_OPTIONS = [
	{
		name: strings.disabled,
		maxBlindFrames: 3,
		minBufferSize: 1,
		maxBufferSize: 1
	},
	{ name: "Low", maxBlindFrames: 3, minBufferSize: 1, maxBufferSize: 2 },
	{ name: "Medium", maxBlindFrames: 5, minBufferSize: 2, maxBufferSize: 3 },
	{ name: "High", maxBlindFrames: 5, minBufferSize: 3, maxBufferSize: 5 }
];

export default class Settings extends Component {
	render() {
		return (
			<div className={styles.settings}>
				<button
					type="button"
					className={classNames(styles.closeButton, "nes-btn")}
					onClick={this._onClose}
				>
					x
				</button>

				<section
					className={classNames("nes-container", "is-dark", "with-title")}
				>
					<div className="title">{strings.sound}</div>

					{SOUND_OPTIONS.map((it) => (
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

					{BUFFERING_OPTIONS.map((it) => (
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
