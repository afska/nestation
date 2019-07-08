import EventEmitter from "eventemitter3";
import { Receive } from "./transfer";
import config from "../config";
import bus from "../events";
import strings from "../locales";

const STATE = {
	RECEIVING_ROM: 0,
	WAITING_START: 1,
	PLAYING: 2
};

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
		this._reset();
		this.channel.on("data", (bytes) => this._onData(bytes));
		this._hasPressedStart = false;
	}

	sync() {
		const { minBufferSize, maxBufferSize } = config.buffering;

		// buffer underrun
		if (this._buffer.length < minBufferSize) {
			this._isBuffering = true;
			bus.emit("isLoading", true);
			return;
		}

		// buffer overrun
		if (this._buffer.length > maxBufferSize) {
			for (let i = 0; i < this._buffer.length - maxBufferSize; i++)
				this._runFrame();
		}

		// normal handling
		if (this._isBuffering && this._buffer.length < maxBufferSize) return;
		else this._runFrame();
	}

	initializeRom(rom) {}

	updateRom(rom) {}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		bus.emit("isLoading", false);
		emulator.localController.player = 2;
		emulator.remoteController.player = 1;
	}

	onStartPressed() {
		if (this._state === STATE.WAITING_START) {
			this._hasPressedStart = true;
			this._start();
		}
	}

	_start() {
		this.emit("start");
		this.channel.send("start");
		bus.emit("message", null);
		this._state = STATE.PLAYING;
	}

	_runFrame() {
		this._ifBuffering = false;
		bus.emit("isLoading", false);

		const bytes = this._buffer.shift();
		const remoteButtons = new Uint8Array(bytes)[0];
		const localButtons = new Uint8Array(bytes)[1];
		this._emulator.remoteController.syncAll(remoteButtons);
		this._emulator.localController.syncAll(localButtons);

		this._emulator.frame();
	}

	_onData(bytes) {
		if (bytes === "new-rom") {
			this._reset();
			return;
		}

		switch (this._state) {
			case STATE.RECEIVING_ROM:
				if (bytes === "end") {
					this.emit("rom", this._transfer.rom);
					this._transfer = null;

					if (this._hasPressedStart) this._start();
					else {
						bus.emit("message", strings.pressStart);
						this._state = STATE.WAITING_START;
					}
				} else {
					this._transfer.run(bytes);
				}

				break;
			case STATE.PLAYING:
				if (!this._emulator) return;

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
