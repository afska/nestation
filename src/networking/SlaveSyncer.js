import EventEmitter from "eventemitter3";

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;

		this.channel.on("data", (bytes) => {
			if (bytes.byteLength > 1) {
				// TODO: Split in parts
				this.emit("rom", bytes);
			}

			if (bytes.byteLength === 1) {
				const byte = new Uint8Array(bytes)[0];
				this._emulator.frame();
				this._emulator.controller.syncAll(this._emulator.nes, byte);
			}
		});
	}

	sync(emulator, frames) {}

	initializeRom(rom) {}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.controller.player = 1;
	}
}
