import serializer from "./helpers/serializer";
import retry from "./helpers/retry";

const CHANNEL_NAME = "data";
const ANSWER_SUFFIX = "-answer";

export default class WebRTC {
	constructor(config) {
		this.config = config;
	}

	async createConnectionWithOffer() {
		try {
			const connection = this._createConnection();
			const dataChannel = connection.createDataChannel(CHANNEL_NAME);
			this._configureDataChannel(dataChannel);
			const offer = await connection.createOffer();
			await connection.setLocalDescription(offer);
			return { connection, dataChannel };
		} catch (e) {
			throw new Error("Error initializing channel: Cannot create offer");
		}
	}

	async createConnectionWithAnswer(offer) {
		try {
			const connection = this._createConnection();
			await connection.setRemoteDescription(offer);
			const answer = await connection.createAnswer();
			await connection.setLocalDescription(answer);
			return connection;
		} catch (e) {
			throw new Error("Error initializing channel: Cannot create answer");
		}
	}

	async getOffer(channel) {
		try {
			const sessionDescription = await this.store.get(channel.token);
			return serializer.deserialize(sessionDescription, "offer");
		} catch (e) {
			throw new Error("Error joining channel: Cannot read offer data");
		}
	}

	async getAnswer(channel) {
		try {
			const sessionDescription = await this.store.get(
				this._getAnswerToken(channel)
			);
			return serializer.deserialize(sessionDescription, "answer");
		} catch (e) {
			throw new Error("Error joining channel: Cannot read answer data");
		}
	}

	async saveOffer(connection, channel) {
		try {
			const sessionDescription = await this._getSessionDescription(connection);
			await this.store.save(channel.token, sessionDescription);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot write offer data");
		}
	}

	async saveAnswer(connection, channel) {
		try {
			const sessionDescription = await this._getSessionDescription(connection);
			await this.store.save(this._getAnswerToken(channel), sessionDescription);
		} catch (e) {
			throw new Error("Error initializing channel: Cannot write answer data");
		}
	}

	setConnectHandler(connection, dataChannel, channel) {
		this._configureDataChannel(dataChannel);
		dataChannel.buffer = [];

		dataChannel.onmessage = (e) => {
			const data = e.data;
			if (data) dataChannel.buffer.push(data);
		};

		dataChannel.onopen = () => channel.connect(connection, dataChannel);
	}

	setDisconnectHandler(connection, channel) {
		connection.oniceconnectionstatechange = (e) => {
			const state = connection.iceConnectionState;
			const isDisconnected =
				state === "failed" || state === "disconnected" || state === "closed";
			if (channel.isConnected && isDisconnected) channel.disconnect();
		};
	}

	setWaitHandler(connection, channel, onAnswer) {
		retry(channel, "$waitAnswer", async () => {
			const answer = await this.getAnswer(channel);
			await connection.setRemoteDescription(answer);
			onAnswer();
		});
	}

	setUpTimeoutFor(channel) {
		const { timeout } = this.config;
		channel.setUpTimeout(timeout);
	}

	get store() {
		const { store } = this.config;
		if (!store) throw new Error("Store not set, use `.setStore(...)`");

		return store;
	}

	_createConnection() {
		return new RTCPeerConnection({ iceServers: this.config.iceServers });
	}

	_getSessionDescription(connection) {
		return new Promise((resolve) => {
			connection.onicecandidate = (e) => {
				if (e.candidate !== null) return;
				resolve(serializer.serialize(connection.localDescription));
			};
		});
	}

	_getAnswerToken(channel) {
		return channel.token + ANSWER_SUFFIX;
	}

	_configureDataChannel(dataChannel) {
		dataChannel.binaryType = "arraybuffer";
	}
}
