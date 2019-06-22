import EventEmitter from "eventemitter3";

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
	}

	sync(emulator, frames) {
		for (let i = 0; i < frames; i++) {
			emulator.frame();
			const buffer = new Uint8Array(1);
			buffer[0] = emulator.controller.toByte();
			this.channel.send(buffer);
		}
	}

	initializeRom(rom) {
		this.channel.send(rom);
	}

	initializeEmulator(emulator) {
		emulator.controller.player = 1;
	}
}
