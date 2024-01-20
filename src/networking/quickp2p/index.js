import WebRTC from "./WebRTC";
import Channel from "./Channel";
import MultiChannel from "./MultiChannel";
import SimpleStore from "./stores/SimpleStore";
import retry from "./helpers/retry";

const CHANNEL2_SUFFIX = "-2";
const config = {
	store: null,
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
	timeout: 10000
};
const webrtc = new WebRTC(config);

export { SimpleStore };

export default {
	async createChannel() {
		const channel1 = await this.createSingleChannel();
		const channel = new MultiChannel(channel1);

		retry(channel, "$waitChannel2", async () => {
			const channel2 = await this.joinSingleChannel(
				channel.token + CHANNEL2_SUFFIX
			);
			channel.connect(channel2);
		});

		return channel;
	},

	async joinChannel(token) {
		const channel1 = await this.joinSingleChannel(token);
		const channel2 = await this.createSingleChannel(token + CHANNEL2_SUFFIX);

		return new MultiChannel(channel1, channel2);
	},

	async createSingleChannel(id) {
		const channel = new Channel(id);

		const {
			connection,
			dataChannel
		} = await webrtc.createConnectionWithOffer();

		webrtc.setConnectHandler(connection, dataChannel, channel);
		webrtc.setDisconnectHandler(connection, channel);
		webrtc.setWaitHandler(connection, channel, () =>
			webrtc.setUpTimeoutFor(channel)
		);

		await webrtc.saveOffer(connection, channel);

		return channel;
	},

	async joinSingleChannel(token) {
		const channel = new Channel(token);

		const offer = await webrtc.getOffer(channel);
		const connection = await webrtc.createConnectionWithAnswer(offer);
		await webrtc.saveAnswer(connection, channel);
		webrtc.setUpTimeoutFor(channel);

		connection.ondatachannel = ({ channel: dataChannel }) => {
			webrtc.setConnectHandler(connection, dataChannel, channel);
		};
		webrtc.setDisconnectHandler(connection, channel);

		return channel;
	},

	setStore(newStore) {
		config.store = newStore;
	},

	setIceServers(newIceServers) {
		config.iceServers = newIceServers;
	},

	setTimeout(newTimeout) {
		config.timeout = newTimeout;
	}
};
