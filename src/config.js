import _ from "lodash";
import strings from "./locales";

const KEY = "options";

class Config {
	constructor() {
		this.options = this.defaultOptions;
	}

	save() {
		localStorage.setItem(KEY, this.options);

		return this;
	}

	load() {
		this.options =
			localStorage.getItem(KEY, this.options) || this.defaultOptions;

		return this;
	}

	get defaultOptions() {
		return {
			sound: _.first(this.soundOptions).name,
			buffering: _.first(this.bufferingOptions).name,
			input: {
				" ": "BUTTON_A",
				d: "BUTTON_B",
				Delete: "BUTTON_SELECT",
				Enter: "BUTTON_START",
				ArrowUp: "BUTTON_UP",
				ArrowDown: "BUTTON_DOWN",
				ArrowLeft: "BUTTON_LEFT",
				ArrowRight: "BUTTON_RIGHT"
			}
		};
	}

	get soundOptions() {
		return [
			{ name: "100%", value: 100 },
			{ name: "75%", value: 75 },
			{ name: "50%", value: 50 },
			{ name: "25%", value: 25 },
			{ name: strings.disabled, value: 0 }
		];
	}

	get bufferingOptions() {
		return [
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
	}
}

export default new Config();
