const KEY = "options";
const HALF_VOLUME = "50%";
const DISABLED = "Disabled";

class Config {
	constructor() {
		this.options = this.defaultOptions;
		this.load();
	}

	save() {
		localStorage.setItem(KEY, JSON.stringify(this.options));
	}

	load() {
		try {
			this.options =
				JSON.parse(localStorage.getItem(KEY)) || this.defaultOptions;
		} catch (e) {
			this.reset();
		}
	}

	reset() {
		this.options = this.defaultOptions;
		this.save();
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
			crt: true,
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
				masterBufferLimit: 3,
				minBufferSize: 1,
				maxBufferSize: 1
			},
			{ name: "Low", masterBufferLimit: 3, minBufferSize: 1, maxBufferSize: 2 },
			{
				name: "Medium",
				masterBufferLimit: 5,
				minBufferSize: 2,
				maxBufferSize: 3
			},
			{ name: "High", masterBufferLimit: 5, minBufferSize: 3, maxBufferSize: 5 }
		];
	}
}

export default new Config();
