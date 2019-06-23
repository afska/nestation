import EventEmitter from "eventemitter3";

const MIN_BUFFER_SIZE = 3;

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.buffer = [];

		this.channel = channel;

		this.channel.on("data", (bytes) => {
			if (bytes.byteLength > 3) {
				// TODO: Receive properly
				this.emit("rom", bytes);
				this.channel.send("start");
			}

			if (bytes.byteLength === 2) {
				this.buffer.push(bytes);

				const buffer = new Uint8Array(1);
				buffer[0] = this._emulator.localController.toByte();
				this.channel.send(buffer);
			}
		});
	}

	sync() {
		if (this.buffer.length < MIN_BUFFER_SIZE) return;

		const bytes = this.buffer.shift();
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
}
