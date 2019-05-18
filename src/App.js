import React, { Component } from "react";
import PlayScreen from "./screens/PlayScreen";

export default class App extends Component {
	render() {
		const route = window.location.hash;

		if (route.startsWith("#/create")) return <PlayScreen />;
		if (route.startsWith("#/join")) return <PlayScreen />;

		return <div>Hi</div>;
	}

	componentWillMount() {
		this._listener = window.addEventListener("hashchange", (e) => {
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		window.removeEventListener("hashchange", this._listener);
	}
}
