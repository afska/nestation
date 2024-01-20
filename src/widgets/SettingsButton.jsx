import React, { Component } from "react";
import bus from "../events";
import styles from "./SettingsButton.module.css";
import strings from "../locales";

export default class SettingsButton extends Component {
	render() {
		return (
			<div className={styles.button}>
				<button
					type="button"
					tabIndex="-1"
					className="nes-btn"
					onClick={this._onClick}
				>
					{strings.settings}
				</button>
			</div>
		);
	}

	_onClick = () => {
		bus.emit("openSettings");
	};
}
