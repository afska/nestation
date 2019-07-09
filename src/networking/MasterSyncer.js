import EventEmitter from "eventemitter3";
import { Send } from "./transfer";
import config from "../config";
import bus from "../events";
import strings from "../locales";

const STATE = {
	SENDING_ROM: 0,
	PLAYING: 1
};

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
		this._reset();
		this.channel.on("data", (bytes) => this._onData(bytes));
	}

	sync() {
		const { maxBlindFrames } = config.buffering;

		if (this._state !== STATE.PLAYING || this._blindFrames > maxBlindFrames) {
			bus.emit("isLoading", true);
			return;
		}

		bus.emit("isLoading", false);
		this._runFrame();
	}

	initializeRom(rom) {
		this._transfer = new Send(rom, this.channel);
		this._transfer.run();
		this.emit("rom", rom);
	}

	updateRom(rom) {
		this.channel.send("new-rom");
		this._reset();
		this.initializeRom(rom);
	}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.localController.player = 1;
		emulator.remoteController.player = 2;
	}

	onStartPressed() {}

	_start() {
		this._transfer = null;
		this._state = STATE.PLAYING;
		this.emit("start");
		bus.emit("message", null);
		bus.emit("isLoading", false);
	}

	_runFrame() {
		const bytes = this._buffer.shift();
		if (bytes) {
			const remoteButtons = new Uint8Array(bytes)[0];
			this._emulator.remoteController.syncAll(remoteButtons);
			// TODO: What about the pending (already sent) frame inputs?
		}

		const buffer = new Uint8Array(2);
		buffer[0] = this._emulator.localController.toByte();
		buffer[1] = this._emulator.remoteController.toByte();
		this.channel.send(buffer);
		this._blindFrames++;

		this._emulator.frame();
	}

	_onData(bytes) {
		switch (this._state) {
			case STATE.SENDING_ROM:
				if (bytes === "next") {
					const hasEnded = this._transfer.run();
					if (hasEnded) bus.emit("message", strings.waiting);
				} else if (bytes === "start") this._start();

				break;
			case STATE.PLAYING:
				this._buffer.push(bytes);
				this._blindFrames = 0;

				break;
			default:
		}
	}

	_reset() {
		this._state = STATE.SENDING_ROM;
		this._transfer = null;
		this._buffer = [];
		this._blindFrames = 0;

		bus.emit("isLoading", true);
	}
}
