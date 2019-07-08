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
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
		bus.on("keymap-updated", () => (this.keyMap = config.options.input));
	}

	detach() {
		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
		bus.removeListener("keymap-updated");
	}

	_onKeyDown = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		if (button === "BUTTON_START") this.onStart();
		this.immediateButtons[button] = true;
		this.sync(button, true, this.isMaster);
	};

	_onKeyUp = (e) => {
		const button = this.keyMap[e.key];
		if (!button) return;

		this.immediateButtons[button] = false;
		this.sync(button, false, this.isMaster);
	};

	get isMaster() {
		return this.player === 1;
	}
}
