import _ from "lodash";

const KEY = "options";

class Config {
	constructor() {
		this.options = this.defaultOptions;
	}

	save() {
		localStorage.setItem(KEY, JSON.stringify(this.options));

		return this;
	}

	load() {
		try {
			this.options =
				JSON.parse(localStorage.getItem(KEY)) || this.defaultOptions;
		} catch (e) {
			this.options = this.defaultOptions;
		}

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
			{ name: "90%", value: 90 },
			{ name: "75%", value: 75 },
			{ name: "50%", value: 50 },
			{ name: "25%", value: 25 },
			{ name: "10%", value: 10 },
			{ name: "0%", value: 0 }
		];
	}

	get bufferingOptions() {
		return [
			{
				name: "Disabled",
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
