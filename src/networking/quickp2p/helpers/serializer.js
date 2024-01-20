export default {
	serialize(description) {
		return btoa(description.sdp);
	},

	deserialize(token, type) {
		return { type, sdp: atob(token) };
	}
};
