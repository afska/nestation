const KEY = "options";
const HALF_VOLUME = "50%";
const DISABLED = "Disabled";

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

	get sound() {
		return this.soundOptions.find((it) => it.name === this.options.sound);
	}

	get buffering() {
		return this.bufferingOptions.find(
			(it) => it.name === this.options.buffering
		);
	}

	get defaultOptions() {
		return {
			sound: HALF_VOLUME,
			buffering: DISABLED,
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
			{ name: "100%", gain: 1 },
			{ name: "90%", gain: 0.9 },
			{ name: "75%", gain: 0.75 },
			{ name: HALF_VOLUME, gain: 0.5 },
			{ name: "25%", gain: 0.25 },
			{ name: "10%", gain: 0.1 },
			{ name: "0%", gain: 0 }
		];
	}

	get bufferingOptions() {
		return [
			{
				name: DISABLED,
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
