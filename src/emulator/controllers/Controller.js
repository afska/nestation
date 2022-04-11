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
	constructor(player = 1, getNes) {
		this.player = player;
		this.getNes = getNes;

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
	}

	syncAll(byte) {
		this.sync("BUTTON_A", !!(byte & BITS[0]));
		this.sync("BUTTON_B", !!(byte & BITS[1]));
		this.sync("BUTTON_SELECT", !!(byte & BITS[2]));
		this.sync("BUTTON_START", !!(byte & BITS[3]));
		this.sync("BUTTON_UP", !!(byte & BITS[4]));
		this.sync("BUTTON_DOWN", !!(byte & BITS[5]));
		this.sync("BUTTON_LEFT", !!(byte & BITS[6]));
		this.sync("BUTTON_RIGHT", !!(byte & BITS[7]));
	}

	sync(button, isPressed) {
		const nes = this.getNes();

		this.buttons[button] = isPressed;

		if (isPressed) nes.buttonDown(this.player, jsnes.Controller[button]);
		else nes.buttonUp(this.player, jsnes.Controller[button]);
	}

	resync() {
		this.syncAll(this.toByte());
	}

	toByte(source = this.buttons) {
		return (
			(source.BUTTON_A && BITS[0]) |
			(source.BUTTON_B && BITS[1]) |
			(source.BUTTON_SELECT && BITS[2]) |
			(source.BUTTON_START && BITS[3]) |
			(source.BUTTON_UP && BITS[4]) |
			(source.BUTTON_DOWN && BITS[5]) |
			(source.BUTTON_LEFT && BITS[6]) |
			(source.BUTTON_RIGHT && BITS[7])
		);
	}
}
