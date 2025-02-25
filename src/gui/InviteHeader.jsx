import React, { Component } from "react";
import Header from "../widgets/Header";
import { MasterSyncer } from "../networking";
import { Peer } from "peerjs";
import strings from "../locales";

const COPIED_MESSAGE_TIME = 1000;

export default class InviteHeader extends Component {
	state = { token: null, copied: false };

	render() {
		const { needsRom } = this.props;
		const { token, copied } = this.state;

		return (
			<Header>
				{copied ? (
					<span>{strings.copied}</span>
				) : needsRom ? (
					<span>{strings.dragARomHere}</span>
				) : token ? (
					<span>
						{strings.shareThis}{" "}
						<a
							href={`?token=${token}#/join`}
							onClick={this._copyLink}
							tabIndex="-1"
						>
							{strings.link}
						</a>{" "}
						{strings.toPlayWithSomeone}
					</span>
				) : (
					<span>{strings.loading}</span>
				)}
			</Header>
		);
	}

	componentDidUpdate(nextProps) {
		const { needsRom, onSyncer, onError } = this.props;
		if (needsRom || this.peer || this.conn) return;

		const onConnectionError = (error) => {
			this._destroy();
			this.peer = null;
			this.conn = null;
			this.setState({ token: null, copied: false });
			onError(error);
		};

		this.peer = new Peer();
		this.peer
			.on("open", (id) => {
				if (id != null) this.setState({ token: this.peer.id, isDown: false });
			})
			.on("connection", (conn) => {
				if (this.conn && this.conn.open) {
					conn.close();
					return;
				}

				conn.on("close", onConnectionError);
				conn.on("error", onConnectionError);

				conn.on("open", () => {
					this.conn = conn;
					onSyncer(new MasterSyncer(this.conn));
				});
			})
			.on("close", onConnectionError)
			.on("disconnected", onConnectionError)
			.on("error", onConnectionError);
	}

	_destroy = () => {
		this.peer?.destroy?.();
		this.conn?.close?.();
	};

	_copyLink = (e) => {
		e.preventDefault();

		navigator.clipboard.writeText(e.target.href);
		this.setState({ copied: true });
		setTimeout(() => {
			this.setState({ copied: false });
		}, COPIED_MESSAGE_TIME);
	};
}
