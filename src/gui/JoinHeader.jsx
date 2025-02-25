import React, { Component } from "react";
import Header from "../widgets/Header";
import { SlaveSyncer } from "../networking";
import { Peer } from "peerjs";
import strings from "../locales";

export default class JoinHeader extends Component {
	render() {
		return (
			<Header>
				<span>{strings.connecting}</span>
			</Header>
		);
	}

	componentDidMount() {
		const { onSyncer, onError } = this.props;

		this.peer = new Peer();
		this.peer
			.on("open", () => {
				this.conn = this.peer.connect(this.props.token, { reliable: true });
				this.conn
					.on("open", () => {
						onSyncer(new SlaveSyncer(this.conn));
					})
					.on("close", onError)
					.on("error", onError);
			})
			.on("connection", (conn) => {
				conn.close();
			})
			.on("disconnected", onError)
			.on("close", onError)
			.on("error", onError);
	}
}
