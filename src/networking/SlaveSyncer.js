import EventEmitter from "eventemitter3";

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;

		this.channel.on("data", (bytes) => {
			if (bytes.byteLength > 3) {
				// TODO: Split in parts
				debugger;
				this.emit("rom", bytes);
				this.channel.send("start");
			}

			if (bytes.byteLength === 2) {
				const remoteButtons = new Uint8Array(bytes)[0];
				const localButtons = new Uint8Array(bytes)[1];
				this._emulator.remoteController.syncAll(remoteButtons);
				this._emulator.localController.syncAll(localButtons);
				this._emulator.frame();

				const buffer = new Uint8Array(1);
				buffer[0] = this._emulator.localController.toByte();
				this.channel.send(buffer);
			}
		});
	}

	sync(frames) {}

	initializeRom(rom) {}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.localController.player = 2;
		emulator.remoteController.player = 1;
	}
}
