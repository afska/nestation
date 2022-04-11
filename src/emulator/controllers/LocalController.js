import Controller from "./Controller";
import config from "../../config";
import bus from "../../events";
import _ from "lodash";

export default class LocalController extends Controller {
	constructor(player, getNes, onStart = () => {}) {
		super(player, getNes);

		this.isMaster = true;
		this.needsSwap = false;
		this.immediateButtons = _.clone(this.buttons);
		this.onStart = onStart;
		this.keyMap = config.options.input;
	}

	swapWith(otherController) {
		const otherPlayer = otherController.player;
		otherController.player = this.player;
		this.player = otherPlayer;

		this.needsSwap = false;
		this.resync();
		otherController.resync();
		return otherPlayer;
	}

	resync() {
		this.syncAll(super.toByte());
	}

	toByte() {
		return super.toByte(this.immediateButtons);
	}

	attach() {
		this.$gamepadInterval = setInterval(this._processGamepadIfPossible, 10);

		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
		bus.on("keymap-updated", () => (this.keyMap = config.options.input));
	}

	detach() {
		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
		bus.removeListener("keymap-updated");
		clearInterval(this.$gamepadInterval);
	}

	_processGamepadIfPossible = () => {
		const gamepad = _.first(navigator.getGamepads());
		if (!gamepad || gamepad.mapping !== "standard") return;

		if (window.usesGamepad === undefined) {
			window.usesGamepad = window.confirm(`Use ${gamepad.id}?`);
			if (window.usesGamepad) bus.emit("gamepad");
		}
		if (!window.usesGamepad) return;

		const isPressed = (id) => gamepad.buttons[id].pressed;

		this._setButton("BUTTON_A", isPressed(1));
		this._setButton("BUTTON_B", isPressed(0));
		this._setButton("BUTTON_SELECT", isPressed(8));
		this._setButton("BUTTON_START", isPressed(9));
		this._setButton("BUTTON_UP", isPressed(12));
		this._setButton("BUTTON_DOWN", isPressed(13));
		this._setButton("BUTTON_LEFT", isPressed(14));
		this._setButton("BUTTON_RIGHT", isPressed(15));
		this._setButton("SWAP", isPressed(5));
	};

	_onKeyDown = (e) => {
		if (window.usesGamepad) return;

		const button = this.keyMap[e.key];
		if (!button) return;

		this._setButton(button, true);
	};

	_onKeyUp = (e) => {
		if (window.usesGamepad) return;

		const button = this.keyMap[e.key];
		if (!button) return;

		this._setButton(button, false);
	};

	_setButton(button, isPressed) {
		if (button === "BUTTON_START" && isPressed) this.onStart();
		if (button === "SWAP") {
			if (this.player === 1 && isPressed) this.needsSwap = true;
			return;
		}

		this._sync(button, isPressed);
	}

	_sync(button, isPressed) {
		this.immediateButtons[button] = isPressed;
		if (this.isMaster) this.sync(button, isPressed);
	}
}
