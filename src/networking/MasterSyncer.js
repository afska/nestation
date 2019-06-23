import EventEmitter from "eventemitter3";
import { Send } from "./transfer";

const MAX_BLIND_FRAMES = 3;
const STATE = {
	SENDING_ROM: 0,
	SYNCING: 1,
	PLAYING: 2
};

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
		this.channel.on("data", (bytes) => this._onData(bytes));

		this._state = STATE.SENDING_ROM;
		this._transfer = null;
		this._blindFrames = 0;
	}

	sync() {
		if (this._state !== STATE.PLAYING) return;
		if (this._blindFrames > MAX_BLIND_FRAMES) return;

		this._emulator.frame();
		const buffer = new Uint8Array(2);
		buffer[0] = this._emulator.localController.toByte();
		buffer[1] = this._emulator.remoteController.toByte();
		this.channel.send(buffer);

		this._blindFrames++;
	}

	initializeRom(rom) {
		this._transfer = new Send(rom, this.channel);
		setTimeout(() => this._transfer.run(), 1000); // TODO: WHY!
		this.emit("rom", rom);
	}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.localController.player = 1;
		emulator.remoteController.player = 2;
	}

	_onData(bytes) {
		switch (this._state) {
			case STATE.SENDING_ROM:
				if (bytes === "next") {
					this._transfer.run();
				} else if (bytes === "sync") {
					this._transfer = null;
					this._state = STATE.PLAYING;
					this.emit("start");
				}

				break;
			case STATE.SYNCING:
				break;
			case STATE.PLAYING:
				const remoteButtons = new Uint8Array(bytes)[0];
				this._emulator.remoteController.syncAll(remoteButtons);
				this._blindFrames = 0;

				break;
			default:
		}
	}
}
