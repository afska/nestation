import Controller from "./Controller";
import config from "../../config";
import bus from "../../events";
import _ from "lodash";

export default class LocalController extends Controller {
	constructor(player, getNes, onStart = () => {}) {
		super(player, getNes);

		this.immediateButtons = _.clone(this.buttons);
		this.onStart = onStart;
		this.keyMap = config.options.input;
	}

	toByte() {
		return super.toByte(this.immediateButtons);
	}

	attach() {
		setInterval(() => {
			this._processGamepadIfPossible();
		}, 10);

		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
		bus.on("keymap-updated", () => (this.keyMap = config.options.input));
	}

	detach() {
		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
		bus.removeListener("keymap-updated");
	}

	_processGamepadIfPossible = () => {
		const gamepad = _.first(navigator.getGamepads());
		if (!gamepad || gamepad.mapping !== "standard") return;

		const isPressed = (id) => gamepad.buttons[id].pressed;

		this._setButton("BUTTON_A", isPressed(1));
		this._setButton("BUTTON_B", isPressed(0));
		this._setButton("BUTTON_SELECT", isPressed(8));
		this._setButton("BUTTON_START", isPressed(9));
		this._setButton("BUTTON_UP", isPressed(12));
		this._setButton("BUTTON_DOWN", isPressed(13));
		this._setButton("BUTTON_LEFT", isPressed(14));
		this._setButton("BUTTON_RIGHT", isPressed(15));
	};

	_onKeyDown = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		this._setButton(button, true);
	};

	_onKeyUp = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		this._setButton(button, false);
	};

	_setButton(button, isPressed) {
		if (button === "BUTTON_START" && isPressed) this.onStart();

		this.immediateButtons[button] = isPressed;
		if (this.isMaster) this.sync(button, isPressed);
	}

	get isMaster() {
		return this.player === 1;
	}
}
