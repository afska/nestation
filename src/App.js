import React, { Component } from "react";
import PlayScreen from "./gui/PlayScreen";
import querystring from "query-string";

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/join"))
			return <PlayScreen token={this.inviteToken} />;
		else return <PlayScreen />;
	}

	componentWillMount() {
		this._listener = window.addEventListener("hashchange", (e) => {
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		window.removeEventListener("hashchange", this._listener);
	}

	get inviteToken() {
		return querystring.parse(window.location.search).token;
	}
}
