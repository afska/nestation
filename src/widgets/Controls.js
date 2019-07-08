import React, { Component } from "react";
import config from "../config";
import strings from "../locales";
import bus from "../events";
import styles from "./Controls.module.css";
import classNames from "classnames";
import _ from "lodash";

const FRIENDLY_NAMES = {
	ArrowLeft: "🠜",
	ArrowRight: "🠞",
	ArrowUp: "🠝",
	ArrowDown: "🠟",
	" ": "[Space]"
};

export default class Controls extends Component {
	render() {
		return (
			<div className={styles.controls}>
				<b className={classNames(styles.title, styles.centered)}>
					{strings.controls}
				</b>
				<br />
				<div className={styles.controller}>
					<span className={styles.dpad}>
						{this._keyFor("BUTTON_LEFT")} {this._keyFor("BUTTON_RIGHT")}{" "}
						{this._keyFor("BUTTON_UP")} {this._keyFor("BUTTON_DOWN")}
					</span>
					<span className={styles.buttons}>
						{this._keyFor("BUTTON_B")} {this._keyFor("BUTTON_A")}
					</span>
				</div>
				<div className={styles.centered}>
					{this._keyFor("BUTTON_SELECT")} {this._keyFor("BUTTON_START")}
				</div>
			</div>
		);
	}

	componentDidMount() {
		bus.on("keymap", () => {
			bus.emit("keymap-updated");
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		bus.removeListener("keymap");
	}

	_keyFor(button) {
		const key = _.findKey(config.options.input, (it) => it === button);
		if (!key) return "[?]";

		return this._format(key);
	}

	_format(key) {
		return (
			FRIENDLY_NAMES[key] || (key.length === 1 ? key.toUpperCase() : `[${key}]`)
		);
	}
}
