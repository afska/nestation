import EventEmitter from "eventemitter3";
import bus from "../events";
import { Receive } from "./transfer";

const MIN_BUFFER_SIZE = 1;
const MAX_BUFFER_SIZE = 2;
const STATE = {
	RECEIVING_ROM: 0,
	PLAYING: 1
};

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
		this._reset();
		this.channel.on("data", (bytes) => this._onData(bytes));
	}

	sync() {
		// buffer underrun
		if (this._buffer.length < MIN_BUFFER_SIZE) {
			this._isBuffering = true;
			bus.emit("isLoading", true);
			return;
		}

		// buffer overrun
		if (this._buffer.length > MAX_BUFFER_SIZE) {
			for (let i = 0; i < this._buffer.length - MAX_BUFFER_SIZE; i++)
				this._runFrame();
			return;
		}

		// normal handling
		if (this._isBuffering && this._buffer.length < MAX_BUFFER_SIZE) return;
		else {
			this._ifBuffering = false;
			bus.emit("isLoading", false);
			this._runFrame();
		}
	}

	initializeRom(rom) {}

	updateRom(rom) {}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		this.emit("start");
		bus.emit("isLoading", false);
		emulator.localController.player = 2;
		emulator.remoteController.player = 1;
	}

	_runFrame() {
		const bytes = this._buffer.shift();
		const remoteButtons = new Uint8Array(bytes)[0];
		const localButtons = new Uint8Array(bytes)[1];
		this._emulator.remoteController.syncAll(remoteButtons);
		this._emulator.localController.syncAll(localButtons);

		this._emulator.frame();
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
			case STATE.PLAYING:
				if (bytes === "new-rom") {
					this._reset();
					return;
				}

				this._buffer.push(bytes);

				const buffer = new Uint8Array(1);
				buffer[0] = this._emulator.localController.toByte();
				this.channel.send(buffer);

				break;
			default:
		}
	}

	_reset() {
		this._state = STATE.RECEIVING_ROM;
		this._transfer = new Receive(this.channel);
		this._isBuffering = false;
		this._buffer = [];

		bus.emit("isLoading", true);
	}
}
