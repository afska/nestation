const CHUNK_SIZE = 1024;

export default class Send {
	constructor(rom, channel) {
		this.rom = rom;
		this.channel = channel;

		this._sent = 0;
		this._total = rom.byteLength;
	}

	run() {
		if (this._sent === this._total) {
			this.channel.send("end");
			return true;
		}

		const remaining = this._total - this._sent;
		const size = Math.min(CHUNK_SIZE, remaining);
		const chunk = this.rom.slice(this._sent, this._sent + size);

		this._sent += size;
		this.channel.send(chunk);
	}

	get transferred() {
		return this._sent;
	}
}
