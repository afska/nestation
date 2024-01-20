import EventEmitter from "eventemitter3";

export default class BufferedEventEmitter extends EventEmitter {
	constructor() {
		super();

		this._pendingEvents = [];
	}

	emit(event, data) {
		const hasListeners = super.emit(event, data);
		if (!hasListeners) this._pendingEvents.push({ event, data });
		return hasListeners;
	}

	on(event, listener) {
		super.on(event, listener);

		const isPending = (it) => it.event === event;
		this._pendingEvents
			.filter(isPending)
			.forEach(({ event, data }) => listener(data));
		this._pendingEvents = this._pendingEvents.filter((it) => !isPending(it));

		return this;
	}
}
