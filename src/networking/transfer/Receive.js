export default class Receive {
	constructor(channel) {
		this.rom = new ArrayBuffer();
		this.channel = channel;

		this._received = 0;
	}

	run(bytes) {
		this.rom = this._appendBuffer(this.rom, bytes);

		this._received += bytes.byteLength;
		this.channel.send("next");
	}

	_appendBuffer(buffer1, buffer2) {
		var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
		tmp.set(new Uint8Array(buffer1), 0);
		tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
		return tmp.buffer;
	}

	get transferred() {
		return this._received;
	}
}
