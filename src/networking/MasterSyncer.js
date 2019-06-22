import EventEmitter from "eventemitter3";

export default class MasterSyncer extends EventEmitter {
	constructor(channel) {
		super();

		this.channel = channel;
	}

	sync() {}

	initialize(rom) {
		this.channel.send(rom);

		return this;
	}
}
