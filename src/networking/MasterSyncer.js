import EventEmitter from "eventemitter3";

const MAX_BLIND_FRAMES = 3;

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.blindFrames = 0;

		this.channel = channel;
		this.channel.on("data", (bytes) => {
			if (bytes === "start") {
				this.emit("start");
				return;
			}

			if (bytes.byteLength === 1) {
				const remoteButtons = new Uint8Array(bytes)[0];
				this._emulator.remoteController.syncAll(remoteButtons);
				this.blindFrames = 0;
			}
		});
	}

	sync() {
		if (this.blindFrames > MAX_BLIND_FRAMES) return;

		this._emulator.frame();
		const buffer = new Uint8Array(2);
		buffer[0] = this._emulator.localController.toByte();
		buffer[1] = this._emulator.remoteController.toByte();
		this.channel.send(buffer);

		this.blindFrames++;
	}

	initializeRom(rom) {
		setTimeout(() => {
			// TODO: Send properly
			this.channel.send(rom);
		}, 1000);

		this.emit("rom", rom);
	}

	initializeEmulator(emulator) {
		this._emulator = emulator;

		emulator.localController.player = 1;
		emulator.remoteController.player = 2;
	}
}
