import React, { PureComponent } from "react";
import PlayScreen from "./gui/PlayScreen";
import querystring from "query-string";
import quickp2p, { SimpleStore } from "./networking/quickp2p";

quickp2p.setStore(new SimpleStore("https://misc.r-labs.io"));

export default class App extends PureComponent {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/join"))
			return <PlayScreen token={this.inviteToken} />;
		else return <PlayScreen />;
	}

	UNSAFE_componentWillMount() {
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
