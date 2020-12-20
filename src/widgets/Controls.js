import React, { Component } from "react";
import config from "../config";
import strings from "../locales";
import helpers from "../gui/helpers";
import bus from "../events";
import styles from "./Controls.module.css";
import classNames from "classnames";
import _ from "lodash";

const TRICK_TIME = 100;
const FRIENDLY_NAMES = {
	ArrowLeft: "<",
	ArrowRight: ">",
	ArrowUp: "~v",
	ArrowDown: "v",
	" ": "[Space]"
};

export default class Controls extends Component {
	render() {
		const upKey = this._keyFor("BUTTON_UP");
		const isUpArrow = upKey === "~v";

		return (
			<div className={styles.controls} id="controls">
				<b className={classNames(styles.title, styles.centered)}>
					{strings.controls}
				</b>
				<br />
				{this.usesGamepad ? (
					<div className={styles.centered}>{strings.yourXboxController}</div>
				) : (
					<>
						<div className={styles.controller}>
							<span className={styles.dpad}>
								<span>{this._keyFor("BUTTON_LEFT")}</span>{" "}
								<span>{this._keyFor("BUTTON_RIGHT")}</span>{" "}
								<span
									style={
										isUpArrow
											? { transform: "scale(1, -1)", display: "inline-block" }
											: null
									}
								>
									{isUpArrow ? "v" : upKey}
								</span>{" "}
								<span>{this._keyFor("BUTTON_DOWN")}</span>
							</span>
							<span className={styles.buttons}>
								{this._keyFor("BUTTON_B")} {this._keyFor("BUTTON_A")}
							</span>
						</div>
						<div className={styles.centered}>
							{this._keyFor("BUTTON_SELECT")} {this._keyFor("BUTTON_START")}
						</div>
					</>
				)}
			</div>
		);
	}

	componentDidMount() {
		bus.on("keymap", () => {
			bus.emit("keymap-updated");
			this.forceUpdate();

			const element = document.querySelector("#controls");
			element.classList.remove("blink");
			setTimeout(() => element.classList.add("blink"), TRICK_TIME);
		});

		window.addEventListener("gamepadconnected", this._onGamepadConnected);
	}

	componentWillUnmount() {
		bus.removeListener("keymap");
		window.removeEventListener("gamepadconnected");
	}

	_onGamepadConnected = (e) => {
		if (e.gamepad.mapping !== "standard") return;

		this.usesGamepad = true;
		this.forceUpdate();
	};

	_keyFor(button) {
		const key = _.findKey(config.options.input, (it) => it === button);
		if (!key) return "[?]";

		return this._format(key);
	}

	_format(key) {
		return (
			FRIENDLY_NAMES[key] ||
			(key.length === 1 ? key.toUpperCase() : `[${helpers.ellipsize(key, 6)}]`)
		);
	}
}
