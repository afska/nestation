import EventEmitter from "eventemitter3";

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;

		this.channel.on("data", (bytes) => {
			if (bytes.byteLength === 1) {
				const remoteButtons = new Uint8Array(bytes)[0];
				// TODO: window?
				window.emulator.remoteController.syncAll(remoteButtons);
			}
		});
	}

	sync(emulator, frames) {
		for (let i = 0; i < frames; i++) {
			emulator.frame();
			const buffer = new Uint8Array(2);
			buffer[0] = emulator.localController.toByte();
			buffer[1] = emulator.remoteController.toByte();
			this.channel.send(buffer);
		}
	}

	initializeRom(rom) {
		this.channel.send(rom);
	}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.localController.player = 1;
		emulator.remoteController.player = 2;
	}
}
