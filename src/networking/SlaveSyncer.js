import EventEmitter from "eventemitter3";
import { Receive } from "./transfer";

const MIN_BUFFER_SIZE = 1;
const STATE = {
	RECEIVING_ROM: 0,
	SYNCING: 1,
	PLAYING: 2
};

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
		this.channel.on("data", (bytes) => this._onData(bytes));

		this._state = STATE.RECEIVING_ROM;
		this._transfer = new Receive(channel);
		this._buffer = [];
	}

	sync() {
		if (this._buffer.length < MIN_BUFFER_SIZE) return;

		const bytes = this._buffer.shift();
		const remoteButtons = new Uint8Array(bytes)[0];
		const localButtons = new Uint8Array(bytes)[1];
		this._emulator.remoteController.syncAll(remoteButtons);
		this._emulator.localController.syncAll(localButtons);

		this._emulator.frame();
	}

	initializeRom(rom) {}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		this._emulator.start();
		emulator.localController.player = 2;
		emulator.remoteController.player = 1;
	}

	_onData(bytes) {
		switch (this._state) {
			case STATE.RECEIVING_ROM:
				if (bytes === "end") {
					this.emit("rom", this._transfer.rom);
					this._transfer = null;
					this.channel.send("sync");
					this._state = STATE.PLAYING;
				} else {
					this._transfer.run(bytes);
				}

				break;
			case STATE.SYNCING:
				break;
			case STATE.PLAYING:
				this._buffer.push(bytes);

				const buffer = new Uint8Array(1);
				buffer[0] = this._emulator.localController.toByte();
				this.channel.send(buffer);

				break;
			default:
		}
	}
}
