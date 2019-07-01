import Controller from "./Controller";
import _ from "lodash";

export default class LocalController extends Controller {
	constructor(player, getNes) {
		super(player, getNes);

		this.immediateButtons = _.clone(this.buttons);

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

	toByte() {
		return super.toByte(this.immediateButtons);
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
