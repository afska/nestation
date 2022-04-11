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
	state = { player: 1 };

	render() {
		const upKey = this._keyFor("BUTTON_UP");
		const isUpArrow = upKey === "~v";

		return (
			<div className={styles.controls}>
				<b className={classNames(styles.title, styles.centered)}>
					{strings.controls}
				</b>
				<b className={classNames(styles.title, styles.centered)}>
					{this.state.player}P
				</b>
				{this.state.player === 1 ? (
					<b className={classNames(styles.dpad, styles.centered)}>
						({strings.swap}:{" "}
						{this.usesGamepad ? strings.swapButton : this._keyFor("SWAP")})
					</b>
				) : (
					<br />
				)}
				<br />
				{this.usesGamepad ? (
					<div className={styles.centered}>{strings.yourController}</div>
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

	blink() {
		const element = document.querySelector("#root");
		element.classList.remove("blink");
		setTimeout(() => element.classList.add("blink"), TRICK_TIME);
	}

	componentDidMount() {
		bus
			.on("keymap", () => {
				bus.emit("keymap-updated");
				this.forceUpdate();
				this.blink();
			})
			.on("player", (player) => {
				this.setState({ player });
				this.blink();
			})
			.on("gamepad", this._onGamepadConnected)
			.on("reset", () => {
				this.setState({ player: 1 });
			});
	}

	componentWillUnmount() {
		bus.removeListener("keymap");
	}

	_onGamepadConnected = (e) => {
		this.usesGamepad = true;
		this.forceUpdate();
		this.blink();
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
