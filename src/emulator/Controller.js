import jsnes from "jsnes";

const BITS = [
	0b00000001,
	0b00000010,
	0b00000100,
	0b00001000,
	0b00010000,
	0b00100000,
	0b01000000,
	0b10000000
];

export default class Controller {
	constructor(player = 1, listener) {
		this.player = player;
		this.listener = listener;

		this.buttons = {
			BUTTON_A: false,
			BUTTON_B: false,
			BUTTON_SELECT: false,
			BUTTON_START: false,
			BUTTON_UP: false,
			BUTTON_DOWN: false,
			BUTTON_LEFT: false,
			BUTTON_RIGHT: false
		};

		this.keyMap = {
			d: "BUTTON_A",
			s: "BUTTON_B",
			Delete: "BUTTON_SELECT",
			Enter: "BUTTON_START",
			ArrowUp: "BUTTON_UP",
			ArrowDown: "BUTTON_DOWN",
			ArrowLeft: "BUTTON_LEFT",
			ArrowRight: "BUTTON_RIGHT"
		};
	}

	syncAll(nes, byte) {
		this.sync(nes, "BUTTON_A", !!(byte & BITS[0]));
		this.sync(nes, "BUTTON_B", !!(byte & BITS[1]));
		this.sync(nes, "BUTTON_SELECT", !!(byte & BITS[2]));
		this.sync(nes, "BUTTON_START", !!(byte & BITS[3]));
		this.sync(nes, "BUTTON_UP", !!(byte & BITS[4]));
		this.sync(nes, "BUTTON_DOWN", !!(byte & BITS[5]));
		this.sync(nes, "BUTTON_LEFT", !!(byte & BITS[6]));
		this.sync(nes, "BUTTON_RIGHT", !!(byte & BITS[7]));
	}

	sync(nes, button, isPressed) {
		if (!this.buttons[button] && isPressed) {
			this.buttons[button] = true;
			nes.buttonDown(this.player, jsnes.Controller[button]);
		} else if (this.buttons[button] && !isPressed) {
			this.buttons[button] = false;
			nes.buttonUp(this.player, jsnes.Controller[button]);
		}
	}

	toByte() {
		return (
			(this.buttons.BUTTON_A && BITS[0]) |
			(this.buttons.BUTTON_B && BITS[1]) |
			(this.buttons.BUTTON_SELECT && BITS[2]) |
			(this.buttons.BUTTON_START && BITS[3]) |
			(this.buttons.BUTTON_UP && BITS[4]) |
			(this.buttons.BUTTON_DOWN && BITS[5]) |
			(this.buttons.BUTTON_LEFT && BITS[6]) |
			(this.buttons.BUTTON_RIGHT && BITS[7])
		);
	}

	attach() {
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
	}

	detach() {
		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
	}

	_onKeyDown = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		if (this.listener) this.listener.onButtonDown(button);
		this.buttons[button] = true;
	};

	_onKeyUp = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		if (this.listener) this.listener.onButtonUp(button);
		this.buttons[button] = false;
	};
}
