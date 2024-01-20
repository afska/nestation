import axios from "axios";

export default class SimpleStore {
	constructor(url) {
		this.api = axios.create({
			baseURL: url,
			headers: { cache: "no-cache" }
		});
	}

	get(key) {
		return this.api.get(`get/${key}`).then(this._adaptResponse);
	}

	save(key, value) {
		const data = encodeURIComponent(value);
		return this.api.get(`set/${key}/${data}`).then(this._adaptResponse);
	}

	_adaptResponse(response) {
		const { data } = response;
		return data.value;
	}
}
