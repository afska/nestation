import EventEmitter from "eventemitter3";

export default class SlaveSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;

		this.channel.on("data", (bytes) => {
			if (bytes.byteLength > 10) {
				// TODO: Split in parts
				this.emit("rom", bytes);
			} else {
				console.log(bytes);
			}
		});
	}

	sync() {}

	initialize(rom) {
		return this;
	}
}
