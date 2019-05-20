import React, { Component } from "react";
import PlayScreen from "./gui/PlayScreen";
import Header from "./widgets/Header";
import querystring from "query-string";
import _ from "lodash";

export default class App extends Component {
	state = { rom: null };

	render() {
		const { rom } = this.state;
		const route = window.location.hash;

		if (route.startsWith("#/create")) return <PlayScreen rom={rom} />;
		if (route.startsWith("#/join"))
			return <PlayScreen token={this.inviteToken} />;

		return (
			<div
				style={{ height: "100vh" }}
				onDragOver={this._ignore}
				onDragEnter={this._ignore}
				onDrop={this._onFileDrop}
			>
				<Header>Drag a NES rom file here!</Header>
			</div>
		);
	}

	componentWillMount() {
		this._listener = window.addEventListener("hashchange", (e) => {
			if (_.isEmpty(window.location.hash)) this.setState({ rom: null });
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		window.removeEventListener("hashchange", this._listener);
	}

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();

		reader.onload = (event) => {
			this.setState({ rom: event.target.result }, () => {
				window.location.hash = "#/create";
			});
		};

		reader.readAsArrayBuffer(file);
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};

	get inviteToken() {
		return querystring.parse(window.location.search).token;
	}
}
